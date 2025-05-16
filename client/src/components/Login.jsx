import React, { useState } from "react";

function Login({ setUsername, next }) {
  const [inputName, setInputName] = useState("");

  const handleLogin = () => {
    if (inputName.trim() !== "") {
      setUsername(inputName.trim());
      next();
    }
  };

  return (
    <div className="auth-background">
      <div className="card-container">
        <h2>Welcome to Realtime Chat App</h2>
        <p>Login</p>
        <input
          type="text"
          placeholder="Enter your username"
          onChange={(e) => setInputName(e.target.value)}
        />
        <button onClick={handleLogin}>Continue</button>
      </div>
    </div>
  );
}

export default Login;
