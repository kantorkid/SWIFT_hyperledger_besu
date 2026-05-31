// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.20;

/**
 * @title SWIFT
 * @dev prevent transactions outside of SWIFT Hyperledger-Besu
 */


contract SwiftHyperledgerBesu {

    address public SWIFT;

    mapping (address => bool) public approvedBanks;


    event BankApproved(
        address indexed bank, 
        string name);


    event BankRemoved(
        address indexed bank, 
        string name);


    event BankTransfer(
        address indexed fromBank,
        address indexed toBank,
        uint256 amount,
        string paymentReference
    );


    modifier onlySwift() {
        require(
            msg.sender == SWIFT, 
            "Only SWIFT can perform this function.");
        _;
    }


    modifier onlyApprovedBanks(address bank) {
        require(
            approvedBanks[bank], 
            "Only Approved Banks can perform this function.");
        _;
    }


    constructor(){
        SWIFT = msg.sender;
    }


    function approveBank(
        address bank, 
        string calldata name) 
            external 
            onlySwift 
    {
        approvedBanks[bank] = true;
        emit BankApproved(bank, name);
    }

    function removeBank(
        address bank, 
        string calldata name) 
            external 
            onlySwift 
    {
        approvedBanks[bank] = false;
        emit BankRemoved(bank, name);
    }

    function transferToBank(
        address payable toBank, 
        string calldata paymentReference) 
            external 
            payable 
            onlyApprovedBanks(msg.sender)
            onlyApprovedBanks(toBank)
    {
        (bool success, ) = toBank.call{value: msg.value}("");
        require(success, "ETH transfer failed.");
        
        emit BankTransfer(msg.sender, toBank, msg.value, paymentReference);
    }

}






