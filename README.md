# lox.bd — Modern E-Commerce Platform & Headless CMS

[![Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://e-shop-eight-liart.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Connected-green?logo=mongodb)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

A modern, high-performance, full-stack E-Commerce storefront and administrative Content Management System (CMS) built with React 19, TypeScript, Express, MongoDB Atlas, and Tailwind CSS.

🌐 **Live Demo Website:** [https://e-shop-eight-liart.vercel.app/](https://e-shop-eight-liart.vercel.app/)  
🔐 **Admin CMS Panel:** [https://e-shop-eight-liart.vercel.app/#/admin](https://e-shop-eight-liart.vercel.app/#/admin)  
📦 **GitHub Repository:** [https://github.com/Tawhide16/E-Shop](https://github.com/Tawhide16/E-Shop)

---

## ⚡ Key Features

### 🛍️ Customer Storefront
- **Modern Luxury Aesthetic:** Inspired by high-end fitness & lifestyle brands with smooth GSAP animations and curated typography.
- **Dynamic Product Catalog:** Browse by categories, filter by size, color, in-stock status, and price ranges.
- **Rich Product Detail Pages:** High-resolution image galleries, real-time variant switching (color, size), customer reviews, and responsive add-to-cart.
- **Slide-Over Cart Drawer:** Instant quantity adjustments, subtotal calculations, and free delivery thresholds.
- **Streamlined Checkout:** Full Bangladeshi payment methods supported (bKash, Nagad, Rocket, Credit/Debit Cards, Cash on Delivery).
- **SEO & Social Optimization:** Dynamic Open Graph metadata, Schema.org JSON-LD structured data, and custom `lox.bd` vector branding & favicon.

### 🛡️ Admin Dashboard & CMS
- **Real-Time Selling Analytics:** 100% live sales metrics calculated from actual customer checkouts (Total Net Revenue in USD & BDT ৳, Total Orders, Verified Customers, Average Order Value, and dynamic best-selling item rankings). Zero dummy numbers.
- **Visual Homepage Builder:** Live drag-and-drop section ordering, toggle visibility, and customize hero sliders, promo banners, and product showcase grids.
- **Product Management & Bulk Operations:** Add, update, delete, and bulk edit prices, inventory statuses, tags, and categories.
- **Category Management:** Create, rename, and remove product categories with automatic inventory re-indexing.
- **Navigation Menu Builder:** Customize header/navbar links, submenus, and external redirects on the fly.
- **Direct Media Library:** Upload images directly from your device with automatic client-side canvas compression — no external image host needed.
- **Order Fulfillment & Logistics:** Live order tracking, customer contact details, delivery addresses, and status toggles (*Unfulfilled, Processing, Shipped, Delivered, Cancelled*).
- **Admin Access Control (RBAC):** Invite team administrators with granular permissions across roles (*Super Admin, Admin, Editor, Product Manager, Order Manager, Marketing Manager*).

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 6, Tailwind CSS v4, GSAP, Motion, Lucide Icons |
| **Backend API** | Node.js, Express, Mongoose, Vercel Serverless Functions (`api/index.js`) |
| **Database** | MongoDB Atlas (Cloud) with fallback offline memory mode and auto-seeding |
| **State & Storage** | React Context API (`StoreContext`), HTML5 LocalStorage, MongoDB Collections |
| **Deployment** | Vercel (Auto CI/CD on `main` push) |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** or **bun** / **yarn**
- **MongoDB Atlas** account (or local MongoDB server)

### 1. Clone the Repository
```bash
git clone https://github.com/Tawhide16/E-Shop.git
cd E-Shop
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# MongoDB Atlas Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/eshop?retryWrites=true&w=majority&appName=Cluster0"

# Local Express API Port
PORT=5000
```

### 4. Run Development Server
Run both the frontend (Vite) and backend (Express) concurrently:
```bash
npm run dev:all
```
- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **API Health:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Admin Dashboard:** [http://localhost:3000/#/admin](http://localhost:3000/#/admin)

---

## 🔑 Default Administrator Credentials

To access the administrative dashboard, visit `/admin` and log in:

- **Email:** `lox.bd0.1@gmail.com` *(or `admin@eshop.com`)*
- **Password:** `admin123` *(or `123456`)*

*(New administrator accounts and passwords can be added from the **Admin Users** tab).*

---

## 📂 Project Structure

```text
e-shop/
├── api/                    # Vercel serverless function entrypoint
│   └── index.js            # Bundled production serverless API handler
├── public/                 # Static assets
│   └── favicon.svg         # Modern lox.bd vector favicon
├── server/                 # Express backend API
│   ├── models/             # Mongoose schemas (Product, Order, Customer, etc.)
│   ├── routes/             # REST API endpoints (/api/products, /api/orders, etc.)
│   ├── app.ts              # Express application setup
│   ├── db.ts               # MongoDB Atlas connection manager
│   └── index.ts            # Local development server entrypoint
├── src/                    # React frontend application
│   ├── components/
│   │   ├── admin/          # Admin Dashboard tabs (Overview, Products, Orders, Users, etc.)
│   │   ├── storefront/     # Storefront pages (Hero, Shop, ProductDetail, Cart, Checkout)
│   │   └── common/         # Header, Footer, SEO Meta, Dropzones
│   ├── context/            # StoreContext (Global state, auth, database sync)
│   ├── data/               # Default catalog data, initial schemas
│   ├── types/              # TypeScript interfaces (Product, Order, AdminUser, CMS)
│   ├── utils/              # Client-side image upload & compression utilities
│   ├── App.tsx             # Root application component & routing
│   └── main.tsx            # React DOM mounting
├── vercel.json             # Vercel deployment routing & serverless configuration
└── package.json            # Scripts & project dependencies
```

---

## 🚢 Deployment on Vercel

1. Push your changes to the `main` branch on GitHub:
   ```bash
   git push origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/):
   - Import repository `Tawhide16/E-Shop`.
   - Add the `MONGODB_URI` environment variable under **Settings** > **Environment Variables**.
   - Make sure your MongoDB Atlas cluster has IP whitelist `0.0.0.0/0` enabled under **Network Access**.
3. Deploy! Vercel automatically runs `npm run build` and serves both the client SPA and serverless API endpoints.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
