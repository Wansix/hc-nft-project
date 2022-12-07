import React from "react";
import { useState, useEffect } from "react";
import { hcNFTContract, web3 } from "../contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import * as dotenv from "dotenv";

dotenv.config();

const addGasFee = 3000000000;

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

export const WalletConnect = () => {
  const [account, setAccount] = useState("");
  const [imgSrc, setImgSrc] = useState("connect_wallet.png");
  const [viewAccount, setViewAccount] = useState("");

  const getAccount = async () => {
    try {
      // console.log(window.ethereum);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("connect : ", accounts);
        setAccount(accounts[0]);

        const tempAccount = accounts[0];
        const frontAccount = tempAccount.substr(0, 5);
        const backAccount = tempAccount.substr(-5);
        const tempViewAccount = frontAccount + "......" + backAccount;
        setViewAccount(tempViewAccount);

        document.querySelector(".WallectConnectImg").style.display = "none";
      } else {
        alert("Install Metamask!!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const connectWallet = () => {
    getAccount();
  };

  useEffect(() => {
    if (!account) {
      console.log("can not connect", account);
      return;
    }

    console.log(account);
  }, [account]);

  return (
    <div className="WalletConnect">
      <img
        className="WallectConnectImg"
        src={imgSrc}
        onClick={connectWallet}
      ></img>
      {viewAccount}
    </div>
  );
};

export default WalletConnect;
