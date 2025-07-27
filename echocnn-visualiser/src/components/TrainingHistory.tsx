"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { TrendingUp, TrendingDown, Target, AlertTriangle, Download } from "lucide-react";

interface TrainingData {
  steps: number[];
  train_loss: number[];
  val_loss: number[];
  val_accuracy: number[];
  learning_rate: number[];
  wall_time: number[];
}

interface TrainingAnalysis {
  total_epochs: number;
  final_train_loss: number;
  final_val_loss: number;
  final_val_accuracy: number;
  best_val_accuracy: number;
  best_val_accuracy_step: number;
  learning_rate_decay: {
    initial_lr: number;
    final_lr: number;
    decay_factor: number;
  };
  overfitting_analysis?: {
    train_trend: number;
    val_trend: number;
    gap: number;
    is_overfitting: boolean;
  };
}

interface TrainingHistoryProps {
  trainingData: TrainingData;
  analysis: TrainingAnalysis;
  className?: string;
}

const TrainingHistory = ({ trainingData, analysis, className = "" }: TrainingHistoryProps) => {
  const [selectedMetric, setSelectedMetric] = useState<'loss' | 'accuracy' | 'learning_rate'>('loss');
  const [showOverfitting, setShowOverfitting] = useState(true);

  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals);
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const exportTrainingData = () => {
    const csvContent = [
      'Step,Train Loss,Validation Loss,Validation Accuracy,Learning Rate',
      ...trainingData.steps.map((step, i) => 
        `${step},${trainingData.train_loss[i]},${trainingData.val_loss[i]},${trainingData.val_accuracy[i]},${trainingData.learning_rate[i]}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'training_history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderLossChart = () => {
    const maxLoss = Math.max(...trainingData.train_loss, ...trainingData.val_loss);
    const minLoss = Math.min(...trainingData.train_loss, ...trainingData.val_loss);
    const range = maxLoss - minLoss;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Loss Curves</h3>
          <div className="flex items-center space-x-2 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Training</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Validation</span>
            </div>
          </div>
        </div>
        
        <div className="relative h-64 bg-stone-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="400"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Training loss line */}
            <polyline
              points={trainingData.steps.map((step, i) => 
                `${(step / trainingData.steps[trainingData.steps.length - 1]) * 400},${200 - ((trainingData.train_loss[i] - minLoss) / range) * 180}`
              ).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* Validation loss line */}
            <polyline
              points={trainingData.steps.map((step, i) => 
                `${(step / trainingData.steps[trainingData.steps.length - 1]) * 400},${200 - ((trainingData.val_loss[i] - minLoss) / range) * 180}`
              ).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  const renderAccuracyChart = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Validation Accuracy</h3>
          <Badge variant="secondary">
            Best: {formatNumber(analysis.best_val_accuracy)}% (Step {analysis.best_val_accuracy_step})
          </Badge>
        </div>
        
        <div className="relative h-64 bg-stone-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="400"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Accuracy line */}
            <polyline
              points={trainingData.steps.map((step, i) => 
                `${(step / trainingData.steps[trainingData.steps.length - 1]) * 400},${200 - (trainingData.val_accuracy[i] / 100) * 180}`
              ).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
            />
            
            {/* Best accuracy marker */}
            <circle
              cx={(analysis.best_val_accuracy_step / trainingData.steps[trainingData.steps.length - 1]) * 400}
              cy={200 - (analysis.best_val_accuracy / 100) * 180}
              r="4"
              fill="#f59e0b"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  const renderLearningRateChart = () => {
    const maxLR = Math.max(...trainingData.learning_rate);
    const minLR = Math.min(...trainingData.learning_rate);
    const range = maxLR - minLR;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Learning Rate Decay</h3>
          <Badge variant="outline">
            Decay: {formatNumber(analysis.learning_rate_decay.decay_factor * 100, 1)}%
          </Badge>
        </div>
        
        <div className="relative h-64 bg-stone-50 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="400"
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Learning rate line */}
            <polyline
              points={trainingData.steps.map((step, i) => 
                `${(step / trainingData.steps[trainingData.steps.length - 1]) * 400},${200 - ((trainingData.learning_rate[i] - minLR) / range) * 180}`
              ).join(' ')}
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Final Accuracy</p>
                <p className="text-2xl font-bold text-stone-900">
                  {formatNumber(analysis.final_val_accuracy)}%
                </p>
              </div>
              {getTrendIcon(analysis.final_val_accuracy, trainingData.val_accuracy[trainingData.val_accuracy.length - 2] || 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Best Accuracy</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(analysis.best_val_accuracy)}%
                </p>
              </div>
              <Target className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Total Epochs</p>
                <p className="text-2xl font-bold text-stone-900">
                  {analysis.total_epochs}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Final Loss</p>
                <p className="text-2xl font-bold text-stone-900">
                  {formatNumber(analysis.final_val_loss)}
                </p>
              </div>
              {getTrendIcon(analysis.final_val_loss, trainingData.val_loss[trainingData.val_loss.length - 2] || 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overfitting Analysis */}
      {analysis.overfitting_analysis && showOverfitting && (
        <Card className={analysis.overfitting_analysis.is_overfitting ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {analysis.overfitting_analysis.is_overfitting ? (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                ) : (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <h3 className="font-semibold">
                    {analysis.overfitting_analysis.is_overfitting ? "Potential Overfitting Detected" : "Good Generalization"}
                  </h3>
                  <p className="text-sm text-stone-600">
                    Train trend: {formatNumber(analysis.overfitting_analysis.train_trend)} | 
                    Val trend: {formatNumber(analysis.overfitting_analysis.val_trend)} | 
                    Gap: {formatNumber(analysis.overfitting_analysis.gap)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOverfitting(false)}
              >
                Hide
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Training Curves</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedMetric === 'loss' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('loss')}
              >
                Loss
              </Button>
              <Button
                variant={selectedMetric === 'accuracy' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('accuracy')}
              >
                Accuracy
              </Button>
              <Button
                variant={selectedMetric === 'learning_rate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMetric('learning_rate')}
              >
                Learning Rate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={exportTrainingData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedMetric === 'loss' && renderLossChart()}
          {selectedMetric === 'accuracy' && renderAccuracyChart()}
          {selectedMetric === 'learning_rate' && renderLearningRateChart()}
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Training Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Convergence Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Best accuracy achieved at:</span>
                  <span className="font-medium">Step {analysis.best_val_accuracy_step}</span>
                </div>
                <div className="flex justify-between">
                  <span>Learning rate decay:</span>
                  <span className="font-medium">
                    {formatNumber(analysis.learning_rate_decay.initial_lr, 6)} → {formatNumber(analysis.learning_rate_decay.final_lr, 6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Decay factor:</span>
                  <span className="font-medium">{formatNumber(analysis.learning_rate_decay.decay_factor * 100, 1)}%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Final Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Training loss:</span>
                  <span className="font-medium">{formatNumber(analysis.final_train_loss)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Validation loss:</span>
                  <span className="font-medium">{formatNumber(analysis.final_val_loss)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Validation accuracy:</span>
                  <span className="font-medium">{formatNumber(analysis.final_val_accuracy)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Loss gap:</span>
                  <span className="font-medium">{formatNumber(analysis.final_val_loss - analysis.final_train_loss)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingHistory; 