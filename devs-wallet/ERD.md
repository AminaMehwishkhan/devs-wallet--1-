# Entity Relationship Diagram — Devs Wallet

```mermaid
erDiagram
    USERS ||--|| WALLETS : owns
    USERS ||--o{ SAVINGS_GOALS : creates
    USERS ||--o{ BILLS : pays
    USERS ||--o{ PACKAGE_PURCHASES : buys
    USERS ||--o{ BENEFICIARIES : manages
    USERS ||--o{ NOTIFICATIONS : receives
    WALLETS ||--o{ TRANSACTIONS : records
    MOBILE_PACKAGES ||--o{ PACKAGE_PURCHASES : "purchased as"
    TRANSACTIONS ||--o| BILLS : "linked to"
    TRANSACTIONS ||--o| PACKAGE_PURCHASES : "linked to"

    USERS {
        uuid id PK
        varchar full_name
        varchar email UK
        varchar phone UK
        varchar password_hash
        varchar role "user | admin"
        text avatar_url
        varchar status "active | suspended"
        varchar reset_token
        timestamp reset_token_expires
        timestamp created_at
        timestamp updated_at
    }

    WALLETS {
        uuid id PK
        uuid user_id FK "UNIQUE"
        numeric balance
        varchar currency
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid wallet_id FK
        varchar type "deposit|withdraw|transfer_in|transfer_out|bill_payment|package_purchase"
        numeric amount
        numeric balance_after
        varchar status "pending|success|failed"
        text description
        uuid reference_id "links transfer pairs"
        uuid counterparty_user_id FK
        timestamp created_at
    }

    SAVINGS_GOALS {
        uuid id PK
        uuid user_id FK
        varchar title
        numeric target_amount
        numeric saved_amount
        date deadline
        varchar status "active|completed|cancelled"
        timestamp created_at
        timestamp updated_at
    }

    BILLS {
        uuid id PK
        uuid user_id FK
        varchar category "electricity|gas|internet|mobile"
        varchar provider
        varchar account_number
        numeric amount
        varchar status "paid|failed"
        uuid transaction_id FK
        timestamp created_at
    }

    MOBILE_PACKAGES {
        uuid id PK
        varchar name
        varchar network
        varchar type "call|sms|internet|bundle"
        numeric price
        int validity_days
        text description
    }

    PACKAGE_PURCHASES {
        uuid id PK
        uuid user_id FK
        uuid package_id FK
        varchar mobile_number
        numeric amount
        uuid transaction_id FK
        timestamp created_at
    }

    BENEFICIARIES {
        uuid id PK
        uuid user_id FK
        varchar nickname
        varchar beneficiary_email
        varchar bank_or_wallet
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        varchar title
        text message
        boolean is_read
        timestamp created_at
    }
```

## Relationship Notes

- **users ↔ wallets**: one-to-one. Every user gets exactly one wallet created at registration time (inside the same DB transaction as the user insert, so a user can never exist without a wallet).
- **wallets ↔ transactions**: one-to-many. Every money movement (deposit, withdraw, transfer, bill payment, package purchase) creates an immutable transaction row against the wallet, with `balance_after` as a running snapshot for fast history rendering.
- **transfers**: implemented as a linked pair of rows — a `transfer_out` on the sender's wallet and a `transfer_in` on the recipient's wallet, joined by `reference_id`. Both are written atomically in a single DB transaction.
- **bills / package_purchases → transactions**: each bill payment or package purchase writes a `transactions` row first, then stores its id as a foreign key back on the `bills`/`package_purchases` row, giving a full audit trail.
- **savings_goals**: contributions withdraw from the wallet and increase `saved_amount`; the goal auto-flips to `completed` once `saved_amount >= target_amount`.
- **beneficiaries**: a beneficiary must be an existing Devs Wallet user (validated by email lookup) — this is a curated recipient list layered on top of `users`, not a separate contact system.
