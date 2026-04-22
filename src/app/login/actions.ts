"use server";

import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  hasAdminPasswordConfigured,
  isValidAdminPassword,
} from "@/lib/admin-session";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (!hasAdminPasswordConfigured()) {
    redirect("/login?error=not-configured");
  }

  if (!isValidAdminPassword(password)) {
    redirect("/login?error=invalid");
  }

  await createAdminSession();
  redirect("/pricing/manage");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/login");
}
