const Waveform = ({ 
  data, 
  title, 
  currentTime = 0,
  duration = 0,
  onSeek,
  className = ""
}: { 
  data: number[]; 
  title: string;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  className?: string;
}) => {
  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 300;
  const centerY = height / 2;

  const validData = data.filter((val) => !isNaN(val) && isFinite(val));
  if (validData.length === 0) return null;

  const min = Math.min(...validData);
  const max = Math.max(...validData);
  const range = max - min;
  const scaleY = height * 0.45;

  const pathData = validData
    .map((sample, i) => {
      const x = (i / (validData.length - 1)) * width;
      let y = centerY;

      if (range > 0) {
        const normalizedSample = (sample - min) / range; // 0 - 1, -0.5 - 0.5
        y = centerY - (normalizedSample - 0.5) * 2 * scaleY;
      }

      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  // Calculate current position indicator
  const currentPosition = duration > 0 ? (currentTime / duration) * width : 0;

  // Handle click on waveform
  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!onSeek || duration <= 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickTime = (clickX / width) * duration;
    const clampedTime = Math.max(0, Math.min(duration, clickTime));
    
    // Update current time immediately for better responsiveness
    onSeek(clampedTime);
  };

  return (
    <div className={`flex h-full w-full flex-col ${className}`}>
      <div className="flex flex-1 items-center justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="block max-h-[300px] max-w-full rounded border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors"
          onClick={handleClick}
        >
          {/* Background grid */}
          <path
            d={`M 0 ${centerY} H ${width}`}
            stroke="#e7e5e4"
            strokeWidth="1"
          />
          
          {/* Waveform */}
          <path
            d={pathData}
            fill="none"
            stroke="#44403c"
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          
          {/* Current position indicator */}
          {duration > 0 && (
            <line
              x1={currentPosition}
              y1={0}
              x2={currentPosition}
              y2={height}
              stroke="#ef4444"
              strokeWidth="2"
              opacity="0.8"
            />
          )}
          
          {/* Clickable overlay for better UX */}
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="transparent"
            style={{ cursor: 'pointer' }}
          />
        </svg>
      </div>
      <p className="mt-2 text-center text-xs text-stone-500">{title}</p>
    </div>
  );
};

export default Waveform;