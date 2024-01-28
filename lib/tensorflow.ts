import { VERSION } from '@mediapipe/hands';
import {
  SupportedModels,
  MediaPipeHandsMediaPipeModelConfig,
  createDetector,
} from '@tensorflow-models/hand-pose-detection';

export async function createTensorflowDetector() {
  const model = SupportedModels.MediaPipeHands;
  const detectorConfig: MediaPipeHandsMediaPipeModelConfig = {
    runtime: 'mediapipe',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}`,
    modelType: 'full',
    maxHands: 1,
  };

  try {
    return await createDetector(model, detectorConfig);
  } catch (error) {
    console.error(error);
  }
}
