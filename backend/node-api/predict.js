import axios from 'axios';

const FLASK_API_URL = 'http://localhost:5000'; // Change this if your Flask API is hosted elsewhere

async function checkHealth() {
    try {
        const response = await axios.get(`${FLASK_API_URL}/health`);
        console.log("Health check response:", response.data);
        
        if (!response.data.model_loaded) {
            console.error("Model is not loaded on the Flask server.");
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error checking health:", error.message);
        return false;
    }
}

async function getPrediction(text) {
    try {
        const response = await axios.post(`${FLASK_API_URL}/predict`, { text }, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log("\nPrediction results:");
        console.log(`Text: ${text}`);
        console.log(`Predicted defect: ${response.data.predicted_defect}`);
        console.log(`Confidence: ${(response.data.confidence * 100).toFixed(1)}%`);

        console.log("\nTop Predictions:");
        response.data.top_predictions.forEach(prediction => {
            console.log(`  - ${prediction.label}: ${(prediction.probability * 100).toFixed(1)}%`);
        });

    } catch (error) {
        console.error("Error making prediction:", error.response ? error.response.data : error.message);
    }
}

(async () => {
    const isHealthy = await checkHealth();
    if (isHealthy) {
        await getPrediction("This component is showing signs of thread error and holes");
    }
})();
