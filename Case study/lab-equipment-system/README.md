# Department Laboratory Equipment Management System

React + Express.js + MongoDB (Atlas) application. Deployed on Vercel (frontend), Render (backend) and MongoDB Atlas (database).

## Folder structure
```
lab-equipment-system/
  backend/    Express API  (server.js, models/Equipment.js, seed.js, .env.example)
  frontend/   React (Vite) app  (src/App.jsx, src/main.jsx, src/style.css)
  mongo/      queries.js - mongosh script for CRUD, indexes and aggregation
```

## Prerequisites
- Node.js 18 or later (check with `node -v`)
- A MongoDB database: a free MongoDB Atlas cluster (recommended) or local MongoDB
- Optional: mongosh (MongoDB Shell) for running mongo/queries.js

## 1. Run the backend
```
cd backend
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (macOS/Linux)
```
Open `.env` and set `MONGODB_URI` to your Atlas connection string (replace <username>, <password>, <cluster-url>).
If the password has special characters (@ : / ?), URL-encode them.
```
npm run seed      # optional: loads 6 sample equipment records
npm start         # API runs at http://localhost:5000
```
Check: open http://localhost:5000/api/health -> {"status":"ok", ... "database":"connected"}

## 2. Run the frontend (second terminal)
```
cd frontend
npm install
copy .env.example .env        (Windows)   |   cp .env.example .env   (macOS/Linux)
npm run dev                   # open the URL shown, normally http://localhost:5173
```

## 3. Run the MongoDB shell script (optional)
```
mongosh "<your-connection-string>" --file mongo/queries.js
```

## 4. Test the API (curl)
On Windows PowerShell use `curl.exe` instead of `curl`, or use Git Bash / Postman.
```
curl http://localhost:5000/api/health
curl http://localhost:5000/api/equipment
curl http://localhost:5000/api/reports/category-summary
curl -X POST http://localhost:5000/api/equipment -H "Content-Type: application/json" -d '{"equipmentCode":"EQ-ELC-103","name":"Bench Power Supply","category":"Electronics","unitCost":9500,"quantity":8,"supplier":"Sai Scientific Traders","lab":"Electronics Lab"}'
curl -X PUT http://localhost:5000/api/equipment/<id> -H "Content-Type: application/json" -d '{"quantity":10}'
curl -X DELETE http://localhost:5000/api/equipment/<id>
```
Replace `<id>` with the `_id` returned by the create/read call.

## 5. Deploy
1. MongoDB Atlas: create a cluster, a database user, allow network access, copy the connection string.
2. Push the project to GitHub (never commit .env).
3. Render -> New Web Service -> select repo -> Root Directory `backend`, Build `npm install`, Start `npm start`.
   Environment variables: MONGODB_URI, DB_NAME=lab_equipment_db, FRONTEND_ORIGIN=<your Vercel URL>.
4. Vercel -> New Project -> select repo -> Root Directory `frontend`, Framework Vite.
   Environment variable: VITE_API_URL=<your Render URL>  (set it BEFORE deploying; Vite reads it at build time).
5. Put the final Vercel URL into FRONTEND_ORIGIN on Render (no trailing slash needed) and redeploy the backend.
6. Test /api/health on the Render URL, then add, edit and delete equipment from the Vercel URL.

Note: on Render's free plan the backend sleeps after inactivity, so the first request can take about a minute.
