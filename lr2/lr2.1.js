const crypto = require("crypto");
const readline = require("readline");

// Function to generate hash
function generateHash(algorithm, input) {
  return crypto.createHash(algorithm).update(input).digest("hex");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Please write your message: ", (input) => {

  // SHA-256
  console.time("SHA-256 time");
  const sha256Hash = generateHash("sha256", input);
  console.timeEnd("SHA-256 time");
  console.log("SHA-256   :", sha256Hash);
  console.log("SHA-256 length:", sha256Hash.length, "characters");

  // SHA3-256
  console.time("SHA3-256 time");
  const sha3Hash = generateHash("sha3-256", input);
  console.timeEnd("SHA3-256 time");
  console.log("SHA3-256  :", sha3Hash);
  console.log("SHA3-256 length:", sha3Hash.length, "characters");

  // Short conclusion
  console.log("\nConclusion:");
  console.log("- Both hashes are 64 characters long (256 bits in hexadecimal).");
  console.log("- SHA-256 is usually faster.");
  console.log("- SHA3-256 is considered more secure.");

  rl.close();
});
