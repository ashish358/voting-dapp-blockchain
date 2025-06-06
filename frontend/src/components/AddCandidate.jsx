// AddCandidate.jsx – visible only to owner
import { useState, useEffect } from "react";
import { getVotingContract } from "../utils/contract";
// import { errors } from "ethers";

const AddCandidate = () => {
  const [name, setName] = useState("");
  const [isOwner, setIsOwner] = useState(false);

useEffect(() => {
  (async () => {
    try {
      const contract = getVotingContract();
      const owner = await contract.owner();
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      setIsOwner(accounts[0]?.toLowerCase() === owner.toLowerCase());
    } catch (error) {
      console.log(error.message);
    }
  })();
}, []);


  if (!isOwner) return null;

  async function add() {
    const contract = getVotingContract();
    const tx = await contract.addCandidate(name);
    await tx.wait();
    setName("");
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Candidate name"
        className="border p-2 rounded w-60 text-center"
      />
      <button onClick={add} className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Candidate
      </button>
    </div>
  );
};

export default AddCandidate;
