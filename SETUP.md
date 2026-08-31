# Local Development Setup

This project runs **backend**, **frontend**, and **socket.io** together.

## Quick start

```bash
# From multi-vendor-ecommerce-main/
npm run install:all
npm run dev
```

Open the frontend URL shown in the terminal (usually `http://localhost:5173`).

## Demo accounts (auto-seeded)

| Role     | Email               | Password     |
|----------|---------------------|--------------|
| Admin    | admin@shopo.com     | admin123     |
| Customer | customer@shopo.com  | customer123  |
| Seller   | seller@shopo.com    | seller123    |

## What works out of the box

- **MongoDB**: Uses in-memory database when `MONGODB_URL` has placeholder credentials
- **Email**: Activation links are printed in the backend terminal (no SMTP needed)
- **Uploads**: Uses local `backend/uploads/` when Cloudinary is not configured
- **Auth cookies**: Configured for localhost HTTP in development
- **Socket.io**: Runs locally on port 4000

## Optional services

Add these to `backend/.env` when you want full functionality:

- `MONGODB_URL` — your MongoDB Atlas connection string
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` — for payments
- `CLOUDINARY_*` — for cloud image storage
- `SMTP_USER` / `SMTP_PASSWORD` — for real activation emails
- `CEREBRAS_API_KEY` — for the AI shopping assistant

## Run services individually

```bash
npm run dev:backend   # http://localhost:5000
npm run dev:frontend  # http://localhost:5173
npm run dev:socket    # http://localhost:4000
```
