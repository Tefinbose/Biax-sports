
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to sign in.");
        return;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-xl sm:p-10">
        <Link
          href="/"
          className="mb-8 inline-block text-sm font-medium text-neutral-500 transition hover:text-[#d71920]"
        >
          ← Back to BIAX SPORTS
        </Link>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#d71920] text-2xl font-black text-white">
            B
          </div>

          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#d71920]">
            BIAX SPORTS
          </p>

          <h1 className="mt-3 text-3xl font-black text-neutral-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            Sign in to manage your sports store.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-neutral-700"
            >
              Email address
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-300 px-4 focus-within:border-[#d71920] focus-within:ring-2 focus-within:ring-red-100">
              <FiMail className="text-neutral-400 text-lg shrink-0" />

              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                className="w-full py-3.5 text-sm text-neutral-900 outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-neutral-700"
            >
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-neutral-300 px-4 focus-within:border-[#d71920] focus-within:ring-2 focus-within:ring-red-100">
              <FiLock className="text-neutral-400 text-lg shrink-0" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                maxLength={1024}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full py-3.5 text-sm text-neutral-900 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-neutral-400 hover:text-neutral-700"
              >
                {showPassword ? <FiEyeOff className="text-lg" /> : <FiEye className="text-lg" />}
              </button>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#d71920] px-4 py-3.5 font-bold text-white transition hover:bg-[#b51219] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in to Dashboard"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-neutral-400">
          BIAX SPORTS – Built for Impact
        </p>
      </div>
    </main>
  );
}
