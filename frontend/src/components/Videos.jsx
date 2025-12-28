import { useEffect, useState } from "react";

function Videos({ token }) {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    fetch("http://localhost:5000/api/videos/my-videos", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setVideos(data));
  };

  const deleteVideo = async (id) => {
    await fetch(`http://localhost:5000/api/videos/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 🔥 Update UI instantly
    setVideos(videos.filter(v => v._id !== id));
  };

  return (
    <div className="card">
      <h2>My Videos</h2>

      {videos.length === 0 && <p>No videos uploaded yet</p>}

      {videos.map(v => (
        <div key={v._id} className="video-box">
          <video width="100%" controls>
            <source
              src={`http://localhost:5000/uploads/${v.filename}`}
              type="video/mp4"
            />
          </video>

          <button
            className="delete-btn"
            onClick={() => deleteVideo(v._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Videos;
