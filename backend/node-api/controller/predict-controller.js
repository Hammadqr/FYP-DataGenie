import axios from "axios";

const FLASK_API_URL = "http://localhost:5050"; // Ensure Flask is running here

// Check Flask API health
export const checkHealth = async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/health`);
        console.log("Health check response:", response.data);

        if (!response.data.model_loaded) {
            console.error("Model is not loaded on the Flask server.");
            return res.status(500).json({ error: "Model is not loaded on the Flask server." });
        }

        res.json({ message: "Flask server is healthy", model_loaded: true });
    } catch (error) {
        console.error("Error checking health:", error.message);
        res.status(500).json({ error: "Failed to connect to Flask server" });
    }
};

// Get prediction from Flask API
export const getPrediction = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Missing 'text' field in request" });
        }

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

        res.json(response.data);
    } catch (error) {
        console.error("Error making prediction:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to get prediction from AI model" });
    }
};
