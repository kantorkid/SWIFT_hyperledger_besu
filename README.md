# SWIFT Hyperledger Besu Settlement Network

A permissioned interbank settlement network built on Hyperledger Besu QBFT consensus.

This project simulates a SWIFT-style banking network where only approved financial institutions may participate in settlement transactions. The platform includes a Solidity-based settlement contract, a React administration dashboard, a Hyperledger Besu QBFT validator network, and Chainlens blockchain explorer integration.

---

# Features

## Permissioned Banking Network

* SWIFT operator-controlled bank onboarding
* SWIFT operator-controlled bank removal
* Approved bank registry
* On-chain bank names
* Permissioned settlement execution
* Unauthorized participant rejection

## Settlement Processing

* Bank-to-bank settlement transfers
* Payment reference tracking
* Settlement audit trail
* Event-based transaction history
* Real-time transaction monitoring

## Dashboard

The React dashboard provides:

* Approved bank monitoring
* Settlement history
* Administration history
* Bank liquidity monitoring
* MetaMask integration
* Smart contract interaction

## Blockchain Infrastructure

* Hyperledger Besu
* QBFT Consensus
* Four-validator architecture
* Local permissioned network
* JSON-RPC endpoint
* Smart contract deployment automation

## Explorer Integration

Chainlens Explorer provides:

* Block explorer
* Transaction explorer
* Smart contract explorer
* Event explorer
* Network activity monitoring
* Account activity monitoring

---

# Architecture

```text
                    React Dashboard
                           │
                           ▼
                SwiftHyperledgerBesu
                    Smart Contract
                           │
                           ▼
              Hyperledger Besu QBFT Network
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
      ▼                    ▼                    ▼
  MetaMask           Chainlens Explorer     Besu RPC
      │                    │
      ▼                    ▼
 Approved Banks     Blockchain Visibility
```

---

# Smart Contract

The network is governed by the `SwiftHyperledgerBesu` contract.

Core functionality:

```solidity
approveBank()
removeBank()
transferToBank()
getApprovedBanks()
```

Only approved banks may transact.

```solidity
modifier onlyApprovedBanks(address bank) {
    require(
        approvedBanks[bank],
        "Only Approved Banks can transact on the SWIFT network."
    );
    _;
}
```

---

# Dashboard Capabilities

## Approved Banks

Displays:

* Bank name
* Wallet address
* Approval status
* Liquidity balance

## Settlement Actions

Allows approved banks to:

* Transfer settlement funds
* Submit payment references
* View settlement outcomes

## Settlement History

Displays:

* Block number
* Sending bank
* Receiving bank
* Settlement amount
* Payment reference
* Transaction hash

## Administration History

Displays:

* Bank approvals
* Bank removals
* Administrative actions

## Liquidity Monitoring

Balances are pulled directly from the Besu network using:

```javascript
provider.getBalance(bankAddress)
```

This provides visibility into available settlement liquidity for participating institutions.

---

# Project Structure

```text
QBFT-Network
│
├── contracts
│   └── SwiftHyperledgerBesu.sol
│
├── scripts
│   ├── deploy.js
│   ├── start-network.sh
│   ├── stop-network.sh
│   ├── reset-network.sh
│   ├── transfer.js
│   └── demoTransfers.js
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── artifacts
├── cache
├── nodes
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/kantorkid/SWIFT_hyperledger_besu.git

cd SWIFT_hyperledger_besu
```

## Install Dependencies

Root project:

```bash
npm install
```

Frontend:

```bash
cd frontend

npm install

cd ..
```

---

# Network Management

## Start Network

```bash
npm run start-network
```

Starts all Besu QBFT validator nodes.

---

## Stop Network

```bash
npm run stop-network
```

Stops all validator nodes.

---

## Reset Network

```bash
npm run reset-network
```

Removes blockchain state and resets the network.

---

## Compile Contracts

```bash
npm run rebuild
```

Compiles all Solidity contracts.

---

## Deploy Contract

```bash
npm run deploy-besu
```

Deploys the settlement contract to the Besu network.

---

## Fresh Start

Completely rebuilds the environment.

```bash
npm run fresh-start
```

Performs:

1. Network reset
2. Validator startup
3. Contract compilation
4. Contract deployment

---

# Start Dashboard

```bash
cd frontend

npm run dev
```

Dashboard:

```text
http://localhost:5173
```

---

# MetaMask Configuration

Network Name:

```text
QBFT Local
```

RPC URL:

```text
http://127.0.0.1:8545
```

Chain ID:

```text
1337
```

Currency Symbol:

```text
ETH
```

---

# Chainlens Explorer

## Requirements

* Docker Desktop
* Running Besu Network

## Clone Chainlens

```bash
git clone https://github.com/web3labs/chainlens-free
```

## Start Explorer

```bash
cd chainlens-free/docker-compose

NODE_ENDPOINT=http://host.docker.internal:8545 \
docker compose \
-f docker-compose.yml \
-f chainlens-extensions/docker-compose-quorum-dev-quickstart.yml \
up
```

## Open Explorer

```text
http://localhost
```

Chainlens automatically indexes:

* Blocks
* Transactions
* Contracts
* Events
* Accounts

---

# Security Model

## SWIFT Operator

The deploying wallet becomes the SWIFT operator.

Responsibilities:

* Approve banks
* Remove banks
* Govern network participation

## Approved Banks

Approved banks may:

* Send settlements
* Receive settlements
* Participate in network operations

## Unauthorized Participants

Unauthorized wallets cannot transact through the settlement network.

Attempting settlement results in:

```text
Only Approved Banks can transact on the SWIFT network.
```

---

# Future Enhancements

* Grafana Loki integration
* Security event monitoring
* Failed transaction visibility
* Node health dashboards
* Elastic Stack integration
* OpenTelemetry metrics
* Containerized deployment
* Role-based administration
* Stablecoin settlement support
* Multi-currency settlement

---

# License

GPL-3.0
