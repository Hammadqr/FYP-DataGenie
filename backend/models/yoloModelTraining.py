import os
import yaml
from google.colab import drive
import shutil
from ultralytics import YOLO
import cv2
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# Mount Google Drive
drive.mount('/content/drive')

# Set path to your dataset folder in Drive
DATASET_PATH = '/content/drive/MyDrive/dataset'  # Update this path
# Verify dataset structure
print("Checking dataset structure...")
for split in ['train', 'test', 'valid']:
    images_path = os.path.join(DATASET_PATH, split, 'images')
    labels_path = os.path.join(DATASET_PATH, split, 'labels')

    if os.path.exists(images_path) and os.path.exists(labels_path):
        num_images = len([f for f in os.listdir(images_path) if f.endswith(('.jpg', '.jpeg', '.png'))])
        num_labels = len([f for f in os.listdir(labels_path) if f.endswith('.txt')])
        print(f"{split}: {num_images} images, {num_labels} labels")
    else:
        print(f"Warning: Could not find {split}/images or {split}/labels directories")

# Function to read classes from existing data.yaml file
def read_yaml_classes(dataset_path):
    # Look for data.yaml file in the dataset_path and its parent directory
    yaml_paths = [
        os.path.join(dataset_path, 'data.yaml'),
        os.path.join(dataset_path, 'data.yml'),
        os.path.join(os.path.dirname(dataset_path), 'data.yaml'),
        os.path.join(os.path.dirname(dataset_path), 'data.yml')
    ]

    for yaml_path in yaml_paths:
        if os.path.exists(yaml_path):
            with open(yaml_path, 'r') as f:
                data = yaml.safe_load(f)

            # Extract class names and count
            class_names = data.get('names', [])
            num_classes = data.get('nc', len(class_names))

            print(f"Read {num_classes} classes from {os.path.basename(yaml_path)}:")
            print(class_names)

            return class_names, num_classes, yaml_path

    print(f"Warning: data.yaml or data.yml not found in or above {dataset_path}")
    return None, None, None

# Read classes from existing data.yaml/yml
class_names, num_classes, yaml_path = read_yaml_classes(DATASET_PATH)

# If no yaml file was found
if class_names is None:
    print("Error: Could not find data.yaml or data.yml file")
    # You might want to exit here or handle this case
else:
    # Verify dataset structure
    print("Checking dataset structure...")
    for split in ['train', 'test', 'valid']:
        images_path = os.path.join(DATASET_PATH, split, 'images')
        labels_path = os.path.join(DATASET_PATH, split, 'labels')

        if os.path.exists(images_path) and os.path.exists(labels_path):
            num_images = len([f for f in os.listdir(images_path) if f.endswith(('.jpg', '.jpeg', '.png'))])
            num_labels = len([f for f in os.listdir(labels_path) if f.endswith('.txt')])
            print(f"{split}: {num_images} images, {num_labels} labels")
        else:
            print(f"Warning: Could not find {split}/images or {split}/labels directories")

    print(f"Using existing YAML configuration at {yaml_path}")

def analyze_labels(dataset_path):
        all_classes = set()

        for split in ['train', 'test', 'valid']:
            labels_dir = os.path.join(dataset_path, split, 'labels')
            if not os.path.exists(labels_dir):
                continue

            for label_file in os.listdir(labels_dir):
                if not label_file.endswith('.txt'):
                    continue

                with open(os.path.join(labels_dir, label_file), 'r') as f:
                    for line in f:
                        parts = line.strip().split()
                        if len(parts) >= 5:  # class_id x_center y_center width height
                            class_id = int(parts[0])
                            all_classes.add(class_id)

        return sorted(list(all_classes))

    # Analyze dataset to determine classes
classes = analyze_labels(DATASET_PATH)
print(f"Detected classes: {classes}")

# Generate generic class names
class_names = [f"defect_{i}" for i in range(len(classes))]
num_classes = len(class_names)

# Create YAML configuration file for YOLOv8
data_yaml = {
    'path': DATASET_PATH,
    'train': os.path.join('train', 'images'),
    'val': os.path.join('valid', 'images'),
    'test': os.path.join('test', 'images'),
    'nc': len(classes),
    'names': class_names
}

# Initialize and train YOLOv8 model
def train_yolov8(yaml_path, epochs=100, img_size=640, batch_size=16, patience=20):
    # Initialize model
    model = YOLO('yolov8n.pt')  # Start with a pre-trained YOLOv8 nano model

    # Create project directory with a distinct name to avoid conflicts
    project_dir = '/content/fabric_defect_detection'

    # Train the model
    results = model.train(
        data=yaml_path,
        epochs=epochs,
        imgsz=img_size,
        batch=batch_size,
        patience=patience,
        device=0,  # Use GPU
        project=project_dir,
        name='yolov8_fabric_model',
        save=True,
        verbose=True
    )

    # The trained model is saved to {project_dir}/{name}/weights/best.pt
    best_model_path = os.path.join(project_dir, 'yolov8_fabric_model', 'weights', 'best.pt')

    # Load the best model for prediction
    best_model = YOLO(best_model_path)

    return best_model

# Train the model
print("Starting YOLOv8 training...")
model = train_yolov8(yaml_path)
print("Training completed.")

#Function to visualize multiple bounding boxes on an image
def visualize_predictions(model, image_path, conf_threshold=0.25):
    # Load image
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Perform inference
    results = model.predict(image_path, conf=conf_threshold)

    # Plot results
    plt.figure(figsize=(12, 12))
    plt.imshow(results[0].plot())
    plt.axis('off')
    plt.title('YOLOv8 Detection Results')
    plt.show()

    # Return detailed results
    return results[0]

# Test on a sample image with multiple bounding boxes
def test_on_sample(model, test_image_path=None):
    if test_image_path is None:
        # Get a random test image if none provided
        test_dir = os.path.join(DATASET_PATH, 'test', 'images')
        test_images = [f for f in os.listdir(test_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        if test_images:
            test_image_path = os.path.join(test_dir, np.random.choice(test_images))
        else:
            print("No test images found")
            return

    print(f"Testing model on: {test_image_path}")
    results = visualize_predictions(model, test_image_path)

    # Print detection details
    boxes = results.boxes
    print(f"Found {len(boxes)} objects")

    for i, box in enumerate(boxes):
        cls = int(box.cls.item())
        conf = box.conf.item()
        coords = box.xyxy.tolist()[0]  # Convert to [x1, y1, x2, y2] format

        print(f"Detection {i+1}:")
        print(f"  Class: {class_names[cls]} (ID: {cls})")
        print(f"  Confidence: {conf:.4f}")
        print(f"  Coordinates: {coords}")

# Export the model for deployment
def export_model(model, format='onnx'):
    model.export(format=format)
    print(f"Model exported to {format} format")

# Plot training results (accessing CSV files instead of model.results)
def plot_training_results():
    # Path to results CSV files
    results_dir = '/content/fabric_defect_detection/yolov8_fabric_model'
    results_csv = os.path.join(results_dir, 'results.csv')

    if os.path.exists(results_csv):
        import pandas as pd

        # Read training results
        results_df = pd.read_csv(results_csv)

        # Plot metrics
        plt.figure(figsize=(20, 15))

        # Loss plots
        plt.subplot(2, 2, 1)
        plt.plot(results_df['epoch'], results_df['train/box_loss'], label='train box loss')
        plt.plot(results_df['epoch'], results_df['val/box_loss'], label='val box loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.title('Box Loss')
        plt.legend()

        plt.subplot(2, 2, 2)
        plt.plot(results_df['epoch'], results_df['train/cls_loss'], label='train cls loss')
        plt.plot(results_df['epoch'], results_df['val/cls_loss'], label='val cls loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.title('Class Loss')
        plt.legend()
"""
       # Metrics
        plt.subplot(2, 2, 3)
        plt.plot(results_df['epoch'], results_df['metrics/precision'], label='precision')
        plt.plot(results_df['epoch'], results_df['metrics/recall'], label='recall')
        plt.xlabel('Epoch')
        plt.ylabel('Value')
        plt.title('Precision & Recall')
        plt.legend()

        plt.subplot(2, 2, 4)
        plt.plot(results_df['epoch'], results_df['metrics/mAP50'], label='mAP50')
        plt.plot(results_df['epoch'], results_df['metrics/mAP50-95'], label='mAP50-95')
        plt.xlabel('Epoch')
        plt.ylabel('Value')
        plt.title('mAP')
        plt.legend()

        plt.tight_layout()
        plt.show()
    else:
        print(f"Results CSV not found at {results_csv}")

# Plot the training results
plot_training_results()
"""

# Run test on your sample image with multiple bounding boxes
# Replace with the path to your sample image
sample_image_path = '/content/image_212.jpg'
test_on_sample(model, sample_image_path)

# Export model
export_model(model)
# Define a function to save the model for deployment
def save_model_for_deployment(model, save_path='changetodesiredpath'):
    # Create directory if it doesn't exist
    os.makedirs(save_path, exist_ok=True)

    # Export the model in different formats
    print("Exporting model to ONNX format...")
    model.export(format='onnx')  # ONNX format for cross-platform

    print("Exporting model to PyTorch format...")
    model.export(format='torchscript')  # TorchScript for deployment

    # Save the model in the native format
    print("Saving model in native format...")
    shutil.copy(os.path.join('/content/fabric_defect_detection/yolov8_fabric_model/weights/best.pt'),
                os.path.join(save_path, 'best.pt'))

    # Save class names
    with open(os.path.join(save_path, 'classes.txt'), 'w') as f:
        for class_name in class_names:
            f.write(f"{class_name}\n")

    print(f"Model and class names saved to {save_path}")
    return save_path

# After training, save the model
save_path = save_model_for_deployment(model)
print(f"Model ready for Flask deployment at: {save_path}")