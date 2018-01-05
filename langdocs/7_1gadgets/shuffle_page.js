// Code for page

function updateOutput() {
  var input = document.getElementById("insert_text");
  var output = document.getElementById("output_text");
  var entries = parseWord(input.value);
  if (entries === undefined) {
    output.innerHTML = "vet fea";
    return;
  }
  var res = htmlifyWord(entries);
  res += " > ";
  var entryRes = applyRules(entries);
  res += htmlifyWord(entryRes.newEntries);
  console.log(entries);
  output.innerHTML = res;
}
