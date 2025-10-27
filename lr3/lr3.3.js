import Web3 from 'web3';

// 1) Connect to local Ganache
const web3 = new Web3('http://127.0.0.1:8545');

// 2) Contract ABI (from Remix compilation)
const abi = [
  {
    "inputs": [],
    "name": "greet",
    "outputs": [{"internalType": "string","name":"","type":"string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType":"string","name":"_newGreet","type":"string"}],
    "name":"setGreet",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  }
];

// 3) Contract address (paste your deployed contract address from Remix)
const contractAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

// 4) Create contract instance
const contract = new web3.eth.Contract(abi, contractAddress);

async function main() {
  // 5) Get Ganache accounts
  const accounts = await web3.eth.getAccounts();
  console.log("Accounts:", accounts);

  // 6) Call greet() (view function)
  const currentGreet = await contract.methods.greet().call();
  console.log("Current greet:", currentGreet);

  // 7) Send transaction to setGreet()
  const tx = await contract.methods.setGreet("Hello from Web3.js!").send({
    from: accounts[0],
    gas: 100000
  });
  console.log("Transaction hash:", tx.transactionHash);

  // 8) Call greet() again to see updated value
  const newGreet = await contract.methods.greet().call();
  console.log("Updated greet:", newGreet);
}

main().catch(console.error);
