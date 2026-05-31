const hre = require("hardhat");

async function main() {
  const contractAddress = "0x70795787F139ae3f105F645364c835e478ADfa15";

  const swift = await hre.ethers.getContractAt(
    "SwiftHyperledgerBesu",
    contractAddress
  );

  const boc = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";

  const tx = await swift.transferToBank(
    boc,
    "BOA-to-BOC Grandma transfer",
    {
      value: hre.ethers.parseEther("10"),
    }
  );

  const receipt = await tx.wait();

  console.log("Transfer tx:", receipt.hash);
  console.log("Block:", receipt.blockNumber);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});