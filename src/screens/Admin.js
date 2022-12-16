import React from "react";
import { useState, useEffect } from "react";
import {
  whaleyContract,
  whaleyWhitelistContract,
  getContractAddress,
} from "../contracts/index";
import WalletConnect from "../components/WalletConnect";
import Button from "react-bootstrap/Button";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
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
const addGasFee = 5000000000;

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

export const Admin = () => {
  const [account, setAccount] = useState("");
  const [isRevealed, setIsRevealed] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [currentStageStr, setCurrentStageStr] = useState("Init");
  const [nftContract, setNftContract] = useState();
  const [nftWhitelistContract, setNftWhitelistContract] = useState();
  const [contractAddress, setContractAddress] = useState("");
  const [nftCount, setNftCount] = useState(0);
  const [whitelist1Price, setWhitelist1Price] = useState("0");
  const [whitelist2Price, setWhitelist2Price] = useState("0");
  const [public1Price, setPublic1Price] = useState("0");
  const [public2Price, setPublic2Price] = useState("0");
  const [textWhitelist1Price, setTextWhitelist1Price] = useState("");
  const [textWhitelist2Price, setTextWhitelist2Price] = useState("");
  const [textPublic1Price, setTextPublic1Price] = useState("");
  const [textPublic2Price, setTextPublic2Price] = useState("");
  const [textDepositAddress, setTextDepositAddress] = useState("");
  const [mintDepositAddress, setMintDepositAddress] = useState("");

  const getPrices = async () => {
    try {
      if (!nftContract) {
        return;
      }

      const _whitelist1Price = await nftContract.methods
        .mintPriceList(Phase.WHITELIST1)
        .call();

      const viewWhitelist1Price = _whitelist1Price / 10 ** 18;

      const _whitelist2Price = await nftContract.methods
        .mintPriceList(Phase.WHITELIST2)
        .call();
      const viewWhitelist2Price = _whitelist2Price / 10 ** 18;

      const _public1Price = await nftContract.methods
        .mintPriceList(Phase.PUBLIC1)
        .call();
      const viewPublic1Price = _public1Price / 10 ** 18;

      const _public2Price = await nftContract.methods
        .mintPriceList(Phase.PUBLIC2)
        .call();
      const viewPublic2Price = _public2Price / 10 ** 18;

      setWhitelist1Price(viewWhitelist1Price);
      setWhitelist2Price(viewWhitelist2Price);
      setPublic1Price(viewPublic1Price);
      setPublic2Price(viewPublic2Price);
    } catch (error) {
      console.log("getPrices", error);
    }
  };
  const getNftCount = async () => {
    try {
      if (!nftContract) {
        return;
      }
      const response = await nftContract.methods.totalSupply().call();
      setNftCount(Number(response));
    } catch (error) {
      console.log("getNftCount", error);
    }
  };

  const getDepositAddress = async () => {
    try {
      if (!nftContract) {
        return;
      }
      const response = await nftContract.methods.mintDepositAddress().call();
      setMintDepositAddress(response);
    } catch (error) {
      console.log("getDepositAddress", error);
    }
  };

  const setContract = () => {
    const stage = "mint"; //test
    if (stage === "test1") {
      setNftContract(whaleyContract("test1"));
      setNftWhitelistContract(whaleyWhitelistContract("test1"));
      setContractAddress(getContractAddress("test1"));
    } else if (stage === "test2") {
      setNftContract(whaleyContract("test2"));
      setNftWhitelistContract(whaleyWhitelistContract("test2"));
      setContractAddress(getContractAddress("test2"));
    } else {
      setNftContract(whaleyContract("mint"));
      setNftWhitelistContract(whaleyWhitelistContract("mint"));
      setContractAddress(getContractAddress("mint"));
    }
  };

  const getIsRevealed = async () => {
    try {
      if (!nftContract) {
        return;
      }

      const response = await nftContract.methods.isRevealed().call();
      if (response) setIsRevealed("Revealed");
      else setIsRevealed("notReveal");
    } catch (error) {
      console.log("getIsRevealed", error);
    }
  };

  const setReveal = async () => {
    try {
      if (!nftContract) {
        return;
      }
      if (!account) {
        alert("지갑 연결 해주세요");
        return;
      }
      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          nftContract.methods
            .reveal()
            .send({
              from: account,
              maxFeePerGas: max,
              maxPriorityFeePerGas: Number(tip) + addGasFee,
            })
            .then(() => {
              getIsRevealed();
            });
        });
      });

      // const response = await nftContract.methods.reveal().send({
      //   from: account,
      // });
      // if (response) getIsRevealed();
    } catch (error) {
      console.log("setReveal", error);
    }
  };
  const getPhaseStr = (_phase) => {
    if (_phase === Phase.INIT) return "Init";
    if (_phase === Phase.WHITELIST1) return "확정화리";
    if (_phase === Phase.WAITING_WHITELIST2) return "경쟁화리 대기";
    if (_phase === Phase.WHITELIST2) return "경쟁화리";
    if (_phase === Phase.WAITING_PUBLIC1) return "퍼블릭1차 대기";
    if (_phase === Phase.PUBLIC1) return "퍼블릭1차";
    if (_phase === Phase.WAITING_PUBLIC2) return "퍼블릭2차 대기";
    if (_phase === Phase.PUBLIC2) return "퍼블릭 2차";
    if (_phase === Phase.DONE) return "전체완료";
  };

  const getCurrentStage = async () => {
    try {
      if (!nftContract) {
        return;
      }
      const response = await nftContract.methods.currentPhase().call();
      const _currentPhase = Number(response);
      setCurrentStage(_currentPhase);
      setCurrentStageStr(getPhaseStr(_currentPhase));

      //   console.log("getCurrentStage", response);
    } catch (error) {
      console.log("getCurrentStage", error);
    }
  };

  const setNextStage = async () => {
    try {
      if (!nftContract) {
        return;
      }

      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then((block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          nftContract.methods
            .advancePhase()
            .send({
              from: account,
              maxFeePerGas: max,
              maxPriorityFeePerGas: Number(tip) + addGasFee,
            })
            .then(() => {
              getCurrentStage();
            });
        });
      });

      // const response = await nftContract.methods.advancePhase().send({
      //   from: account,
      // });
      // if (response) getCurrentStage();
    } catch (error) {
      console.log("setReveal", error);
    }
  };

  const setAccountFunction = (_address) => {
    setAccount(_address);
  };

  const setWhitelists = async (whitelistNum) => {
    let whitelists;
    let currentPhase;
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (whitelistNum === Phase.WHITELIST1) {
      whitelists = document.querySelector(".addWhitelists_1").value;
      currentPhase = Phase.WHITELIST1;
    }
    if (whitelistNum === Phase.WHITELIST2) {
      whitelists = document.querySelector(".addWhitelists_2").value;
      currentPhase = Phase.WHITELIST2;
    }

    console.log(whitelists);
    const arr = whitelists.split("\n");
    console.log(arr);
    try {
      if (!nftContract) {
        return;
      }

      nftWhitelistContract.methods.addToWhitelist(currentPhase, arr).send({
        from: account,
      });
    } catch (error) {
      console.log("setWhitelists", error);
    }
  };

  const onChangeWhitelist1Price = (e) => {
    setTextWhitelist1Price(e.target.value);
  };
  const onChangeWhitelist2Price = (e) => {
    setTextWhitelist2Price(e.target.value);
  };
  const onChangePublic1Price = (e) => {
    setTextPublic1Price(e.target.value);
  };
  const onChangePublic2Price = (e) => {
    setTextPublic2Price(e.target.value);
  };

  const onChangeDepositAddress = (e) => {
    setTextDepositAddress(e.target.value);
  };

  const setPrice = async (_phase) => {
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    if (!nftContract) {
      return;
    }
    // console.log(_phase);

    let _price;
    if (_phase === Phase.WHITELIST1) {
      _price = textWhitelist1Price * 10 ** 18;
    } else if (_phase === Phase.WHITELIST2) {
      _price = textWhitelist2Price * 10 ** 18;
    } else if (_phase === Phase.PUBLIC1) {
      _price = textPublic1Price * 10 ** 18;
    } else if (_phase === Phase.PUBLIC2) {
      _price = textPublic2Price * 10 ** 18;
    } else {
      alert("가격 설정 할 수 있는 Phase가 아닙니다.");
      return;
    }

    try {
      const response = await nftContract.methods
        .setMintPrice(_phase, _price.toString())
        .send({
          from: account,
        });
      if (response) getPrices();
    } catch (error) {
      console.log("setPrice", error);
    }
  };

  const setDepositAddress = async () => {
    // console.log(textDepositAddress);
    if (!account) {
      alert("지갑 연결 해주세요");
      return;
    }
    try {
      const response = await nftContract.methods
        .setMintDeposit(textDepositAddress.toString())
        .send({
          from: account,
        });
      if (response) getDepositAddress();
    } catch (error) {
      console.log("setDepositAddress", error);
    }
  };

  useEffect(() => {
    getIsRevealed();
    getCurrentStage();
    getPrices();
    getNftCount();
    getDepositAddress();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftContract]);

  useEffect(() => {
    setContract();
    // checkMintPhase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="Admin">
      <div className="Admin-maincontainer">
        <div>
          <WalletConnect
            setAccountFunction={setAccountFunction}
          ></WalletConnect>
        </div>

        <div> Contract Address : {contractAddress}</div>

        <div> 민팅 단계</div>
        <div>
          Init - 확정화리 - 경쟁화리 대기 - 경쟁화리 - 퍼블릭1차 대기 -
          퍼블릭1차 - 퍼블릭2차대기 - 퍼블릭2차 - 전체완료
        </div>
        <div>
          현재 단계 : {currentStageStr}{" "}
          <Button
            className="Admin_Button"
            variant="success"
            onClick={setNextStage}
          >
            Next
          </Button>
        </div>

        <div>
          {isRevealed}{" "}
          <Button
            className="Admin_Button"
            variant="success"
            onClick={setReveal}
          >
            Reveal!
          </Button>
        </div>
        <div> totalSupply : {nftCount} </div>
        <div style={{ flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "20px" }}>
            Price lists
          </div>
          <div className="Admin-setPrice-container">
            {" "}
            whitelist 확정 : {whitelist1Price} matic{" "}
            <input
              onChange={onChangeWhitelist1Price}
              value={textWhitelist1Price}
              type="number"
              placeholder="가격 입력(Matic 단위)"
            ></input>
            <Button
              // className=""
              variant="success"
              onClick={() => {
                setPrice(Phase.WHITELIST1);
              }}
            >
              set Whitelist확정 Price
            </Button>
          </div>
          <div className="Admin-setPrice-container">
            {" "}
            whitelist경쟁 : {whitelist2Price} matic{" "}
            <input
              onChange={onChangeWhitelist2Price}
              value={textWhitelist2Price}
              type="number"
              placeholder="가격 입력(Matic 단위)"
            ></input>
            <Button
              // className=""
              variant="success"
              onClick={() => {
                setPrice(Phase.WHITELIST2);
              }}
            >
              set Whitelist경쟁 Price
            </Button>
          </div>
          <div className="Admin-setPrice-container">
            {" "}
            public 1차: {public1Price} matic{" "}
            <input
              onChange={onChangePublic1Price}
              value={textPublic1Price}
              type="number"
              placeholder="가격 입력(Matic 단위)"
            ></input>
            <Button
              // className=""
              variant="success"
              onClick={() => {
                setPrice(Phase.PUBLIC1);
              }}
            >
              set Public 1차 Price
            </Button>
          </div>
          <div className="Admin-setPrice-container">
            {" "}
            public 2차 : {public2Price} matic{" "}
            <input
              onChange={onChangePublic2Price}
              value={textPublic2Price}
              type="number"
              placeholder="가격 입력(Matic 단위)"
            ></input>
            <Button
              // className=""
              variant="success"
              onClick={() => {
                setPrice(Phase.PUBLIC2);
              }}
            >
              set Public 2차 Price
            </Button>
          </div>
        </div>
        <div>민팅 자금 받을 지갑 : {mintDepositAddress}</div>
        <div>
          <input
            onChange={onChangeDepositAddress}
            value={textDepositAddress}
            type="text"
            placeholder="지갑주소 입력(ex 0x929..33d)"
          ></input>
          <Button variant="success" onClick={setDepositAddress}>
            민팅 자금 받을 지갑 설정하기
          </Button>
        </div>

        <div>
          add whitelist1
          <textarea className="addWhitelists addWhitelists_1"></textarea>
          <Button
            className="Admin_Button"
            variant="success"
            onClick={() => {
              setWhitelists(Phase.WHITELIST1);
            }}
          >
            Add whitelist1
          </Button>
        </div>
        <div>
          add whitelist2
          <textarea className="addWhitelists addWhitelists_2"></textarea>
          <Button
            className="Admin_Button"
            variant="success"
            onClick={() => {
              setWhitelists(Phase.WHITELIST2);
            }}
          >
            Add whitelist1
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
