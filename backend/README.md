# WAQT backend

Express and Mongoose API for the WAQT watch store. This milestone covers backend setup, MongoDB, registration, and products. Product creation is an unprotected development endpoint.

## Requirements and installation

Use Node.js 20 or later and npm. From this directory run:

```sh
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB Atlas connection string and local settings. Never commit `.env`.

## MongoDB setup

Create an Atlas cluster and database user, allow your development IP in Network Access, then copy the driver's connection string into `MONGODB_URI`. URL-encode special characters in the database user's password. The application connects before listening; a failed connection exits with a non-zero status. `GET /api/health` reports database readiness.

Environment variables:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | HTTP port (defaults to `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Allowed browser origin; comma-separated origins are supported |

## Run

```sh
npm start
# or during development
npm run dev
```

## API

### `GET /api/health`

Returns server and database status. Responds `200` when connected and `503` otherwise.

### `POST /api/auth/register`

JSON body: `{ "name": "Sam Karim", "email": "sam@example.com", "password": "at-least-8-chars" }`. Creates a user with a bcrypt hash and returns the safe user fields. Duplicate email returns `409`; invalid data returns `400`.

### `GET /api/products`

Returns `{ "products": [...] }` ordered newest first.

### `POST /api/products`

Creates a product from JSON fields `name`, `brand`, `description`, `price`, `imageUrl`, and `category`; `stockQuantity` is optional and defaults to `0`. Returns `201` or `400` for invalid data. This endpoint is intentionally unprotected during development.

## Tests

Run `npm test`. API integration tests use a separate `MONGODB_TEST_URI`; point it at a disposable local database or Atlas test database to execute the checks. The tests clear the `User` and `Product` collections in that database before running, so do not point it at production data.
