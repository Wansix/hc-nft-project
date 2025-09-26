import React from "react";
import { useState, useEffect } from "react";
import WalletConnect from "../components/WalletConnect";
import {
  whaleyStakeContract,
  whaleyNFTContract,
  getStakeContractAddress,
} from "../contracts/index";
import Button from "react-bootstrap/Button";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
// dotenv는 브라우저에서 자동으로 .env 파일을 로드하므로 import 불필요

const addGasFee = 5000000000;

const alchemy_privateKeyHttps = process.env.REACT_APP_ALCHEMY_PRIVATE_KEY_HTTPS;

const base_uri = process.env.REACT_APP_BASE_URI;

const googleFormLink = process.env.REACT_APP_GOOGLE_FORM;

export const StakePage = () => {
  const [account, setAccount] = useState("");
  const [nftContract, setNftContract] = useState();
  const [nftStakeContract, setNftStakeContract] = useState();
  const [NFTList, setNFTList] = useState([]);
  const [viewTitle, setViewTitle] = useState("My NFT");
  const [buttonTitle, setButtonTitle] = useState("Stake");
  const [licenseTitle, setLicenseTitle] = useState("");
  const [licenseLink, setLicenseLink] = useState("");

  const setContract = () => {
    setNftContract(whaleyNFTContract());
    setNftStakeContract(whaleyStakeContract());
  };

  const setAccountFunction = (_address) => {
    setAccount(_address);
  };

  const getStakeStatus = async () => {
    if (!account) {
      //   alert("지갑을 연결해주세요.");
      return;
    }

    return await nftStakeContract.methods.stakeFlags(account).call();
  };

  const getStakedNfts = async () => {
    if (!account) {
      //   alert("지갑을 연결해주세요.");
      return;
    }

    const list = [];
    const stakeTokens = await nftStakeContract.methods
      .stakeTokens(account)
      .call();

    const token1 = stakeTokens.token1;
    const token2 = stakeTokens.token2;
    const token3 = stakeTokens.token3;

    const imgSrc1 = `${base_uri}${token1}.png`;
    const imgSrc2 = `${base_uri}${token2}.png`;
    const imgSrc3 = `${base_uri}${token3}.png`;
    list.push(
      <div key={1} className="NFTList__item">
        <img src={imgSrc1} alt={token1}></img>
        <span>{`#${token1}`}</span>
      </div>
    );
    list.push(
      <div key={2} className="NFTList__item">
        <img src={imgSrc2} alt={token2}></img>
        <span>{`#${token2}`}</span>
      </div>
    );
    list.push(
      <div key={3} className="NFTList__item">
        <img src={imgSrc3} alt={token3}></img>
        <span>{`#${token3}`}</span>
      </div>
    );

    setNFTList(list);
  };

  const getBalanceOf = async () => {
    if (!account) {
      //   alert("지갑을 연결해주세요.");
      return;
    }

    const list = [];
    const balance = await nftContract.methods.balanceOf(account).call();
    for (let i = 0; i < balance; i++) {
      const tokenId = await nftContract.methods
        .tokenOfOwnerByIndex(account, i)
        .call();

      const imgSrc = `${base_uri}${tokenId}.png`;

      list.push(
        <div key={i + 1} className="NFTList__item">
          <img src={imgSrc} alt={tokenId}></img>
          <span>{`#${tokenId}`}</span>
          <input type="checkbox" name="whaley" value={tokenId}></input>
        </div>
      );
    }

    setNFTList(list);
  };

  const getButtonTitle = async () => {
    if (!account) {
      //   alert("지갑을 연결해주세요.");
      return;
    }

    const stakeStatus = await getStakeStatus();

    const waitUnstakeFlag = await nftStakeContract.methods
      .waitUnstakeFlags(account)
      .call();
    const unstakingPossible = await nftStakeContract.methods
      .unstakingPossible(account)
      .call();

    if (stakeStatus === true) {
      if (waitUnstakeFlag) {
        setButtonTitle("Unstake 요청 완료");
        setLicenseTitle("");
        setLicenseLink("");
      } else if (unstakingPossible) {
        setButtonTitle("Unstake");
        setLicenseTitle("");
        setLicenseLink("");
      } else {
        setButtonTitle("UnStake 요청");
        setLicenseTitle("라이센스 신청");
        setLicenseLink(googleFormLink);
      }
    } else {
      setButtonTitle("Stake");
      setLicenseTitle("");
      setLicenseLink("");
    }
  };

  const getView = async () => {
    getButtonTitle();

    const stakeStatus = await getStakeStatus();

    if (stakeStatus === true) {
      setViewTitle("My Staking");
      getStakedNfts();

      const element = document.querySelectorAll(".MyNFT_viewList");
      element[0].classList.add("MyNFT_viewList_Staked");
    } else {
      setViewTitle("My NFT");
      getBalanceOf();

      const element = document.querySelectorAll(".MyNFT_viewList");
      element[0].classList.remove("MyNFT_viewList_Staked");
    }
  };

  const switchChain = async () => {
    try {
      if (window.ethereum) {
        // console.log("switch Chain!");
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }], // change to polygon
        });
      }
    } catch (error) {
      // console.log("switchChain", error);
    }
  };

  const onClickStake = async () => {
    if (buttonTitle === "Stake") {
      const query = 'input[name="whaley"]:checked';
      const selectedTokens = document.querySelectorAll(query);

      if (selectedTokens.length !== 3) {
        alert("3개를 선택해주세요!");
        return;
      }
      const stakeContractAddress = getStakeContractAddress();
      const approveStatus = await nftContract.methods
        .isApprovedForAll(account, stakeContractAddress)
        .call();

      if (approveStatus === false) {
        const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
        alch.eth.getMaxPriorityFeePerGas().then((tip) => {
          alch.eth.getBlock("pending").then(async (block) => {
            const baseFee = Number(block.baseFeePerGas);
            const max = Number(tip) + baseFee - 1 + addGasFee;

            await nftContract.methods
              .setApprovalForAll(stakeContractAddress, true)
              .send({
                from: account,
                maxFeePerGas: max,
                maxPriorityFeePerGas: Number(tip) + addGasFee,
              });

            nftStakeContract.methods
              .stake(
                selectedTokens[0].value,
                selectedTokens[1].value,
                selectedTokens[2].value
              )
              .send({
                from: account,
                // value: mintPrice * mintAmount,
                maxFeePerGas: max,
                maxPriorityFeePerGas: Number(tip) + addGasFee,
              })
              .then(() => {
                alert(`스테이킹 되었습니다.`);
                getView();
              });
          });
        });
      } else {
        const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
        alch.eth.getMaxPriorityFeePerGas().then((tip) => {
          alch.eth.getBlock("pending").then((block) => {
            const baseFee = Number(block.baseFeePerGas);
            const max = Number(tip) + baseFee - 1 + addGasFee;

            nftStakeContract.methods
              .stake(
                selectedTokens[0].value,
                selectedTokens[1].value,
                selectedTokens[2].value
              )
              .send({
                from: account,
                // value: mintPrice * mintAmount,
                maxFeePerGas: max,
                maxPriorityFeePerGas: Number(tip) + addGasFee,
              })
              .then(() => {
                alert(`스테이킹 되었습니다.`);
                getButtonTitle();
              });
          });
        });
      }
    } else if (buttonTitle === "UnStake 요청") {
      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then(async (block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          nftStakeContract.methods
            .unstakeRquest()
            .send({
              from: account,
              maxFeePerGas: max,
              maxPriorityFeePerGas: Number(tip) + addGasFee,
            })
            .then(() => {
              alert(`Unstake 요청 되었습니다.`);
              getView();
            });
        });
      });
    } else if (buttonTitle === "Unstake 요청 완료") {
      alert("Unstake 요청 완료 된 상태입니다. 관리자의 승인을 기다리세요.");
    } else if (buttonTitle === "Unstake") {
      const alch = createAlchemyWeb3(alchemy_privateKeyHttps);
      alch.eth.getMaxPriorityFeePerGas().then((tip) => {
        alch.eth.getBlock("pending").then(async (block) => {
          const baseFee = Number(block.baseFeePerGas);
          const max = Number(tip) + baseFee - 1 + addGasFee;

          nftStakeContract.methods
            .unstake()
            .send({
              from: account,
              maxFeePerGas: max,
              maxPriorityFeePerGas: Number(tip) + addGasFee,
            })
            .then(() => {
              alert(`Unstake 완료`);
              getView();
            });
        });
      });
    }
  };

  useEffect(() => {
    getView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    switchChain();
    setContract();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="StakePage__Main-container">
      <div className="StakePage__Stake-container"
      style={{ backgroundImage: "url(./stake_background.png)" }}
      >
        <WalletConnect
          setAccountFunction={setAccountFunction}
          isMobile={false}
        ></WalletConnect>

        <div className="MyNFT_views_container">
          <div className="MyNFT_view_container">
            <div className="MyNFT_viewTitle">{viewTitle}</div>
            <div className="MyNFT_viewList">{NFTList}</div>
          </div>
          <div className="StakeButton-container">
            <Button
              className="Stake_Button"
              variant="success"
              onClick={onClickStake}
            >
              {buttonTitle}
            </Button>
          </div>
          <div className="LicenseForm-container">
            <div className="LicenseFormTitle">{licenseTitle}</div>
            <div className="LicenseForm">
              <a href={licenseLink}>{licenseLink}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakePage;
