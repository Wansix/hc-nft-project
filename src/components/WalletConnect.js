import React from "react";
import { useState, useEffect } from "react";
import * as dotenv from "dotenv";

dotenv.config();

export const WalletConnect = (props) => {
  const [account, setAccount] = useState("");
  const [viewAccount, setViewAccount] = useState("");

  const imgSrc = "connect_wallet.png";

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
        props.setAccountFunction(tempAccount);

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
        alt="walletConnect"
      ></img>
      {viewAccount}
    </div>
  );
};

export default WalletConnect;
