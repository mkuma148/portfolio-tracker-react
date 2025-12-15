// src/RoundButton.jsx
import React from "react";
import "./buttons.scss";

const Buttons = (props) => {
  const handleClick = () => {
    alert("Round Button Clicked 🚀");
  };

  return (
    <div>
      <button
        className={props.className}
        // onClick={handleClick}
      >
        logout
      </button>
    </div>
  );
};

export default Buttons;
