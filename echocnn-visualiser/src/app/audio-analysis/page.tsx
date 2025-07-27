"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { GitCompare, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AudioPlayer from "~/components/AudioPlayer";
import Waveform from "~/components/Waveform";
import FeatureMap from "~/components/FeatureMap";
import FeatureMapModal from "~/components/FeatureMapModal";
import LayerComparison from "~/components/LayerComparison";
import ColorScale from "~/components/ColorScale";

interface Prediction {
  class: string;
  confidence: number;
}

interface LayerData {
  shape: number[];
  values: number[][];
}

interface VisualizationData {
  [layerName: string]: LayerData;
}

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
  "dog": "🐕",
  "rooster": "🐓",
  "pig": "🐷",
  "cow": "🐄",
  "frog": "🐸",
  "cat": "🐱",
  "hen": "🐔",
  "insects": "🦗",
  "sheep": "🐑",
  "crow": "🐦",
  "rain": "🌧️",
  "sea_waves": "🌊",
  "crackling_fire": "🔥",
  "crickets": "🦗",
  "chirping_birds": "🐦",
  "water_drops": "💧",
  "wind": "💨",
  "pouring_water": "💧",
  "toilet_flush": "🚽",
  "thunderstorm": "⛈️",
  "crying_baby": "👶",
  "sneezing": "🤧",
  "clapping": "👏",
  "breathing": "🫁",
  "coughing": "🤧",
  "footsteps": "👣",
  "laughing": "😄",
  "brushing_teeth": "🪥",
  "snoring": "😴",
  "drinking_sipping": "🥤",
  "door_wood_knock": "🚪",
  "mouse_click": "🖱️",
  "keyboard_typing": "⌨️",
  "door_wood_creaks": "🚪",
  "can_opening": "🥫",
  "washing_machine": "🧺",
  "vacuum_cleaner": "🧹",
  "clock_alarm": "⏰",
  "clock_tick": "⏰",
  "glass_breaking": "🥂",
  "helicopter": "🚁",
  "chainsaw": "🪚",
  "siren": "🚨",
  "car_horn": "🚗",
  "engine": "🚗",
  "train": "🚂",
  "church_bells": "⛪",
  "airplane": "✈️",
  "fireworks": "🎆",
  "hand_saw": "🪚",
};

const getEmojiForClass = (className: string): string => {
  return ESC50_EMOJI_MAP[className.toLowerCase()] ?? "🎵";
};

const findInputSpectrogram = (data: ApiResponse): LayerData | null => {
  if (!data.visualization) return null;

  // Look for input spectrogram specifically
  const inputKeys = Object.keys(data.visualization).filter(key => 
    key.toLowerCase().includes('input') || 
    key.toLowerCase().includes('spectrogram') ||
    key === 'input_spectrogram'
  );

  if (inputKeys.length > 0) {
    const key = inputKeys[0] as keyof typeof data.visualization;
    return data.visualization[key] ?? null;
  }

  // If no specific input spectrogram found, return the first available
  const sortedKeys = Object.keys(data.visualization).sort();
  if (sortedKeys.length > 0) {
    const key = sortedKeys[0] as keyof typeof data.visualization;
    return data.visualization[key] ?? null;
  }

  return null;
};

const ensure2DArray = (data: unknown, shape?: number[]): number[][] => {
  if (!data) return [];
  
  // If it's already a 2D array, return it
  if (Array.isArray(data) && Array.isArray(data[0])) {
    return data as number[][];
  }
  
  // If it's a 1D array, reshape it
  if (Array.isArray(data) && !Array.isArray(data[0])) {
    if (shape && shape.length === 2) {
      const [rows, cols] = shape;
      if (rows && cols) {
        const result = [];
        for (let i = 0; i < rows; i++) {
          result.push((data as number[]).slice(i * cols, (i + 1) * cols));
        }
        return result;
      }
    }
    // If no shape provided, assume it's a single row
    return [data as number[]];
  }
  
  return [];
};

function splitLayers(visualization: VisualizationData) {
  const main: [string, LayerData][] = [];
  const internals: Record<string, [string, LayerData][]> = {};

  Object.entries(visualization).forEach(([name, data]) => {
    if (name.includes('.')) {
      const [mainLayer] = name.split('.');
      internals[mainLayer] ??= [];
      internals[mainLayer]!.push([name, data]);
    } else {
      main.push([name, data]);
    }
  });

  return { main, internals };
}

export default function AudioAnalysisPage() {
  const [vizData, setVizData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
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

        const data: ApiResponse = await response.json();
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

  const { main, internals } = vizData && vizData.visualization
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
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Audio Analysis</h1>
        </div>

        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-stone-900">
            CNN Audio Visualizer
          </h2>
          <p className="text-md mb-8 text-stone-600">
            Upload a WAV file to see the model's predictions and feature maps
          </p>

          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <input
                type="file"
                accept=".wav"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex cursor-pointer items-center rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
              >
                Choose WAV File
              </label>
            </div>
            {fileName && (
              <p className="mt-2 text-sm text-stone-600">Selected: {fileName}</p>
            )}
          </div>
        </div>

        {isLoading && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Progress value={33} className="flex-1" />
                  <span className="text-sm text-stone-600">Processing audio...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <div className="mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-red-600">
                  <p>Error: {error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {vizData && (
          <div className="space-y-8">
            {/* Predictions */}
            <Card>
              <CardHeader>
                <CardTitle>Model Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  {vizData.predictions.map((prediction, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-stone-200 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{getEmojiForClass(prediction.class)}</span>
                          <div>
                            <p className="font-medium text-stone-900">
                              {prediction.class.replace(/_/g, " ")}
                            </p>
                            <p className="text-sm text-stone-500">
                              {(prediction.confidence * 100).toFixed(1)}% confidence
                            </p>
                          </div>
                        </div>
                        <Badge variant={index === 0 ? "default" : "secondary"}>
                          #{index + 1}
                        </Badge>
                      </div>
                      <Progress 
                        value={prediction.confidence * 100} 
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audio Player */}
            {audioUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Audio Playback</CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioPlayer
                    audioUrl={audioUrl}
                    currentTime={currentTime}
                    duration={duration}
                    isPlaying={isAudioPlaying}
                    onTimeUpdate={setCurrentTime}
                    onDurationChange={setDuration}
                    onPlayStateChange={setIsAudioPlaying}
                  />
                </CardContent>
              </Card>
            )}

            {/* Input Spectrogram and Waveform */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-stone-900">
                    Input Spectrogram
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const inputSpectrogram = findInputSpectrogram(vizData);
                    if (!inputSpectrogram) {
                      if (vizData.input_spectrogram) {
                        return (
                          <FeatureMap
                            data={ensure2DArray(vizData.input_spectrogram.values, vizData.input_spectrogram?.shape)}
                            title={`${vizData.input_spectrogram?.shape?.join(" x ") || "Unknown"}`}
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