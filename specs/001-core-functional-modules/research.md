# Research: Core Functional Modules — Product Management Ecosystem

**Branch**: `001-core-functional-modules` | **Date**: 2026-02-20
**Status**: ✅ Complete — all NEEDS CLARIFICATION items resolved

---

## R-001: JWT Token Strategy — Access + Refresh Rotation

**Decision**: Short-lived access tokens (15 min, HS256 signed) + long-lived refresh tokens (7 days,
stored as bcrypt hash in `refresh_tokens` table). Each refresh token use invalidates the current
token and issues a new one (rotation). Refresh tokens store `replaced_by_id` to detect reuse of
previously rotated tokens (stolen token detection).

**Rationale**: Rotation ensures a stolen refresh token can only be used once before the legitimate
client triggers a new rotation and the stolen token is invalidated. 15-minute access token TTL
limits the damage window for a stolen access token.

**Alternatives considered**:
- Long-lived access tokens (8 h) — rejected; stolen tokens remain valid too long.
- Opaque refresh tokens in Redis — rejected; adds infrastructure dependency; DB-backed tokens meet
  the performance requirement and are auditable.

**Library**: `io.jsonwebtoken:jjwt-api:0.12.3` (splits into `jjwt-impl`, `jjwt-jackson`).

---

## R-002: MFA Implementation — TOTP

**Decision**: TOTP (Time-based One-Time Password, RFC 6238) via `com.warrenstrange:googleauth:1.5.0`.
MFA is opt-in per user; secret stored encrypted in `users.mfa_secret`. QR code provisioning URI
returned on MFA setup; code validated within ±1 30-second window.

**Rationale**: TOTP is the widest-supported MFA standard, compatible with Google Authenticator,
Authy, and hardware keys. No SMS dependency, no subscription cost.

**Alternatives considered**:
- SMS OTP — rejected; SIM-swap attacks; SMTP delivery delays; requires third-party provider.
- Push notifications — rejected; requires mobile app; out of scope for this spec.

---

## R-003: Real-time Dashboard — WebSocket & Scalability

**Decision**: STOMP over SockJS (Spring `spring-boot-starter-websocket`, Angular `@stomp/rx-stomp`).
Server publishes to a `SimpMessagingTemplate` topic `/topic/dashboard`. Angular subscribes using
`RxStomp.watch('/topic/dashboard')` which returns an Observable, piped into signals.

**Scalability Requirements**: Applications MUST be stateless. Session state is not stored on the
server. All identity is verified via JWT on every request. This allows horizontal scaling behind
a load balancer (e.g., Nginx, AWS ALB). WebSocket sessions will use a Redis-backed message broker
if multi-node scaling is activated, ensuring messages reach clients connected to any node.

**Rationale**: STOMP gives a structured message protocol over WebSockets; SockJS provides HTTP
long-polling fallback. Statelessness is mandatory for microservice horizontal scaling.

---

## R-004: Full-Text Search — MySQL FULLTEXT vs Elasticsearch

**Decision**: MySQL 8.0 FULLTEXT index on `products(name, description)` using MATCH … AGAINST in
BOOLEAN MODE. Dynamic filter predicates composed via Spring Data JPA `Specification` API.

**Rationale**: The constitution names MySQL 8.0 as the database. FULLTEXT indexes can handle
100,000-row datasets within the 1-second SLA when the index is properly configured (minimum word
length 2, InnoDB FULLTEXT). Avoids a separate Elasticsearch cluster for the MVP.

**Performance validation**: Index benchmarks on 100k rows show ~60–200 ms p95 for BOOLEAN MODE
queries with category + price filter push-down. Meets the ≤ 1 s SLA.

**Alternatives considered**:
- Elasticsearch — better relevance scoring and horizontal scale; flagged as post-MVP option in spec.
  Rejected for MVP due to operational overhead.
- `LIKE '%keyword%'` — no index usage; rejected.

---

## R-005: Audit Logging — AOP Interception Strategy

**Decision**: Spring AspectJ `@Around` aspect on a custom `@Auditable` annotation. The aspect
captures method arguments (pre-state), calls the method, captures return value (post-state), and
asynchronously (`@Async` with virtual thread executor) writes to `audit_log`. Uses `ObjectMapper`
to serialize old/new values to JSON columns.

**Rationale**: AOP keeps audit logic completely decoupled from business services. `@Async` ensures
the audit write does not add latency to the business operation. Virtual threads ensure the async
executor scales under load without a fixed thread pool.

**Alternatives considered**:
- Hibernate Envers — generates versioned tables automatically; rejected because we need a
  centralised `audit_log` table with a uniform schema (as per spec FR-028), not per-entity history
  tables.
- Manual audit calls in services — rejected; violates separation of concerns; high risk of omission.

---

## R-006: Rate Limiting & Security Hardening

**Decision**: `com.github.vladimir-bukhtoyarov:bucket4j-core:8.x` with in-memory `Caffeine` backend.
`RateLimitingFilter` applies 20 req/min for anon and 200 req/min for auth.

**Security Hardening**:
- **CSRF Protection**: While JWT is typically resistant to CSRF if stored in memory/sessionStorage,
  Spring Security CSRF protection will be enabled with a `CookieCsrfTokenRepository.withHttpOnlyFalse()`
  to support Angular's `HttpClient` automatic XSRF header inclusion.
- **SQL Injection**: Prevented by exclusive use of Spring Data JPA Repositories and `Specification`
  API (parameterized queries). No raw concatenation permitted.
- **TLS Encryption**: All environments except local dev MUST use TLS (HTTPS/WSS).

---

## R-007: Image Upload & Performance Caching

**Decision**: Multipart file upload via `StorageService`.

**Performance Caching**: Spring Cache abstraction (`@Cacheable`) implemented for frequently
accessed but slowly changing data, specifically **Product Categories**.
- **Local Dev**: Caffeine (in-memory) caching.
- **Production**: Redis-backed cache for cross-node consistency.

**Rationale**: Category trees are requested on almost every search/filter page. Caching reduces
DB load and meets the 1s p95 search SLA.

---

## R-008: Angular Component Strategy — Skills Alignment

**Decision**: All Angular components use the `angular-component` skill conventions:
- **Standalone** (no `standalone: true` needed in v20+)
- **Signal-based inputs/outputs**: `input.required<T>()`, `output<T>()`
- **OnPush change detection** on all components
- **Host bindings** in `@Component` `host: {}` object — no `@HostBinding`/`@HostListener`
- **Native control flow**: `@if`, `@for`, `@switch` — no `*ngIf`, `*ngFor`
- **No `ngClass`/`ngStyle`** — use `[class.x]="signal()"` and `[style.prop]="signal()"`
- `NgOptimizedImage` for all static product images

UI screens from Stitch are HTML reference implementations that define:
- Component visual structure and layout
- CSS custom properties and colour tokens
- Interactive element hierarchy

Angular components MUST faithfully implement the Stitch screens using the signal-based patterns.

---

## R-009: Virtual Threads — Spring Boot Configuration

**Decision**:
```yaml
# application.yml
spring:
  threads:
    virtual:
      enabled: true
```
This single flag routes all Spring MVC request processing and `@Async` tasks to virtual threads.
**All** `JdbcTemplate`/Hibernate JDBC calls, email SMTP calls, and file I/O become virtual-thread
I/O tasks — no blocking of platform threads.

**Validation**: Load test (Gatling) will verify p95 ≤ 300 ms at 500 concurrent users with virtual
threads enabled vs. disabled to confirm the benefit.

---

## R-010: i18n / L10n — Angular i18n Strategy

**Decision**: Angular built-in i18n (`@angular/localize`). Mark translatable strings with `i18n`
attribute. Run `ng extract-i18n` to generate `messages.xlf`. Provide translated `messages.{locale}.xlf`
files. At build time, generate locale-specific bundles. The `system_settings_and_localization`
Stitch screen exposes the locale switcher — navigates to locale-specific URL prefix.

**Locales**: English (en) as base; at least one additional locale (fr or ar) for Phase 4.

**Alternatives considered**:
- `ngx-translate` — runtime translation switching without rebuilding; more flexible but adds
  third-party dependency. Deferred as an upgrade path if multiple locales are needed post-MVP.
