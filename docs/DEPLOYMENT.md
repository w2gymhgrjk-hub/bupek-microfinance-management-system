# Deployment Guide - BUPEK Microfinance Management System

## Production Deployment

### Prerequisites
- Ubuntu 20.04+ Server
- 2+ CPU cores
- 4GB+ RAM
- 50GB+ Storage
- Domain name (optional)
- SSL certificate (recommended)

### Initial Server Setup

1. **Update system**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

3. **Install PostgreSQL**
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

4. **Install Nginx (reverse proxy)**
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

5. **Create application user**
```bash
sudo useradd -m -s /bin/bash bupek
sudo usermod -aG sudo bupek
su - bupek
```

### Database Setup

1. **Create database and user**
```bash
sudo -u postgres psql

CREATE DATABASE bupek_microfinance;
CREATE USER bupek_app WITH PASSWORD 'secure_password';
ALTER ROLE bupek_app SET client_encoding TO 'utf8';
ALTER ROLE bupek_app SET default_transaction_isolation TO 'read committed';
ALTER ROLE bupek_app SET default_transaction_deferrable TO on;
ALTER ROLE bupek_app SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE bupek_microfinance TO bupek_app;
\q
```

2. **Import schema**
```bash
sudo -u postgres psql bupek_microfinance < /path/to/database/schema.sql
```

### Application Deployment

1. **Clone repository**
```bash
cd /home/bupek
git clone https://github.com/w2gymhgrjk-hub/bupek-microfinance-management-system.git
cd bupek-microfinance-management-system
```

2. **Setup environment variables**
```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Edit configuration files
nano .env
nano backend/.env
nano frontend/.env.local
```

3. **Install dependencies**
```bash
npm install
```

4. **Build applications**
```bash
# Build backend
cd backend
npm run build
cd ..

# Build frontend
cd frontend
npm run build
cd ..
```

### PM2 Process Management

1. **Install PM2**
```bash
npm install -g pm2
pm2 startup
pm2 save
```

2. **Create ecosystem.config.js**
```javascript
module.exports = {
  apps: [
    {
      name: 'bupek-backend',
      script: './backend/dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
    },
    {
      name: 'bupek-frontend',
      script: 'npm',
      args: 'start',
      cwd: './frontend',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
```

3. **Start applications**
```bash
pm2 start ecosystem.config.js
pm2 status
pm2 logs bupek-backend
```

### Nginx Configuration

1. **Create Nginx config**
```bash
sudo nano /etc/nginx/sites-available/bupek
```

2. **Add configuration**
```nginx
upstream backend {
  server localhost:5000;
}

upstream frontend {
  server localhost:3000;
}

server {
  listen 80;
  server_name your-domain.com www.your-domain.com;

  # Frontend
  location / {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  # API
  location /api {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

3. **Enable site**
```bash
sudo ln -s /etc/nginx/sites-available/bupek /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate (Let's Encrypt)

1. **Install Certbot**
```bash
sudo apt install -y certbot python3-certbot-nginx
```

2. **Get certificate**
```bash
sudo certbot --nginx -d your-domain.com
```

3. **Auto-renewal**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Docker Deployment (Alternative)

1. **Build Docker images**
```bash
docker-compose build
```

2. **Start containers**
```bash
docker-compose up -d
```

3. **View logs**
```bash
docker-compose logs -f
```

### Backup Strategy

1. **Automated daily backup**
```bash
# Create backup script
sudo nano /usr/local/bin/backup-bupek.sh
```

2. **Backup script content**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/bupek"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Database backup
sudo -u postgres pg_dump bupek_microfinance | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

3. **Schedule with cron**
```bash
sudo crontab -e

# Add line
0 2 * * * /usr/local/bin/backup-bupek.sh
```

### Monitoring

1. **Install monitoring tools**
```bash
sudo apt install -y htop glances
```

2. **Check application status**
```bash
pm2 status
pm2 monit
```

### Logs Management

1. **Application logs**
```bash
pm2 logs bupek-backend
pm2 logs bupek-frontend
```

2. **System logs**
```bash
sudo journalctl -u nginx -f
sudo tail -f /var/log/postgresql/postgresql.log
```

### Performance Tuning

1. **PostgreSQL**
```bash
sudo nano /etc/postgresql/*/main/postgresql.conf

# Recommended settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
```

2. **Nginx**
```nginx
worker_processes auto;
worker_connections 2000;
keepalive_timeout 65;
gzip on;
gzip_comp_level 6;
```

### Health Checks

1. **Application health endpoint**
```bash
curl http://localhost:5000/api/health
```

2. **Database connectivity**
```bash
psql -U bupek_app -d bupek_microfinance -c "SELECT NOW();"
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificate installed
- [ ] Firewall configured
- [ ] Monitoring enabled
- [ ] Backup schedule configured
- [ ] Logging configured
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Domain pointing to server

## Troubleshooting

### Application won't start
```bash
pm2 logs bupek-backend --err
pm2 logs bupek-frontend --err
```

### Database connection issues
```bash
psql -U bupek_app -d bupek_microfinance -c "SELECT 1;"
```

### High memory usage
```bash
pm2 monit
htop
```

---

For more information, see [Nginx Documentation](https://nginx.org/en/docs/) and [PM2 Documentation](https://pm2.keymetrics.io/docs)
