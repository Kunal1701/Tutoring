import React from "react";
import Navbar from "../components/Navbar";
import blackboard from "../assets/images/blackboard.png";
import "../assets/styles/LoginRegister.css";
import RegisterTeacher from "./RegisterTeacher";

function RegisterPage2() {
  return (
    <div>
      <div className="main-container">
        <Navbar />
        <div className="row">
          <div className="col" role="banner">
            <p className="quote">Sign Up to Find the Perfect Tutor!</p>
            <img className="blackboard" src={blackboard} alt="A+" />
          </div>
          <div className="col">
            <RegisterTeacher />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage2;
