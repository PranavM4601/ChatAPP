import React, { useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import EmojiPicker from "emoji-picker-react";

function Chat({ socket, username, room, messages = [], onSendMessage }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState(null);

  const sendMessage = () => {
    if (!currentMessage.trim() && !file) return;

    const messageData = {
      room,
      author: username,
      message: currentMessage,
      time:
        new Date().getHours().toString().padStart(2, "0") +
        ":" +
        new Date().getMinutes().toString().padStart(2, "0"),
      file: file ? URL.createObjectURL(file) : null,
      fileName: file ? file.name : null,
    };

    socket.emit("send_message", messageData);

    setCurrentMessage("");
    setFile(null);
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiData) => {
    setCurrentMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <div className="chat-background-wrapper">
      <div className="chat-window">
        <div className="chat-header">
          <p>
            Room: <span className="chat-room-name">{room}</span>
          </p>
        </div>

        <div className="chat-body">
          <ScrollToBottom className="message-container" followButton={true}>
            {messages.map((messageContent, index) => (
              <div
                key={index}
                className={`message ${
                  username === messageContent.author ? "you" : "other"
                }`}
              >
                <div className="message-content">
                  {messageContent.file && (
                    <div className="message-file">
                      <a
                        href={messageContent.file}
                        download={messageContent.fileName}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📎 {messageContent.fileName}
                      </a>
                    </div>
                  )}
                  {messageContent.message && <p>{messageContent.message}</p>}
                </div>
                <div className="message-meta">
                  <span className="message-time">{messageContent.time}</span>
                  <span className="message-author">{messageContent.author}</span>
                </div>
              </div>
            ))}
          </ScrollToBottom>
        </div>

        <div className="chat-footer">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
          {showEmojiPicker && <EmojiPicker onEmojiClick={onEmojiClick} />}
          <input
            type="text"
            value={currentMessage}
            placeholder="Type a message..."
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="chat-input"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*,application/pdf"
          />
          <button onClick={sendMessage} className="send-button">
            &#9658;
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
