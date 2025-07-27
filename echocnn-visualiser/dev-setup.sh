#!/bin/bash

# EchoCNN Audio Visualizer - Development Setup Script
# This script sets up everything needed for development

echo "🎵 Setting up EchoCNN Audio Visualizer for development..."

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

print_status "Setting up development environment..."

# Step 1: Copy TensorBoard logs if they exist in parent directory
if [ -d "../tensorboard_logs" ]; then
    print_status "Copying TensorBoard logs..."
    cp -r ../tensorboard_logs .
    print_success "TensorBoard logs copied"
else
    print_warning "No tensorboard_logs found in parent directory"
fi

# Step 2: Convert TensorBoard data to static JSON
if [ -d "tensorboard_logs" ]; then
    print_status "Converting TensorBoard data to static JSON..."
    
    # Check if TensorFlow is installed
    if ! python -c "import tensorflow" 2>/dev/null; then
        print_warning "TensorFlow not found. Installing..."
        pip install tensorflow
        if [ $? -ne 0 ]; then
            print_error "Failed to install TensorFlow. Please install manually: pip install tensorflow"
            print_warning "Skipping TensorBoard conversion..."
        else
            print_success "TensorFlow installed successfully"
        fi
    fi
    
    # Try conversion if TensorFlow is available
    if python -c "import tensorflow" 2>/dev/null; then
        if python convert_tensorboard_to_static.py; then
            print_success "TensorBoard data converted successfully"
        else
            print_error "Failed to convert TensorBoard data"
            print_warning "Continuing without static data conversion..."
        fi
    else
        print_warning "TensorFlow not available - skipping static data conversion"
        print_warning "You can still use local TensorBoard server"
    fi
else
    print_warning "No tensorboard_logs directory found - skipping conversion"
fi

# Step 3: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
    print_success "Dependencies installed"
else
    print_status "Node.js dependencies already installed"
fi

# Step 4: Start TensorBoard server in background
print_status "Starting TensorBoard server..."
if [ -d "tensorboard_logs" ]; then
    # Kill any existing TensorBoard processes
    pkill -f tensorboard 2>/dev/null || true
    
    # Start TensorBoard
    tensorboard --logdir=tensorboard_logs --port=6006 --host=0.0.0.0 > tensorboard.log 2>&1 &
    TB_PID=$!
    
    # Wait longer for TensorBoard to start
    print_status "Waiting for TensorBoard to start..."
    sleep 5
    
    # Check if TensorBoard is running with retries
    MAX_RETRIES=3
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if curl -s http://localhost:6006 > /dev/null 2>&1; then
            print_success "TensorBoard server started (PID: $TB_PID)"
            echo $TB_PID > tensorboard.pid
            break
        else
            RETRY_COUNT=$((RETRY_COUNT + 1))
            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                print_status "Retrying TensorBoard check... ($RETRY_COUNT/$MAX_RETRIES)"
                sleep 2
            else
                print_warning "TensorBoard may still be starting up"
                print_warning "Check manually: http://localhost:6006"
                print_warning "Or check logs: tail -f tensorboard.log"
            fi
        fi
    done
else
    print_warning "No tensorboard_logs found - TensorBoard server not started"
fi

# Step 5: Start Next.js development server
print_status "Starting Next.js development server..."
print_success "Development setup complete!"
echo ""
echo "🚀 Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Toggle 'Development Mode' in the app to use local TensorBoard"
echo ""
echo "📊 TensorBoard Dashboard: http://localhost:6006"
echo "📁 Static data available at: /tensorboard_data/"
echo ""
echo "To stop TensorBoard: pkill -f tensorboard"
echo "To view TensorBoard logs: tail -f tensorboard.log" 