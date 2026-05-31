const hre = require("hardhat");

async function main() {
  const Swift = await hre.ethers.getContractFactory("SwiftHyperledgerBesu");
  const swift = await Swift.deploy();

  await swift.waitForDeployment();

  console.log("SWIFT contract deployed to:", await swift.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});