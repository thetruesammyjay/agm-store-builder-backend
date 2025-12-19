# AGM Super Admin & Regulation Guide

This document outlines how to set up, access, and use the Super Admin Dashboard for `shopwithagm.com`. This dashboard is the control center for regulating stores, approving payouts, and managing users.

## 1. Prerequisites (Database Setup)

Before anyone can log in as an Admin, you must update your database schema to support user roles. By default, all users are standard sellers.

### Step 1: Add the Role Column

Run this SQL command in your MySQL database (e.g., via phpMyAdmin, Workbench, or CLI) to add the `role` capability.

```sql
ALTER TABLE users 
ADD COLUMN role ENUM('user', 'admin', 'super_admin') NOT NULL DEFAULT 'user' 
AFTER email;
```

## 2. Creating Your First Admin

For security reasons, there is no public "Sign Up as Admin" page. You must sign up as a regular user first, then manually promote yourself in the database.

### Step 1: Sign Up

Go to the frontend registration page and create an account normally.

- **URL**: `http://localhost:3000/signup` (or `https://shopwithagm.com/signup`)
- **Email**: e.g., `admin@shopwithagm.com`

### Step 2: Promote to Super Admin

Run this SQL command in your database to grant yourself full privileges. Replace the email with the one you just used to sign up.

```sql
UPDATE users 
SET role = 'super_admin' 
WHERE email = 'admin@shopwithagm.com';
```

## 3. Accessing the Admin Dashboard

The Admin Dashboard has a separate, secure login route. Regular users cannot access this page or log in here.

### Login URLs

- **Development**: http://localhost:3000/admin/login
- **Production**: https://shopwithagm.com/admin/login

### How it works

1. Navigate to the URL above.
2. Enter the credentials for the account you just promoted.
3. The system checks `user.role`. If it is `admin` or `super_admin`, you are redirected to the Admin Dashboard.
4. If a regular user tries to log in here, they will be denied access.

## 4. Admin Capabilities

Once logged in, you have access to the following regulation tools:

### 🏪 Store Management (`/admin/stores`)

- **View All Stores**: See every store created on the platform.
- **Suspend/Ban**: Click the "Actions" menu on a store to immediately take it offline (sets `is_active = false`).
- **Revenue Oversight**: See exactly how much each store is earning.

### 💸 Payout Management (`/admin/payouts`)

- **Review Requests**: See all pending withdrawal requests from sellers.
- **Approve/Reject**: Manually approve funds transfer or reject suspicious requests.
- **Bank Details**: Verify the destination bank account before approving.

### 👥 User Management (`/admin/users`)

- **View Users**: See all registered users.
- **Ban User**: Prevent a specific user from logging into the platform entirely.

### 🛡️ Audit Logs (`/admin/audit`)

- **Track Activity**: See a timeline of major actions taken on the platform for security and dispute resolution.

## 5. Security Notes

- **Role Protection**: The `/admin` routes are protected by a client-side check in `src/app/(admin)/admin/layout.tsx`. Ensure your backend API endpoints also verify `req.user.role === 'admin'` before allowing sensitive actions.
- **Separation**: The Admin Sidebar is visually distinct (Dark Mode) from the Seller Sidebar (Light Mode) to prevent confusion.