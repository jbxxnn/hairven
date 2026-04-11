"use client";

import { signIn } from "next-auth/react";

export default function GoogleSignInButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google", { callbackUrl: "/pricing/manage" })}
      className="inline-flex rounded-full bg-[#303940] px-6 py-3 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
    >
      Continue with Google
    </button>
  );
}
