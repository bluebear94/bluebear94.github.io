// MR phonorun reduction library using JS.

// An entry is composed of:
//   "letter": the MR letter used
//   "openness": the defined category of this letter (-2 = fc, 2 = fo)
//   "order": the index into the word before phonorun reduction
//   "isrod": true if this represents a rod signal
//   "boundary": true if this starts a new compounding boundary

// DC by letter.
var dcByLetter = {
  "a": 2, "e": 2, "i": 2, "o": 2, "u": 2,
  "v": 2, "z^v": 2, "z": 2, "z^w": 2, "j": 2,
  "g^j": 2, "j^l": 2, "y": 2, "w": 2, "5": 2,
  "6": 2,
  "q": 1, "r": 1, "l": 1, "m": 1, "n": 1,
  "n^y": 1, "n^g": 1, "7": 1, "9^7": 1,
  "s": 0, "s^w": 0, "x^l": 0, "v^h": 0,
  "z^h": 0, "v^j": 0, "1": 0, "2": 0,
  "f": -1, "x": -1, "k^x": -1, "c": -1, "8": -1,
  "9^8": -1,
  "s^f": -2, "f^h": -2, "s^h": -2, "f^x": -2, "p": -2,
  "b": -2, "t": -2, "d": -2, "t^y": -2, "d^y": -2,
  "k": -2, "g": -2, "t^s": -2, "t^x": -2, ".": -2,
  "3": -2, "4": -2, "_4": -2,
}

// Parses a word into a list of entries.
// input: word (^ for superscript)
// output: a list of entries, or `undefined` if error
function parseWord(word) {
  var i = 0;
  var k = 0;
  var res = [];
  while (i < word.length) {
    var boundary = false;
    if (word[i] == '-') {
      ++i;
      boundary = true;
    }
    var hasCaret = (i < word.length - 2 && word[i + 1] == '^');
    var j = hasCaret ? 3 : 1;
    var letter = word.substr(i, j);
    i += j;
    var openness = dcByLetter[letter];
    if (openness === undefined) {
      return undefined;
    }
    var entry = {
      letter: letter,
      openness: openness,
      order: k,
      isrod: ("1" <= letter && letter <= "8"),
      boundary: boundary,
    };
    res.push(entry);
    ++k;
  }
  return res;
}

// Does this in reverse.
function stringifyWord(entries) {
  var res = "";
  for (entry of entries) {
    if (entry.boundary) res += "-";
    res += entry.letter;
  }
  return res;
}

// Same as above, but with HTML.
function htmlifyWord(entries) {
  var res = "";
  for (entry of entries) {
    if (entry.boundary) res += "-";
    if (entry.letter.length == 3) {
      res += entry.letter[0] + "<sup>" +
        entry.letter[2] + "</sup>";
    } else if (entry.letter.length == 2) {
      res += "<sub>" + entry.letter[1] + "</sub>";
    } else res += entry.letter;
  }
  return res;
}

function swap(l, i, j) {
  var t = l[i];
  l[i] = l[j];
  l[j] = t;
}

function indexOfFirstRodSignal(entries) {
  return entries.findIndex((e) => e.isrod);
}

// Returns (i - from) if there is a compounding boundary
// in the block indexed [from, to),
// where i is the entry where it occurs.
function crossesBoundary(entries, from, to) {
  for (var i = from + 1; i < to; ++i) {
    if (entries[i].boundary) return i - from;
  }
  return false;
}

// Applies the first rule in section 1.3 of the MR grammar.
// input: a list of entries
// (e. g. returned from parseWord)
// and the index of the first rod signal
// (-1 if none)
// output: void, but list is mutated
function applyRule1(entries, cb) {
  // Rule 1:
  // X1[do]X2[dc]R[do] -> X2X1R
  // Check if we have enough segments to the left
  if (cb < 2) return;
  if (crossesBoundary(entries, cb - 3, cb))
    return;
  if (entries[cb - 2].openness > 0 &&
      entries[cb - 1].openness < 0 &&
      entries[cb].openness > 0) {
    swap(entries, cb - 2, cb - 1);
  }
} 

function applyRule2(entries, cb) {
  // Rule 2:
  // X1[dc]X2[do]R[dc] -> X2X1R
  // Check if we have enough segments to the left
  if (cb < 2) return;
  if (crossesBoundary(entries, cb - 3, cb))
    return;
  if (entries[cb - 2].openness < 0 &&
      entries[cb - 1].openness > 0 &&
      entries[cb].openness < 0) {
    swap(entries, cb - 2, cb - 1);
  }
}

function applyRule3(entries, cb) {
  // Rule 3:
  // X1[dc]X2[do]?X3[do] -> X1?X2X3
  if (cb == -1) cb = entries.length;
  var start = cb - 4;
  while (start >= 0) {
    // Check if this crosses a boundary
    var boundary = crossesBoundary(entries, start, start + 4);
    if (boundary) {
      start -= 4 - boundary;
      continue;
    }
    // Check if third entry in block is glottal stop
    // and op requirements are met
    if (entries[start + 2].letter == "." &&
        entries[start].openness < 0 &&
        entries[start + 1].openness > 0 &&
        entries[start + 3].openness > 0) {
      // Apply rule
      swap(entries, start + 1, start + 2);
      start -= 4;
    } else {
      // Didn't match
      --start;
    }
  }
}

function applyRule4(entries, cb) {
  // Rule 4:
  // X1[do]?X2[do]X3[dc] -> X1X2?X3
  if (cb == -1) cb = entries.length;
  var start = cb - 4;
  while (start >= 0) {
    // Check if this crosses a boundary
    var boundary = crossesBoundary(entries, start, start + 4);
    if (boundary) {
      start -= 4 - boundary;
      continue;
    }
    // Check if third entry in block is glottal stop
    // and op requirements are met
    if (entries[start + 1].letter == "." &&
        entries[start].openness > 0 &&
        entries[start + 2].openness > 0 &&
        entries[start + 3].openness < 0) {
      // Apply rule
      swap(entries, start + 1, start + 2);
      start -= 4;
    } else {
      // Didn't match
      --start;
    }
  }
}

function opamt(entries, start) {
  return (
    entries[start].openness +
    entries[start + 2].openness -
    entries[start + 1].openness -
    entries[start + 3].openness);
}

function applyRule5(entries, cb) {
  // Rule 5:
  // X1[op >= 0]X2[dc]X3[do]X4[op <= 0] ->
  // X1X3X2X4
  // [X1.op + X3.op - X2.op - X4.op >= 6]
  if (cb == -1) cb = entries.length;
  var start = cb - 4;
  while (start >= 0) {
    // Check if this crosses a boundary
    var boundary = crossesBoundary(entries, start, start + 4);
    if (boundary) {
      start -= 4 - boundary;
      continue;
    }
    // Check if op requirements are met
    if (entries[start].openness >= 0 &&
        entries[start + 1].openness < 0 &&
        entries[start + 2].openness > 0 &&
        entries[start + 3].openness <= 0 &&
        opamt(entries, start) >= 6) {
      // Apply rule
      swap(entries, start + 1, start + 2);
      start -= 4;
    } else {
      // Didn't match
      --start;
    }
  }
}

function applyRule6(entries, cb) {
  // Rule 6:
  // X1[op >= 0]X2[do]X3[dc]X4[op >= 0] ->
  // X1X3X2X4
  // [X2.op + X4.op - X1.op - X3.op >= 6]
  if (cb == -1) cb = entries.length;
  var start = cb - 4;
  while (start >= 0) {
    // Check if this crosses a boundary
    var boundary = crossesBoundary(entries, start, start + 4);
    if (boundary) {
      start -= 4 - boundary;
      continue;
    }
    // Check if op requirements are met
    if (entries[start].openness <= 0 &&
        entries[start + 1].openness > 0 &&
        entries[start + 2].openness < 0 &&
        entries[start + 3].openness >= 0 &&
        opamt(entries, start) <= -6) {
      // Apply rule
      swap(entries, start + 1, start + 2);
      start -= 4;
    } else {
      // Didn't match
      --start;
    }
  }
}

// Unlike the others, this returns true if
// any swaps were made.
function applyRule7And8(entries, cb) {
  // Rules 7 and 8:
  // X1[do]X2[dc]X3[do] -> X1X3X2
  // X1[dc]X2[do]X3[dc] -> X2X1X3
  // (in parallel)
  if (cb == -1) cb = entries.length;
  var start = cb - 3;
  var swapped = false;
  while (start >= 0) {
    // Check if this crosses a boundary
    var boundary = crossesBoundary(entries, start, start + 3);
    if (boundary) {
      start -= 3 - boundary;
      continue;
    }
    // Check if op requirements are met
    if (entries[start].openness > 0 &&
        entries[start + 1].openness < 0 &&
        entries[start + 2].openness > 0) {
      // Apply rule 7
      swap(entries, start + 1, start + 2);
      start -= 3;
      swapped = true;
    } else if (entries[start].openness < 0 &&
        entries[start + 1].openness > 0 &&
        entries[start + 2].openness < 0) {
      // Apply rule 8
      swap(entries, start, start + 1);
      start -= 3;
      swapped = true;
    } else {
      // Didn't match
      --start;
    }
  }
  return swapped;
}

// input: a list of entries
// output: a list of indices where the phonoruns start
function getPhonoruns(entries) {
  if (entries.length == 0) return [];
  var res = [0];
  var isOpenRun = entries[0].openness > 0;
  for (var i = 1; i < entries.length; ++i) {
    var isOpenRunOld = isOpenRun;
    switch (entries[i].openness) {
    case 2:
      isOpenRun = true;
      break;
    case -2:
      isOpenRun = false;
      break;
    case 1:
      isOpenRun = entries[i - 1].openness != -2;
      break;
    case -1:
      isOpenRun = entries[i - 1].openness == 2;
      break;
    case 0: // nothing
    }
    if (isOpenRun != isOpenRunOld)
      res.push(i);
  }
  return res;
}

var rules = [
  applyRule1, applyRule2, applyRule3, applyRule4,
  applyRule5, applyRule6
];

function applyRules(entries) {
  var cb = indexOfFirstRodSignal(entries);
  var cbn = cb == -1 ? entries.length : cb;
  var ph = getPhonoruns(entries);
  var i = 0;
  while (ph.length > Math.ceil(cbn / 2.0) &&
      i < rules.length) {
    rules[i](entries, cb);
    ++i;
    ph = getPhonoruns(entries);
  }
  while (ph.length > Math.ceil(cbn / 2.0)) {
    var res = applyRule7And8(entries, cb);
    if (!res) break;
    ph = getPhonoruns(entries);
  }
  return {
    newEntries: entries,
    phonoruns: ph,
  };
}
