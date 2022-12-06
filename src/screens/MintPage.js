import React from "react";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { hcNFTContract, web3 } from "../contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import * as dotenv from "dotenv";

dotenv.config();

const addGasFee = 3000000000;
const mintPrice = "1"; // matic 단위

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

export const MintPage = () => {
  const [account, setAccount] = useState("");
  const [remainingSupply, setRemainingSupply] = useState(0);

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

  useEffect(() => {
    try {
      if (!account) return;

      hcNFTContract.methods
        .totalSupply()
        .call()
        .then(async (totalSupply) => {
          const totalNFTcount = await hcNFTContract.methods
            .totalNFTcount()
            .call();

          const remainSupply = totalNFTcount - totalSupply;

          setRemainingSupply(remainSupply);
        });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="MintPage__Main-container">
      <div className="MintPage__Mint-container">
        <div className="MintPage__MintInfo">
          <div className="MintPage__MintingRemaining">
            <span>NFT 잔여수량</span>
            <span>{remainingSupply}</span>
          </div>
          <div className="MintPage__MintingPrice">
            <span>가격</span>
            <div className="MintPage__MintingPrice-price">
              <span>
                <img src="https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png"></img>
              </span>
              <span> {mintPrice} Matic</span>
            </div>
          </div>
        </div>

        <div className="MintPage__MintButton-wrapper">
          <Button variant="success" onClick={onClickMint}>
            Mint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MintPage;
