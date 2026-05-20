# Application-de-suivi-medical-V3
Application de Suivi Médical

Welcome to the Medical Tracking Application project!
This project is a modern web application designed to help doctors manage patients, appointments, and medical prescriptions in a simple and organized way using the MERN Stack.

🎯 Educational Purpose

This project was created as part of a school hackathon and educational training.
The goal is to practice full-stack web development using modern technologies and agile methodologies.

🚀 Tech Stack
Frontend
React
React Router
Axios
Tailwind CSS
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
bcryptjs
📂 Project Structure
<pre lang="markdown"> medical-tracking-app/ │ ├── frontend/ │ │ │ ├── package.json │ ├── vite.config.js │ ├── index.html │ │ │ ├── public/ │ │ └── images/ │ │ │ └── src/ │ │ │ ├── main.jsx │ ├── App.jsx │ ├── index.css │ │ │ ├── assets/ │ │ └── logo.png │ │ │ ├── pages/ │ │ ├── Login.jsx │ │ ├── Register.jsx │ │ ├── Dashboard.jsx │ │ ├── Patients.jsx │ │ ├── AddPatient.jsx │ │ ├── EditPatient.jsx │ │ ├── Appointments.jsx │ │ ├── AddAppointment.jsx │ │ ├── Prescriptions.jsx │ │ └── NotFound.jsx │ │ │ ├── components/ │ │ ├── Navbar.jsx │ │ ├── Sidebar.jsx │ │ ├── PatientCard.jsx │ │ ├── AppointmentCard.jsx │ │ ├── PrescriptionCard.jsx │ │ ├── ProtectedRoute.jsx │ │ └── Loader.jsx │ │ │ ├── layouts/ │ │ └── MainLayout.jsx │ │ │ ├── routes/ │ │ └── AppRoutes.jsx │ │ │ ├── services/ │ │ ├── authService.js │ │ ├── patientService.js │ │ ├── appointmentService.js │ │ └── prescriptionService.js │ │ │ ├── context/ │ │ └── AuthContext.jsx │ │ │ └── utils/ │ ├── api.js │ └── helpers.js │ │ ├── backend/ │ │ │ ├── package.json │ ├── server.js │ ├── .env │ │ │ ├── config/ │ │ └── db.js │ │ │ ├── controllers/ │ │ ├── authController.js │ │ ├── patientController.js │ │ ├── appointmentController.js │ │ └── prescriptionController.js │ │ │ ├── models/ │ │ ├── User.js │ │ ├── Patient.js │ │ ├── Appointment.js │ │ └── Prescription.js │ │ │ ├── routes/ │ │ ├── authRoutes.js │ │ ├── patientRoutes.js │ │ ├── appointmentRoutes.js │ │ └── prescriptionRoutes.js │ │ │ ├── middleware/ │ │ ├── authMiddleware.js │ │ ├── errorMiddleware.js │ │ └── validateMiddleware.js │ │ │ ├── utils/ │ │ ├── generateToken.js │ │ └── validators.js │ │ │ └── seeders/ │ └── seed.js │ │ ├── README.md ├── .gitignore └── LICENSE </pre>
📌 Main Features
👥 Authentication
User registration
User login
JWT authentication
Protected routes
🧑‍⚕️ Patient Management
Add patients
Edit patients
Delete patients
View patient information
📅 Appointment Management
Create appointments
Edit appointments
Delete appointments
View appointments list
💊 Prescriptions
Add prescriptions
View prescriptions
Link prescriptions to patients
🔒 Security
Protected API routes
Password hashing
Input validation
Authentication middleware
📱 UI/UX
Responsive design
Clean dashboard
Simple navigation
Modern interface
⚙️ Installation
Clone the repository
git clone https://github.com/your-username/medical-tracking-app.git
Frontend Setup
cd frontend
npm install
npm run dev
Backend Setup
cd backend
npm install
npm run server
🌐 Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
📄 License

This project is licensed under the Mozilla Public License 2.0.

You are free to use, modify, and distribute this project under the MPL-2.0 license.
