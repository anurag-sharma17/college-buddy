# College Buddy — Mini Project

> A campus companion web application providing study groups, teacher availability, clubs, transport info, alumni connect, and quick contacts — with an integrated floating chatbot and a scroll-to-top helper.

---

## Table of contents
- Project overview
- Architecture
- Features
- Folder layout
- Prerequisites
- Quick start (run locally)
  - Backend
  - Frontend
- Environment variables
- Database setup & migration
- API endpoints (high level)
- Chatbot details
- Troubleshooting
- Development notes & history
- Contributing

---

## Project overview

College Buddy is a full-stack demo application built with a Node/Express backend and a React frontend. It provides students and faculty with easy access to study groups, club information, teacher availability and seating, transport data, alumni connections, and contact information. A floating chatbot was added to the UI to help users ask contextual questions quickly; a scroll-to-top button provides quick navigation.

This repository contains both backend and frontend code so you can run the entire application locally.

## Architecture

- Backend: Node.js + Express; MongoDB (Mongoose) for persistence; JWT-based auth middleware.
- Frontend: React (create-react-app style), client-side routing with `react-router-dom`.
- Chatbot: UI component in the frontend; backend route handles chat messages. The chatbot currently uses a reliable keyword-based response engine (no external AI calls required) and exposes the same endpoints for future AI integration.

## Features

- Browse and join study groups
- Teacher availability & seating maps
- Clubs listing and club details
- Transport information (bus/shuttle schedules)
- Alumni connect / networking
- Contacts page with important numbers and emails
- Floating chatbot (bottom-right) with keyword-based answers
- Scroll-to-top floating button (bottom-right, side-by-side with chatbot)

## Folder layout

Top-level layout (important files/folders):

```
FEATURES_README.md
backend/
  package.json
  server.js
  controllers/
    chatbotController.js
  routes/
    chatbotRoutes.js
  models/
  scripts/
    setupDB.js          # Create all collections, schemas & indexes
    exportData.js       # Export current DB to seed-data.json
    migrateDB.js        # Import seed-data.json into a fresh DB
    seed-data.json      # (Ignored by git) Your local DB export
frontend/
  package.json
  public/
  src/
    components/
      Chatbot.jsx
      Chatbot.css
    pages/
      ScrollToTopButton.js
      ScrollToTopButton.css
    App.js
```

See the repository tree for full details. The files mentioned above are the most relevant when configuring, running, or customizing the UI or chatbot.

## Prerequisites

- Node.js (v16+ recommended, Node 22 used during development)
- npm (or yarn)
- MongoDB (local or remote) if you want persistence for contacts, users, etc.

## Quick start (run locally)

Open two terminals: one for the backend and one for the frontend.

### Backend

1. Install dependencies and start the server:

```powershell
cd "d:\Projects\MINI PROJECT\backend"
npm install
node server.js
```

2. Default backend port: `5000` (unless configured otherwise in `server.js`).

### Frontend

1. In a separate terminal:

```powershell
cd "d:\Projects\MINI PROJECT\frontend"
npm install
npm start
```

2. Default frontend port: `3000` (the React dev server).

Now open `http://localhost:3000` and login to the app. The chatbot floating icon will appear at the bottom-right for logged-in users; the scroll-to-top button will appear side-by-side when you scroll down.

## Environment variables

A `.env.example` file is included in `backend/`. Copy it and fill in your values:

```powershell
cd backend
cp .env.example .env
# Then edit .env with your actual values
```

The example file contains:

```
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:3000
PORT=5000
HUGGINGFACE_API_KEY=hf_your_key_here    # Optional
```

Notes:
- `MONGO_URI` and `JWT_SECRET` are required for the app to function.
- `EMAIL_USER` / `EMAIL_PASS` are needed only for the password-reset email feature (use a Gmail app password).
- `HUGGINGFACE_API_KEY` is optional — the chatbot uses a keyword-based fallback by default and does not require an external AI key.

## Database setup & migration

The project includes database management scripts in `backend/scripts/` that let you set up the MongoDB database with all schemas, indexes, and seed data on any new device. **User data is always excluded** from exports and migrations — each environment starts with a clean user table.

### Available npm scripts

Run these from the `backend/` directory:

| Command | What it does |
|---|---|
| `npm run db:setup` | Creates all 12 collections with their Mongoose schemas and indexes (no data inserted) |
| `npm run db:setup:seed` | Creates collections + indexes, then seeds data from `seed-data.json` (skips collections that already have data) |
| `npm run db:setup:fresh` | **Drops all existing collections**, recreates schemas + indexes, and seeds data |
| `npm run db:export` | Exports all data (except users) from the current MongoDB to `scripts/seed-data.json` |
| `npm run db:migrate` | Imports `seed-data.json` into MongoDB (skips collections that already have data) |
| `npm run db:migrate:fresh` | Drops existing data and re-imports from `seed-data.json` |

### Collections managed

The setup script creates the following collections:

| Collection | Key indexes | Notes |
|---|---|---|
| `users` | `email` (unique) | Schema created but **never seeded** — users register themselves |
| `teachers` | `email` (unique) | Teacher profiles with timetable and location |
| `seatings` | — | Teacher seating/cabin assignments |
| `clubs` | — | Student clubs with members and events |
| `resources` | — | Shared study resources/files |
| `studygroups` | — | Study groups with meeting schedules |
| `alumnis` | `email` (unique) | Alumni profiles and networking |
| `subjects` | `code` (unique) | Course subjects by year |
| `specializations` | `code` (unique) | Third/fourth year specialization tracks |
| `contacts` | — | Emergency, faculty, and department contacts |
| `routes` | — | Transport/bus route schedules |
| `maps` | — | Campus map images |

### Setting up a new device

After cloning the repo on a new machine:

```powershell
cd backend

# 1. Install dependencies
npm install

# 2. Create your .env file with MONGO_URI pointing to your local MongoDB
#    (see Environment Variables section above)

# 3. Set up the database with all schemas, indexes, and seed data
npm run db:setup:seed

# 4. Start the server
node server.js
```

### Updating seed data

If you've added new data (contacts, routes, subjects, etc.) to your database and want to share it with the team:

```powershell
# Export current DB data (excludes users) to seed-data.json
npm run db:export

# Commit the updated seed-data.json
git add backend/scripts/seed-data.json
git commit -m "Update seed data"
git push
```

### Script details

- **`setupDB.js`** — The main setup script. Registers all Mongoose schemas from `server.js`, creates each collection, and syncs indexes. Accepts `--seed` to also import data and `--fresh` to drop everything first.
- **`exportData.js`** — Connects to MongoDB, iterates over all collections (skipping `users`), and writes every document to `scripts/seed-data.json`.
- **`migrateDB.js`** — Reads `seed-data.json` and inserts documents into MongoDB. Respects the `DROP_EXISTING` environment variable to control overwrite behavior.
- **`seed-data.json`** — The exported data file. **This file is ignored by git** to prevent accidental leaks of sensitive local database dumps. To share base data with your team, you can share this file securely or commit a sanitized version (e.g. `seed-data.example.json`).

## API endpoints (high level)

Most endpoints are under `backend/routes/`. The important ones:

- `POST /api/chatbot/chat` — handle a chat message. (Protected route; uses `authMiddleware`.)
- `GET /api/chatbot/health` — health check for the chatbot route.
- Remaining application-specific routes: contacts, study-groups, teachers, auth — check `backend/routes/` for exact paths.

## Chatbot details

Current behavior:

- The frontend Chatbot component (`frontend/src/components/Chatbot.jsx`) shows a floating button in the bottom-right corner. When clicked, it opens a chat window that sends messages to `POST /api/chatbot/chat`.
- The backend chatbot handler is at `backend/controllers/chatbotController.js`. Because of external AI availability issues (Gemini region locks; OpenAI quota issues; Hugging Face provider problems), the app uses a robust keyword-based response engine that:
  - Recognizes queries about study groups, teachers, clubs, transport, alumni, contacts, and common greetings.
  - Returns formatted, helpful, human-readable answers including suggestions on which in-app pages to visit.

History & notes:

- Multiple AI providers were attempted during development (Gemini, OpenAI, Hugging Face). All encountered different issues (404 model errors for Gemini, quota limits for OpenAI, provider unavailability for several Hugging Face models). The keyword-based system is currently the reliable default; the codebase includes test scripts and commented code for trying different AI providers if you choose to re-enable them.

Where to add AI later:

- `backend/controllers/chatbotController.js` contains the chat handling logic — you can optionally add provider-specific logic (OpenAI / Hugging Face / Gemini) behind feature flags or environment variables and fall back to keyword responses when necessary.

## UI: Scroll-to-top + Chatbot buttons

- The scroll-to-top button component is `frontend/src/pages/ScrollToTopButton.js` and styles in `ScrollToTopButton.css`.
- The chatbot UI is in `frontend/src/components/Chatbot.jsx` and styles in `Chatbot.css`.
- The buttons are styled and positioned to appear side-by-side in the bottom-right corner; both are the same size for visual consistency.

## Troubleshooting

- If the chatbot does not appear:
  - Confirm you are logged in (the chatbot wrapper renders only for authenticated users).
  - Check browser console for errors and network logs to ensure requests go to `http://localhost:5000/api/chatbot/chat`.

- If the app is missing data (contacts, teachers):
  - Make sure MongoDB is running and `MONGODB_URI` is correct.
  - Check `server.js` logs for DB connection errors.

- If attempting to re-enable AI providers:
  - OpenAI: ensure your account has quota/credits — 429 errors indicate quota exhaustion.
  - Gemini: region/model name restrictions can return 404 — check Google Generative AI docs and your access.
  - Hugging Face: "No inference provider" errors mean the selected model is not available via the inference API; try another model or use hosted endpoints.

## Development notes & history

- The project originally implemented integration with Google Gemini, then OpenAI, and tried Hugging Face; those integrations failed for different reasons (region locks, quotas, provider availability). To keep the product reliable during demos, the team replaced remote LLM calls with a deterministic keyword-based assistant.
- There are test scripts and docs in the repo that track the experiments and can be reused if you later have reliable API access.

## Contributing

If you want to contribute:

1. Fork the repository and create a branch for your work.
2. Submit PRs with clear descriptions and small scope.
3. For adding AI providers, add feature flags and keep keyword fallback as the default.

## Optional improvements

- Persist chat history in MongoDB (adds user-specific chat history)
- Add voice input / speech-to-text
- Add suggested quick-questions in the chatbot UI
- Add E2E tests and CI configuration
- Add `docker-compose` for local development (backend + mongodb + frontend)


