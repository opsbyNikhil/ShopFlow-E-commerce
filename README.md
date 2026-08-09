# 🔐 ShopFlow Auth Service

**Authentication & Authorization Microservice** for the **ShopFlow Microservices-Based E-Commerce Platform**.

This service is responsible for user registration, OTP verification, login, password verification, JWT token generation, forgot-password/reset-password functionality, and temporary authentication sessions.

> **Status:** Development / Local Environment  
> **Backend:** Django + Django REST Framework  
> **Database:** MySQL  
> **Frontend:** React + Vite + Ant Design  
> **Email:** Resend  
> **Authentication:** OTP + Password + JWT

---

## 📌 Table of Contents

1. [About the Project](#-about-the-project)
2. [Authentication Flow](#-authentication-flow)
3. [Features](#-features)
4. [Architecture](#-architecture)
5. [Technology Stack](#-technology-stack)
6. [Project Structure](#-project-structure)
7. [Prerequisites](#-prerequisites)
8. [Clone/Fork the Repository](#-clonefork-the-repository)
9. [Backend Setup](#-backend-setup)
10. [MySQL Database Setup](#-mysql-database-setup)
11. [Environment Variables](#-environment-variables)
12. [Install Dependencies](#-install-dependencies)
13. [Run the Backend](#-run-the-backend)
14. [Frontend Setup](#-frontend-setup)
15. [Run the Frontend](#-run-the-frontend)
16. [Complete User Flows](#-complete-user-flows)
17. [API Overview](#-api-overview)
18. [JWT Authentication](#-jwt-authentication)
19. [Testing](#-testing)
20. [Troubleshooting](#-troubleshooting)
21. [Production Notes](#-production-notes)
22. [Contributing](#-contributing)
23. [License](#-license)

---

# 🎯 About the Project

ShopFlow Auth Service is a standalone authentication microservice.

It is intentionally separated from other ShopFlow services so that authentication can be developed, deployed, scaled, and maintained independently.

The future ShopFlow platform can contain services such as:

```text
ShopFlow
│
├── auth-service
├── home-page-service
├── product-service
├── cart-service
├── order-service
├── payment-service
└── notification-service
```

The `auth-service` should own authentication-related data and logic only.

---

# 🔄 Authentication Flow

## 1. User Registration

```text
React Signup Page
       │
       │ First Name
       │ Last Name
       │ Email
       │ Mobile
       │ Password
       ↓
Auth Service
       │
       ↓
Generate 6-Digit OTP
       │
       ↓
Resend Email
       │
       ↓
User enters OTP
       │
       ↓
Verify OTP
       │
       ↓
Create User
       │
       ↓
Registration Successful
```

The username is generated from the user's first name and last name according to the application's registration logic.

---

## 2. Login Flow

ShopFlow uses an OTP-first login flow.

```text
Login Page
    │
    │ Email OR Mobile Number
    ↓
Request Login OTP
    │
    ↓
6-Digit OTP sent to registered email
    │
    ↓
Verify OTP
    │
    ↓
Temporary Login Session
    │
    ↓
Password Page
    │
    ↓
Verify Password
    │
    ↓
Generate JWT
    │
    ├── Access Token
    └── Refresh Token
    │
    ↓
Home Page
```

### Why use a temporary session?

The OTP verification and password verification are two separate authentication steps.

After OTP verification, the backend creates a short-lived `LoginSession`.

The frontend sends this temporary session token to the password endpoint.

Only after the password is successfully verified should the application issue the final JWT tokens.

---

# 🔑 Forgot Password Flow

```text
Forgot Password
      │
      ↓
Enter registered email
      │
      ↓
Send OTP / reset instructions
      │
      ↓
Verify reset OTP
      │
      ↓
Reset password
      │
      ↓
Redirect to Login
```

The service can use Resend to send reset-related emails.

---

# 🔐 Reset Password Flow

When a valid reset link is opened:

```text
Reset Password Link
       │
       ↓
Reset Password Page
       │
       ├── Old Password
       └── New Password
       │
       ↓
Verify Old Password
       │
       ↓
Set New Password
       │
       ↓
Password Updated
       │
       ↓
Redirect to Login
```

Passwords are never stored as plain text. Django's password hashing system should be used.

---

# ✨ Features

- ✅ User registration
- ✅ First name and last name
- ✅ Automatic username generation
- ✅ Email registration
- ✅ Mobile number registration
- ✅ Email OTP verification
- ✅ 6-digit OTP
- ✅ OTP expiry
- ✅ Login using email or mobile number
- ✅ Login OTP verification
- ✅ Temporary login session
- ✅ Password verification after OTP
- ✅ JWT access token
- ✅ JWT refresh token
- ✅ Forgot password
- ✅ Password reset
- ✅ Resend email integration
- ✅ MySQL database
- ✅ React frontend
- ✅ Ant Design UI
- ✅ Django REST Framework API
- ✅ `.env` based configuration
- ✅ Separate microservice architecture
- ✅ Ready for Docker/CI-CD integration

---

# 🏗 Architecture

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │   Vite + Ant Design │
                    └──────────┬──────────┘
                               │
                         HTTP / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Auth Service     │
                    │ Django REST API     │
                    └───────┬─────┬───────┘
                            │     │
                ┌───────────┘     └────────────┐
                ▼                              ▼
       ┌────────────────┐             ┌────────────────┐
       │ MySQL Database │             │ Resend Email   │
       │                │             │ Service        │
       └────────────────┘             └────────────────┘
```

---

# 🛠 Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend language |
| Django | Backend framework |
| Django REST Framework | REST APIs |
| MySQL | Authentication database |
| React | Frontend |
| Vite | Frontend development server |
| Ant Design | UI components |
| Axios | Frontend API requests |
| Resend | Email delivery |
| JWT | API authentication |
| Git/GitHub | Version control |
| Docker | Containerization |
| Jenkins/GitHub Actions | Future CI/CD |

---

# 📁 Project Structure

Recommended structure:

```text
auth-service/
│
├── accounts/
│   ├── migrations/
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
│
├── auth_service/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .env
├── .env.example
├── .gitignore
├── manage.py
├── requirements.txt
└── README.md
```

---

# 📋 Prerequisites

Install the following:

- Python 3.12+
- Node.js 18+
- npm
- MySQL 8.x
- Git
- Resend account/API key

Check installations:

```bash
python --version
node --version
npm --version
mysql --version
git --version
```

---

# 🍴 Clone/Fork the Repository

If you fork this project on GitHub:

1. Open the original GitHub repository.
2. Click **Fork**.
3. Select your GitHub account.
4. Clone your fork.

```bash
git clone https://github.com/<your-username>/shopflow.git
```

Go to the Auth Service:

```bash
cd shopflow/auth-service
```

If the repository contains only this service:

```bash
cd auth-service
```

> Replace `<your-username>` with your GitHub username.

---

# 🐍 Backend Setup

Go to the Auth Service:

```bash
cd auth-service
```

Create a virtual environment:

### Windows

```cmd
python -m venv venv
```

Activate:

```cmd
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

After activation you should see:

```text
(venv)
```

in your terminal.

---

# 🗄 MySQL Database Setup

Create the database:

```sql
CREATE DATABASE shopflow_auth;
```

The application can use:

```text
Database: shopflow_auth
Host: 127.0.0.1
Port: 3306
```

If you use XAMPP, start:

```text
MySQL
```

from the XAMPP Control Panel.

You can verify the database from phpMyAdmin.

---

# 🔐 Environment Variables

Create:

```text
.env
```

inside the `auth-service` directory.

Example:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True

DB_NAME=shopflow_auth
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306

RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_sender@example.com

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Do **not** commit the real `.env` file to GitHub.

Create `.env.example` instead:

```env
SECRET_KEY=
DEBUG=True

DB_NAME=shopflow_auth
DB_USER=
DB_PASSWORD=
DB_HOST=127.0.0.1
DB_PORT=3306

RESEND_API_KEY=
RESEND_FROM_EMAIL=

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

# 📦 Install Dependencies

With the virtual environment activated:

```cmd
pip install -r requirements.txt
```

If `requirements.txt` does not exist yet, install the main packages:

```cmd
pip install django djangorestframework mysqlclient python-dotenv
```

Install the JWT package if your project uses Simple JWT:

```cmd
pip install djangorestframework-simplejwt
```

Save dependencies:

```cmd
pip freeze > requirements.txt
```

---

# 🔄 Database Migrations

Run:

```cmd
python manage.py makemigrations
```

Then:

```cmd
python manage.py migrate
```

Create an admin user if required:

```cmd
python manage.py createsuperuser
```

---

# ▶️ How to Run the Backend

From:

```text
auth-service/
```

run:

```cmd
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000/
```

API base:

```text
http://127.0.0.1:8000/api/auth/
```

---

# ⚛️ Frontend Setup

Open a second terminal.

Go to:

```cmd
cd auth-service\frontend
```

Install packages:

```cmd
npm install
```

If Ant Design is not installed:

```cmd
npm install antd @ant-design/icons
```

Install Axios:

```cmd
npm install axios
```

---

# ▶️ How to Run the Frontend

Run:

```cmd
npm run dev
```

Vite normally starts at:

```text
http://localhost:5173/
```

You should have two terminals running:

### Terminal 1

```text
auth-service
└── python manage.py runserver
```

### Terminal 2

```text
auth-service/frontend
└── npm run dev
```

---

# 🔄 Complete Application Flow

## Signup

```text
/signup
    ↓
Enter:
First Name
Last Name
Email
Mobile Number
Password
    ↓
Request/Send OTP
    ↓
Email OTP
    ↓
Enter 6-digit OTP
    ↓
Verify OTP
    ↓
User Created
    ↓
Login
```

---

## Login

```text
/login
    ↓
Email OR Mobile Number
    ↓
Request OTP
    ↓
6-digit OTP
    ↓
Verify OTP
    ↓
Temporary Login Session
    ↓
Password Page
    ↓
Enter Password
    ↓
Verify Password
    ↓
JWT Access + Refresh Token
    ↓
Home Page
```

---

# 🔌 API Overview

The exact endpoint names should match the `accounts/urls.py` in your checkout.

Typical endpoints in this project include:

| Endpoint | Method | Purpose |
|---|---:|---|
| `/api/auth/request-login-otp/` | POST | Request login OTP |
| `/api/auth/verify-login-otp/` | POST | Verify login OTP |
| `/api/auth/reset-password/` | POST | Reset password |
| Signup endpoint | POST | Register user |
| Signup OTP endpoint | POST | Verify registration OTP |
| Password login endpoint | POST | Verify password and issue JWT |
| Forgot password endpoint | POST | Start password reset |

Example login OTP request:

```json
{
  "login": "user@example.com"
}
```

Example OTP verification:

```json
{
  "user_id": 2,
  "otp": "123456"
}
```

A successful OTP verification returns a temporary session token.

Example:

```json
{
  "message": "OTP verified successfully",
  "session_token": "temporary-session-token"
}
```

The session token is then used by the password verification step.

---

# 🔑 JWT Authentication

After the OTP and password are successfully verified, the Auth Service generates:

```text
Access Token
Refresh Token
```

The frontend should keep the tokens securely and send the access token to protected services.

Example:

```http
Authorization: Bearer <access-token>
```

Future services such as:

```text
home-page-service
product-service
cart-service
order-service
```

can validate the user's access token.

---

# 🧪 Testing

## Browser Testing

Open:

```text
http://localhost:5173
```

Test:

### Registration

```text
Signup
→ OTP
→ Verify OTP
→ User Created
```

### Login

```text
Email/Mobile
→ Request OTP
→ Enter OTP
→ Password
→ Login
→ Home Page
```

### Forgot Password

```text
Forgot Password
→ Email
→ Reset instructions
→ Reset Password
→ Login
```

---

## API Testing with Postman

You can also test the backend APIs using Postman.

Example:

```text
POST
http://127.0.0.1:8000/api/auth/request-login-otp/
```

Body:

```json
{
  "login": "user@example.com"
}
```

Then verify the OTP using the endpoint configured in your project.

---

# 🐛 Troubleshooting

## MySQL: Access denied

Example:

```text
Access denied for user 'nikhil'@'localhost'
```

Check:

```env
DB_NAME=shopflow_auth
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=127.0.0.1
DB_PORT=3306
```

Make sure MySQL is running.

---

## Database table does not exist

Run:

```cmd
python manage.py makemigrations
python manage.py migrate
```

---

## `LoginSession is not defined`

Make sure `views.py` imports:

```python
from .models import LoginSession
```

---

## OTP is invalid

Check:

1. The OTP belongs to the correct user.
2. The OTP has not expired.
3. A new OTP was not requested after the previous OTP.
4. The frontend is sending the correct `user_id`.
5. The backend is using the same OTP storage/verification strategy.

---

## CORS error

Make sure your backend allows the React development URL:

```text
http://localhost:5173
```

Do not use `*` in production unless you understand the security implications.

---

## Frontend is blank

Check the browser console:

```text
F12
→ Console
```

Also verify:

```cmd
npm run dev
```

and make sure React is running.

---

## Backend is not responding

Check:

```cmd
python manage.py runserver
```

The backend should be available at:

```text
http://127.0.0.1:8000/
```

---

# 🔒 Production Notes

Before deploying this service to AWS or another production environment:

- ❌ Do not commit `.env`
- ❌ Do not expose MySQL publicly
- ❌ Do not print OTPs in production logs
- ❌ Do not store production OTPs as plain text
- ❌ Do not use Django `DEBUG=True`
- ❌ Do not hard-code API keys
- ✅ Use environment variables/secrets management
- ✅ Use HTTPS
- ✅ Use secure CORS configuration
- ✅ Use strong Django `SECRET_KEY`
- ✅ Use hashed passwords
- ✅ Use hashed OTPs
- ✅ Use short OTP expiration
- ✅ Add rate limiting for OTP requests
- ✅ Rotate/revoke tokens when appropriate
- ✅ Put the service behind a production web server/reverse proxy

### Important OTP note

During local development, you may temporarily store/display OTPs for debugging.

For production, OTPs should be stored securely (preferably hashed) and should never be written to application logs.

---

# 🐳 Docker

The Auth Service is designed to be containerized later.

A typical production structure can become:

```text
Docker
│
├── auth-service
│   ├── Django API
│   └── React frontend
│
├── MySQL
│
└── Future services
    ├── home-page-service
    ├── product-service
    ├── cart-service
    ├── order-service
    └── payment-service
```

Each microservice can have its own Dockerfile and deployment lifecycle.

---

# 🚀 Future Microservice Architecture

The Auth Service should remain independent.

```text
                         ┌──────────────────┐
                         │  React Frontend  │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ API Gateway/LB   │
                         └────────┬─────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
       ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
       │ Auth        │     │ Home Page   │     │ Product     │
       │ Service     │     │ Service     │     │ Service     │
       └──────┬──────┘     └─────────────┘     └─────────────┘
              │
              ▼
       ┌─────────────┐
       │ Auth MySQL  │
       └─────────────┘
```

Each service should own its own business logic.

---

# 🤝 Contributing

Contributions are welcome.

### 1. Fork the repository

```text
GitHub → Fork
```

### 2. Clone your fork

```bash
git clone https://github.com/<your-username>/shopflow.git
```

### 3. Create a branch

```bash
git checkout -b feature/auth-improvement
```

### 4. Make your changes

### 5. Test the application

```cmd
python manage.py test
```

and:

```cmd
npm run dev
```

### 6. Commit

```bash
git add .
git commit -m "Improve auth service"
```

### 7. Push

```bash
git push origin feature/auth-improvement
```

### 8. Create a Pull Request

Open GitHub and create a Pull Request from your branch to the original repository.

---

# 📄 License

This project is licensed under the MIT License.

You are free to use, modify, and distribute the project according to the terms of the license.

---

# ⭐ Support

If this project is useful:

- ⭐ Star the repository
- 🍴 Fork the repository
- 🐛 Report issues
- 💡 Suggest improvements
- 🤝 Submit Pull Requests

---

## 👨‍💻 ShopFlow

**Microservices-Based E-Commerce Platform**

Built with:

```text
Django • Django REST Framework • React • MySQL
JWT • Resend • Docker • Git • CI/CD
```

> Build independently. Deploy independently. Scale independently.
