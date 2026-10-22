
"use client";

import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiPackage,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminLogoutButton from "@/components/admin/logout-button";

type Category =
  | "sportswear"
  | "martial-arts-uniforms"
  | "sports-equipment";

type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Category;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  sku: string;
  featured: boolean;
  published: boolean;
};

type ProductForm = {
  name: string;
  sku: string;
  category: Category;
  price: string;
  compareAtPrice: string;
  stock: string;
  shortDescription: string;
  description: string;
  images: string;
  sizes: string;
  colors: string;
  featured: boolean;
  published: boolean;
};

const emptyForm: ProductForm = {
  name: "",
  sku: "",
  category: "sportswear",
  price: "",
  compareAtPrice: "",
  stock: "0",
  shortDescription: "",
  description: "",
  images: "",
  sizes: "",
  colors: "",
  featured: false,
  published: false,
};

const categories: { value: Category; label: string }[] = [
  { value: "sportswear", label: "Sportswear" },
  {
    value: "martial-arts-uniforms",
    label: "Martial Arts Uniforms",
  },
  { value: "sports-equipment", label: "Sports Equipment" },
];

function splitValues(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function productToForm(product: Product): ProductForm {
  return {
    name: product.name,
    sku: product.sku,
    category: product.category,
    price: String(product.price),
    compareAtPrice:
      product.compareAtPrice !== undefined
        ? String(product.compareAtPrice)
        : "",
    stock: String(product.stock),
    shortDescription: product.shortDescription ?? "",
    description: product.description,
    images: product.images.join("\n"),
    sizes: product.sizes.join(", "),
    colors: product.colors.join(", "),
    featured: product.featured,
    published: product.published,
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(price);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load products.");
      }

      setProducts(data.products ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load products.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function updateField<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  }

  function startEditing(product: Product) {
    setForm(productToForm(product));
    setEditingId(product._id);
    setError("");
    setSuccess("");

    document
      .getElementById("product-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.sku.trim()) {
      setError("Product name and SKU are required.");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      setError("Stock must be a whole number of zero or more.");
      return;
    }

    const images = splitValues(form.images);

    if (images.length === 0) {
      setError("Enter at least one product image URL.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category,
      price: Number(form.price),
      ...(form.compareAtPrice.trim()
        ? { compareAtPrice: Number(form.compareAtPrice) }
        : {}),
      stock: Number(form.stock),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      images,
      sizes: splitValues(form.sizes),
      colors: splitValues(form.colors),
      featured: form.featured,
      published: form.published,
    };

    setSaving(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...payload } : payload,
        ),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not save the product.");
      }

      setSuccess(
        editingId
          ? "Product updated successfully."
          : "Product created successfully.",
      );

      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save the product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}" permanently? This cannot be undone.`,
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setBusyId(product._id);

    try {
      const response = await fetch(
        `/api/admin/products?id=${encodeURIComponent(product._id)}`,
        { method: "DELETE" },
      );

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not delete the product.");
      }

      if (editingId === product._id) resetForm();

      setSuccess("Product deleted successfully.");
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete the product.",
      );
    } finally {
      setBusyId(null);
    }
  }

  async function togglePublished(product: Product) {
    setError("");
    setSuccess("");
    setBusyId(product._id);

    try {
      const payload = {
        id: product._id,
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        ...(product.compareAtPrice !== undefined
          ? { compareAtPrice: product.compareAtPrice }
          : {}),
        stock: product.stock,
        shortDescription: product.shortDescription ?? "",
        description: product.description,
        images: product.images,
        sizes: product.sizes,
        colors: product.colors,
        featured: product.featured,
        published: !product.published,
      };

      const response = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Could not change publish status.");
      }

      setSuccess(
        product.published
          ? "Product unpublished."
          : "Product published successfully.",
      );

      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not change publish status.",
      );
    } finally {
      setBusyId(null);
    }
  }

  const filteredProducts = products.filter((product) => {
    const term = search.trim().toLowerCase();

    return (
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  });

  const publishedCount = products.filter((product) => product.published).length;

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#d71920] focus:ring-2 focus:ring-red-100";

  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar />

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d71920]">
              BIAX SPORTS
            </p>
            <h1 className="text-lg font-bold">Product Management</h1>
          </div>
          <AdminLogoutButton />
        </header>

        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Total products</p>
                <FiPackage className="text-[#d71920] text-xl" />
              </div>
              <p className="mt-3 text-3xl font-bold">{products.length}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Published products</p>
              <p className="mt-3 text-3xl font-bold">{publishedCount}</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-500">Draft products</p>
              <p className="mt-3 text-3xl font-bold">
                {products.length - publishedCount}
              </p>
            </div>
          </section>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <FiAlertCircle className="mt-0.5 shrink-0 text-lg" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
            >
              <FiCheckCircle className="mt-0.5 shrink-0 text-lg" />
              <span>{success}</span>
            </div>
          )}

          <section
            id="product-form"
            className="scroll-mt-24 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? "Edit product" : "Add a new product"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter product details below.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  <FiX className="text-base" />
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <label className={labelClass}>
                  Product name *
                  <input
                    required
                    maxLength={150}
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g. BIAX Training T-Shirt"
                  />
                </label>

                <label className={labelClass}>
                  SKU *
                  <input
                    required
                    maxLength={80}
                    className={inputClass}
                    value={form.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                    placeholder="e.g. BXS-001"
                  />
                </label>

                <label className={labelClass}>
                  Category *
                  <select
                    className={inputClass}
                    value={form.category}
                    onChange={(e) =>
                      updateField("category", e.target.value as Category)
                    }
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass}>
                  Selling price (₹) *
                  <input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={inputClass}
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="999"
                  />
                </label>

                <label className={labelClass}>
                  Compare-at price (₹)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={inputClass}
                    value={form.compareAtPrice}
                    onChange={(e) =>
                      updateField("compareAtPrice", e.target.value)
                    }
                    placeholder="Optional original price"
                  />
                </label>

                <label className={labelClass}>
                  Stock quantity *
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    className={inputClass}
                    value={form.stock}
                    onChange={(e) => updateField("stock", e.target.value)}
                  />
                </label>
              </div>

              <label className={labelClass}>
                Short description
                <input
                  maxLength={300}
                  className={inputClass}
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  placeholder="A short summary shown on product cards"
                />
              </label>

              <label className={labelClass}>
                Full description *
                <textarea
                  required
                  minLength={10}
                  maxLength={10000}
                  rows={4}
                  className={inputClass}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe the product, its material, fit, features, and uses..."
                />
              </label>

              <label className={labelClass}>
                Product image URLs *
                <textarea
                  required
                  rows={3}
                  className={inputClass}
                  value={form.images}
                  onChange={(e) => updateField("images", e.target.value)}
                  placeholder={"Enter one image URL per line\nhttps://example.com/product.jpg"}
                />
                <span className="mt-1 block text-xs font-normal text-gray-500">
                  Enter at least one image URL. File uploading will be added
                  separately.
                </span>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Sizes
                  <input
                    className={inputClass}
                    value={form.sizes}
                    onChange={(e) => updateField("sizes", e.target.value)}
                    placeholder="S, M, L, XL, XXL"
                  />
                </label>

                <label className={labelClass}>
                  Colors
                  <input
                    className={inputClass}
                    value={form.colors}
                    onChange={(e) => updateField("colors", e.target.value)}
                    placeholder="Black, Red, White"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-5">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField("featured", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#d71920]"
                  />
                  Featured product
                </label>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) =>
                      updateField("published", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#d71920]"
                  />
                  Publish on storefront
                </label>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d71920] px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <FiLoader className="animate-spin text-lg" />
                ) : editingId ? (
                  <FiEdit2 className="text-lg" />
                ) : (
                  <FiPlus className="text-lg" />
                )}
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "Add product"}
              </button>
            </form>
          </section>

          <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">All products</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your store catalogue.
                </p>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, SKU, category..."
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#d71920] focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center gap-2 p-12 text-sm text-gray-500">
                <FiLoader className="animate-spin text-xl" />
                Loading products...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center">
                <FiPackage className="mx-auto text-gray-300 text-4xl" />
                <p className="mt-3 font-semibold">No products found</p>
                <p className="mt-1 text-sm text-gray-500">
                  Add a product above or try another search.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Product</th>
                      <th className="px-5 py-3 font-semibold">SKU</th>
                      <th className="px-5 py-3 font-semibold">Price</th>
                      <th className="px-5 py-3 font-semibold">Stock</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50/70">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {product.images[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                                <FiPackage className="text-xl text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900">
                                {product.name}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {categories.find(
                                  (item) => item.value === product.category,
                                )?.label ?? product.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-600">
                          {product.sku}
                        </td>
                        <td className="px-5 py-4 font-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={
                              product.stock === 0
                                ? "font-semibold text-red-600"
                                : product.stock < 5
                                  ? "font-semibold text-amber-600"
                                  : "text-gray-700"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={
                              product.published
                                ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700"
                                : "rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600"
                            }
                          >
                            {product.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => void togglePublished(product)}
                              disabled={busyId === product._id}
                              title={
                                product.published ? "Unpublish" : "Publish"
                              }
                              aria-label={
                                product.published
                                  ? `Unpublish ${product.name}`
                                  : `Publish ${product.name}`
                              }
                              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              {product.published ? (
                                <FiEyeOff className="text-base" />
                              ) : (
                                <FiEye className="text-base" />
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => startEditing(product)}
                              title="Edit product"
                              aria-label={`Edit ${product.name}`}
                              className="rounded-lg p-2 text-blue-700 hover:bg-blue-50"
                            >
                              <FiEdit2 className="text-base" />
                            </button>

                            <button
                              type="button"
                              onClick={() => void deleteProduct(product)}
                              disabled={busyId === product._id}
                              title="Delete product"
                              aria-label={`Delete ${product.name}`}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {busyId === product._id ? (
                                <FiLoader
                                  className="animate-spin text-base"
                                />
                              ) : (
                                <FiTrash2 className="text-base" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="border-t border-gray-200 px-5 py-3 text-xs text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
