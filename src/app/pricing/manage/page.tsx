import { redirect } from "next/navigation";
import { auth } from "@/auth";
import PricingManageClient from "@/components/pricing-manage-client";
import { isAdminEmail } from "@/lib/admin-auth";

export default async function PricingManagePage() {
  const session = await auth();

  if (!isAdminEmail(session?.user?.email)) {
    redirect("/login");
  }

  return <PricingManageClient />;
}
