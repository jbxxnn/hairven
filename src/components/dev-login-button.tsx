"use client";

import { signIn } from "next-auth/react";

export default function DevLoginButton() {
  return (
    <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">Developer Mode</p>
      <p className="mt-1 text-sm text-yellow-800">
        You are in development. Click below to bypass Google OAuth and sign in as the admin.
      </p>
      <button
        type="button"
        onClick={() => signIn("dev-login", { callbackUrl: "/pricing/manage" })}
        className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-yellow-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-yellow-700"
      >
        Sign in with Dev Bypass
      </button>
    </div>
  );
}
