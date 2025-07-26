# CNN Audio Visualizer

A powerful web application for visualizing CNN (Convolutional Neural Network) feature maps and predictions for audio classification. Built with Next.js, TypeScript, and Tailwind CSS.

## 🎵 Features

### Core Functionality
- **Audio Classification**: Upload WAV files and get real-time predictions
- **Feature Map Visualization**: Interactive visualization of CNN layer outputs
- **Input Spectrogram**: Display of audio spectrogram data
- **Waveform Display**: Visual representation of audio waveforms

### 🎮 Audio Playback (NEW!)
- **Interactive Audio Player**: Full-featured audio controls with play/pause, seek, and volume
- **Click-to-Seek Waveform**: Click anywhere on the waveform to jump to that time
- **Real-time Synchronization**: Waveform and player stay in sync
- **Audio Information**: Display file format, sample rate, and duration
- **Download Support**: Download the original audio file

### 🔍 Interactive Feature Map Exploration (NEW!)
- **Click-to-Zoom**: Click any feature map to see it in full detail with zoom/pan controls
- **Hover Tooltips**: See exact pixel values when hovering over feature maps
- **Layer Comparison**: Side-by-side view of different layers with synchronized navigation
- **Value Range Display**: Show min/max values and statistics for each feature map
- **Export Individual Maps**: Save specific feature maps as high-quality PNG images

### 🎯 Interactive Features
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live updates during audio playback
- **Visual Feedback**: Hover effects and position indicators
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd echocnn-visualiser

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage
1. **Upload Audio**: Click "Choose File" and select a WAV file
2. **View Predictions**: See the model's top predictions with confidence scores
3. **Explore Feature Maps**: Examine CNN layer outputs and activations
4. **Play Audio**: Use the audio player to listen and analyze
5. **Interactive Analysis**: Click on the waveform to jump to specific times
6. **Detailed Feature Maps**: Click any feature map to zoom and explore in detail
7. **Compare Layers**: Use the "Compare Layers" button to view multiple layers side-by-side
8. **Export Visualizations**: Save feature maps as high-quality images

## 🛠 Technical Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Audio**: HTML5 Audio API, Web Audio API
- **Visualization**: SVG-based custom components
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application page
├── components/
│   ├── AudioPlayer.tsx     # Audio playback controls
│   ├── FeatureMap.tsx      # CNN feature map visualization
│   ├── Waveform.tsx        # Interactive waveform display
│   ├── ColorScale.tsx      # Color scale for visualizations
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── colors.ts           # Color mapping utilities
│   └── utils.ts            # General utilities
└── styles/
    └── globals.css         # Global styles
```

## 🎨 Audio Playback Feature

The new audio playback feature provides a complete audio analysis experience:

### Key Components
- **AudioPlayer**: Full-featured audio controls
- **Interactive Waveform**: Click-to-seek functionality
- **Synchronized State**: Real-time updates between components

### Features
- Play/pause controls
- Seek bar with drag functionality
- Volume control with mute toggle
- Skip forward/backward (10 seconds)
- Download original audio file
- Real-time position indicator on waveform
- Click-to-seek on waveform

For detailed documentation, see [AUDIO_PLAYBACK_FEATURE.md](./AUDIO_PLAYBACK_FEATURE.md)

## 🔍 Interactive Feature Map Exploration Feature

The interactive feature map exploration feature provides detailed analysis tools for examining CNN layer outputs:

### Key Components
- **FeatureMapModal**: Detailed zoom/pan view with canvas rendering
- **LayerComparison**: Side-by-side comparison of multiple layers
- **Enhanced FeatureMap**: Hover tooltips and click-to-zoom functionality

### Features
- Click-to-zoom with zoom controls (50% to 500%)
- Pan navigation with drag functionality
- Hover tooltips showing exact pixel values
- Layer comparison with synchronized navigation
- Value range display and statistical information
- Export feature maps as high-quality PNG images
- Cross-layer pixel value comparison

For detailed documentation, see [INTERACTIVE_FEATURE_MAPS.md](./INTERACTIVE_FEATURE_MAPS.md)

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

### Adding New Features
1. Create components in `src/components/`
2. Add types to component interfaces
3. Update main page in `src/app/page.tsx`
4. Add documentation for new features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with the [T3 Stack](https://create.t3.gg/)
- Audio processing powered by HTML5 Audio API
- Icons from [Lucide React](https://lucide.dev/)

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
