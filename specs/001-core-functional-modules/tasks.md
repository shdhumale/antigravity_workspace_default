# Tasks: Core Functional Modules — Product Management Ecosystem

**Input**: Design documents from `specs/001-core-functional-modules/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are MANDATORY as per the project constitution (Principle V). All implementation tasks must be preceded by failing tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, infrastructure setup, and design validation.

- [X] T001 Create project structure for `backend/` and `frontend/` per implementation plan
- [X] T002 Initialize Spring Boot 3.3.x project in `backend/` with Java 21 and Maven dependencies (Web, Security, JPA, MySQL, Liquibase, JJWT)
- [X] T003 Initialize Angular v20+ project in `frontend/`
- [X] T004 [P] Configure Checkstyle and Maven Enforcer in `backend/pom.xml`
- [X] T005 [P] Configure ESLint and Prettier in `frontend/`
- [X] T006 [P] Create Dockerfile for `backend/` and `frontend/` for consistent local development
- [X] T007 [P] Create `docker-compose.yml` in repository root with MySQL 8.0 and application services
- [X] T008 [P] Design and document ERD for Users, Roles, Products, and AuditLogs in `specs/001-core-functional-modules/erd.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure and security that MUST be complete before ANY user story work begins.
All tasks below are non-negotiable per Constitution Principles II, III, IV, and VI.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T009 Configure MySQL 8.0 datasource in `backend/src/main/resources/application.yml` and initialise `db/changelog/db.changelog-master.xml`
- [X] T010 [P] Enable Virtual Threads in `backend/src/main/resources/application.yml` (`spring.threads.virtual.enabled=true`)
- [X] T011 [P] Implement `GlobalExceptionHandler` and `ApiErrorResponse` in `backend/src/main/java/com/productmgmt/common/exception/`
- [X] T012 Implement `JwtAuthenticationFilter` and `SecurityConfig` in `backend/src/main/java/com/productmgmt/config/` (stateless, JWT filter chain, CSRF enabled with Cookie repository)
- [X] T013 [P] Implement `AuditService` and `AuditLog` entity in `backend/src/main/java/com/productmgmt/audit/` for automated logging
- [X] T014 [P] Scaffold Angular routing module in `frontend/src/app/app.routes.ts` with lazy-loaded feature modules
- [X] T015 [P] Implement `AuthService` and `AuthGuard` in `frontend/src/app/core/` for route protection
- [X] T016 [P] Implement `AuthInterceptor` in `frontend/src/app/core/interceptors/` for JWT attachment and 401 handling
- [X] T017 [P] Set up CI pipeline configuration (GitHub Actions) for linting and unit tests

**Checkpoint**: Foundation ready — Secured by JWT, Virtual Threads enabled, Liquibase running, Angular routing and guards active.

---

## Phase 3: User Story 1 - Secure Login & Token Lifecycle (Priority: P1) 🎯 MVP

**Goal**: Implement secure authentication with JWT access/refresh tokens and logout.

**Independent Test**: Register a user via script, log in via UI, verify dashboard access, wait for refresh, and logout.

### Tests for User Story 1
- [X] T018 [P] [US1] Write failing contract tests for `/api/v1/auth/login` and `/api/v1/auth/refresh` in `backend/src/test/java/com/productmgmt/auth/AuthControllerTest.java`
- [X] T019 [P] [US1] Write failing integration tests for token rotation and logout in `backend/src/test/java/com/productmgmt/integration/AuthIntegrationTest.java`

### Implementation for User Story 1
- [X] T020 [P] [US1] Create `User` entity and Liquibase changeset `001-create-users.xml` mapping to `backend/src/main/java/com/productmgmt/user/model/User.java`
- [X] T021 [P] [US1] Create `RefreshToken` entity and Liquibase changeset `002-create-refresh-tokens.xml` in `backend/src/main/java/com/productmgmt/auth/model/RefreshToken.java`
- [X] T022 [US1] Implement `AuthService` logic for login, token issuance, and rotation in `backend/src/main/java/com/productmgmt/auth/service/AuthService.java`
- [X] T023 [US1] Implement `AuthController` endpoints in `backend/src/main/java/com/productmgmt/auth/controller/AuthController.java`
- [X] T024 [US1] Implement Login component in `frontend/src/app/features/auth/login.component.ts` (matching Stitch `security_and_access_control`)
- [X] T025 [US1] Implement Token Refresh logic in `frontend/src/app/core/services/auth.service.ts`

**Checkpoint**: User Story 1 functional — Authentication and token lifecycle complete.

---

## Phase 4: User Story 2 - User Administration & Role Management (Priority: P1)

**Goal**: Enable Admins to manage users and assign roles.

**Independent Test**: Admin creates a Manager user; verify Manager can log in and view products but Admin can deactivate them to block access.

### Tests for User Story 2
- [X] T026 [P] [US2] Write failing tests for User CRUD and role-based access in `backend/src/test/java/com/productmgmt/user/UserControllerTest.java`

### Implementation for User Story 2
- [X] T027 [US2] Implement `UserService` and `UserRepository` with soft-delete logic in `backend/src/main/java/com/productmgmt/user/`
- [X] T028 [US2] Implement `UserController` for Admin user management in `backend/src/main/java/com/productmgmt/user/controller/UserController.java`
- [X] T029 [US2] Implement User List component in `frontend/src/app/features/users/user-list.component.ts` (matching Stitch `user_management_and_roles`)
- [X] T030 [US2] Implement User Form component in `frontend/src/app/features/users/user-form.component.ts` (matching Stitch `add_new_user_form`)

**Checkpoint**: User Story 2 functional — Admin can manage users and roles.

---

## Phase 5: User Story 3 - Product Catalogue Lifecycle (Priority: P2)

**Goal**: Implement product creation, approval workflow, and archiving.

**Independent Test**: Manager creates product; Admin approves it; verify it becomes ACTIVE in the catalogue.

### Tests for User Story 3
- [X] T031 [P] [US3] Write failing tests for product lifecycle and optimistic locking in `backend/src/test/java/com/productmgmt/product/ProductServiceTest.java`

### Implementation for User Story 3
- [X] T032 [P] [US3] Create `Product`, `Category`, and `ProductImage` entities with Liquibase changesets 003-005 in `backend/src/main/java/com/productmgmt/product/model/`
- [X] T033 [US3] Implement `ProductService` with optimistic locking (`@Version`) in `backend/src/main/java/com/productmgmt/product/service/ProductService.java`
- [X] T034 [US3] Implement `ProductApprovalService` for workflow transitions in `backend/src/main/java/com/productmgmt/product/service/ProductApprovalService.java`
- [X] T035 [US3] Implement `ProductController` and Image Upload endpoint in `backend/src/main/java/com/productmgmt/product/controller/ProductController.java`
- [X] T036 [US3] Implement Product List component in `frontend/src/app/features/products/product-list.component.ts` (matching Stitch `product_management_inventory_listing`)
- [X] T037 [US3] Implement Product Wizard component in `frontend/src/app/features/products/product-wizard.component.ts` (matching Stitch `add_new_product_wizard`)
- [X] T038 [P] [US3] Implement Spring Caching for Product Categories using `@Cacheable` in `ProductService`

**Checkpoint**: User Story 3 functional — Complete product lifecycle with approval.

---

## Phase 6: User Story 4 - Multi-Criteria Product Search & Filtering (Priority: P2)

**Goal**: Provide full-text and filtered search for products.

**Independent Test**: Search for "Widget" with "Active" status and "Price < 100"; verify correct paginated results return in <1s.

### Tests for User Story 4
- [X] T039 [P] [US4] Write failing unit tests for `SearchService` query composition in `backend/src/test/java/com/productmgmt/search/SearchServiceTest.java`

### Implementation for User Story 4
- [X] T040 [US4] Implement `SearchService` using MySQL `MATCH...AGAINST` for FTS in `backend/src/main/java/com/productmgmt/search/service/SearchService.java`
- [X] T041 [US4] Implement `SearchController` and `SearchRequest` DTO in `backend/src/main/java/com/productmgmt/search/controller/SearchController.java`
- [X] T042 [US4] Implement Search Bar and Filter Panel components in `frontend/src/app/features/products/search/` matching Stitch design tokens

**Checkpoint**: User Story 4 functional — High-performance product discovery.

---

## Phase 7: User Story 5 - Role-Specific Dashboard (Priority: P3)

**Goal**: Personalised real-time KPI dashboards for different roles.

**Independent Test**: Log in as Admin; verify KPI cards update automatically when a new product is approved in another session.

### Implementation for User Story 5
- [X] T043 [US5] Implement `DashboardService` for KPI aggregation in `backend/src/main/java/com/productmgmt/dashboard/service/DashboardService.java`
- [X] T044 [US5] Configure WebSocket (STOMP over SockJS) in `backend/src/main/java/com/productmgmt/config/WebSocketConfig.java`
- [X] T045 [US5] Implement Dashboard component with real-time signal updates in `frontend/src/app/features/dashboard/dashboard.component.ts` (matching Stitch `admin_analytics_dashboard`)

**Checkpoint**: User Story 5 functional — Real-time insights delivered per role.

---

## Phase 8: User Story 6 - Audit Trail & Notification Events (Priority: P3)

**Goal**: Immutable audit logs and in-app/email notifications for key events.

**Independent Test**: Archive a product; verify audit log entry exists and the Manager receives an in-app notification.

### Implementation for User Story 6
- [X] T046 [P] [US6] Implement `AuditAspect` to capture all service writes in `backend/src/main/java/com/productmgmt/audit/aspect/AuditAspect.java`
- [X] T047 [US6] Implement `NotificationService` for in-app alerts in `backend/src/main/java/com/productmgmt/notification/service/NotificationService.java`
- [X] T048 [US6] Implement `EmailService` with retry logic in `backend/src/main/java/com/productmgmt/notification/service/EmailService.java`
- [X] T049 [US6] Implement Audit Log viewer component in `frontend/src/app/features/audit/audit-log.component.ts`

**Checkpoint**: All user stories functional — System is fully auditable and reactive.

---

## Phase 9: Polish & Hardening

**Purpose**: Final security, performance, and localization hardening.

- [ ] T050 [P] Remediate security findings from OWASP ZAP automated scans
- [ ] T051 [P] Implement i18n localization in `frontend/src/i18n/` (matching Stitch `system_settings_and_localization`)
- [ ] T052 Configure Micrometer metrics and Actuator health probes in `backend/`
- [ ] T053 Run full `quickstart.md` validation sequence on a fresh environment
- [ ] T054 [P] Update developer documentation and API reference in `docs/`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on T001–T003. **BLOCKS all user stories.**
- **User Stories (Phase 3+)**: All depend on Phase 2 completion.
  - US1 (Phase 3) is the primary MVP target.
  - US2-US6 can proceed in priority order.

### User Story Dependencies
- **US1 (Auth)**: Pre-requisite for all other authenticated user interactions.
- **US3 (Product)**: Pre-requisite for US4 (Search) and US5 (Dashboard).

### Parallel Opportunities
- All tasks marked **[P]** within a phase can be performed in parallel.
- Once Phase 2 completes, different developers can start on US1, US2, and US3 in parallel.

---

## Implementation Strategy

### MVP First (Authentication & Foundation)
1. Complete Phase 1 & 2.
2. Complete Phase 3 (US1).
3. **STOP and VALIDATE**: Verify login and token lifecycle.

### Parallel Team Strategy
- **Developer 1**: Backend services (Auth, User, Product).
- **Developer 2**: Angular components (Stitch implementation using signals).
- **Developer 3**: Infrastructure, DevOps (Docker, CI/CD, Liquibase).

---

## Notes
- [P] tasks = different files, no dependencies.
- [USx] label maps task to specific user story.
- Every implementation task includes writing the test FIRST.
- Angular components MUST use `angular-component` skill (Signals, OnPush, Native control flow).
- Backend MUST use Java 21 Virtual Threads and layered architecture.
