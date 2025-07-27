"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ExternalLink, Maximize2, Minimize2 } from "lucide-react";

interface TensorBoardEmbedProps {
  logDir: string;
  className?: string;
}

const TensorBoardEmbed = ({ logDir, className = "" }: TensorBoardEmbedProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // TensorBoard URL - you can customize this
  const tensorboardUrl = `http://localhost:6006`; // Default TensorBoard port

  const handleLoad = () => {
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    window.open(tensorboardUrl, '_blank');
  };

  return (
    <div className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      <Card className={isFullscreen ? 'h-full' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>TensorBoard Dashboard</span>
              <span className="text-sm text-stone-500">({logDir})</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewTab}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in New Tab
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={isFullscreen ? 'h-full p-0' : 'h-96'}>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
                <p className="text-stone-600">Loading TensorBoard...</p>
                <p className="text-sm text-stone-500 mt-2">
                  Make sure TensorBoard is running on localhost:6006
                </p>
              </div>
            </div>
          )}
          
          <iframe
            src={tensorboardUrl}
            className={`w-full border-0 ${isFullscreen ? 'h-full' : 'h-80'}`}
            onLoad={handleLoad}
            title="TensorBoard Dashboard"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TensorBoardEmbed; 