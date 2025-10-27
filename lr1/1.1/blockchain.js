const crypto = require("crypto");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  // 2. Функція для розрахунку хешу (SHA-256)
  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce)
      .digest("hex");
  }

  // 3. Функція майнінгу блоку
  mineBlock(difficulty) {
    console.log(`⛏️ Mining block ${this.index}...`);
    const startTime = Date.now();

    while (!this.hash.startsWith("0".repeat(difficulty))) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    const endTime = Date.now();
    console.log(`✅ Block mined: ${this.hash}`);
    console.log(`⏱️ Time: ${(endTime - startTime) / 1000}s | Nonce: ${this.nonce}\n`);
  }
}

// 4. Клас Blockchain
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newData) {
    const prevBlock = this.getLatestBlock();
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      newData,
      prevBlock.hash
    );
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  // Перевірка цілісності блокчейну
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const prevBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log(`❌ Hash mismatch at block ${i}`);
        return false;
      }

      if (currentBlock.previousHash !== prevBlock.hash) {
        console.log(`❌ Previous hash mismatch at block ${i}`);
        return false;
      }

      if (!currentBlock.hash.startsWith("0".repeat(this.difficulty))) {
        console.log(`❌ Block ${i} doesn't meet difficulty requirement`);
        return false;
      }
    }
    return true;
  }
}

// Створюємо блокчейн
const myCoin = new Blockchain();

console.log("⛓️ Adding blocks to the chain...");
myCoin.addBlock({ amount: 10 });
myCoin.addBlock({ amount: 25 });
myCoin.addBlock({ amount: 50 });

console.log("Blockchain valid?", myCoin.isChainValid()); // → true

// Змінюємо дані у другому блоці
myCoin.chain[1].data = "Hacked!";
console.log("\nAfter tampering...");
console.log("Blockchain valid?", myCoin.isChainValid()); // → false
// === Пункт 6. Альтернативний майнер ===

class BlockAlt extends Block {
  mineBlockAlt() {
    console.log(`⚙️ Mining block ${this.index} (alternative rule)...`);
    const startTime = Date.now();

    // Нове правило: 3-й символ хешу має бути '3'
    do {
      this.nonce++;
      this.hash = this.calculateHash();
    } while (this.hash[2] !== "3");

    const endTime = Date.now();
    console.log(`✅ Alt block mined: ${this.hash}`);
    console.log(`⏱️ Time: ${(endTime - startTime) / 1000}s | Nonce: ${this.nonce}\n`);
  }
}

// Демонстрація роботи альтернативного майнера
const altBlock = new BlockAlt(100, new Date().toISOString(), { msg: "Alt mining" }, "0");
altBlock.mineBlockAlt();

