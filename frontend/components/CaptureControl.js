import React from "react";
import axios from "axios";

const CaptureControl = () => {
  const startCapture = () => {
    axios
      .get("http://127.0.0.1:5000/api/start")
      .then((response) => alert(response.data))
      .catch((error) => console.error("Error starting capture:", error));
  };

  const stopCapture = () => {
    axios
      .get("http://127.0.0.1:5000/api/stop")
      .then((response) => alert(response.data))
      .catch((error) => console.error("Error stopping capture:", error));
  };

  return (
    <div>
      <button onClick={startCapture}>Start Capture</button>
      <button onClick={stopCapture}>Stop Capture</button>
    </div>
  );
};

export default CaptureControl;
