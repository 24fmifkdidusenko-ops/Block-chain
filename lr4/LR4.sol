// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SimpleBank {

    // 1. Owner
    address public owner;

    // 2. User balances
    mapping(address => uint256) public balances;
    mapping(address => bool) public registered;

    uint256 public totalBankBalance;

    // 7. Keep track of all users
    address[] private userAddresses;

    // Structure for returning user balances
    struct UserBalance {
        address user;
        uint256 balance;
    }

    // 3. Constructor
    constructor() {
        owner = msg.sender;
    }

    // 4. Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier isRegistered() {
        require(registered[msg.sender], "You must be registered");
        _;
    }

    // 5. User functions

    // Register user
    function register() public {
        if (!registered[msg.sender]) {
            registered[msg.sender] = true;
            userAddresses.push(msg.sender);
        }
    }

    // Deposit funds
    function deposit() public payable isRegistered {
        require(msg.value > 0, "Must send some ETH");
        balances[msg.sender] += msg.value;
        totalBankBalance += msg.value;
    }

    // View balance
    function getMyBalance() public view isRegistered returns (uint256) {
        return balances[msg.sender];
    }

    // Withdraw funds
    function withdraw(uint256 _amount) public isRegistered {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        totalBankBalance -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    // Transfer funds to another user
    function transfer(address _to, uint256 _amount) public isRegistered {
        require(registered[_to], "Recipient not registered");
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    // 6. Special functions
    function getTotalBalance() public view onlyOwner returns (uint256) {
        return totalBankBalance;
    }

    // 7. Get all users and balances
    function getAllUsersBalance() public view onlyOwner returns (UserBalance[] memory) {
        UserBalance[] memory allBalances = new UserBalance[](userAddresses.length);
        for (uint i = 0; i < userAddresses.length; i++) {
            allBalances[i] = UserBalance({
                user: userAddresses[i],
                balance: balances[userAddresses[i]]
            });
        }
        return allBalances;
    }
}
