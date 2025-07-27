"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ArrowRight, Music, BarChart3, Sparkles, Zap, TrendingUp, ChevronDown, X, BookOpen, Code, FileText, Play } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showDocumentation, setShowDocumentation] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-stone-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-blue-300/10 to-cyan-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        {/* Subtle Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] bg-noise" />
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float"></div>
        <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-cyan-400/35 rounded-full animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Music Notes */}
        <div className="absolute top-20 left-20 text-blue-400/40 animate-float">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div className="absolute top-32 right-32 text-purple-400/40 animate-float" style={{animationDelay: '1.5s'}}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-32 text-pink-400/40 animate-float" style={{animationDelay: '3s'}}>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
          </svg>
        </div>
        
        {/* Waveform Bars */}
        <div className="absolute top-40 left-1/3 flex space-x-1 animate-wave">
          <div className="w-1 bg-blue-400/30 rounded-full h-4"></div>
          <div className="w-1 bg-purple-400/30 rounded-full h-6"></div>
          <div className="w-1 bg-pink-400/30 rounded-full h-3"></div>
          <div className="w-1 bg-cyan-400/30 rounded-full h-5"></div>
          <div className="w-1 bg-blue-400/30 rounded-full h-2"></div>
        </div>
        
        <div className="absolute bottom-40 right-1/3 flex space-x-1 animate-wave" style={{animationDelay: '2s'}}>
          <div className="w-1 bg-purple-400/30 rounded-full h-3"></div>
          <div className="w-1 bg-pink-400/30 rounded-full h-5"></div>
          <div className="w-1 bg-cyan-400/30 rounded-full h-4"></div>
          <div className="w-1 bg-blue-400/30 rounded-full h-6"></div>
          <div className="w-1 bg-purple-400/30 rounded-full h-2"></div>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="relative">
        
        <div className="relative px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative rounded-lg bg-white px-4 py-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <Badge variant="secondary" className="text-sm font-medium">
                    <Sparkles className="mr-1 h-3 w-3 animate-pulse" />
                    Audio ML Platform
                  </Badge>
                </div>
                {/* Floating music notes around badge */}
                <div className="absolute -top-2 -left-2 text-blue-400/60 animate-bounce-music">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
                <div className="absolute -bottom-2 -right-2 text-purple-400/60 animate-bounce-music" style={{animationDelay: '1s'}}>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                  </svg>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-6xl">
              <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                EchoCNN
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                Visualizer
              </span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-stone-600 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              Transform your audio CNN research with professional-grade visualization tools. 
              Explore feature maps, analyze training metrics, and understand your model's behavior.
            </p>
            
                                      <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <Button 
                size="lg" 
                className="group relative overflow-hidden"
                onClick={() => {
                  setShowGetStarted(!showGetStarted);
                  // Smooth scroll to the features section
                  if (!showGetStarted) {
                    document.getElementById('features-section')?.scrollIntoView({ 
                      behavior: 'smooth' 
                    });
                  }
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Get Started</span>
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-300 ${showGetStarted ? 'rotate-180' : ''}`} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="group relative overflow-hidden"
                onClick={() => setShowDocumentation(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-stone-100 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">View Documentation</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features-section" className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Choose Your Analysis
          </h2>
          <p className="mt-4 text-lg text-stone-600 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            Select the type of analysis you want to perform
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Audio Analysis Card */}
          <Link href="/audio-analysis" className="group">
            <Card className="relative h-full cursor-pointer overflow-hidden border-0 bg-white/60 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 group-hover:scale-[1.02] group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-purple-50/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                    <Music className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="text-2xl font-bold text-stone-900">
                  Audio Analysis
                </CardTitle>
                <p className="text-stone-600">
                  Upload audio files and explore CNN feature maps in real-time
                </p>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-stone-700">Interactive feature map visualization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-stone-700">Real-time audio playback with synchronization</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-stone-700">Zoom, pan, and export high-resolution maps</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="text-sm text-stone-700">Model predictions with confidence scores</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Zap className="mr-1 h-3 w-3" />
                    Real-time
                  </Badge>
                  <span className="text-sm text-stone-500">Upload WAV files</span>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Training Analysis Card */}
          <Link href="/training-analysis" className="group">
            <Card className="relative h-full cursor-pointer overflow-hidden border-0 bg-white/60 backdrop-blur-md transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/30 group-hover:scale-[1.02] group-hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-pink-50/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="relative">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1" />
                </div>
                <CardTitle className="text-2xl font-bold text-stone-900">
                  Training Analysis
                </CardTitle>
                <p className="text-stone-600">
                  Monitor training progress and analyze model performance metrics
                </p>
              </CardHeader>
              <CardContent className="relative">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-sm text-stone-700">Live TensorBoard integration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-sm text-stone-700">Interactive training curves and metrics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-sm text-stone-700">Overfitting analysis and convergence tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <span className="text-sm text-stone-700">Multi-run comparison and data export</span>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    Analytics
                  </Badge>
                  <span className="text-sm text-stone-500">View training logs</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center group cursor-pointer p-6 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 relative">
            <div className="absolute top-2 right-2 text-blue-400/40 group-hover:text-blue-500 transition-colors duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-stone-900 group-hover:text-blue-600 transition-colors duration-300">50+</div>
            <div className="text-sm text-stone-600 group-hover:text-stone-700 transition-colors duration-300">Audio Classes</div>
            <div className="mt-2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="text-center group cursor-pointer p-6 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 relative">
            <div className="absolute top-2 right-2 text-purple-400/40 group-hover:text-purple-500 transition-colors duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-stone-900 group-hover:text-purple-600 transition-colors duration-300">10x</div>
            <div className="text-sm text-stone-600 group-hover:text-stone-700 transition-colors duration-300">Zoom Capability</div>
            <div className="mt-2 w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="text-center group cursor-pointer p-6 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 relative">
            <div className="absolute top-2 right-2 text-green-400/40 group-hover:text-green-500 transition-colors duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-stone-900 group-hover:text-green-600 transition-colors duration-300">Real-time</div>
            <div className="text-sm text-stone-600 group-hover:text-stone-700 transition-colors duration-300">Audio Processing</div>
            <div className="mt-2 w-8 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="text-center group cursor-pointer p-6 rounded-lg hover:bg-white/50 transition-all duration-300 hover:scale-105 relative">
            <div className="absolute top-2 right-2 text-orange-400/40 group-hover:text-orange-500 transition-colors duration-300">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <div className="text-3xl font-bold text-stone-900 group-hover:text-orange-600 transition-colors duration-300">100%</div>
            <div className="text-sm text-stone-600 group-hover:text-stone-700 transition-colors duration-300">Open Source</div>
            <div className="mt-2 w-8 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      {/* Documentation Modal */}
      {showDocumentation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">Documentation</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDocumentation(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Quick Start */}
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center">
                  <Play className="mr-2 h-5 w-5 text-blue-500" />
                  Quick Start
                </h3>
                <div className="space-y-4 text-stone-600">
                  <p>Get started with EchoCNN Visualizer in just a few steps:</p>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Upload a WAV audio file (16kHz recommended)</li>
                    <li>Wait for the model to process and generate predictions</li>
                    <li>Explore the interactive feature maps and visualizations</li>
                    <li>Use the audio player to sync with the visualizations</li>
                  </ol>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                  Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-stone-200 rounded-lg">
                    <h4 className="font-medium text-stone-900 mb-2">Audio Analysis</h4>
                    <ul className="text-sm text-stone-600 space-y-1">
                      <li>• Real-time audio processing</li>
                      <li>• Interactive feature map visualization</li>
                      <li>• Model predictions with confidence scores</li>
                      <li>• Audio playback synchronization</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-stone-200 rounded-lg">
                    <h4 className="font-medium text-stone-900 mb-2">Training Analysis</h4>
                    <ul className="text-sm text-stone-600 space-y-1">
                      <li>• TensorBoard integration</li>
                      <li>• Training metrics visualization</li>
                      <li>• Multi-run comparison</li>
                      <li>• Export capabilities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Technical Details */}
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-4 flex items-center">
                  <Code className="mr-2 h-5 w-5 text-green-500" />
                  Technical Details
                </h3>
                <div className="space-y-4 text-stone-600">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Supported Audio Formats</h4>
                    <p className="text-sm">WAV files with 16kHz sample rate recommended for optimal performance.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Model Architecture</h4>
                    <p className="text-sm">Based on CNN architecture trained on ESC-50 dataset with 50 audio classes.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-2">Visualization Features</h4>
                    <p className="text-sm">Feature maps are normalized and displayed with interactive zoom, pan, and export capabilities.</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-32 border-t border-stone-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-stone-500">
              Built with ❤️ for the Audio ML Community
            </p>
            <p className="mt-2 text-xs text-stone-400">
              Next.js • TypeScript • PyTorch • TensorFlow
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}