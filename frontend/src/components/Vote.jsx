// Vote.jsx
import { useState } from "react";
import { getVotingContract } from "../utils/contract";

const Vote = () => {
  const [idx, setIdx] = useState("");

  async function handleVote() {
    try {
      const contract = getVotingContract();
      const tx = await contract.vote(Number(idx));
      await tx.wait();
      alert("Voted!");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <input
        type="number"
        value={idx}
        onChange={e => setIdx(e.target.value)}
        placeholder="Candidate index"
        className="border p-2 rounded w-40 text-center"
      />
      <button onClick={handleVote} className="bg-green-600 text-white px-4 py-2 rounded">
        Add Vote
      </button>
    </div>
  );
};

export default Vote;
