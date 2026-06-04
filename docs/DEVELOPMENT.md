# Development Guide - BUPEK Microfinance Management System

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Git
- Code Editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
```bash
git clone https://github.com/w2gymhgrjk-hub/bupek-microfinance-management-system.git
cd bupek-microfinance-management-system
```

2. **Setup environment variables**
```bash
cp .env.example .env
cd backend && cp .env.example .env && cd ..
cd frontend && cp .env.example .env.local && cd ..
```

3. **Install dependencies**
```bash
npm install
```

4. **Setup database**
```bash
# Create database
createdb bupek_microfinance

# Run schema
psql bupek_microfinance < database/schema.sql

# Seed initial data
psql bupek_microfinance < database/migrations/002_seed_data.sql
```

5. **Start development servers**

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

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/api

## Development Workflow

### Backend Development

#### Adding a New Route

1. Create a new route file in `backend/src/routes/`
```typescript
// backend/src/routes/myroute.ts
import { Router } from 'express';
import { authMiddleware, requirePermission } from '../middleware/auth';
import { sendSuccess } from '../utils/responses';

const router = Router();
router.use(authMiddleware);

router.get('/', requirePermission('PERMISSION_NAME'), (req, res) => {
  sendSuccess(res, 200, 'Success message', { data: 'value' });
});

export default router;
```

2. Import in `backend/src/routes/index.ts`
```typescript
import myRoutes from './myroute';
router.use('/myroute', myRoutes);
```

#### Adding a New Service

1. Create service in `backend/src/services/myService.ts`
```typescript
import { query, queryOne } from '../config/database';
import logger from '../config/logger';

export const getMyData = async (id: number) => {
  try {
    const result = await queryOne('SELECT * FROM my_table WHERE id = $1', [id]);
    return result;
  } catch (error) {
    logger.error('[MyService] Error:', error);
    throw error;
  }
};
```

2. Use in controller/route
```typescript
import { getMyData } from '../services/myService';

const data = await getMyData(id);
```

### Frontend Development

#### Adding a New Page

1. Create page directory
```bash
mkdir -p src/app/mypage
```

2. Create page component
```typescript
// src/app/mypage/page.tsx
'use client';

export default function MyPage() {
  return <div>My Page</div>;
}
```

#### Adding a New Component

1. Create component file
```typescript
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div>{title}</div>;
}
```

2. Use in page
```typescript
import MyComponent from '@/components/MyComponent';

export default function MyPage() {
  return <MyComponent title="Hello" />;
}
```

#### Using API Client

```typescript
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

const fetchData = async () => {
  try {
    const response = await apiClient.get('/endpoint');
    console.log(response.data);
  } catch (error) {
    toast.error('Failed to fetch data');
  }
};
```

#### Using Authentication Store

```typescript
import { useAuthStore } from '@/store/authStore';

const { user, isAuthenticated, logout } = useAuthStore();
```

## Code Style

### TypeScript
- Use strict mode
- Always define types
- Avoid `any` type

### Naming Conventions
- Components: PascalCase (MyComponent.tsx)
- Functions: camelCase (myFunction)
- Constants: UPPER_CASE (MY_CONSTANT)
- Files: kebab-case or PascalCase depending on content

### Formatting

Run Prettier before committing:
```bash
# Backend
cd backend && npm run format && cd ..

# Frontend
cd frontend && npm run format && cd ..
```

## Testing

### Backend Testing
```bash
cd backend
npm test
npm run test:watch
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:watch
```

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach Backend",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Backend Debugging

```bash
node --inspect-brk dist/server.js
```

## Database

### Running Migrations
```bash
cd backend
npm run migrate
```

### Seeding Data
```bash
cd backend
npm run seed
```

### Database Queries

Use the database query client:
```typescript
import { query, queryOne } from '../config/database';

const rows = await query('SELECT * FROM users WHERE role_id = $1', [roleId]);
const single = await queryOne('SELECT * FROM users WHERE id = $1', [id]);
```

## Git Workflow

### Create Feature Branch
```bash
git checkout -b feature/feature-name
```

### Commit Changes
```bash
git add .
git commit -m "feat: add new feature"
```

### Push and Create PR
```bash
git push origin feature/feature-name
```

### Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactor
- `test:` Tests
- `chore:` Maintenance

## Environment Variables

### Backend
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bupek_microfinance
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Troubleshooting

### Port Already in Use
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d bupek_microfinance -c "SELECT 1;"
```

### Module Not Found
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Tips

1. Use database indexes for frequently queried columns
2. Implement pagination for large datasets
3. Cache frequently accessed data
4. Minimize API calls from frontend
5. Use TypeScript for type safety

## Security Best Practices

1. Never commit `.env` files
2. Validate all user inputs
3. Use parameterized queries
4. Implement rate limiting
5. Use HTTPS in production
6. Keep dependencies updated

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

For more information, see the main [README.md](../README.md)
