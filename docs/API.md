# API Documentation - BUPEK Microfinance Management System

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* data object */ },
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message",
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "timestamp": "2026-06-04T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details",
  "statusCode": 400,
  "timestamp": "2026-06-04T12:00:00Z"
}
```

## Endpoints

### Authentication

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@bupek.com",
  "password": "Admin@123456"
}
```

Response:
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@bupek.com",
    "first_name": "System",
    "last_name": "Administrator",
    "role": "CEO_ADMIN"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <access_token>
```

#### Change Password
```http
POST /auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "current_password": "old_password",
  "new_password": "new_password",
  "confirm_password": "new_password"
}
```

### User Management

#### Get All Users
```http
GET /users?page=1&limit=10&search=name&role_id=1
Authorization: Bearer <access_token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <access_token>
```

#### Create User
```http
POST /users
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "email": "user@bupek.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+255700000000",
  "role_id": 3,
  "branch_id": 1
}
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Smith",
  "phone": "+255700000001",
  "is_active": true
}
```

### Branch Management

#### Get All Branches
```http
GET /branches?page=1&limit=10&search=name
Authorization: Bearer <access_token>
```

#### Get Branch by ID
```http
GET /branches/:id
Authorization: Bearer <access_token>
```

#### Create Branch
```http
POST /branches
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Dar es Salaam Branch",
  "code": "DSM-001",
  "address": "123 Main Street",
  "city": "Dar es Salaam",
  "province": "Dar es Salaam",
  "phone": "+255700000000",
  "email": "dares@bupek.com",
  "branch_manager_id": 2
}
```

### Dashboard

#### Get Dashboard Metrics
```http
GET /dashboard
Authorization: Bearer <access_token>
```

Response:
```json
{
  "total_portfolio": 50000000,
  "total_clients": 250,
  "total_active_loans": 180,
  "total_arrears": 2500000,
  "portfolio_at_risk": 5,
  "par_percentage": 5.0
}
```

## Error Codes

| Code | Meaning |
|------|----------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated endpoints

## Pagination

Paginated endpoints support:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

Example:
```
GET /users?page=2&limit=20
```

## Filtering and Search

Many endpoints support filtering:
- `search`: Full text search
- `status`: Filter by status
- `branch_id`: Filter by branch

Example:
```
GET /loans?search=John&status=ACTIVE&branch_id=1
```

## Versioning

Current API version: **v1**

Future versions will be available at:
```
/api/v2/...
```

## Webhooks

_Webhooks support to be added in future versions_

## Example Requests

### Login and Get Dashboard Data

```bash
#!/bin/bash

# Login
LOGIN_RESPONSE=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bupek.com",
    "password": "Admin@123456"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.access_token')

# Get dashboard
curl -X GET http://localhost:5000/api/dashboard \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

For more information on specific endpoints, refer to the route files in `backend/src/routes/`
