"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminLogoutButton from "@/components/admin/logout-button";
import {
  FiTag,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEdit2,
  FiCopy,
  FiCheck,
  FiCalendar,
  FiPercent,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa6";

interface CouponItem {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderValue: number;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startDate?: string;
  endDate?: string | null;
  active: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form state
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "flat",
    discountValue: "",
    minOrderValue: "",
    maxDiscountAmount: "",
    usageLimit: "",
    endDate: "",
    active: true,
  });

  async function loadCoupons() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to load coupons");
      }
      setCoupons(data.coupons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading coupons");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleToggleActive(coupon: CouponItem) {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: coupon._id,
          active: !coupon.active,
        }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, active: !c.active } : c)),
        );
      }
    } catch {
      // Ignore
    }
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Are you sure you want to delete coupon '${code}'?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Could not delete coupon.");
      }
    } catch {
      alert("Failed to delete coupon.");
    }
  }

  function openCreateModal() {
    setEditingCoupon(null);
    setFormError("");
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderValue: "",
      maxDiscountAmount: "",
      usageLimit: "",
      endDate: "",
      active: true,
    });
    setModalOpen(true);
  }

  function openEditModal(coupon: CouponItem) {
    setEditingCoupon(coupon);
    setFormError("");
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: coupon.minOrderValue ? String(coupon.minOrderValue) : "",
      maxDiscountAmount: coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : "",
      usageLimit: coupon.usageLimit ? String(coupon.usageLimit) : "",
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 10) : "",
      active: coupon.active,
    });
    setModalOpen(true);
  }

  async function handleSubmitCoupon(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setFormSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : 0,
        maxDiscountAmount: formData.maxDiscountAmount
          ? Number(formData.maxDiscountAmount)
          : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        endDate: formData.endDate ? formData.endDate : null,
        active: formData.active,
      };

      if (editingCoupon) {
        payload.id = editingCoupon._id;
      }

      const res = await fetch("/api/admin/coupons", {
        method: editingCoupon ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || `Failed to ${editingCoupon ? "update" : "create"} coupon.`);
        return;
      }

      if (editingCoupon) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === editingCoupon._id ? data.coupon : c)),
        );
      } else {
        setCoupons((prev) => [data.coupon, ...prev]);
      }

      setModalOpen(false);
      setEditingCoupon(null);
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minOrderValue: "",
        maxDiscountAmount: "",
        usageLimit: "",
        endDate: "",
        active: true,
      });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setFormSubmitting(false);
    }
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }

  // Filtered list
  const filtered = coupons.filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === "active") return c.active;
    if (statusFilter === "inactive") return !c.active;
    return true;
  });

  const totalCoupons = coupons.length;
  const activeCount = coupons.filter((c) => c.active).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f7f7f8]">
      <AdminSidebar />

      <div className="min-h-screen pt-16 lg:ml-72 lg:pt-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex min-h-[88px] items-center justify-between gap-4 border-b border-neutral-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#d71920]">
              Marketing & Sales
            </p>
            <h1 className="mt-1 text-xl font-black text-neutral-900 sm:text-2xl">
              Coupons & Promotions
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-primary-hover active:scale-95"
            >
              <FiPlus size={16} />
              <span>Create Coupon</span>
            </button>
            <AdminLogoutButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-[1600px] p-5 sm:p-8 space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Total Coupons</span>
                <FiTag className="text-primary text-lg" />
              </div>
              <p className="mt-3 text-3xl font-black text-neutral-950">{totalCoupons}</p>
              <p className="mt-1 text-xs text-neutral-500">Created promotional codes</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Active Codes</span>
                <FiCheckCircle className="text-emerald-500 text-lg" />
              </div>
              <p className="mt-3 text-3xl font-black text-emerald-600">{activeCount}</p>
              <p className="mt-1 text-xs text-neutral-500">Currently valid for checkout</p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between text-neutral-500">
                <span className="text-xs font-bold uppercase tracking-wider">Redemptions</span>
                <FiPercent className="text-indigo-500 text-lg" />
              </div>
              <p className="mt-3 text-3xl font-black text-indigo-600">{totalRedemptions}</p>
              <p className="mt-1 text-xs text-neutral-500">Total orders with coupon discount</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by code or description..."
                className="w-full rounded-xl border border-neutral-200 py-2.5 pl-10 pr-4 text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-xl border border-neutral-200 bg-neutral-50 p-1">
                {(["all", "active", "inactive"] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setStatusFilter(filter)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition ${
                      statusFilter === filter
                        ? "bg-white text-neutral-900 shadow-xs"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <button
                onClick={loadCoupons}
                title="Refresh coupons"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-white text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} size={16} />
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
              <FiAlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs">
            {loading ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 p-8">
                <FiLoader className="animate-spin text-primary" size={24} />
                <p className="text-xs font-semibold text-neutral-500">Loading coupon catalog...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-400 mb-3">
                  <FiTag size={22} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-neutral-800">
                  No coupons found
                </h3>
                <p className="mt-1 text-xs text-neutral-500 max-w-sm">
                  {search
                    ? "Try adjusting your search query or status filter."
                    : "Create your first discount coupon to launch promotional sales."}
                </p>
                {!search && (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary transition"
                  >
                    <FiPlus size={15} />
                    <span>Create Now</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/75 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      <th className="px-5 py-3.5">Code</th>
                      <th className="px-5 py-3.5">Discount</th>
                      <th className="px-5 py-3.5">Min Order</th>
                      <th className="px-5 py-3.5">Redemptions</th>
                      <th className="px-5 py-3.5">Validity</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((item) => {
                      const isExpired = item.endDate && new Date(item.endDate) < new Date();

                      return (
                        <tr
                          key={item._id}
                          className="transition hover:bg-neutral-50/60"
                        >
                          {/* Code */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black uppercase tracking-wider text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200">
                                {item.code}
                              </span>
                              <button
                                onClick={() => handleCopy(item.code)}
                                title="Copy code"
                                className="text-neutral-400 hover:text-neutral-700 transition"
                              >
                                {copiedCode === item.code ? (
                                  <FiCheck className="text-emerald-500" size={14} />
                                ) : (
                                  <FiCopy size={13} />
                                )}
                              </button>
                            </div>
                            {item.description && (
                              <p className="mt-1 text-[11px] text-neutral-500 line-clamp-1 max-w-[220px]">
                                {item.description}
                              </p>
                            )}
                          </td>

                          {/* Discount */}
                          <td className="px-5 py-4">
                            <span className="font-black text-neutral-900">
                              {item.discountType === "percentage"
                                ? `${item.discountValue}% OFF`
                                : `₹${item.discountValue.toLocaleString("en-IN")} FLAT`}
                            </span>
                            {item.discountType === "percentage" && item.maxDiscountAmount ? (
                              <p className="text-[10px] text-neutral-400">
                                Max ₹{item.maxDiscountAmount.toLocaleString("en-IN")}
                              </p>
                            ) : null}
                          </td>

                          {/* Min Order */}
                          <td className="px-5 py-4 font-semibold text-neutral-700">
                            {item.minOrderValue > 0
                              ? `₹${item.minOrderValue.toLocaleString("en-IN")}`
                              : "No minimum"}
                          </td>

                          {/* Redemptions */}
                          <td className="px-5 py-4">
                            <span className="font-bold text-neutral-800">
                              {item.usedCount}
                            </span>
                            <span className="text-neutral-400">
                              {" "}
                              / {item.usageLimit ? item.usageLimit : "∞"}
                            </span>
                          </td>

                          {/* Validity */}
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-neutral-600">
                              <FiCalendar size={13} className="text-neutral-400" />
                              <span>
                                {item.endDate
                                  ? `Until ${new Date(item.endDate).toLocaleDateString("en-IN", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}`
                                  : "Never expires"}
                              </span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-4">
                            {isExpired ? (
                              <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-amber-800">
                                Expired
                              </span>
                            ) : item.active ? (
                              <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex rounded-full bg-neutral-200 px-2.5 py-0.5 text-[10px] font-bold uppercase text-neutral-700">
                                Disabled
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(item)}
                                title="Edit coupon"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition"
                              >
                                <FiEdit2 size={14} />
                              </button>

                              {/* Active toggle */}
                              <button
                                onClick={() => handleToggleActive(item)}
                                title={item.active ? "Deactivate coupon" : "Activate coupon"}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase transition ${
                                  item.active
                                    ? "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
                                    : "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {item.active ? "Pause" : "Enable"}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(item._id, item.code)}
                                title="Delete coupon"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600 transition"
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE / EDIT COUPON MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {editingCoupon ? <FiEdit2 size={18} /> : <FiTag size={18} />}
                </div>
                <div>
                  <h2 className="text-base font-black uppercase tracking-tight text-neutral-900">
                    {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    {editingCoupon
                      ? "Modify discount values, limits, and expiry dates."
                      : "Set discount type, rules, and restrictions."}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
              >
                <FiX size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                <FiAlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitCoupon} className="mt-4 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. BIAX20, IMPACT100, SUMMER"
                  className="w-full font-mono rounded-xl border border-neutral-300 px-3.5 py-2.5 text-sm uppercase text-neutral-900 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  Description / Internal Note
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. 20% off for national championship participants"
                  className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                />
              </div>

              {/* Type and Value */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as "percentage" | "flat",
                      })
                    }
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-bold text-neutral-900 outline-none focus:border-neutral-900"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === "percentage" ? 100 : undefined}
                    required
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData({ ...formData, discountValue: e.target.value })
                    }
                    placeholder={formData.discountType === "percentage" ? "e.g. 15" : "e.g. 500"}
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-bold text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Restrictions Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) =>
                      setFormData({ ...formData, minOrderValue: e.target.value })
                    }
                    placeholder="0 = No minimum"
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </div>

                {formData.discountType === "percentage" ? (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Max Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.maxDiscountAmount}
                      onChange={(e) =>
                        setFormData({ ...formData, maxDiscountAmount: e.target.value })
                      }
                      placeholder="Optional cap (e.g. 1000)"
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: e.target.value })
                      }
                      placeholder="Optional max uses"
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </div>
                )}
              </div>

              {/* Expiry Date */}
              <div className="grid grid-cols-2 gap-3">
                {formData.discountType === "percentage" && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) =>
                        setFormData({ ...formData, usageLimit: e.target.value })
                      }
                      placeholder="Optional max uses"
                      className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-xl border border-neutral-300 px-3.5 py-2 text-xs text-neutral-900 outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="couponActive"
                  className="text-xs font-bold text-neutral-800 cursor-pointer"
                >
                  {editingCoupon ? "Active for customer checkout" : "Activate immediately upon creation"}
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-primary-hover active:scale-95 disabled:opacity-60"
                >
                  {formSubmitting ? (
                    <>
                      <FiLoader className="animate-spin" size={14} />
                      <span>{editingCoupon ? "Saving..." : "Creating..."}</span>
                    </>
                  ) : (
                    <span>{editingCoupon ? "Save Changes" : "Create Coupon"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
