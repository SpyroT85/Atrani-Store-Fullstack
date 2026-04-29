# Atrani Watches - Full Stack E-Commerce Platform

A production-ready full-stack e-commerce platform for a luxury watches and fine writing instruments brand. Built with a React storefront, a Node.js/Express REST API, and a custom admin panel - all connected to a PostgreSQL database hosted on Neon.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, PostgreSQL (Supabase), JWT, Passport.js, Cloudinary, Brevo, Multer |
| Admin Panel | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Database | PostgreSQL on Neon (serverless, EU Central, v17) |
| Deployment | Vercel (frontend + admin), Render (backend), Cloudinary (images), Brevo (emails) |

---

## Project Structure

```
atrani-watches/
├── frontend/       React storefront
├── backend/        Node.js + Express REST API
└── admin-panel/    React admin dashboard
```

---
## 🧪 E2E Testing Demo

### Atrani Store
https://github.com/user-attachments/assets/dce2accf-f6ed-415d-b88e-e5e402fc4278

### Admin Panel Flow
https://github.com/user-attachments/assets/46e64073-1048-4c04-b237-aa4e9c49d111

## Screenshots

<div align="center">
  <a href="./assets/atrani.png"><img src="./assets/atrani.png" width="45%" /></a>
  <a href="./assets/analytics.png"><img src="./assets/analytics.png" width="45%" /></a>
  <a href="./assets/add-product.png"><img src="./assets/add-product-dark.png" width="45%" /></a>
  <a href="./assets/product-tables.png"><img src="./assets/product-tables.png" width="45%" /></a>
  <a href="./assets/product-tables-dark.png"><img src="./assets/product-tables-dark.png" width="45%" /></a>
  <a href="./assets/user-tables.png"><img src="./assets/user-tables.png" width="45%" /></a>
</div>

---

## Frontend - Customer Storefront

**Features:**
- Product catalog with category filtering (watches, fountain pens, quill pens, compasses, inkwells)
- Dynamic product detail pages with slug-based routing
- User authentication - email/password + Google OAuth
- Email verification on signup via Brevo
- JWT-based session management stored in localStorage
- **Profile page** - update name, upload avatar photo, change password
- **Forgot/reset password** - email reset flow via Brevo
- Responsive design, optimized image loading via Cloudinary CDN

---

## Backend - REST API

**Architecture:** Modular route structure

```
backend/
├── index.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js        Admin login + Google OAuth
│   ├── users.js       Customer auth, profile, password reset
│   ├── products.js    Product CRUD + image upload + low stock
│   └── admins.js      Admin management + invite system + stats
└── utils/
    └── email.js       Verification + password reset email templates
```

**API Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/auth/google` | Google OAuth |
| POST | `/api/users/signup` | Customer registration |
| GET | `/api/users/verify` | Email verification |
| POST | `/api/users/login` | Customer login |
| POST | `/api/users/forgot-password` | Send reset email |
| POST | `/api/users/reset-password` | Reset with token |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update name + avatar |
| PUT | `/api/users/me/password` | Change password |
| POST | `/api/users/upload-avatar` | Upload avatar to Cloudinary |
| GET | `/api/users/recent` | Last 5 signups (admin notifications) |
| GET | `/api/users/all` | All store customers (admin panel) |
| GET | `/api/products` | All products (with category filter) |
| GET | `/api/products/low-stock` | Products below stock threshold |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/upload` | Upload image to Cloudinary |
| GET | `/api/admins` | List admins |
| POST | `/api/admins/invite` | Send invite email |
| PUT | `/api/admins/:id/role` | Change admin role |
| DELETE | `/api/admins/:id` | Delete admin |
| GET | `/api/stats` | Dashboard statistics |

**Security:**
- bcrypt password hashing (salt rounds: 10)
- JWT tokens for admin + customer sessions (separate expiry)
- Role-based access: `superadmin`, `admin`, `demo`
- Google OAuth via Passport.js

---

## Admin Panel

**Features:**

*Products*
- Full CRUD with image upload via Cloudinary
- Stock management - per-product stock levels with color-coded badges
  - 🔴 Out of stock / Critical (< 20)
  - 🟠 Low (20–49) / Moderate (50–99)
  - 🟢 In stock (100+)
- Search, category filter, pagination, multi-select bulk delete

*Accounts*
- Admin management - roles, invites, delete (superadmin only)
- Store customers table - view all registered users with auth method badge (Google / Email), verified status, join date

*Notifications Bell*
- **Recent Signups tab** - last 5 registered customers with avatar, email, time ago
- **Low Stock tab** - products below threshold with live count badge
- Glassy orange badge on bell icon showing unread count
- Signups auto-marked as read on open (localStorage)
- Badge count loads on mount - visible without opening

*Analytics*
- Bar chart - products by category
- Pie chart - category distribution
- Line chart - new users over last 30 days

*Sidebar*
- Collapsible with smooth animation
- Glassy tooltips on collapsed state (createPortal)
- Active state indicator + hover effects

*UI/UX*
- Dark mode
- Animated loading states
- Demo mode - read-only with mock data

---

## Database

PostgreSQL on **Neon** (serverless, EU Central, v17)

**Tables:**

`products` - name, category, price, image_url, description, code, slug, material, water_resistance, movement, battery, waterproof, **stock**, created_at

`users` - name, email, password (hashed), google_id, avatar, verified, verification_token, **reset_token**, **reset_token_expires**, created_at

`admins` - email, password (hashed), role (superadmin/admin/demo), created_at

---

## Environment Variables

**Backend `.env`:**
```
DATABASE_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
BREVO_SMTP_KEY=
FROM_EMAIL=
BACKEND_URL=
FRONTEND_URL=
ADMIN_PANEL_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

---

## Running Locally

```bash
# Backend
cd backend && npm install && node index.js

# Frontend
cd frontend && npm install && npm run dev

# Admin Panel
cd admin-panel && npm install && npm run dev
```

---

## Deployment

| Service | Platform |
|---|---|
| Backend | Render |
| Frontend | Vercel |
| Admin Panel | Vercel |
| Database | Neon |
| Images | Cloudinary CDN |
| Emails | Brevo |

---

## Author

**Spyros Tserkezos** - Full Stack Developer  
[GitHub](https://github.com/SpyroT85)
