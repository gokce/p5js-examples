
window.onload = function() {
  let canvas = document.getElementsByTagName("canvas")[0];
  let ctx = canvas.getContext('2d');
}

let xhr = new XMLHttpRequest();
window.onkeydown = function(e) {
  let keycode = event.which || event.keyCode;
  let canvas = document.getElementsByTagName("canvas")[0];
  if (keyCode == 83) { // S
    let data = canvas.toDataURL();
    sendCanvas('/save/image', JSON.stringify({ img: data}));
  } else if (keyCode == 67) { // C
    let data = canvas.toDataURL();
    sendCanvas('/save-hash/image', JSON.stringify({ img: data}));
  } else if (keyCode == 71) { // G
    // TODO: Save GIF
  }
}

function sendCanvas(url, data) {
  xhr.open("POST", url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(data);
}
