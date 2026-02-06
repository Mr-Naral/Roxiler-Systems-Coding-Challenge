
# Store Rating System

A full-stack web application that facilitates store ratings with a comprehensive Role-Based Access Control (RBAC) system. The platform serves three distinct user types: System Administrators, Store Owners, and Normal Users, each with tailored dashboards and functionalities.

Built with a focus on clean architecture, security (JWT), and a modern UI (React + Tailwind + Animations).

## 🚀 Live Demo
🔗 https://your-demo-link.com 

---

## 🚀 Features

### 1. Role-Based Access Control (RBAC)
-   **System Administrator**: Full control over the platform. Can manage users, create stores, and view system-wide analytics.
-   **Store Owner**: Access to a dedicated dashboard to track their specific store's performance and view customer feedback.
-   **Normal User**: Ability to browse stores, search, and submit 5-star ratings.

### 2. Modern User Interface
-   **Glassmorphism Design**: sleek, modern aesthetic using Tailwind CSS.
-   **Animations**: Smooth page transitions and interactive elements using Framer Motion.
-   **Responsive**: Fully optimized for desktop and mobile devices.

### 3. Advanced Functionality
-   **Real-time Search**: Debounced search for stores by name or address.
-   **Dynamic Filtering**: Admin tools to filter users by role and search data tables.
-   **Validation**: Strict form validation for registration (password complexity, name length).

---

## 🛠 Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS
-   **Animations**: Framer Motion
-   **Routing**: React Router DOM
-   **HTTP Client**: Axios
-   **Icons**: Lucide React

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Sequelize (Auto-syncs schema, no SQL scripts needed)
-   **Authentication**: JSON Web Tokens (JWT) & BcryptJS

---

## 📂 Project Structure

```bash
├── backend/
│   ├── config/         # Database connection & Sequelize config
│   ├── controllers/    # Business logic (MVC Architecture)
│   ├── middleware/     # Auth verification & Role guards
│   ├── models/         # Database Schema Definitions
│   ├── routes/         # API Endpoint definitions (Implied in server.js)
│   └── server.js       # Main entry point & Route aggregation
│
└── frontend/
    ├── src/
    │   ├── components/ # Reusable UI (Navbar, Inputs, Cards)
    │   ├── pages/      # Dashboards (Admin, Owner, User), Auth Pages
    │   └── App.jsx     # Routing & Protected Route Logic

```

---

## 🗄 Database Schema

The database schema is defined using Sequelize Models and automatically synced.

### 1. Users Table

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | Integer | PK, Auto-increment | Unique User ID |
| `name` | String | Not Null | Min 20, Max 60 characters |
| `email` | String | Unique, Not Null | Standard Email Validation |
| `password` | String | Not Null | Bcrypt Encrypted |
| `role` | Enum | Default: 'user' | Values: `'admin'`, `'owner'`, `'user'` |
| `address` | String | Max 400 chars | User Address |

### 2. Stores Table

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | Integer | PK, Auto-increment | Unique Store ID |
| `name` | String | Not Null | Store Name |
| `address` | String | Not Null | Store Location |
| `ownerId` | Integer | FK (Users) | Linked to a Store Owner |

### 3. Ratings Table

| Column | Type | Constraints | Description |
| --- | --- | --- | --- |
| `id` | Integer | PK, Auto-increment | Unique Rating ID |
| `rating` | Integer | Check (1-5) | Star Rating Value |
| `UserId` | Integer | FK (Users) | User who submitted rating |
| `StoreId` | Integer | FK (Stores) | Store being rated |

---

## 🔌 API Routes

### Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Public | Register new user (User/Owner/Admin) |
| `POST` | `/api/auth/login` | Public | Login & receive JWT Token |
| `PUT` | `/api/auth/password` | Private | Update logged-in user's password |

### Admin Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/admin/stats` | Admin | Get total counts (Users, Stores, Ratings) |
| `GET` | `/api/admin/users` | Admin | List all users with details & owner ratings |
| `GET` | `/api/admin/stores` | Admin | List all stores with owner email & avg rating |
| `POST` | `/api/admin/store` | Admin | Create a new store & assign to owner |

### User Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/stores` | User | Search and list stores with personal ratings |
| `POST` | `/api/rating` | User | Submit or update a rating for a store |

### Owner Endpoints

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/owner/dashboard` | Owner | Get store stats & list of customer feedback |

---

## ⚡ Setup & Installation

### Prerequisites

1. **Node.js** (v14 or higher)
2. **PostgreSQL** installed and running locally.

### Step 1: Database Setup

Open your PostgreSQL shell (psql) or GUI (pgAdmin) and create the database:

```sql
CREATE DATABASE store_rating_db;

```

### Step 2: Backend Configuration

1. Navigate to the backend directory:
```bash
cd backend

```


2. Install dependencies:
```bash
npm install

```


3. Create a `.env` file in the `backend/` root directory:
```env
PORT=5000
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASS=your_actual_postgres_password
DB_HOST=localhost
JWT_SECRET=your_super_secret_key_123

```


4. Start the server:
```bash
npm start

```


*Note: The server will automatically create all necessary tables on the first run.*

### Step 3: Frontend Configuration

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend

```


2. Install dependencies:
```bash
npm install

```


3. Start the React development server:
```bash
npm run dev

```



### Step 4: Verification

1. Open your browser to the URL provided by Vite (usually `http://localhost:5173`).
2. **Admin Setup**: Since there is no default admin, you can register a new user via the UI and select "Admin" as the role (enabled for testing/demo purposes), or manually insert an admin into the database.

---

## 🔒 Security

* **Password Hashing**: All passwords are hashed using `bcryptjs` before storage.
* **JWT Authorization**: API routes are protected using Bearer tokens.
* **Middleware Guards**: Custom middleware ensures Users cannot access Admin routes and vice versa.
