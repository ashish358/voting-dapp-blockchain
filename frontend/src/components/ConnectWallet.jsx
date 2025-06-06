import { useState } from "react";

const ConnectWallet = ({ onConnect }) => {
  const [account, setAccount] = useState("");

  async function connect() {
    if (!window.ethereum) return alert("Install MetaMask");
    const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(addr);
    onConnect(addr);
  }

  return (
    <button
      onClick={connect}
      className="bg-green-600 text-white px-4 py-2 rounded-lg mx-auto block"
    >
      {account ? `Connected: ${account.slice(0, 6)}…` : "Connect MetaMask"}
    </button>
  );
};

export default ConnectWallet;
