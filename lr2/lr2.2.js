const crypto = require('crypto');

// Characters used for random string generation
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const LENGTH = 16;

// Generate a random string of given length
function randomString(len = LENGTH) {
  const bytes = crypto.randomBytes(len);
  let s = '';
  for (let i = 0; i < len; i++) {
    s += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return s;
}

// Mutate one random character in a string
function mutateOneChar(str) {
  const pos = Math.floor(Math.random() * str.length);
  const current = str[pos];

  let replacement;
  do {
    replacement = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  } while (replacement === current);

  return str.slice(0, pos) + replacement + str.slice(pos + 1);
}

// SHA-256 hash in hexadecimal
function sha256Hex(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

// Main function
function main() {
  const original = randomString();
  const mutated = mutateOneChar(original);

  const hashOriginal = sha256Hex(original);
  const hashMutated = sha256Hex(mutated);

  console.log('Original string:   ', original);
  console.log('Mutated string:    ', mutated);
  console.log('SHA-256 (original):', hashOriginal);
  console.log('SHA-256 (mutated) :', hashMutated);

  console.log('\nObservation: "Avalanche effect"');
  console.log('Even a small change in the input string drastically changes the hash output.');
  console.log('This ensures security and data integrity.');
}

main();
