import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const contractAddress = "0x850ec3780cedfdb116e38b009d0bf7a1ef1b8b38";
const contractAbi = [
  {
    "inputs": [
      { "internalType": "string[]", "name": "_candidateNames", "type": "string[]" },
      { "internalType": "uint256", "name": "_durationInMinutes", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }],
    "name": "addCandidate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
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
    "inputs": [],
    "name": "owner",
    "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "remainingTime",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_candidateIndex", "type": "uint256" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "voters",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingActive",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingEnd",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "votingStart",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function VotingDapp() {
  const [wallet, setWallet] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState("");
  const [remainingTime, setRemainingTime] = useState(null);
  const [voteIndex, setVoteIndex] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  // Connect wallet using Metamask
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install Metamask!");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);
      setFeedback("");
    } catch (error) {
      console.error(error);
      alert("Failed to connect wallet");
    }
  };

  // Create contract instance with signer
  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractAbi, signer);
  };

  // Fetch voting active status and remaining time
  const fetchVotingStatus = async () => {
    if (!wallet) {
      setStatus("Connect wallet first");
      setRemainingTime(null);
      return;
    }
    try {
      const contract = getContract();
      const active = await contract.votingActive();
      const timeBN = await contract.remainingTime();
      setStatus(active ? "Voting is currently open" : "Voting is finished");
      setRemainingTime(timeBN.toNumber());
    } catch (error) {
      console.error("Error fetching voting status:", error);
      setStatus("Failed to get voting status");
      setRemainingTime(null);
    }
  };

  // Fetch all candidates and their votes
  const fetchCandidates = async () => {
    if (!wallet) {
      setFeedback("Connect wallet first");
      return;
    }
    setLoading(true);
    try {
      const contract = getContract();
      const rawCandidates = await contract.getAllVotes();
      const formatted = rawCandidates.map((cand) => ({
        name: cand.name,
        voteCount: cand.voteCount.toNumber ? cand.voteCount.toNumber() : Number(cand.voteCount),
      }));
      setCandidates(formatted);
      setFeedback("");
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setFeedback("Failed to fetch candidates");
    }
    setLoading(false);
  };

  // Handle voting transaction
  const vote = async () => {
    if (!wallet) {
      setFeedback("Connect wallet first");
      return;
    }
    if (voteIndex === null) {
      setFeedback("Select a candidate to vote");
      return;
    }
    setLoading(true);
    setFeedback("Sending vote transaction...");
    try {
      const contract = getContract();
      const tx = await contract.vote(voteIndex);
      await tx.wait();
      setFeedback("Vote added successfully!");
      await fetchCandidates();
      await fetchVotingStatus();
    } catch (error) {
      console.error(error);
      setFeedback("Vote transaction failed");
    }
    setLoading(false);
  };

  // On wallet connect or voteIndex change, fetch data
  useEffect(() => {
    if (wallet) {
      fetchCandidates();
      fetchVotingStatus();
    }
  }, [wallet]);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Voting DApp</h1>

      {!wallet ? (
        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-6"
        >
          Connect Metamask
        </button>
      ) : (
        <p className="mb-4 text-center text-green-700">
          Connected Wallet: {wallet}
        </p>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Voting Status</h2>
        <p>{status}</p>
        {remainingTime !== null && <p>Remaining Time: {remainingTime} seconds</p>}
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Candidates</h2>
        {loading && <p>Loading...</p>}
        {!loading && candidates.length === 0 && <p>No candidates available or voting finished.</p>}
        {candidates.length > 0 && (
          <table className="w-full border border-gray-300 rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">#</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Votes</th>
                <th className="border p-2">Vote</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((cand, idx) => (
                <tr key={idx} className="text-center">
                  <td className="border p-2">{idx}</td>
                  <td className="border p-2">{cand.name}</td>
                  <td className="border p-2">{cand.voteCount}</td>
                  <td className="border p-2">
                    <input
                      type="radio"
                      name="candidate"
                      value={idx}
                      onChange={() => setVoteIndex(idx)}
                      disabled={!status.includes("open") || loading}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button
        onClick={vote}
        disabled={loading || !wallet}
        className={`w-full py-2 rounded text-white ${
          loading || !wallet ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Vote
      </button>

      {feedback && (
        <p className="mt-4 text-center text-red-600 font-semibold">{feedback}</p>
      )}
    </div>
  );
}
