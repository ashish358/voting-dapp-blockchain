require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();


// module.exports = {
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545",
//     },
//   },
// };



module.exports = {
  solidity: "0.8.28",
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: ["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],  // use private key from .env
    },
    // ... other network configs
  },
  // ... rest of config
};
