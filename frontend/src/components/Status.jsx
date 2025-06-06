// Status.jsx
import { useEffect, useState } from "react";
import { getVotingContract } from "../utils/contract";

const Status = () => {
  const [active, setActive] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const load = async () => {
      const c = getVotingContract();
      setActive(await c.votingActive());
      setTime(Number(await c.remainingTime()));
    };
    load();
    const id = setInterval(load, 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-center mt-4">
      {active ? `Voting open – ${time}s remaining` : "Voting closed"}
    </p>
  );
};

export default Status;
