import * as media from "./media";
import * as comlink from "comlink";
import { canvasSize } from "./config";

document.body.innerHTML = `<div id='main'>
  <video autoplay="true" id="video" style="transform: scaleX(-1);display: none;"></video>
  <canvas id="output" />
</div>`;

console.log("start", performance.now());
console.time("setup");

const offscreen = new OffscreenCanvas(canvasSize, canvasSize);
const offCtx = offscreen.getContext("2d") as any;

export async function main() {
  // setup video
  const cameras = await media.getCameras();
  const video = await media.loadVideo(cameras[0].deviceId);

  // create offscreen context
  const canvas = document.getElementById("output") as HTMLCanvasElement;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const offscreenCanvas = canvas.transferControlToOffscreen();

  // setup comlink
  console.time("[main] worker setup");
  const worker = new Worker("./worker.ts", { type: "module" });
  const api: any = await comlink.wrap(worker);
  await api.init(comlink.transfer(offscreenCanvas, [offscreenCanvas as any]));
  console.timeEnd("[main] worker setup");

  async function mainloop() {
    offCtx.drawImage(video, 0, 0);
    const bitmap = offscreen.transferToImageBitmap();
    api.update(comlink.transfer(bitmap, [bitmap as any]));
    requestAnimationFrame(mainloop);
  }
  mainloop();
  console.timeEnd("setup");
}
main();
