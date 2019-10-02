// get html elements as variables
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('.screenshot');
const span = document.querySelector('#brightness span');
// set constraints for camera, change facingMode to "user" for front camera
var constraints = { video: { facingMode: "environment" }, audio: false };
// boolean variable to keep tab on whether it's dark or not
var isDark = false;
// start camera function
function cameraStart() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {
    // get camera stream data
    var track = stream.getTracks()[0];
    // set stream data to video object so we can see it
    video.srcObject = stream;
    // wait for it to have loaded its meta data like width
    video.addEventListener( "loadedmetadata", function (e) {
      // every 500 ms check the brightness
      setInterval(function(){
        getBrightness();
      },500);
    });
  })
}
function getBrightness(){
  // we don't need to scan the whole video, 32 pixels is fine
  canvas.width = 1 || video.videoWidth;
  canvas.height = 1 || video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  var colorSum = 0;
  var data = imageData.data;
  var r,g,b,avg;
  for(var x = 0, len = data.length; x < len; x+=4) {
    r = data[x];
    g = data[x+1];
    b = data[x+2];
    avg = Math.floor((r+g+b)/3);
    colorSum += avg;
  }
  var brightness = Math.floor(colorSum / (canvas.width*canvas.height));
  //screenshotImage.src = canvas.toDataURL('image/webp');
  span.innerHTML = brightness;
  // check if brightness is below threshold
  if (brightness < 30){
    if (!isDark){
      isDark = true;
      document.body.classList.add("isDark");
    }
  } else {
    if (isDark){
      isDark = false;
      document.body.classList.remove("isDark");
    }
  }
}
window.onload = function(){
  cameraStart();
}

