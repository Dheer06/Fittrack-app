# Fitness Tracker (React + Node + MongoDB)
Author: Dheer Desai

This project is a starter full-stack fitness tracker:
- Frontend: React (simple create-react-app-like structure)
- Backend: Node.js + Express + MongoDB (Mongoose)
- Auth: JWT (login/register)
- Activities are tracked in minutes and displayed in the dashboard.

## Quickstart (local)
1. Clone or unzip this repo.
2. Setup MongoDB Atlas or local MongoDB and get the connection string.

## Server (backend)
cd server
cp .env.example .env
# edit .env and set MONGO_URI and JWT_SECRET
npm install
npm start

## Client (frontend)
cd client
npm install
npm start

The frontend expects the backend to run on http://localhost:5000 by default.

## Notes
- Do **not** commit `.env` or `node_modules`.
- This is a starter scaffold — expand UI, add validation, and secure production configs before public hosting.
