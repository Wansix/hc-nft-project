import React from "react";
import WalletConnect from "../components/WalletConnect";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import {
  whaleyStakeContract,
  // whaleyNFTContract, // 사용하지 않음
  // getStakeContractAddress, // 사용하지 않음
} from "../contracts/index";

export const StakingAdmin = () => {
  const [account, setAccount] = useState("");
  const [nftStakeContract, setNftStakeContract] = useState();
  const [unstakeList, setUnstakeList] = useState([]);
  const [stakeList, setStakeList] = useState([]);

  const setAccountFunction = (_address) => {
    setAccount(_address);
  };

  const setContract = () => {
    setNftStakeContract(whaleyStakeContract());
  };
  const getStakeList = async () => {
    if (!account) {
      //   alert("지갑을 연결해주세요.");
      return;
    }

    const totalStakedNum = await nftStakeContract.methods
      .totalStakedNum()
      .call();

    const stakeList = [];
    for (let i = 0; i < totalStakedNum; i++) {
      const _address = await nftStakeContract.methods.stakedAddresses(i).call();
      const unstakePossible = await nftStakeContract.methods
        .unstakingPossible(_address)
        .call();
      if (unstakePossible) continue;
      const stakeTokens = await nftStakeContract.methods
        .stakeTokens(_address)
        .call();

      stakeList.push(
        <div key={i + 1}>
          {_address} : {stakeTokens.token1},{stakeTokens.token2},
          {stakeTokens.token3}
        </div>
      );
    }

    setStakeList(stakeList);
  };

  const getUnstakeRequestList = async () => {
    if (!account) {
      //   alert("지갑을 연결해주세요.");
      return;
    }

    const waitUnstakeNum = await nftStakeContract.methods
      .waitUnstakeNum()
      .call();
    const waitUnstakeList = [];

    for (let i = 0; i < waitUnstakeNum; i++) {
      const _address = await nftStakeContract.methods
        .waitUnstakeAddresses(i)
        .call();

      const stakeTokens = await nftStakeContract.methods
        .stakeTokens(_address)
        .call();

      waitUnstakeList.push(
        <div key={i + 1}>
          {_address} : {stakeTokens.token1},{stakeTokens.token2},
          {stakeTokens.token3}
        </div>
      );
    }

    setUnstakeList(waitUnstakeList);
  };

  const getView = () => {
    getUnstakeRequestList();
    getStakeList();
  };

  const onClickUnstakeRelease = () => {
    if (!account) {
      alert("지갑을 연결해주세요.");
      return;
    }
    nftStakeContract.methods.releaseUnstake().send({
      from: account,
    });
  };

  useEffect(() => {
    getView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    setContract();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="StakingAdmin__Main-container">
      <WalletConnect setAccountFunction={setAccountFunction}></WalletConnect>
      <div className="StakingAdmin__Admin-container">
        <div className="UnstakeList">
          <div>Unstake Request List</div>
          <div className="UnstakeList-container">{unstakeList}</div>
          <div className="UnstakeButton-container">
            <Button
              className="UnstakeRelease_Button"
              variant="success"
              onClick={onClickUnstakeRelease}
            >
              UnstakeRelease
            </Button>
          </div>
        </div>
        <div className="StakeList">
          <div>Staking List</div>
          <div className="StakeList-container">{stakeList}</div>
        </div>
      </div>
    </div>
  );
};

export default StakingAdmin;
