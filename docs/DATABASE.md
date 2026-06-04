# Database Guide - BUPEK Microfinance Management System

## Database Schema Overview

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role_id INTEGER NOT NULL,
  branch_id INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Branches
```sql
CREATE TABLE branches (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL,
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(255),
  branch_manager_id INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Borrowers
```sql
CREATE TABLE borrowers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  id_type VARCHAR(50),
  id_number VARCHAR(50) UNIQUE,
  date_of_birth DATE,
  gender VARCHAR(10),
  marital_status VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  postal_code VARCHAR(10),
  occupation VARCHAR(100),
  monthly_income DECIMAL(15, 2),
  photo_url VARCHAR(255),
  branch_id INTEGER NOT NULL,
  loan_officer_id INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Loans
```sql
CREATE TABLE loans (
  id SERIAL PRIMARY KEY,
  loan_number VARCHAR(50) UNIQUE NOT NULL,
  borrower_id INTEGER NOT NULL,
  branch_id INTEGER NOT NULL,
  loan_officer_id INTEGER,
  principal_amount DECIMAL(15, 2) NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  loan_term_months INTEGER NOT NULL,
  disbursement_date DATE,
  maturity_date DATE,
  status VARCHAR(20) DEFAULT 'PENDING',
  loan_purpose VARCHAR(255),
  repayment_frequency VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Repayments
```sql
CREATE TABLE repayments (
  id SERIAL PRIMARY KEY,
  repayment_number VARCHAR(50) UNIQUE NOT NULL,
  loan_id INTEGER NOT NULL,
  loan_schedule_id INTEGER,
  repayment_date DATE NOT NULL,
  amount_paid DECIMAL(15, 2) NOT NULL,
  principal_paid DECIMAL(15, 2),
  interest_paid DECIMAL(15, 2),
  charges_paid DECIMAL(15, 2),
  balance_after_payment DECIMAL(15, 2),
  payment_method VARCHAR(50),
  reference_number VARCHAR(100),
  created_by INTEGER,
  receipt_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Common Queries

### Get Active Loans by Branch
```sql
SELECT l.*, b.first_name, b.last_name, br.name as branch_name
FROM loans l
JOIN borrowers b ON l.borrower_id = b.id
JOIN branches br ON l.branch_id = br.id
WHERE l.branch_id = $1 AND l.status IN ('ACTIVE', 'OVERDUE')
ORDER BY l.created_at DESC;
```

### Get Overdue Loans
```sql
SELECT l.*, b.first_name, b.last_name, b.phone
FROM loans l
JOIN borrowers b ON l.borrower_id = b.id
WHERE l.status = 'OVERDUE'
ORDER BY l.maturity_date ASC;
```

### Portfolio at Risk (PAR)
```sql
SELECT 
  COUNT(*) as total_loans,
  SUM(principal_amount) as total_portfolio,
  COUNT(CASE WHEN status = 'OVERDUE' THEN 1 END) as overdue_loans,
  SUM(CASE WHEN status = 'OVERDUE' THEN principal_amount ELSE 0 END) as overdue_amount,
  ROUND(
    (SUM(CASE WHEN status = 'OVERDUE' THEN principal_amount ELSE 0 END) / 
     SUM(principal_amount) * 100)::NUMERIC, 2
  ) as par_percentage
FROM loans
WHERE status IN ('ACTIVE', 'OVERDUE');
```

### Monthly Collection Summary
```sql
SELECT 
  DATE_TRUNC('month', c.collection_date) as month,
  COUNT(*) as collections,
  SUM(c.amount_collected) as total_collected,
  COUNT(DISTINCT c.loan_id) as loans_collected_from
FROM collections c
GROUP BY DATE_TRUNC('month', c.collection_date)
ORDER BY month DESC;
```

### Loan Officer Performance
```sql
SELECT 
  u.id,
  u.first_name,
  u.last_name,
  COUNT(DISTINCT l.id) as loans_created,
  SUM(l.principal_amount) as total_portfolio,
  COUNT(CASE WHEN l.status = 'ACTIVE' THEN 1 END) as active_loans,
  COUNT(CASE WHEN l.status = 'OVERDUE' THEN 1 END) as overdue_loans
FROM users u
LEFT JOIN loans l ON u.id = l.loan_officer_id
WHERE u.role_id = (SELECT id FROM roles WHERE name = 'LOAN_OFFICER')
GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_portfolio DESC;
```

## Indexing Strategy

### Performance Indexes
```sql
-- Speed up common queries
CREATE INDEX idx_loans_status_branch ON loans(status, branch_id);
CREATE INDEX idx_borrowers_branch_active ON borrowers(branch_id, is_active);
CREATE INDEX idx_repayments_loan_date ON repayments(loan_id, repayment_date DESC);
CREATE INDEX idx_collections_loan_date ON collections(loan_id, collection_date DESC);
CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, created_at DESC);
```

## Maintenance

### Backup Database
```bash
# Full backup
pg_dump bupek_microfinance > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump bupek_microfinance | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### Restore Database
```bash
psql bupek_microfinance < backup_2026_06_04.sql

# From compressed backup
gunzip < backup_2026_06_04.sql.gz | psql bupek_microfinance
```

### Vacuum and Analyze
```sql
-- Optimize database
VACUUM ANALYZE;
```

### Check Database Size
```sql
SELECT 
  datname,
  pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;
```

## Performance Tuning

### Connection Pooling
Use connection pooling in production (e.g., PgBouncer)

### Query Optimization
- Use EXPLAIN ANALYZE to understand query plans
- Add indexes on foreign keys
- Avoid N+1 queries
- Use pagination for large result sets

### Slow Query Log
```sql
SET log_min_duration_statement = 1000; -- Log queries > 1 second
```

## Security Best Practices

### User Permissions
```sql
-- Create app user with limited permissions
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE bupek_microfinance TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;
```

### Enable SSL
```bash
# In postgresql.conf
ssl = on
ssl_cert_file = '/path/to/certificate.crt'
ssl_key_file = '/path/to/private.key'
```

## Disaster Recovery

### Regular Backups
- Daily automated backups
- Store backups in multiple locations
- Test restore procedures regularly
- Keep backup history for at least 30 days

### Point-in-Time Recovery
```bash
# Enable WAL archiving
# Set archive_command in postgresql.conf
```

---

For more information, see [PostgreSQL Documentation](https://www.postgresql.org/docs/)
