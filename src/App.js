import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./components/pages/LandingPage";
import LoginPage from "./components/pages/LoginPage";
import HomePage from "./components/pages/HomePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

const Footer = () => {
  return (
    <p className="text-center" style={FooterStyle}>
      Designed & coded by{" "}
      <a
        href="https://izemspot.netlify.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        InvoZone
      </a>
    </p>
  );
};

const FooterStyle = {
  background: "#222",
  fontSize: ".8rem",
  color: "#fff",
  position: "absolute",
  bottom: 0,
  padding: "1rem",
  margin: 0,
  width: "100%",
  opacity: ".5",
};

export default App;
