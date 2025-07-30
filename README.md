# 🛒 E-Commerce App

### 🔗 Live Preview / Demo

🌐 **Live Demo**: [ShopNow](https://naveenprasathofficial.netlify.app/)

> 🧪 Try out the application with the demo credentials below:

#### 👤 Customer Login
- 📧 Email: `naveenprasathofficial.work@gmail.com`
- 🔑 Password: `naveen123`

#### 🛠️ Admin Login
- 📧 Email: `admin@example.com`
- 🔑 Password: `admin123`

A full-stack e-commerce web application built with **Django (DRF)** and **React (Vite + Tailwind CSS)**. Features include:

- 🔐 JWT-based authentication  
- 🛍️ Product management  
- 🛒 Cart and order placement  
- 💳 Mock payment flow  
- 📦 Admin and customer roles  
- 📧 Email confirmation (Celery)  
- 🐳 Docker support  
- ✅ Unit test coverage  

This project was built as part of a take-home assignment.

---

## 🚀 Getting Started

### 🐳 Docker Setup (Recommended)

#### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

#### Steps

1. **Clone the repository:**

```bash
git clone https://github.com/m-naveenprasath/e-commerce-app.git
cd e-commerce-app
```
2. **Build and start the containers:**
```
docker-compose build
docker-compose up -d
```
3. **Access the app:**

- 🖥️ Frontend: [http://localhost:3000](http://localhost:3000)
- 🔙 Backend API: [http://localhost:8000/api/](http://localhost:8000/api/)

✅ Ensure ports **3000** and **8000** are available on your machine.


### 🔐 Default Admin Login (for local testing)

- 📧 Email: `admin@example.com`
- 🔑 Password: `admin123`

> You can log in using the frontend or the `/login` 

---

### 📘 API Documentation

Manual documentation of all available API endpoints, including request/response formats and examples.

- [📄 API Documentation (Word)](./docs/Ecommerce_API_Documentation.docx)
- [📄 API Documentation (PDF)](./docs/Ecommerce_API_Documentation.pdf)

---
### 🗂️ Project Schema
## Complete schema of the backend system with:

  - Database model diagrams

  - User roles and permissions

  - Entity relationships (ER Diagram)

  Download here:
    
  - [📄 Project Schema (PDF)](./docs/Ecommerce_Project_Schema.pdf)
---

### 🧪 Testing
## Run Django unit tests:
```
cd .\service\
python manage.py test
```

### 📂 Project Structure
```
e-commerce-app/
├── app/                  # Django backend (DRF, JWT, Celery, Stripe/Mock)
│   ├── media/
│   ├── service/          # Django project directory
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── manage.py
│   └── requirements.txt
│
├── ui/                   # React frontend (Vite + Tailwind)
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── index.html
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml    # Docker orchestration (NGINX + backend + frontend)
├── .editorconfig
├── .gitignore
└── README.md

```

### ✅ Features
## Core Features
    🔐 User registration/login with JWT

    📦 Product listing, detail, and management (admin + creator)

    👤 Admin and customer roles

    🛒 Cart: add, update, remove

    🧾 Order placement and order history

    ⚙️ Admin panel (custom UI) for product/category/order management

## Frontend
    📃 Product list and detail pages

    🛍️ Cart UI and checkout flow

    ✅ Order confirmation view

    🔐 Login / Signup forms

    📦 Admin dashboard (basic CRUD)

## DevOps & Tooling
    🐳 Docker + Docker Compose

    🌐 NGINX reverse proxy for frontend

    🧪 Pytest test coverage

    📧 Celery + Redis for async email tasks

    💳 Mock payment flow (Stripe-ready)

## Bonus Features
    🧾 PDF invoice generation 
    
### 📧 Contact
    For any queries or feedback, feel free to connect:
    Naveen Prasath
    📬 Email: naveenprasathofficial.work@gmail.com
    🔗 GitHub: @m-naveenprasath