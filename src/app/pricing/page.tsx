import { readPricingDatasetSafely } from "@/lib/pricing-server";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const { highlights, sections } = await readPricingDatasetSafely();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FFE5FF_0%,#FAFDFF_42%,#FFFFFF_100%)] text-[#303940]">
      <section className="border-b border-[#9c9c9c]/30 bg-[#303940] text-[#FAFDFF]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:gap-10 lg:py-20">
          <div className="max-w-3xl space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FFE5FF] sm:text-sm sm:tracking-[0.35em]">Pricing Plans</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Know what you need before you book.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-[#FAFDFF]/78 sm:text-base lg:text-lg">
              This page mirrors the structure of the live Hairven pricing page, but
              presents everything in a cleaner format that is easier to scan on mobile
              and desktop.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3 md:gap-4">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-[1.5rem] border border-white/10 bg-white/8 px-4 py-4 text-sm text-[#FAFDFF] backdrop-blur sm:rounded-3xl sm:px-5"
              >
                {highlight}
              </div>
            ))}
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

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-[1.5rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] p-5 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:scroll-mt-28 sm:rounded-[2rem] sm:p-8"
            >
              <div className="mb-5 space-y-3 sm:mb-6">
                <p className="text-[11px] uppercase tracking-[0.26em] text-[#9c9c9c] sm:text-xs sm:tracking-[0.3em]">
                  {section.eyebrow}
                </p>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{section.title}</h3>
                  <p className="max-w-2xl text-sm leading-6 text-[#9c9c9c]">
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {section.items.map((item) => (
                  <article
                    key={`${section.id}-${item.name}-${item.price}-${item.note ?? ""}`}
                    className="rounded-2xl border border-[#9c9c9c]/15 bg-[#FAFDFF] px-4 py-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h4 className="text-base font-semibold text-[#303940]">{item.name}</h4>
                        {item.note ? (
                          <p className="mt-1 text-sm leading-6 text-[#9c9c9c]">{item.note}</p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-base font-semibold text-[#303940] sm:text-right">
                        {item.price}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
