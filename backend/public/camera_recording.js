let camera_stream = null;
let media_recorder = null;
let blobs_recorded = [];

let isCameraOn = false;

function stopCamera() {
  camera_stream.getTracks().forEach((track) => track.stop());
  video.srcObject = null;
  isCameraOn = false;
}

camera_button.addEventListener("click", async function () {
  if (isCameraOn) {
    return;
  }
  camera_stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  video.srcObject = camera_stream;
  isCameraOn = true;
});

stopCameraBtn.onclick = (event) => {
  if (!isCameraOn) {
    return;
  }
  stopCamera();
};

start_button.addEventListener("click", function () {
  if (!isCameraOn) {
    return;
  }
  // set MIME type of recording as video/webm
  media_recorder = new MediaRecorder(camera_stream, {
    mimeType: "video/webm",
  });

  // event : new recorded video blob available
  media_recorder.addEventListener("dataavailable", function (e) {
    blobs_recorded.push(e.data);
  });

  // event : recording stopped & all blobs sent
  media_recorder.addEventListener("stop", function () {
    // create local object URL from the recorded video blobs
    let video_local = URL.createObjectURL(
      new Blob(blobs_recorded, { type: "video/webm" })
    );
    download_link.href = video_local;
  });

  // start recording with each recorded blob having 1 second video
  media_recorder.start(1000);
});

stop_button.addEventListener("click", function () {
  if (!isCameraOn) {
    return;
  }
  media_recorder.stop();
  stopCamera();
});



// https://www.encora.com/insights/capturing-audio-video-with-webrtc