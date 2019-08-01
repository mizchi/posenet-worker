let currentStream: any | null = null;
const maxVideoSize = 513;

function stopCurrentVideoStream() {
  if (currentStream) {
    currentStream.getTracks().forEach((track: any) => {
      track.stop();
    });
  }
}

export async function getCameras() {
  const devices = await (navigator.mediaDevices as any).enumerateDevices();
  return devices.filter(({ kind }: { kind: string }) => kind === "videoinput");
}

export function loadVideo(cameraId: any): Promise<HTMLVideoElement> {
  stopCurrentVideoStream();
  const video = document.getElementById("video") as HTMLVideoElement;
  video.width = maxVideoSize;
  video.height = maxVideoSize;

  return new Promise((resolve, reject) => {
    navigator.getUserMedia(
      {
        video: {
          width: maxVideoSize,
          height: maxVideoSize,
          deviceId: { exact: cameraId }
        }
      },
      stream => {
        currentStream = stream;
        video.srcObject = stream;
        resolve(video);
      },
      err => reject(err)
    );
  });
}
