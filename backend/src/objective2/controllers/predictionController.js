import { fetchPredictionService } from "../services/predictionService.js";

// GET Prediction
export async function getPrediction(req, res) {
  try {
    const result = await fetchPredictionService();

    return res.status(200).json(result.data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
    message: "Failed to fetch prediction data.",
    
    });
  }
}