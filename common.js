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
<input type="checkbox" id="hacmtoggle" onchange="toggleHacm()" checked />
<label for="hacmtoggle">Use hacm font</label>
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
  body.appendChild(hacmbox);
  hacmToggleRule = getCSSRule("hacm, .hacm");
  if (hacmToggleRule === undefined) {
    console.error("Hacm toggle rule not found.");
  }
  console.log("hacmbox done");
};

function toggleHacm() {
  var hacmbox = document.getElementById("hacmtoggle");
  var useHacm = hacmbox.checked;
  if (useHacm) {
    hacmToggleRule.style.setProperty("font-family", '"kardinal", sans-serif');
  } else {
    hacmToggleRule.style.setProperty("font-family", 'sans-serif');
  }
}
