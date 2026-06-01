const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Swift = await hre.ethers.getContractFactory(
    "SwiftHyperledgerBesu"
  );

  const swift = await Swift.deploy();

  await swift.waitForDeployment();

  const contractAddress = await swift.getAddress();

  console.log("SWIFT contract deployed to:", contractAddress);

  // -------------------------
  // Frontend contract address
  // -------------------------

  const frontendAddressFile = path.join(
    __dirname,
    "../frontend/src/contractAddress.js"
  );

  fs.writeFileSync(
    frontendAddressFile,
    `export const CONTRACT_ADDRESS = "${contractAddress}";\n`
  );

  console.log("Updated frontend contract address.");

  // -------------------------
  // Deployment metadata
  // -------------------------

  const deploymentsDir = path.join(
    __dirname,
    "../deployments"
  );

  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(
    deploymentsDir,
    "besu.json"
  );

  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(
      {
        network: "besu",
        contract: contractAddress,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log("Updated deployments/besu.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});