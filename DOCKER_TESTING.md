# 🐳 Docker Testing Guide

## Quick Test with Latest Changes (No Cache)

### One-Line Command (Recommended):
```bash
cd /Users/souravsingh/Documents/coding/penaltybox_ui && \
docker build --no-cache -t penaltybox-frontend:latest --build-arg VITE_API_BASE_URL=http://localhost:8000 . && \
docker run -p 3000:80 --name penaltybox-ui-test penaltybox-frontend:latest
```

---

## Step-by-Step Commands

### 1. Navigate to Project:
```bash
cd /Users/souravsingh/Documents/coding/penaltybox_ui
```

### 2. Build Image (Force Rebuild, No Cache):
```bash
docker build --no-cache -t penaltybox-frontend:latest --build-arg VITE_API_BASE_URL=http://localhost:8000 .
```

**Flags Explained:**
- `--no-cache` - Don't use cached layers, rebuild everything
- `-t penaltybox-frontend:latest` - Tag the image
- `--build-arg VITE_API_BASE_URL=...` - Pass API URL for Vite build

### 3. Run Container:
```bash
docker run -p 3000:80 --name penaltybox-ui-test penaltybox-frontend:latest
```

**Flags Explained:**
- `-p 3000:80` - Map port 80 (nginx) to localhost:3000
- `--name penaltybox-ui-test` - Name the container
- `penaltybox-frontend:latest` - Image to run

### 4. Access the App:
```
http://localhost:3000
```

---

## Cleanup Commands

### Stop the Container:
```bash
docker stop penaltybox-ui-test
```

### Remove the Container:
```bash
docker rm penaltybox-ui-test
```

### Remove the Image:
```bash
docker rmi penaltybox-frontend:latest
```

### Stop + Remove (One Command):
```bash
docker stop penaltybox-ui-test && docker rm penaltybox-ui-test
```

### Full Cleanup (Container + Image):
```bash
docker stop penaltybox-ui-test && docker rm penaltybox-ui-test && docker rmi penaltybox-frontend:latest
```

---

## Quick Test Workflow

### Test → Stop → Rebuild → Test Again:
```bash
# Stop and remove existing container
docker stop penaltybox-ui-test && docker rm penaltybox-ui-test

# Rebuild with latest changes (no cache)
docker build --no-cache -t penaltybox-frontend:latest --build-arg VITE_API_BASE_URL=http://localhost:8000 .

# Run new container
docker run -p 3000:80 --name penaltybox-ui-test penaltybox-frontend:latest
```

---

## Alternative: Using Docker Compose

### Create docker-compose.test.yml:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        VITE_API_BASE_URL: http://localhost:8000
      no_cache: true
    ports:
      - "3000:80"
    container_name: penaltybox-ui-test
```

### Run with Docker Compose:
```bash
docker-compose -f docker-compose.test.yml up --build --force-recreate
```

### Stop with Docker Compose:
```bash
docker-compose -f docker-compose.test.yml down
```

---

## Environment Variables

### Local Testing (Backend on localhost:8000):
```bash
--build-arg VITE_API_BASE_URL=http://localhost:8000
```

### Production Testing (Backend on Render):
```bash
--build-arg VITE_API_BASE_URL=https://penaltybox.onrender.com
```

---

## Troubleshooting

### Container Already Exists:
```bash
docker rm -f penaltybox-ui-test  # Force remove
```

### Port Already in Use:
```bash
# Use different port
docker run -p 3001:80 --name penaltybox-ui-test penaltybox-frontend:latest

# Or stop existing process on port 3000
lsof -ti:3000 | xargs kill -9
```

### View Container Logs:
```bash
docker logs penaltybox-ui-test
```

### View Container Logs (Live):
```bash
docker logs -f penaltybox-ui-test
```

### Check Running Containers:
```bash
docker ps
```

### Check All Containers (Including Stopped):
```bash
docker ps -a
```

### Check Images:
```bash
docker images
```

---

## Testing Checklist

When testing via Docker:

### ✅ Build Phase:
- [ ] Build completes without errors
- [ ] All dependencies installed (npm ci)
- [ ] Vite build succeeds (npm run build)
- [ ] Nginx config copied correctly

### ✅ Run Phase:
- [ ] Container starts successfully
- [ ] Port 3000 is accessible
- [ ] http://localhost:3000 loads the app

### ✅ App Testing:
- [ ] Login/Register works
- [ ] Navigation sidebar appears
- [ ] All routes accessible
- [ ] Header shows user info
- [ ] Logout works
- [ ] Mobile responsive (resize browser)

### ✅ API Connection:
- [ ] API calls reach backend (check Network tab)
- [ ] Authentication works
- [ ] Protected routes work

---

## Performance Notes

### Build Times:
- **With cache**: ~10-30 seconds
- **Without cache**: ~60-120 seconds (rebuilds everything)

### When to Use --no-cache:
- ✅ After code changes (to ensure latest version)
- ✅ When dependencies changed (package.json)
- ✅ When Dockerfile changed
- ✅ When testing before deployment

### When Cache is OK:
- ❌ Just testing existing build
- ❌ No code changes made
- ❌ Quick restarts

---

## Production Testing

### Test with Production Backend:
```bash
docker build --no-cache -t penaltybox-frontend:prod \
  --build-arg VITE_API_BASE_URL=https://penaltybox.onrender.com . && \
docker run -p 3000:80 --name penaltybox-ui-prod penaltybox-frontend:prod
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Build (no cache) | `docker build --no-cache -t penaltybox-frontend:latest .` |
| Run | `docker run -p 3000:80 --name penaltybox-ui-test penaltybox-frontend:latest` |
| Stop | `docker stop penaltybox-ui-test` |
| Remove | `docker rm penaltybox-ui-test` |
| Logs | `docker logs penaltybox-ui-test` |
| List containers | `docker ps -a` |
| Clean all | `docker system prune -a` |

---

**Currently Running:**
- Backend: http://localhost:8000 (if running locally)
- Frontend: http://localhost:3000 (Docker container)

**Test the app at:** http://localhost:3000 🚀
