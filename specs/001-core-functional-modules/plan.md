# Implementation Plan: Core Functional Modules — Product Management Ecosystem

**Branch**: `001-core-functional-modules` | **Date**: 2026-02-20 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-core-functional-modules/spec.md`

---

## Summary

Build the complete product management ecosystem across 4 development phases (8 sprints):
- **Phase 1 (Sprints 1–2)**: Foundation — MySQL + Liquibase schema, Spring Security + JWT Auth service, Angular base scaffold with interceptors and route guards.
- **Phase 2 (Sprints 3–5)**: Core Features — User & Product CRUD microservices, Search/Filter engine.
- **Phase 3 (Sprints 6–7)**: Supporting & Advanced — AOP-based Audit logging, SMTP Notification engine, WebSocket-powered Analytics Dashboard.
- **Phase 4 (Sprint 8)**: Hardening — Security penetration testing remediation, i18n/l10n implementation.

UI/UX contracts are provided via the Stitch design system (8 screens: `admin_analytics_dashboard`,
`add_new_product_wizard`, `add_new_user_form`, `product_management_inventory_listing`,
`security_and_access_control`, `user_management_and_roles`, `advanced_analytics_and_reporting`,
`system_settings_and_localization`). Angular components MUST match these screens.

Skills applied:
- `angular-component` (v20+ signals, OnPush, host bindings, native control flow — NO `*ngIf`/`*ngFor`)
- `java-spring-boot` (Spring Boot 3.x, JWT filter chain, `@RestControllerAdvice`, Micrometer)
- `spring-boot-application` (layered architecture: Controller → Service → Repository → Entity)

---

## Technical Context

**Language/Version**: Frontend — Angular (Latest LTS, v20+) / Backend — Java 21 (JDK 21, Virtual Threads)
**Primary Dependencies**: Spring Boot 3.3.x, Spring Security 6, Spring Data JPA, JJWT 0.12.x, Liquibase 4.x, RxJS 7.x, WebSocket (STOMP), Redis / Caffeine (Caching)
**Storage**: MySQL 8.0 (Schema via Liquibase); Redis (Production caching/session relay)
**Scalability**: Stateless microservices; Horizontally scalable; Load balancer ready.
**Security**: CSRF enabled (Cookie-based); SQLi prevention via JPA; TLS mandatory in non-local envs.
**Performance**: Caching for categories; p95 ≤ 300ms.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked post-design below.*

- [x] **Principle I — Architecture**: Each module (Auth, User, Product, Search, Dashboard, Audit, Notifications) is an independent Angular lazy-loaded feature module backed by its own Spring Boot service layer and Liquibase changelog file.
- [x] **Principle II — Tech Stack & Concurrency**: Angular Latest LTS + RxJS; Spring Boot 3.3.x / JDK 21; `spring.threads.virtual.enabled=true` verified; all repository calls run on virtual threads.
- [x] **Principle III — Database Integrity**: Zero ad-hoc DDL; all 8 entities have numbered Liquibase changesets under `db/changelog/`; `ddl-auto: validate`.
- [x] **Principle IV — Secure REST**: All endpoints under `/api/v1/`; JWT `OncePerRequestFilter` validates Bearer token; `@PreAuthorize` guards at method level; standard error envelope on all responses.
- [x] **Principle V — TDD**: Failing tests written before each implementation task; JUnit 5 unit + `@SpringBootTest` integration + Cypress E2E; CI gates: Checkstyle + ESLint + all tests must pass.
- [x] **Principle VI — Domain Modules**: Plan covers all 10 required bounded contexts: Auth & AuthZ, User Mgmt, Product Mgmt, Feature Mgmt scaffold, Search & Filter, Dashboard, Audit & Logging, Notifications, API Layer, Data Validation.

**Constitution Check post-design**: ✅ All gates pass. No violations.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-core-functional-modules/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   ├── auth-api.yaml
│   ├── user-api.yaml
│   ├── product-api.yaml
│   ├── search-api.yaml
│   ├── dashboard-api.yaml
│   └── audit-api.yaml
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
backend/
├── pom.xml
└── src/
    ├── main/
    │   ├── java/com/productmgmt/
    │   │   ├── ProductMgmtApplication.java      ← @SpringBootApplication, virtual threads config
    │   │   ├── config/
    │   │   │   ├── SecurityConfig.java           ← JWT filter chain, CORS, stateless
    │   │   │   ├── WebSocketConfig.java          ← STOMP/SockJS broker
    │   │   │   └── OpenApiConfig.java            ← Springdoc OpenAPI 3.x
    │   │   ├── auth/
    │   │   │   ├── controller/AuthController.java
    │   │   │   ├── service/AuthService.java
    │   │   │   ├── service/JwtService.java
    │   │   │   ├── service/MfaService.java
    │   │   │   ├── model/RefreshToken.java
    │   │   │   └── dto/LoginRequest.java, TokenResponse.java
    │   │   ├── user/
    │   │   │   ├── controller/UserController.java
    │   │   │   ├── service/UserService.java
    │   │   │   ├── repository/UserRepository.java
    │   │   │   ├── model/User.java               ← implements UserDetails
    │   │   │   └── dto/CreateUserRequest.java, UserResponse.java
    │   │   ├── product/
    │   │   │   ├── controller/ProductController.java
    │   │   │   ├── service/ProductService.java
    │   │   │   ├── service/ProductApprovalService.java
    │   │   │   ├── repository/ProductRepository.java
    │   │   │   ├── model/Product.java            ← @Version for optimistic locking
    │   │   │   ├── model/ProductImage.java
    │   │   │   ├── model/Category.java
    │   │   │   └── dto/CreateProductRequest.java, ProductResponse.java
    │   │   ├── search/
    │   │   │   ├── controller/SearchController.java
    │   │   │   ├── service/SearchService.java
    │   │   │   └── dto/SearchRequest.java, SearchResponse.java
    │   │   ├── dashboard/
    │   │   │   ├── controller/DashboardController.java
    │   │   │   ├── service/DashboardService.java
    │   │   │   └── websocket/DashboardWebSocketHandler.java
    │   │   ├── audit/
    │   │   │   ├── aspect/AuditAspect.java       ← Spring AOP @Around
    │   │   │   ├── service/AuditService.java
    │   │   │   ├── repository/AuditLogRepository.java
    │   │   │   └── model/AuditLog.java
    │   │   ├── notification/
    │   │   │   ├── service/NotificationService.java
    │   │   │   ├── service/EmailService.java     ← SMTP + retry
    │   │   │   └── model/Notification.java
    │   │   └── common/
    │   │       ├── exception/GlobalExceptionHandler.java  ← @RestControllerAdvice
    │   │       ├── dto/ApiErrorResponse.java
    │   │       └── security/JwtAuthenticationFilter.java
    │   └── resources/
    │       ├── application.yml
    │       ├── application-local.yml
    │       └── db/changelog/
    │           ├── db.changelog-master.xml
    │           ├── 001-create-users.xml
    │           ├── 002-create-refresh-tokens.xml
    │           ├── 003-create-categories.xml
    │           ├── 004-create-products.xml
    │           ├── 005-create-product-images.xml
    │           ├── 006-create-audit-log.xml
    │           ├── 007-create-notifications.xml
    │           └── 008-create-approval-requests.xml
    └── test/java/com/productmgmt/
        ├── auth/AuthServiceTest.java, AuthControllerTest.java
        ├── user/UserServiceTest.java
        ├── product/ProductServiceTest.java, ProductApprovalServiceTest.java
        ├── search/SearchServiceTest.java
        ├── audit/AuditAspectTest.java
        └── integration/AuthIntegrationTest.java, ProductIntegrationTest.java

frontend/
├── package.json
├── angular.json
└── src/
    ├── app/
    │   ├── app.config.ts                        ← provideRouter, provideHttpClient, provideAnimations
    │   ├── app.routes.ts                        ← lazy-loaded feature routes
    │   ├── core/
    │   │   ├── interceptors/auth.interceptor.ts ← JWT attach + 401 handler
    │   │   ├── guards/auth.guard.ts
    │   │   ├── guards/role.guard.ts
    │   │   ├── services/auth.service.ts
    │   │   └── models/user.model.ts
    │   ├── features/
    │   │   ├── auth/                            ← login, register screens (stitch: security_and_access_control)
    │   │   ├── users/                           ← stitch: user_management_and_roles, add_new_user_form
    │   │   ├── products/                        ← stitch: product_management_inventory_listing, add_new_product_wizard
    │   │   ├── search/
    │   │   ├── dashboard/                       ← stitch: admin_analytics_dashboard
    │   │   ├── analytics/                       ← stitch: advanced_analytics_and_reporting
    │   │   └── settings/                        ← stitch: system_settings_and_localization
    │   └── shared/
    │       ├── components/                      ← reusable: data-table, status-badge, confirm-dialog
    │       └── pipes/
    ├── assets/
    └── i18n/                                    ← Angular i18n extraction files
```

**Structure Decision**: Web application layout (`backend/` + `frontend/`). Each feature is a lazy-loaded Angular module mapped 1:1 to a stitch UI screen and a Spring Boot bounded context.

---

## Development Phases

### Phase 1: Foundation (Sprints 1–2)

**Goal**: Deployable skeleton — JWT auth, Liquibase schema, Angular scaffold with guards.

**Sprint 1 deliverables**:
- MySQL schema via Liquibase (changesets 001–008)
- `User` entity + BCrypt password storage
- `AuthController`: `/api/v1/auth/login`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`
- `JwtService`: access token (15 min) + refresh token rotation (7 day)
- `MfaService`: TOTP generation/validation
- Angular: `app.config.ts`, route scaffold, `auth.interceptor.ts`, `auth.guard.ts`, login screen

**Sprint 2 deliverables**:
- Account lockout logic (3 failed → 15 min lock)
- `GlobalExceptionHandler` (`@RestControllerAdvice`) with `ApiErrorResponse` envelope
- Rate limiting (Bucket4j: 20 req/min anonymous, 200 req/min authenticated)
- Virtual Threads enabled and load-tested
- Angular: `role.guard.ts`, role-scoped routing, shared `data-table` component
- CI pipeline: Checkstyle, ESLint, unit test gate

---

### Phase 2: Core Features (Sprints 3–5)

**Sprint 3 — User Management**:
- `UserController`, `UserService`, `UserRepository` (soft-delete via `deleted_at`)
- Role assignment, profile update, welcome email on account creation
- Angular: `user_management_and_roles` screen (stitch), `add_new_user_form` screen (stitch)
- Unit tests: `UserServiceTest`, `UserControllerTest`

**Sprint 4 — Product Management**:
- `ProductController`, `ProductService`, `ProductApprovalService`
- Product status lifecycle state machine (DRAFT → PENDING → ACTIVE/REJECTED → ARCHIVED)
- Image upload (multipart, ≤5 MB, ≤10 images), optimistic locking (`@Version`)
- `ApprovalRequest` entity + approval/rejection workflow
- Angular: `product_management_inventory_listing` screen (stitch), `add_new_product_wizard` screen (stitch)
- Unit + integration tests: `ProductServiceTest`, `ProductApprovalServiceTest`

**Sprint 5 — Search & Filtering**:
- `SearchController`, `SearchService` with MySQL FULLTEXT index queries
- Multi-criteria filter composition (category, price range, status, creator)
- Paginated results (default 20/page, consistent ordering)
- Performance validation: ≤1 s for 100k product dataset
- Angular: search bar + filter panel component (integrated into product listing screen)

---

### Phase 3: Supporting & Advanced (Sprints 6–7)

**Sprint 6 — Audit Logging & Notifications**:
- `AuditAspect` (`@Around` on all `@Service` write methods) → writes to `audit_log` table
- `AuditController`: queryable/filterable log with CSV export
- `NotificationService`: in-app notification creation
- `EmailService`: SMTP send with 3-retry exponential back-off
- Angular: notification bell + in-app notification panel

**Sprint 7 — Analytics Dashboard**:
- `DashboardService`: KPI aggregation queries (total users, products by status)
- `DashboardWebSocketHandler`: STOMP over SockJS, broadcasts on entity events
- Angular: `admin_analytics_dashboard` screen (stitch) — signal-based reactive updates via WebSocket
- Angular: `advanced_analytics_and_reporting` screen (stitch) — charts, CSV/PDF export
- Angular: `system_settings_and_localization` screen (stitch) — i18n locale switcher

---

### Phase 4: Hardening (Sprint 8)

- OWASP ZAP automated scan; remediate all Critical/High findings
- HTTPS enforcement, `Strict-Transport-Security` header, `Content-Security-Policy`
- Angular i18n extraction (`ng extract-i18n`) + translation files for 2 locales minimum
- Actuator + Micrometer metrics endpoint; Prometheus scrape config
- Load test: Gatling scenario — 500 concurrent users, 95th percentile ≤ 300 ms
- Final E2E Cypress suite covering all 6 user stories from spec

---

## Complexity Tracking

> No constitution violations requiring justification. All entries below are documenting justified design choices.

| Decision | Rationale | Alternative Rejected Because |
|---|---|---|
| Spring AOP `@Around` for audit | Intercepts all service writes without touching business logic | Manual audit calls in each service — brittle, high maintenance |
| STOMP/SockJS for dashboard | Bidirectional, works through proxies, Angular has mature client | SSE — unidirectional; polling — too costly at scale |
| MySQL FULLTEXT over Elasticsearch | Spec allows database-level FTS for MVP; avoids extra infrastructure | Elasticsearch adds ops overhead; FULLTEXT meets 1 s SLA for 100k rows |
| Optimistic locking (`@Version`) | Prevents lost updates without pessimistic DB locks | Pessimistic locking — blocks concurrent reads, hurts throughput |
| Liquibase over Flyway | Specified in constitution; XML changesets are rollback-friendly | Flyway — lacks rollback support in community edition |
