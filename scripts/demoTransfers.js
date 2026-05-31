const hre = require("hardhat");

const CONTRACT_ADDRESS = "0x70795787F139ae3f105F645364c835e478ADfa15";

const BOA = "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73";
const BOC = "0x627306090abaB3A6e1400e9345bC60c78a8BEf57";

async function main() {
  const [sender] = await hre.ethers.getSigners();

  const swift = await hre.ethers.getContractAt(
    "SwiftHyperledgerBesu",
    CONTRACT_ADDRESS,
    sender
  );

  console.log("\n-----------------------------------");
  console.log("Sender:", sender.address);
  console.log("-----------------------------------\n");

  async function attemptTransfer(to, amount, label) {
    console.log(`Attempting: ${label}`);
    console.log(`To: ${to}`);
    console.log(`Amount: ${amount} ETH`);

    try {
      const tx = await swift.transferToBank(
        to,
        label,
        {
          value: hre.ethers.parseEther(amount),
        }
      );

      console.log("Transaction submitted:", tx.hash);

      const receipt = await tx.wait();

      console.log("Successful:", receipt.status === 1);
      console.log("Block:", receipt.blockNumber);
      console.log("Gas used:", receipt.gasUsed.toString());
      console.log("-----------------------------------\n");
    } catch (error) {
      console.log("Successful: false");
      console.log("Rejected reason:", error.shortMessage || error.message);
      console.log("-----------------------------------\n");
    }
  }

  if (sender.address.toLowerCase() === BOA.toLowerCase()) {
    await attemptTransfer(BOC, "1", "BOA to BOC settlement");
  } else if (sender.address.toLowerCase() === BOC.toLowerCase()) {
    await attemptTransfer(BOA, "1", "BOC to BOA settlement");
  } else {
    await attemptTransfer(BOA, "1", "Hacker to BOA attempted settlement");
    await attemptTransfer(BOC, "1", "Hacker to BOC attempted settlement");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});