"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clonePricingDataset,
  createEmptyItem,
  createEmptySection,
  slugifySectionId,
  type PricingDataset,
} from "@/lib/pricing";

export default function PricingManageClient() {
  const [dataset, setDataset] = useState<PricingDataset>(() => clonePricingDataset());
  const [selectedSectionId, setSelectedSectionId] = useState(dataset.sections[0]?.id ?? "");
  const [copyState, setCopyState] = useState("Copy JSON");
  const [saveState, setSaveState] = useState("Save changes");
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Loading latest pricing data...");

  const selectedSection = dataset.sections.find((section) => section.id === selectedSectionId);
  const exportJson = useMemo(() => JSON.stringify(dataset, null, 2), [dataset]);

  useEffect(() => {
    let active = true;

    const loadDataset = async () => {
      try {
        const response = await fetch("/api/pricing", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to load pricing data.");
        }

        const nextDataset = (await response.json()) as PricingDataset;

        if (!active) {
          return;
        }

        setDataset(nextDataset);
        setSelectedSectionId(nextDataset.sections[0]?.id ?? "");
        setLoadState("ready");
        setMessage("Editing live pricing data.");
      } catch {
        if (!active) {
          return;
        }

        setLoadState("error");
        setMessage("Using fallback pricing data because the Google Sheet could not be loaded.");
      }
    };

    void loadDataset();

    return () => {
      active = false;
    };
  }, []);

  const updateHighlight = (index: number, value: string) => {
    setDataset((current) => {
      const highlights = [...current.highlights];
      highlights[index] = value;
      return { ...current, highlights };
    });
  };

  const updateSectionField = (
    index: number,
    field: "id" | "title" | "eyebrow" | "description" | "backgroundColor" | "textColor",
    value: string
  ) => {
    setDataset((current) => {
      const sections = [...current.sections];
      const previousId = sections[index]?.id;
      sections[index] = { ...sections[index], [field]: value };

      if (field === "id" && selectedSectionId === previousId) {
        setSelectedSectionId(value);
      }

      return { ...current, sections };
    });
  };

  const updateItemField = (
    sectionIndex: number,
    itemIndex: number,
    field: "name" | "price" | "note",
    value: string
  ) => {
    setDataset((current) => {
      const sections = [...current.sections];
      const items = [...sections[sectionIndex].items];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      sections[sectionIndex] = { ...sections[sectionIndex], items };
      return { ...current, sections };
    });
  };

  const addSection = () => {
    const newSection = createEmptySection();
    const newSectionId = `${newSection.id}-${dataset.sections.length + 1}`;

    setDataset((current) => ({
      ...current,
      sections: [...current.sections, { ...newSection, id: newSectionId }],
    }));
    setSelectedSectionId(newSectionId);
  };

  const removeSection = (index: number) => {
    setDataset((current) => {
      const sections = current.sections.filter((_, sectionIndex) => sectionIndex !== index);
      const nextSelected = sections[Math.max(0, index - 1)]?.id ?? "";
      setSelectedSectionId(nextSelected);
      return { ...current, sections };
    });
  };

  const addItem = (sectionIndex: number) => {
    setDataset((current) => {
      const sections = [...current.sections];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: [...sections[sectionIndex].items, createEmptyItem()],
      };
      return { ...current, sections };
    });
  };

  const removeItem = (sectionIndex: number, itemIndex: number) => {
    setDataset((current) => {
      const sections = [...current.sections];
      sections[sectionIndex] = {
        ...sections[sectionIndex],
        items: sections[sectionIndex].items.filter((_, index) => index !== itemIndex),
      };
      return { ...current, sections };
    });
  };

  const resetDataset = () => {
    const next = clonePricingDataset();
    setDataset(next);
    setSelectedSectionId(next.sections[0]?.id ?? "");
    setCopyState("Copy JSON");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportJson);
    setCopyState("Copied");
    window.setTimeout(() => setCopyState("Copy JSON"), 1600);
  };

  const handleDownload = () => {
    const blob = new Blob([exportJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pricing.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setSaveState("Saving...");
    setMessage("Writing updates to Google Sheets...");

    try {
      const response = await fetch("/api/pricing", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: exportJson,
      });

      if (!response.ok) {
        throw new Error("Failed to save pricing data.");
      }

      setSaveState("Saved");
      setMessage("Saved successfully. The /pricing page will now show the updated values.");
      window.setTimeout(() => setSaveState("Save changes"), 1800);
    } catch {
      setSaveState("Save changes");
      setMessage("Save failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFE5FF_0%,#FAFDFF_42%,#FFFFFF_100%)] text-[#303940]">
      <section className="border-b border-[#9c9c9c]/30 bg-[#303940] text-[#FAFDFF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:gap-10 lg:py-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FFE5FF] sm:text-sm sm:tracking-[0.35em]">
                Pricing Manager
              </p>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  Edit the same pricing page your clients see.
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-[#FAFDFF]/78 sm:text-base lg:text-lg">
                  Update highlights, sections, service names, notes, and prices in a
                  layout that mirrors the public pricing page.
                </p>
                <p className="text-sm text-[#FFE5FF]">{message}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:flex sm:flex-wrap sm:justify-end">
              <a
                href="/pricing"
                className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-semibold text-[#FAFDFF] transition hover:bg-white/10"
              >
                View pricing page
              </a>
              <button
                type="button"
                onClick={resetDataset}
                className="rounded-full bg-[#FAFDFF] px-5 py-3 text-sm font-semibold text-[#303940] transition hover:bg-[#FFE5FF]"
              >
                Reset changes
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loadState === "loading"}
                className="rounded-full bg-[#FFE5FF] px-5 py-3 text-sm font-semibold text-[#303940] transition hover:bg-[#FFFFFF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveState}
              </button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {dataset.highlights.map((highlight, index) => (
              <label
                key={`highlight-${index}`}
                className="rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4 text-sm text-[#FAFDFF] backdrop-blur sm:rounded-3xl sm:px-5"
              >
                <span className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-[#FFE5FF]">
                  Highlight {index + 1}
                </span>
                <textarea
                  value={highlight}
                  onChange={(event) => updateHighlight(index, event.target.value)}
                  rows={2}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-[#303940]/60 px-3 py-2 text-sm text-[#FAFDFF] outline-none transition placeholder:text-[#FAFDFF]/45 focus:border-[#FFE5FF]"
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-[#9c9c9c]/25 bg-[#FFFFFF]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
            {dataset.sections.map((section) => (
              <a
                key={section.id}
                href={`#edit-${section.id}`}
                onClick={() => setSelectedSectionId(section.id)}
                className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm ${
                  selectedSection?.id === section.id
                    ? "border-[#303940] bg-[#FFE5FF] text-[#303940]"
                    : "border-[#9c9c9c]/30 bg-[#FAFDFF] text-[#303940] hover:border-[#303940] hover:bg-[#303940] hover:text-[#FAFDFF]"
                }`}
              >
                {section.title || "Untitled section"}
              </a>
            ))}
            <button
              type="button"
              onClick={addSection}
              className="whitespace-nowrap rounded-full bg-[#303940] px-4 py-2 text-xs font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940] sm:text-sm"
            >
              Add section
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#9c9c9c] sm:text-sm sm:tracking-[0.3em]">
              Editable Service Menu
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Make price updates where they appear on the public page.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-full border border-[#9c9c9c]/30 px-5 py-3 text-sm font-semibold text-[#303940] transition hover:bg-[#FFE5FF]"
            >
              {copyState}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="rounded-full border border-[#9c9c9c]/30 px-5 py-3 text-sm font-semibold text-[#303940] transition hover:bg-[#FFE5FF]"
            >
              Download JSON
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {dataset.sections.map((section, sectionIndex) => (
            <section
              key={section.id}
              id={`edit-${section.id}`}
              className="scroll-mt-24 rounded-[1.5rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-5 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:scroll-mt-28 sm:rounded-[2rem] sm:p-8"
            >
              <div className="mb-5 space-y-4 border-b border-[#9c9c9c]/15 pb-5 sm:mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-[#9c9c9c] sm:text-xs sm:tracking-[0.3em]">
                    Section
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addItem(sectionIndex)}
                      className="rounded-full bg-[#303940] px-4 py-2 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
                    >
                      Add item
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className="rounded-full border border-[#9c9c9c]/30 px-4 py-2 text-sm font-semibold text-[#303940] transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      Delete section
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Section title</span>
                    <input
                      value={section.title}
                      onChange={(event) =>
                        updateSectionField(sectionIndex, "title", event.target.value)
                      }
                      className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 text-base font-semibold outline-none transition focus:border-[#303940]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Section label</span>
                    <input
                      value={section.eyebrow}
                      onChange={(event) =>
                        updateSectionField(sectionIndex, "eyebrow", event.target.value)
                      }
                      className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                    />
                  </label>
                  <label className="space-y-2 md:col-span-2">
                    <span className="text-sm font-semibold">Description</span>
                    <textarea
                      value={section.description}
                      onChange={(event) =>
                        updateSectionField(sectionIndex, "description", event.target.value)
                      }
                      rows={2}
                      className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#303940]"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold">Section id</span>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={section.id}
                        onChange={(event) =>
                          updateSectionField(sectionIndex, "id", event.target.value)
                        }
                        className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateSectionField(sectionIndex, "id", slugifySectionId(section.title))
                        }
                        className="rounded-2xl border border-[#9c9c9c]/25 px-4 py-3 text-sm font-semibold transition hover:bg-[#FFE5FF]"
                      >
                        Auto
                      </button>
                    </div>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-semibold">Background</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-3 py-2 transition focus-within:border-[#303940]">
                        <input
                          type="color"
                          value={section.backgroundColor ?? "#000000"}
                          onChange={(event) =>
                            updateSectionField(sectionIndex, "backgroundColor", event.target.value)
                          }
                          aria-label={`${section.title} background color`}
                          className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        />
                        <span className="text-sm font-medium text-[#303940]">
                          {section.backgroundColor ?? "#000000"}
                        </span>
                      </div>
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold">Text</span>
                      <div className="flex items-center gap-3 rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-3 py-2 transition focus-within:border-[#303940]">
                        <input
                          type="color"
                          value={section.textColor ?? "#FFFFFF"}
                          onChange={(event) =>
                            updateSectionField(sectionIndex, "textColor", event.target.value)
                          }
                          aria-label={`${section.title} text color`}
                          className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent p-0"
                        />
                        <span className="text-sm font-medium text-[#303940]">
                          {section.textColor ?? "#FFFFFF"}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <article
                    key={`${section.id}-${itemIndex}`}
                    className="rounded-2xl border border-[#9c9c9c]/15 bg-[#FAFDFF] px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="grid flex-1 gap-3">
                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c9c9c]">
                            Service name
                          </span>
                          <input
                            value={item.name}
                            onChange={(event) =>
                              updateItemField(sectionIndex, itemIndex, "name", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FFFFFF] px-4 py-3 text-base font-semibold text-[#303940] outline-none transition focus:border-[#303940]"
                          />
                        </label>
                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c9c9c]">
                            Note
                          </span>
                          <input
                            value={item.note ?? ""}
                            onChange={(event) =>
                              updateItemField(sectionIndex, itemIndex, "note", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FFFFFF] px-4 py-3 text-sm text-[#303940] outline-none transition focus:border-[#303940]"
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 sm:w-40">
                        <label className="space-y-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9c9c9c]">
                            Price
                          </span>
                          <input
                            value={item.price}
                            onChange={(event) =>
                              updateItemField(sectionIndex, itemIndex, "price", event.target.value)
                            }
                            className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FFFFFF] px-4 py-3 text-base font-semibold text-[#303940] outline-none transition focus:border-[#303940] sm:text-right"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeItem(sectionIndex, itemIndex)}
                          className="rounded-full border border-[#9c9c9c]/30 px-3 py-2 text-xs font-semibold transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {section.items.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#9c9c9c]/30 bg-[#FAFDFF] px-4 py-6 text-sm text-[#9c9c9c]">
                    No services in this section yet. Use “Add item” above to create one.
                  </div>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        {dataset.sections.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[#9c9c9c]/30 bg-[#FFFFFF] p-8 text-center">
            <p className="text-sm text-[#9c9c9c]">No pricing sections yet.</p>
            <button
              type="button"
              onClick={addSection}
              className="mt-4 rounded-full bg-[#303940] px-5 py-3 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
            >
              Add first section
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
