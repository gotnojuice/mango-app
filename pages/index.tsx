import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Head from "next/head";
import NavBar from "../components/NavBar";
import Link from "next/link";

const Index: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  return (
    <div className="page-container">
      <Head>
        <title>mangojuice</title>
        <meta content="social money from gotnojuice" name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main className="main-container">
        <NavBar />
        <div className="connect-button-container">
          <ConnectButton />
        </div>

        <h1 className="title">Welcome to mangojuice</h1>

        <div className="content-container">
          <p>
            mangojuice is the solution for text-to-pay USDC payments on the Base
            network:
          </p>
          <ul>
            <li>
              You can make direct transactions through{" "}
              <Link href="/pay" className="link">
                Pay
              </Link>
              .
            </li>
            <li>
              Approve messages sent to @mangobot on Farcaster in{" "}
              <Link href="/approve" className="link">
                Approve
              </Link>
              .
            </li>
          </ul>
          <p>
            We&apos;ve simplified payments with a user-friendly syntax to make
            transactions straightforward and understandable:
          </p>
          <p className="syntax">
            @mangobot pay [@who] [howmuch] USDC - [payment reference]
          </p>
          <p>
            This syntax is either created for you in Pay or required in
            Farcaster messages for mangobot to pick them up.
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

export default Index;
