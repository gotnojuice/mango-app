"use client";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import NavBar from "../components/NavBar";

interface Transaction {
  id: number;
  hash: string;
  sender_address: string;
  receiver_username: string;
  receiver_address: string;
  amount: string;
  reference: string;
  created_at: string;
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
      <NavBar />
      <h1 className="title">Transaction History</h1>

      {transactions.length === 0 ? (
        <p>No transaction history.</p>
      ) : (
        <table className="transaction-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Address</th>
              <th>Amount</th>
              <th>Reference</th>
              <th>View on BaseScan</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.receiver_username}</td>
                <td>{transaction.receiver_address}</td>
                <td>{transaction.amount} USDC</td>
                <td>{transaction.reference}</td>
                <td>
                  <a
                    href={`https://basescan.org/tx/${transaction.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
