# Real-time-Editor

A full-stack collaborative application with a Next.js frontend and a Node.js backend, where users can create a room with multiple users that can share the same texteditor and directories.

## Features
- Login and registering for the owners of the rooms
- Role-based access control in the rooms(will be added soon. ready in the backend.)
- Creating multiple rooms
- Adding multiple users to the room
- Showing list of rooms and details of them
- Editing the rooms' setups
- Creating and feleteing multiple directories and files
- Saving the directories and files information in the database of the room
- Showing cursors(indicators) of al users while editing a file simultaneously
- Seperate login for joining the room
- Secure authentication using JWT and bcrypt this time for both room and main login

## Tech Stackc
- Next.js frontend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- dotenv
- cors
- socket.io

## Project Structure
mainFolder/
├── docs/
└── backend/

# Setup Instructions
- clone:
    `git clone origin https://github.com/amirmohammadabdi/real-time-canvas.git`
    `cd mainFolder`
- Frontend: 
    `cd collab`
    `npm install`
- Backend:
    `cd backend`
    `npm install`

# Environment Variables
- Create .env.local for the fonrtend. Create .env for the backend.
- .env.local contains:
    NEXT_PUBLIC_BACKEND=http://backend_url
- .env contains:
    MONGODB_URI=mongodb_url
    JWT_SECRET=long_jwt_secret_key
    EXPIRES_IN=jwt_expiration_time
    PORT=port_like_8000

# Running the Project
- Backend:
    `cd backend`
    `npm run start`
- Front:
    `cd docs`
    `npm run dev`

# Build for Production
- Frontend:
    `cd docs`
    `npm run build`
