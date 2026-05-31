import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, BANKS, labelFor } from "./bankConfig";
import { SWIFT_ABI } from "./contractAbi";
import "./styles.css";

const RPC_URL = "http://127.0.0.1:8545";

function formatAddress(address) {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [latestBlock, setLatestBlock] = useState("-");
  const [peerCount, setPeerCount] = useState("-");
  const [swiftOperator, setSwiftOperator] = useState("-");
  const [bankStatus, setBankStatus] = useState([]);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState("Ready");

  const bankRows = useMemo(() => Object.entries(BANKS), []);

  async function loadData() {
    const rpcProvider = new ethers.JsonRpcProvider(RPC_URL);
    const swift = new ethers.Contract(CONTRACT_ADDRESS, SWIFT_ABI, rpcProvider);

    setProvider(rpcProvider);
    setContract(swift);

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

    const statuses = [];
    for (const [address, info] of bankRows) {
      let approved = false;
      try {
        approved = await swift.approvedBanks(address);
      } catch {}
      statuses.push({ address, ...info, approved });
    }
    setBankStatus(statuses);

    const filter = swift.filters.BankTransfer();
    const logs = await swift.queryFilter(filter, 0, "latest");
    const parsed = logs.map((event) => ({
      txHash: event.transactionHash,
      blockNumber: event.blockNumber,
      fromBank: event.args.fromBank,
      toBank: event.args.toBank,
      amount: ethers.formatEther(event.args.amount),
      paymentReference: event.args.paymentReference,
    })).reverse();
    setEvents(parsed);
  }

  async function sendSettlement(to, reference) {
    if (!window.ethereum) {
      setStatus("MetaMask not found.");
      return;
    }

    try {
      setStatus(`Submitting ${reference}...`);
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      const writable = new ethers.Contract(CONTRACT_ADDRESS, SWIFT_ABI, signer);
      const tx = await writable.transferToBank(to, reference, {
        value: ethers.parseEther("1"),
      });
      setStatus(`Submitted: ${tx.hash}`);
      await tx.wait();
      setStatus(`${reference} finalized.`);
      await loadData();
    } catch (error) {
      setStatus(error.shortMessage || error.message || "Transaction failed.");
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
          <p className="subtitle">Monitor a permissioned bank settlement network and view finalized bank-to-bank transfers.</p>
        </div>
        <button onClick={loadData}>Refresh</button>
      </section>

      <section className="grid stats">
        <div className="card"><span>Latest Block</span><strong>{latestBlock}</strong></div>
        <div className="card"><span>Peer Count</span><strong>{peerCount}</strong></div>
        <div className="card"><span>Contract</span><strong>{formatAddress(CONTRACT_ADDRESS)}</strong></div>
        <div className="card"><span>SWIFT Operator</span><strong>{formatAddress(swiftOperator)}</strong></div>
      </section>

      <section className="grid two">
        <div className="card large">
          <h2>Approved Banks</h2>
          <div className="bank-list">
            {bankStatus.map((bank) => (
              <div className="bank" key={bank.address}>
                <div>
                  <strong>{bank.label}</strong>
                  <p>{formatAddress(bank.address)} · {bank.role}</p>
                </div>
                <span className={bank.approved ? "pill ok" : "pill bad"}>{bank.approved ? "Approved" : "Rejected"}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card large">
          <h2>Settlement Actions</h2>
          <p className="muted">Use MetaMask on your QBFT Local network. The connected account must be an approved bank for transfers to succeed.</p>
          <button onClick={() => sendSettlement("0x627306090abaB3A6e1400e9345bC60c78a8BEf57", "Dashboard BOA to BOC settlement")}>Send 1 ETH to BOC</button>
          <button onClick={() => sendSettlement("0xfe3b557e8fb62b89f4916b721be55ceb828dbd73", "Dashboard BOC to BOA settlement")}>Send 1 ETH to BOA</button>
          <div className="status">{status}</div>
        </div>
      </section>

      <section className="card large">
        <h2>Settlement History</h2>
        {events.length === 0 ? <p className="muted">No BankTransfer events found yet.</p> : (
          <table>
            <thead>
              <tr><th>Block</th><th>From</th><th>To</th><th>Amount</th><th>Reference</th><th>Tx</th></tr>
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
