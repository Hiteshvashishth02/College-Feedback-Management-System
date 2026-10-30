# College Feedback Management System - Setup Guide

## Overview

A full-stack web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows students to search universities/colleges and provide honest feedback, while admins manage users and reviews.

## Features

### Student Features
- User registration and login
- Search universities/colleges with filters
- View college details and ratings
- Submit reviews with ratings, comments, pros/cons
- View submitted reviews
- Profile management

### Admin Features
- Admin authentication
- User management (activate/deactivate)
- Review management (approve/reject)
- Dashboard with statistics
- Content moderation

### Technical Features
- JWT authentication
- Role-based access control (Admin vs Student)
- Responsive design for mobile and desktop
- Modern UI with Tailwind CSS
- RESTful APIs
- Real-time search functionality
- Error handling and validation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "College managment system"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
```

#### Environment Variables (.env)

```env
MONGODB_URI=mongodb://localhost:27017/college-feedback
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system. You can install MongoDB locally or use MongoDB Atlas.

#### Local MongoDB Installation

```bash
# On macOS
brew install mongodb-community

# On Ubuntu
sudo apt-get install mongodb

# On Windows
# Download and install from https://www.mongodb.com/try/download/community
```

#### Start MongoDB

```bash
# On macOS/Linux
sudo systemctl start mongod

# On Windows
net start MongoDB

# Or run directly
mongod
```

### 4. Seed the Database

```bash
cd backend
node scripts/seedDatabase.js
```

This will create sample colleges, users, and reviews for testing.

**Default Login Credentials:**
- Students: Use any email from `sampleStudents` in the seed script with password `password123`
- Admin: `admin@collegehub.com` with password `admin123`

### 5. Start the Backend Server

```bash
cd backend

# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### 6. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
college-feedback-system/
|
|-- backend/
|   |-- controllers/          # Route controllers
|   |-- models/              # MongoDB models
|   |-- routes/              # API routes
|   |-- middleware/          # Custom middleware
|   |-- config/              # Configuration files
|   |-- utils/               # Utility functions
|   |-- scripts/             # Database scripts
|   |-- server.js            # Main server file
|   |-- package.json
|   |-- .env.example
|
|-- frontend/
|   |-- public/              # Static files
|   |-- src/
|   |   |-- components/       # Reusable components
|   |   |-- pages/           # Page components
|   |   |-- context/         # React context
|   |   |-- services/        # API services
|   |   |-- utils/           # Utility functions
|   |   |-- hooks/           # Custom hooks
|   |   |-- App.js           # Main App component
|   |   |-- index.js         # Entry point
|   |-- package.json
|   |-- tailwind.config.js
|
|-- README.md
|-- SETUP.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Colleges
- `GET /api/colleges` - Get all colleges (with search/filter)
- `GET /api/colleges/:id` - Get single college
- `GET /api/colleges/:id/reviews` - Get college reviews
- `POST /api/colleges` - Create college (Admin only)
- `PUT /api/colleges/:id` - Update college (Admin only)
- `DELETE /api/colleges/:id` - Delete college (Admin only)

### Reviews
- `GET /api/reviews` - Get all reviews (Admin only)
- `GET /api/reviews/:id` - Get single review
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PUT /api/reviews/:id/approve` - Approve/reject review (Admin only)
- `GET /api/reviews/user/me` - Get user's reviews

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get single user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/toggle-status` - Activate/deactivate user

## Usage

### For Students

1. **Register/Login**: Create an account or sign in
2. **Browse Colleges**: Use the search bar to find colleges
3. **View Details**: Click on a college to see detailed information and reviews
4. **Write Reviews**: Share your experience by writing a review
5. **Manage Profile**: Update your personal information and password

### For Admins

1. **Admin Login**: Use the admin login page
2. **Dashboard**: View statistics and recent activity
3. **User Management**: Activate/deactivate user accounts
4. **Review Management**: Approve or reject reviews
5. **Content Moderation**: Ensure quality of content

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

```bash
# Frontend build
cd frontend
npm run build

# Backend production setup
cd backend
npm start
```

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret
PORT=5000
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in .env file
   - Verify MongoDB is accessible from your application

2. **Port Already in Use**
   - Change the PORT in .env file
   - Kill the process using the port: `lsof -ti:5000 | xargs kill`

3. **CORS Issues**
   - Ensure frontend URL is added to CORS origins in backend
   - Check if proxy is correctly configured in frontend package.json

4. **Authentication Issues**
   - Verify JWT_SECRET is set in .env
   - Check token expiration time
   - Ensure cookies are being sent with requests

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
