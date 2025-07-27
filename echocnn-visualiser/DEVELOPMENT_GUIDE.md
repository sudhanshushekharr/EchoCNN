# 🛠️ Development Guide for EchoCNN Audio Visualizer

## 🚀 **Quick Start**

### **Option 1: Full Setup (Recommended)**
```bash
# Run the complete setup script
./dev-setup.sh

# Start development server
npm run dev
```

### **Option 2: Simple Setup (No TensorFlow)**
```bash
# Run basic setup without TensorFlow dependency
./dev-setup-simple.sh

# Start development server
npm run dev
```

## 🎯 **Development Modes**

### **Development Mode (Local TensorBoard)**
- **Toggle**: Click "Development Mode" button in the app
- **Features**: 
  - Real-time TensorBoard server on `localhost:6006`
  - Live updates during training
  - Full TensorBoard interface
- **Requirements**: TensorBoard server running

### **Production Mode (Static Viewer)**
- **Toggle**: Keep "Development Mode" OFF
- **Features**:
  - Static JSON data from `public/tensorboard_data/`
  - Fast loading, no server dependencies
  - Production-like experience
- **Requirements**: Static data files generated

## 📊 **Available Data Sources**

### **1. Training History (Always Available)**
- **Source**: `training_analysis.json`
- **Features**: Parsed training metrics, charts, analysis
- **Toggle**: "Show/Hide Training History" button

### **2. TensorBoard Dashboard**
- **Development Mode**: Live TensorBoard server
- **Production Mode**: Static viewer with JSON data
- **Toggle**: "Show/Hide TensorBoard Dashboard" button

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. "Cannot read properties of undefined (reading 'length')"**
**Cause**: Static data not loaded or malformed
**Solution**:
```bash
# Regenerate static data
python convert_tensorboard_to_static.py

# Check if files exist
ls -la public/tensorboard_data/

# Verify JSON format
cat public/tensorboard_data/summary.json
```

#### **2. TensorBoard Server Not Starting**
**Cause**: Port conflict or TensorBoard not installed
**Solution**:
```bash
# Kill existing processes
pkill -f tensorboard

# Check if TensorBoard is installed
pip list | grep tensorboard

# Install if missing
pip install tensorboard

# Start manually
tensorboard --logdir=tensorboard_logs --port=6006
```

#### **3. Static Data Not Loading**
**Cause**: Files missing or development server not running
**Solution**:
```bash
# Check if files exist
ls -la public/tensorboard_data/

# Restart development server
npm run dev

# Check browser console for network errors
```

#### **4. Training History Not Showing**
**Cause**: `training_analysis.json` missing
**Solution**:
```bash
# Generate training analysis
python ../parse_tensorboard.py

# Copy to public directory
cp training_analysis.json public/
```

## 🎨 **Development Workflow**

### **Daily Development**
1. **Start Environment**:
   ```bash
   ./dev-setup.sh
   npm run dev
   ```

2. **Choose Mode**:
   - **Development**: Toggle "Development Mode" ON for real-time TensorBoard
   - **Production**: Keep OFF to test static viewer

3. **Test Features**:
   - Upload audio files
   - View feature maps
   - Check training history
   - Test TensorBoard integration

### **Adding New Training Runs**
1. **Add Logs**: Place new TensorBoard logs in `tensorboard_logs/`
2. **Convert Data**: Run `python convert_tensorboard_to_static.py`
3. **Test**: Refresh app and check new runs appear

### **Testing Production Build**
```bash
# Build for production
npm run build

# Test production build
npm start

# Check static data loading
curl http://localhost:3000/tensorboard_data/summary.json
```

## 📁 **File Structure**

```
echocnn-visualiser/
├── public/
│   ├── tensorboard_data/          # Static TensorBoard data
│   │   ├── all_tensorboard_data.json
│   │   ├── summary.json
│   │   └── run_*.json
│   └── training_analysis.json     # Parsed training metrics
├── tensorboard_logs/              # TensorBoard event files
├── src/
│   ├── components/
│   │   ├── StaticTensorBoardViewer.tsx
│   │   ├── TensorBoardEmbed.tsx
│   │   └── TrainingHistory.tsx
│   └── app/page.tsx
├── dev-setup.sh                   # Full development setup
├── dev-setup-simple.sh            # Basic setup (no TensorFlow)
└── convert_tensorboard_to_static.py
```

## 🔍 **Debug Commands**

### **Check TensorBoard Status**
```bash
# Check if TensorBoard is running
curl -s http://localhost:6006 | head -5

# View TensorBoard logs
tail -f tensorboard.log

# Check process
ps aux | grep tensorboard
```

### **Verify Static Data**
```bash
# Check file sizes
du -sh public/tensorboard_data/*

# Validate JSON
python -m json.tool public/tensorboard_data/summary.json

# Test HTTP access
curl http://localhost:3000/tensorboard_data/summary.json
```

### **Monitor Development Server**
```bash
# View Next.js logs
tail -f .next/server.log

# Check for build errors
npm run build

# Clear cache
rm -rf .next
```

## 🚀 **Deployment Preparation**

### **Before Deploying**
1. **Generate Static Data**:
   ```bash
   python convert_tensorboard_to_static.py
   ```

2. **Test Production Mode**:
   - Keep "Development Mode" OFF
   - Verify all features work with static data

3. **Check File Sizes**:
   ```bash
   du -sh public/tensorboard_data/*
   # If files are too large, consider compression
   ```

4. **Build Test**:
   ```bash
   npm run build
   npm start
   ```

## 💡 **Tips & Best Practices**

### **Performance**
- **Large Datasets**: Consider data compression or sampling
- **Memory Usage**: Monitor browser memory with large TensorBoard data
- **Loading Times**: Use lazy loading for large components

### **Development**
- **Hot Reload**: Changes to components auto-refresh
- **Error Boundaries**: Check browser console for errors
- **State Management**: Use React DevTools for debugging

### **Data Management**
- **Backup Logs**: Keep original TensorBoard logs safe
- **Version Control**: Commit static data files
- **Regular Updates**: Regenerate static data after new training runs

---

**Happy Developing! 🎵** 