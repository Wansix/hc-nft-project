import React from "react";
import { Link } from "react-router-dom";
import UtilEventMenu from "../components/UtilEventMenu";

export const Home = () => {
  const public1Alarm = () => {
    alert(
      "해리컴티 디스코드의 [퍼블릭1차-민팅장소] 채널을 통해 입장해주세요.\n10기 분들은 퍼블릭 2차민팅에서 뵙겠습니다!\n감사합니다!"
    );
  };
  return (
    <>
      <div className="Home">
        <div
          className="Home-maincontainer"
          style={{ backgroundImage: "url(./background.png)" }}
        >
          <UtilEventMenu></UtilEventMenu>
          <div className="Home-maincontainer__nav">
            <div className="Home-maincontainer__nav-button">
              <Link to="/Mint-whitelist1">
                <img src="whitelist1_button.png" alt="whitelist1_button"></img>
              </Link>
            </div>
            <div className="Home-maincontainer__nav-button">
              <Link to="/Mint-whitelist2">
                <img src="whitelist2_button.png" alt="whitelist2_button"></img>
              </Link>
            </div>
            <div
              className="Home-maincontainer__nav-button"
              onClick={public1Alarm}
            >
              {/* <Link to="/Mint-public1"> */}
              <img src="public1_button.png" alt="public1_button"></img>
              {/* </Link> */}
            </div>
            <div className="Home-maincontainer__nav-button">
              {/* <Link to="/Mint-public2"> */}
              <img src="public2_button.png" alt="public2_button"></img>
              {/* </Link> */}
            </div>
          </div>
        </div>
      </div>
      <div className="Mobile_Home">
        <div
          className="Mobile_Home_maincontainer"
          style={{ backgroundImage: "url(./mobile_home_background.png)" }}
        >
          <div className="Mobile_Home_maincontainer__button-container">
            <div className="Mobile_Home_maincontainer__button-container-row">
              <div className="Mobile_Home__button">
                <Link to="/Mint-whitelist1">
                  <img
                    src="whitelist1_button_mobile.png"
                    alt="whitelist1"
                  ></img>
                </Link>
              </div>
              <div className="Mobile_Home__button">
                <Link to="/Mint-whitelist2">
                  <img
                    src="whitelist2_button_mobile.png"
                    alt="whitelist2"
                  ></img>
                </Link>
              </div>
            </div>
            <div className="Mobile_Home_maincontainer__button-container-row">
              <div className="Mobile_Home__button" onClick={public1Alarm}>
                {/* <Link to="/Mint-public1"> */}
                <img src="public1_button_mobile.png" alt="public1"></img>
                {/* </Link> */}
              </div>
              <div className="Mobile_Home__button">
                {/* <Link to="/Mint-public2"> */}
                <img src="public2_button_mobile.png" alt="public2"></img>
                {/* </Link> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
