import React from "react";
import { useState, useEffect } from "react";
import {
  whaleyContract,
  whaleyWhitelistContract,
  getContractAddress,
} from "../contracts/index";
import WalletConnect from "../components/WalletConnect";
import Button from "react-bootstrap/Button";
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

export const Admin = () => {
  const [account, setAccount] = useState("");
  const [isRevealed, setIsRevealed] = useState("");
  const [currentStage, setCurrentStage] = useState(0);
  const [currentStageStr, setCurrentStageStr] = useState("Init");
  const [nftContract, setNftContract] = useState();
  const [nftWhitelistContract, setNftWhitelistContract] = useState();
  const [contractAddress, setContractAddress] = useState("");
  const [nftCount, setNftCount] = useState(0);

  const getNftCount = async () => {
    try {
      if (!nftContract) {
        return;
      }
      const response = await nftContract.methods.totalSupply().call();
      setNftCount(Number(response));
    } catch (error) {
      console.log("getIsRevealed", error);
    }
  };

  const setContract = () => {
    const stage = "test2"; //test
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

      const response = await nftContract.methods.reveal().send({
        from: account,
      });
      if (response) getIsRevealed();
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

      const response = await nftContract.methods.advancePhase().send({
        from: account,
      });
      if (response) getCurrentStage();
    } catch (error) {
      console.log("setReveal", error);
    }
  };

  const setAccountFunction = (_address) => {
    setAccount(_address);
  };

  const getWhitelists = (whitelistNum) => {
    let whitelists;
    if (whitelistNum === 1) {
      whitelists = document.querySelector(".addWhitelists_1").value;
    }
    if (whitelistNum === 2) {
      whitelists = document.querySelector(".addWhitelists_2").value;
    }

    console.log(whitelists);
    const arr = whitelists.split("\n");
    console.log(arr);
  };

  useEffect(() => {
    getIsRevealed();
    getCurrentStage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftContract]);

  useEffect(() => {
    setContract();
    // checkMintPhase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="Admin">
      <WalletConnect setAccountFunction={setAccountFunction}></WalletConnect>
      <div className="Admin-maincontainer">
        <div> Contract Address : {contractAddress}</div>
        <div> totalSupply : {nftCount} </div>
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
        <div>
          add whitelist1
          <textarea className="addWhitelists addWhitelists_1"></textarea>
          <Button
            className="Admin_Button"
            variant="success"
            onClick={() => {
              getWhitelists(1);
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
              getWhitelists(2);
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
