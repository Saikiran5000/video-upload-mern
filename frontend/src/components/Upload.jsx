import { useState } from "react";

function Upload({ token }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");

  const uploadVideo = async () => {
    if (!file) {
      setMsg("Please select a video file");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      // 🔐 Role-based access handling
      if (res.status === 403) {
        setMsg("You don’t have access to upload videos");
        return;
      }

      if (!res.ok) {
        setMsg(data.message || "Upload failed");
        return;
      }

      setMsg("Video uploaded successfully");
      setFile(null);
    } catch (error) {
      setMsg("You don’t have access to upload videos");
    }
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

      {msg && (
        <p className={msg.includes("access") ? "error-text" : "success-text"}>
          {msg}
        </p>
      )}
    </div>
  );
}

export default Upload;
