import { VERSION } from '@mediapipe/hands';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

export async function createDetector() {
  const model = handPoseDetection.SupportedModels.MediaPipeHands;
  const detectorConfig: handPoseDetection.MediaPipeHandsMediaPipeModelConfig = {
    runtime: 'mediapipe',
    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${VERSION}`,
    modelType: 'full',
    maxHands: 4,
  };
  return await handPoseDetection.createDetector(model, detectorConfig);
}
