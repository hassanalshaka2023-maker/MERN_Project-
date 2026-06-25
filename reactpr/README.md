# IDEA Training Center - Institute Management System

## Overview

IDEA Training Center is a comprehensive institute management system built with React, TypeScript, and Tailwind CSS. The application provides role-based dashboards for three user types: **Students**, **Professors**, and **Managers**, each with specific functionalities tailored to their needs.

## Features

### 🔐 Authentication
- Secure login with JWT token-based authentication
- Role-based redirection (Student, Professor, Manager)
- Persistent session management using localStorage

### 👨‍🎓 Student Dashboard
- View enrolled courses and academic records
- Track attendance status
- View grades and grade notes
- View course results (Passed/Pending)
- Register for new courses
- View pending/rejected registration requests
- Average grade calculation
- Success metrics visualization

### 👨‍🏫 Professor Dashboard
- View assigned courses
- Manage student enrollments
- Add grades and grade notes
- Track student attendance
- View overall course statistics:
  - Total courses
  - Total students
  - Average grade
  - Success rate

### 👔 Manager Dashboard
- Complete institute oversight
- Create new users (Students/Professors)
- Create and manage courses
- Approve or reject student enrollment requests
- View institute-wide analytics:
  - Total students
  - Total professors
  - Total courses
  - Total enrollments
  - Institute success rate
- Edit and delete courses
- Edit and delete users

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Native Fetch API
- **Build Tool**: Vite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:3000`

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd idea-training-center

2. Install dependencies

npm install
# or
yarn install

3.Environment Configuration

No environment variables are required for the frontend

Ensure backend API is running on http://localhost:3000

4.Start the development server
npm run dev
# or
yarn dev
5.Build for production

npm run build
# or
yarn build
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
