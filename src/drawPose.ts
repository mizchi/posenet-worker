import * as posenet from "@tensorflow-models/posenet";

const color = "aqua";
const lineWidth = 2;

function toTuple({ x, y }: { x: number; y: number }) {
  return [y, x];
}

export function drawPose(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  pose: posenet.Pose,
  canvasSize: number,
  minPoseConfidence: number,
  minPartConfidence: number
) {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.drawImage(video, 0, 0);

  const scale = 1;

  const { score, keypoints } = pose;
  if (score >= minPoseConfidence) {
    // show points
    drawKeypoints(ctx, keypoints, minPartConfidence, scale);
    // show skeleton
    drawSkeleton(ctx, keypoints, minPartConfidence, scale);
  }
}

function drawSegment(
  [ay, ax]: [number, number],
  [by, bx]: [number, number],
  color: string,
  scale: number,
  ctx: any
) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  keypoints: Array<posenet.Keypoint>,
  minConfidence: number,
  scale: number = 1
) {
  const adjacentKeyPoints = posenet.getAdjacentKeyPoints(
    keypoints,
    minConfidence
  );

  adjacentKeyPoints.forEach(keypoints => {
    (drawSegment as any)(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

function drawKeypoints(
  ctx: CanvasRenderingContext2D,
  keypoints: Array<posenet.Keypoint>,
  minConfidence: number,
  scale: number = 1
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    ctx.beginPath();
    ctx.arc(x * scale, y * scale, 3, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }
}
