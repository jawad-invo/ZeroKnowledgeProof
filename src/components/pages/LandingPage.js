import React from "react";
import { Link } from "react-router-dom";

import "../../App.css";
import BackgroundImage from "../../assets/images/bg2.jpg";
import SignInPage from "./LoginPage";

export default function LandingPage() {
  return (
    <header style={HeaderStyle}>
      <h1 className="main-title text-center">Login</h1>
      <SignInPage />
    </header>
  );
}

const HeaderStyle = {
  width: "100%",
  height: "100vh",
  background: `url(${BackgroundImage})`,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};
