# 🚀 Deployment Guide

This guide covers deploying the CloudStore frontend to various platforms.

## Pre-Deployment Checklist

- [ ] Production build tested locally
- [ ] Environment variables configured
- [ ] Backend API URL updated for production
- [ ] Backend CORS settings updated
- [ ] SSL/TLS certificate configured
- [ ] CDN configured (optional)
- [ ] Analytics configured (optional)
- [ ] Error tracking configured (optional)

---

## Local Production Build

```bash
npm run build
npm run preview
```

This creates an optimized `dist/` folder ready for deployment.

---

## Deployment Platforms

### 1. Vercel (Recommended for Next.js but works for Vite)

#### Option A: Using Vercel CLI

```bash
npm install -g vercel
vercel login
cd Frontend
vercel deploy --prod
```

#### Option B: Connect GitHub

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure:
   - **Framework:** Vite
   - **Root Directory:** `Frontend`
   - **Environment Variables:**
     - `VITE_API_BASE_URL`: Your backend API URL
     - `VITE_APP_NAME`: Cloud File Storage
     - `VITE_MAX_FILE_SIZE_MB`: 5

#### Vercel Configuration File

Create `Frontend/vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_BASE_URL": "@api_base_url",
    "VITE_APP_NAME": "Cloud File Storage",
    "VITE_MAX_FILE_SIZE_MB": "5"
  }
}
```

---

### 2. Netlify

#### Option A: Using Netlify CLI

```bash
npm install -g netlify-cli
netlify login
cd Frontend
netlify deploy --prod --dir=dist --build="npm run build"
```

#### Option B: Connect GitHub

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select GitHub and repository
5. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:**
     - `VITE_API_BASE_URL`: Your backend API URL

#### Netlify Configuration File

Create `Frontend/netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_API_BASE_URL = "https://api.yourdomain.com"
  VITE_APP_NAME = "Cloud File Storage"
  VITE_MAX_FILE_SIZE_MB = "5"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. AWS S3 + CloudFront

#### Setup

```bash
# 1. Create S3 bucket
aws s3 mb s3://your-cloudstore-frontend

# 2. Enable static website hosting
aws s3api put-bucket-website \
  --bucket your-cloudstore-frontend \
  --website-configuration '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"index.html"}}'

# 3. Block public access (we'll use CloudFront instead)
aws s3api put-public-access-block \
  --bucket your-cloudstore-frontend \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

#### Deploy

```bash
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-cloudstore-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

#### Deployment Script

Create `Frontend/deploy-s3.sh`:
```bash
#!/bin/bash

# Build
npm run build

# Deploy to S3
aws s3 sync dist/ s3://your-cloudstore-frontend --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

Run with:
```bash
chmod +x Frontend/deploy-s3.sh
./Frontend/deploy-s3.sh
```

---

### 4. Docker Container (Nginx)

#### Create Dockerfile

Create `Frontend/Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Create Nginx Configuration

Create `Frontend/nginx.conf`:
```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

#### Build and Run Docker Image

```bash
# Build
docker build --build-arg VITE_API_BASE_URL=https://api.yourdomain.com \
  -t cloudstore-frontend:latest .

# Run
docker run -p 3000:80 cloudstore-frontend:latest

# Deploy to Docker Hub
docker tag cloudstore-frontend:latest username/cloudstore-frontend:latest
docker push username/cloudstore-frontend:latest
```

---

### 5. GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/cloudstore-frontend"

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### Configure GitHub Pages

1. Go to repository Settings → Pages
2. Select "Deploy from a branch"
3. Choose `gh-pages` branch
4. Save

**Note:** GitHub Pages doesn't support SPA routing well. May need workarounds.

---

### 6. Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-cloudstore-app

# Set environment variables
heroku config:set VITE_API_BASE_URL=https://your-api.herokuapp.com

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

Create `Procfile`:
```
web: npm run build && npm run preview
```

---

## Environment Configuration

### Production Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=https://api.yourdomain.com

# App Configuration
VITE_APP_NAME=Cloud File Storage
VITE_MAX_FILE_SIZE_MB=5

# Analytics (Optional)
VITE_ANALYTICS_ID=your_analytics_id

# Error Tracking (Optional)
VITE_SENTRY_DSN=your_sentry_dsn

# Feature Flags (Optional)
VITE_ENABLE_DARK_MODE=true
```

---

## Backend API Configuration

Ensure backend CORS settings allow your frontend domain:

```python
# In backend app.main:app
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://yourdomain.com",  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## SSL/TLS Certificate

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo certbot renew --dry-run
```

---

## Performance Optimization

### Enable Compression

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript 
           text/xml application/xml application/xml+rss text/javascript;
```

### Set Cache Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    expires 0;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### Use CDN

Services like Cloudflare, AWS CloudFront, or Netlify CDN improve performance globally.

---

## Monitoring & Analytics

### Sentry Error Tracking

1. Sign up at [sentry.io](https://sentry.io)
2. Create project for React
3. Install:
   ```bash
   npm install @sentry/react @sentry/tracing
   ```
4. Configure in `App.jsx`:
   ```javascript
   import * as Sentry from "@sentry/react"
   
   Sentry.init({
     dsn: import.meta.env.VITE_SENTRY_DSN,
     environment: import.meta.env.MODE,
     tracesSampleRate: 1.0,
   })
   ```

### Google Analytics

1. Create property at [analytics.google.com](https://analytics.google.com)
2. Get measurement ID
3. Add to `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to Vercel
        run: vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Rollback Plan

### Vercel
```bash
vercel rollback
```

### Netlify
Go to Deploys tab → click previous deployment → Publish deploy

### S3/CloudFront
```bash
aws s3 sync s3://backup-bucket/dist/ s3://your-cloudstore-frontend --delete
aws cloudfront create-invalidation --distribution-id $ID --paths "/*"
```

---

## Troubleshooting

### "Blank Page"
- Check browser console for errors
- Verify HTML file is served
- Check base URL configuration

### "CORS Error"
- Check backend CORS settings
- Verify API URL in environment variables
- Clear browser cache

### "Files Not Loading"
- Check Network tab in DevTools
- Verify API is accessible from deployment region
- Check authentication token

### "Slow Performance"
- Enable gzip compression
- Optimize images
- Use CDN
- Check server response times

---

## Best Practices

1. **Always test production build locally first**
   ```bash
   npm run build && npm run preview
   ```

2. **Use environment variables for configuration**
   - Never hardcode API URLs
   - Use secrets for sensitive data

3. **Enable monitoring and logging**
   - Set up error tracking
   - Configure analytics
   - Monitor uptime

4. **Regular backups**
   - Database backups
   - Code backups in Git
   - S3 bucket versioning

5. **Security headers**
   ```nginx
   add_header X-Frame-Options "SAMEORIGIN";
   add_header X-Content-Type-Options "nosniff";
   add_header X-XSS-Protection "1; mode=block";
   add_header Referrer-Policy "no-referrer-when-downgrade";
   ```

---

**Happy deploying! 🎉**
