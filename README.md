# ShopFlow – E-commerce Microservices Platform

ShopFlow is an e-commerce platform built using a **microservices architecture**. Each core feature of the store (authentication, product catalog, cart, orders, and the home/storefront experience) is developed and run as an independent service, each with its own Django backend and React (Vite) frontend.

---

## 🏗️ Architecture

| Microservice | Responsibility |
|---|---|
| **auth-service** | User signup, login (password & OTP), authentication |
| **product-service** | Product catalog, product details, listings |
| **cart-service** | Shopping cart management (add/remove/update items) |
| **order-service** | Order placement, checkout, delivery address, order history |
| **home-page-service** | Storefront/home page, categories, search, wishlist, profile |

Each service is fully independent — it has its own Django project, its own database migrations, its own dependencies, and its own frontend.

---

## 🛠️ Tech Stack

- **Backend:** Django, Django REST Framework
- **Frontend:** React (Vite)
- **Package Management:** pip (Python), npm (Node.js)
- **Process Scripts:** PowerShell (`run-all.ps1`, `stop-all.ps1`) for starting/stopping all services together on Windows

---

## 📁 Project Structure

```
shopflow/
├── auth-service/
│   ├── accounts/            # Django app: signup, login, OTP
│   ├── auth_service/        # Django project settings
│   ├── frontend/            # React + Vite frontend
│   └── manage.py
│
├── cart-service/
│   ├── cart/                # Django app: cart, cart items
│   ├── cart_service/        # Django project settings
│   ├── frontend/            # React + Vite frontend
│   └── manage.py
│
├── home-page-service/
│   ├── home/                # Django app: home, categories, products (aggregated)
│   ├── home_service/        # Django project settings
│   ├── frontend/            # React + Vite frontend
│   └── manage.py
│
├── order-service/
│   ├── orders/               # Django app: orders, delivery address
│   ├── order_service/        # Django project settings
│   ├── frontend/             # React + Vite frontend
│   └── manage.py
│
├── product-service/
│   ├── products/              # Django app: products
│   ├── product_service/       # Django project settings
│   ├── frontend/               # React + Vite frontend
│   └── manage.py
│
├── run-all.ps1               # Starts all microservices + frontends
├── stop-all.ps1              # Stops all running services
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/opsbyNikhil/ShopFlow-E-commerce.git
cd ShopFlow-E-commerce
```

### 2. Environment variables

Each microservice reads its own `.env` file, which is **not committed to version control** (see `.gitignore`). Create a `.env` file inside every service folder (`auth-service/.env`, `cart-service/.env`, `home-page-service/.env`, `order-service/.env`, `product-service/.env`) with the variables that service needs, for example:

```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=your-database-url
```

> ⚠️ Adjust the variable names above to match what each service's `settings.py` actually expects — fill these in based on your own configuration before running the project.

### 3. Set up each backend

Repeat this for **each** of the 5 service folders (`auth-service`, `product-service`, `cart-service`, `order-service`, `home-page-service`):

```bash
cd <service-name>
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver <port>
```

> Assign each service a different port (e.g. 8000, 8001, 8002, 8003, 8004) so they can all run simultaneously.

### 4. Set up each frontend

Repeat this for each service's `frontend/` folder:

```bash
cd <service-name>/frontend
npm install
npm run dev
```

### 5. Run everything at once (Windows)

Two helper scripts are included at the project root to start/stop all backends and frontends together:

```powershell
./run-all.ps1     # starts all 5 microservices and their frontends
./stop-all.ps1    # stops all running services
```

---

## 🔐 Notes on Security

- `.env` files are excluded from Git via `.gitignore` in every service — never commit real secrets, API keys, or database credentials.
- Rotate any credentials immediately if they are ever accidentally committed or pushed.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch and open a Pull Request
