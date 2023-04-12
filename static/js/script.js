// Text-only output
$(document).ready(function () {
  $('#textInput').submit(function (event) {
    event.preventDefault();
    var input_text = $('#prompt').val();
    $.post('/prompt', { input_text: input_text }, function (data) {
      $('#promptOutput').val(data.resp);
      $('#promptOutput2').val(data.alt_resp);

      var textarea = $('#promptOutput');
      var contentHeight = textarea[0].scrollHeight - parseFloat(textarea.css('padding-top')) - parseFloat(textarea.css('padding-bottom'));
      textarea.height(contentHeight);

      var textarea = $('#promptOutput2');
      var contentHeight = textarea[0].scrollHeight - parseFloat(textarea.css('padding-top')) - parseFloat(textarea.css('padding-bottom'));
      textarea.height(contentHeight);
    }, 'json');
  });
});

// $(document).ready(function() {
//   $('form').submit(function(event) {
//     event.preventDefault();
//     var input_text = $('#prompt').val();
//     $.post('/prompt', {input_text: input_text}, function(data) {
//       $('#promptOutput').text(data.output_text);
//       var audio = new Audio('data:audio/mp3;base64,' + data.audio_content);
//       audio.play();
//     }, 'json');
//   });
// });

let mediaRecorder;
let chunks = [];
let recording = false;

const startRecording = async () => {
  if (!recording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();
    document.getElementById("record-button").innerHTML = "<i class='fa-solid fa-circle fa-xs'></i>Recording...";
    recording = true;

    mediaRecorder.addEventListener("dataavailable", function (event) {
      chunks.push(event.data);
    });
  }
};

const stopRecording = () => {
  mediaRecorder.stop();
  document.getElementById("record-button").innerHTML = "<i class='fa-solid fa-circle fa-xs'></i>Record";
  recording = false;

  mediaRecorder.addEventListener("stop", async () => {
    const blob = new Blob(chunks, { type: "audio/wav" });
    chunks = [];

    const formData = new FormData();
    formData.append("audio", blob, "request.wav");

    const response = await fetch("/save-audio", {
      method: "POST",
      body: formData,
    });

    const transcriptionResponse = await fetch("/transcribe", {
      method: "POST",
      body: JSON.stringify({ filename: "request.wav" }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const transcription = await transcriptionResponse.text();
    document.getElementById("prompt").value = transcription;
  });
};

window.onload = function () {
  document.getElementById("record-button").addEventListener("click", startRecording);
  document.getElementById("stop-button").addEventListener("click", stopRecording);
}

$(document).ready(function() {
  $('#clear-button').click(function() {
    $('#prompt').val('');
    $('#promptOutput').val('').attr("rows", "2").css("height", "auto");
    $('#promptOutput2').val('').attr("rows", "2").css("height", "auto");
  });
});


$(document).ready(function () {
  $('#tts1').click(function (event) {
    event.preventDefault();
    var input_text = $('#promptOutput').val();
    if (input_text){
    $.post('/text-to-speech', { input_text: input_text }, function (data) {
      var audio = new Audio('data:audio/mp3;base64,' + data.audio_content);
      audio.play();
    }, 'json');
  }
  });
});

$(document).ready(function () {
  $('#tts2').click(function (event) {
    event.preventDefault();
    var input_text = $('#promptOutput2').val();
    if(input_text){
    $.post('/text-to-speech', { input_text: input_text }, function (data) {
      var audio = new Audio('data:audio/mp3;base64,' + data.audio_content);
      audio.play();
    }, 'json');
  }
  });
});
