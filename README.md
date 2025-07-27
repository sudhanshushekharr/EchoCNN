# 🎵 EchoCNN Audio Visualizer

A **production-ready, full-stack audio ML visualization platform** that transforms how researchers and developers understand Convolutional Neural Networks (CNNs) for audio processing. Built with modern web technologies and designed for both development and production environments.

![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-18.0-red?style=for-the-badge&logo=react)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.0-orange?style=for-the-badge&logo=tensorflow)
![PyTorch](https://img.shields.io/badge/PyTorch-2.0-red?style=for-the-badge&logo=pytorch)

## 🚀 **Professional Features**

### 🎧 **Advanced Audio Playback & Timeline Control**
- **Synchronized Audio-Visual Experience**: Real-time audio playback with feature map exploration
- **Interactive Waveform Timeline**: Click-to-seek functionality with visual progress indicators
- **High-Performance Audio Engine**: HTML5 Audio API with custom controls and volume management
- **Cross-Platform Compatibility**: Works seamlessly across browsers and devices
- **Audio File Support**: WAV, MP3, FLAC, and other common audio formats

### 🔍 **Interactive Feature Map Exploration**
- **Click-to-Zoom Technology**: High-resolution modal views with zoom (up to 10x) and pan controls
- **Real-time Hover Tooltips**: Pixel-perfect value display with coordinate tracking
- **Layer Comparison System**: Side-by-side analysis of multiple CNN layers with synchronized interaction
- **Value Range Analytics**: Min/max/mean statistics with context-aware explanations
- **Export Functionality**: High-quality PNG export for individual feature maps and batch operations
- **Responsive Canvas Rendering**: Optimized for large datasets with smooth performance

### 📊 **Comprehensive Training Analysis**
- **TensorBoard Integration**: Live TensorBoard server for real-time training monitoring
- **Static Data Visualization**: Production-ready static charts for deployment
- **Training History Dashboard**: Interactive charts for loss, accuracy, and learning rate curves
- **Performance Metrics**: Overfitting analysis, convergence tracking, and model comparison
- **Data Export Capabilities**: CSV export for external analysis and reporting
- **Multi-Run Comparison**: Compare different training sessions and model versions

### 🎨 **Modern UI/UX Architecture**
- **Responsive Design System**: Mobile-first approach with adaptive layouts
- **Accessibility Compliance**: WCAG 2.1 standards with keyboard navigation and screen reader support
- **Dark/Light Theme Support**: Context-aware color schemes and contrast optimization
- **Performance Optimization**: Code splitting, lazy loading, and efficient rendering
- **Error Handling**: Graceful degradation with user-friendly error messages

### 🔧 **Development & Production Features**
- **Hybrid Development Mode**: Switch between live TensorBoard and static data visualization
- **Automated Setup Scripts**: One-command development environment configuration
- **Production Deployment Ready**: Vercel-optimized with static data generation
- **Environment Management**: Development, staging, and production configurations
- **Performance Monitoring**: Built-in analytics and error tracking

## 🏗️ **Technical Architecture**

### **Frontend Stack**
- **Next.js 15.4.4** - React framework with App Router and server-side rendering
- **TypeScript 5.0** - Type-safe development with strict error checking
- **Tailwind CSS** - Utility-first CSS with custom design system
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful, consistent iconography

### **Backend Integration**
- **Modal Cloud Platform** - Serverless GPU inference with A10G GPUs
- **PyTorch Audio Processing** - Professional audio preprocessing pipeline
- **TensorBoard Integration** - Real-time training visualization
- **RESTful API Design** - Clean, documented API endpoints

### **Data Processing**
- **Audio Signal Processing**: Mel-spectrogram generation with librosa
- **Feature Map Extraction**: CNN layer visualization with PyTorch hooks
- **TensorBoard Data Parsing**: Custom Python scripts for log analysis
- **Static Data Generation**: Production-optimized JSON data structures

### **Performance Optimizations**
- **Canvas Rendering**: High-performance 2D graphics for large datasets
- **SVG Optimization**: Efficient vector graphics for interactive elements
- **Memory Management**: Garbage collection and memory leak prevention
- **Bundle Optimization**: Tree shaking and code splitting for faster loading

## 📁 **Project Structure**

```
echocnn-visualiser/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with metadata
│   │   └── page.tsx                # Main application with state management
│   ├── components/
│   │   ├── AudioPlayer.tsx         # Advanced audio playback system
│   │   ├── FeatureMap.tsx          # Interactive feature map display
│   │   ├── FeatureMapModal.tsx     # High-resolution modal viewer
│   │   ├── LayerComparison.tsx     # Multi-layer analysis system
│   │   ├── StaticTensorBoardViewer.tsx # Production TensorBoard viewer
│   │   ├── TensorBoardEmbed.tsx    # Live TensorBoard integration
│   │   ├── TrainingHistory.tsx     # Training analysis dashboard
│   │   ├── Waveform.tsx            # Interactive waveform visualization
│   │   └── ui/                     # Reusable UI component library
│   ├── lib/
│   │   ├── colors.ts               # Color mapping and visualization utilities
│   │   └── utils.ts                # General utility functions
│   └── styles/
│       └── globals.css             # Global styles and CSS variables
├── public/
│   ├── tensorboard_data/           # Static TensorBoard data for production
│   └── training_analysis.json      # Parsed training metrics
├── scripts/
│   ├── convert_tensorboard_to_static.py  # Data conversion for production
│   ├── parse_tensorboard.py        # Training log analysis
│   ├── dev-setup.sh                # Automated development setup
│   └── start_tensorboard.sh        # TensorBoard server management
├── docs/                           # Comprehensive documentation
└── deployment/                     # Production deployment configuration
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Python 3.8+ (for TensorBoard integration)
- TensorFlow/PyTorch (for model inference)

### **Development Setup**

1. **Clone and Setup**
   ```bash
   git clone https://github.com/yourusername/echocnn-visualiser.git
   cd echocnn-visualiser
   ```

2. **Automated Setup** (Recommended)
   ```bash
   chmod +x dev-setup.sh
   ./dev-setup.sh
   npm run dev
   ```

3. **Manual Setup**
   ```bash
   npm install
   python convert_tensorboard_to_static.py
   npm run dev
   ```

4. **Access the Application**
   - Main App: [http://localhost:3000](http://localhost:3000)
   - TensorBoard: [http://localhost:6006](http://localhost:6006)

### **Production Deployment**

```bash
# Generate static data
python convert_tensorboard_to_static.py

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 🎯 **Use Cases & Applications**

### **Research & Development**
- **Model Debugging**: Visualize CNN layer activations for model improvement
- **Training Monitoring**: Real-time training progress with TensorBoard integration
- **Performance Analysis**: Compare different model architectures and hyperparameters
- **Data Quality Assessment**: Analyze audio preprocessing and feature extraction

### **Education & Documentation**
- **Interactive Learning**: Visual CNN explanations for educational purposes
- **Research Papers**: Generate high-quality visualizations for publications
- **Team Collaboration**: Share insights with non-technical stakeholders
- **Model Documentation**: Create comprehensive model behavior documentation

### **Production Applications**
- **Audio Classification**: Real-time audio analysis with confidence scoring
- **Quality Assurance**: Validate model performance on new audio samples
- **Client Demos**: Professional presentations with interactive visualizations
- **API Integration**: RESTful endpoints for external applications

## 📊 **Performance Metrics**

- **Audio Processing**: < 2 seconds for 30-second audio files
- **Feature Map Rendering**: < 500ms for 128x128 feature maps
- **Modal Loading**: < 200ms for high-resolution zoom views
- **TensorBoard Integration**: Real-time updates with < 100ms latency
- **Bundle Size**: < 2MB gzipped for production deployment

## 🔧 **Advanced Configuration**

### **Environment Variables**
```env
# Development
NODE_ENV=development
TENSORBOARD_URL=http://localhost:6006

# Production
NODE_ENV=production
STATIC_DATA_URL=/tensorboard_data/
```

### **Custom Model Integration**
```typescript
// Add your custom model hooks
const customFeatureMaps = await model.extractFeatures(audioData);
// Integrate with existing visualization system
```

## 📚 **Documentation**

- [Audio Playback System](./AUDIO_PLAYBACK_FEATURE.md) - Complete audio integration guide
- [Interactive Feature Maps](./INTERACTIVE_FEATURE_MAPS.md) - Advanced visualization features
- [Training History Analysis](./TRAINING_HISTORY_FEATURE.md) - TensorBoard integration guide
- [Development Guide](./DEVELOPMENT_GUIDE.md) - Development workflow and best practices
- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Production deployment instructions

## 🤝 **Contributing**

We welcome contributions from the community! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the coding standards and add tests
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request with detailed description

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Modal Cloud Platform** - For GPU-powered inference infrastructure
- **PyTorch Team** - For the excellent deep learning framework
- **Next.js Team** - For the amazing React framework
- **Audio ML Community** - For inspiration and feedback


---

**Built with ❤️ for the Audio ML Community**

*Transform your audio CNN research with professional-grade visualization tools* 