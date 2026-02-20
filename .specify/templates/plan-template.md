# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Frontend — Angular (Latest LTS) / Backend — Java 21 (JDK 21, Virtual Threads)  
**Primary Dependencies**: Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, RxJS, Liquibase  
**Storage**: MySQL 8.0 — all schema changes via Liquibase changesets  
**Testing**: JUnit 5 + Mockito (backend) / Jasmine + Karma (frontend) / Cypress or Playwright (E2E)  
**Target Platform**: Web (REST API server + Angular SPA)  
**Project Type**: Web application (`backend/` + `frontend/` layout)  
**Performance Goals**: p95 API response ≤ 300 ms under nominal load  
**Constraints**: HTTPS-only; JWT tokens required for all protected endpoints; no DDL outside Liquibase  
**Scale/Scope**: Stateless, horizontally scalable services; support multi-role user base (Admin, Manager, Viewer)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

*   [ ] **Principle I — Architecture**: Does the plan adhere to the modular bounded-context structure (Angular feature module + Spring Boot service + dedicated Liquibase changelog per module)?
*   [ ] **Principle II — Tech Stack & Concurrency**: Does the plan use Angular (Latest LTS) + RxJS, Spring Boot 3.x, JDK 21, and are Virtual Threads enabled for all I/O-bound operations?
*   [ ] **Principle III — Database Integrity**: Is every schema change tracked as a Liquibase changeset? Is no ad-hoc DDL permitted?
*   [ ] **Principle IV — Secure REST**: Are all protected endpoints secured via JWT + Spring Security? Does the OpenAPI contract use `/api/v1/…` versioning and a standard error envelope?
*   [ ] **Principle V — TDD**: Does the plan mandate failing tests before implementation? Are unit, integration, and E2E test tasks present?
*   [ ] **Principle VI — Domain Modules**: Does the plan implement the feature within its correct bounded context (Auth, User Mgmt, Product Mgmt, Feature Mgmt, Search, Dashboard, Audit, Notifications, API Layer, Data Validation, or Advanced modules)?

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
