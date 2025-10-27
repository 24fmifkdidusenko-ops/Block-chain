// listAccounts.js
const { ethers } = require("ethers");

async function main() {
  // Connect to local Ganache blockchain
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");

  // Get list of accounts
  const accounts = await provider.listAccounts();
  console.log("Accounts:", accounts);

  // Print balance of each account in ETH
  for (const addr of accounts) {
    const balance = await provider.getBalance(addr);
    console.log(addr, ethers.utils.formatEther(balance), "ETH");
  }
}

main().catch(console.error);
