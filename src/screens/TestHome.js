import React from "react";
import { Link } from "react-router-dom";

export const TestHome = () => {
  return (
    <div className="TestHome">
      <div
        className="TestHome-maincontainer"
        style={{ backgroundImage: "url(./test_background.png)" }}
      >
        <div className="TestHome-maincontainer__nav">
          <div className="TestHome-maincontainer__nav-button">
            <Link to="/Mint-test1">
              {/* <Link to="/Mint-whitelist1"> */}
              <img src="test1_button.png" alt="test1_button"></img>
            </Link>
          </div>

          <div className="TestHome-maincontainer__nav-button">
            <Link to="/Mint-test2">
              {/* <Link to="/Mint-whitelist1"> */}
              <img src="test2_button.png" alt="test2_button"></img>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHome;
