# SWIFT Hyperledger Besu Settlement Network

A SWIFT-inspired interbank settlement platform built on Hyperledger Besu using QBFT consensus.

The platform demonstrates how a permissioned blockchain can be used to manage approved financial institutions, execute bank-to-bank settlements, monitor liquidity, and provide operational visibility through a modern React dashboard.

## Features

### Permissioned Network

* Hyperledger Besu QBFT consensus
* Four validator nodes
* Account allowlisting
* Permissioned participation

### SWIFT Administration

* SWIFT operator wallet controls bank onboarding
* Approve banks
* Remove banks
* On-chain bank registry
* Bank names stored on-chain

### Settlement Engine

* Approved banks can transfer funds between each other
* Unauthorized participants are rejected
* Settlement references recorded on-chain
* Complete settlement audit trail

### Liquidity Monitoring

* Real-time wallet balances for approved banks
* Liquidity visibility across participating institutions

### Audit & Compliance

* Settlement history
* Bank approval history
* Bank removal history
* Security monitoring for rejected settlement attempts

### Frontend Dashboard

* React
* Ethers.js
* MetaMask integration
* Automatic network switching
* Real-time blockchain data

## Technology Stack

### Blockchain

* Hyperledger Besu
* QBFT Consensus
* Solidity
* Hardhat
* Ethers.js

### Frontend

* React
* Vite
* MetaMask

### Infrastructure

* Permissioned Ethereum Network
* JSON-RPC
* Local Validator Nodes

## Smart Contract Capabilities

### Bank Management

approveBank(address bank, string name)

removeBank(address bank, string name)

getApprovedBanks()

### Settlement

transferToBank(address toBank, string paymentReference)

### Queries

approvedBanks(address)

bankNames(address)

SWIFT()

## Security Controls

### Network Layer

* Account allowlisting
* Permissioned validator network
* QBFT consensus

### Smart Contract Layer

* SWIFT-only administration
* Approved-bank-only settlements
* Settlement audit trail

### Monitoring Layer

* Settlement history
* Administrative history
* Rejected transaction monitoring
* Liquidity visibility

## Example Workflow

1. SWIFT operator approves a bank.
2. Approved bank appears in the dashboard.
3. Liquidity becomes visible.
4. Bank initiates a settlement.
5. Settlement is finalized by QBFT validators.
6. Event is recorded in settlement history.
7. Unauthorized attempts are logged by the monitoring layer.

## Future Enhancements

* Multi-currency settlement
* CBDC integration
* ISO 20022 messaging support
* Settlement limits
* Liquidity thresholds
* Risk scoring
* Regulatory reporting
* Transaction analytics
* Cross-chain settlement

## Architecture

┌───────────────────────────────────────────┐
│             React Dashboard               │
│-------------------------------------------│
│ Approved Banks                            │
│ Liquidity Monitoring                      │
│ Settlement History                        │
│ Admin History                             │
│ Security Monitoring                       │
└───────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────┐
│            MetaMask Wallets               │
│-------------------------------------------│
│ SWIFT Operator                            │
│ Bank of America                           │
│ Bank of China                             │
│ JP Morgan                                 │
│ Additional Banks                          │
└───────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────┐
│      SwiftHyperledgerBesu Contract        │
│-------------------------------------------│
│ Approve Bank                              │
│ Remove Bank                               │
│ Bank Registry                             │
│ Settlement Processing                     │
│ Event Emission                            │
└───────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────┐
│       Hyperledger Besu QBFT Network       │
│-------------------------------------------│
│ Validator Node 1                          │
│ Validator Node 2                          │
│ Validator Node 3                          │
│ Validator Node 4                          │
└───────────────────────────────────────────┘
                     │
                     ▼
┌───────────────────────────────────────────┐
│          Security Monitoring              │
│-------------------------------------------│
│ Failed Transactions                       │
│ Unauthorized Attempts                     │
│ Operational Visibility                    │
└───────────────────────────────────────────┘
