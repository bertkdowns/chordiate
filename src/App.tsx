import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import './App.css';

function App() {
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  let part = null; // Declare part outside to manage its lifecycle

  const playNotes = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    part = new Tone.Part((time, value) => {
      synth.triggerAttackRelease(value.notes, value.duration, time);
    }, recordedNotes.map((note, index) => ({ ...note, time: index }))).start(0);

    part.loop = true;
    part.loopEnd = `${recordedNotes.length}m`; // Loop after all notes are played
    Tone.Transport.start();
    setIsPlaying(true);
  };

  const stopPlayback = () => {
    if (part) {
      part.stop();
      part.dispose();
      part = null;
    }
    Tone.Transport.stop();
    Tone.Transport.cancel();
    setIsPlaying(false);
  };

  useEffect(() => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const pressedKeys = new Set();

    const keyToNote = {
      a: 'C4',
      s: 'D4',
      d: 'E4',
      f: 'F4',
      g: 'G4',
      h: 'A4',
      j: 'B4',
      k: 'C5',
      l: 'D5',
    };

    const chordModes = {
      q: 'root',
      w: 'majorMinor',
      e: 'majorMinor7',
      r: 'diminished',
    };

    let currentChordMode = 'root';

    const scale = {
      C: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
      A: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      // Add other scales as needed
    };

    const isMinor = (note) => {
      // Example logic: check if the note is in a minor scale (e.g., A minor)
      return scale.A.includes(note) && !scale.C.includes(note);
    };

    const chords = {
      root: (note) => [note],
      majorMinor: (note) => {
        const third = isMinor(note) ? 3 : 4;
        return [
          note,
          Tone.Frequency(note).transpose(third).toNote(),
          Tone.Frequency(note).transpose(7).toNote(),
        ];
      },
      majorMinor7: (note) => {
        const third = isMinor(note) ? 3 : 4;
        const seventh = isMinor(note) ? 10 : 11;
        return [
          note,
          Tone.Frequency(note).transpose(third).toNote(),
          Tone.Frequency(note).transpose(7).toNote(),
          Tone.Frequency(note).transpose(seventh).toNote(),
        ];
      },
      diminished: (note) => [
        note,
        Tone.Frequency(note).transpose(3).toNote(),
        Tone.Frequency(note).transpose(6).toNote(),
      ],
    };

    const handleChordModeChange = (event) => {
      if (chordModes[event.key]) {
        currentChordMode = chordModes[event.key];
      }
    };

    const handleKeyDown = (event) => {
      const note = keyToNote[event.key];
      if (note && !pressedKeys.has(event.key)) {
        const chordNotes = chords[currentChordMode](note);
        const startTime = Tone.Transport.seconds;
        synth.triggerAttack(chordNotes, Tone.now());
        pressedKeys.add(event.key);

        // Record the start time of the note
        setRecordedNotes((prev) => [...prev, { startTime, notes: chordNotes }]);
      }
    };

    const handleKeyUp = (event) => {
      const note = keyToNote[event.key];
      if (note) {
        const chordNotes = chords[currentChordMode](note);
        const endTime = Tone.Transport.seconds;
        synth.triggerRelease(chordNotes, Tone.now());
        pressedKeys.delete(event.key);

        // Update the duration of the note
        setRecordedNotes((prev) => {
          const updatedNotes = [...prev];
          const lastNote = updatedNotes[updatedNotes.length - 1];
          if (lastNote && lastNote.notes === chordNotes) {
            lastNote.duration = endTime - lastNote.startTime;
          }
          return updatedNotes;
        });
      }
    };

    window.addEventListener('keydown', handleChordModeChange);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleChordModeChange);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [recordedNotes]);

  const removeNote = (index) => {
    setRecordedNotes((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Play Notes with Your Keyboard</h1>
      <p className="text-lg">Press keys <strong>a</strong>, <strong>s</strong>, <strong>d</strong>, <strong>f</strong>, <strong>g</strong>, <strong>h</strong>, <strong>j</strong>, <strong>k</strong>, <strong>l</strong> to play notes.</p>
      <p className="text-lg">Press keys <strong>q</strong>, <strong>w</strong>, <strong>e</strong>, <strong>r</strong> to switch between chord modes.</p>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded mr-2"
          onClick={() => isPlaying ? stopPlayback() : playNotes()}
        >
          {isPlaying ? 'Stop Playback' : 'Start Playback'}
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold">Recorded Notes</h2>
        <div className="grid grid-cols-8 gap-2 mt-2">
          {recordedNotes.map((note, index) => (
            <div
              key={index}
              className="p-2 bg-blue-200 rounded cursor-pointer"
              onClick={() => removeNote(index)}
            >
              {note.notes.join(', ')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
