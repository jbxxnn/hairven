import pricingData from "@/data/pricing.json";

export type PricingItem = {
  name: string;
  price: string;
  note?: string;
};

export type PricingSection = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  items: PricingItem[];
};

export type PricingDataset = {
  highlights: string[];
  sections: PricingSection[];
};

export const pricingDataset = pricingData as PricingDataset;

export const createEmptySection = (): PricingSection => ({
  id: "new-section",
  title: "New Section",
  eyebrow: "Category",
  description: "Add a short description for this section.",
  items: [{ name: "New service", price: "₦0", note: "" }],
});

export const createEmptyItem = (): PricingItem => ({
  name: "New service",
  price: "₦0",
  note: "",
});

export const clonePricingDataset = (): PricingDataset =>
  JSON.parse(JSON.stringify(pricingDataset)) as PricingDataset;

export const slugifySectionId = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
