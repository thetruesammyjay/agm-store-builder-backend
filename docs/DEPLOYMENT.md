# AGM Store Builder - Deployment Guide

> Complete guide for deploying the AGM Store Builder backend to production

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Pre-deployment Checklist](#pre-deployment-checklist)
3. [Environment Setup](#environment-setup)
4. [Deployment Platforms](#deployment-platforms)
   - [Railway (Recommended)](#railway-deployment)
   - [Heroku](#heroku-deployment)
   - [AWS EC2](#aws-ec2-deployment)
   - [DigitalOcean](#digitalocean-deployment)
   - [Render](#render-deployment)
5. [Database Setup](#database-setup)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Backup Strategy](#backup-strategy)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers deploying the AGM Store Builder backend API to various cloud platforms. We recommend **Railway** for its simplicity and built-in MySQL support.

### System Requirements

**Minimum:**
- CPU: 1 vCPU
- RAM: 512 MB
- Storage: 10 GB
- Node.js: 18.x or higher
- MySQL: 8.0 or higher

**Recommended:**
- CPU: 2 vCPUs
- RAM: 2 GB
- Storage: 20 GB SSD
- Node.js: 20.x
- MySQL: 8.0

---

## Pre-deployment Checklist

### Code Preparation

- [ ] All TypeScript code compiles without errors
- [ ] All tests pass
- [ ] Environment variables are documented
- [ ] Database schema is finalized
- [ ] API documentation is up to date
- [ ] Security best practices implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured

### Third-party Services

- [ ] Monnify account created (production credentials)
- [ ] Cloudinary account set up
- [ ] SendGrid account configured
- [ ] Termii account set up
- [ ] Domain name purchased (optional)
- [ ] SSL certificate ready (if using custom domain)

### Build & Test

```bash
# Run tests
npm test

# Build TypeScript
npm run build

# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Test production build locally
NODE_ENV=production npm start
```

---

## Environment Setup

### Production Environment Variables

Create a `.env.production` file:

```bash
# =============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# =============================================================================

# Application
NODE_ENV=production
PORT=5000
API_VERSION=v1
APP_URL=https://api.shopwithagm.com
FRONTEND_URL=https://shopwithagm.com
STORE_BASE_URL=https://shopwithagm.com/store
ALLOWED_ORIGINS=https://shopwithagm.com,https://www.shopwithagm.com

# Database (Use DATABASE_URL or individual variables)
DATABASE_URL=mysql://user:password@host:3306/database
# OR
DB_HOST=your-db-host.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-strong-password
DB_NAME=agm_store_builder
DB_CONNECTION_LIMIT=10

# JWT (Generate strong secrets!)
JWT_SECRET=your-very-long-random-secret-min-64-characters-production
JWT_REFRESH_SECRET=another-very-long-random-secret-min-64-characters
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Monnify (Production credentials)
MONNIFY_BASE_URL=https://api.monnify.com
MONNIFY_API_KEY=your_production_api_key
MONNIFY_SECRET_KEY=your_production_secret_key
MONNIFY_CONTRACT_CODE=your_production_contract_code
MONNIFY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=agm-store-builder-prod

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@shopwithagm.com
SENDGRID_FROM_NAME=AGM Store Builder

# Email (SMTP fallback)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@shopwithagm.com
EMAIL_FROM_NAME=AGM Store Builder

# Termii (SMS)
TERMII_API_KEY=your_termii_api_key
TERMII_SENDER_ID=AGM Store
TERMII_BASE_URL=https://api.ng.termii.com
SMS_PROVIDER=termii
SMS_API_KEY=your_termii_api_key
SMS_SENDER_ID=AGM Store

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Upload
MAX_FILE_SIZE=5242880
ALLOWED_IMAGE_TYPES=image/jpeg,image/jpg,image/png,image/webp

# AGM Configuration
AGM_FEE_PERCENTAGE=2.5
OTP_EXPIRY_MINUTES=10
PAYMENT_EXPIRY_MINUTES=30

# Monitoring (Optional)
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
```

### Generate Strong Secrets

```bash
# Generate JWT secrets (Linux/Mac)
openssl rand -base64 64

# Generate JWT secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Generate JWT secrets (Windows PowerShell)
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

## Deployment Platforms

---

## Railway Deployment

**Recommended for:** Quick deployment, built-in MySQL, automatic SSL

### Step 1: Install Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

### Step 2: Initialize Project

```bash
# Create new Railway project
railway init

# Link to existing project (if already created on web)
railway link
```

### Step 3: Add MySQL Database

1. Go to Railway dashboard: https://railway.app
2. Click "+ New" → "Database" → "MySQL"
3. Copy the `DATABASE_URL` from the MySQL service

### Step 4: Set Environment Variables

```bash
# Set all environment variables
railway variables set NODE_ENV=production
railway variables set PORT=5000
railway variables set DATABASE_URL="mysql://user:pass@host:3306/db"
railway variables set JWT_SECRET="your-secret"
# ... set all other variables
```

Or use the Railway dashboard to set variables via GUI.

### Step 5: Deploy

```bash
# Deploy to Railway
railway up

# View logs
railway logs

# Open deployment URL
railway open
```

### Step 6: Run Database Migrations

```bash
# Connect to Railway shell
railway run bash

# Run migrations
npm run migrate

# Exit shell
exit
```

### Step 7: Custom Domain (Optional)

1. Go to Railway dashboard
2. Click on your service
3. Go to "Settings" → "Domains"
4. Click "Generate Domain" or add custom domain
5. Update DNS records as instructed

### Railway Dockerfile (Optional)

Create `Dockerfile` for custom build:

```dockerfile
# filepath: Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

---

## Heroku Deployment

**Recommended for:** Established platform, add-ons ecosystem

### Step 1: Install Heroku CLI

```bash
# Install Heroku CLI
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
# Mac: brew tap heroku/brew && brew install heroku
# Linux: curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login
```

### Step 2: Create Heroku App

```bash
# Create app
heroku create agm-store-builder-api

# Add MySQL (ClearDB or JawsDB)
heroku addons:create cleardb:ignite

# Get database URL
heroku config:get CLEARDB_DATABASE_URL
```

### Step 3: Configure Environment Variables

```bash
# Set config vars
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-secret"
heroku config:set MONNIFY_API_KEY="your-key"
# ... set all other variables
```

### Step 4: Deploy

```bash
# Initialize git (if not already)
git init
git add .
git commit -m "Initial deployment"

# Add Heroku remote
heroku git:remote -a agm-store-builder-api

# Push to Heroku
git push heroku main

# Run migrations
heroku run npm run migrate

# View logs
heroku logs --tail
```

### Step 5: Scale Dynos

```bash
# Scale to 1 web dyno
heroku ps:scale web=1

# Use hobby dyno for production
heroku ps:type hobby
```

### Heroku Procfile

Create `Procfile`:

```
web: npm start
release: npm run migrate
```

---

## AWS EC2 Deployment

**Recommended for:** Full control, scalability, enterprise

### Step 1: Launch EC2 Instance

1. Login to AWS Console
2. Go to EC2 → Launch Instance
3. Choose Ubuntu Server 22.04 LTS
4. Select t3.small or larger
5. Configure security group:
   - SSH (22) from your IP
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
   - Custom TCP (5000) from anywhere (temporary)
6. Create/select key pair
7. Launch instance

### Step 2: Connect to EC2

```bash
# SSH into instance
ssh -i "your-key.pem" ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y
```

### Step 3: Install Dependencies

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Step 4: Configure MySQL

```bash
# Secure MySQL
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
```

```sql
CREATE DATABASE agm_store_builder;
CREATE USER 'agm_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON agm_store_builder.* TO 'agm_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 5: Deploy Application

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/agm-store-builder-backend.git
cd agm-store-builder-backend

# Install dependencies
sudo npm install

# Create .env file
sudo nano .env
# Paste production environment variables

# Build TypeScript
sudo npm run build

# Run migrations
sudo npm run migrate
```

### Step 6: Configure PM2

```bash
# Start application with PM2
sudo pm2 start dist/server.js --name agm-api

# Save PM2 configuration
sudo pm2 save

# Setup PM2 startup script
sudo pm2 startup systemd

# Check status
sudo pm2 status
sudo pm2 logs agm-api
```

### Step 7: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/agm-api
```

```nginx
server {
    listen 80;
    server_name api.shopwithagm.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/agm-api /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 8: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.shopwithagm.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 9: Configure Firewall

```bash
# Enable UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## DigitalOcean Deployment

**Recommended for:** Developer-friendly, good pricing, droplets

### Step 1: Create Droplet

1. Login to DigitalOcean
2. Create → Droplets
3. Choose Ubuntu 22.04
4. Select plan: Basic $12/month (2GB RAM)
5. Add SSH key
6. Create droplet

### Step 2: Setup Domain

1. Go to Networking → Domains
2. Add your domain
3. Create A record pointing to droplet IP
4. Create CNAME for api subdomain

### Step 3: Follow AWS EC2 Steps

The deployment process is similar to AWS EC2:
- SSH into droplet
- Install Node.js, MySQL, Nginx, PM2
- Clone and configure application
- Setup SSL with Certbot

### DigitalOcean App Platform (Alternative)

Use DigitalOcean's Platform-as-a-Service:

1. Go to Apps → Create App
2. Connect GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. Add MySQL database component
5. Set environment variables
6. Deploy

---

## Render Deployment

**Recommended for:** Free tier, easy deployment

### Step 1: Create Account

1. Sign up at https://render.com
2. Connect GitHub account

### Step 2: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - Name: agm-store-builder-api
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Starter ($7/month) or Free

### Step 3: Add MySQL Database

1. Click "New +" → "MySQL"
2. Name: agm-db
3. Plan: Starter ($7/month)
4. Create database

### Step 4: Set Environment Variables

1. Go to web service settings
2. Environment → Add environment variables
3. Add all production variables
4. Add `DATABASE_URL` from MySQL service

### Step 5: Deploy

1. Click "Manual Deploy" → "Deploy latest commit"
2. Monitor deployment logs
3. Once deployed, run migrations via Render shell

---

## Database Setup

### Import Database Schema

```bash
# Local to production
mysql -h your-db-host -u user -p database_name < database.sql

# Railway
railway run mysql < database.sql

# Heroku (using JawsDB)
mysql -h hostname -u username -p database_name < database.sql
```

### Run Migrations Programmatically

Create `scripts/migrate.ts`:

```typescript
// filepath: scripts/migrate.ts
import { pool } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const sqlFile = path.join(__dirname, '../database.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');
  
  const statements = sql.split(';').filter(s => s.trim());
  
  for (const statement of statements) {
    if (statement.trim()) {
      await pool.query(statement);
    }
  }
  
  console.log('✅ Migrations completed');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
```

Add to `package.json`:

```json
{
  "scripts": {
    "migrate": "ts-node scripts/migrate.ts"
  }
}
```

---

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d api.shopwithagm.com

# Auto-renewal is automatic, test with:
sudo certbot renew --dry-run
```

### Cloudflare SSL (Alternative)

1. Add site to Cloudflare
2. Update nameservers
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"
5. Configure page rules

---

## Monitoring & Logging

### PM2 Monitoring

```bash
# Monitor with PM2
pm2 monit

# View logs
pm2 logs agm-api

# Restart on failure (automatic)
pm2 start ecosystem.config.js
```

Create `ecosystem.config.js`:

```javascript
// filepath: ecosystem.config.js
module.exports = {
  apps: [{
    name: 'agm-api',
    script: './dist/server.js',
    instances: 2,
    exec_mode: 'cluster',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
```

### Sentry Integration

```bash
# Install Sentry
npm install @sentry/node @sentry/tracing
```

```typescript
// filepath: src/config/sentry.ts
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import { config } from './env';

if (config.isProduction && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: config.env,
    integrations: [
      new Tracing.Integrations.Express(),
    ],
    tracesSampleRate: 1.0,
  });
}

export { Sentry };
```

---

## Backup Strategy

### Automated MySQL Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mysql"
DB_NAME="agm_store_builder"

mkdir -p $BACKUP_DIR

mysqldump -u root -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: backup_$DATE.sql.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add line:
```
0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### Upload to Cloud Storage

```bash
# Install AWS CLI
sudo apt install -y awscli

# Configure AWS credentials
aws configure

# Modify backup script to upload to S3
aws s3 cp $BACKUP_DIR/backup_$DATE.sql.gz s3://your-bucket/backups/
```

---

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
# filepath: .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build TypeScript
        run: npm run build
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service agm-api
```

---

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 PID
```

**Database connection failed:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -h host -u user -p

# Check firewall
sudo ufw status
```

**Application crashes:**
```bash
# Check PM2 logs
pm2 logs agm-api --lines 100

# Check system logs
sudo journalctl -u nginx -n 50

# Check memory usage
free -h
```

**SSL certificate issues:**
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## Post-Deployment

### Health Checks

```bash
# Check API health
curl https://api.shopwithagm.com/health

# Test authentication
curl -X POST https://api.shopwithagm.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Performance Testing

```bash
# Install Apache Bench
sudo apt install -y apache2-utils

# Test API performance
ab -n 1000 -c 10 https://api.shopwithagm.com/health
```

---

## Support

For deployment support:
- **Email**: support@shopwithagm.com
- **Documentation**: https://docs.shopwithagm.com/deployment
- **GitHub Issues**: https://github.com/shopwithagm/api/issues

---

**Last Updated**: December 11, 2025  
**Version**: 1.0.0