import hre from "hardhat";

async function main() {
  const connection = await hre.network.create();
  const { ethers } = connection;

  const registry = await ethers.deployContract("PhishingRegistry");

  await registry.waitForDeployment();

  console.log(
    "PhishingRegistry deployed to:",
    await registry.getAddress()
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
