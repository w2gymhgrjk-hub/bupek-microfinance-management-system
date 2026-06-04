# System Architecture - BUPEK Microfinance Management System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│              Next.js + React + TypeScript               │
│                   (Port 3000)                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/HTTPS
                     │
┌────────────────────▼────────────────────────────────────┐
│                  API Gateway Layer                       │
│            Express.js API Server                         │
│                  (Port 5000)                             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Route Layer                                     │  │
│  │  - Authentication Routes                        │  │
│  │  - User Management Routes                       │  │
│  │  - Branch Management Routes                     │  │
│  │  - Client Management Routes                     │  │
│  │  - Loan Management Routes                       │  │
│  │  - Repayment Routes                             │  │
│  │  - Collection Routes                            │  │
│  │  - Report Routes                                │  │
│  │  - Dashboard Routes                             │  │
│  │  - SMS Routes                                   │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                │  │
│  │  - Authentication Middleware (JWT)              │  │
│  │  - Authorization Middleware (RBAC)              │  │
│  │  - Validation Middleware                        │  │
│  │  - Error Handler Middleware                     │  │
│  │  - Logging Middleware                           │  │
│  │  - CORS Middleware                              │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Controller Layer                                │  │
│  │  - Auth Controller                              │  │
│  │  - User Controller                              │  │
│  │  - Branch Controller                            │  │
│  │  - Client Controller                            │  │
│  │  - Loan Controller                              │  │
│  │  - Repayment Controller                         │  │
│  │  - Collection Controller                        │  │
│  │  - Report Controller                            │  │
│  │  - Dashboard Controller                         │  │
│  │  - SMS Controller                               │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Service Layer (Business Logic)                 │  │
│  │  - Authentication Service                       │  │
│  │  - User Service                                 │  │
│  │  - Branch Service                               │  │
│  │  - Client Service                               │  │
│  │  - Loan Service                                 │  │
│  │  - Repayment Service                            │  │
│  │  - Collection Service                           │  │
│  │  - Report Service                               │  │
│  │  - SMS Service                                  │  │
│  └──────────────────────────────────────────────────┘  │
│                       ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Data Access Layer (Models & Queries)           │  │
│  │  - Database Connection                          │  │
│  │  - Query Builders                               │  │
│  │  - Data Validation                              │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ SQL
                     │
┌────────────────────▼────────────────────────────────────┐
│                  Data Layer                             │
│              PostgreSQL Database                        │
│                  (Port 5432)                            │
│                                                          │
│  Tables:                                               │
│  - Users, Roles, Permissions                           │
│  - Branches, Staff Assignments                         │
│  - Borrowers, Guarantors, Documents                    │
│  - Loans, Appraisals, Approvals, Disbursements        │
│  - Loan Schedules, Charges                             │
│  - Repayments, Receipts                                │
│  - Collections, Overdue, Follow-ups                    │
│  - SMS Logs, SMS Templates                             │
│  - Activity Logs, Audit Trails                         │
└──────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Next.js Application Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── auth/          # Authentication pages
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── branches/      # Branch management
│   │   ├── clients/       # Client management
│   │   ├── loans/         # Loan management
│   │   ├── repayments/    # Repayment tracking
│   │   ├── collections/   # Collection management
│   │   ├── reports/       # Reports
│   │   └── admin/         # Admin pages
│   ├── components/        # Reusable components
│   │   ├── layout/        # Layout components
│   │   ├── forms/         # Form components
│   │   ├── tables/        # Table components
│   │   ├── modals/        # Modal components
│   │   └── common/        # Common components
│   ├── lib/              # Utility functions
│   │   ├── api.ts        # API client
│   │   ├── auth.ts       # Auth helpers
│   │   └── constants.ts  # Constants
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React Context
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
└── tailwind.config.js     # Tailwind CSS config
```

### Component Hierarchy

```
RootLayout
├── Navbar
├── Sidebar
└── MainContent
    ├── DashboardLayout
    │   ├── DashboardCards
    │   └── Charts
    ├── FormLayout
    │   └── FormFields
    └── TableLayout
        └── DataTable
```

## Backend Architecture

### Express.js Application Structure

```
backend/
├── src/
│   ├── app.ts            # Express app setup
│   ├── server.ts         # Server entry point
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── models/           # Data models
│   ├── db/              # Database utilities
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── constants/       # Constants
└── package.json
```

### Request Flow

```
HTTP Request
    ↓
Express Router
    ↓
Middleware Chain
  - CORS
  - Body Parser
  - Auth Verification
  - Authorization Check
  - Validation
    ↓
Controller
  - Parse request
  - Call service
    ↓
Service (Business Logic)
  - Process data
  - Call model/database
  - Handle business rules
    ↓
Model/Database
  - Query database
  - Return results
    ↓
Service (Response Preparation)
  - Format response
  - Handle errors
    ↓
Controller (Response)
  - Send HTTP response
    ↓
Client
```

## Database Architecture

### Core Entity Relationships

```
Users ──┬──→ Roles ──→ Permissions
        │
        └──→ Branches ──→ Staff Assignments
                 │
                 ├──→ Borrowers ──┬──→ Guarantors
                 │                ├──→ Documents
                 │                └──→ Business Info
                 │
                 └──→ Loans ──┬──→ Appraisals
                              ├──→ Approvals
                              ├──→ Disbursements
                              ├──→ Schedules
                              ├──→ Charges
                              ├──→ Repayments ──→ Receipts
                              └──→ Collections ──┬──→ Overdue
                                                 └──→ Follow-ups

Activity Logs ──→ Users
SMS Logs ──→ Borrowers / Loans
```

## Authentication & Authorization

### JWT Token Flow

```
1. User Login
   └→ Backend validates credentials
   └→ Generates JWT token (expires in 24h)
   └→ Returns token to frontend

2. Authenticated Requests
   └→ Frontend stores token (localStorage/sessionStorage)
   └→ Includes token in Authorization header
   └→ Backend validates token
   └→ Extracts user info from token

3. Authorization Check
   └→ Backend checks user role
   └→ Backend checks user permissions
   └→ Grants or denies access

4. Token Refresh
   └→ If token expired
   └→ Use refresh token to get new JWT
   └→ Update frontend token
```

## Security Architecture

### Layers of Security

1. **Transport Security**
   - HTTPS/TLS encryption
   - CORS configuration
   - Secure headers

2. **Authentication**
   - JWT tokens
   - Bcrypt password hashing
   - Login tracking

3. **Authorization**
   - Role-Based Access Control (RBAC)
   - Permission checking
   - Row-level security

4. **Data Protection**
   - SQL injection prevention (parameterized queries)
   - XSS prevention (input validation)
   - CSRF protection

5. **Audit Trail**
   - Activity logging
   - Change tracking
   - Access logging

## Integration Points

### SMS Integration

```
SMS Service
    ↓
SMS Controller
    ↓
SMS Service Layer
    ↓
SMS Provider Configuration
    ↓
External SMS API
    ↓
Tanzanian SMS Provider (e.g., Swiftline, MVCA)
```

### File Upload Integration

```
File Upload Request
    ↓
File Validation Middleware
    ↓
File Storage
    ↓
Database Entry (file path, metadata)
```

## Deployment Architecture

### Production Deployment

```
Load Balancer (Optional)
    ↓
┌─────────────────────────┐
│  Frontend Container     │
│  (Next.js)              │
│  Port: 3000             │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│  Backend Container      │
│  (Express.js)           │
│  Port: 5000             │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│  Database Container     │
│  (PostgreSQL)           │
│  Port: 5432             │
│  Volume: persist data   │
└─────────────────────────┘
```

## Scaling Considerations

1. **Horizontal Scaling**
   - Multiple backend instances
   - Load balancer (nginx/HAProxy)
   - Stateless backend design

2. **Database Scaling**
   - Read replicas
   - Connection pooling
   - Query optimization

3. **Caching**
   - Redis for session storage
   - Application-level caching
   - Browser caching

4. **CDN**
   - Static assets delivery
   - Geographic distribution

---

For more details, see related documentation:
- [API Documentation](./API.md)
- [Database Guide](./DATABASE.md)
- [Development Guide](./DEVELOPMENT.md)
- [Deployment Guide](./DEPLOYMENT.md)
