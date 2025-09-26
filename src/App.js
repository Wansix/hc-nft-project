import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "./screens/MintPage";
import Home from "./screens/Home";
import StakePage from "./screens/StakePage";
import UtilEvent from "./screens/UtilEvent";
// import TestHome from "./screens/TestHome"; // 사용하지 않음
import Admin from "./screens/Admin";
import StakingAdmin from "./screens/StakingAdmin";
import WhitelistCheck from "./screens/WhitelistCheck";
// dotenv는 브라우저에서 자동으로 .env 파일을 로드하므로 import 불필요

const public1_url = process.env.REACT_APP_PUBLIC_SALE1_URL;
const stakingAdmin = process.env.REACT_APP_STAKE_ADMIN;
// console.log(public1_url);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Stake" element={<StakePage />} />
          <Route path={stakingAdmin} element={<StakingAdmin />} />
          <Route path="/AdminTT" element={<Admin />} />
          <Route path="/HomeTest" element={<Home />} />
          <Route path="/WhitelistCheck" element={<WhitelistCheck />} />
          <Route path="/Mint-test1" element={<MintPage stage="test1" />} />
          <Route path="/Mint-test2" element={<MintPage stage="test2" />} />
          <Route
            path="/Mint-whitelist1"
            element={<MintPage stage="whitelist1" />}
          />
          <Route
            path="/Mint-whitelist2"
            element={<MintPage stage="whitelist2" />}
          />
          {/* <Route path="/Mint-public1" element={<MintPage stage="public1" />} /> */}
          <Route path={public1_url} element={<MintPage stage="public1" />} />
          <Route path="/Mint-public2" element={<MintPage stage="public2" />} />
          <Route path="/UtilEvent" element={<UtilEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
