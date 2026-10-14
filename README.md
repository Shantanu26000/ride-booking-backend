# 🚖 Ride Booking Backend API

A secure RESTful ride-booking backend inspired by Uber, built with Node.js, Express.js, MongoDB Atlas, and a Python machine learning service for fare prediction.

## 🚀 Features

- User registration and login
- JWT-based authentication and protected routes
- Password hashing with bcrypt
- Passenger and driver ride workflows
- Ride creation, retrieval, updating, and deletion
- Driver availability management
- Ride acceptance and completion
- Distance calculation using the Haversine formula
- ML-based fare prediction using Linear Regression
- MongoDB Atlas integration
- Centralized error handling
- Security middleware using Helmet
- CORS support and request logging with Morgan
- Separate Node.js and Python services deployed on Render

## 🛠 Tech Stack

**Backend:** Node.js, Express.js, JavaScript  
**Database:** MongoDB Atlas, Mongoose  
**Authentication:** JWT, bcrypt  
**Machine Learning:** Python, Flask, scikit-learn, pandas, joblib  
**HTTP Client:** Axios  
**Deployment:** Render  
**API Testing:** Thunder Client

## 🌐 Live Deployment

- **Node.js API:** https://ride-booking-backend-shan.onrender.com
- **Python ML Service:** https://uber-fare-ml-ibbb.onrender.com

The Node.js backend calls the Python ML service to obtain fare predictions when creating rides.

## 🧠 ML-Based Fare Prediction

The backend calculates the distance between pickup and destination coordinates using the Haversine formula. It sends the distance to a Python Flask service, which uses a trained Linear Regression model to predict the fare.

### Prediction Flow

```text
Client
  ↓
Node.js / Express API
  ↓
Haversine Distance Calculation
  ↓
Python Flask ML Service
  ↓
Linear Regression Model
  ↓
Predicted Fare
  ↓
MongoDB
```

The ML service exposes a `POST /predict` endpoint and validates the supplied distance before making a prediction.

## 📂 Project Structure

```text
uber-backend/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── rideController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Ride.js
│   └── routes/
│       ├── authRoutes.js
│       └── rideRoutes.js
├── ml/
│   ├── fare_data.csv
│   ├── train_model.py
│   ├── fare_model.pkl
│   ├── ml_server.py
│   └── requirements.txt
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## 🔐 Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the authenticated user's profile |

Protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header.

## 🚗 Ride APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/rides` | Create a ride |
| GET | `/api/rides` | Retrieve rides |
| GET | `/api/rides/:id` | Retrieve a ride by ID |
| PUT | `/api/rides/:id` | Update a ride |
| DELETE | `/api/rides/:id` | Delete a ride |
| PUT | `/api/rides/:id/accept` | Accept a ride as a driver |
| PUT | `/api/rides/driver/availability` | Update driver availability |
| GET | `/api/rides/available` | Retrieve available rides |
| GET | `/api/rides/driver/my-rides` | Retrieve the driver's rides |

## ⚙️ Local Installation

### 1. Clone the repository

```bash
git clone https://github.com/Shantanu26000/ride-booking-backend.git
cd ride-booking-backend
```

### 2. Install Node.js dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET
ML_SERVICE_URL=http://127.0.0.1:5001
```

Replace the placeholders with your own values. Never commit `.env` or expose credentials in screenshots.

### 4. Start the Node.js backend

```bash
npm run dev
```

### 5. Start the Python ML service

Open a separate terminal:

```bash
cd ml
pip install -r requirements.txt
python ml_server.py
```

The ML service runs locally on port `5001`.

## 🧪 Testing

API endpoints can be tested using Thunder Client. Authentication requests should be tested first so that the returned JWT can be used for protected endpoints.

The deployed backend has been tested for authentication, profile retrieval, ride retrieval, ride creation with ML-based fare prediction, driver availability, ride acceptance, and ride completion.

## 🔒 Security

- Passwords are hashed using bcrypt.
- JWT authentication protects restricted routes.
- Database credentials and JWT secrets are stored in environment variables.
- `.env` should remain excluded from Git.

## 👨‍💻 Author

**Shantanu Billaiya**

GitHub: https://github.com/Shantanu26000