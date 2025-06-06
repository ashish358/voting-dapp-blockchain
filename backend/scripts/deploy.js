const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");

  // deploy
  const voting = await Voting.deploy(
    ["Mark", "Mike", "Henry", "Rock"],   // candidates
    10                                    // duration in minutes
  );

  // *** v6: wait until the tx is mined ***
  await voting.deployed();

  // *** v6: get the address ***
//   const address = await voting.getAddress();
  const address = voting.address;

  console.log("Voting deployed to:", address);

  // expose address & ABI to the frontend
  const frontendDir = path.join(__dirname, "..", "..", "frontend", "src");
  fs.mkdirSync(frontendDir, { recursive: true });

  fs.writeFileSync(
    path.join(frontendDir, "contract-address.json"),
    JSON.stringify({ Voting: address }, null, 2)
  );

  fs.copyFileSync(
    path.join(__dirname, "..", "artifacts", "contracts", "Voting.sol", "Voting.json"),
    path.join(frontendDir, "Voting.json")
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
