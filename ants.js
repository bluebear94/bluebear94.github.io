var canvas;
var ctx;
var ants = [];

function getViewportDimensions() {
  var w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0);
  var h = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0);
  return [w, h];
}

function getNextDelay() {
  return 25 + Math.floor(50 * Math.random());
}

function getRGBByHue(hue) {
  // Assumes saturation and value are 100%.
  // Hue is in [0, 360).
  var leg = Math.floor(hue / 60);
  var prog = (hue % 60) / 60;
  var tab = [1, 1 - prog, 0, 0, prog, 1];
  var r = tab[leg];
  var g = tab[(leg + 4) % 6];
  var b = tab[(leg + 2) % 6];
  return [
    Math.floor(255 * r),
    Math.floor(255 * g),
    Math.floor(255 * b),
  ];
}

function createAnts() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var nAnts = Math.floor(canvas.width * canvas.height / 1500);
  ants = new Array(nAnts);
  var w = canvas.width;
  var h = canvas.height;
  for (var i = 0; i < nAnts; ++i) {
    var x = Math.floor(w * Math.random());
    var y = Math.floor(h * Math.random());
    var dir = Math.floor(4 * Math.random());
    var delay = getNextDelay();
    var hue = Math.floor(360 * Math.random());
    ants[i] = { x: x, y: y, dir: dir, delay: delay, hue: hue };
  }
}

function updateAnts() {
  var w = canvas.width;
  var h = canvas.height;
  var vp = getViewportDimensions();
  if (w < vp[0] || h < vp[1]) {
    canvas.width = w = vp[0];
    canvas.height = h = vp[1];
    createAnts();
  }
  if (w == 0 || h == 0) return;
  // Darken image by ~3% to avoid light being overcrowded
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0, 0, 0, 0.03)";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  var nAnts = ants.length;
  for (var i = 0; i < nAnts; ++i) {
    var ant = ants[i];
    // Move
    switch (ant.dir) {
      case 0: ++ant.x; break;
      case 1: ++ant.y; break;
      case 2: --ant.x; break;
      case 3: --ant.y; break;
    }
    ant.x = (ant.x + w) % w;
    ant.y = (ant.y + h) % h;
    if (--ant.delay == 0) {
      ant.delay = getNextDelay();
      ant.dir = (ant.dir + 1 + 2 * Math.floor(2 * Math.random())) % 4;
    }
    var rgb = getRGBByHue(ant.hue++);
    ant.hue %= 360;
    ctx.fillStyle = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
    ctx.fillRect(ant.x, ant.y, 1, 1);
    if (isNaN(ant.x) || isNaN(ant.y) || isNaN(ant.delay) || isNaN(ant.dir) || isNaN(ant.hue)) {
      console.log("Ant #" + i + " NaN'ed out:");
      console.log(ant);
    }
  }
}

function startAnts() {
  createAnts();
  window.setInterval(updateAnts, 50);
}

function startStatic(path) {
  var image = new Image();
  image.onload = function() {
    var cw = canvas.width;
    var ch = canvas.height;
    var iw = image.width;
    var ih = image.height;
    console.log([[cw, ch], [iw, ih]]);
    var x = Math.floor(cw / 2 - iw / 2);
    var y = Math.floor(ch / 2 - ih / 2);
    console.log([x, y]);
    ctx.drawImage(image, x, y);
    console.log("done");
  }
  image.src = path;
}

function startAnim() {
  canvas = document.getElementById('ants');
  ctx = canvas.getContext('2d');
  var dims = getViewportDimensions();
  canvas.width = dims[0];
  canvas.height = dims[1];
  var data = window.localStorage;
  var anim = data.getItem("animation") || "ants";
  switch (anim) {
    case "ants": startAnts(); break;
    case "static": {
      startStatic(data.getItem("imagePath") || "/image/toaster.png");
      break;
    }
    default: {
      console.error(anim + ": no such animation");
    }
  }
}
