import ReactSpeedometer from "react-d3-speedometer";

const Speedometer = ({ risk }) => {
  const needleColor =
    risk < 30 ? "#2ecc71" :
    risk < 50 ? "#f1c40f" :
    risk < 65 ? "#e67e22" :
    "#e74c3c";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <ReactSpeedometer
        key={needleColor}      // force re-render for needle color
        maxValue={100}
        value={risk}
        segments={4}
        segmentColors={['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c']}
        needleColor={needleColor}
        startColor="#2ecc71"
        endColor="#e74c3c"
        needleTransition="easeElastic"
        needleTransitionDuration={1000}
        ringWidth={18}
        needleHeightRatio={0.7}
        textColor="#000"
        width={260}
        height={160}
      />

      {/* Centered label */}
      <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
        Kaspa Risk
      </div>
    </div>
  );
};

export default Speedometer;