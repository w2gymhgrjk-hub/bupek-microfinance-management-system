# Installation Guide - BUPEK Microfinance Management System

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- PostgreSQL 13 or higher
- Git
- Docker (optional, for containerized deployment)

## System Requirements

### Minimum
- CPU: 2 cores
- RAM: 4 GB
- Storage: 20 GB

### Recommended
- CPU: 4 cores
- RAM: 8 GB
- Storage: 50 GB

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/w2gymhgrjk-hub/bupek-microfinance-management-system.git
cd bupek-microfinance-management-system
```

### 2. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bupek_microfinance
DB_USER=postgres
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRATION=24h

# Backend
PORT=5000
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Database Setup

#### Option A: PostgreSQL Command Line

```bash
# Create database
sudo -u postgres createdb bupek_microfinance

# Run schema
sudo -u postgres psql bupek_microfinance < database/schema.sql

# Run migrations
sudo -u postgres psql bupek_microfinance < database/migrations/002_seed_data.sql
```

#### Option B: Docker

```bash
docker-compose up -d postgres

# Wait for database to be ready
sleep 10

# Run migrations
docker-compose exec postgres psql -U postgres -d bupek_microfinance < database/schema.sql
```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 5. Start Development Servers

#### Option A: Concurrent Development

```bash
npm run dev
```

This will start both frontend and backend concurrently.

#### Option B: Separate Terminals

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 6. Verify Installation

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- API Health: http://localhost:5000/api/health

### 7. Default Login

- Email: admin@bupek.com
- Password: Admin@123456

## Docker Installation

### Using Docker Compose

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access Docker Services

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start PostgreSQL if not running
sudo systemctl start postgresql

# Test connection
psql -U postgres -d bupek_microfinance -c "SELECT 1;"
```

### Port Already in Use

```bash
# Find process on port
lsof -i :5000  # for backend
lsof -i :3000  # for frontend

# Kill process
kill -9 <PID>
```

### Node Module Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Same for backend and frontend
cd backend && rm -rf node_modules && npm install
```

## Next Steps

1. Read [Development Guide](./DEVELOPMENT.md)
2. Review [API Documentation](./API.md)
3. Check [Database Guide](./DATABASE.md)
4. See [Deployment Guide](./DEPLOYMENT.md)
