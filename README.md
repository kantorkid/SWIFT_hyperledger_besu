# SWIFT Hyperledger Besu Settlement Network

A SWIFT-inspired interbank settlement network built on Hyperledger Besu using QBFT consensus, Solidity smart contracts, and enterprise-grade observability tooling.

This project demonstrates how approved financial institutions can participate in a permissioned blockchain network, execute interbank settlements, monitor validator health, inspect transactions through a blockchain explorer, and observe network activity through Grafana, Prometheus, and Loki.

---

# Overview

Traditional interbank settlement systems rely on centralized messaging and reconciliation infrastructure.

This project explores how a permissioned blockchain can provide:

* Shared transaction visibility
* Deterministic settlement finality
* Permissioned participation
* On-chain auditability
* Real-time network monitoring
* Smart contract-based governance

The network operates using Hyperledger Besu's QBFT (Istanbul BFT successor) consensus mechanism and a Solidity settlement contract that restricts participation to approved institutions.

---

# Features

## Permissioned Banking Network

* SWIFT operator-controlled governance
* Bank approval workflow
* Bank removal workflow
* Approved and rejected participant tracking
* On-chain institution registry
* Permissioned settlement execution

## Settlement Processing

* Bank-to-bank settlement transfers
* Payment reference support
* On-chain audit trail
* Finalized transaction history
* Event-driven settlement tracking

## Operations Dashboard

The React dashboard provides:

* Network status visibility
* Latest block monitoring
* Peer count monitoring
* Contract monitoring
* Approved bank registry
* Rejected bank registry
* Bank liquidity monitoring
* Settlement execution controls
* Embedded Chainlens explorer
* MetaMask integration

## Monitoring & Observability

* Prometheus metrics collection
* Grafana dashboards
* Loki log aggregation
* Promtail log shipping
* Validator health monitoring
* Consensus monitoring
* Network performance visibility

## Blockchain Explorer

Integrated Chainlens Explorer provides:

* Block explorer
* Transaction explorer
* Contract explorer
* Event explorer
* Account explorer
* Network visibility

---

# System Architecture

```text
                     React Operations Dashboard
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
   Settlement UI          Chainlens Explorer      Grafana Monitoring

                                  │
                                  ▼

                    SwiftHyperledgerBesu Contract

                                  │
                                  ▼

                  Hyperledger Besu QBFT Network

        ┌──────────────┬──────────────┬──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼

      Node 1         Node 2         Node 3         Node 4
    Validator      Validator      Validator      Validator

                                  │
                                  ▼

               Prometheus + Loki + Grafana Stack
```

---

# Technology Stack

## Blockchain

* Hyperledger Besu
* QBFT Consensus
* Solidity
* Ethers.js

## Frontend

* React
* Vite
* MetaMask

## Monitoring

* Prometheus
* Grafana
* Loki
* Promtail

## Explorer

* Chainlens Explorer

## Infrastructure

* Docker
* Docker Compose
* Node.js

---

# Smart Contract

The network is governed by the `SwiftHyperledgerBesu` contract.

Core functions:

```solidity
approveBank()
removeBank()
transferToBank()
getApprovedBanks()
```

Only approved institutions may settle funds.

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

# Dashboard

The operations dashboard displays:

## Network Metrics

* Latest block height
* Peer count
* Active contract
* Connected wallet

## Participant Registry

Each institution displays:

* Bank name
* Wallet address
* Approval status
* Settlement liquidity

## Settlement Controls

Approved institutions can:

* Send settlements
* Receive settlements
* Attach payment references
* Execute on-chain transfers

## Explorer

The dashboard embeds Chainlens Explorer for:

* Block inspection
* Transaction inspection
* Contract inspection
* Event inspection

---

# Monitoring

## Prometheus

Collects:

* Block metrics
* Peer metrics
* JVM metrics
* Node metrics

## Grafana

Provides dashboards for:

* Validator health
* Network performance
* Resource utilization
* Blockchain metrics

## Loki

Aggregates:

* Validator logs
* Consensus logs
* Network events
* Security events

---

# Project Structure

```text
SWIFT_hyperledger_besu
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
│   ├── package.json
│   └── vite.config.js
│
├── monitoring
│   ├── docker-compose.yml
│   ├── prometheus.yml
│   ├── loki-config.yml
│   └── promtail-config.yml
│
├── Node-1
├── Node-2
├── Node-3
├── Node-4
│
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

# Network Commands

## Start Network

```bash
npm run start-network
```

## Stop Network

```bash
npm run stop-network
```

## Reset Network

```bash
npm run reset-network
```

## Compile Contracts

```bash
npm run rebuild
```

## Deploy Contracts

```bash
npm run deploy-besu
```

## Fresh Environment

```bash
npm run fresh-start
```

---

# Dashboard

Start the frontend:

```bash
cd frontend

npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Monitoring Stack

Start monitoring:

```bash
cd monitoring

docker compose up -d
```

Services:

```text
Grafana     http://localhost:3001
Prometheus  http://localhost:9090
Loki        http://localhost:3100
```

---

# Chainlens Explorer

Open:

```text
http://localhost
```

Chainlens provides:

* Blocks
* Transactions
* Contracts
* Events
* Accounts

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

# Security Model

## SWIFT Operator

The deploying wallet becomes the network operator.

Responsibilities:

* Approve banks
* Remove banks
* Govern participation

## Approved Banks

Approved banks may:

* Send settlements
* Receive settlements
* Interact with the settlement contract

## Unauthorized Participants

Unauthorized wallets are rejected by contract permissioning.

---

# Future Enhancements

* Multi-signature settlement approval
* Stablecoin settlement support
* Multi-currency settlement
* Digital identity integration
* KYC/AML workflows
* Role-based administration
* OpenTelemetry integration
* Containerized network deployment
* Settlement analytics dashboard

---

# License

GPL-3.0
