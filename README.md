
# FastPay - MERN Stack Payment Application

FastPay is a digital payment web application built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

This project consists of two main parts:
- Frontend: React application with TypeScript, built with Vite
- Backend: Express.js server connected to MongoDB

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas account
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the backend directory with the following content:
```
MONGODB_URI=mongodb://localhost:27017/fastpay
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
```
Note: If using MongoDB Atlas, replace the MONGODB_URI with your connection string.

4. Start the backend server:
```
npm run dev
```
The server should start on port 5000.

### Frontend Setup

1. Open a new terminal window/tab and navigate to the project root.

2. Install dependencies:
```
npm install
```

3. Start the frontend development server:
```
npm run dev
```
The frontend should start on port 5173 (or another port if 5173 is in use).

4. Open your browser and visit: `http://localhost:5173`

## Testing the Application

### Create a New Account

1. Click on the "Signup" button
2. Fill in all required fields:
   - Name
   - Email (must be a valid format)
   - Password (minimum 8 characters, including a number and special character)
   - Confirm Password (must match Password)
3. Submit the form
4. You will be redirected to the Login page

### Login

1. Enter your email and password
2. Click "Login"
3. You will be redirected to the Dashboard

### Send Money

1. On the Dashboard, locate the "Initiate Transaction" card
2. Enter a recipient's UPI ID
3. Enter an amount to send (must be less than your balance)
4. Click "Send Money"
5. View the transaction in the Transaction History

## Features

- User authentication (signup, login, logout)
- Send money to other users
- View transaction history
- Visual transaction graph
- Secure authentication with JWT
- Password hashing with bcrypt

## Technologies Used

- Frontend:
  - React with TypeScript
  - React Router for navigation
  - Shadcn UI components
  - Tailwind CSS for styling
  - Recharts for data visualization

- Backend:
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing
