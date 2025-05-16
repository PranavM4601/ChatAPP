import React, { useState } from "react";

function RoomJoin({ username, setRoom, next }) {
  const [inputRoom, setInputRoom] = useState("");

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = () => {
    const newRoomCode = generateRoomCode();
    setRoom(newRoomCode);
    next();
  };

  const joinExistingRoom = () => {
    if (inputRoom.trim() !== "") {
      setRoom(inputRoom.trim().toUpperCase());
      next();
    }
  };

  return (
    <div className="auth-background">
      <div className="card-container">
        <h2>Hi {username}!</h2>
        <input
          type="text"
          placeholder="Enter Room Code"
          onChange={(e) => setInputRoom(e.target.value)}
          value={inputRoom}
        />
        <button onClick={joinExistingRoom}>Join Room</button>
        <div style={{ marginTop: "10px" }}>
          <button onClick={createRoom}>Create New Room</button>
        </div>
      </div>
    </div>
  );
}

export default RoomJoin;
