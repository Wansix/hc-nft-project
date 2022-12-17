import React from "react";
import { useState, useEffect } from "react";
import WalletConnect from "../components/WalletConnect";
import { whaleyWhitelistContract } from "../contracts/index";

const WhitelistAddress = {
  WHITELIST1: 0,
  WHITELIST2: 1,
};

export const WhitelistCheck = () => {
  const [account, setAccount] = useState("");
  const [checkStr1, setCheckStr1] = useState("프리세일 민팅 참여 가능여부");
  const [checkStr2, setCheckStr2] = useState("화이트리스트 지갑주소 확인하기");
  const [nftWhitelistContract, setNftWhitelistContract] = useState();

  useEffect(() => {
    if (!account) {
      console.log("can not connect", account);
      return;
    }

    setNftWhitelistContract(whaleyWhitelistContract("mint"));

    console.log(account);
  }, [account]);

  useEffect(() => {
    checkWhiteLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nftWhitelistContract]);

  const checkWhiteLists = async () => {
    if (!nftWhitelistContract) {
      return;
    }
    const isWhiteList = await nftWhitelistContract.methods
      .whitelists(account)
      .call();

    if (isWhiteList[WhitelistAddress.WHITELIST1]) {
      setCheckStr1("확정 화이트리스트입니다!");
      setCheckStr2("1차 프리세일 민팅에 참여해주세요.");
    } else if (isWhiteList[WhitelistAddress.WHITELIST2]) {
      setCheckStr1("경쟁 화이트리스트입니다!");
      setCheckStr2("2차 프리세일 민팅에 참여해주세요.");
    } else {
      setCheckStr1("화이트리스트가 아니네요..ㅠㅠ");
      setCheckStr2("퍼블릭 민팅에 참여해주세요!");
    }
  };

  return (
    <>
      <div className="WhitelistCheck">
        <div
          className="WhitelistCheck-maincontainer"
          style={{ backgroundImage: "url(./whitelistCheck.png)" }}
        >
          <div className="WhitelistCheck-contents">
            <div className="WhitelistCheck-title">WHITELIST CHECK</div>
            <div className="WhitelistCheck-content WhitelistCheck-content1">
              {checkStr1}
            </div>
            <div className="WhitelistCheck-content WhitelistCheck-content2">
              {checkStr2}
            </div>
            <WalletConnect
              setAccountFunction={setAccount}
              WhitelistCheck={true}
            ></WalletConnect>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhitelistCheck;
