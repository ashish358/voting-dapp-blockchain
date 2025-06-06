// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address public owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate(_candidateNames[i], 0));
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Owner only");
        _;
    }

    function addCandidate(string calldata _name) external onlyOwner {
        candidates.push(Candidate(_name, 0));
    }

    function vote(uint256 _candidateIndex) external {
        require(!voters[msg.sender], "Already voted");
        require(_candidateIndex < candidates.length, "Bad index");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

    function getAllVotes() external view returns (Candidate[] memory) {
        return candidates;
    }

    function votingActive() external view returns (bool) {
        return block.timestamp >= votingStart && block.timestamp < votingEnd;
    }

    function remainingTime() external view returns (uint256) {
        if (block.timestamp >= votingEnd) return 0;
        return votingEnd - block.timestamp;
    }
}
