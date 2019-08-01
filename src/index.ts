import * as media from "./media";
import * as posenet from "@tensorflow-models/posenet";
import { drawPose } from "./drawPose";

document.body.innerHTML = `<div id='main'>
  <video autoplay="true" id="video" style="transform: scaleX(-1);display: none;"></video>
  <canvas id="output" />
</div>`;

const minPoseConfidence = 0.1;
const minPartConfidence = 0.5;
const canvasSize = 400;

export async function main() {
  const net = await posenet.load();
  const canvas = document.getElementById("output") as HTMLCanvasElement;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  const cameras = await media.getCameras();
  const video = await media.loadVideo(cameras[0].deviceId);

  async function mainloop(): Promise<void> {
    const data = await net.estimateSinglePose(video, {
      flipHorizontal: false
    });
    drawPose(
      ctx,
      video,
      data,
      canvasSize,
      minPoseConfidence,
      minPartConfidence
    );
    requestAnimationFrame(mainloop);
  }
  mainloop();
}
main();
