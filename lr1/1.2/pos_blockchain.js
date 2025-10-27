import crypto from "crypto";

// 1️⃣ Клас Validator
class Validator {
  constructor(name, stake) {
    this.name = name;
    this.stake = stake;
  }
}

// 2️⃣ Функція вибору валідатора
function selectValidator(validators) {
  const totalStake = validators.reduce((sum, v) => sum + v.stake, 0);
  let random = Math.random() * totalStake;

  for (const v of validators) {
    random -= v.stake;
    if (random <= 0) return v;
  }
  return validators[validators.length - 1];
}

// 3️⃣ Клас Block (аналогічно до PoW, але без майнінгу)
class Block {
  constructor(index, timestamp, data, previousHash, validator) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.validator = validator;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto
      .createHash("sha256")
      .update(
        this.index +
          this.timestamp +
          JSON.stringify(this.data) +
          this.previousHash +
          this.validator.name
      )
      .digest("hex");
  }
}

// 4️⃣ Клас Blockchain
class Blockchain {
  constructor(validators) {
    this.chain = [this.createGenesisBlock()];
    this.validators = validators;
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), "Genesis Block", "0", {
      name: "System",
    });
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const validator = selectValidator(this.validators);
    const newBlock = new Block(
      this.chain.length,
      new Date().toISOString(),
      data,
      this.getLatestBlock().hash,
      validator
    );
    this.chain.push(newBlock);
    console.log(
      `✅ Block ${newBlock.index} validated by ${validator.name} (stake = ${validator.stake})`
    );
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) {
        console.log(`❌ Hash mismatch at block ${i}`);
        return false;
      }
      if (current.previousHash !== previous.hash) {
        console.log(`❌ Broken link at block ${i}`);
        return false;
      }
    }
    return true;
  }
}

// 5️⃣ Демонстрація
const validators = [
  new Validator("Alice", 5),
  new Validator("Bob", 10),
  new Validator("Charlie", 1),
];

const myChain = new Blockchain(validators);

// створюємо кілька блоків
for (let i = 1; i <= 5; i++) {
  myChain.addBlock({ amount: i * 100 });
}

console.log("\nBlockchain valid?", myChain.isChainValid());

// змінюємо дані — перевіряємо, що ланцюг зламано
myChain.chain[2].data = { amount: 9999 };
console.log("After tampering...");
console.log("Blockchain valid?", myChain.isChainValid());

// 6️⃣ Частота перемог валідаторів
const results = { Alice: 0, Bob: 0, Charlie: 0 };
for (let i = 0; i < 50; i++) {
  const winner = selectValidator(validators);
  results[winner.name]++;
}

console.log("\nValidator win frequency after 50 rounds:");
console.table(results);
