#!/bin/bash

# EchoCNN Audio Visualizer - Simple Development Setup Script
# This script sets up the basic development environment without TensorFlow dependency

echo "🎵 Setting up EchoCNN Audio Visualizer (Simple Mode)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the echocnn-visualiser directory"
    exit 1
fi

print_status "Setting up basic development environment..."

# Step 1: Copy TensorBoard logs if they exist in parent directory
if [ -d "../tensorboard_logs" ]; then
    print_status "Copying TensorBoard logs..."
    cp -r ../tensorboard_logs .
    print_success "TensorBoard logs copied"
else
    print_warning "No tensorboard_logs found in parent directory"
fi

# Step 2: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Node.js dependencies already installed"
fi

# Step 3: Start TensorBoard server in background (if logs exist)
print_status "Starting TensorBoard server..."
if [ -d "tensorboard_logs" ]; then
    # Check if tensorboard is available
    if command -v tensorboard &> /dev/null; then
        # Kill any existing TensorBoard processes
        pkill -f tensorboard 2>/dev/null || true
        
        # Start TensorBoard
        tensorboard --logdir=tensorboard_logs --port=6006 --host=0.0.0.0 > tensorboard.log 2>&1 &
        TB_PID=$!
        
        # Wait a moment for TensorBoard to start
        sleep 3
        
        # Check if TensorBoard is running
        if curl -s http://localhost:6006 > /dev/null; then
            print_success "TensorBoard server started (PID: $TB_PID)"
            echo $TB_PID > tensorboard.pid
        else
            print_warning "TensorBoard server may not have started properly"
            print_warning "Check tensorboard.log for details"
        fi
    else
        print_warning "TensorBoard not found. Install with: pip install tensorboard"
        print_warning "You can still use the app without TensorBoard"
    fi
else
    print_warning "No tensorboard_logs found - TensorBoard server not started"
fi

print_success "Basic development setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo ""
if [ -d "tensorboard_logs" ]; then
    echo "📊 TensorBoard Dashboard: http://localhost:6006 (if available)"
fi
echo ""
echo "💡 For full TensorBoard data conversion:"
echo "   pip install tensorflow"
echo "   python convert_tensorboard_to_static.py"
echo ""
echo "To stop TensorBoard: pkill -f tensorboard"
echo "To view TensorBoard logs: tail -f tensorboard.log" 