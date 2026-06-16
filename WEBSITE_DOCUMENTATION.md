# Chhapi Donation Web Application - Complete Documentation

Welcome to the comprehensive documentation of the **Chhapi Donation** web application. This document serves as a complete reference guide for developer handoff, admin operations, and architecture overview.

---

## 1. Platform Overview
**Chhapi Donation** is a modern web application designed to manage community-driven donations, campaign allocations, user roles, and transparency reports. It provides a secure, role-based dashboard interface for Super Admins, Admins, and regular Users to organize contributions efficiently.

### Live URL
- **Production URL**: [https://chhapidonation.netlify.app/](https://chhapidonation.netlify.app/)
- **Local Dev URL**: [http://localhost:3000/](http://localhost:3000/)

---

## 2. Tech Stack & Architecture
The local codebase has been rebuilt and optimized to match the user rules and aesthetic guidelines:

- **Core Framework**: Next.js 16 (App Router)
- **Language**: Pure JavaScript / JSX (All TypeScript/TSX annotations and files have been removed per request to ensure clean JS-only execution).
- **Styling**: Tailwind CSS v4 (incorporating `@import "tailwindcss"` in `app/globals.css`).
- **Bundler**: Rust-powered Next.js Turbopack, configured locally in `next.config.mjs` to target the active workspace root.
- **Routing Structure**: Nested file-based routing supporting both standard `/dashboard` and alternate `/dashbord` paths.
- **Layout System**: Shared layout wrappers (`app/components/DashboardLayout.js`) to prevent page reload flickering and code duplication.

---

## 3. User Roles & Access Control

The system implements strict Role-Based Access Control (RBAC) divided into three distinct account tiers:

| Role | Access Level | Description | Key Views |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Full System | Manages all Admins/Users, configures parameters, and reviews system-wide fund distributions. | Create User, Users List, Fund Management, System Settings |
| **Admin** | Mid Tier | Creates regular Users and reviews, approves, or rejects pending donation reports. | Create User, Users List, Pending Donations |
| **User** | Consumer Tier | Views campaigns, logs donation claims, and reviews personal donation history. | Campaigns, Personal Donation Claims |

---

## 4. Admin & User Verification Workflows

Below are the exact steps to perform user creation and login validation:

### Step 1: Log in as Super Admin
- **Login URL**: `https://chhapidonation.netlify.app/dashboard/super-admin`
- **Mobile Number**: `7600526010`
- **Password**: `Qaswa@786`
- **Action**: Fill the inputs and submit to land on the Super Admin Dashboard.

### Step 2: Create a New Admin
- **URL**: `https://chhapidonation.netlify.app/dashboard/super-admin/createuser`
- **Form Inputs**:
  - **Full Name**: `Amir Admin`
  - **Mobile Number**: `9104092123`
  - **Password**: `Amir@123`
  - **Role**: `ADMIN` (Select from the dropdown list)
- **Action**: Click "Create Account" to submit the record to the backend.
- **Verification**: Go to "Users List" (`/dashboard/users`) and verify the listing of `Amir Admin` with the mobile number `9104092123`.

### Step 3: Log in as the New Admin
- **Action**: Log out of the Super Admin session, then log in using the newly created Admin credentials:
  - **Mobile Number**: `9104092123`
  - **Password**: `Amir@123`
- **Verification**: Ensure the Admin Panel loads correctly.

### Step 4: Create a Regular User
- **Action**: Go to the Admin's User Creation page. Fill in the form for a regular User:
  - **Full Name**: `Test User`
  - **Mobile Number**: `9204092123`
  - **Password**: `User@123`
  - **Role**: `USER`
- **Action**: Click "Create Account" and verify the record is added to the database.

### Step 5: Log in as the Regular User
- **Action**: Log out, then log in using the User credentials:
  - **Mobile Number**: `9204092123`
  - **Password**: `User@123`
- **Verification**: Verify that the regular User dashboard loads correctly.

---

## 5. UI Design & Collapsible Sidebar

The sidebar design has been custom-tailored to replicate the premium plum aesthetic requested:

### Theme Palette
- **Primary Sidebar BG**: Deep aubergine purple (`#4a154b` / `bg-[#4a154b]`)
- **Active Navigation Pill**: Lighter opacity block (`bg-white/10`)
- **Main Dashboard BG**: Dark deep blue (`#070b12` / `bg-[#070b12]`)
- **Stats Card BG**: Lighter card panels (`bg-[#111928]/60`)

### Collapsible Behavior ("colspan & expect < >")
The sidebar features a fully functional collapse toggle that slides between:
- **Expanded state** (`w-[320px]`): Shows titles, logos, user metadata, dropdown chevrons, and active indicators.
- **Collapsed state** (`w-[90px]`): Collapses to show only icons. Hides all textual labels and dropdown controls to maximize main viewport space.
- **Toggle Button**: A white circular button overlapping the sidebar's right border with smooth hover scales. Displays a left chevron `<` when expanded, and a right chevron `>` when collapsed.

---

## 6. Local Workspace Directory Structure
The local directory `c:\Users\Asus\Desktop\Donetion` is structured as follows:

```
Donetion/
├── app/
│   ├── components/
│   │   ├── CreateUserView.js        # React user creation component
│   │   ├── DashboardContent.js      # Main stats and charts view
│   │   ├── DashboardLayout.js       # Shared sidebar layout
│   │   ├── DonationsHistoryView.js  # Audit log component
│   │   ├── FundOverviewView.js      # Fund allocations table
│   │   ├── PendingDonationsView.js  # Approval control component
│   │   ├── ReportsView.js           # Growth charts component
│   │   ├── SettingsView.js          # System parameter controls
│   │   └── Sidebar.js               # Collapsible plum sidebar
│   ├── dashboard/                   # /dashboard routes
│   │   ├── createuser/
│   │   ├── donations-history/
│   │   ├── fund-overview/
│   │   ├── pending-donations/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── users/
│   │   ├── layout.js
│   │   └── page.js
│   ├── dashbord/                    # Alternate spelling routes
│   │   ├── createuser/
│   │   ├── donations-history/
│   │   ├── fund-overview/
│   │   ├── pending-donations/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── users/
│   │   ├── layout.js
│   │   └── page.js
│   ├── globals.css                  # Core CSS and Tailwind v4 themes
│   ├── layout.js                    # Next.js main HTML layout
│   └── page.js                      # Vercel boilerplate landing page
├── next.config.mjs                  # Configured with turbopack.root CWD
├── postcss.config.mjs               # PostCSS configurations
├── package.json                     # System dependencies
└── README.md                        # Next.js boilerplate readme
```

---

## 7. Operational Recommendations & Best Practices

1. **Routing Redirection**: To keep the user experience seamless, configure a redirect in `next.config.mjs` to map `/dashbord/*` requests directly to `/dashboard/*` so that duplicate pages aren't needed long-term.
2. **Mobile Validation**: Enforce 10-digit mobile number limits in input fields to prevent DB formatting errors.
3. **Session Persistence**: Sync the `isCollapsed` sidebar state to `localStorage` or cookies to persist the user's view preference across page navigations.
