import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { Button } from "./components/Button";

import { abi } from "./utils/WavePortal.json";
import "./App.css";

const contractAddress = "0x0d69eacd3310BcbB57649Ad1A1f8b4B148322b3C";
const contractABI = abi;

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [waves, setWaves] = useState([]);

  useEffect(() => {
    const checkWalletConnected = async () => {
      try {
        const eth = window.ethereum;

        if (!eth) {
          console.log("Make sure you have metamask");
          return;
        }

        const accounts = await eth.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          console.log("found authorized account", accounts[0]);
          setCurrentAccount(accounts[0]);
          getWaves();
        } else {
          console.log("no authorized account found");
        }
      } catch (e) {
        console.log(e.message);
      }
    };

    const setUpEventListener = () => {
      let wavePortalContract;

      // Add new wave events to state
      const onNewWave = (from, timestamp, message) => {
        console.log("NewWave", from, timestamp, message);
        setWaves((prevState) => [
          ...prevState,
          {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
          },
        ]);
      };

      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // connect to contract
        wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // hook up event handler to contract event
        wavePortalContract.on("NewWave", onNewWave);
      }
    };

    checkWalletConnected();
    setUpEventListener();
  }, [currentAccount]);

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

      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const allWaves = await wavePortalContract.getAllWaves();
      console.log("og waver", allWaves);
      const cleanedWaves = allWaves.map((w) => ({
        address: w.waver,
        timestamp: new Date(w.timestamp * 1000),
        message: w.message,
      }));
      console.log("waves", cleanedWaves);
      setWaves(cleanedWaves);
    } catch (e) {
      console.log(e.message);
    }
  };

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum || !message) return;
      setLoading(true);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log(signer, contractAddress, contractABI);
      const wavePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const waveTxn = await wavePortalContract.wave(message);
      console.log("Mining...", waveTxn.hash);

      await waveTxn.wait();
      console.log("Mined -- ", waveTxn.hash);

      // const waves = await wavePortalContract.getAllWaves();
      // setWaves(waves);
      setLoading(false);
    } catch (e) {
      console.log(e.message);
    }
  };

  const sortedWaves = [...waves].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="mainContainer">
      <div className="header">
        <div>
          <span>
            <a
              className="etherscan"
              href="https://ropsten.etherscan.io/address/0x329483c85604B3669210BE1CF80C3ABc6d5c8A11"
            >
              Etherscan
            </a>
          </span>
        </div>
        <div>
          <span role="img" aria-label="wave">
            👋
          </span>{" "}
          Hey there!
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            className="waveButton"
            style={{ backgroundColor: "lightblue", height: 50, fontSize: 16 }}
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        </div>
      </div>
      {currentAccount && (
        <div>
          <h3>You are: {currentAccount}</h3>
        </div>
      )}
      <div className="dataContainer">
        <div className="bio">
          First simple web3 site that interacts with a smart contract on
          testnet. Currently working on <b>Ropsten Network.</b>
          <br />
          <br />
          Send me a wave!
        </div>
        <div
          style={{ marginBottom: 10, display: "flex", flexDirection: "column" }}
        >
          <label className="bio">Leave a message!</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ height: 24 }}
          />
        </div>
        <Button loading={loading ? 1 : 0} onClick={wave}>
          Wave at me
        </Button>
      </div>
      <div className="messages-container">
        {sortedWaves.map((w) => (
          <div className="message" key={Math.random() * 10000}>
            <div style={{ padding: 10 }}>
              <p
                style={{ marginTop: 0, marginBottom: 0 }}
                className="from-waver"
              >
                From: {w.address} - At: {w.timestamp.toLocaleString()}
              </p>
              <p style={{ marginTop: 10, marginBottom: 0 }}>"{w.message}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
