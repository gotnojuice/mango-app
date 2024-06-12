import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import NavBar from "../components/NavBar";
import styles from "../styles/Home.module.css";

const HomePage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>mangojuice</title>
        <meta content="social money from gotnojuice" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <NavBar />
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to <a href="">mangojuice</a>
        </h1>

        <div className={styles.contentContainer}>
          <p>
            MangoJuice is your seamless solution for managing peer-to-peer
            payments on the blockchain. Easily send and approve transactions
            using USDC directly through Farcaster casts. Simply mention
            @mangobot with the payment details in your casts, and approve or
            reject transactions with a click.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
