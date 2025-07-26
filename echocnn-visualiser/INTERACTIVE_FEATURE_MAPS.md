# Interactive Feature Map Exploration Feature

## 🎯 Overview

The Interactive Feature Map Exploration feature enhances the CNN Audio Visualizer by providing detailed analysis tools for examining CNN layer outputs. Users can now zoom, pan, compare, and export feature maps with pixel-level precision.

## ✨ Features

### 🔍 Click-to-Zoom Feature Maps
- **Detailed Modal View**: Click any feature map to open a full-screen modal
- **Zoom Controls**: Zoom in/out from 50% to 500% with mouse wheel or buttons
- **Pan Navigation**: Drag to move around the zoomed feature map
- **Canvas Rendering**: High-performance canvas-based rendering for smooth interaction
- **Reset View**: One-click reset to original view

### 🎯 Hover Tooltips
- **Pixel Values**: See exact numerical values when hovering over pixels
- **Position Information**: Display pixel coordinates (x, y)
- **Real-time Updates**: Tooltips update as you move the mouse
- **Cross-layer Comparison**: Compare pixel values across multiple layers simultaneously

### 📊 Value Range Display
- **Min/Max Values**: Display minimum and maximum values for each feature map
- **Statistical Information**: Show mean, standard deviation, and range
- **Toggle Statistics**: Expandable detailed statistics panel
- **Visual Badges**: Clean badge display for quick value reference

### 🔄 Layer Comparison
- **Side-by-Side View**: Compare multiple layers in a grid layout
- **Synchronized Navigation**: Zoom and pan all layers together
- **Cross-layer Tooltips**: Hover to see values across all layers at the same position
- **Grid Layout**: Automatic grid arrangement based on number of layers
- **Layer Statistics**: Comprehensive statistics for all layers

### 📤 Export Individual Maps
- **PNG Export**: Save any feature map as a high-quality PNG image
- **Batch Export**: Export all layers at once from comparison view
- **Custom Naming**: Automatic file naming based on layer names
- **Canvas Quality**: Export at full resolution regardless of display size

## 🚀 Usage Guide

### Basic Feature Map Interaction

1. **Hover for Values**: Move your mouse over any feature map to see pixel values
2. **Click to Zoom**: Click on any feature map to open the detailed modal view
3. **View Statistics**: Click the "Stats" button to see detailed statistics
4. **Export Images**: Use the export button in the modal to save the feature map

### Detailed Modal Navigation

1. **Open Modal**: Click any feature map or the zoom button
2. **Zoom Controls**: 
   - Use mouse wheel to zoom in/out
   - Click zoom in/out buttons for precise control
   - View current zoom level in the badge
3. **Pan Navigation**: Click and drag to move around the zoomed view
4. **Reset View**: Click the reset button to return to original view
5. **Export**: Click export to save the feature map as PNG

### Layer Comparison

1. **Open Comparison**: Click "Compare Layers" button in the main view
2. **Grid Layout**: Layers are automatically arranged in a grid
3. **Synchronized Navigation**: Zoom and pan affect all layers simultaneously
4. **Cross-layer Analysis**: Hover to see values across all layers at the same position
5. **Statistics Panel**: View comprehensive statistics for all layers
6. **Batch Export**: Export all layers at once

### Advanced Features

- **Keyboard Shortcuts**: Use mouse wheel for zoom, drag for pan
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Optimized**: Canvas rendering for smooth interaction
- **Accessibility**: Proper focus management and keyboard navigation

## 🛠 Technical Implementation

### Components

#### FeatureMapModal (`src/components/FeatureMapModal.tsx`)
```typescript
interface FeatureMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: number[][];
  title: string;
  layerName?: string;
}
```

**Key Features:**
- Canvas-based rendering for performance
- Zoom and pan functionality
- Real-time pixel value tooltips
- Statistical analysis display
- Export functionality

#### LayerComparison (`src/components/LayerComparison.tsx`)
```typescript
interface LayerComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerData[];
}
```

**Key Features:**
- Grid layout for multiple layers
- Synchronized zoom and pan
- Cross-layer pixel value comparison
- Batch export functionality
- Comprehensive statistics

#### Enhanced FeatureMap (`src/components/FeatureMap.tsx`)
```typescript
interface FeatureMapProps {
  data: number[][];
  title: string;
  internal?: boolean;
  spectrogram?: boolean;
  layerName?: string;
  onOpenModal?: (data: number[][], title: string, layerName?: string) => void;
}
```

**Key Features:**
- Hover tooltips for pixel values
- Click-to-zoom functionality
- Value range display
- Statistical information
- Export integration

### State Management

The main page manages modal states:

```typescript
const [selectedFeatureMap, setSelectedFeatureMap] = useState<{
  data: number[][];
  title: string;
  layerName?: string;
} | null>(null);
const [showLayerComparison, setShowLayerComparison] = useState(false);
```

### Canvas Rendering

Feature maps are rendered using HTML5 Canvas for:
- **Performance**: Smooth zoom and pan operations
- **Quality**: High-resolution rendering
- **Export**: Direct canvas-to-image conversion
- **Interaction**: Precise pixel-level interaction

### Zoom and Pan Implementation

```typescript
// Zoom handling
const handleZoom = (delta: number) => {
  const newZoom = Math.max(0.5, Math.min(5, zoom + delta));
  setZoom(newZoom);
};

// Pan handling
const handleMouseMove = (e: React.MouseEvent) => {
  if (isDragging) {
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }
};
```

## 🎨 UI/UX Design

### Design Principles
- **Intuitive Navigation**: Familiar zoom and pan controls
- **Visual Feedback**: Hover states, transitions, and position indicators
- **Accessibility**: Keyboard navigation and screen reader support
- **Responsive**: Works across different screen sizes

### Color Scheme
- **Primary**: Stone colors for consistency
- **Interactive**: Hover states with subtle color changes
- **Tooltips**: Dark overlay with white text for readability
- **Statistics**: Clean badge design for value display

### Layout
- **Modal Design**: Full-screen modals with clear hierarchy
- **Grid Layout**: Automatic arrangement for layer comparison
- **Control Placement**: Logical grouping of related controls
- **Information Display**: Layered information architecture

## 🔧 Dependencies

### Required Packages
```json
{
  "lucide-react": "^0.525.0"
}
```

### Browser Support
- **Canvas API**: For high-performance rendering
- **CSS Grid**: For responsive layout
- **CSS Transforms**: For zoom and pan operations
- **File API**: For image export functionality

## 🐛 Troubleshooting

### Common Issues

#### Canvas Not Rendering
- **Check Data**: Ensure feature map data is valid
- **Browser Support**: Verify Canvas API support
- **Memory**: Large feature maps may require more memory

#### Zoom/Pan Not Working
- **Event Handling**: Check for conflicting event listeners
- **CSS Issues**: Ensure transforms are not being overridden
- **Performance**: Very large feature maps may be slow

#### Export Not Working
- **File Permissions**: Check browser download permissions
- **Canvas Size**: Very large canvases may cause memory issues
- **Format Support**: PNG format is widely supported

### Performance Optimization
- **Canvas Size**: Limit maximum canvas dimensions
- **Zoom Levels**: Cap zoom levels to prevent memory issues
- **Event Throttling**: Throttle mouse events for smooth interaction
- **Memory Management**: Clean up canvas references

## 🔮 Future Enhancements

### Planned Features
1. **3D Visualization**: 3D rendering of feature maps
2. **Animation**: Animated transitions between layers
3. **Advanced Export**: Multiple format support (JPEG, SVG)
4. **Custom Color Schemes**: User-selectable color palettes
5. **Measurement Tools**: Distance and area measurement
6. **Annotation**: Add notes and annotations to feature maps

### Technical Improvements
1. **WebGL Rendering**: GPU-accelerated rendering for large maps
2. **Progressive Loading**: Load feature maps progressively
3. **Caching**: Cache rendered canvases for better performance
4. **Offline Support**: Service worker for offline functionality

## 📝 API Reference

### FeatureMapModal Methods

#### `handleZoom(delta: number)`
Adjusts zoom level by the specified delta.
- `delta`: Zoom change amount (positive for zoom in, negative for zoom out)

#### `handleMouseMove(e: React.MouseEvent)`
Handles mouse movement for panning and pixel hover.
- `e`: Mouse event with position information

#### `exportImage()`
Exports the current feature map as a PNG image.

### LayerComparison Methods

#### `handleZoom(delta: number)`
Synchronized zoom for all layers.

#### `handleMouseMove(e: React.MouseEvent)`
Cross-layer pixel value comparison.

#### `exportAllImages()`
Exports all layers as separate PNG files.

### FeatureMap Methods

#### `handleMouseMove(e: React.MouseEvent)`
Shows pixel value tooltips on hover.

#### `handleClick()`
Opens the detailed modal view.

## 🤝 Contributing

When contributing to the interactive feature map feature:

1. **Test Performance**: Ensure smooth interaction with large feature maps
2. **Cross-browser Testing**: Test on different browsers and devices
3. **Accessibility**: Maintain accessibility standards
4. **Performance**: Consider performance impact of new features
5. **Documentation**: Update this documentation for any changes

## 📄 License

This feature is part of the CNN Audio Visualizer project and follows the same license terms. 