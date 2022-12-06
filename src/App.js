import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MintPage from "./screens/MintPage";
import Home from "./screens/Home";

function App() {
  return (
    <Router>
      <div className="App">
        {/* <MintPage></MintPage> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Mint" element={<MintPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
