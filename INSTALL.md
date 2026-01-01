# Local Installation Guide

Follow these steps to get Trident Nova running on your computer.

## 1. Prerequisites
- [Node.js](https://nodejs.org/) (Version 18 or higher recommended)
- A Code Editor (like VS Code)

## 2. Setup
1. Create a folder for your project.
2. Copy all the code files from the conversation into this folder. Ensure the folder structure matches:
   ```
   /
   ├── components/
   │   ├── AdminDashboard.tsx
   │   ├── CartDrawer.tsx
   │   ├── Footer.tsx
   │   ├── Hero.tsx
   │   ├── InfoModal.tsx
   │   ├── LoginModal.tsx
   │   ├── Navbar.tsx
   │   ├── ProductCard.tsx
   │   └── ProductGrid.tsx
   ├── lib/
   │   └── firebase.ts
   ├── utils/
   │   └── drive.ts
   ├── App.tsx
   ├── index.tsx
   ├── index.html
   ├── types.ts
   ├── package.json
   ├── tsconfig.json
   └── vite.config.ts
   ```

## 3. Installation
Open your terminal in the project folder and run:
```bash
npm install
```

## 4. Run Development Server
```bash
npm run dev
```
The terminal will provide a link (usually `http://localhost:5173`). Open it in your browser!

## 5. Build for Production
To generate a folder ready for deployment (like Vercel or Netlify):
```bash
npm run build
```
This will create a `dist` folder. Upload the contents of `dist` to your host.
