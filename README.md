# SWIFT Hyperledger Besu Settlement Network

## Overview

This project demonstrates a simplified SWIFT-style interbank settlement network built on Hyperledger Besu using the QBFT (Quorum Byzantine Fault Tolerant) consensus algorithm — the recommended enterprise-grade consensus protocol for permissioned financial infrastructure.

The network consists of four permissioned validator nodes and a smart contract that enforces bank-to-bank settlement rules. Only approved banks may initiate settlements, while unauthorized wallets are rejected at the contract layer.

This architecture directly mirrors SWIFT's blockchain interoperability initiatives, where permissioned Besu networks provide instant settlement finality, transaction privacy, and regulatory auditability for cross-border interbank payments.

**Author:** Jake Kantor  
**GitHub:** github.com/kantorkid  
**Contact:** jake.t.kantor@gmail.com

---

## Why Hyperledger Besu

Hyperledger Besu is the recommended enterprise Ethereum client for financial infrastructure because it runs on both private permissioned networks and public EVM-compatible chains using the same stack:

- **Private network** — permissioned QBFT consensus for interbank settlement with instant finality
- **Public chain compatibility** — EVM compatibility preserves optionality for stablecoin and CBDC bridge integration
- **Enterprise-grade privacy** — Tessera integration enables private transactions visible only to counterparties
- **Regulatory alignment** — permissioned node and account allowlisting satisfies compliance requirements for financial institutions

SWIFT's blockchain pilots have used Besu specifically for these reasons. QBFT was chosen over IBFT 2.0 as the recommended enterprise consensus protocol for new deployments.

---

## Architecture

### Network Configuration

| Parameter | Value |
|-----------|-------|
| Consensus | QBFT (Quorum Byzantine Fault Tolerant) |
| Validators | 4 |
| Chain ID | 1337 |
| Block Time | 2 seconds |
| Finality | Instant (Byzantine fault tolerant) |

BOA Wallet
     │
     ▼
┌─────────────────────┐
│ SwiftHyperledgerBesu│
└─────────────────────┘
     ▲
     │
BOC Wallet

     ▼
QBFT Validator Network
(Node1 Node2 Node3 Node4)

### Participants

| Participant | Role |
|-------------|------|
| SWIFT Operator | Contract administrator — approves and removes banks |
| Bank of America (BOA) | Approved settlement bank |
| Bank of China (BOC) | Approved settlement bank |
| Hacker Wallet | Unauthorized participant — demonstrates access control |

### Node Structure

```
QBFT-Network/
├── genesis.json
├── Node-1/data/          ← Validator 1
├── Node-2/data/          ← Validator 2
├── Node-3/data/          ← Validator 3
└── Node-4/data/          ← Validator 4
```

---

## Permission Layers

### Layer 1 — Network Permissioning (Besu)

- **Node allowlisting** — only approved nodes may join the validator network
- **Account allowlisting** — only approved accounts may submit transactions

### Layer 2 — Smart Contract Permissioning

- **Bank approval** — SWIFT operator must explicitly approve each bank
- **Bank removal** — SWIFT operator can revoke bank access
- **Approved-bank-only transfers** — unauthorized addresses are rejected with explicit error messages

---

## Smart Contract

### SwiftHyperledgerBesu.sol

| Function | Access | Description |
|----------|--------|-------------|
| `approveBank(address)` | SWIFT Operator only | Adds a bank to the approved registry |
| `removeBank(address)` | SWIFT Operator only | Revokes bank access |
| `transferToBank(address)` | Approved banks only | Executes settlement between approved banks |

---

## Settlement Workflow

### Successful Settlement

```
Customer requests cross-border transfer
        ↓
Sending bank initiates settlement transaction
        ↓
Smart contract validates sender (approved bank)
        ↓
Smart contract validates recipient (approved bank)
        ↓
Settlement executed on-chain
        ↓
BankTransfer event emitted — immutable audit trail
```

### Unauthorized Settlement Attempt

```
Hacker Wallet attempts settlement
        ↓
Smart contract validates sender
        ↓
Sender not in approved bank registry
        ↓
Transaction reverted: "Only Approved Banks can perform this function."
```

---

## Demonstration Results

### BOA → BOC Settlement
```
Result:   Successful: true
Block:    1411
Gas Used: 39,928
```

### BOC → BOA Settlement
```
Result:   Successful: true
Block:    1412
Gas Used: 39,928
```

### Hacker → BOA (Rejected)
```
Result:  Successful: false
Reason:  Only Approved Banks can perform this function.
```

### Hacker → BOC (Rejected)
```
Result:  Successful: false
Reason:  Only Approved Banks can perform this function.
```

---

## Security Controls

| Layer | Control | Implementation |
|-------|---------|---------------|
| Network | Byzantine fault tolerance | QBFT — tolerates 1 faulty node of 4 |
| Network | Node allowlisting | Unauthorized nodes cannot connect |
| Network | Account allowlisting | Unauthorized accounts cannot transact |
| Contract | Operator role | SWIFT administrator controls bank registry |
| Contract | Access control | `onlyOperator` and `onlyApprovedBank` modifiers |
| Contract | Audit trail | All events emitted on-chain — immutable |

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| Blockchain client | Hyperledger Besu 26.5.0 |
| Consensus | QBFT |
| Smart contracts | Solidity 0.8.20 |
| Development framework | Hardhat |
| Blockchain interaction | Ethers.js |
| Runtime | Node.js |

---

## Relevance to SWIFT Infrastructure

**Cross-border settlement** — atomic settlement between counterparty banks mirrors SWIFT GPI's settlement confirmation guarantees.

**Permissioned validator network** — QBFT with four validators mirrors the consortium model where only approved financial institutions operate network nodes.

**Compliance by design** — account and node allowlisting enforces regulatory requirements at the infrastructure layer.

**Audit trail** — immutable on-chain event logging provides the transparent transaction history required for regulatory reporting and dispute resolution.

**ISO 20022 alignment** — the settlement workflow models the structured financial messaging standard SWIFT is migrating to globally.

---

## Future Enhancements

- Tessera integration for private transactions between counterparties
- TLS encryption for inter-node communication
- Cross-currency atomic swap using Chainlink Price Feeds
- KYC/AML verification integration
- Sanctions screening simulation
- CBDC bridge layer prototype
- Frontend settlement dashboard

---

## Key Takeaway

This project demonstrates how a permissioned blockchain built on Hyperledger Besu with QBFT consensus can model a SWIFT-style settlement network where only approved financial institutions participate in settlement activities, while maintaining a transparent, auditable, and tamper-proof transaction history — the core requirements for enterprise financial infrastructure.

---

*Contact: jake.t.kantor@gmail.com | linkedin.com/in/jakekantor | github.com/kantorkid*