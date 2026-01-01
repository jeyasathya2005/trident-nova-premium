# Trident Nova Premium Store

A high-end e-commerce platform for premium products with Firebase integration and WhatsApp checkout.

## Features
- ✨ **Curated UI**: High-fashion aesthetic with cinematic hero section.
- 📦 **Inventory Management**: Full Admin Dashboard to manage products and categories.
- 🔥 **Firebase Backend**: Real-time product sync and secure admin authentication.
- 🖼️ **Google Drive Images**: Seamlessly use Google Drive sharing links as product images.
- 💬 **WhatsApp Checkout**: Direct white-glove ordering via WhatsApp.

## How to use Google Drive Images
1. Upload your image to Google Drive.
2. Right-click -> **Share** -> **Share**.
3. Change "Restricted" to **"Anyone with the link"**.
4. Copy the link and paste it into the "Google Drive Link" field in the Admin Dashboard.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Deployment Steps
### GitHub
1. Create a repository on GitHub.
2. Initialize and push:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USER/repo-name.git
   git push -u origin main
   ```

### Vercel / Netlify
1. Connect your GitHub repository.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Deploy!
