# ApplyFlow

A modern job application tracker to manage your pipeline visually and stay organized throughout your job search.

## Problem Statement

Job seekers often manage applications across scattered spreadsheets, notes, and emails, which makes it hard to track progress, follow up consistently, and understand pipeline health. ApplyFlow solves this by providing a centralized dashboard with clear status tracking, metrics, and secure user-based data storage.

## Features

- Kanban board view with status-based columns (`Applied`, `Screening`, `Interview`, `Offer`, `Rejected`)
- Application tracking with create, update, and delete workflows
- Stats dashboard with key metrics like total applications, interview rate, offer rate, and active pipeline
- Authentication with Firebase Auth (signup, login, logout, and protected routes)
- Search and filter support for applications in table view

## Tech Stack

- React
- Vite
- Firebase (Authentication + Firestore)
- Tailwind CSS
- React Router

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd applyflow
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your Firebase configuration:
   - Open `src/services/firebase.js`
   - Replace the config values with your Firebase project credentials (`apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open your browser at:
   - `http://localhost:5173`
