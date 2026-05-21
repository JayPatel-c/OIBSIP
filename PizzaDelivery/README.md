# 🍕 Pizza Crafters — Premium Gourmet Delivery

A full-stack, state-of-the-art Pizza Crafters Application built as part of the Oasis Infobyte Web Development Internship (Level 3 Task). It features a modern dark-slate UI theme, glassmorphic layout components, custom multi-step pizza creation wizards, simulated/real Razorpay integrations, low-stock warnings, and automated order status tracking.

---

## 🚀 Quick Launch Guide

Follow these steps to run the application on your machine:

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended).
- [MongoDB](https://www.mongodb.com/) running locally on port `27017` (default).

### Step 1: Start & Seed the Backend Database
Navigate to the backend directory, install the required packages, populate the collections with gourmet recipes, and run the Express API:
```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Seed the MongoDB database (sets up default accounts, pizzas, ingredients)
npm run seed

# Launch the development server
npm start
```
*The API will start running at `http://localhost:5000`.*

### Step 2: Start the Frontend Client
Open a new terminal window, navigate to the frontend directory, install dependencies, and launch Vite:
```bash
# Navigate to frontend directory
cd frontend

# Install frontend dependencies
npm install

# Launch Vite development server
npm run dev
```
*The React client will launch at `http://localhost:5173`.*

---

## 👤 Pre-Seeded Demo Accounts

To facilitate instant testing without filling out long registration forms, we have pre-seeded two demo profiles. You can log in with them using the **Quick Access Buttons** on the Login Page:

| Account Type | Email Address | Password | Privileges / Features |
|--------------|---------------|----------|-----------------------|
| **👤 Standard User** | `user@pizzashop.com` | `userpassword123` | Build custom pizzas, order pre-crafted varieties, make test payments, poll real-time order tracking steps. |
| **🔑 Store Owner (Admin)** | `admin@pizzashop.com` | `adminpassword123` | Access Admin Hub, monitor dashboard stats, review low stock alerts, adjust ingredient quantities, change order status. |

---

## ⚡ Robust Developer Solutions Built-in

To guarantee a seamless testing experience right after initialization (without requiring real setup credentials), we integrated two fail-safe solutions:

1. **Simulated Razorpay Checkout**: If you don't have active Razorpay test keys in your `.env` file, the backend will auto-detect this and prompt a stunning **Simulated Razorpay Dialog overlay** inside the browser. You can click "Simulate Success" or "Simulate Failure" to proceed, mock verification, and write the confirmed order directly to MongoDB!
2. **Nodemailer Console Logging Fallback**: If SMTP parameters are missing or failed, the backend handles this gracefully. It prints registration codes, email verification links, password reset links, and stock warning notifications directly inside the **Node.js terminal console** using prominent, easy-to-read boxes. You can copy and paste them directly!

---

## 🛠️ Tech Stack & Key Features

### Backend (`/backend`)
- **Express.js API Server** with modular routing.
- **Mongoose Database Schemas** with auto-hashing pre-save middleware (bcryptjs) for secure credentials.
- **JWT Authentication** utilizing secure Cookies or Bearer headers.
- **Stock Depletion Subtraction**: Reduces raw base, sauce, cheese, and toppings quantities upon confirmed order checkouts.
- **Low-Stock Alerting**: Monitors stock limits. If any item falls below threshold, fires alerts to the admin email.

### Frontend (`/frontend`)
- **React 18** with Vite.
- **Axios HTTP Client** configured with auth interceptors to inject authorization headers.
- **React Context API** (`AuthContext`) for centralized login, registration, and session memory.
- **Multi-Step Custom Pizza Builder Wizard**: Let users configure custom dough base, coating sauce, gourmet cheese selection, and veggies/meats layer, featuring real-time receipt cost calculations.
- **Visual Order Timeline Tracker**: Displays a linear step-progression (Received 📝 → Baking 🍕 → Out for Delivery 🛵 → Delivered 🎉) with short-interval state polling to automatically reflect updates.
