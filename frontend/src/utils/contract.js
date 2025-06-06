import { ethers } from "ethers";
import addressJson from "../contract-address.json";
import abiJson from "../Voting.json";

export const getVotingContract = () => {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(addressJson.Voting, abiJson.abi, signer);
};
