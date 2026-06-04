# BUPEK Microfinance Management System

## 📋 Project Summary

### Overview
BUPEK Microfinance Management System is a comprehensive web-based platform designed specifically for microfinance institutions. It provides complete management capabilities for clients, loans, repayments, collections, and reporting.

### Key Features
- **User Authentication & Authorization** - Secure login with JWT tokens
- **Client Management** - Complete borrower information management
- **Loan Management** - Create, track, and manage loans
- **Repayment Processing** - Record and track loan repayments
- **Collections Management** - Track overdue loans and manage collections
- **Reporting & Analytics** - Comprehensive reports and dashboard metrics
- **Branch Management** - Multi-branch support
- **SMS Notifications** - Send updates to clients via SMS

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 13+
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Winston

**Frontend:**
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Client**: Axios
- **UI Components**: Custom components
- **Charts**: Recharts

### Directory Structure

```
bupek-microfinance-management-system/
├── backend/                    # Express.js backend
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API route handlers
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Server entry point
│   ├── database/              # Database schema & migrations
│   ├── dist/                  # Compiled JavaScript
│   └── package.json
│
├── frontend/                   # Next.js frontend
│   ├── src/
│   │   ├── app/               # Next.js app directory
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & helpers
│   │   ├── store/             # Zustand store
│   │   ├── styles/            # Global styles
│   │   └── types/             # TypeScript types
│   ├── public/                # Static assets
│   └── package.json
│
├── docs/                       # Documentation
│   ├── DEVELOPMENT.md         # Development guide
│   ├── DATABASE.md            # Database documentation
│   ├── API.md                 # API documentation
│   └── DEPLOYMENT.md          # Deployment guide
│
├── .github/                    # GitHub configuration
├── docker-compose.yml          # Docker configuration
└── README.md                   # Project README
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/w2gymhgrjk-hub/bupek-microfinance-management-system.git
cd bupek-microfinance-management-system
```

2. **Setup environment variables**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

3. **Install dependencies**
```bash
npm install
```

4. **Setup database**
```bash
cd backend
npm run migrate
npm run seed
cd ..
```

5. **Start development servers**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

### Default Credentials
```
Email: admin@bupek.com
Password: Admin@123456
```

## 📚 Documentation

- **[Development Guide](docs/DEVELOPMENT.md)** - How to develop features
- **[Database Guide](docs/DATABASE.md)** - Database schema and queries
- **[API Documentation](docs/API.md)** - API endpoints and usage
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Production deployment

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- SQL injection prevention (parameterized queries)
- CORS protection
- Helmet.js security headers
- Request validation with Joi
- Rate limiting

## 📊 Database Schema

### Core Tables
- **users** - System users
- **roles** - User roles (CEO_ADMIN, BRANCH_MANAGER, LOAN_OFFICER, etc.)
- **permissions** - System permissions
- **branches** - Branch information
- **borrowers** - Client information
- **loans** - Loan records
- **repayments** - Repayment records
- **collections** - Collection records
- **activity_logs** - Audit trail

## 🛣️ API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password

### Users
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user

### Branches
- `GET /api/branches` - List branches
- `GET /api/branches/:id` - Get branch
- `POST /api/branches` - Create branch
- `PUT /api/branches/:id` - Update branch

### Dashboard
- `GET /api/dashboard` - Get dashboard metrics

### Other Modules
- `/api/clients` - Client management
- `/api/loans` - Loan management
- `/api/repayments` - Repayment management
- `/api/collections` - Collections management
- `/api/reports` - Reports generation
- `/api/sms` - SMS management

## 🔄 Workflow

### Loan Lifecycle
1. **Create Client** - Add borrower information
2. **Create Loan** - Disburse loan to client
3. **Process Repayments** - Record regular repayments
4. **Manage Collections** - Handle overdue loans
5. **Generate Reports** - Analyze performance

## 📈 Dashboard Metrics

- **Total Portfolio** - Total amount disbursed
- **Total Clients** - Number of active borrowers
- **Active Loans** - Number of ongoing loans
- **Total Arrears** - Total overdue amount
- **Portfolio at Risk** - Percentage of overdue loans

## 🧪 Testing

### Backend
```bash
cd backend
npm test
npm run test:watch
```

### Frontend
```bash
cd frontend
npm test
npm run test:watch
```

## 📦 Docker Deployment

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# View logs
docker-compose logs -f
```

## 🚢 Production Deployment

See [Deployment Guide](docs/DEPLOYMENT.md) for:
- Server setup
- Database configuration
- Application deployment
- SSL/HTTPS setup
- Performance tuning
- Monitoring & logging

## 🤝 Contributing

1. Create a feature branch
```bash
git checkout -b feature/your-feature
```

2. Commit your changes
```bash
git commit -m "feat: add your feature"
```

3. Push to the branch
```bash
git push origin feature/your-feature
```

4. Open a Pull Request

## 📝 Git Commit Conventions

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactor
- `test:` Tests
- `chore:` Maintenance

## 🐛 Known Issues

None currently reported.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Client management
- ✅ Loan management
- ✅ Basic reporting

### Phase 2
- [ ] Advanced reporting
- [ ] SMS notifications
- [ ] Mobile app
- [ ] API webhooks

### Phase 3
- [ ] Machine learning models
- [ ] Advanced analytics
- [ ] Third-party integrations

## 📞 Support

For issues and questions:
1. Check the [documentation](docs/)
2. Open a GitHub issue
3. Contact the development team

## 📄 License

This project is proprietary software for BUPEK FINANCE LIMITED.

## 👥 Team

- **Project Manager**: BUPEK Finance
- **Lead Developer**: Development Team
- **Database Administrator**: DevOps Team

## 📍 Version

**Current Version**: 1.0.0
**Last Updated**: June 4, 2026

---

**Built with ❤️ for BUPEK FINANCE LIMITED**
