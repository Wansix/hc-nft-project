import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { hcNFTContract, web3 } from "./contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import * as dotenv from "dotenv";

dotenv.config();

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
  const connectWallet = async () => {
    getAccount();
    console.log("connect");
  };

  const onClickMint = async () => {
    try {
      if (!account) return;

      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + 3000000000;

          hcNFTContract.methods.mintNFT().send({
            from: account,
            value: 1000000000000000000,
            maxFeePerGas: max,
            maxPriorityFeePerGas: Number(tip) + 3000000000,
            // gasLimit: 300000,
            // gas: 8000000,
          });
        });
      });

      // if (response.status) {
      //   const balanceLength = await mintAnimalTokenContract.methods
      //     .balanceOf(account)
      //     .call();

      //   const animalTokenId = await mintAnimalTokenContract.methods
      //     .tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10) - 1)
      //     .call();

      //   const animalType = await mintAnimalTokenContract.methods
      //     .animalTypes(animalTokenId)
      //     .call();

      //   setNewAnimalType(animalType);
      // }
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
        <Button variant="success" onClick={connectWallet}>
          Connect
        </Button>
        <Button variant="success" onClick={onClickMint}>
          Mint
        </Button>
      </div>
    </div>
  );
}

export default App;
