const { ethers } = require("ethers");

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ABI = [
  "function isPhishingDomain(string domain) view returns (bool)"
];

const provider = new ethers.JsonRpcProvider(
  "http://127.0.0.1:8545"
);

const contract = new ethers.Contract(
  CONTRACT_ADDRESS,
  ABI,
  provider
);

async function checkDomain(domain) {
  return await contract.isPhishingDomain(domain);
}

const domain = process.argv[2];

if (domain) {
  checkDomain(domain)
    .then((result) => {
      console.log(result ? "true" : "false");
    })
    .catch((error) => {
      console.error(error.message);
      process.exit(1);
    });
}

module.exports = { checkDomain };