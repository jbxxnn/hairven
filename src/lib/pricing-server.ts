import { google } from "googleapis";
import { pricingDataset, type PricingDataset, type PricingItem, type PricingSection } from "@/lib/pricing";

const HIGHLIGHTS_SHEET = "highlights";
const SECTIONS_SHEET = "sections";
const ITEMS_SHEET = "items";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSheetsClient() {
  const clientEmail = getEnv("GOOGLE_SHEETS_CLIENT_EMAIL");
  const privateKey = getEnv("GOOGLE_SHEETS_PRIVATE_KEY").replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

function getSpreadsheetId() {
  return getEnv("GOOGLE_SHEETS_SPREADSHEET_ID");
}

function toRow(value: string | undefined) {
  return value ?? "";
}

function parseRows(rows: string[][] | undefined) {
  return rows?.filter((row) => row.some((cell) => `${cell ?? ""}`.trim() !== "")) ?? [];
}

function normalizeRows(rows: unknown): string[][] | undefined {
  if (!Array.isArray(rows)) {
    return undefined;
  }

  return rows.map((row) =>
    Array.isArray(row) ? row.map((cell) => `${cell ?? ""}`) : []
  );
}

function parseHighlights(rows: string[][] | undefined): string[] {
  const dataRows = parseRows(rows).slice(1);
  return dataRows.map((row) => row[0] ?? "").filter(Boolean);
}

function parseSections(rows: string[][] | undefined): PricingSection[] {
  const dataRows = parseRows(rows).slice(1);

  return dataRows
    .map((row) => ({
      order: Number(row[0] ?? 0),
      id: row[1] ?? "",
      title: row[2] ?? "",
      eyebrow: row[3] ?? "",
      description: row[4] ?? "",
      backgroundColor: row[5] ?? "#000000",
      textColor: row[6] ?? "#FFFFFF",
    }))
    .filter((section) => section.id && section.title)
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...section }) => ({
      ...section,
      items: [],
    }));
}

function parseItems(rows: string[][] | undefined) {
  const dataRows = parseRows(rows).slice(1);

  return dataRows
    .map((row) => ({
      order: Number(row[0] ?? 0),
      sectionId: row[1] ?? "",
      name: row[2] ?? "",
      price: row[3] ?? "",
      note: row[4] ?? "",
    }))
    .filter((item) => item.sectionId && item.name);
}

function combineDataset(
  highlights: string[],
  sections: PricingSection[],
  items: Array<{ order: number; sectionId: string; name: string; price: string; note: string }>
): PricingDataset {
  const itemsBySection = new Map<string, PricingItem[]>();

  items
    .sort((a, b) => a.order - b.order)
    .forEach((item) => {
      const nextItem: PricingItem = {
        name: item.name,
        price: item.price,
        note: item.note || undefined,
      };

      const existing = itemsBySection.get(item.sectionId) ?? [];
      existing.push(nextItem);
      itemsBySection.set(item.sectionId, existing);
    });

  return {
    highlights,
    sections: sections.map((section) => ({
      ...section,
      items: itemsBySection.get(section.id) ?? [],
    })),
  };
}

async function ensureSheetTabs() {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();
  const metadata = await sheets.spreadsheets.get({ spreadsheetId });
  const existingTitles = new Set(
    metadata.data.sheets?.map((sheet) => sheet.properties?.title).filter(Boolean) as string[]
  );

  const missingTitles = [HIGHLIGHTS_SHEET, SECTIONS_SHEET, ITEMS_SHEET].filter(
    (title) => !existingTitles.has(title)
  );

  if (missingTitles.length === 0) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: missingTitles.map((title) => ({
        addSheet: {
          properties: { title },
        },
      })),
    },
  });
}

export async function readPricingDataset(): Promise<PricingDataset> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  const response = await sheets.spreadsheets.values.batchGet({
    spreadsheetId,
    ranges: [
      `${HIGHLIGHTS_SHEET}!A:B`,
      `${SECTIONS_SHEET}!A:G`,
      `${ITEMS_SHEET}!A:E`,
    ],
  });

  const [highlightsRange, sectionsRange, itemsRange] = response.data.valueRanges ?? [];

  const highlights = parseHighlights(normalizeRows(highlightsRange?.values));
  const sections = parseSections(normalizeRows(sectionsRange?.values));
  const items = parseItems(normalizeRows(itemsRange?.values));

  if (highlights.length === 0 && sections.length === 0 && items.length === 0) {
    return pricingDataset;
  }

  return combineDataset(highlights, sections, items);
}

export async function writePricingDataset(dataset: PricingDataset): Promise<void> {
  const sheets = getSheetsClient();
  const spreadsheetId = getSpreadsheetId();

  await ensureSheetTabs();

  await sheets.spreadsheets.values.batchClear({
    spreadsheetId,
    requestBody: {
      ranges: [
        `${HIGHLIGHTS_SHEET}!A:B`,
        `${SECTIONS_SHEET}!A:E`,
        `${ITEMS_SHEET}!A:E`,
      ],
    },
  });

  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: {
      valueInputOption: "RAW",
      data: [
        {
          range: `${HIGHLIGHTS_SHEET}!A:B`,
          values: [
            ["text", "order"],
            ...dataset.highlights.map((highlight, index) => [highlight, String(index + 1)]),
          ],
        },
        {
          range: `${SECTIONS_SHEET}!A:G`,
          values: [
            ["order", "id", "title", "eyebrow", "description", "backgroundColor", "textColor"],
            ...dataset.sections.map((section, index) => [
              String(index + 1),
              section.id,
              section.title,
              section.eyebrow,
              section.description,
              section.backgroundColor ?? "#000000",
              section.textColor ?? "#FFFFFF",
            ]),
          ],
        },
        {
          range: `${ITEMS_SHEET}!A:E`,
          values: [
            ["order", "section_id", "name", "price", "note"],
            ...dataset.sections.flatMap((section) =>
              section.items.map((item, index) => [
                String(index + 1),
                section.id,
                item.name,
                item.price,
                toRow(item.note),
              ])
            ),
          ],
        },
      ],
    },
  });
}

export function isPricingDataset(value: unknown): value is PricingDataset {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PricingDataset>;

  if (!Array.isArray(candidate.highlights) || !Array.isArray(candidate.sections)) {
    return false;
  }

  return candidate.highlights.every((highlight) => typeof highlight === "string") &&
    candidate.sections.every((section) => {
      if (!section || typeof section !== "object") {
        return false;
      }

      const nextSection = section as PricingDataset["sections"][number];

      return typeof nextSection.id === "string" &&
        typeof nextSection.title === "string" &&
        typeof nextSection.eyebrow === "string" &&
        typeof nextSection.description === "string" &&
        (nextSection.backgroundColor === undefined || typeof nextSection.backgroundColor === "string") &&
        (nextSection.textColor === undefined || typeof nextSection.textColor === "string") &&
        Array.isArray(nextSection.items) &&
        nextSection.items.every((item) =>
          item &&
          typeof item === "object" &&
          typeof item.name === "string" &&
          typeof item.price === "string" &&
          (item.note === undefined || typeof item.note === "string")
        );
    });
}

export async function readPricingDatasetSafely(): Promise<PricingDataset> {
  try {
    return await readPricingDataset();
  } catch {
    return pricingDataset;
  }
}
