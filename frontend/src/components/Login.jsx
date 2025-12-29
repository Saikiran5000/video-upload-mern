import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const loginUser = async () => {
    // basic validation
    if (!email || !password) {
      setMsg("Please enter email and password");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Invalid email or password");
        return;
      }

      if (data.token) {
        setMsg("");
        onLogin(data.token);
      }
    } catch (error) {
      setMsg("Invalid email or password");
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={loginUser}>Login</button>

      {msg && <p className="error-text">{msg}</p>}
    </div>
  );
}

export default Login;
