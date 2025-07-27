"use client";

import { useState } from "react";
import AudioPlayer from "~/components/AudioPlayer";
import ColorScale from "~/components/ColorScale";
import FeatureMap from "~/components/FeatureMap";
import FeatureMapModal from "~/components/FeatureMapModal";
import LayerComparison from "~/components/LayerComparison";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import Waveform from "~/components/Waveform";
import { GitCompare } from "lucide-react";

interface Prediction {
  class: string;
  confidence: number;
}

interface LayerData {
  shape: number[];
  values: number[][];
}

type VisualizationData = Record<string, LayerData>;

interface WaveformData {
  values: number[];
  sample_rate: number;
  duration: number;
}

interface ApiResponse {
  predictions: Prediction[];
  visualization: VisualizationData;
  input_spectrogram: LayerData;
  waveform: WaveformData;
}

const ESC50_EMOJI_MAP: Record<string, string> = {
  dog: "🐕",
  rain: "🌧️",
  crying_baby: "👶",
  door_wood_knock: "🚪",
  helicopter: "🚁",
  rooster: "🐓",
  sea_waves: "🌊",
  sneezing: "🤧",
  mouse_click: "🖱️",
  chainsaw: "🪚",
  pig: "🐷",
  crackling_fire: "🔥",
  clapping: "👏",
  keyboard_typing: "⌨️",
  siren: "🚨",
  cow: "🐄",
  crickets: "🦗",
  breathing: "💨",
  door_wood_creaks: "🚪",
  car_horn: "📯",
  frog: "🐸",
  chirping_birds: "🐦",
  coughing: "😷",
  can_opening: "🥫",
  engine: "🚗",
  cat: "🐱",
  water_drops: "💧",
  footsteps: "👣",
  washing_machine: "🧺",
  train: "🚂",
  hen: "🐔",
  wind: "💨",
  laughing: "😂",
  vacuum_cleaner: "🧹",
  church_bells: "🔔",
  insects: "🦟",
  pouring_water: "🚰",
  brushing_teeth: "🪥",
  clock_alarm: "⏰",
  airplane: "✈️",
  sheep: "🐑",
  toilet_flush: "🚽",
  snoring: "😴",
  clock_tick: "⏱️",
  fireworks: "🎆",
  crow: "🐦‍⬛",
  thunderstorm: "⛈️",
  drinking_sipping: "🥤",
  glass_breaking: "🔨",
  hand_saw: "🪚",
};

const getEmojiForClass = (className: string): string => {
  return ESC50_EMOJI_MAP[className] ?? "🔈";
};

const findInputSpectrogram = (data: ApiResponse): LayerData | null => {
  // First check if it's directly in the response
  if (data.input_spectrogram) {
    return data.input_spectrogram;
  }
  
  // Check if it's in the visualization object
  if (data.visualization) {
    const inputKeys = Object.keys(data.visualization).filter(key => 
      key.toLowerCase().includes('input') || 
      key.toLowerCase().includes('spectrogram') ||
      key.toLowerCase().includes('spectro')
    );
    
    if (inputKeys.length > 0) {
      return data.visualization[inputKeys[0]!] ?? null;
    }
    
    // If no specific input keys found, try to find the first layer that might be the input
    const sortedKeys = Object.keys(data.visualization).sort();
    if (sortedKeys.length > 0) {
      return data.visualization[sortedKeys[0]!] ?? null;
    }
  }
  
  return null;
};

const ensure2DArray = (data: unknown, shape?: number[]): number[][] => {
  if (!Array.isArray(data)) return [];
  
  if (shape && shape.length === 2) {
    const [rows, cols] = shape;
    if (rows && cols) {
      const result: number[][] = [];
      for (let i = 0; i < rows; i++) {
        result.push((data as number[]).slice(i * cols, (i + 1) * cols));
      }
      return result;
    }
  }
  
  // If no valid shape provided, try to make it 2D
  const length = (data as number[]).length;
  const sqrt = Math.sqrt(length);
  if (Number.isInteger(sqrt)) {
    return ensure2DArray(data as number[], [sqrt, sqrt]);
  }
  
  // Fallback: return as single row
  return [data as number[]];
};

function splitLayers(visualization: VisualizationData) {
  const main: [string, LayerData][] = [];
  const internals: Record<string, [string, LayerData][]> = {};

  if (!visualization) return { main, internals };

  for (const [name, data] of Object.entries(visualization)) {
    if (!data) continue;
    
    if (!name.includes(".")) {
      main.push([name, data]);
    } else {
      const [parent] = name.split(".");
      if (parent === undefined) continue;

      internals[parent] ??= [];
      internals[parent].push([name, data]);
    }
  }

  return { main, internals };
}

export default function HomePage() {
  const [vizData, setVizData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [, setIsAudioPlaying] = useState(false);
  const [selectedFeatureMap, setSelectedFeatureMap] = useState<{
    data: number[][];
    title: string;
    layerName?: string;
  } | null>(null);
  const [showLayerComparison, setShowLayerComparison] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsLoading(true);
    setError(null);
    setVizData(null);
    setCurrentTime(0);
    setDuration(0);
    setIsAudioPlaying(false);
    setSelectedFeatureMap(null);
    setShowLayerComparison(false);

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async () => {
      // Create audio URL for playback
      const audioBlob = new Blob([reader.result as ArrayBuffer], { type: file.type });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            "",
          ),
        );

        const response = await fetch("https://shekharsudhanshu801--audio-cnn-inference-audioclassifier-2e9fb8.modal.run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audio_data: base64String }),
        });

        if (!response.ok) {
          throw new Error(`API error ${response.statusText}`);
        }

        const data = await response.json() as ApiResponse;
        setVizData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occured",
        );
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed ot read the file.");
      setIsLoading(false);
    };
  };

  const { main, internals } = vizData?.visualization
    ? splitLayers(vizData.visualization)
    : { main: [], internals: {} };

  // Handle feature map modal
  const handleOpenFeatureMapModal = (data: number[][], title: string, layerName?: string) => {
    setSelectedFeatureMap({ data, title, layerName });
  };

  // Handle layer comparison
  const handleOpenLayerComparison = () => {
    setShowLayerComparison(true);
  };

  // Prepare layers for comparison
  const comparisonLayers = main.map(([name, data]) => ({
    name,
    data: ensure2DArray(data?.values, data?.shape),
    title: name,
  }));

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-[100%]">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-light tracking-tight text-stone-900">
            CNN Audio Visualizer
          </h1>
          <p className="text-md mb-8 text-stone-600">
            Upload a WAV file to see the model&apos;s predictions and feature maps
          </p>

          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <input
                type="file"
                accept=".wav"
                id="file-upload"
                onChange={handleFileChange}
                disabled={isLoading}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
              />
              <Button
                disabled={isLoading}
                className="border-stone-300"
                variant="outline"
                size="lg"
              >
                {isLoading ? "Analysing..." : "Choose File"}
              </Button>
            </div>

            {fileName && (
              <Badge
                variant="secondary"
                className="mt-4 bg-stone-200 text-stone-700"
              >
                {fileName}
              </Badge>
            )}
          </div>
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent>
              <p className="text-red-600">Error: {error}</p>
            </CardContent>
          </Card>
        )}

        {vizData && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-stone-900">
                  Top Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(vizData.predictions || []).slice(0, 3).map((pred, i) => (
                    <div key={pred.class} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-md font-medium text-stone-700">
                          {getEmojiForClass(pred.class)}{" "}
                          <span>{pred.class.replaceAll("_", " ")}</span>
                        </div>
                        <Badge variant={i === 0 ? "default" : "secondary"}>
                          {(pred.confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <Progress value={pred.confidence * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audio Player */}
            {audioUrl && (
              <AudioPlayer
                audioUrl={audioUrl}
                fileName={fileName}
                onTimeUpdate={(time, dur) => {
                  setCurrentTime(time);
                  setDuration(dur);
                }}
                onSeek={(time) => setCurrentTime(time)}
                onPlayStateChange={(isPlaying) => setIsAudioPlaying(isPlaying)}
                className="mb-6"
              />
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="text-stone-900">
                  <CardTitle className="text-stone-900">
                    Input Spectrogram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const inputSpectrogram = findInputSpectrogram(vizData);
                    
                    if (!inputSpectrogram?.values || inputSpectrogram.values.length === 0) {
                      // Try to use the first layer from visualization as fallback
                      const firstLayer = vizData.visualization ? Object.values(vizData.visualization)[0] : null;
                      
                      if (firstLayer?.values && firstLayer.values.length > 0) {
                        return (
                          <FeatureMap
                            data={ensure2DArray(firstLayer.values, firstLayer?.shape)}
                            title={`Input (${firstLayer?.shape?.join(" x ") || "Unknown"})`}
                            spectrogram
                            layerName="input_spectrogram"
                            onOpenModal={handleOpenFeatureMapModal}
                          />
                        );
                      }
                      
                      return (
                        <div className="flex h-32 items-center justify-center text-stone-500">
                          <p>No spectrogram data available</p>
                        </div>
                      );
                    }
                    
                    return (
                      <FeatureMap
                        data={ensure2DArray(inputSpectrogram.values, inputSpectrogram?.shape)}
                        title={`${inputSpectrogram?.shape?.join(" x ") || "Unknown"}`}
                        spectrogram
                        layerName="input_spectrogram"
                        onOpenModal={handleOpenFeatureMapModal}
                      />
                    );
                  })()}

                  <div className="mt-5 flex justify-end">
                    <div className="text-right">
                      <ColorScale width={200} height={16} min={-1} max={1} />
                      <p className="text-xs text-stone-500 mt-1">
                        Color scale: Darker = lower values, Brighter = higher values
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-stone-900">
                    Audio Waveform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Waveform
                    data={vizData.waveform?.values || []}
                    title={`${vizData.waveform?.duration?.toFixed(2) || "0.00"}s * ${vizData.waveform?.sample_rate || 0}Hz`}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={(time) => setCurrentTime(time)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Feature maps */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Convolutional Layer Outputs</CardTitle>
                    <p className="text-sm text-stone-600 mt-1">
                      Each feature map shows what patterns this layer learned to detect in the audio
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenLayerComparison}
                      disabled={main.length === 0}
                    >
                      <GitCompare className="h-4 w-4 mr-2" />
                      Compare Layers
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-6">
                  {main.map(([mainName, mainData]) => (
                    <div key={mainName} className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-medium text-stone-700">
                          {mainName}
                        </h4>
                        <FeatureMap
                          data={ensure2DArray(mainData?.values, mainData?.shape)}
                          title={`${mainData?.shape?.join(" x ") || "Unknown"}`}
                          layerName={mainName}
                          onOpenModal={handleOpenFeatureMapModal}
                        />
                      </div>

                      {internals[mainName] && (
                        <div className="h-80 overflow-y-auto rounded border border-stone-200 bg-stone-50 p-2">
                          <div className="space-y-2">
                            {internals[mainName]
                              .sort(([a], [b]) => a.localeCompare(b))
                              .map(([layerName, layerData]) => (
                                <FeatureMap
                                  key={layerName}
                                  data={ensure2DArray(layerData?.values, layerData?.shape)}
                                  title={layerName.replace(`${mainName}.`, "")}
                                  internal={true}
                                  layerName={layerName}
                                  onOpenModal={handleOpenFeatureMapModal}
                                />
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <ColorScale width={200} height={16} min={-1} max={1} />
                  <p className="text-xs text-stone-500 mt-1">
                    Color scale: Darker = lower values, Brighter = higher values
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Feature Map Modal */}
        {selectedFeatureMap && (
          <FeatureMapModal
            isOpen={!!selectedFeatureMap}
            onClose={() => setSelectedFeatureMap(null)}
            data={selectedFeatureMap.data}
            title={selectedFeatureMap.title}
            layerName={selectedFeatureMap.layerName}
          />
        )}

        {/* Layer Comparison Modal */}
        {showLayerComparison && (
          <LayerComparison
            isOpen={showLayerComparison}
            onClose={() => setShowLayerComparison(false)}
            layers={comparisonLayers}
          />
        )}
      </div>
    </main>
  );
}