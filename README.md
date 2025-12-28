# 🎥 Video Upload, Sensitivity Processing & Streaming Application

This is a full-stack MERN application built as part of a technical assignment.  
The application allows users to upload videos, process them for sensitivity status, and stream them securely with role-based access control.

---

## 🌐 Live Application (Frontend)

🔗 https://videouploadmern.netlify.app/

> ⚠️ Note:  
> The frontend is publicly deployed.  
> The backend is intended to run locally for security reasons (MongoDB credentials are not exposed).

---

## 🔐 Demo Login Credentials

### Editor Role
- **Email:** kiran@gmail.com  
- **Password:** kiran  

### Viewer Role
- **Email:** rahul@gmail.com  
- **Password:** rahul123  

---

## 📦 GitHub Repository

🔗 https://github.com/Saikiran5000/video-upload-mern.git

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (Video Uploads)
- Socket.io (Real-time Updates)
- HTTP Range Requests (Video Streaming)

### Frontend
- React (Vite)
- Fetch API
- CSS
- Role-based UI Rendering

---

## ✨ Features Implemented

### Core Features
- User registration & login
- JWT-based authentication
- Role-based access control (Admin / Editor / Viewer)
- Secure video upload with validation
- Video metadata stored in MongoDB
- Video streaming using HTTP Range headers
- Multi-tenant user isolation
- Delete videos (DB + file system cleanup)

### Real-Time
- Socket.io integration for live processing/status updates

### Security
- Protected API routes
- Password hashing (bcrypt)
- User-specific video access

---



