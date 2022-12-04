import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { hcNFTContract, web3 } from "./contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import * as dotenv from "dotenv";

dotenv.config();

const addGasFee = 3000000000;
const mintPrice = "1"; // matic 단위

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

function App() {
  const [account, setAccount] = useState("");

  const getAccount = async () => {
    try {
      // console.log(window.ethereum);
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // console.log(accounts);
        setAccount(accounts[0]);
      } else {
        alert("Install Metamask!!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onClickMint = async () => {
    try {
      if (!account) return;

      const mintPriceWei = await web3.utils.toWei(mintPrice);

      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          hcNFTContract.methods.mintNFT().send({
            from: account,
            value: mintPriceWei,
            maxFeePerGas: max,
            maxPriorityFeePerGas: Number(tip) + addGasFee,
          });
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAccount();
  }, [account]);

  return (
    <div className="App">
      <div className="Mint-container">
        <Button variant="success" onClick={onClickMint}>
          Mint
        </Button>
      </div>
    </div>
  );
}

export default App;
