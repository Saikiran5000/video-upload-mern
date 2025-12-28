import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function Upload({ token }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    socket.on("video-progress", (data) => {
      setProgress(data.progress);
    });

    return () => socket.off("video-progress");
  }, []);

  const uploadVideo = async () => {
    const formData = new FormData();
    formData.append("video", file);

    await fetch("http://localhost:5000/api/videos/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    setMsg("Upload started...");
  };

  return (
    <div className="card">
      <h2>Upload Video</h2>

      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadVideo}>Upload</button>

      {msg && <p>{msg}</p>}

      {progress > 0 && (
        <p>Processing: {progress}%</p>
      )}
    </div>
  );
}

export default Upload;
