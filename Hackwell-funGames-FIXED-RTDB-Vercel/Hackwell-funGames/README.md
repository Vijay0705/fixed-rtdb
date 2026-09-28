# HackWell Fun Games

College gaming/event leaderboard portal built with React + Vite + Express API + Firebase Realtime Database.

## What was fixed

- Vercel deployment now has a real serverless `/api/*` entry point.
- Admin login, student login, registration, sessions, leaderboard and admin APIs continue to use the existing frontend API contract.
- Replaced the server persistence layer from Cloud Firestore to Firebase Realtime Database.
- Added the requested RTDB URL:
  `https://hackwell-fungames-default-rtdb.asia-southeast1.firebasedatabase.app`
- Added RTDB REST access that works in Vercel serverless functions.
- Added optional Firebase service-account OAuth support for production-secure RTDB rules.
- Added optional legacy `FIREBASE_DATABASE_SECRET` support.
- Added a Firestore → RTDB migration script.
- Added Vercel SPA routing for `/admin/*`.
- Removed the server's dependency on a persistent local MongoDB connection.
- Kept the existing `/api/...` frontend routes so the UI did not need a destructive rewrite.
- Admin seed credentials are configurable through `ADMIN_PASSWORD`.

## RTDB structure

The previous Firestore collections are represented as RTDB branches:

```text
/users/{userId}
/sessions/{token}
/gameResults/{resultId}
/xpHistory/{historyId}
/auditLogs/{auditId}
/adminResetTokens/{resetToken}
```

## Local setup

```bash
npm install
npm run dev
```

The local server runs on `http://localhost:3000`.

## Vercel setup

Set these environment variables in the Vercel project for **Production** (and Preview if you want preview deployments to work):

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_FIREBASE_DATABASE_URL
ADMIN_PASSWORD
```

Recommended production database access:

```text
FIREBASE_SERVICE_ACCOUNT_JSON
```

`FIREBASE_SERVICE_ACCOUNT_JSON` should contain the Firebase/GCP service-account JSON as one environment-variable value. The server creates a short-lived OAuth access token and uses it for RTDB REST requests, so the database rules do not need to be publicly writable.

Alternative for projects that still have a Firebase Realtime Database secret:

```text
FIREBASE_DATABASE_SECRET
```

Do not commit either of these server-only secrets.

### Important Firebase RTDB rule

For production, do **not** use:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Use server-side service-account access and keep direct client writes locked down.

## Migrating existing Firestore data

If the old deployment contains player/admin data in Firestore, run this once from a trusted local environment after configuring `.env`:

```bash
npm run migrate:rtdb
```

This copies:

- `users`
- `sessions`
- `gameResults`
- `xpHistory`
- `auditLogs`
- `adminResetTokens`

into the equivalent RTDB branches.

## Build

```bash
npm run build
```

Vercel uses the Vite `dist` output and the `api/[...path].ts` serverless function.

## Admin

The default compatibility password remains `vijay007` if `ADMIN_PASSWORD` is not configured. **Set `ADMIN_PASSWORD` in Vercel before going live.**


## Exact Vercel deployment checklist

1. Push this folder to GitHub (do not upload `.env` or `node_modules`).
2. Import the repository into Vercel.
3. Keep the project framework as Vite or let Vercel detect it.
4. Confirm build command: `npm run build`.
5. Confirm output directory: `dist`.
6. Add all `VITE_FIREBASE_*` variables from your Firebase web app configuration.
7. Add `VITE_FIREBASE_DATABASE_URL` exactly as:
   `https://hackwell-fungames-default-rtdb.asia-southeast1.firebasedatabase.app`
8. Add `ADMIN_PASSWORD` with the admin password you want the seeded account to use when the RTDB is empty.
9. For production RTDB access, add `FIREBASE_SERVICE_ACCOUNT_JSON` from Firebase Console → Project settings → Service accounts → Generate new private key.
10. Redeploy.
11. Open `/api/health`. It should return `status: "ok"` and `database: "Firebase Realtime Database"`.
12. Test registration, student login, admin login, leaderboard, XP update, result void, audit log and analytics.

If `/api/health` works but login returns an RTDB permission error, the problem is Firebase RTDB authorization rather than Vercel routing. Configure the service-account variable (recommended) or the legacy database secret before changing database rules.
