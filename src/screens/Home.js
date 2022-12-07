import React from "react";
import { Link } from "react-router-dom";
import WalletConnect from "../components/WalletConnect";

export const Home = () => {
  return (
    <div className="Home">
      <div
        className="Home-maincontainer"
        style={{ backgroundImage: "url(./background.png)" }}
      >
        <WalletConnect></WalletConnect>
        <div className="Home-maincontainer__nav">
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-test">
              <img src="whitelist1_button.png"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-whitelist2">
              <img src="whitelist2_button.png"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-public1">
              <img src="public1_button.png"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-public2">
              <img src="public2_button.png"></img>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
