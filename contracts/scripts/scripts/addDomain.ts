import hre from "hardhat";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;

  const registry = await ethers.getContractAt(
    "PhishingRegistry",
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );

  const tx = await registry.addDomain(
    "blockchain-phishing-demo.com"
  );

  await tx.wait();

  console.log("Phishing domain added successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
