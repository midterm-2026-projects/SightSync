import { useEffect, useState } from "react";
import FrequentlyUsedLenses from "./FrequentlyUsedLenses";
import FrequentlyUsedFrames from "./FrequentlyUsedFrames";

export default function PredictionDashboard() {
  const [prediction, setPrediction] = useState({
    frequentlyUsedLenses: [],
    frequentlyUsedFrames: [],
  });

  useEffect(() => {
    fetch("http://localhost:5000/prediction")
        .then((response) => response.json())
        .then((data) => {
        console.log("Prediction Response:", data);
        setPrediction(data);
        })
      .catch((error) => {
        console.error("Failed to fetch prediction data:", error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800">
        Prediction Dashboard
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        AI-based prediction of frequently used lenses and frames.
      </p>

            <FrequentlyUsedFrames
        frames={prediction.frequentlyUsedFrames}
        />

            <FrequentlyUsedLenses
        lenses={prediction.frequentlyUsedLenses}
        />
    </div>
  );
}