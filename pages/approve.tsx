"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NavBar from "../components/NavBar";
import { USDC_ABI, USDC_ADDRESS } from "./api/ethersUtils";

// Define a type for the transaction
interface Transaction {
  id: number;
  caster_eth_address: string;
  mentioned_eth_address: string;
  amount: string;
  reference: string;
}

const Approve = () => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions?address=${address}`);
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (address) {
      fetchTransactions();
    }
  }, [address]);

  const handleApprove = async (transaction: Transaction) => {
    try {
      // Connect to the provider
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

      const amountInUSDC = ethers.parseUnits(transaction.amount, 6);
      const tx = await usdcContract.transfer(
        transaction.mentioned_eth_address,
        amountInUSDC
      );

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      alert("Transaction successful!");

      // Remove approved transaction from the list
      setTransactions(transactions.filter((t) => t.id !== transaction.id));
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Error sending transaction. Please try again.");
    }
  };

  return (
    <main className="main-container">
      <NavBar />
      <div className="connect-button-container">
        <ConnectButton />
      </div>

      <h1 className="title">Pending Transactions</h1>

      {transactions.length === 0 ? (
        <p>No pending transactions.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <p>
                From: {transaction.caster_eth_address} <br />
                To: {transaction.mentioned_eth_address} <br />
                Amount: {transaction.amount} USDC <br />
                Reference: {transaction.reference || "N/A"}
              </p>
              <button onClick={() => handleApprove(transaction)}>
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default Approve;
