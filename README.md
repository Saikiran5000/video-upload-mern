# Video Upload, Sensitivity Processing & Streaming App

## Tech Stack
- Backend: Node.js, Express, MongoDB, Socket.io
- Frontend: React, Vite
- Auth: JWT
- Upload: Multer
- Streaming: HTTP Range Requests

## Features
- User registration & login
- Role-based access (viewer/editor/admin)
- Video upload with validation
- Real-time processing updates (Socket.io)
- Video streaming with range support
- User-isolated video library

## Setup Instructions

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend
npm install
npm run dev

## Notes
- Sensitivity analysis is simulated (safe / flagged)
- Local file storage used
