#!/usr/bin/env python3
"""
Convert TensorBoard logs to static JSON for production deployment
This creates a complete static version of TensorBoard data
"""

import json
import os
import glob
from tensorflow.python.summary.summary_iterator import summary_iterator
from typing import Dict, List, Any

def extract_all_tensorboard_data(log_dir: str) -> Dict[str, Any]:
    """
    Extract all data from TensorBoard logs and convert to static format
    """
    all_data = {
        'runs': {},
        'summary': {
            'total_runs': 0,
            'available_metrics': [],
            'date_range': {}
        }
    }
    
    # Find all TensorBoard event files
    event_files = glob.glob(f"{log_dir}/**/events.out.tfevents*", recursive=True)
    
    for event_file in event_files:
        run_name = os.path.basename(os.path.dirname(event_file))
        print(f"Processing run: {run_name}")
        
        run_data = {
            'metrics': {},
            'metadata': {
                'file_path': event_file,
                'total_steps': 0,
                'start_time': None,
                'end_time': None
            }
        }
        
        try:
            for event in summary_iterator(event_file):
                if event.HasField('summary'):
                    step = event.step
                    wall_time = event.wall_time
                    
                    # Update metadata
                    if run_data['metadata']['start_time'] is None:
                        run_data['metadata']['start_time'] = wall_time
                    run_data['metadata']['end_time'] = wall_time
                    run_data['metadata']['total_steps'] = max(run_data['metadata']['total_steps'], step)
                    
                    for value in event.summary.value:
                        tag = value.tag
                        if value.HasField('simple_value'):
                            val = value.simple_value
                            
                            if tag not in run_data['metrics']:
                                run_data['metrics'][tag] = {
                                    'steps': [],
                                    'values': [],
                                    'wall_times': []
                                }
                            
                            run_data['metrics'][tag]['steps'].append(step)
                            run_data['metrics'][tag]['values'].append(val)
                            run_data['metrics'][tag]['wall_times'].append(wall_time)
                            
                            # Track available metrics
                            if tag not in all_data['summary']['available_metrics']:
                                all_data['summary']['available_metrics'].append(tag)
        
        except Exception as e:
            print(f"Error processing {event_file}: {e}")
            continue
        
        all_data['runs'][run_name] = run_data
        all_data['summary']['total_runs'] += 1
    
    # Add date range summary
    if all_data['runs']:
        all_start_times = [run['metadata']['start_time'] for run in all_data['runs'].values() if run['metadata']['start_time']]
        all_end_times = [run['metadata']['end_time'] for run in all_data['runs'].values() if run['metadata']['end_time']]
        
        if all_start_times and all_end_times:
            all_data['summary']['date_range'] = {
                'earliest': min(all_start_times),
                'latest': max(all_end_times)
            }
    
    return all_data

def create_tensorboard_static_files(log_dir: str, output_dir: str = "public/tensorboard_data"):
    """
    Create static files for TensorBoard data
    """
    print("Extracting TensorBoard data...")
    all_data = extract_all_tensorboard_data(log_dir)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save complete data
    with open(f"{output_dir}/all_tensorboard_data.json", 'w') as f:
        json.dump(all_data, f, indent=2)
    
    # Save individual run data for better performance
    for run_name, run_data in all_data['runs'].items():
        safe_name = run_name.replace('/', '_').replace('\\', '_')
        with open(f"{output_dir}/run_{safe_name}.json", 'w') as f:
            json.dump(run_data, f, indent=2)
    
    # Create summary file
    summary = {
        'total_runs': all_data['summary']['total_runs'],
        'available_metrics': all_data['summary']['available_metrics'],
        'runs': list(all_data['runs'].keys()),
        'date_range': all_data['summary']['date_range']
    }
    
    with open(f"{output_dir}/summary.json", 'w') as f:
        json.dump(summary, f, indent=2)
    
    # Also update the summary in all_tensorboard_data.json
    all_data['summary']['runs'] = list(all_data['runs'].keys())
    
    print(f"✅ Created static TensorBoard data in {output_dir}/")
    print(f"📊 Total runs: {all_data['summary']['total_runs']}")
    print(f"📈 Available metrics: {', '.join(all_data['summary']['available_metrics'])}")
    print(f"🏃 Available runs: {', '.join(all_data['summary']['runs'])}")
    
    return all_data

def main():
    """
    Main function to convert TensorBoard logs to static files
    """
    log_dir = "tensorboard_logs"
    output_dir = "public/tensorboard_data"
    
    if not os.path.exists(log_dir):
        print(f"❌ Log directory not found: {log_dir}")
        return
    
    create_tensorboard_static_files(log_dir, output_dir)
    
    print("\n🚀 Static TensorBoard data ready for deployment!")
    print("📁 Files created:")
    print(f"   - {output_dir}/all_tensorboard_data.json")
    print(f"   - {output_dir}/summary.json")
    print(f"   - {output_dir}/run_*.json (individual runs)")

if __name__ == "__main__":
    main() 