## Security Controls

### Network Layer

* Hyperledger Besu QBFT consensus
* Permissioned validator network
* Account allowlisting
* Controlled network participation

### Smart Contract Layer

Only approved banks can execute settlements:

```solidity
modifier onlyApprovedBanks(address bank) {
    require(
        approvedBanks[bank],
        "Only Approved Banks can transact on the SWIFT network."
    );
    _;
}
```

Additional controls:

* SWIFT-only bank onboarding
* SWIFT-only bank removal
* Settlement audit trail
* On-chain bank registry
* Named institution tracking

### Monitoring Layer

The dashboard provides:

* Approved bank monitoring
* Real-time liquidity visibility
* Settlement history
* Administration history
* Unauthorized participant detection

---

## Automated Deployment

The project automatically updates frontend configuration after deployment.

Running:

```bash
npm run deploy-besu
```

will:

1. Deploy the smart contract
2. Update `frontend/src/contractAddress.js`
3. Update `deployments/besu.json`
4. Synchronize the React dashboard with the newest deployment

No manual contract address updates are required.

---

## Network Management

### Start Network

```bash
npm run start-network
```

Starts all four QBFT validator nodes.

### Stop Network

```bash
npm run stop-network
```

Stops all Besu validator processes.

### Reset Network

```bash
npm run reset-network
```

Deletes blockchain state and cache data.

### Fresh Start

```bash
npm run fresh-start
```

Performs:

1. Network reset
2. Validator startup
3. Contract compilation
4. Smart contract deployment
5. Frontend contract synchronization

After completion:

```bash
cd frontend
npm run dev
```

---

## Dashboard Features

### Approved Banks

Displays:

* Bank name
* Wallet address
* Approval status
* Current liquidity balance

### Settlement Actions

Allows approved banks to:

* Initiate settlements
* Transfer funds
* Record payment references

### Settlement History

Displays:

* Block number
* Sending institution
* Receiving institution
* Amount
* Payment reference
* Transaction hash

### Administration History

Displays:

* Bank approvals
* Bank removals
* Administrative transaction history

### Liquidity Monitoring

Real-time balances are retrieved directly from the Besu network using:

```javascript
provider.getBalance(bankAddress)
```

This provides visibility into the settlement liquidity of participating institutions.

---

## Example Security Scenario

### Unauthorized Participant

An unapproved wallet attempts to submit a settlement:

```text
Only Approved Banks can transact on the SWIFT network.
```

The transaction is rejected and settlement does not occur.

### Approved Participant

An approved bank submits a settlement:

```text
Bank of America
      ↓
SwiftHyperledgerBesu
      ↓
Bank of China
```

The transfer is finalized through the QBFT validator network and recorded in settlement history.
