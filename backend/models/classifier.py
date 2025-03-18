import requests
import argparse
import json

def test_flask_api(host, port, text):
    """Test the Flask API"""
    url = f"http://{host}:{port}/predict"
    
    # Check health
    health_url = f"http://{host}:{port}/health"
    try:
        health_response = requests.get(health_url)
        health_data = health_response.json()
        print(f"Health check: {health_data}")
        
        if not health_data.get('model_loaded', False):
            print("Model not loaded. Exiting.")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Health check failed: {e}")
        return False
    
    # Make prediction request
    headers = {'Content-Type': 'application/json'}
    payload = {'text': text}
    
    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        
        if response.status_code == 200:
            result = response.json()
            print("\nPrediction results:")
            print(f"Text: {text}")
            print(f"Predicted defect: {result['predicted_defect']}")
            print(f"Confidence: {result['confidence']:.2f} ({result['confidence']*100:.1f}%)")
            
            print("\nTop predictions:")
            for pred in result['top_predictions']:
                print(f"  - {pred['label']}: {pred['probability']:.2f} ({pred['probability']*100:.1f}%)")
                
            return True
        else:
            print(f"Error: API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return False

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description="Test Client for Defect Classifier API")
    parser.add_argument("--host", default="localhost", help="API server host")
    parser.add_argument("--port", type=int, default=5000, help="API server port")
    parser.add_argument("--fastapi", action="store_true", help="Use FastAPI port (8000) instead of Flask port")
    parser.add_argument("--text", default="This component is showing signs of thread error and holes", 
                        help="Text to classify")
    
    args = parser.parse_args()
    
    # Adjust port if using FastAPI
    port = 8000 if args.fastapi else args.port
    
    # Test the API
    test_flask_api(args.host, port, args.text)

if __name__ == "__main__":
    main()