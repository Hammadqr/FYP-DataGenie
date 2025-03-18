import os
import cv2
import base64
from ultralytics import YOLO
from werkzeug.utils import secure_filename

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MODEL_PATH = 'C:/Users/user1/Desktop/FYP_DataGenie/backend/best.pt'  # Update this path
CLASSES_PATH = 'C:/Users/user1/Desktop/FYP_DataGenie/backend/classes.txt'  # Update this path

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

class YOLOInference:
    def __init__(self):
        self.model = YOLO(MODEL_PATH)
        with open(CLASSES_PATH, 'r') as f:
            self.class_names = [line.strip() for line in f.readlines()]

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def detect(self, file):
        """Process the uploaded image and run YOLO detection"""
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(UPLOAD_FOLDER, filename)
            file.save(file_path)

            # Run YOLO inference
            results = self.model(file_path)
            detections = []
            img = cv2.imread(file_path)

            for result in results:
                for box in result.boxes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    cls = int(box.cls[0])
                    conf = float(box.conf[0]) * 100
                    detections.append({
                        'class': self.class_names[cls],
                        'confidence': f"{conf:.2f}%",
                        'bbox': [x1, y1, x2, y2]
                    })

                    # Draw bounding boxes
                    cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(img, f"{self.class_names[cls]}: {conf:.2f}%", (x1, y1 - 10),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

            output_path = os.path.join(UPLOAD_FOLDER, "output_" + filename)
            cv2.imwrite(output_path, img)

            return {
                'original_image': f"/static/uploads/{filename}",
                'output_image': f"/static/uploads/output_{filename}",
                'detections': detections
            }

        return {'error': 'Invalid file type'}
