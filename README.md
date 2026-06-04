# BUPEK Microfinance Management System

A complete, production-ready microfinance management system for BUPEK FINANCE LIMITED built with modern web technologies.

## 📋 Project Overview

This system manages all aspects of microfinance operations including:
- User Management with Role-Based Access Control
- Branch Management
- Client/Borrower Management
- Loan Management & Appraisal
- Repayment & Collection Management
- Overdue & Arrears Tracking
- Comprehensive Reporting & Dashboards
- SMS Notifications
- Security & Audit Trails

## 🏗️ Technology Stack

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **JWT** - Authentication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Joi** - Validation
- **bcryptjs** - Password hashing

### Database
- **PostgreSQL** - Relational database
- **Migrations** - Schema versioning

## 📁 Project Structure

```
bupek-microfinance-management-system/
├── frontend/                          # Next.js Frontend
│   ├── public/
│   ├── src/
│   │   ├── app/                      # Next.js app directory
│   │   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── branches/             # Branch management
│   │   │   ├── clients/              # Client management
│   │   │   ├── loans/                # Loan management
│   │   │   ├── repayments/           # Repayment tracking
│   │   │   ├── collections/          # Collections
│   │   │   ├── reports/              # Reports
│   │   │   ├── admin/                # Admin pages
│   │   │   ├── auth/                 # Authentication pages
│   │   │   └── layout.tsx            # Root layout
│   │   ├── components/               # Reusable components
│   │   │   ├── layout/
│   │   │   ├── forms/
│   │   │   ├── tables/
│   │   │   ├── modals/
│   │   │   └── common/
│   │   ├── lib/                      # Utilities
│   │   │   ├── api.ts               # API client
│   │   │   ├── auth.ts              # Auth helpers
│   │   │   └── constants.ts         # Constants
│   │   ├── hooks/                   # Custom hooks
│   │   ├── context/                 # React context
│   │   ├── types/                   # TypeScript types
│   │   └── styles/                  # Global styles
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── backend/                          # Express.js Backend
│   ├── src/
│   │   ├── app.ts                   # Express app
│   │   ├── server.ts                # Server entry point
│   │   ├── config/                  # Configuration
│   │   │   ├── database.ts
│   │   │   ├── jwt.ts
│   │   │   └── sms.ts
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.ts
│   │   │   ├── users.ts
│   │   │   ├── branches.ts
│   │   │   ├── clients.ts
│   │   │   ├── loans.ts
│   │   │   ├── repayments.ts
│   │   │   ├── collections.ts
│   │   │   ├── reports.ts
│   │   │   ├── sms.ts
│   │   │   ├── dashboard.ts
│   │   │   └── index.ts
│   │   ├── controllers/             # Business logic
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   ├── branchController.ts
│   │   │   ├── clientController.ts
│   │   │   ├── loanController.ts
│   │   │   ├── repaymentController.ts
│   │   │   ├── collectionController.ts
│   │   │   ├── reportController.ts
│   │   │   ├── smsController.ts
│   │   │   └── dashboardController.ts
│   │   ├── services/               # Service layer
│   │   │   ├── authService.ts
│   │   │   ├── userService.ts
│   │   │   ├── branchService.ts
│   │   │   ├── clientService.ts
│   │   │   ├── loanService.ts
│   │   │   ├── repaymentService.ts
│   │   │   ├── collectionService.ts
│   │   │   ├── reportService.ts
│   │   │   └── smsService.ts
│   │   ├── models/                 # Data models
│   │   │   ├── User.ts
│   │   │   ├── Branch.ts
│   │   │   ├── Client.ts
│   │   │   ├── Loan.ts
│   │   │   ├── Repayment.ts
│   │   │   └── Collection.ts
│   │   ├── db/                     # Database
│   │   │   ├── connection.ts
│   │   │   ├── queries.ts
│   │   │   └── migrations/         # Migration files
│   │   ├── types/                  # TypeScript types
│   │   ├── utils/                  # Utilities
│   │   └── constants/              # Constants
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── database/                        # Database schema & migrations
│   ├── schema.sql                  # Complete schema
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_indexes.sql
│   │   └── 003_seed_data.sql
│   └── backups/
│
├── docs/                           # Documentation
│   ├── API.md                      # API documentation
│   ├── INSTALLATION.md             # Installation guide
│   ├── DEVELOPMENT.md              # Development guide
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── DATABASE.md                 # Database guide
│   └── ARCHITECTURE.md             # Architecture overview
│
├── .github/                        # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml                 # CI/CD pipeline
│   │   └── deploy.yml             # Deployment pipeline
│   └── ISSUE_TEMPLATE/
│
├── docker/                         # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── Dockerfile.db
│   └── docker-compose.yml
│
├── .gitignore
├── .env.example
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/w2gymhgrjk-hub/bupek-microfinance-management-system.git
cd bupek-microfinance-management-system
```

2. **Setup Database**
```bash
createdb bupek_microfinance
psql bupek_microfinance < database/schema.sql
```

3. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

4. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

5. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Default Login Credentials

After seeding the database:
- **Email**: admin@bupek.com
- **Password**: Admin@123456

## 🔐 User Roles

1. **CEO/Admin** - Full system access
2. **Operations Manager** - Operations oversight
3. **Branch Manager** - Branch-specific access
4. **Loan Officer** - Loan processing and management
5. **Collection Officer** - Collections and follow-ups
6. **Accountant** - Financial reporting

## 📖 Documentation

- [API Documentation](./docs/API.md)
- [Installation Guide](./docs/INSTALLATION.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Database Guide](./docs/DATABASE.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)

## 🏗️ Core Features

### User Management
- User creation and management
- Role-based access control
- Password reset functionality
- Activity tracking and audit logs

### Branch Management
- Branch registration
- Staff assignment
- Performance tracking
- Comparative analysis

### Client Management
- Client registration
- Document upload
- KYC information
- Guarantor management

### Loan Management
- Loan applications
- Appraisal workflow
- Approval process
- Disbursement tracking

### Repayment Management
- Daily repayment recording
- Partial payment tracking
- Receipt generation
- Collection summaries

### Collections & Overdue
- Automatic overdue detection
- Arrears tracking
- Follow-up notes
- Recovery reporting

### Reports & Analytics
- PAR (Portfolio at Risk) Report
- Daily Collection Report
- Loan Officer Performance
- Branch Performance Report
- Profit & Loss Summary

### SMS Notifications
- Pre-due date reminders
- Overdue notifications
- Bulk messaging
- SMS logging and provider integration

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Activity logging and audit trails
- Data backup system
- Input validation and sanitization

## 🐳 Docker Deployment

```bash
docker-compose up -d
```

## 📝 License

Proprietary - BUPEK FINANCE LIMITED

## 👥 Support

For issues and support, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-04  
**Status**: Production Ready
