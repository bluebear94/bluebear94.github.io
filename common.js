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

var hacmToggleRule;

window.onload = function() {
  var body = document.getElementsByTagName("body")[0];
  var hacmbox = document.createElement("div");
  hacmbox.setAttribute("class", "hacmtoggle");
  hacmbox.innerHTML = hacmboxHTML;
  body.insertBefore(hacmbox, body.firstChild);
  hacmToggleRule = getCSSRule("hacm, .hacm");
  if (hacmToggleRule === undefined) {
    console.error("Hacm toggle rule not found.");
  }
  console.log("hacmbox done");
};

function toggleHacm(alwaysInvert) {
  var hacmbox = document.getElementById("hacmtoggle");
  var useHacm = hacmbox.checked;
  if (alwaysInvert) useHacm = !useHacm;
  if (useHacm) {
    hacmToggleRule.style.setProperty("font-family", '"kardinal", sans-serif');
  } else {
    hacmToggleRule.style.setProperty("font-family", 'sans-serif');
  }
  hacmbox.checked = useHacm;
}
