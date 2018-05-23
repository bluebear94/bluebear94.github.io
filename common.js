"use strict";

const message = `%c
<shameless-self-promotion>
Hey! Love to code?
Come join the AGC Discord below!
             ↓↓
→ https://discord.gg/Mq7m4 ←
             ↑↑
</shameless-self-promotion>
`;

const hacmboxHTML = `
<span class="tall">
  <input type="checkbox" id="hacmtoggle" onchange="toggleHacm(false)" checked />
  <label for="hacmtoggle" class="hideonlandscape">Use hacm font</label>
</span>
<span class="short">
  <a onclick="toggleHacm(true)" class="hacm">Tt</a>
</span>
`;

console.info(message, 'font-family: "Liberation Mono", "DejaVu Sans Mono", monospace; color: #AA2000;');

var hacmToggleRule;
var hacmMenuToggle;
var hacmbox;
var hacmNameBox;
var imagePathBox;
var defaultImage = "/image/toaster.png";
var data = window.localStorage;
var optpage = location.pathname.endsWith("options.html");

function getCSSRule(selector) {
  for(var i = 0; i < document.styleSheets.length; ++i) {
    var sheet = document.styleSheets[i];
    for (var j = 0; j < sheet.cssRules.length; ++j) {
      var rule = sheet.cssRules[j];
      if (rule.type === CSSRule.STYLE_RULE && rule.selectorText === selector)
        return rule;
    }
  }
  return undefined;
}

function setHacm(useHacm) {
  if (useHacm) {
    var fontName = data.getItem("hacmFont") || "kardinal";
    hacmToggleRule.style.setProperty(
      "font-family",
      '"' + fontName + '", sans-serif');
  } else {
    hacmToggleRule.style.setProperty("font-family", 'sans-serif');
  }
  hacmbox.checked = useHacm;
  data.setItem("hacm", useHacm ? "on" : "off");
}

function toggleHacm(alwaysInvert) {
  var useHacm = hacmbox.checked;
  if (alwaysInvert) useHacm = !useHacm;
  setHacm(useHacm);
}

function setHacmMenu(show) {
  data.setItem("hacmMenu", show ? "on" : "off");
  if (optpage) hacmMenuToggle.checked = show;
}

function toggleHacmMenu() {
  var show = hacmMenuToggle.checked;
  setHacmMenu(show);
}

function setHacmFont(name) {
  data.setItem("hacmFont", name);
  if (optpage) hacmNameBox.value = name;
  toggleHacm(false);
}

function toggleHacmFont() {
  var fontName = hacmNameBox.value;
  if (fontName === "") fontName = "kardinal";
  setHacmFont(fontName);
}

function setBackgroundAnimation(name) {
  console.log(name);
  data.setItem("animation", name);
}

function toggleBackgroundAnimationRadio(value) {
  return function() {
    setBackgroundAnimation(value);
  }
}

function setImagePath(name) {
  data.setItem("imagePath", name);
  if (optpage) imagePathBox.value = name;
}

function toggleImagePath() {
  var imagePath = imagePathBox.value;
  if (imagePath === "") imagePath = defaultImage;
  setImagePath(imagePath);
}

function windowOnLoadCommon() {
  hacmToggleRule = getCSSRule("hacm > *, .hacm > *, hacm, .hacm");
  if (hacmToggleRule === undefined) {
    console.error("Hacm toggle rule not found.");
  }
  setHacm(data.getItem("hacm") != "off");
  setHacmMenu(data.getItem("hacmMenu") != "off");
  setHacmFont(data.getItem("hacmFont") || "kardinal");
  setImagePath(data.getItem("imagePath") || defaultImage)
}

function initOptPage() {
  hacmbox = document.getElementById("hacmtoggle");
  hacmMenuToggle = document.getElementById("hacmshow");
  hacmNameBox = document.getElementById("hacmfont");
  imagePathBox = document.getElementById("imgPath");
  var defaultAnim = data.getItem("animation") || "ants";
  var animationChoices = document.animselect.animation;
  for (var i = 0; i < animationChoices.length; ++i) {
    var rad = animationChoices[i];
    rad.onclick = toggleBackgroundAnimationRadio(rad.value);
    if (rad.value == defaultAnim) rad.checked = true;
  }
  windowOnLoadCommon();
};

function initPage() {
  if (data.getItem("hacmMenu") == "off") return;
  var body = document.getElementsByTagName("body")[0];
  var hacmmenu = document.createElement("div");
  hacmmenu.setAttribute("class", "hacmtoggle");
  hacmmenu.innerHTML = hacmboxHTML;
  body.insertBefore(hacmmenu, body.firstChild);
  hacmbox = document.getElementById("hacmtoggle");
  windowOnLoadCommon();
  if (document.title === "404") {
    var page = location.pathname;
    var inserts = document.getElementsByClassName("namehere");
    for (var i = 0; i < inserts.length; ++i) {
      inserts[i].textContent = page;
    }
  }
};

if (optpage) {
  window.onload = initOptPage;
} else {
  window.onload = initPage;
}
