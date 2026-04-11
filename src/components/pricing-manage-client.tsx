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

  const selectedIndex = dataset.sections.findIndex((section) => section.id === selectedSectionId);
  const selectedSection = dataset.sections[selectedIndex] ?? dataset.sections[0];

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
    field: "id" | "title" | "eyebrow" | "description",
    value: string
  ) => {
    setDataset((current) => {
      const sections = [...current.sections];
      sections[index] = { ...sections[index], [field]: value };
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
    setDataset((current) => ({
      ...current,
      sections: [
        ...current.sections,
        { ...newSection, id: `${newSection.id}-${current.sections.length + 1}` },
      ],
    }));
    setSelectedSectionId(`${newSection.id}-${dataset.sections.length + 1}`);
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
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FFE5FF] sm:text-sm sm:tracking-[0.35em]">Pricing Manager</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Edit pricing from one structured JSON source.
              </h1>
              <p className="mt-4 text-sm leading-7 text-[#FAFDFF]/78 sm:text-base">
                Changes saved here are written back to Google Sheets, and the public
                pricing page reads from that same source.
              </p>
              <p className="mt-3 text-sm text-[#FFE5FF]">{message}</p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
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
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-8 sm:py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-12">
        <aside className="rounded-[1.5rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-4 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:rounded-[2rem] sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">Sections</p>
              <h2 className="mt-2 text-xl font-semibold">Price list groups</h2>
            </div>
            <button
              type="button"
              onClick={addSection}
              className="rounded-full bg-[#303940] px-4 py-2 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
            >
              Add
            </button>
          </div>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-2 lg:overflow-visible lg:pb-0">
            {dataset.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setSelectedSectionId(section.id)}
                className={`min-w-[220px] rounded-2xl border px-4 py-3 text-left transition lg:w-full lg:min-w-0 ${
                  selectedSection?.id === section.id
                    ? "border-[#303940] bg-[#FFE5FF] text-[#303940]"
                    : "border-[#9c9c9c]/20 bg-[#FAFDFF] text-[#303940] hover:border-[#9c9c9c]/40"
                }`}
              >
                <p className="text-sm font-semibold">{section.title}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.25em] text-[#9c9c9c]">
                  {section.eyebrow}
                </p>
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-[1.5rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-5 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:rounded-[2rem] sm:p-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">Highlights</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {dataset.highlights.map((highlight, index) => (
                <label key={`highlight-${index}`} className="space-y-2">
                  <span className="text-sm font-semibold">Highlight {index + 1}</span>
                  <input
                    value={highlight}
                    onChange={(event) => updateHighlight(index, event.target.value)}
                    className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                  />
                </label>
              ))}
            </div>
          </section>

          {selectedSection ? (
            <section className="rounded-[1.5rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-5 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:rounded-[2rem] sm:p-6">
              <div className="flex flex-col gap-4 border-b border-[#9c9c9c]/15 pb-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">
                    Selected section
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{selectedSection.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(selectedIndex)}
                  className="rounded-full border border-[#9c9c9c]/30 px-4 py-2 text-sm font-semibold text-[#303940] transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  Delete section
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Section title</span>
                  <input
                    value={selectedSection.title}
                    onChange={(event) =>
                      updateSectionField(selectedIndex, "title", event.target.value)
                    }
                    className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Section label</span>
                  <input
                    value={selectedSection.eyebrow}
                    onChange={(event) =>
                      updateSectionField(selectedIndex, "eyebrow", event.target.value)
                    }
                    className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold">Section id</span>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={selectedSection.id}
                        onChange={(event) =>
                        updateSectionField(selectedIndex, "id", event.target.value)
                      }
                      className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateSectionField(
                          selectedIndex,
                          "id",
                          slugifySectionId(selectedSection.title)
                        )
                      }
                      className="rounded-2xl border border-[#9c9c9c]/25 px-4 py-3 text-sm font-semibold transition hover:bg-[#FFE5FF]"
                    >
                      Auto
                    </button>
                  </div>
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-sm font-semibold">Description</span>
                  <textarea
                    value={selectedSection.description}
                    onChange={(event) =>
                      updateSectionField(selectedIndex, "description", event.target.value)
                    }
                    rows={3}
                    className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FAFDFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                  />
                </label>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">Items</p>
                  <h3 className="mt-2 text-xl font-semibold">Services in this section</h3>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(selectedIndex)}
                  className="rounded-full bg-[#303940] px-4 py-2 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
                >
                  Add item
                </button>
              </div>

              <div className="mt-5 space-y-4">
                {selectedSection.items.map((item, itemIndex) => (
                  <article
                    key={`${selectedSection.id}-${itemIndex}`}
                    className="rounded-[1.25rem] border border-[#9c9c9c]/15 bg-[#FAFDFF] p-4 sm:rounded-[1.5rem] sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#303940]">Item {itemIndex + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(selectedIndex, itemIndex)}
                        className="rounded-full border border-[#9c9c9c]/30 px-3 py-1.5 text-xs font-semibold transition hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold">Service name</span>
                        <input
                          value={item.name}
                          onChange={(event) =>
                            updateItemField(selectedIndex, itemIndex, "name", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FFFFFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold">Price</span>
                        <input
                          value={item.price}
                          onChange={(event) =>
                            updateItemField(selectedIndex, itemIndex, "price", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FFFFFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                        />
                      </label>
                      <label className="space-y-2 md:col-span-2">
                        <span className="text-sm font-semibold">Note</span>
                        <input
                          value={item.note ?? ""}
                          onChange={(event) =>
                            updateItemField(selectedIndex, itemIndex, "note", event.target.value)
                          }
                          className="w-full rounded-2xl border border-[#9c9c9c]/25 bg-[#FFFFFF] px-4 py-3 outline-none transition focus:border-[#303940]"
                        />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="rounded-[1.5rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-5 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:rounded-[2rem] sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[#9c9c9c]/15 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">Export</p>
                <h2 className="mt-2 text-2xl font-semibold">Save your changes</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9c9c9c]">
                  Use these actions to copy or download the updated dataset after editing.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-full bg-[#303940] px-5 py-3 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940]"
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
          </section>
        </div>
      </section>
    </main>
  );
}
