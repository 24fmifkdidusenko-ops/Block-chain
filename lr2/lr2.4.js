const crypto = require('crypto');

// Generate RSA key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048, // Key size
});

// Original and modified messages
const message = "Message";
const changedMessage = message + "change";

// Function to sign a message
function signMessage(msg, format) {
  const sign = crypto.createSign('sha256'); // SHA-256 hash for signing
  sign.update(msg);
  sign.end();
  return sign.sign(privateKey, format); // 'base64' or 'hex'
}

// Sign the original message
const signatureBase64 = signMessage(message, 'base64');
const signatureHex = signMessage(message, 'hex');

// Function to verify a signature
function verifySignature(msg) {
  const verify = crypto.createVerify('sha256');
  verify.update(msg);
  verify.end();
  return verify.verify(publicKey, signatureBase64, 'base64');
}

// Export public key in PEM format (PKCS#1)
const pubPem = publicKey.export({ type: 'pkcs1', format: 'pem' });
const first50 = pubPem.slice(0, 50); // Show first 50 characters for brevity

// Console output
console.log("Public key (first 50 symbols):", first50);
console.log("\nSignature (hex)   :", signatureHex);
console.log("Signature (base64):", signatureBase64);

console.log("\nVerification:");
console.log(`Original message correct?   ${verifySignature(message) ? "Yes" : "No"}`);
console.log(`Changed message correct?    ${verifySignature(changedMessage) ? "Yes" : "No"}`);
