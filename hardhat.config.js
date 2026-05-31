require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const {
  SWIFT_PRIVATE_KEY,
  BOA_PRIVATE_KEY,
  BOC_PRIVATE_KEY,
  HACKER_PRIVATE_KEY,
  RPC_URL,
} = process.env;

module.exports = {
  solidity: "0.8.20",
  networks: {
    besuSwift: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: [SWIFT_PRIVATE_KEY],
      gasPrice: 0,
    },
    besuBOA: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: [BOA_PRIVATE_KEY],
      gasPrice: 0,
    },
    besuBOC: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: [BOC_PRIVATE_KEY],
      gasPrice: 0,
    },
    besuHacker: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
      accounts: [HACKER_PRIVATE_KEY],
      gasPrice: 0,
    },
  },
};