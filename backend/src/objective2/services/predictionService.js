import {getFrequentlyUsedLenses, getFrequentlyUsedFrames,} from "../models/predictionModels.js";

// GET Frequently Used Lenses and Frames
export async function fetchPredictionService() {
  const lenses = await getFrequentlyUsedLenses();
  const frames = await getFrequentlyUsedFrames();

  return {
    valid: true,
    data: {
      frequentlyUsedLenses: lenses,
      frequentlyUsedFrames: frames,
    },
  };
}
