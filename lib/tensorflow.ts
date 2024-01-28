import { VERSION } from '@mediapipe/hands';
import {
  SupportedModels,
  MediaPipeHandsMediaPipeModelConfig,
  createDetector,
  HandDetector,
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
    let detector: HandDetector = await createDetector(model, detectorConfig);
    return detector;
  } catch (error) {
    console.error(error);
  }
}
