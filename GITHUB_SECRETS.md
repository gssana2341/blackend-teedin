# 🔐 GitHub Secrets Configuration

## Required Secrets

Add these secrets in your GitHub repository settings:
**Settings → Secrets and variables → Actions → Repository secrets**

### 1. SERVER_SSH_KEY
- **Value**: Your private SSH key content
- **How to get**: 
  ```bash
  # On your local machine
  cat ~/.ssh/server_key
  ```
- **Copy the entire content** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

### 2. Optional Secrets (if needed)
- **SUPABASE_URL**: Your Supabase project URL
- **SUPABASE_ANON_KEY**: Your Supabase anonymous key
- **SUPABASE_SERVICE_ROLE_KEY**: Your Supabase service role key

## 🔧 Server Setup Commands

Run these commands on your Google Cloud server:

```bash
# 1. Upload and run setup script
scp -i ~/.ssh/server_key scripts/server-setup.sh teedineasy_team@34.158.61.147:~/setup.sh
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147 "chmod +x ~/setup.sh && ~/setup.sh"

# 2. Edit environment variables
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147 "nano ~/teedin-backend/.env.production"

# 3. Restart application
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147 "cd ~/teedin-backend && pm2 restart teedin-backend"
```

## 🚀 Manual Deployment

If you want to deploy manually:

```bash
# Connect to server
ssh -i ~/.ssh/server_key teedineasy_team@34.158.61.147

# Navigate to project
cd ~/teedin-backend

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --production

# Build project
npm run build

# Restart application
pm2 restart teedin-backend
```

## 📊 Monitoring

Check your application status:

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs teedin-backend

# Monitor in real-time
pm2 monit
```

## 🔒 Security Notes

1. **Never commit SSH keys** to repository
2. **Use environment variables** for sensitive data
3. **Keep server updated** regularly
4. **Monitor logs** for suspicious activity
