# ApplyFlow

ApplyFlow is a full-stack-ready job application tracker that helps you organize your job search with a Kanban workflow, searchable application table, and role-based Firebase-backed user data.

## Live Demo

- Deployed App: `https://apply-flow-smoky.vercel.app`

## Problem Statement

Tracking job applications across spreadsheets, notes, browser tabs, and emails quickly becomes messy and hard to maintain. Most candidates lose visibility into:

- how many applications are active,
- where each application sits in the pipeline,
- whether progress is improving over time.

ApplyFlow solves this by centralizing application tracking into a clean, secure dashboard with clear status stages, quick CRUD actions, and meaningful statistics.

## Features

### Authentication & Access Control

- User signup, login, and logout using Firebase Authentication
- Protected routes for authenticated pages
- User-scoped Firestore data model under `users/{uid}/applications`

### Dashboard (Kanban View)

- Five pipeline columns:
  - Applied
  - Screening
  - Interview
  - Offer
  - Rejected
- Color-coded status columns and counters
- In-place edit and delete actions for each application card
- Quick-add application modal
- Stats cards:
  - Total Applications
  - Interview Rate
  - Offer Rate
  - Active Pipeline

### Applications (Table View)

- Search by company or role
- Status filter dropdown
- Date sorting (newest first)
- Status badges with semantic colors
- Add/Edit/Delete workflows via reusable modal forms

### UX & Quality

- Responsive layout with fixed sidebar and mobile menu behavior
- Loading and empty states
- Lightweight toast notifications:
  - Application added
  - Application updated
  - Application deleted

## Tech Stack

- **Frontend:** React, Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Backend Services:** Firebase Authentication, Cloud Firestore
- **Icons/UI assets:** Lucide React
- **Hosting:** Vercel

## Project Structure

```text
src/
  components/    # Reusable UI components (cards, modals, sidebar, route guards, toast)
  context/       # Auth context and auth hook
  hooks/         # Custom data hooks (useApplications)
  pages/         # Route-level pages (Login, Signup, Dashboard, Applications)
  services/      # Firebase setup + Firestore service functions
```

## Setup Instructions

### 1) Clone and install

```bash
git clone <your-repo-url>
cd applyflow
npm install
```

### 2) Configure Firebase

Open `src/services/firebase.js` and add your Firebase project values:

<<<<<<< HEAD
5. Open your browser at:
   - `apply-flow-smoky.vercel.app`
=======
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

### 3) Run locally

```bash
npm run dev
```

Open: `http://localhost:5173`

### 4) Build for production

```bash
npm run build
```

## Firestore Security Rules (Recommended)

Use user-scoped rules similar to:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      match /applications/{applicationId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Deployment (Vercel)

1. Push code to GitHub
2. Import the repository in Vercel
3. Keep Vite defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add your deployed domain in Firebase:
   - Authentication -> Settings -> Authorized domains
5. Ensure SPA route refresh support with `vercel.json` rewrite to `/`

## Future Improvements

- Drag-and-drop between Kanban columns
- Interview scheduling/reminders
- Resume/job link attachments
- Analytics trends over time
- Export to CSV or PDF
>>>>>>> 1887adf (Update README with detailed project documentation.)
