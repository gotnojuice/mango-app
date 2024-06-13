"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import Head from "next/head";
import NavBar from "../components/NavBar";

interface Transaction {
  id: number;
  sender_address: string;
  receiver_address: string;
  amount: string;
  created_at: string;
  reference: string;
  receiver_username: string;
  tx_hash: string;
}

const History = () => {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/history?address=${address}`);
        const data = await response.json();

        if (Array.isArray(data.transactions)) {
          setTransactions(data.transactions);
        } else {
          console.error("Unexpected response format:", data);
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transaction history:", error);
        setTransactions([]);
      }
    };

    if (address) {
      fetchHistory();
    }
  }, [address]);

  return (
    <main className="main-container">
      <Head>
        <title>Transaction History</title>
      </Head>
      <NavBar />
      <div className="connect-button-container">
        <ConnectButton />
      </div>

      <h1 className="title">Transaction History</h1>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Currency</th>
              <th>Reference</th>
              <th>Date</th>
              <th>BaseScan</th>
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
                <td>{new Date(transaction.created_at).toLocaleString()}</td>
                <td>
                  <a
                    href={`https://basescan.org/tx/${transaction.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="basescan-link"
                  >
                    View on BaseScan
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default History;
