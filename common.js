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
  setHacmFont(hacmNameBox.value);
}

function windowOnLoadCommon() {
  hacmToggleRule = getCSSRule("hacm, .hacm");
  if (hacmToggleRule === undefined) {
    console.error("Hacm toggle rule not found.");
  }
  setHacm(data.getItem("hacm") != "off");
  setHacmMenu(data.getItem("hacmMenu") != "off");
  setHacmFont(data.getItem("hacmFont") || "kardinal");
}

if (optpage) {
  window.onload = function() {
    hacmbox = document.getElementById("hacmtoggle");
    hacmMenuToggle = document.getElementById("hacmshow");
    hacmNameBox = document.getElementById("hacmfont");
    windowOnLoadCommon();
  };
} else {
  window.onload = function() {
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
}
