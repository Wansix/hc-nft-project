import React from "react";
import { useState, useEffect } from "react";
import { whaleyContract, whaleyWhitelistContract } from "../contracts/index";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import WalletConnect from "../components/WalletConnect";
import * as dotenv from "dotenv";
import { isMobile } from "react-device-detect";

dotenv.config();
const Phase = {
  INIT: 0,
  WHITELIST1: 1,
  WAITING_WHITELIST2: 2,
  WHITELIST2: 3,
  WAITING_PUBLIC1: 4,
  PUBLIC1: 5,
  WAITING_PUBLIC2: 6,
  PUBLIC2: 7,
  DONE: 8,
};

const WhitelistAddress = {
  WHITELIST1: 0,
  WHITELIST2: 1,
  PUBLIC1: 2,
  PUBLIC2: 3,
};

const addGasFee = 5000000000;

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

export const MintPage = (props) => {
  const [account, setAccount] = useState("");
  const [remainingSupply, setRemainingSupply] = useState(0);
  const [mintPrice, setMintPrice] = useState("0"); //matic 단위
  const [viewMintPrice, setViewMintPrice] = useState("0");
  const [mintAmount, setMintAmount] = useState(1);
  const [maxMintAmount, setMaxMintAmount] = useState(1);
  const [mintPagePhase, setMintPagePhase] = useState(Phase.INIT);
  const [contractPhase, setContractPhase] = useState(Phase.INIT);
  const [nftContract, setNftContract] = useState();
  const [nftWhitelistContract, setNftWhitelistContract] = useState();

  const setContract = () => {
    if (props.stage === "test1") {
      setNftContract(whaleyContract("test1"));
      setNftWhitelistContract(whaleyWhitelistContract("test1"));
    } else if (props.stage === "test2") {
      setNftContract(whaleyContract("test2"));
      setNftWhitelistContract(whaleyWhitelistContract("test2"));
    } else {
      setNftContract(whaleyContract("mint"));
      setNftWhitelistContract(whaleyWhitelistContract("mint"));
    }
  };

  const setAccountFunction = (_address) => {
    setAccount(_address);
  };

  const checkContractPhase = async () => {
    if (!nftContract) {
      return;
    }
    const currentPhase = await nftContract.methods.currentPhase().call();
    setContractPhase(Number(currentPhase));

    // console.log("currentPhase", currentPhase);
  };

  const checkMintPhase = () => {
    if (props.stage === "test1" || props.stage === "test2") {
      setMintPagePhase(Phase.PUBLIC2);
    } else if (props.stage === "whitelist1") {
      setMintPagePhase(Phase.WHITELIST1);
    } else if (props.stage === "whitelist2") {
      setMintPagePhase(Phase.WHITELIST2);
    } else if (props.stage === "public1") {
      setMintPagePhase(Phase.PUBLIC1);
    } else if (props.stage === "public2") {
      setMintPagePhase(Phase.PUBLIC2);
    }

    // console.log("mintPhase", mintPagePhase);
  };

  const getMintPrice = async () => {
    if (!nftContract) {
      return;
    }
    const _mintPrice = await nftContract.methods
      .mintPriceList(mintPagePhase)
      .call();
    // console.log("mint_price : ", _mintPrice);
    setMintPrice(_mintPrice);
    const _viewMintPrice = _mintPrice / 10 ** 18;
    setViewMintPrice(_viewMintPrice);
  };

  const onClickMint = async () => {
    try {
      if (!nftContract) {
        return;
      }

      if (props.stage === "test1") {
        alert("모의민팅1차 종료되었습니다.");
        return;
      }

      if (!account) {
        alert("지갑을 연결해주세요.");
        return;
      }
      await checkContractPhase();

      if (mintPagePhase !== contractPhase) {
        console.log("no mint stage", mintPagePhase, contractPhase);
        alert("민팅 가능 Stage가 아닙니다.");
        return;
      }

      const isWhiteList = await checkWhiteLists();
      if (isWhiteList === false) {
        alert("화이트리스트가 아닙니다.");
        return;
      }

      const saleAvailable = await checkSaleAvailable();
      if (saleAvailable === false) {
        alert("구매 할 수 없습니다.");
        return;
      }

      //   const mintPriceWei = await web3.utils.toWei(mintPrice);

      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          nftContract.methods
            .batchMintNFT(mintAmount)
            .send({
              from: account,
              value: mintPrice * mintAmount,
              maxFeePerGas: max,
              maxPriorityFeePerGas: Number(tip) + addGasFee,
            })
            .then(() => {
              alert(
                "Mint Succeded!\n모의민팅에 성공하셨습니다.\n오픈씨로 가셔서 지갑을 확인해주세요!"
              );
              checkRemainAmount();
            });
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const onClickMinus = () => {
    if (mintAmount === 1) return;
    const amount = mintAmount - 1;
    setMintAmount(amount);
  };
  const onClickPlus = () => {
    if (mintAmount >= maxMintAmount) return;
    const amount = mintAmount + 1;
    setMintAmount(amount);
  };

  const checkWhiteLists = async () => {
    if (!nftContract) {
      return;
    }
    if (!nftWhitelistContract) {
      return;
    }
    const isWhiteList = await nftWhitelistContract.methods
      .whitelists(account)
      .call();

    let response = true;

    if (contractPhase === Phase.WHITELIST1) {
      response = isWhiteList[WhitelistAddress.WHITELIST1];
    }
    if (contractPhase === Phase.WHITELIST2) {
      response = isWhiteList[WhitelistAddress.WHITELIST2];
    }

    return response;
  };

  const checkRemainAmount = async () => {
    try {
      if (!nftContract) {
        return;
      }
      let remainSupply;
      if (
        mintPagePhase === Phase.WHITELIST1 ||
        mintPagePhase === Phase.WHITELIST2
      ) {
        remainSupply = await nftContract.methods
          .whitelistSaleAvailableAmount()
          .call();
      }
      if (mintPagePhase === Phase.PUBLIC1) {
        remainSupply = await nftContract.methods
          .public1SaleAvailableAmount()
          .call();
      }
      if (mintPagePhase === Phase.PUBLIC2) {
        remainSupply = await nftContract.methods
          .public2SaleAvailableAmount()
          .call();
      }

      setRemainingSupply(remainSupply);
    } catch (error) {
      console.log("checkRmainAmountError", error);
    }
  };

  const checkSaleAvailable = async () => {
    try {
      if (!nftContract) {
        return;
      }
      const totalSaleNFTAmount = await nftContract.methods
        .totalSaleNFTAmount()
        .call();

      const totalSupply = await nftContract.methods.totalSupply().call();
      // console.log(totalSupply, mintAmount, totalSaleNFTAmount);
      if (Number(totalSupply) + Number(mintAmount) > Number(totalSaleNFTAmount))
        return false;

      const NFTCountsList = await nftContract.methods
        .NFTCountsList(account)
        .call();

      let saleLimit;
      let accountNFTCount = 0;
      if (mintPagePhase === Phase.WHITELIST1) {
        saleLimit = await nftContract.methods.whitelistSaleLimit().call();
        accountNFTCount = NFTCountsList[WhitelistAddress.WHITELIST1];
      }
      if (mintPagePhase === Phase.WHITELIST2) {
        saleLimit = await nftContract.methods.whitelistSaleLimit().call();
        accountNFTCount = NFTCountsList[WhitelistAddress.WHITELIST2];
      }
      if (mintPagePhase === Phase.PUBLIC1) {
        saleLimit = await nftContract.methods.public1SaleLimit().call();
        accountNFTCount = NFTCountsList[WhitelistAddress.PUBLIC1];
      }
      if (mintPagePhase === Phase.PUBLIC2) {
        saleLimit = await nftContract.methods.public2SaleLimit().call();
        accountNFTCount = NFTCountsList[WhitelistAddress.PUBLIC2];
      }

      // console.log(accountNFTCount, mintAmount, saleLimit);
      if (Number(accountNFTCount) + Number(mintAmount) > Number(saleLimit)) {
        console.log("fail");
        return false;
      }

      return true;
    } catch (error) {
      console.log("checkSaleLimt", error);
    }
  };

  const checkMaxMintAmount = async () => {
    try {
      if (!nftContract) {
        return;
      }
      let saleLimit = 1;
      if (
        mintPagePhase === Phase.WHITELIST1 ||
        mintPagePhase === Phase.WHITELIST2
      ) {
        saleLimit = await nftContract.methods.whitelistSaleLimit().call();
      }
      if (mintPagePhase === Phase.PUBLIC1) {
        saleLimit = await nftContract.methods.public1SaleLimit().call();
      }
      if (mintPagePhase === Phase.PUBLIC2) {
        if (props.stage === "test1") {
          return;
        }
        saleLimit = await nftContract.methods.maxTransaction().call();
      }
      // console.log("saleLimit", saleLimit);

      setMaxMintAmount(saleLimit);
    } catch (error) {
      console.log("checkMaxMintAmount", error);
    }
  };

  const switchChain = async () => {
    try {
      if (window.ethereum) {
        console.log("switch Chain!");
        window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x89" }], // change to polygon
          })
          .then(() => {
            checkMintPhase();
          });
      }
    } catch (error) {
      // console.log("switchChain", error);
    }
  };
  useEffect(() => {
    getMintPrice();
    checkRemainAmount();
    checkMaxMintAmount();
    checkContractPhase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mintPagePhase]);

  useEffect(() => {
    switchChain();
    setContract();
    // checkMintPhase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <img src="minting_button.png" alt="minting_button"></img>
        </div>
      </div>
    </div>
  );
};

export default MintPage;
