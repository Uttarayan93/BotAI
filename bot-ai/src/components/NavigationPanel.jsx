import React from "react";
import { Link } from "react-router-dom";
import botImage from "../assets/bot.png";
import pencilImage from "../assets/pencil.png";

const NavigationPanel = () => {
  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      {/* Row: Bot icon + "New Chat" + Pencil icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "10px",
        }}
      >
        <img
          src={botImage}
          alt="bot"
          style={{ width: "40px", height: "40px" }}
        />
        <h2 style={{ margin: 0 }}>New Chat</h2>
        <Link to="/">
          <img
            src={pencilImage}
            alt="pencil"
            style={{
              width: "24px",
              height: "24px",
              cursor: "pointer",
            }}
          />
        </Link>
      </div>

      {/* Past Conversations */}
      <Link to="/past" style={{ textDecoration: "none" }}>
        <div
          style={{
            display: "inline-block",
            backgroundColor: "#E6DBFA",
            color: "#000",
            borderRadius: "20px",
            padding: "10px 20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontWeight: "bold",
            marginTop: "10px",
            border: "1px solid #ccc",
          }}
        >
          Past Conversations
        </div>
      </Link>
    </div>
  );
};

export default NavigationPanel;
