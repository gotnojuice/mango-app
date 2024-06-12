"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import NavBar from "../components/NavBar";
import { USDC_ABI, USDC_ADDRESS } from "./api/ethersUtils";

interface Transaction {
  id: number;
  sender_address: string;
  receiver_address: string;
  receiver_username: string;
  amount: string;
  created_at: string;
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

        console.log("Fetched transactions:", data);

        if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          console.error("Unexpected response format:", data);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      }
    };

    if (address) {
      fetchTransactions();
    }
  }, [address]);

  const handleApprove = async (transaction: Transaction) => {
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

      const amountInUSDC = ethers.parseUnits(transaction.amount, 6);
      const tx = await usdcContract.transfer(
        transaction.receiver_address,
        amountInUSDC
      );

      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      alert("Transaction successful!");

      await fetch(`/api/transactions/${transaction.id}?action=approve`, {
        method: "DELETE",
      });

      setTransactions(transactions.filter((t) => t.id !== transaction.id));
    } catch (error) {
      console.error("Error sending transaction:", error);
      alert("Error sending transaction. Please try again.");
    }
  };

  const handleReject = async (transaction: Transaction) => {
    try {
      await fetch(`/api/transactions/${transaction.id}?action=reject`, {
        method: "DELETE",
      });

      alert("Transaction rejected!");
      setTransactions(transactions.filter((t) => t.id !== transaction.id));
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      alert("Error rejecting transaction. Please try again.");
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
        <table className="transactions-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Reference</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.receiver_username}</td>
                <td>{transaction.receiver_address}</td>
                <td>{transaction.amount}</td>
                <td>USDC</td>
                <td>{transaction.reference}</td>
                <td>
                  <button
                    className="btn-approve"
                    onClick={() => handleApprove(transaction)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleReject(transaction)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default Approve;
