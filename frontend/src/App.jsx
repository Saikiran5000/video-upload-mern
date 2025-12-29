import { useState } from "react";
import Login from "./components/Login";
import Upload from "./components/Upload";
import Videos from "./components/Videos";
import "./App.css";
import { getRoleFromToken } from "./utils/decodeToken";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <div className="container">
      <h1 className="title">🎥 Video Upload App</h1>

      {!token ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          {/* 🔴 LOGOUT BUTTON */}
          <div className="top-bar">
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>

          <Upload token={token} />
          <Videos token={token} />
        </>
      )}
    </div>
  );
}

export default App;
