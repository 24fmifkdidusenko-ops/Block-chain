const crypto = require("crypto");

function sha256(data) {  //now it's outside class
  return crypto.createHash("sha256").update(data).digest("hex");
}

function buildMerkleRoot(transactions, showLogs = true) {
  if (transactions.length === 0) return "";  

  let level = transactions.map(tx => sha256(JSON.stringify(tx))); //each transaction
  if (showLogs) console.log("Level 0 (Tx hash):", level); 

  while (level.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left; //if qty is odd, the last one duplicates
      nextLevel.push(sha256(left + right)); //concantenation principle
    }
    level = nextLevel;
  }

  return level[0]; //root
}

class Block {
  constructor(index, timestamp, transactions, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions; //instead of data, used array
    this.previousHash = previousHash;
    this.nonce = 0;
    this.merkleRoot = buildMerkleRoot(this.transactions, true); //true is for logs to show
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.previousHash +
      this.timestamp +
      this.merkleRoot + //instead of data
      this.nonce
    );
  }

  mineBlock(difficulty) {  
    const prefix = "0".repeat(difficulty);  
    console.time(`Block #${this.index}, time`);
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.timeEnd(`Block #${this.index}, time`);
    console.log(`Hash: ${this.hash}`);
    console.log(`Sum of nonce: ${this.nonce}`);
  }
}

class Blockchain {
  constructor(difficulty) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), [{ from: "system", to: "user", amount: 0 }], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(transactions) {
    const newBlock = new Block(
      this.chain.length,
      Date.now().toString(),
      transactions, //instead of data
      this.getLatestBlock().hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    const prefix = "0".repeat(this.difficulty);
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.previousHash !== previous.hash) return false;
      if (current.hash !== current.calculateHash()) return false;
      if (!current.hash.startsWith(prefix)) return false;
    }
    return true;
  }
}

let demoChain = new Blockchain(3);

demoChain.addBlock([
  { from: "Saxon", to: "Philipe", amount: 60 },
  { from: "Bruce", to: "Klark", amount: 10 },
  { from: "Barry", to: "GEobard", amount: 25 }
]);

demoChain.addBlock([
  { from: "Sam", to: "Din", amount: 5 },
  { from: "Lisa", to: "Venti", amount: 30 }
]);

console.log("\Is chain valid?:", demoChain.isChainValid()); //true

demoChain.chain[1].transactions[0].amount = 100; //change data for block
demoChain.chain[1].merkleRoot = buildMerkleRoot(demoChain.chain[1].transactions, false); //false is to not show logs (would be duplicating)
demoChain.chain[1].hash = demoChain.chain[1].calculateHash();

console.log("Merkle Root:", demoChain.chain[1].merkleRoot);
console.log("Block hash:", demoChain.chain[1].hash);
console.log("Is chain valid?:", demoChain.isChainValid()); //false