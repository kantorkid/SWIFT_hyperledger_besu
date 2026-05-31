const hre = require("hardhat");

async function main() {
  const contractAddress = "0x70795787F139ae3f105F645364c835e478ADfa15";

  const swift = await hre.ethers.getContractAt(
    "SwiftHyperledgerBesu",
    contractAddress
  );

  const boa = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
  const boc = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";

  console.log("Approving BOA...");
  await (await swift.approveBank(boa, "Bank of America")).wait();

  console.log("Approving BOC...");
  await (await swift.approveBank(boc, "Bank of China")).wait();

  console.log("BOA approved:", await swift.approvedBanks(boa));
  console.log("BOC approved:", await swift.approvedBanks(boc));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});