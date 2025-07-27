import { getColor } from "~/lib/colors";
import { useState } from "react";
import { Maximize2, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

interface FeatureMapProps {
  data: number[][];
  title: string;
  internal?: boolean;
  spectrogram?: boolean;
  layerName?: string;
  onOpenModal?: (data: number[][], title: string, layerName?: string) => void;
}

const FeatureMap = ({
  data,
  title,
  internal,
  spectrogram,
  layerName,
  onOpenModal,
}: FeatureMapProps) => {
  const [hoveredPixel, setHoveredPixel] = useState<{ x: number; y: number; value: number } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!data?.length || !data[0]?.length) {
    return null;
  }

  const mapHeight = data.length;
  const mapWidth = data[0].length;

  const absMax = data
    .flat()
    .reduce((acc, val) => Math.max(acc, Math.abs(val ?? 0)), 0);

  // Calculate statistics
  const flatData = data.flat();
  const min = Math.min(...flatData);
  const max = Math.max(...flatData);
  const mean = flatData.reduce((a, b) => a + b, 0) / flatData.length;
  const std = Math.sqrt(flatData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / flatData.length);

  // Handle mouse move for hover tooltip
  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / rect.width * mapWidth);
    const y = Math.floor((event.clientY - rect.top) / rect.height * mapHeight);
    
    if (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
      const value = data[y]?.[x];
      if (value !== undefined) {
        setHoveredPixel({ x, y, value });
      }
    } else {
      setHoveredPixel(null);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredPixel(null);
  };

  // Handle click to open modal
  const handleClick = () => {
    onOpenModal?.(data, title, layerName);
  };

  // Get explanation for the layer type
  const getLayerExplanation = () => {
    if (spectrogram) {
      return {
        min: "Lowest audio intensity/frequency in this time-frequency region",
        max: "Highest audio intensity/frequency in this time-frequency region"
      };
    }
    if (layerName?.includes('conv') || layerName?.includes('Conv')) {
      return {
        min: "Areas where this filter detected very little of its target pattern",
        max: "Areas where this filter strongly detected its target pattern"
      };
    }
    return {
      min: "Lowest activation value in this feature map",
      max: "Highest activation value in this feature map"
    };
  };

  const explanation = getLayerExplanation();

  return (
    <div className="w-full text-center">
      <div className="relative group">
      <svg
        viewBox={`0 0 ${mapWidth} ${mapHeight}`}
        preserveAspectRatio="none"
          className={`mx-auto block rounded border border-stone-200 cursor-pointer transition-all hover:border-stone-400 hover:shadow-md ${internal ? "w-full max-w-32" : spectrogram ? "w-full object-contain" : "max-h-[300px] w-full max-w-[500px] object-contain"}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
      >
        {data.flatMap((row, i) =>
          row.map((value, j) => {
            const normalizedValues = absMax === 0 ? 0 : value / absMax;
            const [r, g, b] = getColor(normalizedValues);
            return (
              <rect
                key={`${i}-${j}`}
                x={j}
                y={i}
                width={1}
                height={1}
                fill={`rgb(${r},${g},${b})`}
              />
            );
          }),
        )}
      </svg>
        
        {/* Hover Tooltip */}
        {hoveredPixel && (
          <div
            className="absolute pointer-events-none z-10 rounded bg-black/80 px-2 py-1 text-xs text-white"
            style={{
              left: hoveredPixel.x * (internal ? 32 : 500) / mapWidth,
              top: hoveredPixel.y * (internal ? 32 : 300) / mapHeight - 30,
            }}
          >
            <div>Position: ({hoveredPixel.x}, {hoveredPixel.y})</div>
            <div>Value: {hoveredPixel.value.toFixed(4)}</div>
          </div>
        )}

        {/* Zoom Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors cursor-pointer"
            title="Click to view in full detail"
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Always Visible Zoom Button */}
        {onOpenModal && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all cursor-pointer border border-stone-200"
            title="Click to view in full detail"
          >
            <Maximize2 className="h-3 w-3 text-stone-700" />
          </button>
        )}
      </div>

      {/* Title and Info */}
      <div className="mt-2 flex items-center justify-center space-x-2">
        <h4 className="text-sm font-medium text-stone-700">{title}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowInfo(!showInfo);
          }}
          className="text-stone-400 hover:text-stone-600 transition-colors"
          title="What do these values mean?"
        >
          <Info className="h-3 w-3" />
        </button>
      </div>

      {/* Min/Max Values with Tooltips */}
      <div className="mt-2 flex items-center justify-center space-x-2">
        <div className="relative group">
          <Badge variant="outline" className="text-xs">
            Min: {min.toFixed(3)}
          </Badge>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
            {explanation.min}
          </div>
        </div>
        <div className="relative group">
          <Badge variant="outline" className="text-xs">
            Max: {max.toFixed(3)}
          </Badge>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
            {explanation.max}
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="mt-3 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-600">
          <div className="space-y-2">
            <div>
              <strong>Min Value:</strong> {explanation.min}
            </div>
            <div>
              <strong>Max Value:</strong> {explanation.max}
            </div>
            <div>
              <strong>Range:</strong> Shows the dynamic range of activations in this layer
            </div>
            <div>
              <strong>Colors:</strong> Darker = lower values, Brighter = higher values
            </div>
          </div>
        </div>
      )}

      {/* Detailed Statistics Toggle */}
      <div className="mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setShowStats(!showStats);
          }}
          className="text-xs text-stone-500 hover:text-stone-700"
        >
          {showStats ? "Hide" : "Show"} Statistics
        </Button>
      </div>

      {/* Detailed Statistics */}
      {showStats && (
        <div className="mt-2 p-2 bg-stone-50 rounded text-xs text-stone-600 space-y-1">
          <div><strong>Size:</strong> {mapWidth} × {mapHeight}</div>
          <div><strong>Mean:</strong> {mean.toFixed(4)}</div>
          <div><strong>Std Dev:</strong> {std.toFixed(4)}</div>
          <div><strong>Range:</strong> {min.toFixed(4)} to {max.toFixed(4)}</div>
        </div>
      )}
    </div>
  );
};

export default FeatureMap;