# Lost & Found Platform

Production-style MERN app for posting lost and found items, chatting with owners in real time, uploading images through Cloudinary, and suggesting likely matches with free AI-powered image similarity.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express + Socket.io
- Database: MongoDB Atlas
- Auth: JWT
- Images: Cloudinary
- AI matching: TensorFlow.js + MobileNet embeddings

## Project Structure

```text
frontend/
backend/
```

## Local Setup

### 1. Create environment files

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

### 2. Configure services

- MongoDB Atlas: create a free cluster and whitelist your IP
- Cloudinary: create a free account and copy cloud name, API key, and secret

### 3. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 4. Run locally

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.
Live LInk :->  https://lostfound-harish.vercel.app/

## Deployment

## Features

- Email/password registration and login
- JWT protected routes
- Create, edit, delete, and resolve items
- Cloudinary image uploads
- Search and filters by category, location, keyword, and status
- One-to-one real-time chat with Socket.io
- Profile management and user posts
- AI-assisted visual match suggestions between lost and found items
- Loading skeletons, toast notifications, responsive UI, and dark mode

## API Documentation

See `API_DOCS.md`
