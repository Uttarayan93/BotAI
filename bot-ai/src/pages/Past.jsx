import React, { useEffect, useState } from "react";
import NavigationPanel from "../components/NavigationPanel";

export default function Past() {
  const [pastConversations, setPastConversations] = useState([]);
  const [filterRating, setFilterRating] = useState(""); // star filter e.g. "3" or ""

  useEffect(() => {
    const stored = localStorage.getItem("pastConversations");
    if (stored) {
      setPastConversations(JSON.parse(stored));
    }
  }, []);

  function conversationMatchesRating(convo) {
    if (!filterRating) return true; // no filter
    const ratingNum = parseInt(filterRating, 10);

    return convo.messages.some(
      (m) => m.sender === "ai" && m.rating === ratingNum
    );
  }

  const filteredConversations = pastConversations.filter(
    conversationMatchesRating
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F7F1FF",
      }}
    >
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#E6DBFA",
          borderRight: "1px solid #ccc",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "20px",
        }}
      >
        <NavigationPanel />
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flexGrow: 1, padding: "30px 20px" }}>
        <h1 style={{ textAlign: "center" }}>Conversation History</h1>

        {/* The star rating dropdown filter */}
        <div style={{ marginBottom: "20px" }}>
          <label>
            Filter by rating:{" "}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              style={{ padding: "5px" }}
            >
              <option value="">All Ratings</option>
              <option value="1">1 stars</option>
              <option value="2">2 stars</option>
              <option value="3">3 stars</option>
              <option value="4">4 stars</option>
              <option value="5">5 stars</option>
            </select>
          </label>
        </div>

        {filteredConversations.length === 0 ? (
          <p>No saved conversations yet (or none match your filter).</p>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {filteredConversations.map((convo) => (
              <ConversationTile key={convo.id} conversation={convo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationTile({ conversation }) {
  return (
    <div
      style={{
        backgroundColor: "#D8C9F3",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Saved on {conversation.timestamp}</h3>

      {conversation.messages.map((m, index) => {
        const bgColor = m.sender === "user" ? "#EAD6FF" : "#E6DBFA";
        const senderName = m.sender === "user" ? "You" : "Soul AI";
        return (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              backgroundColor: bgColor,
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <strong>{senderName}</strong> <br />
            {m.text} <br />
            <span style={{ fontSize: "12px", color: "#777" }}>{m.time}</span>
            {/* If AI message has rating */}
            {m.sender === "ai" && m.rating > 0 && (
              <div>
                Rating: {"★".repeat(m.rating) + "☆".repeat(5 - m.rating)}
              </div>
            )}
            {/* If AI message has feedback */}
            {m.sender === "ai" && m.feedback && (
              <div style={{ fontStyle: "italic" }}>Feedback: {m.feedback}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
