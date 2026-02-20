# Feature Specification: Core Functional Modules — Product Management Ecosystem

**Feature Branch**: `001-core-functional-modules`
**Created**: 2026-02-20
**Status**: Draft
**Input**: User description: "Auth & AuthZ, User Mgmt, Product Mgmt, Search & Filter, Dashboard + Supporting Modules"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Secure Login & Token Lifecycle (Priority: P1)

A user with a registered account opens the application and signs in with their email and password.
The system validates credentials, issues a short-lived access token and a long-lived refresh token,
and redirects the user to their role-appropriate landing screen. When the access token nears expiry,
the system silently rotates it using the refresh token so the user stays signed in without
interruption. On logout, both tokens are invalidated server-side.

**Why this priority**: Without a working, secure authentication gate nothing else in the system is
accessible. Every other module depends on identity being established first.

**Independent Test**: A tester can register a new account, log in, verify the dashboard loads,
wait for token auto-refresh, then log out and confirm the refresh token is rejected on reuse — all
without touching any product or user management feature.

**Acceptance Scenarios**:

1. **Given** a registered user with valid credentials, **When** they submit the login form,
   **Then** they receive an access token (15-min TTL) and refresh token (7-day TTL) and are
   redirected to the dashboard.
2. **Given** an access token that has expired, **When** the client makes any API call,
   **Then** the system transparently refreshes the token using the refresh token and retries the
   original call without user intervention.
3. **Given** a user has logged out, **When** the system attempts to use the invalidated refresh
   token, **Then** the server returns HTTP 401 and does not issue a new access token.
4. **Given** a user provides incorrect credentials three times, **When** they attempt a fourth
   login, **Then** the account is temporarily locked for 15 minutes and the user is informed.
5. **Given** an Admin has enabled MFA for an account, **When** that user logs in with correct
   credentials, **Then** they must additionally provide a valid TOTP code before gaining access.

---

### User Story 2 — User Administration & Role Management (Priority: P1)

An Admin user navigates to the User Management section and can create new user accounts, assign or
change roles (Admin / Manager / Viewer), edit profile details, and deactivate accounts without
permanently deleting them. A Viewer browsing Users sees only a read-only list and cannot modify
any accounts.

**Why this priority**: Role assignments gate every other module's permissions. Until roles can be
assigned correctly, testing any other module with proper access control is impossible.

**Independent Test**: Create a new Manager account, assign the Manager role, log in as that user,
verify product editing is enabled, then deactivate the account and verify login is rejected.

**Acceptance Scenarios**:

1. **Given** an Admin is on the Users screen, **When** they create a new user supplying name,
   email, and role, **Then** the user appears in the list, receives a welcome email, and can
   log in with a temporary password.
2. **Given** an Admin changes a user's role from Viewer to Manager, **When** that user next
   makes an API call requiring Manager rights, **Then** the system honours the new role without
   requiring the user to re-login.
3. **Given** an Admin deactivates a user account, **When** that user attempts to log in,
   **Then** they receive a clear "account deactivated" message and access is denied.
4. **Given** a Manager views the Users module, **When** they try to delete or change roles,
   **Then** those action buttons are hidden/disabled and the API rejects the request with HTTP 403.
5. **Given** a user account is deactivated (soft-deleted), **When** an Admin views audit logs,
   **Then** all historical actions by that user remain visible and attributed correctly.

---

### User Story 3 — Product Catalogue Lifecycle (Priority: P2)

A Manager user creates a new product, filling in name, description, category, pricing, and
uploading product images. The product starts in **Draft** status. The Manager submits it for
approval and an Admin reviews and either promotes it to **Active** or rejects it back to
**Draft** with comments. An Admin can archive products that are no longer relevant.

**Why this priority**: Product management is the core domain. Without it there is no data for
Search, Dashboard, or Reporting to operate on.

**Independent Test**: Create a product in Draft, submit for approval, approve it as Admin,
verify it appears in the public catalogue listing; then archive it and verify it no longer
appears in default search results.

**Acceptance Scenarios**:

1. **Given** a Manager creates a product with all required fields and uploads at least one image,
   **When** they save, **Then** the product is stored in Draft status with a permanent SKU and
   the upload completes within 5 seconds for files up to 5 MB.
2. **Given** a product in Draft, **When** a Manager submits it for approval,
   **Then** its status changes to Pending and an Admin receives an in-app notification.
3. **Given** an Admin reviews a Pending product, **When** they approve it,
   **Then** its status becomes Active and it appears in catalogue listings immediately.
4. **Given** an Admin rejects a Pending product with a comment, **When** the Manager views the
   product, **Then** they see the rejection reason and the product reverts to Draft status.
5. **Given** an Active product, **When** an Admin archives it,
   **Then** its status changes to Archived and it is excluded from default catalogue and search
   results but remains retrievable via explicit filters.

---

### User Story 4 — Multi-Criteria Product Search & Filtering (Priority: P2)

Any authenticated user enters keywords into the search bar and optionally selects filters such
as category, price range, and status. The system returns a ranked list of matching products
within one second. Results paginate and the selected filters persist across page navigation.

**Why this priority**: Search is the primary daily-use feature for Managers and Viewers
discovering products. It is a read-only, self-contained slice that can be tested independently.

**Independent Test**: With 100+ products seeded, execute a keyword + category + price-range query
and verify: correct results returned, results appear within 1 second, pagination works, and
selecting page 2 keeps the filters active.

**Acceptance Scenarios**:

1. **Given** a user enters a keyword, **When** results load, **Then** they appear in under
   1 second and are ranked by relevance (exact name match > description match).
2. **Given** a user applies category + price-range filters simultaneously, **When** results
   load, **Then** only products matching all selected criteria are shown.
3. **Given** a Viewer is searching, **When** they see results, **Then** Archived products are
   excluded unless the user explicitly selects "Include Archived."
4. **Given** a search returns more than 20 results, **When** the user navigates to page 2,
   **Then** the same filters remain active and the correct next page of results is displayed.
5. **Given** a search yields zero results, **When** the empty state displays,
   **Then** the system shows a helpful message and suggests broadening the search.

---

### User Story 5 — Role-Specific Dashboard (Priority: P3)

On login, each user sees a dashboard personalised to their role. Admins see system-wide KPIs
(total users, total products by status, recent activity feed). Managers see their own product
portfolio metrics. Viewers see read-only trend charts. The activity feed and summary cards reflect
real-time data and update without a full page reload.

**Why this priority**: The dashboard aggregates information from all other modules. It is most
valuable once Users, Products, and Search are working. A basic static version can ship without
real-time updates as an MVP.

**Independent Test**: Log in as each of the three roles and verify: correct KPI cards appear,
data matches the underlying records, activity feed shows the last 10 events, and summary cards
refresh within 3 seconds of an underlying data change.

**Acceptance Scenarios**:

1. **Given** an Admin is on the dashboard, **When** a new user is created in another session,
   **Then** the "Total Users" card increments within 3 seconds without a page reload.
2. **Given** a Manager is on the dashboard, **When** one of their products changes status,
   **Then** the relevant status counter updates in real time.
3. **Given** a Viewer is on the dashboard, **When** they view charts,
   **Then** no edit or admin controls are visible regardless of URL manipulation.
4. **Given** a product is approved, **When** the Admin's activity feed is viewed,
   **Then** an entry "Product [name] approved by [actor]" appears at the top of the feed.

---

### User Story 6 — Audit Trail & Notification Events (Priority: P3)

Every create, update, delete, or status-change action on users or products is recorded
immutably. Relevant parties receive in-app notifications for key events (product status change,
new user creation, approval requests). Admins can query and export the full audit log.

**Why this priority**: Audit and notifications are cross-cutting supporting concerns. They add
compliance and observability value but do not block core functionality.

**Independent Test**: Perform a sequence of product create → approve → archive operations;
verify all three events appear in the audit log with correct actor, timestamp, and old/new
values; verify the relevant Manager received an in-app notification for each status change.

**Acceptance Scenarios**:

1. **Given** any user performs a CREATE, UPDATE, or DELETE action, **When** the operation
   completes, **Then** an audit record is written within 1 second capturing entity type, entity
   id, action, actor identity, timestamp, and old/new field values.
2. **Given** a product status changes, **When** the change is saved,
   **Then** the owning Manager receives an in-app notification within 5 seconds.
3. **Given** an Admin opens the Audit Log view, **When** they filter by entity type and date
   range, **Then** matching records are returned and can be exported as CSV.
4. **Given** the system sends an email notification, **When** the recipient's email server is
   temporarily unreachable, **Then** the system retries up to 3 times with exponential back-off
   and logs the failure if retries are exhausted.

---

### Edge Cases

- What happens when a user's session token is stolen and used from a different IP? → The system
  must detect the inconsistency (device fingerprint / IP deviation) and invalidate the token,
  forcing re-authentication.
- What if two Managers simultaneously update the same product record? → Optimistic locking must
  detect the conflict and return a clear conflict error to the second writer.
- What if an image upload fails mid-transfer? → The product record must remain in a consistent
  state (Draft, no partial image reference) and the user must be clearly informed.
- What if a search index becomes stale after a bulk product import? → The system must re-index
  automatically with a coherence window of no more than 30 seconds.
- What if a notification email bounces permanently? → The system must mark the address as
  invalid and surface a warning to the Admin rather than retrying indefinitely.

---

## Requirements *(mandatory)*

### Functional Requirements

#### Authentication & Authorisation
- **FR-001**: System MUST authenticate users via email/password with BCrypt-hashed credential storage.
- **FR-002**: System MUST issue short-lived access tokens (15 min) and long-lived refresh tokens (7 days) upon successful login.
- **FR-003**: System MUST support refresh token rotation — each use of a refresh token must invalidate the old one and issue a new one.
- **FR-004**: System MUST support TOTP-based Multi-Factor Authentication as an optional, per-account security layer.
- **FR-005**: System MUST lock accounts after 3 consecutive failed login attempts for a minimum of 15 minutes.
- **FR-006**: System MUST enforce role-based access control (Admin, Manager, Viewer) on all API endpoints.
- **FR-007**: Unauthenticated requests to protected resources MUST return HTTP 401; insufficient-role requests MUST return HTTP 403.

#### User Management
- **FR-008**: Admin users MUST be able to create, read, update, and soft-delete user accounts.
- **FR-009**: Admin users MUST be able to assign and change user roles without requiring the affected user to re-authenticate for the role change to take effect.
- **FR-010**: Deactivated (soft-deleted) user records MUST be retained for audit integrity; physical deletion is not permitted.
- **FR-011**: System MUST send a welcome email with a temporary password upon new account creation.
- **FR-012**: System MUST allow authenticated users to update their own profile (name, avatar, password) without Admin intervention.

#### Product Management
- **FR-013**: Manager users MUST be able to create product records with: name, description, category, price, inventory quantity, and one or more images.
- **FR-014**: Products MUST follow a defined status lifecycle: Draft → Pending Approval → Active | Rejected → Draft → Archived.
- **FR-015**: System MUST support image uploads up to 5 MB per file, with a maximum of 10 images per product.
- **FR-016**: System MUST use optimistic locking to prevent concurrent update conflicts on product records.
- **FR-017**: Admin users MUST be able to approve, reject (with a mandatory comment), and archive products.
- **FR-018**: All product status transitions MUST be recorded in the audit log.

#### Search & Filtering
- **FR-019**: System MUST provide full-text search across product name and description fields.
- **FR-020**: System MUST support simultaneous multi-criteria filtering by: category, price range, status, and creator.
- **FR-021**: Search results MUST be paginated (default 20 items/page) with consistent ordering.
- **FR-022**: By default, Archived products MUST be excluded from search results unless an explicit filter includes them.
- **FR-023**: Search results MUST be returned within 1 second for datasets up to 100,000 products.

#### Dashboard
- **FR-024**: The dashboard MUST display role-scoped KPI summary cards (counts of users, products by status).
- **FR-025**: The dashboard MUST display a chronological activity feed of the last 50 system events.
- **FR-026**: Summary cards and the activity feed MUST update in real time using a persistent connection mechanism, without requiring a full page reload.

#### Audit & Notifications (Supporting)
- **FR-027**: System MUST record an immutable audit log entry for every create, update, delete, and status-change operation across all entities.
- **FR-028**: Audit log entries MUST capture: entity type, entity ID, action, actor user ID, ISO timestamp, old value (JSON), new value (JSON).
- **FR-029**: System MUST deliver in-app notifications for: approval requests, product status changes, and new user creation events.
- **FR-030**: System MUST deliver email notifications via SMTP for the same events, with retry logic (3 attempts, exponential back-off).

#### API Layer (Supporting)
- **FR-031**: All API endpoints MUST be versioned under `/api/v1/` prefix.
- **FR-032**: All API error responses MUST conform to a standard envelope: `{ status, code, message, details[] }`.
- **FR-033**: System MUST rate-limit unauthenticated endpoints to 20 requests/minute per IP and authenticated endpoints to 200 requests/minute per user.

---

### User Roles & Permissions

| Role        | Auth & AuthZ           | User Mgmt                    | Product Mgmt              | Search    | Dashboard           |
|-------------|------------------------|------------------------------|---------------------------|-----------|---------------------|
| Super Admin | Manage all sessions    | Full CRUD + System settings  | Approve / Reject / Archive| All       | System-wide KPIs    |
| Manager     | Own session only       | Read-only (Cannot delete)    | Create / Edit products    | All       | Portfolio Analytics |
| Viewer      | Own session only       | Read-only                    | Read-only                 | Read-only | Read-only charts    |

---

### Key Entities

- **User** — id, email (unique), password_hash, first_name, last_name, role (ADMIN/MANAGER/VIEWER), mfa_enabled, mfa_secret, is_active, failed_login_count, locked_until, created_at, updated_at, deleted_at (soft-delete)
- **RefreshToken** — id, user_id (FK → User), token_hash, issued_at, expires_at, revoked_at, replaced_by_id (self-FK for rotation chain)
- **Product** — id, sku (unique), name, description, category_id (FK), price, inventory_qty, status (DRAFT/PENDING/ACTIVE/REJECTED/ARCHIVED), created_by (FK → User), approved_by (FK → User), rejection_reason, version (optimistic lock), created_at, updated_at
- **ProductImage** — id, product_id (FK), storage_url, display_order, uploaded_at
- **Category** — id, name, parent_id (FK → Category, for hierarchical categories), is_active
- **AuditLog** — id, entity_type, entity_id, action (CREATE/UPDATE/DELETE/STATUS_CHANGE), performed_by (FK → User), performed_at, old_value (JSON), new_value (JSON)
- **Notification** — id, recipient_id (FK → User), event_type, title, body, is_read, created_at, read_at
- **ApprovalRequest** — id, product_id (FK), requested_by (FK → User), reviewed_by (FK → User), status (PENDING/APPROVED/REJECTED), comment, created_at, resolved_at

> **Note**: Every entity maps to a Liquibase changeset, a JPA `@Entity`, an Angular model interface,
> and an OpenAPI 3.x schema component.

---

## Assumptions

1. OAuth2 / social login is **out of scope** for this spec; only email/password + optional MFA is required.
2. Product image storage uses a local filesystem or cloud object store (S3-compatible); the exact provider is an infrastructure decision outside this spec.
3. Real-time updates on the dashboard use WebSockets; the fallback strategy (Server-Sent Events) is a technical decision for the planning phase.
4. Email SMTP credentials are injected via environment variables; no email-sending provider is mandated by this spec.
5. Full-text search is implemented at the database level (MySQL FULLTEXT indexes); Elasticsearch is listed as a post-MVP scalability option.
6. The Workflow/Approval module covers the product approval chain only; general multi-step workflow for other entities is post-MVP.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can complete registration, login, and reach their role-appropriate dashboard in under 60 seconds on first attempt.
- **SC-002**: 95% of authenticated API requests complete in under 500 milliseconds under a load of 500 concurrent users.
- **SC-003**: Product search returns relevant results in under 1 second across a catalogue of 100,000+ products.
- **SC-004**: 100% of create, update, and delete operations produce an immutable audit log entry — verified by automated test suite.
- **SC-005**: The system maintains a token refresh success rate of ≥ 99.9% under continuous load (no user-visible session interruptions).
- **SC-006**: Real-time dashboard cards reflect data changes within 3 seconds of the underlying change being committed.
- **SC-007**: Image uploads of up to 5 MB complete within 5 seconds on a standard broadband connection.
- **SC-008**: 90% of Managers complete a full product-creation and approval-submission workflow on their first attempt without documentation.
