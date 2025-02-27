# Zidio Task Management

A simple task management web application built using the MERN stack (MongoDB, Express.js, React, Node.js) with role-based authentication.

## Features
- **Admin**:
  - Create, assign, update, and delete tasks.
  - View all tasks.
  - Manage users.
  
- **User**:
  - View assigned tasks.
  - Mark tasks as completed.

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB


## Installation

### Prerequisites
- Node.js & npm installed
- MongoDB running locally or a cloud instance

### Setup Backend
```bash
cd bserver
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

#### Start Backend Server
```bash
npm start
```

### Setup Frontend
```bash
cd client
npm install
npm start
```

## API Routes
### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get a JWT token

### Users
- `GET /api/users` - Fetch all users (only visible to admin)

### Tasks
- `POST /api/tasks` - Create a new task (admin only)
- `GET /api/tasks` - Fetch all tasks (admin only)
- `GET /api/tasks/:userId` - Fetch tasks assigned to a specific user
- `PUT /api/tasks/:id` - Update task details
- `DELETE /api/tasks/:id` - Delete a task (admin only)

## Usage
1. Register as an admin or user.
2. Admin assigns tasks to users.
3. Users can complete their assigned tasks.
4. Admins can manage tasks and users.

