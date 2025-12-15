// src/RoundButton.jsx
import React from "react";
import "./buttons.scss";

const Buttons = (props) => {
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
