// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";

contract VibeCasterPoints is Ownable {
    
    mapping(address => uint256) public userPoints;
    mapping(address => bool) public authorizedContracts;
    mapping(address => uint256) public lastLoginTimestamp;
    mapping(address => uint256) public loginStreak;
    mapping(address => uint256) public activityStreak;
    mapping(address => uint256) public lastActivityTimestamp;
    
    uint256 public dailyLoginPoints = 5;
    uint256 public streakBonusPoints = 2;
    uint256 public activityStreakBonus = 3;
    uint256 constant DAY = 1 days;
    
    event PointsAwarded(address indexed user, uint256 amount, string reason);
    event PointsDeducted(address indexed user, uint256 amount, string reason);
    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);
    event DailyLogin(address indexed user, uint256 points, uint256 streak);
    event ActivityStreak(address indexed user, uint256 streak, uint256 bonusPoints);

    constructor(address admin) Ownable(admin) {}

    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }

    function authorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }

    function deauthorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress);
    }

    function earnPoints(address user, uint256 amount, string memory reason) external onlyAuthorized {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        
        userPoints[user] += amount;
        emit PointsAwarded(user, amount, reason);
    }

    function deductPoints(address user, uint256 amount, string memory reason) external onlyAuthorized {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        require(userPoints[user] >= amount, "Insufficient points");
        
        userPoints[user] -= amount;
        emit PointsDeducted(user, amount, reason);
    }

    function dailyLogin() external {
        uint256 currentTime = block.timestamp;
        
        // Check if it's a new day
        if (currentTime >= lastLoginTimestamp[msg.sender] + DAY) {
            if (currentTime < lastLoginTimestamp[msg.sender] + 2 * DAY) {
                // Consecutive day
                loginStreak[msg.sender]++;
            } else {
                // Streak broken, reset to 1
                loginStreak[msg.sender] = 1;
            }
            
            lastLoginTimestamp[msg.sender] = currentTime;
            
            // Award points
            uint256 pointsToAward = dailyLoginPoints + (loginStreak[msg.sender] * streakBonusPoints);
            userPoints[msg.sender] += pointsToAward;
            
            emit DailyLogin(msg.sender, pointsToAward, loginStreak[msg.sender]);
        }
    }

    function recordActivity() external onlyAuthorized {
        uint256 currentTime = block.timestamp;
        address user = tx.origin; // Get the original user who initiated the transaction
        
        // Check if it's a new day
        if (currentTime >= lastActivityTimestamp[user] + DAY) {
            if (currentTime < lastActivityTimestamp[user] + 2 * DAY) {
                // Consecutive day of activity
                activityStreak[user]++;
            } else {
                // Streak broken, reset to 1
                activityStreak[user] = 1;
            }
            
            lastActivityTimestamp[user] = currentTime;
            
            // Award streak bonus points
            if (activityStreak[user] > 1) {
                uint256 bonusPoints = activityStreak[user] * activityStreakBonus;
                userPoints[user] += bonusPoints;
                emit ActivityStreak(user, activityStreak[user], bonusPoints);
            }
        }
    }

    function getPoints(address user) external view returns (uint256) {
        return userPoints[user];
    }

    function getLoginStreak(address user) external view returns (uint256) {
        return loginStreak[user];
    }

    function getActivityStreak(address user) external view returns (uint256) {
        return activityStreak[user];
    }

    function getLastLogin(address user) external view returns (uint256) {
        return lastLoginTimestamp[user];
    }

    function getLastActivity(address user) external view returns (uint256) {
        return lastActivityTimestamp[user];
    }

    function updatePointValues(uint256 newDailyLoginPoints, uint256 newStreakBonusPoints, uint256 newActivityStreakBonus) external onlyOwner {
        dailyLoginPoints = newDailyLoginPoints;
        streakBonusPoints = newStreakBonusPoints;
        activityStreakBonus = newActivityStreakBonus;
    }

    function getLeaderboard(uint256 startIndex, uint256 endIndex) external view returns (address[] memory, uint256[] memory) {
        require(startIndex < endIndex, "Invalid range");
        require(endIndex - startIndex <= 100, "Range too large");
        
        // This is a simplified leaderboard - in production you might want a more sophisticated approach
        // For now, we'll return empty arrays as this would require tracking all users
        address[] memory users = new address[](0);
        uint256[] memory points = new uint256[](0);
        
        return (users, points);
    }

    function isAuthorized(address contractAddress) external view returns (bool) {
        return authorizedContracts[contractAddress];
    }
}
