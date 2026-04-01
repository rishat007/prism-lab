# PRISM Lab Static Website - Full GitHub + GitHub Pages Deployment Guide

This project is a Vite + React static website configured for GitHub Pages.

Use this guide if you want to submit the project to your professor with complete, reproducible steps.

## 1) Prerequisites

Install these tools first:

1. Git: https://git-scm.com/download/win
2. Node.js LTS (includes npm): https://nodejs.org/
3. GitHub account: https://github.com/

Check installation in PowerShell:

```powershell
git --version
node --version
npm --version
```

## 2) Create a New GitHub Repository

1. Go to https://github.com/new
2. Repository name: `prism-lab`
3. Choose Public (or Private if required)
4. Do not add README/.gitignore/license from GitHub (we already have files)
5. Click Create repository

After creating, GitHub will show a URL like:

```text
https://github.com/rishat007/prism-lab.git
```

## 3) Upload Existing Local Project to GitHub (First Time)

Run these commands inside this project folder:

```powershell
cd "e:\ONE DRIVE UNT\OneDrive - UNT System\HOME PC\UNT Ph.D. 2024 (Rishat)\G. Teaching Assistant Spring 2026\PRISM LAB\Lab Website\Static Website"

git init
git add .
git commit -m "Initial commit: PRISM Lab static website"
git branch -M main
git remote add origin https://github.com/rishat007/prism-lab.git
git push -u origin main
```

If Git asks for name/email (first time only):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your_email@example.com"
```

## 4) Branch Workflow (Recommended for Class/Professor Submission)

Create a feature branch:

```powershell
git checkout -b feature/update-content
```

Make changes, then commit:

```powershell
git add .
git commit -m "Update homepage content"
git push -u origin feature/update-content
```

Open Pull Request:

1. Go to your GitHub repository
2. Click Compare & pull request
3. Base branch: `main`
4. Compare branch: `feature/update-content`
5. Create Pull Request and merge

After merge, sync local main:

```powershell
git checkout main
git pull origin main
```

## 5) Clone Repository on Another Computer

```powershell
git clone https://github.com/rishat007/prism-lab.git
cd prism-lab
npm install
npm run dev
```

## 6) Regular Daily Push Workflow

```powershell
git status
git add .
git commit -m "Describe your changes"
git push
```

If you are on `main`, it pushes to `origin/main`. If you are on a feature branch, it pushes to that branch.

## 7) Build and Test Locally Before Deploy

```powershell
npm install
npm run build
npm run preview
```

Preview URL is usually shown in terminal (commonly `http://localhost:4173`).

## 8) Deploy to GitHub Pages (Using `gh-pages` Branch)

This method publishes the built `dist` output to a dedicated branch called `gh-pages`.

### 8.1 Build production files

```powershell
npm run build
```

Note: The build process automatically syncs the `uploads/` folder to `public/uploads/` before building, ensuring all images are included in the deployment.

### 8.2 Push `dist` to `gh-pages`

```powershell
git subtree push --prefix dist origin gh-pages
```

If `gh-pages` does not exist, GitHub creates it automatically on first push.

### 8.3 Configure Pages in GitHub

1. Open your repository on GitHub
2. Go to Settings -> Pages
3. Under Build and deployment:
4. Source: Deploy from a branch
5. Branch: `gh-pages`
6. Folder: `/ (root)`
7. Click Save

## 9) Check Website Online

After 1-5 minutes, your site will be available at:

```text
https://rishat007.github.io/prism-lab/
```

How to verify deployment status:

1. Repository -> Settings -> Pages
2. Look for green message: "Your site is live"
3. Open the published URL

## 10) Re-Deploy After New Changes

Every time you update the website:

1. Commit and push code changes to `main`
2. Build again
3. Push fresh `dist` to `gh-pages`

Commands:

```powershell
git checkout main
git pull origin main
npm install
npm run build
git subtree push --prefix dist origin gh-pages
```

## 11) Common Problems and Fixes

### Problem: Old content still showing

Fix:

1. Hard refresh browser (`Ctrl + F5`)
2. Wait 1-5 minutes for Pages propagation
3. Confirm latest `gh-pages` commit exists on GitHub

### Problem: Git authentication failed on push

Fix:

1. Login through Git Credential Manager popup
2. Or use GitHub Personal Access Token instead of password

### Problem: `npm` not recognized

Fix:

1. Reinstall Node.js LTS
2. Restart terminal

### Problem: Images/logos not loading on GitHub Pages

Fix: The project includes automatic path normalization for GitHub Pages subfolder deployment.

1. All asset paths in JSON data are automatically prefixed with `/prism-lab/` at runtime
2. The API data loading uses absolute paths compatible with GitHub Pages
3. If images still don't load, hard refresh browser (`Ctrl + F5`) and wait for cache to clear

### Problem: Route not found on refresh

This project is already configured for static hosting (relative paths and GitHub Pages-safe routing), so rebuild and redeploy.

## 12) Project Notes

- Public static data lives in `public/static-data/*.json`
- Uploads are in `uploads/`
- Build output is generated into `dist/`
- Admin CRUD features require backend APIs and are not persistent on GitHub Pages
- **GitHub Pages Compatibility**: Asset paths in JSON data are automatically normalized at runtime to include the `/prism-lab/` prefix for subfolder deployment
- **Path Normalization**: The `src/models/api.js` file contains `normalizeMediaUrls()` function that transforms all `/` paths to `/prism-lab/` paths for GitHub Pages compatibility

## 13) Quick Command Cheat Sheet

```powershell
# first setup
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/rishat007/prism-lab.git
git push -u origin main

# create branch
git checkout -b feature/my-change

# commit and push
git add .
git commit -m "My update"
git push -u origin feature/my-change

# merge workflow (after PR merge)
git checkout main
git pull origin main

# build + deploy pages
npm install
npm run build
git subtree push --prefix dist origin gh-pages
```
