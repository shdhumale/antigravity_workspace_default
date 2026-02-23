# GEMINI.md - Project Conventions & Architecture

This document defines the core architecture, technology stack, and development conventions for the **Enterprise Product Management System**. All AI agents must strictly adhere to these rules.

## 🏗 High-Level Architecture
- **Backend**: Spring Boot 3.3.x microservice architecture (layered: Controller → Service → Repository → Entity).
- **Frontend**: Angular 18+ (Standalone components, Signals-based reactivity).
- **Database**: MySQL 8.0 for persistence; Redis/Caffeine for caching.
- **Communication**: RESTful API (`/api/v1`) + WebSockets (STOMP) for real-time updates.
- **Security**: Stateless JWT-based authentication with refresh token rotation.

## 🛠 Technology Stack
- **Java 21**: Optimized for Virtual Threads (`spring.threads.virtual.enabled=true`).
- **Spring Boot 3.3.x**: Core framework.
- **Liquibase**: Mandatory database migrations (XML changesets).
- **Spring Security 6**: RBAC (Admin, Manager, Viewer) and JWT filter chain.
- **Angular 18+**: Native control flow, Signals, and OnPush change detection.
- **Tailwind CSS**: Styling, integrated with **Stitch** design tokens.

## 📏 Development Conventions

### Backend (Java/Spring Boot)
1. **Virtual Threads**: All blocking I/O should run on virtual threads.
2. **Layered Architecture**: Strictly separate logic into Controller, Service, and Repository layers.
3. **Optimistic Locking**: Use `@Version` on JPA entities (e.g., `Product`) to prevent concurrency issues.
4. **Audit Logging**: All write operations MUST be audited via Spring AOP (`AuditAspect`).
5. **Exception Handling**: Use `@RestControllerAdvice` with a standardized `ApiErrorResponse` envelope.
6. **Migrations**: Never use `ddl-auto: update`. All schema changes must be in numbered Liquibase changesets under `db/changelog/`.

### Frontend (Angular)
1. **Reactivity**: Use **Signals** for state management. Avoid `RxJS` for simple state; use it only for complex async flows.
2. **Modern Syntax**: Use native control flow (`@if`, `@for`, `@switch`). **NO** `*ngIf` or `*ngFor`.
3. **Performance**: All components should use `ChangeDetectionStrategy.OnPush`.
4. **Styling**: Use utility classes (Tailwind) and reference `stitch` design tokens. Component styles should be minimal.
5. **UI Consistency**: Every screen MUST match the designs provided in the `stitch/` directory.

### API Design
- Prefix all endpoints with `/api/v1`.
- Standardized response envelopes for success and error cases.
- JWT Bearer tokens in `Authorization` header.
- CSRF protection enabled via cookies.

## 🎯 Core Requirements
- **FR-AUTH**: JWT authentication + Refresh token rotation + optional TOTP MFA.
- **FR-USER**: Soft-deletion for users; role-based access control.
- **FR-PROD**: Multi-step creation wizard (Stitch); Status lifecycle (Draft → Pending → Active).
- **FR-SEARCH**: MySQL `MATCH...AGAINST` for full-text search; results under 1s.
- **FR-DASH**: Real-time KPI updates via WebSockets; role-specific views.
- **FR-AUDIT**: Automated logging of all entity modifications.

## 🤖 AI Agent Workflow
1. **TDD First**: Write failing tests before implementation.
2. **Speckit Workflow**: Follow the sequence: `analyze` → `specify` → `plan` → `tasks` → `implement`.
3. **Reference Artifacts**:
    - **PRD**: `PRD.txt`
    - **Designs**: `stitch/[module]/code.html`
    - **Specs**: `specs/001-core-functional-modules/spec.md`
    - **Tasks**: `specs/001-core-functional-modules/tasks.md`
4. **Use Skills**: Apply `angular-component`, `java-spring-boot`, and `spring-boot-application` specialized instructions found in `.agents/skills/`.

---
*Created: 2026-02-23 | Last Updated: 2026-02-23*
