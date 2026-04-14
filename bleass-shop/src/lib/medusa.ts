import axios from "axios";

const API_URL = import.meta.env.VITE_MEDUSA_API_URL ?? "http://localhost:9000";
const PUB_API_KEY = import.meta.env.VITE_MEDUSA_PUB_API_KEY ?? "";

export const medusaClient = axios.create({
  baseURL: API_URL,
  headers: {
    "x-publishable-api-key": PUB_API_KEY,
  },
});

export interface ProductVariant {
  id: string;
  title: string;
  sku: string;
  prices: { amount: number; currency_code: string }[];
}

export interface ProductImage {
  id: string;
  url: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  handle: string;
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  thumbnail: string | null;
  status: string;
  options: { id: string; title: string; values: { id: string; value: string }[] }[];
  images: ProductImage[];
  variants: ProductVariant[];
  categories?: ProductCategory[];
  metadata?: Record<string, string>;
}

export const getProducts = async (category?: string): Promise<Product[]> => {
  const params: Record<string, string> = {
    limit: "50",
    fields: "id,title,handle,description,thumbnail,status,options,variants,images,metadata,categories",
  };
  if (category) params["categories"] = category;

  const { data } = await medusaClient.get("/store/products", { params });
  return data.products;
};

export const getProduct = async (handle: string): Promise<Product> => {
  const { data } = await medusaClient.get("/store/products", {
    params: { handle, fields: "id,title,handle,description,thumbnail,status,options,variants,images,metadata" },
  });
  return data.products[0];
};

export const getCategories = async (): Promise<ProductCategory[]> => {
  const { data } = await medusaClient.get("/store/product-categories", {
    params: { limit: 20, fields: "id,name,handle" },
  });
  return data.product_categories;
};

export const formatPrice = (amount: number, currency = "eur"): string => {
  const euros = amount / 100;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(euros);
};

// ─── Bundle types ────────────────────────────────────────────

export interface BundlePlugin {
  id: string;
  handle: string;
  name: string;
  price: number;
  priceLabel: string;
  thumbnail?: string | null;
  description?: string | null;
}

export interface BundlePricing {
  originalTotal: number;
  originalTotalLabel: string;
  bundlePrice: number;
  bundlePriceLabel: string;
  savings: number;
  savingsLabel: string;
  savingsPercent: number;
}

export interface Bundle {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  variantId: string | null;
  plugins: BundlePlugin[];
  pricing: BundlePricing;
}

export const getBundles = async (): Promise<Bundle[]> => {
  const { data } = await medusaClient.get("/store/custom/bundles");
  return data.bundles;
};

export const getBundle = async (handle: string): Promise<{ bundle: Bundle }> => {
  const { data } = await medusaClient.get(`/store/custom/bundles/${handle}`);
  return data;
};