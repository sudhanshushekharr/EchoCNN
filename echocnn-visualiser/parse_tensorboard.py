#!/usr/bin/env python3
"""
TensorBoard Log Parser for EchoCNN Audio Visualizer
Extracts training metrics from TensorBoard event files
"""

import json
import os
from tensorflow.python.summary.summary_iterator import summary_iterator
from typing import Dict, List, Any

def parse_tensorboard_logs(log_file_path: str) -> Dict[str, Any]:
    """
    Parse TensorBoard event file and extract training metrics
    """
    training_data = {
        'steps': [],
        'train_loss': [],
        'val_loss': [],
        'val_accuracy': [],
        'learning_rate': [],
        'wall_time': []
    }
    
    try:
        for event in summary_iterator(log_file_path):
            if event.HasField('summary'):
                step = event.step
                wall_time = event.wall_time
                
                for value in event.summary.value:
                    tag = value.tag
                    if value.HasField('simple_value'):
                        val = value.simple_value
                        
                        if tag == "Loss/Train":
                            training_data['train_loss'].append(val)
                            training_data['steps'].append(step)
                            training_data['wall_time'].append(wall_time)
                        elif tag == "Loss/Validation":
                            training_data['val_loss'].append(val)
                        elif tag == "Accuracy/Validation":
                            training_data['val_accuracy'].append(val)
                        elif tag == "Learning_Rate":
                            training_data['learning_rate'].append(val)
    
    except Exception as e:
        print(f"Error parsing TensorBoard logs: {e}")
        return None
    
    # Ensure all arrays have the same length
    min_length = min(len(training_data['steps']), len(training_data['val_loss']), 
                    len(training_data['val_accuracy']), len(training_data['learning_rate']))
    
    # Trim arrays to same length
    for key in training_data:
        training_data[key] = training_data[key][:min_length]
    
    return training_data

def analyze_training_performance(training_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze training performance and extract insights
    """
    if not training_data or not training_data['steps']:
        return None
    
    steps = training_data['steps']
    train_loss = training_data['train_loss']
    val_loss = training_data['val_loss']
    val_accuracy = training_data['val_accuracy']
    learning_rate = training_data['learning_rate']
    
    # Calculate final metrics
    final_train_loss = train_loss[-1] if train_loss else None
    final_val_loss = val_loss[-1] if val_loss else None
    final_val_accuracy = val_accuracy[-1] if val_accuracy else None
    best_val_accuracy = max(val_accuracy) if val_accuracy else None
    best_val_accuracy_step = steps[val_accuracy.index(best_val_accuracy)] if val_accuracy else None
    
    # Calculate convergence metrics
    convergence_analysis = {
        'total_epochs': len(steps),
        'final_train_loss': final_train_loss,
        'final_val_loss': final_val_loss,
        'final_val_accuracy': final_val_accuracy,
        'best_val_accuracy': best_val_accuracy,
        'best_val_accuracy_step': best_val_accuracy_step,
        'learning_rate_decay': {
            'initial_lr': learning_rate[0] if learning_rate else None,
            'final_lr': learning_rate[-1] if learning_rate else None,
            'decay_factor': learning_rate[-1] / learning_rate[0] if learning_rate and learning_rate[0] > 0 else None
        }
    }
    
    # Check for overfitting
    if len(train_loss) > 10 and len(val_loss) > 10:
        recent_train_loss = train_loss[-10:]
        recent_val_loss = val_loss[-10:]
        train_trend = sum(recent_train_loss) / len(recent_train_loss)
        val_trend = sum(recent_val_loss) / len(recent_val_loss)
        
        convergence_analysis['overfitting_analysis'] = {
            'train_trend': train_trend,
            'val_trend': val_trend,
            'gap': val_trend - train_trend,
            'is_overfitting': val_trend > train_trend * 1.1  # 10% threshold
        }
    
    return {
        'training_data': training_data,
        'analysis': convergence_analysis
    }

def main():
    """
    Main function to parse logs and generate JSON output
    """
    # Path to your TensorBoard log file
    log_file_path = "tensorboard_logs/run_20250721_120620/events.out.tfevents.1753099580.modal.2.0"
    
    if not os.path.exists(log_file_path):
        print(f"Log file not found: {log_file_path}")
        return
    
    # Parse the logs
    training_data = parse_tensorboard_logs(log_file_path)
    
    if not training_data:
        print("Failed to parse training data")
        return
    
    # Analyze performance
    analysis_result = analyze_training_performance(training_data)
    
    if not analysis_result:
        print("Failed to analyze training performance")
        return
    
    # Save to JSON file
    output_file = "training_analysis.json"
    with open(output_file, 'w') as f:
        json.dump(analysis_result, f, indent=2)
    
    print(f"Training analysis saved to {output_file}")
    print(f"Total epochs: {analysis_result['analysis']['total_epochs']}")
    print(f"Best validation accuracy: {analysis_result['analysis']['best_val_accuracy']:.2f}%")
    print(f"Final validation accuracy: {analysis_result['analysis']['final_val_accuracy']:.2f}%")

if __name__ == "__main__":
    main() 