import React, { useState } from "react";

function Sidebar({ username, room, joinedRooms, onJoinRoom, unread, usersInRoom }) {
  const [newRoom, setNewRoom] = useState("");

  const handleJoin = () => {
    if (newRoom.trim()) {
      onJoinRoom(newRoom.trim());
      setNewRoom("");
    }
  };

  return (
    <div className="sidebar">
      <h2>ChatBox</h2>
      <p className="sidebar-username">Welcome, <strong>{username}</strong></p>
      <p className="sidebar-current-room">
        Current Room: <strong>{room || "None"}</strong>
      </p>

      <div className="join-room-form">
        <input
          type="text"
          placeholder="Join another Room"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          className="join-room-input"
        />
        <button onClick={handleJoin} className="join-room-button">Join</button>
      </div>
      

      <div className="active-rooms">
        <h4>Joined Rooms</h4>
        <ul className="rooms-list">
          {joinedRooms.length === 0 && (
            <li className="no-rooms">You haven't joined any rooms yet</li>
          )}
          {joinedRooms.map((r, index) => (
            <li key={index}>
              <button
                onClick={() => onJoinRoom(r)}
                className={`room-button ${r === room ? "active-room" : ""}`}
              >
                <span className="room-name">{r}</span>
                {unread[r] && r !== room && (
                  <span className="unread-indicator" title="New messages">●</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {room && Array.isArray(usersInRoom) && usersInRoom.length > 0 && (
        <div className="room-users">
          <h4>Users in this room</h4>
          <ul className="users-list">
            {usersInRoom.map((user, index) => (
              <li key={index} className="user-entry">{user}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
