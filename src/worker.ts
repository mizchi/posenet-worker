import * as comlink from "comlink";
import * as posenet from "@tensorflow-models/posenet";
import { minPartConfidence, minPoseConfidence, canvasSize } from "./config";
import { drawPose } from "./drawPose";

let net: posenet.PoseNet | null = null;
let ctx: CanvasRenderingContext2D | null = null;

// video buffer
const videoBufferCanvas = new OffscreenCanvas(canvasSize, canvasSize);
const videoBufferContext = (videoBufferCanvas.getContext(
  "2d"
) as any) as CanvasRenderingContext2D;

console.time("[worker] start");

comlink.expose({
  async init(canvas: OffscreenCanvas) {
    console.time("[worker] load-model");
    net = await posenet.load();
    console.timeEnd("[worker] load-model");
    ctx = canvas.getContext("2d") as any;
    console.time("[worker] ready");
  },
  async update(bitmap: ImageBitmap) {
    if (net != null && ctx) {
      videoBufferContext.drawImage(bitmap, 0, 0);
      const data = await net.estimateSinglePose(videoBufferCanvas as any, {
        flipHorizontal: false
      });
      drawPose(
        ctx,
        bitmap as any,
        data,
        canvasSize,
        minPoseConfidence,
        minPartConfidence
      );
    }
  }
});
