import React from "react";
import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div className="Home">
      <div
        className="Home-maincontainer"
        style={{ backgroundImage: "url(./background.png)" }}
      >
        <div className="Home-maincontainer__nav">
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint">
              <img src="whitelist1_button.png"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint">
              <img src="whitelist2_button.png"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint">
              <img src="public1_button.png"></img>
            </Link>
          </div>
          <div className="Home-maincontainer__nav-button">
            <Link to="/Mint">
              <img src="public2_button.png"></img>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
