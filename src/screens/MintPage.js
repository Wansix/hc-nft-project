import React from "react";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import { hcNFTContract, web, whitelistContract } from "../contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import WalletConnect from "../components/WalletConnect";
import * as dotenv from "dotenv";

dotenv.config();
const Phase = {
  INIT: 0,
  WHITELIST1: 1,
  WHITELIST2: 2,
  PUBLIC1: 3,
  PUBLIC2: 4,
  DONE: 5,
};

const WhitelistAddress = {
  WHITELIST1: 0,
  WHITELIST2: 1,
  PUBLIC1: 2,
  PUBLIC2: 3,
};

const addGasFee = 3000000000;

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

export const MintPage = (props) => {
  const [account, setAccount] = useState("");
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState("0"); //matic 단위
  const [viewMintPrice, setViewMintPrice] = useState("0");
  const [mintAmount, setMintAmount] = useState(1);
  const [maxMintAmount, setMaxMintAmount] = useState(3);
  const [mintPagePhase, setMintPagePhase] = useState(Phase.INIT);
  const [contractPhase, setContractPhase] = useState(Phase.INIT);

  const setAccountFunction = (_address) => {
    setAccount(_address);
  };

  const checkContractPhase = async () => {
    const currentPhase = await hcNFTContract.methods.currentPhase().call();
    setContractPhase(currentPhase);

    // console.log("currentPhase", currentPhase);
  };

  const checkMintPhase = () => {
    if (props.stage == "test") {
      setMintPagePhase(Phase.PUBLIC2);
    } else if (props.stage == "whitelist1") {
      setMintPagePhase(Phase.WHITELIST1);
    } else if (props.stage == "whitelist2") {
      setMintPagePhase(Phase.WHITELIST2);
    } else if (props.stage == "public1") {
      setMintPagePhase(Phase.PUBLIC1);
    } else if (props.stage == "public2") {
      setMintPagePhase(Phase.PUBLIC2);
    }
    // console.log("mintPhase", mintPagePhase);
  };

  const getMintPrice = async () => {
    const _mintPrice = await hcNFTContract.methods
      .mintPriceList(mintPagePhase)
      .call();
    // console.log("mint_price : ", _mintPrice);
    setMintPrice(_mintPrice);
    const _viewMintPrice = _mintPrice / 10 ** 18;
    setViewMintPrice(_viewMintPrice);
  };

  const onClickMint = async () => {
    try {
      if (!account) {
        alert("지갑을 연결해주세요.");
        return;
      }

      if (mintPagePhase != contractPhase) {
        alert("민팅 가능 Stage가 아닙니다.");
        return;
      }

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
    const isWhiteList = await whitelistContract.methods
      .whitelists(account)
      .call();

    const usingPublicWhitelist1 = await hcNFTContract.methods
      .usingPublicWhitelist1()
      .call();

    const usingPublicWhitelist2 = await hcNFTContract.methods
      .usingPublicWhitelist2()
      .call();

    let response = true;
    // console.log(isWhiteList);
    // console.log("usingPublicWhitelist1", usingPublicWhitelist1);
    // console.log("usingPublicWhitelist2", usingPublicWhitelist2);
    // console.log("phase", contractPhase);

    if (contractPhase == Phase.WHITELIST1) {
      response = isWhiteList[WhitelistAddress.WHITELIST1];
    }
    if (contractPhase == Phase.WHITELIST2) {
      response = isWhiteList[WhitelistAddress.WHITELIST2];
    }
    if (contractPhase == Phase.PUBLIC1 && usingPublicWhitelist1 == true) {
      response = isWhiteList[WhitelistAddress.PUBLIC1];
    }
    if (contractPhase == Phase.PUBLIC2 && usingPublicWhitelist2 == true) {
      response = isWhiteList[WhitelistAddress.PUBLIC2];
    }

    return response;
  };

  const checkRemainAmount = async () => {
    try {
      let remainSupply;
      if (
        mintPagePhase == Phase.WHITELIST1 ||
        mintPagePhase == Phase.WHITELIST2
      ) {
        remainSupply = await hcNFTContract.methods
          .whitelistSaleAvailableAmount()
          .call();
      }
      if (mintPagePhase == Phase.PUBLIC1) {
        remainSupply = await hcNFTContract.methods
          .public1SaleAvailableAmount()
          .call();
      }
      if (mintPagePhase == Phase.PUBLIC2) {
        remainSupply = await hcNFTContract.methods
          .public2SaleAvailableAmount()
          .call();
      }

      setRemainingSupply(remainSupply);
    } catch (error) {
      console.log("checkRmainAmountError", error);
    }
  };

  useEffect(() => {
    getMintPrice();
    checkRemainAmount();
  }, [mintPagePhase]);

  useEffect(() => {
    checkContractPhase();
    checkMintPhase();
  }, []);

  return (
    <div className="MintPage__Main-container">
      <div
        className="MintPage__Mint-container"
        style={{ backgroundImage: "url(./MintingPageBackground.png)" }}
      >
        <WalletConnect setAccountFunction={setAccountFunction}></WalletConnect>
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
