 // screen recording logic start
 start_screen_recording_btn.addEventListener("click", async function () {
    let chunks = [];

    let stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    //needed for better browser support
    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
      ? "video/webm; codecs=vp9"
      : "video/webm";
    let mediaRecorder = new MediaRecorder(stream, {
      mimeType: mime,
    });

    mediaRecorder.addEventListener("dataavailable", function (e) {
      chunks.push(e.data);
    });

    mediaRecorder.addEventListener("stop", function () {
      let blob = new Blob(chunks, {
        type: chunks[0].type,
      });

      video.src = URL.createObjectURL(blob);
    });

    //we have to start the recorder manually
    mediaRecorder.start();

    mediaRecorder.addEventListener("stop", function () {
      let blob = new Blob(chunks, {
        type: chunks[0].type,
      });
      let url = URL.createObjectURL(blob);

      video.src = url;

      downloadScreenRecordingBtn.href = url;
      downloadScreenRecordingBtn.download = "video.webm";
    });
  });

  // screen recording logic end

  // https://dev.to/0shuvo0/lets-create-a-screen-recorder-with-js-3leb