import React from "react";
import styles from "./connectionStatus.module.css";

const ConnectionStatus = ({ isConnected }) => {
  return (
    <div className={styles.connection_div} style={{backgroundColor: isConnected ? "green" : "red"}}>
      {isConnected ? "Connected" : "Disconnected"}
    </div>
  );
};

export default ConnectionStatus;
