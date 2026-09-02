# API Documentation — Devs Wallet

Base URL: `http://localhost:5000/api`

All authenticated endpoints require a header:

```
Authorization: Bearer <JWT_TOKEN>
```

All responses follow this envelope:

```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": null }
```

---

## Auth — `/auth`

| Method | Endpoint | Auth | Body | Description |
|---|---|---|---|---|
| POST | `/auth/register` | No | `{ fullName, email, phone?, password }` | Creates user + wallet, returns `{ user, token }` |
| POST | `/auth/login` | No | `{ email, password }` | Returns `{ user, token }` |
| POST | `/auth/forgot-password` | No | `{ email }` | Generates a reset token (demo: returned in response instead of emailed) |
| POST | `/auth/reset-password` | No | `{ token, newPassword }` | Resets password using the token |
| GET | `/auth/me` | Yes | — | Returns current user + wallet |

## Wallet — `/wallet`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/wallet` | — | Get wallet balance/currency |
| POST | `/wallet/deposit` | `{ amount, description? }` | Add funds |
| POST | `/wallet/withdraw` | `{ amount, description? }` | Remove funds (fails if insufficient) |
| POST | `/wallet/transfer` | `{ recipientEmail, amount, description? }` | Send to another Devs Wallet user |

## Transactions — `/transactions`

| Method | Endpoint | Query Params | Description |
|---|---|---|---|
| GET | `/transactions` | `page, limit, type, status, startDate, endDate, search` | Paginated, filterable history |
| GET | `/transactions/dashboard-stats` | — | Balance, 6-month cash flow, type breakdown, 5 most recent |
| GET | `/transactions/:id` | — | Single transaction detail |

## Savings Goals — `/savings-goals`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/savings-goals` | — | List all goals for the user |
| POST | `/savings-goals` | `{ title, targetAmount, deadline? }` | Create a goal |
| PUT | `/savings-goals/:id` | `{ title?, targetAmount?, deadline?, status? }` | Update a goal |
| DELETE | `/savings-goals/:id` | — | Delete a goal |
| POST | `/savings-goals/:id/contribute` | `{ amount }` | Move money from wallet into the goal |

## Bill Payments — `/bills`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/bills` | — | List payment history |
| POST | `/bills/pay` | `{ category, provider, accountNumber, amount }` | `category` ∈ electricity, gas, internet, mobile |

## Mobile Packages — `/packages`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/packages` | — | List all available packages |
| GET | `/packages/my-purchases` | — | List the user's purchase history |
| POST | `/packages/purchase` | `{ packageId, mobileNumber }` | Purchase a package |

## Beneficiaries — `/beneficiaries`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/beneficiaries` | — | List saved beneficiaries |
| POST | `/beneficiaries` | `{ nickname, beneficiaryEmail, bankOrWallet? }` | Add (email must belong to an existing user) |
| PUT | `/beneficiaries/:id` | `{ nickname?, bankOrWallet? }` | Update |
| DELETE | `/beneficiaries/:id` | — | Remove |

## Profile & Security — `/profile`

| Method | Endpoint | Body | Description |
|---|---|---|---|
| PUT | `/profile` | `{ fullName?, phone? }` | Update personal info |
| PUT | `/profile/password` | `{ currentPassword, newPassword }` | Change password |
| POST | `/profile/avatar` | `multipart/form-data`, field `avatar` | Upload avatar (png/jpg/jpeg/webp, ≤2MB) |

## Admin — `/admin` (requires `role: admin`)

| Method | Endpoint | Query/Body | Description |
|---|---|---|---|
| GET | `/admin/users` | `page, limit, search, status` | Paginated user list with wallet balances |
| PUT | `/admin/users/:id/status` | `{ status: "active"\|"suspended" }` | Suspend/activate a user |
| GET | `/admin/transactions` | `page, limit, type, status` | All transactions across all users |
| GET | `/admin/reports` | — | Platform totals, monthly volume, new users/month |

---

## Error Codes

| Status | Meaning |
|---|---|
| 400 | Bad request (e.g. insufficient balance) |
| 401 | Missing/invalid/expired token, or wrong credentials |
| 403 | Suspended account or insufficient role permissions |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate email) |
| 422 | Validation error (missing/invalid fields) |
| 500 | Server error |

## Example: Deposit Request

```http
POST /api/wallet/deposit
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{ "amount": 5000, "description": "Salary top-up" }
```

Response:

```json
{
  "success": true,
  "message": "Deposit successful",
  "data": {
    "wallet": { "id": "...", "balance": "5000.00", "currency": "PKR" },
    "transaction": { "id": "...", "type": "deposit", "amount": "5000.00", "balance_after": "5000.00" }
  }
}
```
