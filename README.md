# DSA Memo

DSA Memo is a full-stack Next.js application for Data Structures and Algorithms (DSA) preparation. It provides a centralized platform for tracking problem sets, authoring technical notes, and categorizing algorithms.

---
## Screenshots

- **Live Webpage**: [DSA-memo](https://dsamemo.vercel.app)

## Technical Stack

* **Framework**: Next.js (App Router) for server-side rendering and routing.


* **Database & Auth**: Firebase Firestore (data persistence) and Google Authentication (access control).


* **Styling & UI**: Tailwind CSS and `react-resizable-panels` for an IDE-style split interface.


* **Animation**: GSAP for fluid component transitions.


* **Content Processing**: `react-syntax-highlighter` for code formatting and custom regex for automated video embeds.



---

## Core Features

* **URL-Synced Navigation**: GSAP-orchestrated category filtering linked directly to URL parameters.


* **Responsive Workspace**: Adjustable multi-pane layout for desktop and optimized vertical stacking for mobile.


* **Predictive Search**: Global search mapping user input to DSA categories and specific problem slugs.


* **Secure Administration**: Admin-only write/edit access for managing content, tags, and priority flags.



---

## Configuration & Environment Setup

To run this project locally, you must configure Firebase and set up authorization.

### 1. Firebase Setup

Create a Firebase project, enable Firestore, and enable Google Authentication. Ensure your Firestore security rules allow read/write access for your application.

### 2. Environment Variables

Create a `.env.local` file in the root directory. You must populate it with your Firebase project credentials and the designated admin email address.

The application strictly requires the following exact variable names to initialize the database and verify admin login attempts:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Authorization
# Only users authenticating with this exact email will be granted write/edit access
NEXT_PUBLIC_ALLOWED_EMAIL=your_admin_email@gmail.com

```

---

## Local Development

Once your `.env.local` file is configured, use the following commands to run the application:

1. **Install dependencies**:
```bash
npm install

```


2. **Start the development server**:
```bash
npm run dev

```


3. **Build for production**:
```bash
npm run build
npm run start

```
