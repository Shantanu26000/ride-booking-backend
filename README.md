# 🚖 Ride Booking Backend API

A secure RESTful backend inspired by Uber that supports authentication and ride management.

---

## 🚀 Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Ride Booking
- Ride CRUD Operations
- Password Hashing using bcrypt
- MongoDB Atlas Integration
- MVC Architecture
- Error Handling
- Helmet Security
- CORS Support
- Morgan Logging

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Express Middleware
- REST APIs
- Postman
- Render

---

## 📂 Project Structure

```
src
│
├── config
│   └── db.js
│
├── controllers
│   ├── authController.js
│   └── rideController.js
│
├── middleware
│   └── authMiddleware.js
│
├── models
│   ├── User.js
│   └── Ride.js
│
├── routes
│   ├── authRoutes.js
│   └── rideRoutes.js
│
server.js
```

---

## Authentication APIs

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

---

## Ride APIs

POST /api/rides

GET /api/rides

GET /api/rides/:id

PUT /api/rides/:id

DELETE /api/rides/:id

---

## Installation

```
npm install
```

Run

```
npm run dev
```

---

## Environment Variables

```
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET
```
