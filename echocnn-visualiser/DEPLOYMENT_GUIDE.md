# 🚀 Deployment Guide for EchoCNN Audio Visualizer

## Overview

This guide explains how to deploy your EchoCNN Audio Visualizer to Vercel with TensorBoard data integration.

## 🎯 **The Problem with TensorBoard in Production**

When deploying to Vercel, you face these challenges:
- ❌ **No persistent file system** - TensorBoard logs can't be stored
- ❌ **No localhost access** - `localhost:6006` won't work in production
- ❌ **Serverless architecture** - Can't run TensorBoard server
- ❌ **Static hosting** - No backend to serve dynamic TensorBoard data

## ✅ **Solution: Static TensorBoard Data**

We convert TensorBoard logs to static JSON files that get deployed with your app.

## 📋 **Deployment Steps**

### **Step 1: Convert TensorBoard Data**

Before deploying, convert your TensorBoard logs to static JSON:

```bash
# Run the conversion script
python convert_tensorboard_to_static.py
```

This creates:
```
public/tensorboard_data/
├── all_tensorboard_data.json    # Complete dataset
├── summary.json                 # Overview metadata
└── run_*.json                   # Individual run data
```

### **Step 2: Verify Static Data**

Check that the conversion worked:

```bash
# Check the generated files
ls -la public/tensorboard_data/

# Verify JSON structure
cat public/tensorboard_data/summary.json
```

### **Step 3: Deploy to Vercel**

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

## 🔧 **Configuration**

### **Vercel Configuration**

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/tensorboard_data/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **Environment Variables**

Create `.env.local` for local development:

```env
# No special environment variables needed for TensorBoard data
# All data is static and served from public/ directory
```

## 📊 **Features Available in Production**

### ✅ **What Works in Production**
- **Static TensorBoard Viewer** - All your training metrics
- **Interactive Charts** - Loss, accuracy, learning rate curves
- **Run Selection** - Choose between different training runs
- **Metric Analysis** - Min, max, mean, trend analysis
- **Data Export** - Download CSV files
- **Responsive Design** - Works on all devices

### ❌ **What Doesn't Work in Production**
- **Live TensorBoard Server** - No `localhost:6006` access
- **Real-time Updates** - Data is static (from your last conversion)
- **Dynamic Log Loading** - Can't load new logs after deployment

## 🔄 **Updating TensorBoard Data**

When you have new training runs:

### **Option 1: Redeploy with New Data**
```bash
# 1. Convert new TensorBoard logs
python convert_tensorboard_to_static.py

# 2. Commit and push changes
git add public/tensorboard_data/
git commit -m "Update TensorBoard data"
git push

# 3. Deploy to Vercel
vercel --prod
```

### **Option 2: Automated Updates**
Set up GitHub Actions to automatically convert and deploy:

```yaml
# .github/workflows/update-tensorboard.yml
name: Update TensorBoard Data
on:
  push:
    paths:
      - 'tensorboard_logs/**'

jobs:
  convert-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install tensorflow
      - run: python convert_tensorboard_to_static.py
      - run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

## 🎨 **Customization Options**

### **Add More Metrics**
Edit `convert_tensorboard_to_static.py` to include additional metrics:

```python
# Add custom metrics
if tag.startswith("Custom/"):
    # Handle custom metrics
    pass
```

### **Custom Chart Types**
Extend `StaticTensorBoardViewer.tsx` with new visualizations:

```typescript
// Add new chart types
const renderCustomChart = (data) => {
  // Your custom chart implementation
};
```

### **Multiple Model Comparison**
Modify the viewer to compare multiple models:

```typescript
// Add model comparison functionality
const [selectedModels, setSelectedModels] = useState([]);
```

## 📈 **Performance Optimization**

### **Data Size Management**
- **Compress JSON**: Use gzip compression
- **Lazy Loading**: Load individual run data on demand
- **Caching**: Leverage Vercel's CDN caching

### **Bundle Size**
- **Code Splitting**: Load TensorBoard viewer only when needed
- **Tree Shaking**: Remove unused dependencies
- **Image Optimization**: Use Next.js image optimization

## 🔍 **Troubleshooting**

### **Common Issues**

#### **1. TensorBoard Data Not Loading**
```bash
# Check if files exist
ls -la public/tensorboard_data/

# Verify JSON format
python -m json.tool public/tensorboard_data/summary.json
```

#### **2. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **3. Deployment Failures**
```bash
# Check Vercel logs
vercel logs

# Test build locally
npm run build
```

### **Debug Commands**

```bash
# Test TensorBoard conversion
python convert_tensorboard_to_static.py --debug

# Validate JSON structure
python -c "import json; json.load(open('public/tensorboard_data/all_tensorboard_data.json'))"

# Check file sizes
du -sh public/tensorboard_data/*
```

## 🚀 **Advanced Features**

### **Real-time Updates (Future)**
For truly real-time updates, consider:

1. **WebSocket Integration** - Connect to a separate TensorBoard server
2. **API Routes** - Create Next.js API routes to serve dynamic data
3. **External Services** - Use services like Weights & Biases or MLflow

### **Multi-User Support**
- **User Authentication** - Add login system
- **Shared Dashboards** - Allow users to share training results
- **Collaborative Analysis** - Real-time collaboration features

## 📞 **Support**

If you encounter issues:

1. **Check the logs**: `vercel logs`
2. **Verify data conversion**: Run the conversion script locally
3. **Test locally**: `npm run dev` and test TensorBoard viewer
4. **Check file permissions**: Ensure JSON files are readable

---

**Your TensorBoard data will be fully accessible in production! 🎉** 