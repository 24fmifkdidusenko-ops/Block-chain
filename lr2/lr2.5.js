const crypto = require('crypto');

// Generate RSA key pair (2048-bit)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

// Original document
const document = {
  id: 101,
  content: "message",
};

// Convert document to string to sign
const documentString = JSON.stringify(document);

// Sign the document
const signer = crypto.createSign('SHA256');
signer.update(documentString);
signer.end();
const signature = signer.sign(privateKey, 'base64');

// Export public key in PEM format
const pubPem = publicKey.export({ type: 'pkcs1', format: 'pem' });

// Function to verify a document's signature
function verifyDocument(docString, signatureToCheck, pubKey) {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(docString);
  verifier.end();
  return verifier.verify(pubKey, signatureToCheck, 'base64');
}

// Verify the original document
const validMessage = verifyDocument(documentString, signature, pubPem);
console.log("Original document valid?:", validMessage ? "Yes" : "No");

// Verify a modified document
const changedDocumentString = JSON.stringify({
  id: 101,
  content: "Changed message",
});
const anotherMessage = verifyDocument(changedDocumentString, signature, pubPem);
console.log("Modified document valid?:", anotherMessage ? "Yes" : "No");

// Verify with a fake signature
const fakeSignature = crypto.createSign('SHA256')
  .update("data for another sign")
  .sign(privateKey, 'base64');
const anotherSignature = verifyDocument(documentString, fakeSignature, pubPem);
console.log("Original document with fake signature valid?:", anotherSignature ? "Yes" : "No");
