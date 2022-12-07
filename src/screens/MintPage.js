import React from "react";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { hcNFTContract, web3 } from "../contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import * as dotenv from "dotenv";

dotenv.config();

const addGasFee = 3000000000;

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

export const MintPage = (props) => {
  const [account, setAccount] = useState("");
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState("1"); //matic 단위
  const [viewMintPrice, setViewMintPrice] = useState("1");
  const [mintAmount, setMintAmount] = useState(1);
  const [maxMintAmount, setMaxMintAmount] = useState(1);

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

  const getMintPrice = async () => {
    const _mintPrice = await hcNFTContract.methods.mintPrice().call();
    // console.log("mint_price : ", _mintPrice);
    setMintPrice(_mintPrice);
    const _viewMintPrice = _mintPrice / 10 ** 18;
    setViewMintPrice(_viewMintPrice);
  };

  const onClickMint = async () => {
    try {
      if (!account) return;

      const isWhiteList = await checkWhiteLists();
      if (isWhiteList == false) {
        alert("It's not whitelist account");
        return;
      }

      //   const mintPriceWei = await web3.utils.toWei(mintPrice);

      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          hcNFTContract.methods.mintNFT().send({
            from: account,
            value: mintPrice,
            maxFeePerGas: max,
            maxPriorityFeePerGas: Number(tip) + addGasFee,
          });
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMinus = () => {
    if (mintAmount == 1) return;
    const amount = mintAmount - 1;
    setMintAmount(amount);
  };
  const onClickPlus = () => {
    if (mintAmount >= maxMintAmount) return;
    const amount = mintAmount + 1;
    setMintAmount(amount);
  };

  const checkWhiteLists = async () => {
    const isWhiteList = await hcNFTContract.methods.whitelist(account).call();
    return isWhiteList;
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

          getMintPrice();
        });
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <div className="MintPage__Main-container">
      <div
        className="MintPage__Mint-container"
        style={{ backgroundImage: "url(./MintingPageBackground.png)" }}
      >
        <div className="MintPage__MintInfo">
          <div className="MintPage__MintInfo-AmountFont">AMOUNT</div>
          <div className="MintPage__MintInfo-RemainingSupply">
            {remainingSupply}
          </div>
          <div className="MintPage__MintInfo-price">
            <span>{viewMintPrice} MATIC </span>
            <span className="MintPage__MintInfo-price_grey">PER </span>
            <span>1 NFT </span>
            <span className="MintPage__MintInfo-price_grey">
              (Excluding gas fees)
            </span>
          </div>
        </div>
        <div className="MintPage__MintAmountBox">
          <div
            className="MintPage__MintAmount-button MintPage__MintAmount-button-minus"
            onClick={onClickMinus}
          >
            <span>-</span>
          </div>
          <div className="MintPage__MintAmount-amount">{mintAmount}</div>
          <div
            className="MintPage__MintAmount-button MintPage__MintAmount-button-plus"
            onClick={onClickPlus}
          >
            <span>+</span>
          </div>
        </div>

        <div className="MintPage__MintButton-wrapper" onClick={onClickMint}>
          <img src="minting_button.png"></img>
        </div>
      </div>
    </div>
  );
};

export default MintPage;
