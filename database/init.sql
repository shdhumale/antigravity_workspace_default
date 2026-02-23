-- ========================================================
-- Enterprise Product Management System - Database Schema
-- Database: MySQL 8.0
-- Created: 2026-02-23
-- ========================================================

-- 1. Create Database
CREATE DATABASE IF NOT EXISTS productmgmt;
USE productmgmt;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'MANAGER', 'VIEWER') NOT NULL DEFAULT 'VIEWER',
    mfa_enabled TINYINT(1) NOT NULL DEFAULT 0,
    mfa_secret VARCHAR(255) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    failed_login_count INT NOT NULL DEFAULT 0,
    locked_until DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Refresh Tokens Table (Token Rotation & Security)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    issued_at DATETIME NOT NULL,
    expires_at DATETIME NOT NULL,
    revoked_at DATETIME NULL,
    replaced_by_id VARCHAR(36) NULL,
    CONSTRAINT fk_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tokens_replacement FOREIGN KEY (replaced_by_id) REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    INDEX idx_tokens_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    parent_id VARCHAR(36) NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(36) PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    category_id VARCHAR(36) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    inventory_qty INT NOT NULL DEFAULT 0,
    status ENUM('DRAFT', 'PENDING', 'ACTIVE', 'REJECTED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    rejection_reason TEXT NULL,
    created_by VARCHAR(36) NOT NULL,
    approved_by VARCHAR(36) NULL,
    version INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_creator FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_products_approver FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_products_status (status),
    INDEX idx_products_category (category_id),
    INDEX idx_products_price (price),
    INDEX idx_products_created_by (created_by),
    FULLTEXT INDEX ft_products_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    storage_url VARCHAR(1000) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_images_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Audit Log Table (Immutable)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    action ENUM('CREATE', 'UPDATE', 'DELETE', 'STATUS_CHANGE') NOT NULL,
    performed_by VARCHAR(36) NOT NULL,
    performed_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    old_value JSON NULL,
    new_value JSON NOT NULL,
    CONSTRAINT fk_audit_user FOREIGN KEY (performed_by) REFERENCES users(id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_actor (performed_by),
    INDEX idx_audit_time (performed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_id VARCHAR(36) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME NULL,
    CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_recipient (recipient_id),
    INDEX idx_notifications_unread (recipient_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Approval Requests Table
CREATE TABLE IF NOT EXISTS approval_requests (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    requested_by VARCHAR(36) NOT NULL,
    reviewed_by VARCHAR(36) NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    comment TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    CONSTRAINT fk_approvals_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_approvals_requester FOREIGN KEY (requested_by) REFERENCES users(id),
    CONSTRAINT fk_approvals_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_approvals_product (product_id),
    INDEX idx_approvals_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- Seed Data
-- ========================================================

-- Insert Initial Admin User
-- Password: 'AdminPassword123!' (Pre-hashed with BCrypt, 12 rounds)
INSERT INTO users (id, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES (
    UUID(), 
    'admin@productmgmt.com', 
    '$2a$12$R9h/lSAbvpyK7931q9p4UeM1Jq2r0X6XpM9kP1Q7f2f1R7q7y5W.G', 
    'System', 
    'Administrator', 
    'ADMIN', 
    1, 
    NOW(), 
    NOW()
);

-- Insert Sample Category
INSERT INTO categories (id, name, parent_id, is_active, created_at)
VALUES (UUID(), 'Electronics', NULL, 1, NOW());
