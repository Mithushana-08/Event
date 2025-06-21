# SeatScape Event Booking Platform

## Stack Used

- **Frontend (Admin):** React, Vite, CSS
- **Frontend (Client):** React, Vite, CSS
- **Backend:** Node.js, Express.js, MySQL, Multer, JWT, CORS
- **Database:** MySQL

## How to Run Locally

### Prerequisites
- Node.js (v16 or above)
- npm (v8 or above)
- MySQL Server

### 1. Clone the Repository
```
git clone <your-repo-url>
cd Event
```

### 2. Setup the Database
- Create a MySQL database (e.g., `eventdb`).
- Import your events table and other required tables (see your migrations or ask the admin for SQL scripts).
- Create a `.env` file in `backend/` with:
  ```
  DB_HOST=localhost
  DB_USER=your_mysql_user
  DB_PASSWORD=your_mysql_password
  DB_NAME=eventdb
  JWT_SECRET=your_jwt_secret
  ```

### 3. Start the Backend
```
cd backend
npm install
node Server.js
```
- The backend will run on [http://localhost:5000](http://localhost:5000)

### 4. Start the Frontend (Admin)
```
cd ../frontend-Admin
npm install
npm run dev
```
- The admin frontend will run on [http://localhost:5173](http://localhost:5173) by default.

### 5. Start the Frontend (Client)
```
cd ../frontend-client
npm install
npm run dev
```
- The client frontend will run on [http://localhost:5174](http://localhost:5174) by default.

### 6. Usage
- Visit the client or admin URLs in your browser.
- Admins can log in, add/edit/delete events, and view bookings.
- Users can view events and book seats.

---

**Note:**
- Make sure the backend is running before using the frontends.
- Update API URLs in frontend code if you change backend ports.
- For image uploads, ensure the `backend/uploads/` directory exists and is writable.

---

For any issues, please contact the project maintainer.
