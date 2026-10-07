import hre from "hardhat";

const CONTRACT_ADDRESS =
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;

  const registry = await ethers.getContractAt(
    "PhishingRegistry",
    CONTRACT_ADDRESS
  );

  const domain = "blockchain-phishing-demo.com";

  const result = await registry.isPhishingDomain(domain);

  console.log("Domain:", domain);
  console.log("Blockchain phishing match:", result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});