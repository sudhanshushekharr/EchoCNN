"use client";

import { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ZoomOut, Download, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { getColor } from "~/lib/colors";

interface FeatureMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: number[][];
  title: string;
  layerName?: string;
}

const FeatureMapModal = ({ isOpen, onClose, data, title, layerName }: FeatureMapModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number; value: number } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mapHeight = data.length;
  const mapWidth = data[0]?.length || 0;

  // Calculate statistics
  const flatData = data.flat();
  const min = Math.min(...flatData);
  const max = Math.max(...flatData);
  const absMax = Math.max(...flatData.map(Math.abs));
  const mean = flatData.reduce((a, b) => a + b, 0) / flatData.length;
  const std = Math.sqrt(flatData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / flatData.length);

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

    // Handle pixel hover
    if (canvasRef.current && containerRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Calculate scale
      const scaleX = containerWidth / mapWidth;
      const scaleY = containerHeight / mapHeight;
      const scale = Math.min(scaleX, scaleY, 10);
      const pixelSize = Math.max(1, scale);
      
      const x = Math.floor((e.clientX - rect.left) / (pixelSize * zoom));
      const y = Math.floor((e.clientY - rect.top) / (pixelSize * zoom));
      
      if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        const value = data[y]?.[x];
        if (value !== undefined) {
          setHoveredPixel({ x, y, value });
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

  // Export as image
  const exportImage = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `${layerName || 'feature-map'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // Render feature map to canvas
  useEffect(() => {
    if (!canvasRef.current || !data.length || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate scale to fit the feature map in the container
    const scaleX = containerWidth / mapWidth;
    const scaleY = containerHeight / mapHeight;
    const scale = Math.min(scaleX, scaleY, 10); // Max scale of 10x to prevent too large rendering

    // Set canvas size with some padding
    const canvasWidth = Math.max(mapWidth * scale, containerWidth * 0.8);
    const canvasHeight = Math.max(mapHeight * scale, containerHeight * 0.8);
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw pixels with scaling
    const pixelSize = Math.max(1, scale);
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const value = data[y]?.[x];
        if (value !== undefined) {
          const normalizedValue = absMax === 0 ? 0 : value / absMax;
          const [r, g, b] = getColor(normalizedValue);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }
    }

    // Center the canvas in the container
    setPosition({
      x: (containerWidth - canvasWidth) / 2,
      y: (containerHeight - canvasHeight) / 2,
    });
  }, [data, mapWidth, mapHeight, absMax]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative h-[95vh] w-[95vw] max-h-[95vh] max-w-[95vw] overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            {layerName && (
              <p className="text-sm text-stone-600">{layerName}</p>
            )}
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

        {/* Statistics */}
        <div className="border-b border-stone-200 p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-stone-600">Size</p>
              <p className="font-medium">{mapWidth} × {mapHeight}</p>
            </div>
            <div>
              <p className="text-stone-600">Range</p>
              <p className="font-medium">{min.toFixed(3)} to {max.toFixed(3)}</p>
              <p className="text-xs text-stone-500 mt-1">
                {layerName?.toLowerCase().includes('spectrogram') || title.toLowerCase().includes('spectrogram') 
                  ? "Audio intensity/frequency values"
                  : "Neural network activation values"
                }
              </p>
            </div>
            <div>
              <p className="text-stone-600">Mean</p>
              <p className="font-medium">{mean.toFixed(3)}</p>
              <p className="text-xs text-stone-500 mt-1">Average activation level</p>
            </div>
            <div>
              <p className="text-stone-600">Std Dev</p>
              <p className="font-medium">{std.toFixed(3)}</p>
              <p className="text-xs text-stone-500 mt-1">Variation in activations</p>
            </div>
          </div>
          
          {/* Value Explanation */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">What do these values mean?</h4>
            <div className="text-xs text-blue-800 space-y-1">
              {layerName?.toLowerCase().includes('spectrogram') || title.toLowerCase().includes('spectrogram') ? (
                <>
                  <p><strong>Min ({min.toFixed(3)}):</strong> Lowest audio intensity/frequency detected in this time-frequency region</p>
                  <p><strong>Max ({max.toFixed(3)}):</strong> Highest audio intensity/frequency detected in this time-frequency region</p>
                  <p><strong>Colors:</strong> Darker areas = quieter frequencies, Brighter areas = louder frequencies</p>
                </>
              ) : (
                <>
                  <p><strong>Min ({min.toFixed(3)}):</strong> Areas where this neural filter detected very little of its target pattern</p>
                  <p><strong>Max ({max.toFixed(3)}):</strong> Areas where this neural filter strongly detected its target pattern</p>
                  <p><strong>Colors:</strong> Darker areas = weak activations, Brighter areas = strong activations</p>
                </>
              )}
            </div>
          </div>
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
            onClick={exportImage}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="relative h-full overflow-hidden bg-stone-100"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <canvas
            ref={canvasRef}
            className="block"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          />
          
          {/* Hover Tooltip */}
          {hoveredPixel && (
            <div
              className="absolute pointer-events-none z-10 rounded bg-black/80 px-2 py-1 text-xs text-white"
              style={{
                left: hoveredPixel.x * Math.max(1, Math.min(containerRef.current?.clientWidth / mapWidth || 1, containerRef.current?.clientHeight / mapHeight || 1, 10)) * zoom + position.x,
                top: hoveredPixel.y * Math.max(1, Math.min(containerRef.current?.clientWidth / mapWidth || 1, containerRef.current?.clientHeight / mapHeight || 1, 10)) * zoom + position.y - 30,
              }}
            >
              <div>Position: ({hoveredPixel.x}, {hoveredPixel.y})</div>
              <div>Value: {hoveredPixel.value.toFixed(4)}</div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="border-t border-stone-200 p-4 bg-stone-50">
          <div className="flex items-center justify-center space-x-6 text-sm text-stone-600">
            <span>• Scroll to zoom</span>
            <span>• Drag to pan</span>
            <span>• Hover for pixel values</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureMapModal; 