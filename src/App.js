import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import { abi } from "./utils/WavePortal.json";

const contractAddress = "0x7DC057d750f77b3e6Bd087d7b9f9ce937EC0aD55";
const contractABI = abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [count, setCount] = useState("");

  useEffect(() => {
    checkWalletConnected();
  }, []);

  const checkWalletConnected = async () => {
    try {
      const eth = window.ethereum;

      if (!eth) {
        console.log("Make sure you have metamask");
        return;
      }
      // console.log("Eth", eth);

      const accounts = await eth.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        console.log("found authorized account", accounts[0]);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("no authorized account found");
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Get metamask!");
      return;
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("connected", accounts[0]);
      console.log("all", accounts);
      setCurrentAccount(accounts[0]);
    } catch (e) {
      console.log(e.message);
    }
  };

  const getWaves = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) return;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      console.log("signer", signer);
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      let count = await wavePortalContract.getTotalWaves();
      console.log("Retrieved total wave count...", count.toNumber());
      setCount(count.toNumber());
    } catch (e) {
      console.log(e.message);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) return;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const waveTxn = await wavePortalContract.wave();
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      const count = await wavePortalContract.getTotalWaves();
      setCount(count.toNumber());
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="mainContainer">
      <div className="header">
        <div />
        <div>
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hey there! {currentAccount}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            className="waveButton"
            style={{ backgroundColor: "lightblue" }}
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        </div>
      </div>
      <div className="dataContainer">
        <div className="bio">Say hello!</div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <button
          className="waveButton"
          onClick={getWaves}
          style={{ marginTop: "20px" }}
        >
          Get current amount
        </button>
      </div>
      {(count === 0 || count > 0) && (
        <div>
          <h3>{`Current amount of waves: ${count}`}</h3>
        </div>
      )}
    </div>
  );
}
