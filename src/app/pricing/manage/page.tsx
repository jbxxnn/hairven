import { redirect } from "next/navigation";
import PricingManageClient from "@/components/pricing-manage-client";
import { isAdminSessionValid } from "@/lib/admin-session";

export default async function PricingManagePage() {
  if (!(await isAdminSessionValid())) {
    redirect("/login");
  }

  return <PricingManageClient />;
}
