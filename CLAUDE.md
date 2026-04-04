# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (`client/`)
```bash
npm install       # Install dependencies
npm run dev       # Dev server on http://localhost:8080
npm run build     # Production build
npm run start     # Run production build
```

### Backend (`server/`)
```bash
npm install       # Install dependencies
npm run dev       # Dev server with hot reload (ts-node-dev)
npm run build     # Compile TypeScript to dist/
npm run start     # Run compiled output
```

Both servers must run simultaneously during development. The client proxies `/api/*` to the Express server at `http://localhost:4000`.

## Environment

The server reads from a `.env` file. Required variables:
- `JWT_SECRET` — secret for signing JWT tokens
- `PORT` — defaults to `4000`
- `CLIENT_URL` — defaults to `http://localhost:3000` (CORS origin)

## Architecture

**Monorepo with two independent packages:** `client/` (Next.js 14) and `server/` (Express + TypeScript).

### Auth Flow
1. Client calls `/api/auth/*` — Next.js rewrites these to `http://localhost:4000/api/auth/*` via `next.config.js`
2. Server issues a `token` **httpOnly cookie** on login; no token is returned in the response body
3. `client/middleware.ts` guards `/dashboard` routes by checking for the `token` cookie — redirect to `/login` if absent
4. Protected API calls pass the cookie automatically (`credentials: 'include'`); the server's `authenticate` middleware verifies the JWT

### Data Persistence
Users are stored as JSON in `server/data/users.json`. `userService.ts` does atomic writes (write to `.tmp`, then rename). There is no database.

### Key Files
- `server/src/controllers/authController.ts` — register/login/logout/me handlers
- `server/src/services/userService.ts` — file-based user store (read/write `users.json`)
- `server/src/middleware/authenticate.ts` — JWT cookie verification middleware
- `client/lib/api.ts` — typed fetch wrappers for all auth endpoints
- `client/middleware.ts` — Next.js edge middleware for route protection
