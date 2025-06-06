const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  const wallet = new ethers.Wallet(privateKey, provider);

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const abi = [
    {
      "inputs": [
        { "internalType": "string[]", "name": "_candidateNames", "type": "string[]" },
        { "internalType": "uint256", "name": "_durationInMinutes", "type": "uint256" }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [ { "internalType": "string", "name": "_name", "type": "string" } ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ],
      "name": "candidates",
      "outputs": [
        { "internalType": "string", "name": "name", "type": "string" },
        { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotes",
      "outputs": [
        {
          "components": [
            { "internalType": "string", "name": "name", "type": "string" },
            { "internalType": "uint256", "name": "voteCount", "type": "uint256" }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [ { "internalType": "uint256", "name": "_candidateIndex", "type": "uint256" } ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

  // Connect to deployed contract with signer (wallet)
  const contract = new ethers.Contract(contractAddress, abi, wallet);

  // 1. Call a read-only function (get all votes)
  const votes = await contract.getAllVotes();
  console.log("Votes:");
  votes.forEach((candidate, index) => {
    console.log(`Candidate ${index}: ${candidate.name}, Votes: ${candidate.voteCount.toString()}`);
  });

  // 2. Send a transaction to vote for candidate 0
  console.log("Voting for candidate 0...");
  const tx = await contract.vote(0);
  console.log("Transaction sent. Hash:", tx.hash);

  // Wait for transaction confirmation
  await tx.wait();
  console.log("Transaction mined!");

  // 3. Fetch votes again after voting
  const updatedVotes = await contract.getAllVotes();
  console.log("Updated Votes:");
  updatedVotes.forEach((candidate, index) => {
    console.log(`Candidate ${index}: ${candidate.name}, Votes: ${candidate.voteCount.toString()}`);
  });
}

main().catch(console.error);
