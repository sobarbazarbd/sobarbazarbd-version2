# SobarbazarBD v2 — Next.js 15 + Tailwind + shadcn/ui

A clean, modern, mobile-first rebuild of the SobarbazarBD storefront — fully wired to the same backend as v1.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS 3** + **shadcn/ui** primitives (Radix UI)
- **Sonner** for toasts
- **Lucide** icons
- **Meta Pixel** integration
- Backend API: `https://api.hetdcl.com` (Django REST + Djoser auth, unchanged from v1)

## Setup

```bash
cd "frontend-v2"
npm install
cp .env.local.example .env.local
npm run dev
```

App runs on **port 3001** to coexist with v1 on 3000. Both share the backend.

## Environment variables

Same `.env.local` convention as v1 frontend:

| Var | Purpose |
|-----|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base (catalog, cart, orders) |
| `NEXT_PUBLIC_AUTH_API_URL` | Djoser auth base (usually same host) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel ID |
| `META_PIXEL_ACCESS_TOKEN` | Conversions API server token |
| `META_PIXEL_TEST_EVENT_CODE` | Test event code for pixel debugging |

## Backend endpoints in use

All endpoints come from `src/lib/api.ts`:

| Endpoint | Used by |
|----------|---------|
| `GET /api/v1.0/base/home-page-data/` | Home page (`/`) |
| `GET /api/v1.0/base/navbar-data/` | (available for header categories) |
| `GET /api/v1.0/customers/products/?page=...` | Shop listing |
| `GET /api/v1.0/customers/products/{slug}/` | Product detail |
| `GET /api/v1.0/customers/exclusive/` | Exclusive listing |
| `GET /api/v1.0/customers/exclusive/{id}/` | Exclusive detail |
| `GET /api/v1.0/customers/exclusive/categories/` | Exclusive category chips |
| `GET /api/v1.0/stores/` | All stores |
| `GET /api/v1.0/stores/categories/` | Shop filter sidebar |
| `GET /api/v1.0/blogs/posts/` | Blog list |
| `POST /api/v1.0/customers/carts/` | Create cart (lazy on first add) |
| `POST /api/v1.0/customers/carts/{id}/items/` | Add regular variant item |
| `PATCH /api/v1.0/customers/carts/{id}/items/{itemId}/` | Update qty |
| `DELETE /api/v1.0/customers/carts/{id}/items/{itemId}/` | Remove item |
| `POST /api/v1.0/customers/carts/{id}/add-dropshipping/` | Add exclusive item |
| `DELETE /api/v1.0/customers/carts/{id}/remove-dropshipping/{itemId}/` | Remove exclusive item |
| `POST /api/v1.0/customers/orders/` | Place order (COD or online via SSLCommerz) |
| `GET /api/v1.0/customers/orders/` | Order history (account/orders) |
| `POST /auth/jwt/create/` | Login (Djoser JWT) |
| `POST /auth/users/` | Register |
| `GET /auth/users/me/` | Current user |
| `PATCH /auth/users/me/` | Update profile |
| `POST /auth/users/reset_password/` | Send reset email |
| `POST /auth/users/reset_password_confirm/` | Confirm reset |

JWT token stored in localStorage as `access_token` + `refresh_token`. Cart ID persisted as `cart_id`.

## Folder structure

```
src/
  app/
    (auth)/login              # JWT login → /auth/jwt/create/
    (auth)/signup             # Register → /auth/users/
    account/                  # Profile + orders (auth-gated)
    blog/                     # Blog list
    cart/                     # Full cart (regular + exclusive items)
    checkout/                 # Checkout → POST /customers/orders/
    contact/                  # Contact form
    about/                    # About us
    become-seller/            # Vendor onboarding
    exclusive/                # Rakamari listing
    exclusive/[id]            # Exclusive detail w/ variants
    order-success/            # Confirmation
    product/[slug]            # Regular product detail
    shop/                     # Listing w/ filters + pagination
    stores/                   # All vendors
    wishlist/                 # (stub — needs persistence)
    layout.tsx, page.tsx, sitemap.ts, providers.tsx
  components/
    ui/                       # shadcn primitives
    layout/                   # header, footer, mobile-nav
    home/                     # hero, category-rail, product-section, feature-bar
    product/                  # product-card, gallery, buy-box, exclusive-buy-box
    shop/                     # filters, sort-bar, pagination
    meta-pixel.tsx            # Pixel loader + event helpers
  context/
    auth-context.tsx          # JWT auth (login/signup/logout/me)
    cart-context.tsx          # Backend-synced cart (regular + dropshipping)
  lib/
    api.ts                    # apiFetch + endpoints + types
    utils.ts                  # cn, formatBDT, discountPercent
public/
  robots.txt
```

## What works end-to-end

- ✅ Browse: home, shop (with filters/sort/pagination), product detail, exclusive listing/detail, blog, stores
- ✅ Auth: login + register + logout, JWT persisted, `/auth/users/me/` checked on mount
- ✅ Cart: lazy-create cart, add regular variant or exclusive dropshipping item, update qty, remove
- ✅ Checkout: contact + address + delivery zone + payment method → `POST /customers/orders/`, COD or SSLCommerz redirect
- ✅ Account: profile pre-filled from `me`, edit + PATCH, order history fetched real
- ✅ Meta Pixel: PageView (route change), ViewContent (product), AddToCart, InitiateCheckout, Purchase

## What's still TODO

- ⏳ Wishlist persistence (needs backend wishlist endpoint, or local storage)
- ⏳ Forgot/reset password pages (provider methods exist, UI not built)
- ⏳ Store detail page (`/stores/[slug]`)
- ⏳ Blog detail page (`/blog/[slug]`)
- ⏳ Order detail page (`/account/orders/[id]`)
- ⏳ Address book CRUD
- ⏳ Search autocomplete

## Design tokens

Brand color is emerald green (`hsl(142 71% 35%)`). Change in `src/app/globals.css` to retheme.

## Running side-by-side

| | URL | Folder |
|---|-----|--------|
| v1 | `localhost:3000` | `frontend/` |
| v2 | `localhost:3001` | `frontend-v2/` |

Both talk to the same backend — useful for A/B comparing experiences before fully migrating.
