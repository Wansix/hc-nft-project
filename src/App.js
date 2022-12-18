import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "./screens/MintPage";
import Home from "./screens/Home";
import UtilEvent from "./screens/UtilEvent";
import TestHome from "./screens/TestHome";
import Admin from "./screens/Admin";
import WhitelistCheck from "./screens/WhitelistCheck";
import * as dotenv from "dotenv";

dotenv.config();

const public1_url = process.env.REACT_APP_PUBLIC_SALE1_URL;
// console.log(public1_url);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
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
