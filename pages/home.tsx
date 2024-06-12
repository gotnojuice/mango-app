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
            mangojuice is your go-to solution for easy USDC payments on the Base
            network. You can make direct transactions through the "Pay" section
            or send a message on Farcaster, which you can later approve in the
            "Approve" section. We've simplified payments with a user-friendly
            syntax to make transactions straightforward and understandable.
          </p>
          <p>
            mangojuice leverages Farcaster for social proof, making payments on
            Base not only easier but also more trusted.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
