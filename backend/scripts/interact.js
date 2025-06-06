const hre = require("hardhat");

async function main() {
  // The deployed contract address
  const votingAddress = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";

  // Get contract instance
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = Voting.attach(votingAddress);

  // Call a view function - get all candidates
  const candidates = await voting.getCandidates(); // adjust based on your contract's function
  console.log("Candidates:", candidates);

  // Vote for a candidate (e.g., candidate index 1)
  const tx = await voting.vote(1);
  await tx.wait();

  console.log("Voted for candidate 1");

  // Get the winner
  const winner = await voting.getWinner();
  console.log("Current winner:", winner);
}

main()
  .then(() => process.exit(0))
  .catch(console.error);
