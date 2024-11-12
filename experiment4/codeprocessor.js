// --------------------------------------------------------------------------
// codeprocessor.js
// --------------------------------------------------------------------------

var urlToCodeMap = {};

// load JSON data and save to local storage
function loadUrlCodes() {
  // first check if data is already in local storage
  const urlCodesFromStorage = localStorage.getItem('urlcodes');
  if (urlCodesFromStorage) {
    urlToCodeMap = JSON.parse(urlCodesFromStorage);
    return;
  } else {
    // if not, load the JSON file
    fetch('urlcodes.json')
      .then(response => response.json())
      .then(data => {
        // and save data to local storage
        localStorage.setItem('urlcodes', JSON.stringify(data));
        urlToCodeMap = data;
      })
      .catch(error => {
        // if there's an error show it in the dev console
        console.error('Error loading URL codes:', error);
      });    
  }
}

// generate a 10-digit code (a random permutation of seed code)
function generateDisplayCode(seedCode) {
  const seedCodeChars = seedCode.split('');
  const permutations = generatePermutations(seedCodeChars);
  const randomPermutation = permutations[Math.floor(Math.random() * permutations.length)];
  const displayCode = [];
  for (let i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      displayCode.push(randomPermutation[i / 2]);
    } else {
      displayCode.push(getRandomCharacter());
    }
  }
  return displayCode.join('');
}

// generate all permutations of a given array of characters
function generatePermutations(chars) {
  if (chars.length <= 1) {
    return [chars.join('')];
  }
  const permutations = [];
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const remainingChars = [...chars.slice(0, i), ...chars.slice(i + 1)];
    const subPermutations = generatePermutations(remainingChars);
    for (const subPermutation of subPermutations) {
      permutations.push(char + subPermutation);
    }
  }
  return permutations;
}

// get a random character (letter or number)
function getRandomCharacter() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return chars[Math.floor(Math.random() * chars.length)];
}

// extract the real code from the 10-digit code
function extractRealCode(displayCode) {
  const realCode = [];
  for (let i = 0; i < displayCode.length; i += 2) {
    realCode.push(displayCode[i]);
  }
  return realCode.join('');
}

// check if a code is a valid permutation of seed code
function isValidPermutation(code, seedCode) {
  const seedCodeChars = seedCode.split('');
  const codeChars = code.split('');
  if (codeChars.length !== seedCodeChars.length) {
    return false;
  }
  // check if seed code contains unique characters
  if (!containsUniqueChars(seedCode)) {
    return false;
  }
  const usedIndexes = new Set();
  for (let i = 0; i < codeChars.length; i++) {
    const index = seedCodeChars.indexOf(codeChars[i]);
    if (index === -1 || usedIndexes.has(index)) {
      return false;
    }
    usedIndexes.add(index);
  }
  return true;
}

// check if a string contains unique characters
function containsUniqueChars(str) {
  const charSet = new Set(str);
  return charSet.size === str.length;
}

// handle form submission and code validation
function handleCodeSubmission(event) {
  event.preventDefault();
  const inputCode = document.getElementById('codeInput').value.trim();
  // check if the input field is blank
  if (inputCode === '') {
    alert('Please enter a code.');
    return;
  }
  const realCode = extractRealCode(inputCode);
  // check if real code matches any permutation in the urlToCodeMap
  const urlCodesFromStorage = localStorage.getItem('urlcodes');
  if (urlCodesFromStorage) {
    const urlToCodeMap = JSON.parse(urlCodesFromStorage);
    for (const url in urlToCodeMap) {
      if (isValidPermutation(realCode, urlToCodeMap[url])) {
        // redirect user to the correct URL
        window.location.href = url;
        return;
      }
    }
  }
  alert('Invalid code. Please try again.');
}

// Load the URL-to-seed-code mapping from the JSON file and store it in localStorage
loadUrlCodes();

// Attach a form submission event listener
const codeform = document.getElementById('codeForm');
if (codeform){
  codeform.addEventListener('submit', handleCodeSubmission);
}