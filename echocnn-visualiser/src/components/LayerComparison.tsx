"use client";

import { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { getColor } from "~/lib/colors";

interface LayerData {
  name: string;
  data: number[][];
  title: string;
}

interface LayerComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  layers: LayerData[];
}

const LayerComparison = ({ isOpen, onClose, layers }: LayerComparisonProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number; values: number[] } | null>(null);
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate grid layout
  const gridCols = Math.ceil(Math.sqrt(layers.length));
  const gridRows = Math.ceil(layers.length / gridCols);

  // Calculate statistics for all layers
  const layerStats = layers.map(layer => {
    const flatData = layer.data.flat();
    const min = Math.min(...flatData);
    const max = Math.max(...flatData);
    const absMax = Math.max(...flatData.map(Math.abs));
    const mean = flatData.reduce((a, b) => a + b, 0) / flatData.length;
    const std = Math.sqrt(flatData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / flatData.length);
    
    return { min, max, absMax, mean, std };
  });

  // Handle zoom
  const handleZoom = (delta: number) => {
    const newZoom = Math.max(0.5, Math.min(5, zoom + delta));
    setZoom(newZoom);
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    handleZoom(delta);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Handle pixel hover across all layers
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerX = e.clientX - rect.left;
      const containerY = e.clientY - rect.top;
      
      // Calculate which layer and pixel position
      const canvasWidth = rect.width / gridCols;
      const canvasHeight = rect.height / gridRows;
      
      const col = Math.floor(containerX / canvasWidth);
      const row = Math.floor(containerY / canvasHeight);
      const layerIndex = row * gridCols + col;
      
      if (layerIndex >= 0 && layerIndex < layers.length) {
        const layer = layers[layerIndex];
        const localX = containerX - col * canvasWidth;
        const localY = containerY - row * canvasHeight;
        
        const pixelX = Math.floor((localX - position.x) / zoom);
        const pixelY = Math.floor((localY - position.y) / zoom);
        
        if (pixelX >= 0 && pixelX < (layer?.data[0]?.length ?? 0) && pixelY >= 0 && pixelY < (layer?.data.length ?? 0)) {
          const values = layers.map(l => l.data[pixelY]?.[pixelX] ?? 0);
          setHoveredPixel({ x: pixelX, y: pixelY, values });
        } else {
          setHoveredPixel(null);
        }
      } else {
        setHoveredPixel(null);
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Export all layers as images
  const exportAllImages = () => {
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas && layers[index]) {
        const link = document.createElement('a');
        link.download = `${layers[index].name}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    });
  };

  // Render feature maps to canvases
  useEffect(() => {
    layers.forEach((layer, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas || !layer.data.length) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const mapHeight = layer.data.length;
      const mapWidth = layer.data[0]?.length ?? 0;
      const stats = layerStats[index];

      // Set canvas size
      canvas.width = mapWidth;
      canvas.height = mapHeight;

      // Clear canvas
      ctx.clearRect(0, 0, mapWidth, mapHeight);

      // Draw pixels
      for (let y = 0; y < mapHeight; y++) {
        for (let x = 0; x < mapWidth; x++) {
          const value = layer.data[y]?.[x];
          if (value !== undefined && stats) {
            const normalizedValue = stats.absMax === 0 ? 0 : value / stats.absMax;
            const [r, g, b] = getColor(normalizedValue);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
    });
  }, [layers, layerStats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[95vh] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Layer Comparison</h2>
            <p className="text-sm text-stone-600">{layers.length} layers</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(-0.5)}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Badge variant="secondary">{Math.round(zoom * 100)}%</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom(0.5)}
              disabled={zoom >= 5}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={exportAllImages}
          >
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>

        {/* Canvas Grid Container */}
        <div
          ref={containerRef}
          className="relative overflow-hidden bg-stone-100"
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'grid',
            gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
            gridTemplateRows: `repeat(${gridRows}, 1fr)`,
            height: '60vh',
          }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {layers.map((layer, index) => (
            <div key={layer.name} className="relative border border-stone-200">
              <canvas
                ref={(el) => {
                  canvasRefs.current[index] = el;
                }}
                className="block w-full h-full"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                  transformOrigin: '0 0',
                  cursor: isDragging ? 'grabbing' : 'grab',
                }}
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {layer.title}
              </div>
            </div>
          ))}
          
          {/* Hover Tooltip */}
          {hoveredPixel && (
            <div
              className="absolute pointer-events-none z-10 rounded bg-black/80 px-2 py-1 text-xs text-white"
              style={{
                left: hoveredPixel.x * zoom + position.x + 10,
                top: hoveredPixel.y * zoom + position.y - 30,
              }}
            >
              <div>Position: ({hoveredPixel.x}, {hoveredPixel.y})</div>
              {layers.map((layer, index) => (
                <div key={layer.name}>
                  {layer.title}: {hoveredPixel.values[index]?.toFixed(4)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Layer Statistics */}
        <div className="max-h-32 overflow-y-auto border-t border-stone-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {layers.map((layer, index) => {
              const stats = layerStats[index];
              return (
                <div key={layer.name} className="space-y-1">
                  <p className="font-medium text-stone-900">{layer.title}</p>
                  {stats && (
                    <>
                      <p className="text-stone-600">Range: {stats.min.toFixed(3)} to {stats.max.toFixed(3)}</p>
                      <p className="text-stone-600">Mean: {stats.mean.toFixed(3)}</p>
                      <p className="text-stone-600">Std: {stats.std.toFixed(3)}</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 text-xs text-stone-500 border-t border-stone-200">
          <p>Scroll to zoom • Drag to pan • Hover for pixel values across all layers</p>
        </div>
      </div>
    </div>
  );
};

export default LayerComparison; 