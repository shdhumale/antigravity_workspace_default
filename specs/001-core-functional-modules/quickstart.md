# Quickstart Guide: Core Functional Modules

**Branch**: `001-core-functional-modules` | **Date**: 2026-02-20

---

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| JDK | 21+ | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 20 LTS+ | `node -version` |
| Angular CLI | Latest LTS | `ng version` |
| MySQL | 8.0+ | `mysql --version` |
| Docker (optional) | 24+ | `docker --version` |

---

## 1. Database Setup

```sql
-- Run once as MySQL root
CREATE DATABASE product_mgmt CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pmapp'@'localhost' IDENTIFIED BY '<strong-password>';
GRANT SELECT, INSERT, UPDATE, DELETE ON product_mgmt.* TO 'pmapp'@'localhost';
-- Audit log: insert + select only for immutability
REVOKE UPDATE, DELETE ON product_mgmt.audit_log FROM 'pmapp'@'localhost';
FLUSH PRIVILEGES;
```

Liquibase runs automatically on application startup (`liquibase.enabled=true`). All 8 changesets
are applied in order. No manual DDL required.

---

## 2. Backend — Spring Boot

### Environment Variables

```bash
# Required
export DB_URL=jdbc:mysql://localhost:3306/product_mgmt?serverTimezone=UTC
export DB_USER=pmapp
export DB_PASSWORD=<strong-password>
export JWT_SECRET=<minimum-256-bit-base64-secret>
export JWT_ACCESS_TTL_MS=900000        # 15 minutes
export JWT_REFRESH_TTL_DAYS=7
export UPLOAD_DIR=/tmp/product-uploads
export SMTP_HOST=smtp.example.com
export SMTP_PORT=587
export SMTP_USER=<email>
export SMTP_PASSWORD=<password>
```

### Run (Development)

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

Application starts on **http://localhost:8080**

### Key Endpoints (verify startup)

```bash
# Health check
curl http://localhost:8080/actuator/health

# OpenAPI docs
open http://localhost:8080/swagger-ui.html
```

### Run Tests

```bash
# Unit tests only
mvn test

# Integration tests (requires test DB)
mvn verify -Pfull-test

# Checkstyle
mvn checkstyle:check
```

---

## 3. Frontend — Angular

```bash
cd frontend
npm install
ng serve          # starts on http://localhost:4200
```

### Proxy Configuration

`frontend/proxy.conf.json` proxies `/api` to backend:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Start with proxy:
```bash
ng serve --proxy-config proxy.conf.json
```

### Run Tests

```bash
# Unit tests (Jasmine/Karma)
ng test

# E2E tests (Cypress)
npx cypress open
# or headless:
npx cypress run
```

### ESLint

```bash
ng lint
```

---

## 4. First-Run Validation Sequence

Execute these steps in order to confirm the full stack is working:

### Step 1: Login

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Change.Me.123"}'
```

**Expected**: `200 OK` with `accessToken` and `refreshToken` in response body.

### Step 2: Verify Token

```bash
export TOKEN=<accessToken from step 1>
curl http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: `200 OK` with current user profile (role: ADMIN).

### Step 3: Create a Product (as Manager)

Log in as a Manager user, then:

```bash
curl -X POST http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer $MANAGER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test Widget",
    "description":"A test product",
    "categoryId":"<category-uuid>",
    "price":9.99,
    "inventoryQty":100
  }'
```

**Expected**: `201 Created` with product in `DRAFT` status.

### Step 4: Verify Audit Log

```bash
curl http://localhost:8080/api/v1/audit?entityType=PRODUCT \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected**: The CREATE action from Step 3 appears in the audit log.

### Step 5: Open Dashboard

Navigate to `http://localhost:4200` in a browser → login → dashboard shows KPI cards with live
product count.

### Step 6: Search

```bash
curl "http://localhost:8080/api/v1/search/products?q=Widget&status=DRAFT" \
  -H "Authorization: Bearer $TOKEN"
```

**Expected**: Product from Step 3 appears in results.

---

## 5. Stitch UI Screen Mapping

| Stitch Folder | Angular Feature Module | Route |
|---|---|---|
| `security_and_access_control` | `features/auth` | `/login`, `/register` |
| `user_management_and_roles` | `features/users` | `/users` |
| `add_new_user_form` | `features/users` | `/users/new` |
| `product_management_inventory_listing` | `features/products` | `/products` |
| `add_new_product_wizard` | `features/products` | `/products/new` |
| `admin_analytics_dashboard` | `features/dashboard` | `/dashboard` |
| `advanced_analytics_and_reporting` | `features/analytics` | `/analytics` |
| `system_settings_and_localization` | `features/settings` | `/settings` |

Reference `stitch/<folder>/screen.png` for the target visual; `stitch/<folder>/code.html` for the
HTML/CSS implementation guide.

---

## 6. Common Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `401 Unauthorized` on protected endpoint | Token expired / wrong header | Refresh token; check `Authorization: Bearer <token>` |
| `409 Conflict` on product update | Optimistic lock version mismatch | Fetch latest product (newest `version`), re-apply changes |
| Liquibase fails on startup | Schema drift / changeset conflict | Check `DATABASECHANGELOG` table; ensure no manual DDL was run |
| WebSocket disconnects immediately | CORS or proxy misconfigured | Verify `WebSocketConfig` allowed origins; check proxy target |
| Image upload `413 Payload Too Large` | File exceeds 5 MB limit | Check `spring.servlet.multipart.max-file-size` setting |
| Search returns stale results | FULLTEXT index rebuild needed | Run `ALTER TABLE products ADD FULLTEXT ...` or restart (index is rebuilt automatically on next InnoDB flush) |
