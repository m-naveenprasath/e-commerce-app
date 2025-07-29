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
## 📘 API Documentation

You can download the full API documentation here:

👉 [Download Ecommerce_API_Documentation.docx](./docs/Ecommerce_API_Documentation.docx)

## 📂 Project Structure
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