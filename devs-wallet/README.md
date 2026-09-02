# Devs Wallet — Full Stack PERN Internship Project

A digital wallet web application (JazzCash/NayaPay-style) built with **PostgreSQL, Express, React, Node.js** for the U Devs Full Stack PERN Internship.

## Tech Stack

- **Frontend:** React.js (Vite), Material UI, React Router, Axios, Redux Toolkit, Recharts
- **Backend:** Node.js, Express.js, JWT Authentication, bcrypt
- **Database:** PostgreSQL

## Project Structure

```
devs-wallet/
├── server/                # Express + PostgreSQL API
│   ├── config/             # DB connection, migration runner
│   ├── controllers/        # Business logic per module
│   ├── middleware/         # auth, role, upload, error handling
│   ├── routes/              # REST endpoints
│   ├── migrations/schema.sql
│   └── server.js
└── client/                # React (Vite) app
    └── src/
        ├── components/, layouts/, pages/, redux/, services/, hooks/
```

## Modules Implemented

1. Authentication — Register / Login / Forgot & Reset Password / JWT
2. Dashboard — balance, inflow/outflow, monthly trend & spending breakdown charts, recent transactions
3. Wallet — deposit, withdraw, transfer (atomic DB transactions)
4. Transactions — paginated list with type/date/search filters
5. Savings Goals — create/edit/delete, contribute from wallet, progress bar
6. Bill Payments — Electricity, Gas, Internet, Mobile (simulated)
7. Mobile Packages — browse & purchase (simulated)
8. Beneficiaries — manage saved recipients
9. Profile & Security — update info, change password, upload avatar
10. Admin Panel — manage users (suspend/activate), view all transactions, reports & analytics

## 1. Database Setup

Install PostgreSQL locally (or use a hosted instance), then create the database:

```bash
createdb devs_wallet
```

Copy the env example and set your connection string:

```bash
cd server
cp .env.example .env
# edit .env -> DATABASE_URL, JWT_SECRET
```

Run the migration (creates all tables + seeds mobile packages):

```bash
npm install
npm run migrate
```

## 2. Backend Setup

```bash
cd server
npm install
npm run dev        # nodemon, http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## 3. Frontend Setup

```bash
cd client
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

## 4. Create an Admin User

Every new registration is created with role `user`. To promote a user to admin, run in `psql`:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

The Admin Panel then appears automatically in the sidebar for that account.

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for the full REST endpoint reference.

## Entity Relationship Diagram

See [ERD.md](./ERD.md).

## Security Notes

- Passwords are hashed with `bcrypt` (10 salt rounds); plaintext passwords are never stored.
- All wallet-affecting endpoints require a valid JWT (`Authorization: Bearer <token>`).
- Admin-only routes are protected by role-based middleware.
- Money movements (deposit/withdraw/transfer/bill payment/package purchase) run inside PostgreSQL transactions with row locks (`FOR UPDATE`) to prevent race conditions and negative balances.
- `forgot-password` always returns the same response whether or not the email exists, to avoid leaking registered emails. In this internship/demo build the reset token is returned directly in the API response instead of emailed — wire up a real mail provider (e.g. Nodemailer + SendGrid) before production use.

## Suggested Next Steps (Weeks 7–8 of the timeline)

- Add automated tests (Jest + Supertest for API, React Testing Library for UI)
- Add rate limiting (`express-rate-limit`) on auth routes
- Add server-side input validation with `express-validator` on every route (scaffolded dependency is already included)
- Generate a `pg_dump` backup and commit it under `/server/migrations/backup.sql` before submission
- Deploy: e.g. Render/Railway for the API + PostgreSQL, Vercel/Netlify for the client
