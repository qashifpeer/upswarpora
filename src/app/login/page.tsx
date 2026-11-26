'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { loginAction, type LoginState } from './actions';

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-[calc(100vh-68px)] items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100 selection:bg-cyan-400 selection:text-slate-950">
      {/* Ambient Cyberpunk Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/3 h-80 w-80 rounded-full bg-cyan-500/15 blur-[120px]" />
        <div className="absolute bottom-10 right-1/3 h-80 w-80 rounded-full bg-fuchsia-600/15 blur-[120px]" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900/85 p-8 shadow-[0_0_45px_rgba(34,211,238,0.18)] backdrop-blur-xl">
        {/* Top Accent Line */}
        <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-400/60 bg-fuchsia-950/50 text-fuchsia-300 shadow-[0_0_20px_rgba(217,70,239,0.35)]">
            <svg
              className="h-7 w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <span className="mt-4 inline-block rounded-full border border-cyan-400/40 bg-cyan-950/60 px-3 py-0.5 font-mono text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            UDISE: 01011301201
          </span>

          <h1 className="mt-2 bg-gradient-to-r from-cyan-300 via-sky-200 to-fuchsia-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            GMS Warpora Staff Portal
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Sign in to manage student records, statuses &amp; certificates
          </p>
        </div>

        {/* Error Alert */}
        {state?.error && (
          <div
            role="alert"
            className="mt-5 flex items-center gap-2.5 rounded-xl border border-rose-500/70 bg-rose-950/60 px-4 py-3 text-xs font-semibold text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.3)]"
          >
            <svg
              className="h-4 w-4 shrink-0 text-rose-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="mt-6 space-y-5">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-bold uppercase tracking-wider text-cyan-400"
            >
              Staff ID / Username
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="Enter username"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-fuchsia-400"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/90 py-2.5 pl-10 pr-11 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 transition hover:text-cyan-300"
              >
                {showPassword ? (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-400/80 bg-gradient-to-r from-cyan-950 via-sky-950 to-fuchsia-950 px-4 py-3 text-xs font-extrabold uppercase tracking-widest text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.35)] transition hover:border-fuchsia-400 hover:text-white hover:shadow-[0_0_28px_rgba(217,70,239,0.5)] disabled:cursor-wait disabled:opacity-60"
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-300" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Access Portal</span>
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 border-t border-slate-800 pt-4 text-center">
          <Link
            href="/"
            className="text-xs font-medium text-slate-400 transition hover:text-cyan-300"
          >
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
}