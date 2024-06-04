import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi"; // useAccount hook to get connection status
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount(); // Check if the user is connected

  useEffect(() => {
    if (isConnected) {
      router.push("/pay"); // Redirect to /pay if connected
    }
  }, [isConnected, router]);

  return (
    <div className={styles.container}>
      <Head>
        <title>mangojuice</title>
        <meta content="social money from gotnojuice" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className={styles.main}>
        <ConnectButton />

        <h1 className={styles.title}>
          Welcome to <a href="">mangojuice</a>
        </h1>
      </main>
    </div>
  );
};

export default Home;
