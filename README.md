# e-commerce-app
🎯 A full-stack e-commerce app built with Django (backend) and React (frontend) as part of a take-home assignment, featuring user auth, product management, and a basic payment flow.


``` 
docker-compose build
docker compose up -d
```

If you want to remove any volumes (e.g., DB data, Redis cache):
```
docker-compose down -v
```

IF FIND ERROR
```
dos2unix ./service/entrypoint.sh
```
---

## 📘 API Documentation

Manually written usage guide for all API endpoints:

- [📄 API Documentation (PDF)](./docs/Ecommerce_API_Documentation.pdf)
- [📄 API Documentation (Word)](./docs/Ecommerce_API_Documentation.docx)

---

## 🗂️ Project Schema

Detailed schema of the entire system including:

- Database Models
- Relationships (ER Diagram)
- Roles & Permissions (if included)

Download here:

- [📄 Project Schema (PDF)](./docs/Ecommerce_Project_Schema.pdf)

---

## 📂 Project Structure
```
e-commerce-app/
├── app/ # Django backend
│ ├── media/
│ ├── service/
│ ├── Dockerfile
│ ├── entrypoint.sh
│ ├── manage.py
│ └── requirements.txt
│
├── ui/ # React frontend (Vite + Tailwind)
│ ├── public/
│ ├── src/
│ ├── Dockerfile
│ ├── index.html
│ ├── nginx.conf # NGINX config for frontend build
│ ├── package.json
│ ├── tailwind.config.js
│ └── vite.config.js
│
├── docker-compose.yml # Docker orchestration
├── .editorconfig
├── .gitignore
└── README.md
```