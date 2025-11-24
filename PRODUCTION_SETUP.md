# Production Setup Guide

## Overview
This guide provides step-by-step instructions for deploying the AI Translator to production environments.

## Prerequisites
- Docker & Docker Compose installed
- Domain name (for SSL/HTTPS)
- Basic knowledge of Linux/Unix commands
- SSH access to your server

## Step 1: Server Preparation

### Update system
\`\`\`bash
sudo apt update && sudo apt upgrade -y
\`\`\`

### Install Docker and Docker Compose
\`\`\`bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
\`\`\`

## Step 2: Clone and Configure

### Clone the repository
\`\`\`bash
git clone <your-repo-url> /opt/ai-translator
cd /opt/ai-translator
\`\`\`

### Create production environment file
\`\`\`bash
cp .env.example .env.production
\`\`\`

### Edit environment variables
\`\`\`bash
nano .env.production
\`\`\`

Update the following variables:
- \`NEXT_PUBLIC_API_URL\` - Your production domain
- \`NODE_ENV=production\`
- \`APP_PORT\` - Port for the app (default 3000)

## Step 3: SSL/TLS Setup (HTTPS)

### Option A: Using Let's Encrypt with Certbot

\`\`\`bash
sudo apt install certbot python3-certbot-nginx -y

# Create SSL directory
mkdir -p ssl

# Generate certificates
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to ssl directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*.pem
\`\`\`

### Option B: Self-signed certificate (for testing only)
\`\`\`bash
mkdir -p ssl
openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes
\`\`\`

## Step 4: Deploy with Docker Compose

### Build and start services
\`\`\`bash
docker-compose up -d
\`\`\`

### Verify deployment
\`\`\`bash
docker-compose ps
docker-compose logs -f translator-app
\`\`\`

## Step 5: Monitor and Maintain

### Check application health
\`\`\`bash
curl https://yourdomain.com/health
\`\`\`

### View real-time logs
\`\`\`bash
docker-compose logs -f
\`\`\`

### Monitor resource usage
\`\`\`bash
docker stats
\`\`\`

## Step 6: Auto-renewal of SSL Certificates

### Create renewal script
\`\`\`bash
sudo nano /usr/local/bin/renew-certificates.sh
\`\`\`

Add:
\`\`\`bash
#!/bin/bash
certbot renew --quiet
cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /opt/ai-translator/ssl/cert.pem
cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /opt/ai-translator/ssl/key.pem
cd /opt/ai-translator && docker-compose restart nginx
\`\`\`

### Add to crontab
\`\`\`bash
sudo chmod +x /usr/local/bin/renew-certificates.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/renew-certificates.sh
\`\`\`

## Backup and Restore

### Create backup
\`\`\`bash
tar -czf ai-translator-backup-$(date +%Y%m%d).tar.gz /opt/ai-translator
\`\`\`

### Restore from backup
\`\`\`bash
tar -xzf ai-translator-backup-*.tar.gz -C /
docker-compose restart
\`\`\`

## Troubleshooting

### Containers won't start
\`\`\`bash
docker-compose logs translator-app
\`\`\`

### Port conflicts
Update \`docker-compose.yml\` ports or use \`lsof -i :3000\` to find conflicts.

### Out of memory
Increase Docker memory limits in daemon.json or add swap space.

## Performance Tuning

- Adjust Nginx worker processes in \`nginx.conf\`
- Configure Node.js max memory: \`NODE_OPTIONS="--max-old-space-size=1024"\`
- Enable Redis caching for API responses
- Use CDN for static assets

## Security Checklist

- [ ] SSL/TLS certificates installed and auto-renewing
- [ ] Firewall configured (only 80, 443 open)
- [ ] SSH key-based authentication enabled
- [ ] Regular security updates enabled
- [ ] Monitoring and alerting configured
- [ ] Backups scheduled
- [ ] Rate limiting enabled in Nginx
- [ ] Environment variables secured
