
"use client";

import { useEffect, useState, type FormEvent } from "react";
import AdminSidebar  from "@/components/admin/admin-sidebar";
import {
  FiSave,
  FiShoppingBag,
  FiTruck,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

type StoreSettings = {
  storeName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
};

const initialSettings: StoreSettings = {
  storeName: "BIAX SPORTS",
  tagline: "Empowering Athletes. Elevating Performance.",
  contactEmail: "info@biaxsports.com",
  phone: "",
  address: "",
  shippingCharge: 0,
  freeShippingThreshold: 0,
  codEnabled: true,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<StoreSettings>(initialSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings", {
          cache: "no-store",
        });
        if (response.status === 401) {
          window.location.href = "/admin/login";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load settings.");
        }

        if (active) {
          setSettings({
            ...initialSettings,
            ...data.settings,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load store settings."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  function updateSetting<K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...settings,
          shippingCharge: Number(settings.shippingCharge),
          freeShippingThreshold: Number(
            settings.freeShippingThreshold
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save settings.");
      }

      setSettings({
        ...initialSettings,
        ...data.settings,
      });

      setMessage("Your store settings have been saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100";

  const labelClass = "text-sm font-semibold text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="min-h-screen px-4 py-8 sm:px-6 lg:ml-72 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
              Store management
            </p>
            <h1 className="mt-2 text-3xl font-black text-gray-950">
              Store Settings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your BIAX SPORTS store information and delivery
              preferences.
            </p>
          </div>

          {message && (
            <div
              role="status"
              className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
            >
              <FiCheckCircle className="text-xl shrink-0" />
              {message}
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <FiAlertCircle className="text-xl shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-12 text-gray-600">
              <FiLoader className="animate-spin text-xl" />
              Loading settings...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-red-50 p-3 text-red-600">
                    <FiShoppingBag className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-950">
                      Store information
                    </h2>
                    <p className="text-sm text-gray-500">
                      Your store identity and branding.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Store name
                    <input
                      className={inputClass}
                      value={settings.storeName}
                      onChange={(e) =>
                        updateSetting("storeName", e.target.value)
                      }
                      maxLength={100}
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    Tagline
                    <input
                      className={inputClass}
                      value={settings.tagline}
                      onChange={(e) =>
                        updateSetting("tagline", e.target.value)
                      }
                      maxLength={200}
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-red-50 p-3 text-red-600">
                    <FiMail className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-950">
                      Contact information
                    </h2>
                    <p className="text-sm text-gray-500">
                      How customers can reach your business.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <label className={labelClass}>
                    Contact email
                    <input
                      className={inputClass}
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        updateSetting("contactEmail", e.target.value)
                      }
                      maxLength={254}
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    <span className="flex items-center gap-2">
                      <FiPhone className="text-base text-gray-400" />
                      Phone number
                    </span>
                    <input
                      className={inputClass}
                      type="tel"
                      value={settings.phone}
                      onChange={(e) =>
                        updateSetting("phone", e.target.value)
                      }
                      maxLength={30}
                      placeholder="Enter your business phone number"
                    />
                  </label>

                  <label className={labelClass}>
                    <span className="flex items-center gap-2">
                      <FiMapPin className="text-base text-gray-400" />
                      Business address
                    </span>
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={settings.address}
                      onChange={(e) =>
                        updateSetting("address", e.target.value)
                      }
                      maxLength={500}
                      placeholder="Enter your complete business address"
                    />
                  </label>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-red-50 p-3 text-red-600">
                    <FiTruck className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-950">
                      Shipping and payments
                    </h2>
                    <p className="text-sm text-gray-500">
                      Configure your basic delivery preferences.
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className={labelClass}>
                    Shipping charge (₹)
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      max="100000"
                      step="0.01"
                      value={settings.shippingCharge}
                      onChange={(e) =>
                        updateSetting(
                          "shippingCharge",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </label>

                  <label className={labelClass}>
                    Free shipping above (₹)
                    <input
                      className={inputClass}
                      type="number"
                      min="0"
                      max="10000000"
                      step="0.01"
                      value={settings.freeShippingThreshold}
                      onChange={(e) =>
                        updateSetting(
                          "freeShippingThreshold",
                          Number(e.target.value)
                        )
                      }
                      required
                    />
                  </label>
                </div>

                <label className="mt-6 flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-red-600"
                    checked={settings.codEnabled}
                    onChange={(e) =>
                      updateSetting("codEnabled", e.target.checked)
                    }
                  />
                  <span>
                    <span className="block font-semibold text-gray-900">
                      Enable Cash on Delivery
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      Allow customers to select COD during checkout.
                      This setting must also be enforced by the checkout
                      API before it affects real orders.
                    </span>
                  </span>
                </label>
              </section>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <FiLoader className="animate-spin text-lg" />
                  ) : (
                    <FiSave className="text-lg" />
                  )}
                  {saving ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
