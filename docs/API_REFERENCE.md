# API Reference

The Enterprise Product Management System exposes a RESTful API for all core operations. All endpoints are prefixed with `/api/v1`.

---

## 🔐 Authentication
Endpoints for managing identity and session tokens.

### `POST /auth/login`
Authenticates a user and returns JWT tokens.
- **Request Body**: `{"email": "...", "password": "..."}`
- **Response**: `{"accessToken": "...", "refreshToken": "...", "expiresIn": ...}`

### `POST /auth/refresh`
Rotates the access token using a valid refresh token.
- **Request Body**: `{"refreshToken": "..."}`
- **Response**: `{"accessToken": "...", "refreshToken": "..."}`

---

## 📦 Products
Manage the product catalogue.

### `GET /products`
Returns a list of all products. Supports pagination and filtering (optional).
- **Scope**: Authenticated users.

### `POST /products`
Creates a new product in `DRAFT` status.
- **Scope**: `MANAGER`, `ADMIN`.

### `POST /products/{id}/approve`
Moves a product from `PENDING_APPROVAL` to `ACTIVE`.
- **Scope**: `ADMIN`.

---

## 🔍 Search
High-performance discovery endpoints.

### `GET /search/products?q={query}`
Performs a full-text search across product name and description.
- **Scope**: Authenticated users.

---

## 📊 Dashboard & Stats
System-wide activity metrics.

### `GET /dashboard/stats`
Returns aggregated KPIs for the system overview.
- **Scope**: Authenticated users.

---

## 🛡 Audit
System modification logs.

### `GET /audit/logs`
Returns a reverse-chronological list of system modifications.
- **Scope**: `ADMIN`.

---

## ⚙️ Engineering Notes
- **Authentication**: JWT Bearer tokens must be provided in the `Authorization` header.
- **Concurrency**: Update operations on products require the `version` field for optimistic locking.
- **Real-time**: WebSocket connection available at `/ws`.
