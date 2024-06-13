"use client";
import { useState, ChangeEvent } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import UserSearch from "../components/UserSearch";
import UserInspect from "../components/UserInspect";
import { USDC_ABI, USDC_ADDRESS } from "./api/ethersUtils";
import NavBar from "../components/NavBar";
import Head from "next/head";

const Pay: React.FC = () => {
  const { address } = useAccount();
  const [selectOption, setSelectOption] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USDC");
  const [ethAddress, setEthAddress] = useState<string>("");

  const handleUserChange = (username: string, ethAddress: string) => {
    setUser(username);
    setEthAddress(ethAddress);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleReferenceChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReference(e.target.value);
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const generateString = (): string => {
    const referencePrefix = reference ? "- " : "";
    return `@mangobot ${selectOption} @${user} ${amount} ${currency} ${referencePrefix}${reference}`;
  };

  const handleSendTransaction = async () => {
    if (!ethAddress || !amount) {
      alert("Please fill out all the required fields.");
      return;
    }

    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

      const balance = await usdcContract.balanceOf(address);
      const amountInUSDC = ethers.parseUnits(amount, 6);

      if (balance < amountInUSDC) {
        alert("Insufficient USDC balance.");
        return;
      }

      const tx = await usdcContract.transfer(ethAddress, amountInUSDC);
      console.log("Transaction sent:", tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      alert("Transaction successful!");

      // Insert the transaction into the history table
      await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_address: address,
          receiver_address: ethAddress,
          receiver_username: user, // Add the receiver's username
          amount: amount,
          reference: reference,
          tx_hash: tx.hash,
        }),
      });
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

      <h1 className="title">I want to...</h1>

      <select
        className="form-select"
        value={selectOption}
        onChange={(e) => setSelectOption(e.target.value)}
      >
        <option value="">select action</option>
        <option value="pay">pay</option>
      </select>

      {selectOption === "pay" && (
        <>
          <div className="form-group inline-flex-container">
            <UserSearch onSelect={handleUserChange} />
            <UserInspect username={user} />
            {ethAddress && <div>eth address: {ethAddress}</div>}
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={handleAmountChange}
            />
            <select
              className="form-select"
              value={currency}
              onChange={handleCurrencyChange}
            >
              <option value="USDC">USDC</option>
            </select>
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Reference"
              maxLength={50}
              value={reference}
              onChange={handleReferenceChange}
            ></textarea>
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              readOnly
              value={generateString()}
            />
          </div>

          <button className="btn" onClick={handleSendTransaction}>
            Send
          </button>
        </>
      )}
    </main>
  );
};

export default Pay;
