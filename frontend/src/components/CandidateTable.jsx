// CandidateTable.jsx
import { useEffect, useState } from "react";
import { getVotingContract } from "../utils/contract";

const CandidateTable = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const c = getVotingContract();
      const list = await c.getAllVotes();
      setRows(list);
    };
    fetch();
    window.ethereum?.on("block", fetch); // refresh on new block
    return () => window.ethereum?.removeListener("block", fetch);
  }, []);

  return (
    <table className="table-auto mx-auto mt-8">
      <thead>
        <tr>
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Votes</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c, i) => (
          <tr key={i}>
            <td className="border px-4 py-2">{i}</td>
            <td className="border px-4 py-2">{c.name}</td>
            <td className="border px-4 py-2">{c.voteCount.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CandidateTable;
