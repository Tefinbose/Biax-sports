"use client";

import { useState } from "react";
import { CheckCircle2, Send, Loader2, ShieldCheck } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "email",
    category: "general",
    orderId: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setStatus("success");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      preferredContact: "email",
      category: "general",
      orderId: "",
      subject: "",
      message: "",
    });
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-8 text-center sm:p-12 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="mt-5 text-xl font-black uppercase tracking-tight text-neutral-950 sm:text-2xl">
          Inquiry Submitted
        </h3>
        <p className="mt-2.5 max-w-md text-xs leading-6 text-neutral-600 sm:text-sm">
          Thank you for reaching out, <span className="font-semibold text-neutral-900">{formData.name}</span>.
          Our customer support desk has received your request and will follow up via{" "}
          <span className="font-semibold text-neutral-900">{formData.email}</span> within 24 business hours.
        </p>
        <div className="mt-5 rounded-xl bg-neutral-50 px-4 py-2.5 text-xs text-neutral-600">
          Inquiry Department: <span className="font-semibold uppercase text-neutral-900">{formData.category}</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="mt-6 rounded-full bg-neutral-950 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-primary"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm"
    >
      <div className="mb-5 border-b border-neutral-100 pb-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-neutral-950 sm:text-xl">
          Send us a message
        </h3>
        <p className="mt-0.5 text-xs text-neutral-500">
          Official BIAX Sports support, orders & academy inquiries
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Full Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Email Address <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. rahul@example.com"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="phone"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Phone / WhatsApp
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="preferredContact"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Preferred Contact
            </label>
            <select
              id="preferredContact"
              name="preferredContact"
              value={formData.preferredContact}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
            >
              <option value="email">Email</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="phone">Phone Call</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="category"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Inquiry Department <span className="text-primary">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
            >
              <option value="general">General Inquiries</option>
              <option value="orders">Order Status & Tracking</option>
              <option value="academy">Martial Arts Academy Orders</option>
              <option value="bulk">Bulk Sportswear & Equipment</option>
              <option value="wholesale">Distributor & Wholesale</option>
              <option value="exchange">Size Exchange & Support</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="orderId"
              className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
            >
              Order ID <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              value={formData.orderId}
              onChange={handleChange}
              placeholder="e.g. BIAX-ORD-1024"
              className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
          >
            Subject Line
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief summary of inquiry"
            className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-xs font-bold uppercase tracking-wider text-neutral-700"
          >
            Your Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us what you need help with, custom sizing requirements, academy quantities, or questions..."
            className="mt-1.5 w-full rounded-xl border border-neutral-300 bg-neutral-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 transition focus:border-primary focus:bg-white focus:outline-none resize-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-between gap-4 border-t border-neutral-100">
          <span className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            Direct Desk
          </span>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-primary/25 transition hover:bg-primary-hover active:scale-95 disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={14} />
                Send Message
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
