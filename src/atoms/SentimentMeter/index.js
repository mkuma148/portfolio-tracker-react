import React from "react";
import { motion } from "framer-motion";
import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./sentimentmeter.scss";

const getSentiment = (value) => {
  if (value < 25) return "extreme-fear";
  if (value < 50) return "fear";
  if (value < 60) return "neutral";
  if (value < 75) return "greed";
  return "extreme-greed";
};

const getLabel = (value) => {
  if (value < 25) return "Extreme Fear";
  if (value < 50) return "Fear";
  if (value < 60) return "Neutral";
  if (value < 75) return "Greed";
  return "Extreme Greed";
};

const getDomSentiment = (rank) => {
  if (rank <= 10) return "very-high";   // <0.5%
  if (rank <= 20) return "high";        // 0.5–1.5%
  if (rank <= 50) return "medium";      // 1.5–3%
  if (rank <= 100) return "low";       // 3–4.5%
  return "very-low";                           // >4.5%
};

const getDomLabel = (rank) => {
  if (rank <= 10) return "Very High Share";   // <0.5%
  if (rank <= 20) return "High Share";        // 0.5–1.5%
  if (rank <= 50) return "Medium Share";      // 1.5–3%
  if (rank <= 100) return "Low Share";       // 3–4.5%
  return "Very Low Share";                           // >4.5%
};

const SentimentMeter = (props) => {
  const { title, value = 0, rank } = props;
  console.log("rank ", rank);
  const sentimentClass = getSentiment(value);
  const domSentimentClass = getDomSentiment(rank);

  return (
    <motion.div
      className={`ffg-card ${ title === "Market Share" ? domSentimentClass : sentimentClass}`}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="ffg-gradient-ring">
        <div className="ffg-progress-wrapper">
          {/* 🔁 Anti-clockwise */}
          <div className="ffg-anticlockwise">
            <CircularProgressbar
              value={value}
              maxValue={100}
              text={`${value}`}
              styles={buildStyles({
                pathColor: "#ffffff",
                trailColor: "#1e293b",
                textColor: "#ffffff",
                textSize: "22px"
              })}
            />
          </div>
        </div>
      </div>

      <div className="ffg-label">{title === "Market Share"? getDomLabel(rank) : getLabel(value)}</div>
      <div className="ffg-subtitle">{title}</div>
    </motion.div>
  );
};

export default SentimentMeter;
