# Mastawekia Frontend

Frontend web app for the Mastawekia hiring platform, built with Next.js App Router, TypeScript, Tailwind CSS, and Tiptap.

## Overview

This project provides two user experiences:

- User side: browse jobs, view job details, and apply.
- Client side: create jobs, manage company profile, and review applications.

Authentication is handled by API calls and token storage in `localStorage`, then route-based navigation to user or client dashboards.

## Tech Stack

- Next.js 16.2.1 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- Tiptap editor
- DOMPurify for rich-text sanitization

## Main Features

- Authentication
  - Register with role selection (`USER` or `CLIENT`)
  - Login and role-based redirect
- Job discovery
  - Fetch job listings
  - Search by title and company
  - Job details page
- Applications
  - Apply to jobs
  - Track application status
- Client tools
  - Create job posts
  - View applicants
  - Company management pages

## Route Map

- `/landing`
- `/auth/login`
- `/auth/register`
- `/user`
- `/user/jobListing`
- `/user/jobListing/[id]`
- `/user/myApplications`
- `/client`
- `/client/createJob`
- `/client/applications`
- `/client/company`

Root route `/` redirects to `/landing`.

## Project Structure

```text
app/
	auth/
		login/
		register/
	client/
		applications/
		company/
		createJob/
	landing/
	user/
		jobListing/
			[id]/
		myApplications/
	layout.tsx
	page.tsx

component/
	shared/
	ui/

features/
	auth/
	jobListing/
	createJob/
	apply/
	company/
```

## Environment Variables

Create a `.env` file in the project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace with your backend base URL.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Auth and API Notes

- Login and register requests use API helpers in `features/auth/`.
- Job listing requests are in `features/jobListing/api.ts`.
- Protected API calls attach bearer token from `localStorage` when available.

## Troubleshooting

### Error: Cannot find module `node_modules/next/dist/bin/next`

Cause: `node_modules` is incomplete or corrupted.

Fix:

```bash
rm -rf node_modules package-lock.json
npm cache verify
npm install
npm run dev
```

For Windows PowerShell:

```powershell
rd /s /q node_modules
del package-lock.json
npm cache verify
npm install
npm run dev
```

### Warning about multiple lockfiles / incorrect Turbopack root

If Next.js warns about lockfiles in parent directories, keep only the intended lockfile for this project or configure the Turbopack root in `next.config.ts`.

## Notes

- Rich text content is sanitized with DOMPurify before rendering.
- UI uses custom typography and visual styles configured in global styles and layout.
