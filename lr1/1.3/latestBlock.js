const axios = require("axios");

const API_KEY = "SRPCXKTYTQWI1X39CK39Z3K1GBQFCWWKK2";
const BASE_URL = "https://api.etherscan.io/api";

// Функція отримати останній блок
async function getLatestBlockNumber() {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        module: "proxy",
        action: "eth_blockNumber",
        apikey: API_KEY
      }
    });
    if (res.data.result) {
      return parseInt(res.data.result, 16);
    }
    console.error("Не вдалося отримати номер блоку");
    return null;
  } catch (err) {
    console.error("Помилка API:", err.message);
    return null;
  }
}

// Функція отримати деталі блоку
async function getBlock(blockNumber) {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        module: "proxy",
        action: "eth_getBlockByNumber",
        tag: "0x" + blockNumber.toString(16),
        boolean: "true",
        apikey: API_KEY
      }
    });
    if (res.data.result) {
      const block = res.data.result;
      return {
        number: parseInt(block.number, 16),
        timestamp: new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString(),
        txCount: block.transactions.length,
        hash: block.hash,
        parentHash: block.parentHash
      };
    } else {
      console.error(`Блок ${blockNumber} не знайдено`);
      return null;
    }
  } catch (err) {
    console.error(`Помилка при отриманні блоку ${blockNumber}:`, err.message);
    return null;
  }
}

// Основна функція
async function main() {
  const latest = await getLatestBlockNumber();
  if (!latest) return console.log("Не вдалося отримати останній блок.");

  console.log("Номер останнього блоку:", latest);

  const block = await getBlock(latest);
  if (!block) return;

  console.log("\nДеталі останнього блоку:");
  console.table(block);

  // Останні 5 блоків для середньої кількості транзакцій
  const blocks = [];
  for (let i = 0; i < 5; i++) {
    const b = await getBlock(latest - i);
    if (b) blocks.push(b);
  }

  const avgTx = blocks.reduce((sum, b) => sum + b.txCount, 0) / blocks.length;
  console.log(`Середня кількість транзакцій за останні 5 блоків: ${avgTx.toFixed(2)}`);
}

main();
