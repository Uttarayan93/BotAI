import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationPanel from "../components/NavigationPanel";
import botImage from "../assets/bot.png";
import userImage from "../assets/user.png";
import { questions } from "../sampleData.jsx";
import { FaThumbsUp, FaThumbsDown, FaStar } from "react-icons/fa";

function PromptCard({ title, subtitle }) {
  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "20px",
      }}
    >
      <h3 style={{ margin: "0 0 10px" }}>{title}</h3>
      <p style={{ margin: 0, color: "#666" }}>{subtitle}</p>
    </div>
  );
}

function StarRating({ currentRating, onRate }) {
  const [hover, setHover] = useState(0);

  return (
    <div
      style={{
        display: "flex",
        gap: "5px",
        alignItems: "center",
        marginTop: "5px",
      }}
    >
      {[1, 2, 3, 4, 5].map((starValue) => (
        <FaStar
          key={starValue}
          size={18}
          style={{ cursor: "pointer" }}
          color={starValue <= (hover || currentRating) ? "gold" : "#ccc"}
          onMouseEnter={() => setHover(starValue)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onRate(starValue)}
        />
      ))}
    </div>
  );
}

function FeedbackModal({ isOpen, onClose, onSubmit }) {
  const [feedbackText, setFeedbackText] = useState("");

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "#E6DBFA",
          borderRadius: "8px",
          padding: "20px",
          minWidth: "400px",
          maxWidth: "80%",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {/* Close icon */}
        <span
          style={{
            position: "absolute",
            top: "10px",
            right: "20px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "18px",
          }}
          onClick={onClose}
        >
          ✕
        </span>

        <h2 style={{ marginTop: 0 }}>Provide Additional Feedback</h2>
        <textarea
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            resize: "vertical",
          }}
          placeholder="Type your feedback here..."
        />
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          <button
            onClick={() => {
              onSubmit(feedbackText);
              setFeedbackText("");
            }}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              backgroundColor: "#CBB8E8",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  index,
  sender,
  text,
  time,
  rating,
  feedback,
  onLikeClick,
  onDislikeClick,
  onRate,
}) {
  const avatar = sender === "user" ? userImage : botImage;
  const bubbleColor = sender === "user" ? "#EAD6FF" : "#E6DBFA";
  const senderName = sender === "user" ? "You" : "Soul AI";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        maxWidth: "60%",
        alignSelf: "flex-start",
      }}
    >
      <img
        src={avatar}
        alt={sender}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
        }}
      />

      <div
        style={{
          backgroundColor: bubbleColor,
          borderRadius: "10px",
          padding: "10px",
          minWidth: "100px",
          flex: "none",
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
          {senderName}
        </div>
        <div style={{ marginBottom: "5px" }}>{text}</div>
        <div style={{ fontSize: "12px", color: "#777", textAlign: "right" }}>
          {time}
        </div>

        {sender === "ai" && (
          <div style={{ marginTop: "8px" }}>
            {/* Like & Dislike Buttons */}
            <span
              onClick={() => onLikeClick(index)}
              style={{
                marginRight: "20px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <FaThumbsUp color="#6F42C1" />
            </span>
            <span
              onClick={() => onDislikeClick(index)}
              style={{
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              <FaThumbsDown color="#6F42C1" />
            </span>

            {rating > 0 && (
              <StarRating
                currentRating={rating}
                onRate={(newRating) => onRate(index, newRating)}
              />
            )}

            {feedback && (
              <div style={{ marginTop: "5px", fontStyle: "italic" }}>
                Feedback: {feedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackTargetIndex, setFeedbackTargetIndex] = useState(null);

  const navigate = useNavigate();

  const getAIResponse = (userText) => {
    const lowerInput = userText.toLowerCase();
    const found = questions.find((q) =>
      q.question.toLowerCase().includes(lowerInput)
    );
    if (found) return found.response;
    return "I'm not sure I have an answer for that, but I'm learning!";
  };

  const handleAsk = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      sender: "user",
      text: inputValue.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      rating: 0,
      feedback: "",
    };

    const aiReplyText = getAIResponse(inputValue);
    const newAIMessage = {
      sender: "ai",
      text: aiReplyText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      rating: 0,
      feedback: "",
    };

    setMessages((prev) => [...prev, newUserMessage, newAIMessage]);
    setInputValue("");
  };

  // Called when user clicks "thumbs up"
  const handleLikeClick = (msgIndex) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, rating: m.rating || 5 } : m))
    );
  };

  // Called when user actually clicks a star
  const handleStarRate = (msgIndex, newRating) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === msgIndex ? { ...m, rating: newRating } : m))
    );
  };

  // Called when user clicks "thumbs down"
  const handleDislikeClick = (msgIndex) => {
    setFeedbackTargetIndex(msgIndex);
    setIsFeedbackOpen(true);
  };

  // Called when user submits feedback in the modal
  const handleSubmitFeedback = (text) => {
    if (feedbackTargetIndex === null) return;
    setMessages((prev) =>
      prev.map((m, i) =>
        i === feedbackTargetIndex ? { ...m, feedback: text } : m
      )
    );
    setIsFeedbackOpen(false);
    setFeedbackTargetIndex(null);
  };

  const handleSave = () => {
    const stored = localStorage.getItem("pastConversations");
    const pastConversations = stored ? JSON.parse(stored) : [];

    const newConversation = {
      id: Date.now(), // unique ID
      timestamp: new Date().toLocaleString(),
      messages: messages,
    };

    pastConversations.push(newConversation);

    localStorage.setItem(
      "pastConversations",
      JSON.stringify(pastConversations)
    );

    navigate("/past");
  };

  return (
    <>
      {/* Inline CSS reset */}
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
        `}
      </style>

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleSubmitFeedback}
      />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#F7F1FF", // Light purple
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
        <div
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            padding: "30px 20px",
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: "36px", color: "#3C2A4D" }}>
              Bot AI
            </h1>
            <h2 style={{ margin: "10px 0", color: "#000" }}>
              How Can I Help You Today?
            </h2>
          </div>

          {/* Prompt Cards */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              marginTop: "20px",
              width: "100%",
              justifyContent: "flex-start",
              maxWidth: "1200px",
            }}
          >
            <PromptCard
              title="Hi, what is the weather"
              subtitle="Get immediate AI generated response"
            />
            <PromptCard
              title="Hi, what is my location"
              subtitle="Get immediate AI generated response"
            />
            <PromptCard
              title="Hi, what is the temperature"
              subtitle="Get immediate AI generated response"
            />
            <PromptCard
              title="Hi, how are you"
              subtitle="Get immediate AI generated response"
            />
          </div>

          {/* Chat Container */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              overflowY: "auto",
              padding: "20px",
              backgroundColor: "#EFE3FF",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            {messages.map((msg, index) => (
              <ChatBubble
                key={index}
                index={index}
                sender={msg.sender}
                text={msg.text}
                time={msg.time}
                rating={msg.rating}
                feedback={msg.feedback}
                onLikeClick={handleLikeClick}
                onDislikeClick={handleDislikeClick}
                onRate={handleStarRate}
              />
            ))}
          </div>

          {/* Input Row */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAsk();
              }}
              style={{
                flexGrow: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={handleAsk}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                backgroundColor: "#CBB8E8",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Ask
            </button>

            <button
              onClick={handleSave}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                backgroundColor: "#CBB8E8",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
