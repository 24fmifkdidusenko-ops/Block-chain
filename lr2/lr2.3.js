const crypto = require('crypto');

const BASE = "hochu_deneg"; 
const HASH_PREFIX_LENGTH = 1; // Number of characters to match (1-5 recommended)

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

const prefixes = {}; // Store seen hashes by their prefix
let nonce = 0;
let found = false;

while (!found) {
  const candidate = BASE + nonce;        // Generate candidate string
  const hash = sha256Hex(candidate);     // Calculate SHA-256
  const prefix = hash.slice(0, HASH_PREFIX_LENGTH); // Take first N chars

  // Check if this prefix has been seen before
  if (prefixes[prefix] && prefixes[prefix] !== candidate) {
    console.log("Number of attempts:", nonce + 1);
    console.log("First string:        ", prefixes[prefix]);
    console.log("SHA-256 of first:    ", sha256Hex(prefixes[prefix]));
    console.log("Second string:       ", candidate);
    console.log("SHA-256 of second:   ", hash);
    found = true;
  } else {
    prefixes[prefix] = candidate; // Save prefix
  }

  nonce++;
}
