import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import io from "socket.io-client";
import Login from "./components/Login";
import RoomJoin from "./components/RoomJoin";
import Sidebar from "./components/Sidebar";
import Chat from "./components/Chat";

const socket = io("http://localhost:3001", {
  autoConnect: false, // don't connect until login
});


function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [stage, setStage] = useState("login");
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [messages, setMessages] = useState({}); // { room1: [...], room2: [...] }
  const [unread, setUnread] = useState({});     // { room1: true/false }
  
  const handleLogin = () => {
  if (username.trim() !== "") {
    socket.io.opts.query = { username };
    socket.connect();
    setStage("room");
  }
};


  const joinRoom = (newRoom) => {
    if (!newRoom.trim()) return;

    if (!joinedRooms.includes(newRoom)) {
      socket.emit("join_room", newRoom);
      setJoinedRooms((prev) => [...prev, newRoom]);
    }

    setRoom(newRoom);
    setUnread((prev) => ({ ...prev, [newRoom]: false }));
    setStage("chat");
  };

  const handleSendMessage = (messageData) => {
    setMessages((prev) => {
      const roomMessages = prev[messageData.room] || [];
      return {
        ...prev,
        [messageData.room]: [...roomMessages, messageData],
      };
    });
  };

  const handleReceiveMessage = useCallback((data) => {
    const { room: msgRoom } = data;

    setMessages((prev) => {
      const roomMsgs = prev[msgRoom] || [];
      return {
        ...prev,
        [msgRoom]: [...roomMsgs, data],
      };
    });

    // Mark unread if message came for room not currently active
    if (msgRoom !== room) {
      setUnread((prev) => ({ ...prev, [msgRoom]: true }));
    }
  }, [room]);

  useEffect(() => {
    socket.on("receive_message", handleReceiveMessage);
    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [handleReceiveMessage]);

  return (
    <div className="App">
      {stage === "login" && (
        <Login setUsername={setUsername} next={handleLogin} />
      )}
      {stage === "room" && (
        <RoomJoin
          username={username}
          setRoom={setRoom}
          next={() => joinRoom(room)}
        />
      )}
      {stage === "chat" && (
        <div className="chat-layout">
          <Sidebar
            username={username}
            room={room}
            joinedRooms={joinedRooms}
            onJoinRoom={joinRoom}
            unread={unread}
          />
          <div className="chat-section">
            <Chat
              socket={socket}
              username={username}
              room={room}
              messages={messages[room] || []}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
