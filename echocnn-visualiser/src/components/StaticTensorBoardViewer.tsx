"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { TrendingUp, TrendingDown, Target, Download, BarChart3 } from "lucide-react";

// 1. Use Record for runs and metrics
interface TensorBoardData {
  runs: Record<string, {
    metrics: Record<string, {
      steps: number[];
      values: number[];
      wall_times: number[];
    }>;
    metadata: {
      total_steps: number;
      start_time: number;
      end_time: number;
    };
  }>;
  summary: {
    total_runs: number;
    available_metrics: string[];
    runs: string[];
    date_range: {
      earliest: number;
      latest: number;
    };
  };
}

interface StaticTensorBoardViewerProps {
  className?: string;
}

const StaticTensorBoardViewer = ({ className = "" }: StaticTensorBoardViewerProps) => {
  const [tensorboardData, setTensorboardData] = useState<TensorBoardData | null>(null);
  const [selectedRun, setSelectedRun] = useState<string>("");
  const [selectedMetric, setSelectedMetric] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load TensorBoard data
  // 2. Add type annotation to data loading
  // 3. Use void for promise in useEffect
  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/tensorboard_data/all_tensorboard_data.json');
        if (response.ok) {
          const data = await response.json() as TensorBoardData;
          setTensorboardData(data);
          // Set default selections with null checks
          if (data?.summary?.runs && data.summary.runs.length > 0 && data.summary.runs[0]) {
            setSelectedRun(data.summary.runs[0]);
            if (data.summary.available_metrics && data.summary.available_metrics.length > 0 && data.summary.available_metrics[0]) {
              setSelectedMetric(data.summary.available_metrics[0]);
            }
          }
        } else {
          setError('Failed to load TensorBoard data');
        }
      } catch (err) {
        setError('Error loading TensorBoard data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 4. Add checks for possibly undefined objects/arrays
  const formatNumber = (num: number, decimals = 2) => {
    if (!isFinite(num) || isNaN(num)) {
      return 'N/A';
    }
    return num.toFixed(decimals);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  // 5. Use ?? instead of || for fallbacks everywhere
  const getTrendIcon = (values: number[]) => {
    if (!values?.length || values.length < 2) return <Target className="h-4 w-4 text-blue-500" />;
    const recent = values.slice(-5);
    if (!recent.length) return <Target className="h-4 w-4 text-blue-500" />;
    const trend = (recent[recent.length - 1] ?? 0) - (recent[0] ?? 0);
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const renderChart = (metricData: { steps: number[]; values: number[] }) => {
    if (!metricData?.steps || !metricData?.values || metricData.steps.length === 0 || metricData.values.length === 0) return null;

    const { steps, values } = metricData;
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;
    const maxStep = Math.max(...steps);

    // Prevent division by zero and handle edge cases
    if (range === 0 || maxStep === 0 || !isFinite(range) || !isFinite(maxStep)) {
      return (
        <div className="relative h-64 bg-stone-50 rounded-lg p-4 flex items-center justify-center">
          <p className="text-stone-500">No data to display</p>
        </div>
      );
    }

    return (
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
          
          {/* Chart line */}
          <polyline
            points={steps.map((step, i) => {
              if (typeof step !== 'number' || typeof values[i] !== 'number') return '0,0';
              const x = (step / maxStep) * 400;
              const y = 200 - ((values[i] - minValue) / range) * 180;
              // Ensure values are finite and within bounds
              return `${isFinite(x) ? x : 0},${isFinite(y) ? Math.max(0, Math.min(200, y)) : 0}`;
            }).join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {steps.map((step, i) => {
            if (typeof step !== 'number' || typeof values[i] !== 'number') return null;
            const x = (step / maxStep) * 400;
            const y = 200 - ((values[i] - minValue) / range) * 180;
            
            // Only render points with valid coordinates
            if (isFinite(x) && isFinite(y) && x >= 0 && x <= 400 && y >= 0 && y <= 200) {
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2"
                  fill="#3b82f6"
                />
              );
            }
            return null;
          })}
        </svg>
      </div>
    );
  };

  // 6. Remove unnecessary type annotations
  const exportMetricData = () => {
    if (!tensorboardData || !selectedRun || !selectedMetric) return;
    const runData = tensorboardData.runs[selectedRun];
    const metricData = runData?.metrics[selectedMetric];
    if (!runData || !metricData) return;
    const csvContent = [
      'Step,Value,Wall Time',
      ...metricData.steps.map((step, i) =>
        `${step},${metricData.values[i] ?? ''},${formatDate(metricData.wall_times[i] ?? 0)}`
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedRun}_${selectedMetric}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
              <p className="text-stone-600">Loading TensorBoard data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !tensorboardData) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="text-center text-red-600">
            <p>Error: {error ?? 'Failed to load TensorBoard data'}</p>
            <p className="text-sm text-stone-500 mt-2">
              Make sure to run the conversion script first
            </p>
            <div className="mt-4 p-3 bg-stone-50 rounded-lg">
              <p className="text-sm text-stone-700">
                <strong>Debug Info:</strong>
              </p>
              <p className="text-xs text-stone-600 mt-1">
                • Check if files exist: <code>ls public/tensorboard_data/</code>
              </p>
              <p className="text-xs text-stone-600">
                • Verify JSON format: <code>cat public/tensorboard_data/summary.json</code>
              </p>
              <p className="text-xs text-stone-600">
                • Run conversion: <code>python convert_tensorboard_to_static.py</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 7. Ensure all array accesses are safe
  const selectedRunData = tensorboardData.runs?.[selectedRun];
  const selectedMetricData = selectedRunData?.metrics?.[selectedMetric];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Total Runs</p>
                <p className="text-2xl font-bold text-stone-900">
                  {tensorboardData.summary?.total_runs ?? 0}
                </p>
              </div>
              <BarChart3 className="h-4 w-4 text-stone-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Available Metrics</p>
                <p className="text-2xl font-bold text-stone-900">
                  {tensorboardData.summary?.available_metrics?.length ?? 0}
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-stone-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600">Date Range</p>
                <p className="text-sm font-medium text-stone-900">
                  {tensorboardData.summary?.date_range?.earliest ? 
                    formatDate(tensorboardData.summary.date_range.earliest) : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>TensorBoard Data Viewer</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                // Force reload by clearing and reloading data
                setTensorboardData(null);
                setSelectedRun("");
                setSelectedMetric("");
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              }}
            >
              Refresh Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</p>
              <p className="text-xs text-yellow-700">
                Runs: {tensorboardData?.summary?.runs?.length ?? 0} 
                ({tensorboardData?.summary?.runs?.join(', ') ?? 'none'})
              </p>
              <p className="text-xs text-yellow-700">
                Metrics: {tensorboardData?.summary?.available_metrics?.length ?? 0}
                ({tensorboardData?.summary?.available_metrics?.join(', ') ?? 'none'})
              </p>
              <p className="text-xs text-yellow-700">
                Selected Run: {selectedRun ?? 'none'}
              </p>
              <p className="text-xs text-yellow-700">
                Selected Metric: {selectedMetric ?? 'none'}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Select Run</label>
              <Select value={selectedRun} onValueChange={setSelectedRun}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a run" />
                </SelectTrigger>
                <SelectContent>
                  {tensorboardData.summary?.runs?.map(run => (
                    <SelectItem key={run} value={run}>
                      {run}
                    </SelectItem>
                  )) ?? []}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Select Metric</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a metric" />
                </SelectTrigger>
                <SelectContent>
                  {tensorboardData.summary?.available_metrics?.map(metric => (
                    <SelectItem key={metric} value={metric}>
                      {metric}
                    </SelectItem>
                  )) ?? []}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fallback: Show data directly if dropdowns aren't working */}
          {(!selectedRun || !selectedMetric) && tensorboardData?.summary?.runs && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Manual Selection:</p>
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-blue-700">Available Runs:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tensorboardData.summary.runs.map(run => (
                      <button
                        key={run}
                        onClick={() => setSelectedRun(run)}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedRun === run 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {run}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-blue-700">Available Metrics:</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tensorboardData.summary.available_metrics?.map(metric => (
                      <button
                        key={metric}
                        onClick={() => setSelectedMetric(metric)}
                        className={`px-2 py-1 text-xs rounded ${
                          selectedMetric === metric 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedRunData && (
            <div className="space-y-4">
              {/* Run Info */}
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div>
                  <h3 className="font-semibold">{selectedRun}</h3>
                  <p className="text-sm text-stone-600">
                    Steps: {selectedRunData.metadata.total_steps} | 
                    Duration: {formatDate(selectedRunData.metadata.start_time)} - {formatDate(selectedRunData.metadata.end_time)}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={exportMetricData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              {/* Metric Chart */}
              {selectedMetricData && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{selectedMetric}</h3>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(selectedMetricData.values)}
                      <Badge variant="secondary">
                        {selectedMetricData.values?.length ?? 0} data points
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedMetricData.steps?.length > 0 && selectedMetricData.values?.length > 0 ? (
                    renderChart(selectedMetricData)
                  ) : (
                    <div className="relative h-64 bg-stone-50 rounded-lg p-4 flex items-center justify-center">
                      <p className="text-stone-500">No chart data available</p>
                    </div>
                  )}
                  
                  {/* Metric Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 bg-stone-50 rounded">
                      <p className="text-stone-600">Min</p>
                      <p className="font-semibold">{formatNumber(Math.min(...selectedMetricData.values.filter(v => isFinite(v))))}</p>
                    </div>
                    <div className="text-center p-2 bg-stone-50 rounded">
                      <p className="text-stone-600">Max</p>
                      <p className="font-semibold">{formatNumber(Math.max(...selectedMetricData.values.filter(v => isFinite(v))))}</p>
                    </div>
                    <div className="text-center p-2 bg-stone-50 rounded">
                      <p className="text-stone-600">Mean</p>
                      <p className="font-semibold">{formatNumber(
                        selectedMetricData.values
                          .filter(v => isFinite(v))
                          .reduce((a, b) => a + b, 0) / 
                        selectedMetricData.values.filter(v => isFinite(v)).length
                      )}</p>
                    </div>
                    <div className="text-center p-2 bg-stone-50 rounded">
                      <p className="text-stone-600">Final</p>
                      <p className="font-semibold">{formatNumber(
                        selectedMetricData.values
                          .filter(v => isFinite(v))
                          .slice(-1)[0] ?? 0
                      )}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaticTensorBoardViewer; 