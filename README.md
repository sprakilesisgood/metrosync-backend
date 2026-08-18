# MetroSync Backend

A little real-time backend for metro announcements. Admins post updates, passengers see them
instantly. Built with Express, MongoDB, JWT auth, and Socket.io.

Live: https://metrosync-backend-93q7.onrender.com

## Run it locally

```bash
npm install
cp .env.example .env      # fill in MONGODB_URI and JWT_SECRET
npm run seed              # loads the stations and one admin
npm start                 # http://localhost:4000
```

Then open `http://localhost:4000` for the demo board. Health check is at `GET /health`.

## How it's laid out

Every endpoint goes route → controller → service:

- **routes/** just map a URL and method to a controller function.
- **controllers/** handle the request and response, call a service, and pass errors to `next`.
- **services/** are the only place that talk to MongoDB.

## API

| Method | Path | Auth | What it does |
|---|---|---|---|
| GET | `/health` | none | Is the server up |
| GET | `/api/v1/stations` | none | Every station, sorted by line then order |
| POST | `/api/v1/auth/login` | none | JWT for a valid admin (rate-limited and validated) |
| GET | `/api/v1/stations/:id/announcements` | none | Newest first, `?page=&limit=&type=&since=` |
| POST | `/api/v1/stations/:id/announcements` | admin | Create and broadcast an announcement |

For the protected POST, send `Authorization: Bearer <token>`.

## Real-time bits (Socket.io)

- The client emits `joinStation` with a station id. That socket joins the room and leaves whatever it was in.
- The server counts viewers per room and emits `presenceUpdate` (`{ stationId, viewers }`) whenever it changes.
- After an announcement saves, the server emits `announcement` to that room. It only broadcasts if the write actually went through.

## Tests

```bash
npm test
```

Jest and Supertest running against an in-memory Mongo, so you don't need a real database. They cover
the stations list (200), login returning a token, a POST with no token (401), and an admin POST (201).

## Deploying (Render + Atlas)

1. Push to GitHub. Your `.env` stays out of it thanks to `.gitignore`.
2. Make a Render Web Service from the repo. Build `npm install`, start `node index.js` (there's a `render.yaml`).
3. Set `MONGODB_URI` (your Atlas string) and `JWT_SECRET` in the Render dashboard.
4. Seed once, then open `/health` on the live URL to confirm it's connected.

Seeded admin for the demo: `admin@metrosync.io` / `admin1234`. Change it with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
