// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Main Rumor Verification Contract
contract RumorVerification is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    IERC20 public immutable guiToken;
    Counters.Counter private _rumorIds;

    struct Rumor {
        uint256 id;
        address submitter;
        string content;
        string[] tags;
        uint256 submissionFee;
        uint256 totalTrueVotes;
        uint256 totalFalseVotes;
        uint256 totalTrueStake;
        uint256 totalFalseStake;
        uint256 createdAt;
        uint256 expiresAt;
        bool resolved;
        bool outcome;
        uint256 rewardPool;
    }

    struct Vote {
        bool isTrue;
        uint256 stake;
        bool claimed;
        uint256 timestamp;
    }

    mapping(uint256 => Rumor) public rumors;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => address[]) public rumorVoters;
    mapping(address => uint256) public userReputation;
    mapping(address => uint256) public totalVotesCount;
    mapping(address => uint256) public correctVotesCount;

    uint256 public constant SUBMISSION_FEE = 10 * 10**18; // 10 GUI
    uint256 public constant MIN_VOTE_STAKE = 1 * 10**18; // 1 GUI
    uint256 public constant MAX_VOTE_STAKE = 5 * 10**18; // 5 GUI
    uint256 public constant VERIFICATION_WINDOW = 24 hours;
    uint256 public constant SUBMITTER_BONUS = 100 * 10**18; // 100 GUI

    event RumorSubmitted(
        uint256 indexed rumorId,
        address indexed submitter,
        string content,
        string[] tags
    );

    event VoteCast(
        uint256 indexed rumorId,
        address indexed voter,
        bool isTrue,
        uint256 stake
    );

    event RumorResolved(
        uint256 indexed rumorId,
        bool outcome,
        uint256 totalStake
    );

    event RewardsClaimed(
        uint256 indexed rumorId,
        address indexed user,
        uint256 amount
    );

    modifier validRumor(uint256 rumorId) {
        require(rumorId < _rumorIds.current(), "Invalid rumor ID");
        _;
    }

    modifier votingActive(uint256 rumorId) {
        require(block.timestamp < rumors[rumorId].expiresAt, "Voting period ended");
        require(!rumors[rumorId].resolved, "Rumor already resolved");
        _;
    }

    constructor(address _guiToken) {
        require(_guiToken != address(0), "Invalid token address");
        guiToken = IERC20(_guiToken);
    }

    function submitRumor(
        string calldata content,
        string[] calldata tags
    ) external returns (uint256) {
        require(bytes(content).length > 0 && bytes(content).length <= 500, "Invalid content length");
        require(tags.length <= 5, "Too many tags");

        require(
            guiToken.transferFrom(msg.sender, address(this), SUBMISSION_FEE),
            "Transfer failed"
        );

        uint256 rumorId = _rumorIds.current();
        _rumorIds.increment();

        Rumor storage rumor = rumors[rumorId];
        rumor.id = rumorId;
        rumor.submitter = msg.sender;
        rumor.content = content;
        rumor.tags = tags;
        rumor.submissionFee = SUBMISSION_FEE;
        rumor.createdAt = block.timestamp;
        rumor.expiresAt = block.timestamp + VERIFICATION_WINDOW;

        emit RumorSubmitted(rumorId, msg.sender, content, tags);
        return rumorId;
    }

    function vote(
        uint256 rumorId,
        bool isTrue,
        uint256 stake
    ) external validRumor(rumorId) votingActive(rumorId) {
        require(stake >= MIN_VOTE_STAKE && stake <= MAX_VOTE_STAKE, "Invalid stake amount");
        require(votes[rumorId][msg.sender].stake == 0, "Already voted");
        require(msg.sender != rumors[rumorId].submitter, "Submitter cannot vote");

        require(
            guiToken.transferFrom(msg.sender, address(this), stake),
            "Transfer failed"
        );

        votes[rumorId][msg.sender] = Vote({
            isTrue: isTrue,
            stake: stake,
            claimed: false,
            timestamp: block.timestamp
        });

        rumorVoters[rumorId].push(msg.sender);

        Rumor storage rumor = rumors[rumorId];
        if (isTrue) {
            rumor.totalTrueVotes++;
            rumor.totalTrueStake += stake;
        } else {
            rumor.totalFalseVotes++;
            rumor.totalFalseStake += stake;
        }

        emit VoteCast(rumorId, msg.sender, isTrue, stake);
    }

    function resolveRumor(uint256 rumorId, bool outcome) external onlyOwner validRumor(rumorId) {
        Rumor storage rumor = rumors[rumorId];
        require(!rumor.resolved, "Already resolved");
        require(block.timestamp >= rumor.expiresAt, "Voting still active");

        rumor.resolved = true;
        rumor.outcome = outcome;

        // Calculate reward pool
        uint256 totalStake = rumor.totalTrueStake + rumor.totalFalseStake;
        rumor.rewardPool = totalStake;

        // Reward submitter if rumor was confirmed true
        if (outcome) {
            guiToken.transfer(rumor.submitter, SUBMITTER_BONUS);
            userReputation[rumor.submitter] += 2; // Bonus reputation for accurate submission
        }

        emit RumorResolved(rumorId, outcome, totalStake);
    }

    function claimRewards(uint256 rumorId) external nonReentrant validRumor(rumorId) {
        Rumor storage rumor = rumors[rumorId];
        require(rumor.resolved, "Rumor not resolved");

        Vote storage userVote = votes[rumorId][msg.sender];
        require(userVote.stake > 0, "No vote found");
        require(!userVote.claimed, "Already claimed");

        userVote.claimed = true;
        totalVotesCount[msg.sender]++;

        uint256 reward = 0;

        if (userVote.isTrue == rumor.outcome) {
            // Winner - calculate proportional reward
            uint256 winnerPool = rumor.outcome ? rumor.totalTrueStake : rumor.totalFalseStake;
            uint256 loserPool = rumor.outcome ? rumor.totalFalseStake : rumor.totalTrueStake;

            // Return original stake + proportional share of loser pool
            reward = userVote.stake + (loserPool * userVote.stake / winnerPool);

            guiToken.transfer(msg.sender, reward);
            userReputation[msg.sender]++;
            correctVotesCount[msg.sender]++;
        } else {
            // Loser - stake is forfeited, reputation decreases
            if (userReputation[msg.sender] > 0) {
                userReputation[msg.sender]--;
            }
        }

        emit RewardsClaimed(rumorId, msg.sender, reward);
    }

    function batchClaimRewards(uint256[] calldata rumorIds) external {
        for (uint256 i = 0; i < rumorIds.length; i++) {
            if (canClaimReward(rumorIds[i], msg.sender)) {
                this.claimRewards(rumorIds[i]);
            }
        }
    }

    function canClaimReward(uint256 rumorId, address user) public view returns (bool) {
        if (rumorId >= _rumorIds.current()) return false;

        Rumor storage rumor = rumors[rumorId];
        Vote storage userVote = votes[rumorId][user];

        return rumor.resolved && userVote.stake > 0 && !userVote.claimed;
    }

    function getRumorDetails(uint256 rumorId) external view validRumor(rumorId) returns (
        address submitter,
        string memory content,
        string[] memory tags,
        uint256 totalTrueVotes,
        uint256 totalFalseVotes,
        uint256 totalTrueStake,
        uint256 totalFalseStake,
        uint256 createdAt,
        uint256 expiresAt,
        bool resolved,
        bool outcome,
        uint256 rewardPool
    ) {
        Rumor storage rumor = rumors[rumorId];
        return (
            rumor.submitter,
            rumor.content,
            rumor.tags,
            rumor.totalTrueVotes,
            rumor.totalFalseVotes,
            rumor.totalTrueStake,
            rumor.totalFalseStake,
            rumor.createdAt,
            rumor.expiresAt,
            rumor.resolved,
            rumor.outcome,
            rumor.rewardPool
        );
    }

    function getUserVote(uint256 rumorId, address user) external view returns (
        bool isTrue,
        uint256 stake,
        bool claimed,
        uint256 timestamp
    ) {
        Vote storage userVote = votes[rumorId][user];
        return (userVote.isTrue, userVote.stake, userVote.claimed, userVote.timestamp);
    }

    function getActiveRumors() external view returns (uint256[] memory) {
        uint256[] memory activeRumors = new uint256[](_rumorIds.current());
        uint256 activeCount = 0;

        for (uint256 i = 0; i < _rumorIds.current(); i++) {
            if (!rumors[i].resolved && block.timestamp < rumors[i].expiresAt) {
                activeRumors[activeCount] = i;
                activeCount++;
            }
        }

        // Resize array
        uint256[] memory result = new uint256[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            result[i] = activeRumors[i];
        }

        return result;
    }

    function getUserStats(address user) external view returns (
        uint256 reputation,
        uint256 totalVotes,
        uint256 correctVotes,
        uint256 accuracy // percentage * 100
    ) {
        uint256 total = totalVotesCount[user];
        uint256 correct = correctVotesCount[user];
        uint256 acc = total > 0 ? (correct * 10000) / total : 0; // 4 decimal places

        return (
            userReputation[user],
            total,
            correct,
            acc
        );
    }

    function getTotalRumors() external view returns (uint256) {
        return _rumorIds.current();
    }

    function getRumorVoters(uint256 rumorId) external view validRumor(rumorId) returns (address[] memory) {
        return rumorVoters[rumorId];
    }

    // Emergency functions
    function pause() external onlyOwner {
        // Implementation for emergency pause
    }

    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(guiToken), "Cannot withdraw GUI tokens");
        IERC20(token).transfer(owner(), amount);
    }

    function updateVerificationWindow(uint256 newWindow) external onlyOwner {
        require(newWindow >= 1 hours && newWindow <= 7 days, "Invalid window");
        // This would require a contract upgrade or new deployment
    }
}