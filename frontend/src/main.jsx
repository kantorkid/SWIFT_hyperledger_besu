import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, BANKS, labelFor } from "./bankConfig";
import { SWIFT_ABI } from "./contractAbi";
import "./styles.css";

const RPC_URL = "http://127.0.0.1:8545";
const SWIFT_OPERATOR = "0x1d757EA5756cdd3001cFA20d96745C8c2db1BC58";

const BESU_CHAIN_ID = "0x539"; // 1337

async function ensureBesuNetwork() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found.");
  }

  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (currentChainId === BESU_CHAIN_ID) {
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BESU_CHAIN_ID }],
    });
  } catch (error) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: BESU_CHAIN_ID,
            chainName: "QBFT Local",
            rpcUrls: ["http://127.0.0.1:8545"],
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function App() {
  const [latestBlock, setLatestBlock] = useState("-");
  const [peerCount, setPeerCount] = useState("-");
  const [swiftOperator, setSwiftOperator] = useState("-");
  const [bankStatus, setBankStatus] = useState([]);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Ready");
  const [connectedAddress, setConnectedAddress] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [bankName, setBankName] = useState("");
  const [adminEvents, setAdminEvents] = useState([]);

  const bankRows = useMemo(() => Object.entries(BANKS), []);

  const isSwift =
    connectedAddress &&
    connectedAddress.toLowerCase() === SWIFT_OPERATOR.toLowerCase();

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("MetaMask not found.");
      return;
    }

    await ensureBesuNetwork();

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    setConnectedAddress(address);
    setStatus(`Connected: ${formatAddress(address)}`);
  }

  async function loadData() {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    const swift = new ethers.Contract(CONTRACT_ADDRESS, SWIFT_ABI, rpcProvider);

    const block = await rpcProvider.getBlockNumber();
    setLatestBlock(block.toString());

    try {
      const peers = await rpcProvider.send("net_peerCount", []);
      setPeerCount(parseInt(peers, 16).toString());
    } catch {
      setPeerCount("Unavailable");
    }

    try {
      setSwiftOperator(await swift.SWIFT());
    } catch {
      setSwiftOperator("Unavailable");
    }

let statuses = [];

try {
  const banks = await swift.getApprovedBanks();

console.log("Approved banks from contract:", banks);

statuses = [];

for (const bank of banks) {
  const approved = await swift.approvedBanks(bank);
  const name = await swift.bankNames(bank);
  const balance = await rpcProvider.getBalance(bank);

  console.log("Loaded bank:", {
    bank,
    name,
    approved,
    balance: ethers.formatEther(balance),
  });

  statuses.push({
    address: bank,
    label: name || formatAddress(bank),
    role: approved ? "Settlement Bank" : "Removed Settlement Bank",
    approved,
    balance: ethers.formatEther(balance),
  });
}

} catch (error) {
  console.error("Bank loading failed:", error);
  statuses = [];
}

setBankStatus(statuses);

const filter = swift.filters.BankTransfer();

const latest = await rpcProvider.getBlockNumber();
const fromBlock = Math.max(latest - 1000, 0);

const approvedFilter = swift.filters.BankApproved();
const removedFilter = swift.filters.BankRemoved();

const approvedLogs = await swift.queryFilter(approvedFilter, fromBlock, latest);
const removedLogs = await swift.queryFilter(removedFilter, fromBlock, latest);

const adminHistory = [
  ...approvedLogs.map((event) => ({
    type: "Approved",
    bank: event.args.bank,
    name: event.args.name,
    blockNumber: event.blockNumber,
    txHash: event.transactionHash,
  })),

  ...removedLogs.map((event) => ({
    type: "Removed",
    bank: event.args.bank,
    name: event.args.name,
    blockNumber: event.blockNumber,
    txHash: event.transactionHash,
  })),
].sort((a, b) => b.blockNumber - a.blockNumber);

setAdminEvents(adminHistory);



const logs = await swift.queryFilter(filter, fromBlock, latest);

    const parsed = logs
      .map((event) => ({
        txHash: event.transactionHash,
        blockNumber: event.blockNumber,
        fromBank: event.args.fromBank,
        toBank: event.args.toBank,
        amount: ethers.formatEther(event.args.amount),
        paymentReference: event.args.paymentReference,
      }))
      .reverse();

    setEvents(parsed);
  }

  async function getWritableContract() {
    if (!window.ethereum) {
      throw new Error("MetaMask not found.");
    }

    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    const address = await signer.getAddress();

    setConnectedAddress(address);

    return new ethers.Contract(CONTRACT_ADDRESS, SWIFT_ABI, signer);
  }

  async function sendSettlement(to, paymentReference) {
    try {
      setStatus(`Submitting ${paymentReference}...`);

      const writable = await getWritableContract();

      const tx = await writable.transferToBank(to, paymentReference, {
        value: ethers.parseEther("1"),
      });

      setStatus(`Submitted: ${tx.hash}`);
      await tx.wait();

      setStatus(`${paymentReference} finalized.`);
      await loadData();
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Transaction failed.");
    }
  }

  async function approveBank() {
    try {
      setStatus(`Approving ${bankName || bankAddress}...`);

      const writable = await getWritableContract();

      const tx = await writable.approveBank(bankAddress, bankName);
      setStatus(`Approval submitted: ${tx.hash}`);

      await tx.wait();

      setStatus(`${bankName || bankAddress} approved.`);
      setBankAddress("");
      setBankName("");
      await loadData();
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Approval failed.");
    }
  }

  async function removeBank() {
    try {
      setStatus(`Removing ${bankName || bankAddress}...`);

      const writable = await getWritableContract();

      const tx = await writable.removeBank(bankAddress, bankName);
      setStatus(`Removal submitted: ${tx.hash}`);

      await tx.wait();

      setStatus(`${bankName || bankAddress} removed.`);
      setBankAddress("");
      setBankName("");
      await loadData();
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Removal failed.");
    }
  }

  useEffect(() => {
    loadData().catch((error) => setStatus(error.message));
  }, []);

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">Hyperledger Besu QBFT</p>
          <h1>SWIFT-Style Settlement Dashboard</h1>
          <p className="subtitle">
            Monitor a permissioned bank settlement network and view finalized
            bank-to-bank transfers.
          </p>
        </div>

        <div className="actions">
          <button onClick={connectWallet}>Connect Wallet</button>
          <button onClick={loadData}>Refresh</button>
        </div>
      </section>

      <section className="grid stats">
        <div className="card">
          <span>Latest Block</span>
          <strong>{latestBlock}</strong>
        </div>

        <div className="card">
          <span>Peer Count</span>
          <strong>{peerCount}</strong>
        </div>

        <div className="card">
          <span>Contract</span>
          <strong>{formatAddress(CONTRACT_ADDRESS)}</strong>
        </div>

        <div className="card">
          <span>Connected Wallet</span>
          <strong>
            {connectedAddress ? formatAddress(connectedAddress) : "Not connected"}
          </strong>
        </div>

        <div className="card">
          <span>SWIFT Operator</span>
          <strong>{formatAddress(swiftOperator)}</strong>
        </div>
      </section>

      <section className="grid two">
        <div className="card large">
          <h2>Approved Banks</h2>

          <div className="bank-list">
            {bankStatus.map((bank) => (
              <div className="bank" key={bank.address}>
                <div>
                  <strong>{bank.label}</strong>
                  <p>
                    {formatAddress(bank.address)} · {bank.role}
                  </p>
                  
                  <p>
  Balance: {Number(bank.balance || 0).toFixed(2)} ETH
</p>
                </div>

                <span className={bank.approved ? "pill ok" : "pill bad"}>
                  {bank.approved ? "Approved" : "Rejected"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card large">
          <h2>Settlement Actions</h2>

          <p className="muted">
            Use MetaMask on your QBFT Local network. The connected account must
            be an approved bank for transfers to succeed.
          </p>

          <button
            onClick={() =>
              sendSettlement(
                "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
                "Dashboard BOA to BOC settlement"
              )
            }
          >
            Send 1 ETH to BOC
          </button>

          <button
            onClick={() =>
              sendSettlement(
                "0xfe3b557e8fb62b89f4916b721be55ceb828dbd73",
                "Dashboard BOC to BOA settlement"
              )
            }
          >
            Send 1 ETH to BOA
          </button>

          <div className="status">{status}</div>
        </div>
      </section>

      {isSwift && (
        <section className="card large">
          <h2>SWIFT Administration</h2>

          <p className="muted">
            Only the SWIFT operator wallet can approve or remove banks.
          </p>

          <input
            placeholder="Bank Address"
            value={bankAddress}
            onChange={(event) => setBankAddress(event.target.value)}
          />

          <input
            placeholder="Bank Name"
            value={bankName}
            onChange={(event) => setBankName(event.target.value)}
          />

          <div className="actions">
            <button onClick={approveBank}>Approve Bank</button>
            <button onClick={removeBank}>Remove Bank</button>
          </div>
        </section>
      )}


      <section className="card large">

  <h2>Bank Administration History</h2>

  {adminEvents.length === 0 ? (
    <p className="muted">No bank approval or removal events found yet.</p>
  ) : (
    <table>
      <thead>
        <tr>
          <th>Block</th>
          <th>Action</th>
          <th>Bank</th>
          <th>Address</th>
          <th>Tx</th>
        </tr>
      </thead>

      <tbody>
        {adminEvents.map((event) => (
          <tr key={`${event.txHash}-${event.type}`}>
            <td>{event.blockNumber}</td>
            <td>{event.type}</td>
            <td>{event.name || labelFor(event.bank)}</td>
            <td>{formatAddress(event.bank)}</td>
            <td>{formatAddress(event.txHash)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</section>
<section className="card large">

        <h2>Settlement History</h2>

        {events.length === 0 ? (
          <p className="muted">No BankTransfer events found yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Block</th>
                <th>From</th>
                <th>To</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Tx</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event.txHash}>
                  <td>{event.blockNumber}</td>
                  <td>{labelFor(event.fromBank)}</td>
                  <td>{labelFor(event.toBank)}</td>
                  <td>{event.amount} ETH</td>
                  <td>{event.paymentReference}</td>
                  <td>{formatAddress(event.txHash)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);