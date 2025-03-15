from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from ultralytics import YOLO
import os
import cv2
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = 'C:/Users/user1/Desktop/YOLO_integ/model/best.pt'  # Update this to your model path
CLASSES_PATH = 'C:/Users/user1/Desktop/YOLO_integ/model/classes.txt'  # Update this to your classes file

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load the YOLOv8 model
model = None
class_names = []

def load_model():
    global model, class_names
    try:
        model = YOLO(MODEL_PATH)
        
        # Load class names
        with open(CLASSES_PATH, 'r') as f:
            class_names = [line.strip() for line in f.readlines()]
            
        print(f"Model loaded successfully with {len(class_names)} classes: {class_names}")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file and allowed_file(file.filename):
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Perform detection
        try:
            # Run inference
            results = model.predict(filepath, conf=0.25)
            result = results[0]
            
            # Process results
            detections = []
            for box in result.boxes:
                class_id = int(box.cls.item())
                class_name = class_names[class_id] if class_id < len(class_names) else f"Unknown ({class_id})"
                confidence = box.conf.item()
                bbox = box.xyxy.tolist()[0]  # x1, y1, x2, y2 format
                
                detections.append({
                    'class': class_name,
                    'confidence': round(confidence * 100, 2),
                    'bbox': [round(x) for x in bbox]
                })
            
            # Draw boxes on image
            img = cv2.imread(filepath)
            for det in detections:
                x1, y1, x2, y2 = map(int, det['bbox'])
                label = f"{det['class']} {det['confidence']}%"
                
                # Draw bounding box
                color = (0, 255, 0)  # Green color for bbox
                cv2.rectangle(img, (x1, y1), (x2, y2), color, 2)
                
                # Draw label background
                text_size = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 2)[0]
                cv2.rectangle(img, (x1, y1 - text_size[1] - 10), (x1 + text_size[0], y1), color, -1)
                
                # Put text
                cv2.putText(img, label, (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)
            
            # Save annotated image
            output_path = os.path.join(app.config['UPLOAD_FOLDER'], 'output_' + filename)
            cv2.imwrite(output_path, img)
            
            return jsonify({
                'success': True,
                'detections': detections,
                'output_image': '/'.join([app.config['UPLOAD_FOLDER'], 'output_' + filename]),
                'original_image': '/'.join([app.config['UPLOAD_FOLDER'], filename])
            })
            
        except Exception as e:
            return jsonify({'error': f'Detection failed: {str(e)}'})
    
    return jsonify({'error': 'Invalid file type'})

if __name__ == '__main__':
    # Load model before starting the app
    if load_model():
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load model. Application not started.")