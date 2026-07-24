# 🖥️ HR Management System
---

## ✨ Key Functionalities
- 🔐 **User authentication** with role-based access (Admin, Manager, Employee)
- 👤 **Employee CRUD** (Create, Read, Update, Delete)
- 🕒 **Attendance management** (daily views)
- 🤖 **Automatic absent marking** via scheduled jobs
- 📝 **Leave management** (apply, approve/reject, history)
- 💰 **Payroll system** with salary calculation & payslip generation
- 📊 **Dashboard analytics** for employees, attendance, leaves & payroll
- 🌐 **RESTful APIs** for all modules

---

## 🚀 Features
- **JWT-based authentication** & protected routes
- **Role middleware** for access control
- **Mongoose models**: Employee, Attendance, LeaveRequest, Payroll, User
- **Controller-based architecture** for clean backend structure
- **Auto-absent cron job** (`server/services/autoAbsentJob.js`)
- **Modern frontend** with Vite + React, modular components & hooks

---

## 🛠 Tech Stack
- **Frontend**: React, Vite, Axios  
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)  
- **Authentication**: JSON Web Tokens (JWT)  
- **Scheduler**: node-cron  

---

## 🎨 UI & Styling
- **Tailwind CSS** for responsive design
- **Lucide React Icons** for clean, modern UI
- **Sonner Toasts** for notifications & feedback

---

## 📸 Screenshots
- 📊 Dashboard summary & analytics  
- 👥 Employee management  
- 🕒 Attendance tracking  
- 💰 Payroll & payslips  

*(Add screenshots here to visually showcase your project.)*

---

## ⚙️ Local Setup

#### 📥 Clone the repository and open the project folder.

##### 🔙 Backend

- Change to the server directory:

  cd server

- Install dependencies:

  npm install

- Create a `.env` file in `server/` (see Backend .env section below).

- Run the server (example):

  npm run dev

##### 🌐 Frontend

- Change to the client directory:

  cd client

- Install dependencies:

  npm install

- Create a `.env` file in `client/` (see Frontend .env section below).

- Run the dev server:

  npm run dev

- Open the URL Vite prints (commonly `http://localhost:5173`).

---

## 🔐 Environment variables

Create `.env` files in the `server/` and `client/` directories. Replace placeholder values before running the app.

#### Folder — .env
- MONGO_URI=your_mongo_uri_here
- SECRET_KEY=your_jwt_secret_here


#### Backend — server/.env

- PORT=your_port_number
- MONGO_URI=your_mongo_uri_here
- SECRET_KEY=your_jwt_secret_here
- CLIENT_URL=your_frontend_url
- GOOGLE_CLIENT_ID=your_google_client_url

(Place additional optional vars such as SMTP credentials or cron timezone if needed.)

#### Frontend — client/.env

- VITE_USER_ENDPOINT=backend_user_endpoint
- VITE_ATTENDANCE_ENDPOINT=backend_attendance_endpoint
- VITE_EMPLOYEE_ENDPOINT=backend_employee_endpoint
- VITE_LEAVE_ENDPOINT=backend_leave_endpoint
- VITE_PAYROLL_ENDPOINT=backend_payroll_endpoint
- VITE_GOOGLE_CLIENT_ID=your_google_client_url

📌 Notes:
- Vite requires client env variables to start with `VITE_`.

---

## 📜 Useful scripts

- server: `npm run dev` (or `node server.js`) — runs backend
- client: `npm run dev` — runs Vite dev server

(Check `client/package.json` and `server/package.json` for exact scripts.)

---

## 🛠 Notes & troubleshooting

- MongoDB connection errors: verify `MONGO_URI` and IP/network access.
- CORS / client URL errors: confirm `CLIENT_URL` in backend matches the frontend dev URL.
