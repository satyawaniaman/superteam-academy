# Superteam Academy Backend

Standalone server for backend-signed on-chain transactions (lesson completion, course finalization, credential issuance).

## Setup

```bash
pnpm install
pnpm copy-idl   # Copy IDL from onchain-academy
```

Create `.env` from `.env.example`:

```env
SOLANA_RPC=https://api.devnet.solana.com
ACADEMY_AUTHORITY_KEYPAIR=[64 numbers]   # For create-course
ACADEMY_BACKEND_SIGNER_KEYPAIR=[64 numbers]  # For complete-lesson, finalize-course
```

Use the same keypairs as the on-chain program (wallets/signer.json for devnet).

## Run

```bash
pnpm dev   # Development (tsx watch)
pnpm build && pnpm start   # Production
```

Default port: 3001. Override with `PORT`.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /academy/create-course | Create course (authority) |
| POST | /academy/complete-lesson | Complete lesson (backend signer) |
| POST | /academy/finalize-course | Finalize course (backend signer) |

### Request bodies

**create-course**
```json
{ "courseId": "test-course-1", "lessonCount": 3, "xpPerLesson": 100, "creator": "..." }
```

**complete-lesson**
```json
{ "courseId": "test-course-1", "learner": "<pubkey>", "lessonIndex": 0 }
```

**finalize-course**
```json
{ "courseId": "test-course-1", "learner": "<pubkey>" }
```
