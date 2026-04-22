import { NextResponse } from "next/server";
import { isAdminSessionValid } from "@/lib/admin-session";
import {
  isPricingDataset,
  readPricingDatasetSafely,
  writePricingDataset,
} from "@/lib/pricing-server";

export async function GET() {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dataset = await readPricingDatasetSafely();
  return NextResponse.json(dataset);
}

export async function PUT(request: Request) {
  if (!(await isAdminSessionValid())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();

  if (!isPricingDataset(payload)) {
    return NextResponse.json({ error: "Invalid pricing dataset." }, { status: 400 });
  }

  await writePricingDataset(payload);

  return NextResponse.json({
    ok: true,
    updatedAt: new Date().toISOString(),
  });
}
