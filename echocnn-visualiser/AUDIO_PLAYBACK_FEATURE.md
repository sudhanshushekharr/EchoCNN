# Audio Playback Feature Documentation

## 🎵 Overview

The Audio Playback Feature enhances the CNN Audio Visualizer by providing interactive audio controls with synchronized waveform visualization. Users can now play, pause, seek, and analyze audio files with real-time visual feedback.

## ✨ Features

### 🎮 Audio Player Controls
- **Play/Pause**: Control audio playback with a large, accessible button
- **Seek Bar**: Drag to jump to any position in the audio
- **Volume Control**: Adjust volume with a slider (0-100%)
- **Mute/Unmute**: Quick mute toggle with visual indicator
- **Skip Controls**: Jump forward/backward 10 seconds
- **Download**: Download the original audio file
- **Time Display**: Current time and total duration in MM:SS format

### 🎯 Interactive Waveform
- **Click-to-Seek**: Click anywhere on the waveform to jump to that time
- **Real-time Position Indicator**: Red line shows current playback position
- **Hover Effects**: Visual feedback when hovering over clickable areas
- **Synchronized Updates**: Waveform updates in real-time with audio playback

### 📊 Audio Information Display
- **File Format**: Shows audio format (WAV, MP3, etc.)
- **Sample Rate**: Displays audio sample rate when available
- **File Name**: Shows the uploaded file name
- **Duration**: Total audio duration

## 🚀 Usage

### Basic Audio Playback
1. **Upload Audio**: Click "Choose File" and select a WAV file
2. **Audio Player Appears**: The audio player will appear above the visualizations
3. **Play Audio**: Click the play button to start playback
4. **Control Playback**: Use the seek bar, volume controls, or skip buttons

### Interactive Waveform Navigation
1. **Click on Waveform**: Click anywhere on the waveform to jump to that time
2. **Real-time Sync**: The red position indicator shows current playback position
3. **Seek Bar Sync**: The seek bar and waveform are synchronized

### Advanced Controls
- **Volume Adjustment**: Use the volume slider to adjust playback volume
- **Mute**: Click the volume icon to quickly mute/unmute
- **Skip**: Use the skip buttons to jump 10 seconds forward/backward
- **Download**: Click the download button to save the audio file

## 🛠 Technical Implementation

### Components

#### AudioPlayer Component (`src/components/AudioPlayer.tsx`)
```typescript
interface AudioPlayerProps {
  audioUrl: string;           // URL of the audio file
  fileName: string;           // Name of the audio file
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onSeek?: (time: number) => void;
  className?: string;
}
```

**Key Features:**
- Uses HTML5 `<audio>` element for playback
- React state management for player controls
- Event listeners for time updates and user interactions
- Responsive design with Tailwind CSS

#### Enhanced Waveform Component (`src/components/Waveform.tsx`)
```typescript
interface WaveformProps {
  data: number[];             // Audio waveform data
  title: string;              // Display title
  currentTime?: number;       // Current playback time
  duration?: number;          // Total audio duration
  onSeek?: (time: number) => void;  // Seek callback
  className?: string;
}
```

**Key Features:**
- SVG-based waveform rendering
- Click-to-seek functionality
- Real-time position indicator
- Responsive design

### State Management

The main page (`src/app/page.tsx`) manages audio state:

```typescript
const [audioUrl, setAudioUrl] = useState<string>("");
const [currentTime, setCurrentTime] = useState(0);
const [duration, setDuration] = useState(0);
```

### Audio File Handling

1. **File Upload**: When a file is selected, it's converted to a Blob URL
2. **Audio Creation**: `URL.createObjectURL()` creates a playable audio URL
3. **Memory Management**: URLs are automatically cleaned up by the browser

### Synchronization

The audio player and waveform are synchronized through:
- `onTimeUpdate` callback: Updates current time and duration
- `onSeek` callback: Handles seek operations from both components
- Shared state: Both components read from the same state variables

## 🎨 UI/UX Design

### Design Principles
- **Accessibility**: Large, clear controls with proper contrast
- **Responsiveness**: Works on desktop and mobile devices
- **Intuitive**: Familiar audio player interface
- **Visual Feedback**: Hover states, transitions, and position indicators

### Color Scheme
- **Primary**: Stone colors for consistency with the app theme
- **Accent**: Red (#ef4444) for position indicators
- **Interactive**: Hover states with subtle color changes

### Layout
- **Audio Player**: Full-width card above visualizations
- **Waveform**: Integrated with existing visualization grid
- **Controls**: Logical grouping of related controls

## 🔧 Dependencies

### Required Packages
```json
{
  "@radix-ui/react-slider": "^1.3.5",
  "lucide-react": "^0.525.0"
}
```

### UI Components
- **Slider**: Custom Radix UI slider for seek and volume controls
- **Button**: Existing button component with icons
- **Card**: Existing card component for layout
- **Badge**: For displaying audio format information

## 🐛 Troubleshooting

### Common Issues

#### Audio Won't Play
- **Check File Format**: Ensure the file is a supported audio format (WAV, MP3, etc.)
- **Browser Support**: Some browsers may not support certain audio formats
- **File Size**: Very large files may take time to load

#### Waveform Not Interactive
- **Check Duration**: Waveform is only interactive when duration > 0
- **Click Area**: Ensure you're clicking on the waveform area, not the border

#### Volume Controls Not Working
- **Browser Permissions**: Some browsers may block audio controls
- **Audio Element**: Check if the audio element is properly loaded

### Debug Information
The console logs provide debugging information:
- Audio file loading status
- Time update events
- Seek operations
- Error messages

## 🔮 Future Enhancements

### Planned Features
1. **Playback Speed Control**: Adjust playback speed (0.5x, 1x, 2x)
2. **Loop Controls**: Set loop points for repeated playback
3. **Keyboard Shortcuts**: Space for play/pause, arrow keys for seeking
4. **Audio Effects**: Basic audio effects (fade in/out, normalization)
5. **Multiple Audio Support**: Compare multiple audio files
6. **Export Audio**: Export modified audio with effects

### Technical Improvements
1. **Web Audio API**: More advanced audio processing capabilities
2. **Audio Visualization**: Real-time frequency spectrum display
3. **Performance Optimization**: Better handling of large audio files
4. **Offline Support**: Service worker for offline functionality

## 📝 API Reference

### AudioPlayer Methods

#### `togglePlayPause()`
Toggles audio playback between play and pause states.

#### `handleSeek(value: number[])`
Seeks to a specific time in the audio.
- `value[0]`: Target time in seconds

#### `handleVolumeChange(value: number[])`
Adjusts audio volume.
- `value[0]`: Volume level (0-1)

#### `skip(seconds: number)`
Skips forward or backward by the specified number of seconds.
- `seconds`: Positive for forward, negative for backward

### Waveform Methods

#### `handleClick(event: React.MouseEvent<SVGSVGElement>)`
Handles click events on the waveform for seeking.
- Calculates click position and converts to time
- Calls `onSeek` callback with new time

## 🤝 Contributing

When contributing to the audio playback feature:

1. **Test Audio Formats**: Ensure compatibility with various audio formats
2. **Cross-browser Testing**: Test on different browsers and devices
3. **Accessibility**: Maintain accessibility standards
4. **Performance**: Consider performance impact of audio operations
5. **Documentation**: Update this documentation for any changes

## 📄 License

This feature is part of the CNN Audio Visualizer project and follows the same license terms. 