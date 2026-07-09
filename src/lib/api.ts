export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.hetdcl.com";
export const AUTH_API_BASE = process.env.NEXT_PUBLIC_AUTH_API_URL || API_BASE;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sobarbazarbd.com";

type FetchOpts = RequestInit & { revalidate?: number; auth?: boolean };

/**
 * Universal API fetch helper.
 * - Pass `auth: true` to attach JWT from localStorage (client-side only).
 * - Pass `revalidate` for Next.js fetch caching (server components).
 */
export async function apiFetch<T = unknown>(
  path: string,
  opts: FetchOpts = {}
): Promise<T | null> {
  const { revalidate, auth, ...rest } = opts;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(rest.headers || {}),
  };

  if (auth && typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) (headers as Record<string, string>).Authorization = `JWT ${token}`;
  }

  const init: RequestInit & { next?: { revalidate?: number | false } } = { ...rest, headers };
  if (revalidate !== undefined) init.next = { revalidate };
  else if (!rest.cache) init.next = { revalidate: 60 };

  try {
    const res = await fetch(url, init);
    if (!res.ok) {
      // Surface JSON error if backend returned one
      try {
        const errBody = await res.json();
        console.warn(`API ${res.status}:`, url, errBody);
      } catch {
        /* ignore */
      }
      return null;
    }
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch (err) {
    console.error("API fetch failed:", url, err);
    return null;
  }
}

/* ── Endpoints — mirrors existing frontend ─────────────────── */

export const endpoints = {
  // Public catalog
  homePage: "/api/v1.0/base/home-page-data/",
  navbar: "/api/v1.0/base/navbar-data/",
  categories: "/api/v1.0/stores/categories/",
  brands: "/api/v1.0/stores/brands/",
  stores: "/api/v1.0/stores/",
  storesPublic: "/api/v1.0/stores/public/",
  storeDetail: (slug: string | number) => `/api/v1.0/stores/${slug}/`,
  storeDetailPublic: (slug: string | number) => `/api/v1.0/stores/public/${slug}/`,
  products: "/api/v1.0/customers/products/",
  productDetail: (slug: string) => `/api/v1.0/customers/products/${slug}/`,
  filterOptions: "/api/v1.0/customers/products/filter_options/",
  exclusive: "/api/v1.0/customers/exclusive/",
  exclusiveCategories: "/api/v1.0/customers/exclusive/categories/",
  exclusiveDetail: (id: string | number) => `/api/v1.0/customers/exclusive/${id}/`,
  blogPosts: "/api/v1.0/blogs/posts/",
  blogDetail: (slug: string) => `/api/v1.0/blogs/posts/${slug}/`,

  // Cart
  carts: "/api/v1.0/customers/carts/",
  cartItems: (cartId: string) => `/api/v1.0/customers/carts/${cartId}/items/`,
  cartItemDetail: (cartId: string, itemId: number | string) =>
    `/api/v1.0/customers/carts/${cartId}/items/${itemId}/`,
  addDropshipping: (cartId: string) => `/api/v1.0/customers/carts/${cartId}/add-dropshipping/`,
  removeDropshipping: (cartId: string, itemId: number | string) =>
    `/api/v1.0/customers/carts/${cartId}/remove-dropshipping/${itemId}/`,

  // Orders
  createOrder: "/api/v1.0/customers/orders/",
  myOrders: "/api/v1.0/customers/orders/",
  orderDetail: (id: string | number) => `/api/v1.0/customers/orders/${id}/`,
  orderTrack: (trackingId: string) => `/api/v1.0/customers/orders/track/${trackingId}/`,
  deliveryMethods: "/api/v1.0/stores/delivery/available-methods/",

  // Wishlist (favorites)
  favoriteProducts: "/api/v1.0/customers/favorite-products/",
  favoriteProductDetail: (id: string | number) => `/api/v1.0/customers/favorite-products/${id}/`,

  // Reviews
  productReviews: (productId: string | number) => `/api/v1.0/customers/products/${productId}/reviews/`,

  // Registration (custom backend endpoints — create User + profile in one call)
  customerRegister: "/api/v1.0/customers/register/",
  storeRegister: "/api/v1.0/stores/register/",

  // Auth (Djoser)
  authJwtCreate: "/auth/jwt/create/",
  authJwtRefresh: "/auth/jwt/refresh/",
  authUsers: "/auth/users/",
  authMe: "/auth/users/me/",
  authResetPassword: "/auth/users/reset_password/",
  authResetPasswordConfirm: "/auth/users/reset_password_confirm/",
};

/* ── Types ────────────────────────────────────────────────── */

export type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  results?: T;
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Category = {
  id: number;
  droploo_id?: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  image_url?: string;
  href?: string;
  isExclusive?: boolean;
  customer_products_count?: number;
  supplier_products_count?: number;
  subcategories?: Category[];
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
};

/** Response of /customers/products/filter_options/ */
export type FilterOptions = {
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    subcategories: Array<{ id: number; name: string; slug: string }>;
  }>;
  brands: Brand[];
  price_range: { min: number; max: number };
};

export type Store = {
  id: number | string;
  name: string;
  slug?: string;
  code?: string;
  logo?: string;
  banner?: string;
  description?: string;
  rating?: number;
  city?: string;
  address?: string;
  phone_number?: string;
  contact_email?: string;
  facebook_url?: string;
  twitter_url?: string;
  website_url?: string;
  showcase_images?: Array<{ image: string }>;
};

export type Variant = {
  id: number;
  name?: string;
  price: number;
  final_price: number;
  discount: number;
  stock: number;
  sold?: number;
  image?: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  short_description?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  review_count?: number;
  images?: Array<{ image: string; alt_text?: string }>;
  variants?: Variant[];
  default_variant?: Variant;
  store?: Store;
  category?: Category;
  subcategories?: Array<{ id: number; name: string }>;
  // Live API sometimes returns a bare object instead of an array when there's exactly one related product.
  related_products?: Product[] | Product;
};

export type Review = {
  id: number | string;
  rating: number;
  comment: string;
  image?: string;
  created_at?: string;
  customer?: { name?: string; profile_image?: string };
};

export type WishlistEntry = {
  id: number | string;
  product?: Product;
  product_details?: Product & { final_price?: number; price?: number; available_stock?: number; image?: string };
};

export type ExclusiveProduct = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  regular_price: number;
  selling_price: number;
  display_price: number;
  image_url: string;
  is_variable?: boolean;
  qty?: number;
  rating?: number;
  product_images?: Array<{
    id: number;
    size?: string;
    color?: string;
    imageUrl: string;
    price: number;
  }>;
};

export type CartItem = {
  id: number | string;
  product?: Product;
  variant?: Variant;
  quantity: number;
  discounted_price?: number;
  total_price?: number;
};

export type DropshippingItem = {
  id: number | string;
  product_id?: number;
  product_name?: string;
  product_image_url?: string;
  droploo_image_id?: number | string | null;
  size?: string;
  color?: string;
  unit_price: number;
  quantity: number;
  subtotal?: number;
};

export type User = {
  id: number;
  username: string;
  email: string;
  customer?: {
    name?: string;
    phone?: string;
    email?: string;
    shipping_address?: string;
  };
};
