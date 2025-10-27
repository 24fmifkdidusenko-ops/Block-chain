const axios = require("axios");

// встав свій URL з ключем
const URL = "https://eth-mainnet.g.alchemy.com/v2/SRPCXKTYTQWI1X39CK39Z3K1GBQFCWWKK2";

axios.post(URL, {
  jsonrpc: "2.0",
  method: "eth_blockNumber",
  params: [],
  id: 1
})
.then(res => console.log(res.data))
.catch(err => console.error(err.response?.status, err.message));
