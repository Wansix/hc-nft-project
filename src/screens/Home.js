import React from "react";
import { Link } from "react-router-dom";
import UtilEventMenu from "../components/UtilEventMenu";

export const Home = () => {
  return (
    <div className="Home">
      <div
        className="Home-maincontainer"
        style={{ backgroundImage: "url(./background.png)" }}
      >
        <UtilEventMenu></UtilEventMenu>
        <div className="Home-maincontainer__nav">
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-test">
              {/* <Link to="/Mint-whitelist1"> */}
              <img src="whitelist1_button.png" alt="whitelist1_button"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-whitelist2">
              <img src="whitelist2_button.png" alt="whitelist2_button"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-public1">
              <img src="public1_button.png" alt="public1_button"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint-public2">
              <img src="public2_button.png" alt="public2_button"></img>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
