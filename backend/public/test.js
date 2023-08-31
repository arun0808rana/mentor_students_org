let shouldStop;
let stopped;

const handleRecord = function ({stream, mimeType}) {
    // to collect stream chunks
    let recordedChunks = [];
    stopped = false;
    const mediaRecorder = new MediaRecorder(stream);
  
    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
      // shouldStop => forceStop by user
      if (shouldStop === true && stopped === false) {
        mediaRecorder.stop();
        stopped = true;
      }
    };
    mediaRecorder.onstop = function () {
      const blob = new Blob(recordedChunks, {
        type: mimeType
      });
      recordedChunks = []
      const filename = 'dummy'; // input filename from user for download

      downloadScreenRecordingBtn.href = URL.createObjectURL(blob); // create download link for the file
      downloadScreenRecordingBtn.download = `${filename}.webm`; // naming the file with user provided name
      stopRecord();
    };
  
    mediaRecorder.start(200); // here 200ms is interval of chunk collection
  };

async function recordScreen() {
  const mimeType = "video/webm";
  shouldStop = false;
  const constraints = {
    video: true,
  };
  const displayStream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });
  // voiceStream for recording voice with screen recording
  const voiceStream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  let tracks = [...displayStream.getTracks(), ...voiceStream.getAudioTracks()];
  const stream = new MediaStream(tracks);
  handleRecord({ stream, mimeType });
}

start_screen_recording_btn.onclick = event => {
    recordScreen();
}