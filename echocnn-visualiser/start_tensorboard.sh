#!/bin/bash

# Start TensorBoard with the training logs
echo "Starting TensorBoard..."
echo "Log directory: tensorboard_logs/run_20250721_120620"
echo "Access TensorBoard at: http://localhost:6006"
echo ""

# Start TensorBoard in the background
tensorboard --logdir=tensorboard_logs --port=6006 --host=0.0.0.0 &

# Get the process ID
TB_PID=$!

echo "TensorBoard started with PID: $TB_PID"
echo "To stop TensorBoard, run: kill $TB_PID"
echo ""

# Wait for user to stop
echo "Press Ctrl+C to stop TensorBoard"
wait $TB_PID 