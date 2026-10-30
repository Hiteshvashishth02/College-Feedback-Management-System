# College Feedback Management System

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows students to search universities/colleges and provide honest feedback, while admins manage users and reviews.

## Features

- **Student Features:**
  - User registration and login
  - Search universities/colleges
  - View college details and ratings
  - Submit reviews with ratings, comments, pros/cons
  - View submitted reviews

- **Admin Features:**
  - Admin authentication
  - Manage users
  - Delete inappropriate reviews
  - Content management

- **Technical Features:**
  - JWT authentication
  - Role-based access control
  - Responsive design
  - Modern UI with Tailwind CSS
  - RESTful APIs
  - MongoDB database

## Project Structure

```
college-feedback-system/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```
MONGODB_URI=mongodb://localhost:27017/college-feedback
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## Vercel Deployment

The root `vercel.json` configures separate `backend` (Express) and `frontend` (Create React App) services. Requests under `/api/*` are routed to the backend; all other paths are routed to the frontend. The frontend uses same-origin `/api` requests, so it does not need a backend URL at build time.

Set `MONGODB_URI` and `JWT_SECRET` for the backend service in Vercel's environment settings. No service binding is configured because the frontend calls the backend through its public `/api` route and the backend does not call another service.

## Technologies Used

- **Frontend:** React.js, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, JWT
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens
  