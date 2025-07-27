"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TrainingHistory from "~/components/TrainingHistory";
import StaticTensorBoardViewer from "~/components/StaticTensorBoardViewer";
import TensorBoardEmbed from "~/components/TensorBoardEmbed";

interface TrainingAnalysis {
  training_data: {
    steps: number[];
    train_loss: number[];
    val_loss: number[];
    val_accuracy: number[];
    learning_rate: number[];
  };
  analysis: {
    total_epochs: number;
    final_accuracy: number;
    best_accuracy: number;
    final_loss: number;
    learning_rate_decay: number;
    overfitting_analysis: string;
  };
}

export default function TrainingAnalysisPage() {
  const [trainingAnalysis, setTrainingAnalysis] = useState<TrainingAnalysis | null>(null);
  const [showTrainingHistory, setShowTrainingHistory] = useState(false);
  const [showTensorBoard, setShowTensorBoard] = useState(false);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  // Load training analysis data
  useEffect(() => {
    const loadTrainingAnalysis = async () => {
      try {
        const response = await fetch('/training_analysis.json');
        if (response.ok) {
          const data = await response.json();
          setTrainingAnalysis(data);
        }
      } catch (error) {
        console.error('Failed to load training analysis:', error);
      }
    };
    loadTrainingAnalysis();
  }, []);

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header with back button */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="flex items-center text-stone-600 hover:text-stone-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Training Analysis</h1>
        </div>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-light tracking-tight text-stone-900">
            Model Training Analysis
          </h2>
          <p className="text-md mb-8 text-stone-600">
            Monitor training progress, analyze performance metrics, and visualize model behavior
          </p>
        </div>

        {/* Training Analysis Options */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Training Analysis Dashboard</CardTitle>
            <p className="text-sm text-stone-600">
              Explore your model's training performance and metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              {trainingAnalysis && (
                <Button
                  variant={showTrainingHistory ? "default" : "outline"}
                  onClick={() => setShowTrainingHistory(!showTrainingHistory)}
                >
                  {showTrainingHistory ? "Hide" : "Show"} Training History
                </Button>
              )}
              <Button
                variant={showTensorBoard ? "default" : "outline"}
                onClick={() => setShowTensorBoard(!showTensorBoard)}
              >
                {showTensorBoard ? "Hide" : "Show"} TensorBoard Dashboard
              </Button>
              <Button
                variant={isDevelopmentMode ? "default" : "outline"}
                onClick={() => setIsDevelopmentMode(!isDevelopmentMode)}
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
              >
                {isDevelopmentMode ? "Production" : "Development"} Mode
              </Button>
            </div>
            {isDevelopmentMode && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Development Mode:</strong> Using local TensorBoard server (localhost:6006)
                </p>
                <p className="text-xs text-orange-700 mt-1">
                  Make sure to run: <code className="bg-orange-100 px-1 rounded">./start_tensorboard.sh</code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Training History */}
        {showTrainingHistory && trainingAnalysis && (
          <div className="mb-8">
            <TrainingHistory
              trainingData={trainingAnalysis.training_data}
              analysis={trainingAnalysis.analysis}
            />
          </div>
        )}

        {/* TensorBoard Embed */}
        {showTensorBoard && (
          <div className="mb-8">
            {isDevelopmentMode ? (
              <TensorBoardEmbed logDir="tensorboard_logs/run_20250721_120620" />
            ) : (
              <StaticTensorBoardViewer />
            )}
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                View loss curves, accuracy trends, and learning rate schedules to understand your model's training behavior.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                Analyze overfitting, convergence patterns, and model performance across different training runs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600">
                Switch between development mode for live TensorBoard and production mode for static analysis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
} 