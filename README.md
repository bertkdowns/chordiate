# Chordiate

Chordiate is a web-based music tool built with React, TypeScript, and Vite. It allows users to play notes and chords using their keyboard, record them, and play them back in a loop. The application is designed to be intuitive and interactive, making it a great tool for musicians and hobbyists alike.

## Features

- **Play Notes and Chords**: Use your keyboard to play individual notes or chords. Switch between chord modes (root, major/minor, major/minor7, diminished) with ease.
- **Record and Quantize**: Record your notes and chords, which are automatically quantized to the nearest 8th note for precise playback.
- **Loop Playback**: Play back your recorded notes in a 4-bar repeating rhythm. Each note's duration is recorded and used during playback.
- **Interactive Note Management**: View your recorded notes on the screen and click on them to remove them from the sequence.
- **Deployable to GitHub Pages**: Easily build and deploy the application to GitHub Pages using the included GitHub Actions workflow.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chordiate
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to use the application.

### Building for Production

Build the application for production:
```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Deploying to GitHub Pages

1. Ensure the repository is connected to GitHub.
2. Push changes to the `main` branch.
3. The GitHub Actions workflow will automatically build and deploy the application to GitHub Pages.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **Vite**: A fast build tool and development server.
- **Tone.js**: A Web Audio framework for creating interactive music applications.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the application.
