// pages/approve.tsx
import NavBar from "../components/NavBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Approve: React.FC = () => {
  return (
    <main className="main-container">
      <NavBar />
      <div className="connect-button-container">
        <ConnectButton />
      </div>
      <h1 className="title">Approve Transactions</h1>
      <p>This page will be used to approve transactions in the future.</p>
    </main>
  );
};

export default Approve;
