# Enterprise Product Management System

A premium, full-stack enterprise application for global product catalogue management, real-time inventory tracking, and role-based administration. Built with a focus on auditability, performance, and modern design aesthetics.

---

## 🚀 Key Modules & Features

### 🔐 Identity & Access (Auth)
- **JWT-based Authentication**: Stateless security with dual-token rotation (Access & Refresh tokens).
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for `MANAGER`, `ADMIN`, and `SUPER_ADMIN`.
- **Secure Password Hashing**: Powered by BCrypt.

### 📦 Product Catalogue (IMS)
- **Lifecycle Management**: Structured workflow from `DRAFT` to `ACTIVE` with approval gates.
- **Optimistic Locking**: Prevents data collision in high-concurrency environments using JPA versioning.
- **Category Management**: Hierarchical categorization with Caffeine-backed high-speed caching.
- **Multi-step Creation Wizard**: A premium UI wizard for standardized product entry.

### 🔍 Advanced Search & Discovery
- **Full-Text Search (FTS)**: High-performance product discovery using MySQL `MATCH...AGAINST`.
- **Real-time Filtering**: Dynamic search-as-you-type experience.

### 📊 Real-Time Analytics
- **Live KPI Dashboard**: Role-specific dashboards with real-time stats updates over WebSockets (STOMP).
- **Status Monitoring**: Visual system health and inventory alerts.

### 🛡️ Governance & Audit
- **Automatic Audit Trail**: Non-intrusive auditing of all service writes using Spring AOP.
- **Resilient Notifications**: In-app alerts via WebSockets and email notifications with automatic retry logic.

---

## 🛠 Tech Stack

### Backend
- **Core**: Java 21 (Optimized for Virtual Threads), Spring Boot 3.3.x
- **Persistence**: Spring Data JPA, Hibernate, MySQL 8
- **Security**: Spring Security, JJWT
- **Integrations**: Liquibase (Migrations), Caffeine (Caching), Spring Retry, Spring AOP
- **Real-time**: Spring WebSocket (STOMP over SockJS)

### Frontend
- **Framework**: Angular 18 (Signals-based reactivity, Standalone components)
- **Styling**: Tailwind CSS (Integrated with premium Stitch design tokens)
- **State Management**: Angular Signals & RxJS for reactive data flows
- **Design System**: Custom design system inspired by enterprise-grade aesthetics (Stitch).

---

## 🏁 Getting Started

### Prerequisites
- JDK 21+
- Node.js 20 LTS+
- MySQL 8.0+
- Maven 3.9+

### 1. Database Setup
Create the database and user:
```sql
CREATE DATABASE product_mgmt;
CREATE USER 'pmapp'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON product_mgmt.* TO 'pmapp'@'localhost';
```

### 2. Backend Setup
Configure your environment variables (or update `application-local.properties`) and run:
```bash
cd backend
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 3. Frontend Setup
Install dependencies and start the development server:
```bash
cd frontend
npm install
npm start
```
The application will be available at `http://localhost:4200`.

---

## 📂 Project Structure

```text
├── backend/            # Spring Boot application
│   ├── src/main/java/  # Layered architecture (Controller, Service, Repository, Model)
│   └── src/main/resources/db/changelog/  # Liquibase migration scripts
├── frontend/           # Angular 18 application
│   ├── src/app/core/   # Services, Guards, Interceptors
│   └── src/app/features/ # Feature-based modules (Products, Users, Dashboard, etc.)
├── specs/              # Technical specifications and task tracking
└── stitch/             # Design reference and HTML/CSS snippets
```

---

## 🛡 Security & Quality
- **OWASP Alignment**: Remediated for common vulnerabilities (JWT hijacking, SQL Injection).
- **Automated CI**: Full-stack testing suite including JUnit 5, Mockito, and Angular unit tests.
- **Audit Logs**: Every write operation is recorded for compliance.

---

## 📝 License
Proprietary. Developed by the Advanced Agentic Coding Team.
