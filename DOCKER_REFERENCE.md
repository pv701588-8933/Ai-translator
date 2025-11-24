# Docker Configuration Reference

## Dockerfile Structure

### Builder Stage
- Uses Alpine Linux for small base image (119 MB)
- Installs dependencies using npm ci for reproducible builds
- Builds Next.js application

### Production Stage
- Minimal runtime with only production dependencies
- Implements dumb-init for proper signal handling
- Includes health checks for container orchestration

## Image Size
- Development image: ~500MB
- Production image: ~300MB (multi-stage build optimization)

## docker-compose.yml Components

### Services
- **translator-app**: Main Next.js application
- **nginx**: Reverse proxy and load balancer (optional)

### Features
- Automatic container restart
- Health checks
- Environment variable management
- Network isolation
- Volume mounting for SSL certificates

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| NODE_ENV | production | Node environment mode |
| NEXT_PUBLIC_API_URL | http://localhost:3000 | API endpoint |
| APP_PORT | 3000 | Container port |
| NGINX_PORT | 80 | Nginx HTTP port |
| NGINX_HTTPS_PORT | 443 | Nginx HTTPS port |

## Performance Tuning

### CPU & Memory Limits
Add to docker-compose.yml:
\`\`\`yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
\`\`\`

### Nginx Worker Processes
Auto-configured to match CPU cores for optimal performance.

## Security Considerations

- SSL/TLS encryption enabled by default
- Security headers configured in Nginx
- Non-root user execution
- Health checks prevent zombie containers
- Regular log rotation recommended
