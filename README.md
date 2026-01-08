# Leave Management System

A full-stack employee leave management application built with the MERN stack (React, Node.js, Express) and SQLite. This system allows employees to request leaves and administrators to manage and approve/reject them.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Admin Credentials](#admin-credentials)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## 🔭 Project Overview

This Leave Management System simplifies the process of tracking employee time off. It features role-based access control with distinct portals for employees and administrators.

- **Employees** can register, log in, submit leave requests, and track the status of their applications.
- **Administrators** can view all leave requests, filter them by status, and take action (approve/reject) with optional comments.

## 🛠 Tech Stack

### Backend

- **Node.js** & **Express.js**: RESTful API server.
- **SQLite3**: Lightweight relational database.
- **Bcrypt**: Password hashing for security.
- **Express-Session**: Session-based authentication.

### Frontend

- **React 19**: UI library for building the client interface.
- **Vite**: Next-generation frontend tooling.
- **CSS3**: Custom styling for a responsive design.

## ✨ Features

- **User Authentication**: Secure login/signup for employees and dedicated admin login.
- **Dashboard**:
  - Employee: View personal leave history and status.
  - Admin: Overview of all leave requests from all employees.
- **Leave Management**:
  - Apply for leave (Sick, Casual, Paid, etc.).
  - Edit or delete pending leave requests.
  - Admin approval/rejection workflow.
- **Security**: Protected routes ensuring unauthorized users cannot access restricted pages.

## ⚙ Prerequisites

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

## 🚀 Installation & Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd leave-management-system
   ```

2. **Backend Setup:**

   ```bash
   # Install backend dependencies
   npm install

   # Start the backend server (runs on port 3000)
   node server.js
   ```

3. **Frontend Setup:**
   Open a new terminal window in the project root:

   ```bash
   # Navigate to client directory
   cd client

   # Install frontend dependencies
   npm install

   # Start the development server (runs on port 5173 by default)
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and visit `http://localhost:5173`.

## 🔑 Admin Credentials

Upon the first run, the database is automatically seeded with a default administrator account.

- **Email**: `admin@company.com`
- **Password**: `adminpassword123`

## 📡 API Documentation

### Authentication (`/api/auth`)

- `POST /signup`: Register a new employee.
- `POST /login`: Authenticate user (employee/admin).
- `POST /logout`: Destroy session.
- `GET /me`: Get current authenticated user details.

### Leaves (`/api/leaves`) - _Protected_

- `POST /`: Submit a new leave request.
- `GET /my-leaves`: Get all leaves for the logged-in user.
- `GET /:id`: Get specific leave details.
- `PUT /:id`: Update a pending leave request.
- `DELETE /:id`: Cancel a pending leave request.

### Admin (`/api/admin`) - _Admin Only_

- `GET /leaves`: Retrieve all leave requests with employee details.
- `PUT /leaves/:id`: Approve or reject a leave request.

## 📂 Project Structure

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components (ProtectedRoute)
│   │   ├── context/        # Global state (AuthContext)
│   │   ├── pages/          # Application views (Dashboard, Login, etc.)
│   │   └── utils/          # Helper functions (API client)
│   └── vite.config.js      # Vite configuration
├── middleware/             # Express middleware (Auth checks)
├── routes/                 # API route definitions
├── database.sqlite         # SQLite database file
├── db.js                   # Database connection and initialization
└── server.js               # Entry point for backend server
```
