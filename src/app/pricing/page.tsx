import { readPricingDatasetSafely } from "@/lib/pricing-server";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { highlights, sections } = await readPricingDatasetSafely();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFE5FF_0%,#FAFDFF_42%,#FFFFFF_100%)] text-[#303940]">
      <section className="border-b border-[#9c9c9c]/30 bg-[#303940] text-[#FAFDFF]">
        <div className="mx-auto flex items-center max-w-7xl flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:gap-10 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-lg font-semibold text-center tracking-tight">
              Know what you need?.
            </h1>
            <p className="text-5xl mt-2 uppercase text-center tracking-[0.3em] text-[#FFE5FF] sm:tracking-[0.35em]">Pricing Plans</p>
            <p className="max-w-2xl text-sm leading-7 text-center text-[#FAFDFF]/78 sm:text-base lg:text-lg">
              Simplicity is at the heart of our business - every plan is set up to fit your need and budget
giving you the maximum satisfaction you deserve.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-0 z-20 border-b border-[#9c9c9c]/25 bg-[#FFFFFF]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-8 sm:py-4 lg:px-12">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="whitespace-nowrap rounded-full border border-[#9c9c9c]/30 bg-[#FAFDFF] px-3 py-2 text-xs font-medium text-[#303940] transition hover:border-[#303940] hover:bg-[#303940] hover:text-[#FAFDFF] sm:px-4 sm:text-sm"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.26em] text-[#9c9c9c] sm:text-sm sm:tracking-[0.3em]">Service Menu</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Full pricing across salon, braid, wig, and nail services.
            </h2>
          </div>
          <a
            href="https://wa.link/57ecax"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full bg-[#303940] px-6 py-3 text-sm font-semibold text-[#FAFDFF] transition hover:bg-[#9c9c9c] hover:text-[#303940] sm:w-fit"
          >
            Make a booking
          </a>
        </div>

        {(() => {
          // Group sections into 3 columns to maintain vertical flow control
          const columns: any[][] = [[], [], []];
          let footerItem: any = null;
          let firstSectionColors = { bg: "#000000", text: "#FFFFFF" };

          sections.forEach((section, idx) => {
            if (idx === 0) {
              firstSectionColors = {
                bg: section.backgroundColor ?? "#000000",
                text: section.textColor ?? "#FFFFFF",
              };
              if (section.items.length > 0) {
                const items = [...section.items];
                footerItem = items.pop();
                columns[idx % 3].push({ ...section, items });
              } else {
                columns[idx % 3].push(section);
              }
            } else {
              columns[idx % 3].push(section);
            }
          });

          return (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {columns.map((columnSections, colIdx) => (
                <div key={colIdx} className="flex flex-col gap-4 sm:gap-6">
                  {columnSections.map((section) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-24 border-2 border-[#000000] bg-[#FFFFFF] p-0 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:scroll-mt-28"
                    >
                      <div
                        className="mb-5 p-8 space-y-3 sm:mb-6 border-b border-[#000000] border-b-2"
                        style={{ backgroundColor: section.backgroundColor ?? "#000000" }}
                      >
                        <div className="space-y-2">
                          <h3
                            className="text-center text-xl font-semibold tracking-tight sm:text-2xl"
                            style={{ color: section.textColor ?? "#FFFFFF" }}
                          >
                            {section.title}
                          </h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {section.items.map((item: any) => (
                          <article
                            key={`${section.id}-${item.name}-${item.price}-${item.note ?? ""}`}
                            className="px-4 py-1"
                          >
                            <div className="flex items-baseline gap-2 sm:gap-4">
                              <div className="flex flex-1 items-baseline gap-2 min-w-0">
                                <h4 className="truncate font-helvetica text-base font-medium text-[#000000]">
                                  {item.name}
                                </h4>
                                <div className="hidden flex-1 min-w-[12px] border-b border-dashed border-[#000000]/20 mb-[4px] sm:block" />
                              </div>
                              <p className="shrink-0 text-base font-medium text-[#000000] whitespace-nowrap">
                                {item.price}
                              </p>
                            </div>
                            {item.note ? (
                              <p className="mt-1 text-sm leading-6 text-[#9c9c9c]">{item.note}</p>
                            ) : null}
                          </article>
                        ))}
                      </div>

                      {/* Special footer item inside the first section card */}
                      {section.id === "male" && footerItem && (
                        <div
                          className="mt-6 border-t border-[#000000]/10 p-6 pt-5"
                          style={{ backgroundColor: section.backgroundColor ?? "#000000" }}
                        >
                          <div className="space-y-1">
                        <div className="flex items-baseline gap-2 sm:gap-4">
                          <div className="flex flex-1 items-baseline gap-2 min-w-0">
                            <h4
                              className="truncate font-helvetica text-base font-medium"
                              style={{ color: section.textColor ?? "#FFFFFF" }}
                            >
                              {footerItem.name}
                            </h4>
                            <div
                              className="hidden flex-1 min-w-[12px] border-b border-dashed mb-[4px] opacity-40 sm:block"
                              style={{ borderColor: section.textColor ?? "#FFFFFF" }}
                            />
                          </div>
                          <p
                            className="shrink-0 text-base font-medium whitespace-nowrap"
                            style={{ color: section.textColor ?? "#FFFFFF" }}
                          >
                            {footerItem.price}
                          </p>
                        </div>
                            {footerItem.note ? (
                              <p
                                className="text-sm leading-6 opacity-80"
                                style={{ color: section.textColor ?? "#FFFFFF" }}
                              >
                                {footerItem.note}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              ))}
            </div>
          );
        })()}
      </section>
    </main>
  );
}
