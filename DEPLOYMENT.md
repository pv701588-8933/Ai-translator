# AI Translator - Deployment Guide

## Overview
This guide covers deploying the AI Translator application to production using Docker and Docker Compose.

## Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- Git

## Quick Start with Docker Compose

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd ai-translator
\`\`\`

### 2. Configure environment variables
\`\`\`bash
cp .env.example .env
# Edit .env with your production settings
\`\`\`

### 3. Build and run with Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

### 4. Verify deployment
\`\`\`bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs -f translator-app

# Test the application
curl http://localhost:3000
\`\`\`

## Docker Commands

### Build the image
\`\`\`bash
docker build -t ai-translator:latest .
\`\`\`

### Run a container
\`\`\`bash
docker run -p 3000:3000 -e NODE_ENV=production ai-translator:latest
\`\`\`

### Stop and remove containers
\`\`\`bash
docker-compose down
\`\`\`

### View logs
\`\`\`bash
docker-compose logs -f translator-app
\`\`\`

## SSL/TLS Setup (HTTPS)

1. Generate or obtain SSL certificates
2. Place certificates in `./ssl/` directory:
   - `cert.pem` - Certificate file
   - `key.pem` - Private key file
3. Update `nginx.conf` if using different paths
4. Restart containers: `docker-compose restart`

## Production Deployment Platforms

### AWS ECS
1. Push image to ECR: `aws ecr get-login-password | docker login --username AWS --password-stdin <your-registry>`
2. Tag image: `docker tag ai-translator:latest <your-registry>/ai-translator:latest`
3. Push: `docker push <your-registry>/ai-translator:latest`
4. Create ECS service with the image

### Google Cloud Run
\`\`\`bash
gcloud builds submit --tag gcr.io/<project-id>/ai-translator
gcloud run deploy ai-translator --image gcr.io/<project-id>/ai-translator --platform managed --region us-central1
\`\`\`

### Azure Container Instances
\`\`\`bash
az acr build --registry <registry-name> --image ai-translator:latest .
az container create --resource-group <group> --name ai-translator --image <registry>.azurecr.io/ai-translator:latest --ports 3000 --environment-variables NODE_ENV=production
\`\`\`

### Vercel (Recommended for Next.js)
1. Connect GitHub repository to Vercel
2. Configure environment variables in project settings
3. Deploy automatically on push

## Performance Optimization

- Multi-stage Docker build reduces image size
- Gzip compression enabled in Nginx
- Static assets cached with long TTL
- Next.js optimizations enabled in next.config.mjs
- Health checks ensure container availability

## Monitoring

### Check container health
\`\`\`bash
docker inspect --format='{{.State.Health.Status}}' <container-id>
\`\`\`

### Monitor resource usage
\`\`\`bash
docker stats ai-translator
\`\`\`

## Scaling

### With Docker Compose
Update docker-compose.yml and set `deploy.replicas` for load balancing.

### With Kubernetes
Create deployment manifest and use kubectl for orchestration.

## Security Best Practices

- Keep base image updated: `docker pull node:20-alpine`
- Use environment variables for sensitive data
- Enable HTTPS/TLS
- Implement rate limiting in Nginx
- Regular security scanning: `docker scan ai-translator:latest`
- Non-root user in Dockerfile (already implemented)

## Troubleshooting

### Container won't start
\`\`\`bash
docker logs <container-id>
\`\`\`

### Port already in use
\`\`\`bash
# Change port in docker-compose.yml or use:
docker run -p 8000:3000 ai-translator:latest
\`\`\`

### Out of memory
Increase Docker memory limit in Docker Desktop settings or increase swap space.

## Support
For issues or questions, refer to the main README.md or create an issue in the repository.
