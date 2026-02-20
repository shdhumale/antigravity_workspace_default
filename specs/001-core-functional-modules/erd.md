# Entity Relationship Diagram: Product Management Ecosystem

```mermaid
erDiagram
    USER ||--o{ REFRESH_TOKEN : has
    USER ||--o{ PRODUCT : creates
    USER ||--o{ PRODUCT : approves
    USER ||--o{ AUDIT_LOG : performs
    USER ||--o{ NOTIFICATION : receives
    USER ||--o{ APPROVAL_REQUEST : requests
    USER ||--o{ APPROVAL_REQUEST : reviews

    PRODUCT ||--o{ PRODUCT_IMAGE : contains
    PRODUCT ||--o{ APPROVAL_REQUEST : subject_of
    CATEGORY ||--o{ PRODUCT : classifies
    CATEGORY ||--o{ CATEGORY : parent_of

    USER {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role "ADMIN, MANAGER, VIEWER"
        boolean mfa_enabled
        string mfa_secret
        boolean is_active
        int failed_login_count
        datetime locked_until
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    REFRESH_TOKEN {
        uuid id PK
        uuid user_id FK
        string token_hash
        datetime issued_at
        datetime expires_at
        datetime revoked_at
        uuid replaced_by_id FK
    }

    PRODUCT {
        uuid id PK
        string sku UK
        string name
        string description
        uuid category_id FK
        double price
        int inventory_qty
        string status "DRAFT, PENDING, ACTIVE, REJECTED, ARCHIVED"
        uuid created_by FK
        uuid approved_by FK
        string rejection_reason
        int version "Optimistic Locking"
        datetime created_at
        datetime updated_at
    }

    PRODUCT_IMAGE {
        uuid id PK
        uuid product_id FK
        string storage_url
        int display_order
        datetime uploaded_at
    }

    CATEGORY {
        uuid id PK
        string name
        uuid parent_id FK
        boolean is_active
    }

    AUDIT_LOG {
        bigint id PK
        string entity_type
        string entity_id
        string action "CREATE, UPDATE, DELETE, STATUS_CHANGE"
        uuid performed_by FK
        datetime performed_at
        json old_value
        json new_value
    }

    NOTIFICATION {
        uuid id PK
        uuid recipient_id FK
        string event_type
        string title
        string body
        boolean is_read
        datetime created_at
        datetime read_at
    }

    APPROVAL_REQUEST {
        uuid id PK
        uuid product_id FK
        uuid requested_by FK
        uuid reviewed_by FK
        string status "PENDING, APPROVED, REJECTED"
        string comment
        datetime created_at
        datetime resolved_at
    }
```

## Relationships Summary

1.  **Users & Tokens**: One user can have many refresh tokens (multiple devices/sessions).
2.  **Product Lifecycle**: A product is created by one user (Manager) and approved/rejected by another (Admin).
3.  **Categories**: Hierarchical tree structure where a category can have a parent category.
4.  **Audit & Notifications**: Global tracking of actions linked to users; notifications linked to recipients.
