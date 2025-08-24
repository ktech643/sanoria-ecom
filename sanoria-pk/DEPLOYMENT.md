# Deployment Instructions for Sanoria.pk

## Pushing to GitHub

Since you need to push this repository to GitHub, follow these steps:

### 1. Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com) and log in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it: `sanoria-pk` (or your preferred name)
5. Description: "Complete e-commerce website for Sanoria.pk - Premium beauty and skincare"
6. Choose: Public or Private (as per your preference)
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

### 2. Push the Code

After creating the repository, GitHub will show you commands. Use these in your terminal:

```bash
# Add the remote repository (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/sanoria-pk.git

# Push the code
git push -u origin main
```

If you're using SSH instead of HTTPS:
```bash
git remote add origin git@github.com:YOUR-USERNAME/sanoria-pk.git
git push -u origin main
```

### 3. Verify the Upload

After pushing, refresh your GitHub repository page. You should see all the files uploaded.

## Project Structure on GitHub

Your repository will contain:
- `frontend/` - All frontend HTML, CSS, and JavaScript files
- `backend/` - Node.js backend with Express API
- `public/` - Static assets and upload directories
- `package.json` - Node.js dependencies
- `README.md` - Project documentation
- `.env.example` - Environment variables template

## Next Steps After GitHub Upload

1. **Clone on Your Server**: 
   ```bash
   git clone https://github.com/YOUR-USERNAME/sanoria-pk.git
   cd sanoria-pk
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Set Up Database**:
   - Create a MySQL database
   - Update .env with database credentials
   - The app will auto-create tables on first run

5. **Start the Application**:
   ```bash
   npm start
   ```

## Deployment Options

### Option 1: VPS Deployment (DigitalOcean, Linode, AWS)
- Use PM2 for process management: `npm install -g pm2`
- Start with PM2: `pm2 start backend/server.js --name sanoria`
- Set up Nginx as reverse proxy

### Option 2: Heroku Deployment
- Add `Procfile`: `web: node backend/server.js`
- Use Heroku MySQL add-on for database
- Deploy using Heroku CLI or GitHub integration

### Option 3: Shared Hosting with Node.js Support
- Upload files via FTP/cPanel
- Set up Node.js app in cPanel
- Configure environment variables

## Important Notes

1. **Change Admin Password**: The default admin credentials are in the README. Change them immediately after deployment!

2. **SSL Certificate**: Set up HTTPS for production use

3. **Payment Gateway**: Add real JazzCash/EasyPaisa credentials in .env

4. **Email Service**: Configure SMTP settings for email functionality

5. **File Permissions**: Ensure `public/uploads` directories are writable

---

Need help? Check the README.md for more detailed information.