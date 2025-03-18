from flask import Flask, request, jsonify
import joblib
from sentence_transformers import SentenceTransformer
import argparse

class DefectClassifier:
    """A wrapper class for the SVM defect classifier"""
    
    def __init__(self, svm_model=None, embedding_model_name="all-MiniLM-L6-v2"):
        self.svm_model = svm_model
        self._embedding_model_name = embedding_model_name
        self._embedding_model = None
        
    @property
    def embedding_model(self):
        """Lazy-load the embedding model when needed"""
        if self._embedding_model is None:
            print("Loading embedding model...")
            self._embedding_model = SentenceTransformer(self._embedding_model_name)
        return self._embedding_model
    
    @classmethod
    def load(cls, model_path):
        """Load a saved model"""
        print(f"Loading model from {model_path}...")
        model_data = joblib.load(model_path)
        instance = cls(
            svm_model=model_data['svm_model'],
            embedding_model_name=model_data['embedding_model_name']
        )
        return instance
    
    def classify_single(self, text):
        """Classify a single text input"""
        print("Generating text embedding...")
        input_embedding = self.embedding_model.encode([text])
        
        print("Predicting defect...")
        probabilities = self.svm_model.predict_proba(input_embedding)[0]
        predicted_label = self.svm_model.classes_[probabilities.argmax()]
        confidence = probabilities.max()
        
        # Get top 3 predictions with probabilities
        top_indices = probabilities.argsort()[-3:][::-1]
        top_predictions = [
            (self.svm_model.classes_[i], probabilities[i])
            for i in top_indices
        ]
        
        return predicted_label, confidence, top_predictions

# Initialize Flask app
app = Flask(__name__)

# Global variable to store the model
model = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint to make predictions"""
    if model is None:
        return jsonify({"error": "Model not loaded"}), 503
    
    # Get the JSON data from the request
    data = request.json
    
    # Check if the text field is present
    if 'text' not in data:
        return jsonify({"error": "Missing 'text' field in request"}), 400
    
    try:
        # Get the text from the request
        text = data['text']
        
        # Make prediction
        predicted_label, confidence, top_predictions = model.classify_single(text)
        
        # Format the top predictions
        formatted_predictions = [
            {"label": label, "probability": float(prob)}
            for label, prob in top_predictions
        ]
        
        # Return the prediction results
        return jsonify({
            "predicted_defect": predicted_label,
            "confidence": float(confidence),
            "top_predictions": formatted_predictions
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def load_model(model_path):
    """Load the model into the global variable"""
    global model
    try:
        model = DefectClassifier.load(model_path)
        print("Model loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
        return False
    return True

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Defect Classifier API")
    parser.add_argument("--model", default="defect_classifier.joblib", 
                        help="Path to the defect classifier model file")
    parser.add_argument("--port", type=int, default=5000, 
                        help="Port to run the API server on")
    parser.add_argument("--host", default="0.0.0.0", 
                        help="Host to run the API server on")
    parser.add_argument("--debug", action="store_true", 
                        help="Run in debug mode")
    
    args = parser.parse_args()
    
    # Load the model
    if not load_model(args.model):
        return 1
    
    # Run the Flask app
    print(f"Starting API server on {args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=args.debug)
    
    return 0

if __name__ == "__main__":
    main()