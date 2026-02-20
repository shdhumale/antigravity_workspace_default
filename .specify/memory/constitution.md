<!--
Sync Impact Report:
- Version change: 0.1.0 → 0.2.0
- Modified principles: None (titles unchanged)
- Added sections: Principle VI (Domain-Driven Product Management Modules), expanded Technology Stack detail
- Removed sections: None
- Templates requiring updates:
  - ✅ .specify/templates/plan-template.md  (Constitution Check updated to include Principle VI)
  - ✅ .specify/templates/spec-template.md  (Key Entities section aligned with product domain)
  - ✅ .specify/templates/tasks-template.md (Foundational phase now reflects Liquibase + JWT bootstrap tasks)
- Follow-up TODOs:
  - TODO(TEAM_SIZE): Team composition not specified in PRD.txt — inserted placeholder.
  - TODO(TIMELINE): Project timeline not confirmed — inserted placeholder.
-->

# Product Management Ecosystem Constitution

## Core Principles

### I. Scalability & Modular Architecture
The system MUST be built as a scalable, secure product management ecosystem. All features MUST be
developed as standalone, independently deployable modules. The frontend MUST be Angular (Latest
LTS); the middleware MUST be Spring Boot 3.x (JDK 21). Module boundaries MUST be enforced at
compilation and API contract level so teams can own and scale modules independently.

### II. Modern Tech Stack & High Concurrency
The middleware MUST use Spring Boot 3.x with JDK 21, leveraging **Virtual Threads (Project Loom)**
to handle high-concurrency workloads without blocking thread pools. Virtual Threads are
non-negotiable for all I/O-bound operations (database calls, HTTP client requests). The frontend
MUST utilise Angular (Latest LTS) with **RxJS** for reactive, declarative state management. No
shared mutable state is permitted outside of RxJS Observable streams.

### III. Database Integrity & Schema Versioning
**MySQL 8.0** MUST be used for all persistent data storage. Every schema change — including table
creation, column modifications, index additions, and seed data — MUST be tracked as a numbered
**Liquibase** changeset. No ad-hoc DDL executed outside Liquibase is permitted in any environment.
Migration scripts MUST be idempotent and reversible where technically possible.

### IV. Secure RESTful Communication
All client-server and inter-service communication MUST be over **RESTful APIs** using standard HTTP
semantics (correct verbs, status codes, error shapes). Access control MUST be enforced via
**JWT-based authentication and authorisation** with Spring Security. Tokens MUST carry role claims
used for role-based access control (RBAC). API endpoints that expose sensitive data MUST require a
valid, non-expired token; unauthenticated access MUST return HTTP 401.

### V. Quality & Test-Driven Development
Automated tests are **MANDATORY** at every layer: unit tests (JUnit 5 / Jasmine/Karma), integration
tests (Spring Boot Test / Angular TestBed), and end-to-end tests (e.g., Cypress or Playwright).
TDD (Red → Green → Refactor) is the standard development cycle. Security and data validation MUST
be implemented at all layers. No feature is considered "done" without passing automated tests and
code review. Linting, type-checking, and test gates MUST be enforced in CI before any merge.

### VI. Domain-Driven Product Management Modules
The application MUST implement the following modules, each as a first-class bounded context with
its own Angular feature module, Spring Boot service layer, and dedicated Liquibase changelog:

**Core Functional Modules** (MUST ship for MVP):
- **Authentication & Authorisation** — JWT login/logout, role management (Admin, Manager, Viewer),
  token refresh, and Spring Security integration.
- **User Management** — CRUD for users, role assignment, profile management, password reset.
- **Product Management** — Full product lifecycle: create, read, update, archive. Products carry
  attributes, categories, pricing, and inventory signals.
- **Feature Management** — Feature flags/toggles tied to products, with role-gated visibility.
- **Search & Filtering** — Server-side full-text search and dynamic filter composition across
  products and features.
- **Dashboard** — Aggregated KPI panels per role; data sourced from a dedicated read-optimised
  summary layer.

**Supporting Modules** (MUST ship alongside Core):
- **Audit & Logging** — Immutable audit trail for all create/update/delete operations across every
  entity; structured log format compatible with log aggregation tooling.
- **Notifications** — In-app and (optionally) email notifications triggered by workflow events.
- **API Layer** — Unified API gateway contract with versioning (`/api/v1/…`), standardised error
  envelope, and OpenAPI 3.x documentation.
- **Data Validation** — Bean Validation (Jakarta) on the backend; reactive form validators on the
  frontend; validation errors MUST surface as structured HTTP 422 responses.

**Advanced / Optional Modules** (SHOULD ship post-MVP):
- **Analytics & Reporting** — Trend charts, exportable reports (CSV/PDF).
- **Workflow / Approval** — Multi-step approval chains for product status transitions.
- **Versioning** — Product/feature record versioning with diff and rollback.
- **Integration** — Webhook outbound events and third-party connector hooks.

**Non-Functional Requirements** (cross-cutting, MUST be addressed from day one):
- **Security** — OWASP Top-10 mitigations, HTTPS-only, secrets managed via environment variables.
- **Scalability** — Stateless services; horizontal scaling supported.
- **Performance Monitoring** — Actuator endpoints + Micrometer metrics; p95 API response ≤ 300 ms
  under nominal load.
- **Localisation** — Angular i18n infrastructure in place from the start; UI strings externalised.

## Technology Stack & Constraints

| Layer      | Technology                                  | Version / Notes                         |
|------------|---------------------------------------------|-----------------------------------------|
| Frontend   | Angular + RxJS                              | Latest LTS; Vanilla CSS preferred       |
| Middleware | Spring Boot + Spring Security + Spring Data | 3.x; JDK 21; Virtual Threads enabled   |
| Database   | MySQL + Liquibase                           | MySQL 8.0; Liquibase for all migrations |
| Security   | JWT (JJWT / Spring Security OAuth2)         | RS256 or HS256 with rotation policy     |
| Build      | Maven (backend) / Angular CLI (frontend)    | Enforced formatting + lint in CI        |
| Testing    | JUnit 5, Mockito, Cypress/Playwright        | E2E tests in CI on every PR             |

## Development Workflow

All development MUST follow a **Research → Strategy → Execution** lifecycle:

1. **Research** — Understand domain requirements, check constitution compliance, identify risks.
2. **Strategy** — Design module contracts (OpenAPI first), plan Liquibase changesets, define
   acceptance criteria.
3. **Execution** — Write failing tests first (TDD), implement, refactor, then open PR.

Automated linting, type-checking, and test suites are **mandatory quality gates** before any
feature branch is merged. CI MUST fail on: lint errors, type errors, failing unit tests, failing
integration tests.

## Governance

- This constitution supersedes all other informal practices and verbal agreements.
- Amendments MUST be documented through a version increment and require team consensus.
- All Pull Requests and code reviews MUST verify compliance with each of the six core principles.
- TODO(TEAM_SIZE): Confirm team composition (frontend/backend/full-stack ratio) to refine parallel
  execution strategy in task templates.
- TODO(TIMELINE): Confirm project timeline in months to set milestone-based delivery gates.

**Version**: 0.2.0 | **Ratified**: 2026-02-20 | **Last Amended**: 2026-02-20
