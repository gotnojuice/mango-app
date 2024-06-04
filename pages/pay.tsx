"use client";
import { useState, ChangeEvent } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const UserSearch: React.FC = () => {
  return <button className="btn">Search User</button>;
};

const Pay: React.FC = () => {
  const [selectOption, setSelectOption] = useState<string>("");
  const [user, setUser] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [reference, setReference] = useState<string>("");
  const [receipt, setReceipt] = useState<string>("receipt");
  const [currency, setCurrency] = useState<string>("");

  const handleUserChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.startsWith("@")) {
      setUser(e.target.value);
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleReferenceChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReference(e.target.value);
  };

  const handleReceiptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReceipt(e.target.value);
  };

  const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const generateString = (): string => {
    const referencePrefix = reference ? "- " : "";
    return `${selectOption} ${user} ${amount} ${currency} ${referencePrefix}${reference}`;
  };

  return (
    <main className="main-container">
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
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="@user"
              value={user}
              onChange={handleUserChange}
            ></textarea>
            <UserSearch />
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

          <div className="form-group">
            <label className="form-radio-group">
              <input
                type="radio"
                className="form-radio"
                name="receipt"
                value="receipt"
                checked={receipt === "receipt"}
                onChange={handleReceiptChange}
              />
              Receipt
            </label>
            <label className="form-radio-group">
              <input
                type="radio"
                className="form-radio"
                name="receipt"
                value="no receipt"
                checked={receipt === "no receipt"}
                onChange={handleReceiptChange}
              />
              No Receipt
            </label>
          </div>
          <button className="btn">Send</button>
        </>
      )}
    </main>
  );
};

export default Pay;
