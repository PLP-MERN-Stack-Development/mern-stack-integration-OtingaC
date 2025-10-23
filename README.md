# MERN Blog Application
## Project Overview
A full-stack blog application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). Users can create, read, update, and delete blog posts, register accounts, and authenticate securely.

## Setup Instructions
### Prerequisites
- Node.js
- MongoDB
- npm or yarn

### Installation Steps
1. Clone the repository
```bash
git clone <repository-url>
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Set up environment variables
Create `.env` file in backend directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

5. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm start
```

## API Documentation
### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### Blog Post Endpoints
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get single post
- POST `/api/posts` - Create new post
- PUT `/api/posts/:id` - Update post
- DELETE `/api/posts/:id` - Delete post

## Features Implemented
- User authentication and authorization
- CRUD operations for blog posts
- Responsive design
- Form validation
- Protected routes
- JWT authentication
- Image upload functionality
- Rich text editor

## Screenshots
### Homepage
screenshots/homepage.png

### Post Creation
screenshots/create-post.png

### Authentication
screenshots/login.png