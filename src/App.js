import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "./screens/MintPage";
import Home from "./screens/Home";
import UtilEvent from "./screens/UtilEvent";
import TestHome from "./screens/TestHome";
import Admin from "./screens/Admin";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/AdminTT" element={<Admin />} />
          <Route path="/HomeTest" element={<Home />} />
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
          <Route path="/Mint-public1" element={<MintPage stage="public1" />} />
          <Route path="/Mint-public2" element={<MintPage stage="public2" />} />
          <Route path="/UtilEvent" element={<UtilEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
