
# 🎵 EchoCNN Audio Visualizer

A powerful, interactive web application for visualizing and analyzing audio through Convolutional Neural Networks (CNNs). Explore how your CNN model processes audio signals with real-time feature map visualization, audio playback, and detailed layer analysis.

![EchoCNN Audio Visualizer](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.0-red?style=for-the-badge&logo=react)

## ✨ Features

### 🎧 Audio Playback & Timeline Control
- **Synchronized Audio-Visual Experience**: Play your uploaded audio while exploring feature maps
- **Interactive Timeline**: Click on the waveform to jump to specific time points
- **Real-time Progress Tracking**: Visual indicator shows current playback position
- **Audio Controls**: Play, pause, volume control, and download functionality

### 🔍 Interactive Feature Map Exploration
- **Click-to-Zoom**: Click any feature map to view it in full detail with zoom and pan
- **Hover Tooltips**: See exact pixel values when hovering over feature maps
- **Layer Comparison**: Side-by-side view of different CNN layers
- **Value Range Display**: Min/max values for each feature map with explanations
- **Export Individual Maps**: Save specific feature maps as high-quality PNG images

### 📊 Comprehensive Analysis
- **Input Spectrogram Visualization**: See how your audio is processed into spectrograms
- **Layer-by-Layer Analysis**: Explore each convolutional layer's output
- **Prediction Confidence**: View model predictions with confidence scores
- **Statistical Insights**: Mean, standard deviation, and range for each feature map

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Intuitive Interface**: Clean, modern design with clear navigation
- **Context-Aware Help**: Tooltips and explanations for technical concepts
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/echocnn-visualiser.git
   cd echocnn-visualiser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Upload Audio**: Click "Choose File" and select a WAV file
2. **View Predictions**: See the model's top predictions with confidence scores
3. **Explore Feature Maps**: Click on any feature map to zoom in
4. **Compare Layers**: Use the "Compare Layers" button for side-by-side analysis
5. **Export Results**: Save individual feature maps as images

## 🏗️ Project Structure

```
echocnn-visualiser/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout component
│   │   └── page.tsx            # Main application page
│   ├── components/
│   │   ├── AudioPlayer.tsx     # Audio playback component
│   │   ├── FeatureMap.tsx      # Individual feature map display
│   │   ├── FeatureMapModal.tsx # Detailed feature map view
│   │   ├── LayerComparison.tsx # Side-by-side layer comparison
│   │   ├── Waveform.tsx        # Audio waveform visualization
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── colors.ts           # Color mapping utilities
│   │   └── utils.ts            # General utilities
│   └── styles/
│       └── globals.css         # Global styles
├── public/                     # Static assets
├── docs/                       # Feature documentation
└── README.md                   # This file
```

## 🎯 Key Components

### AudioPlayer
- HTML5 audio element with custom controls
- Synchronized timeline with waveform
- Volume control and download functionality

### FeatureMap
- Interactive SVG-based visualization
- Hover tooltips with pixel values
- Click-to-zoom functionality
- Min/max value display with explanations

### FeatureMapModal
- Full-screen detailed view
- Zoom and pan controls
- Export functionality
- Statistical information

### LayerComparison
- Grid layout for multiple layers
- Synchronized zoom and pan
- Cross-layer hover tooltips
- Batch export capabilities

## 🔧 Technical Details

### Built With
- **Next.js 15.4.4** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icons
- **HTML5 Canvas API** - High-performance rendering

### Key Technologies
- **SVG Rendering** - For feature map visualization
- **Canvas API** - For high-performance modal rendering
- **HTML5 Audio API** - For audio playback
- **Blob URLs** - For audio file handling

## 📚 Documentation

- [Audio Playback Feature](./AUDIO_PLAYBACK_FEATURE.md) - Detailed guide for audio functionality
- [Interactive Feature Maps](./INTERACTIVE_FEATURE_MAPS.md) - Complete feature map exploration guide

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Icons from [Lucide](https://lucide.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

If you have any questions or need help:
- Open an [issue](https://github.com/yourusername/echocnn-visualiser/issues)
- Check the [documentation](./docs/)
- Join our [Discussions](https://github.com/yourusername/echocnn-visualiser/discussions)

---

**Made with ❤️ for the audio ML community**
