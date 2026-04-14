import Image from "next/image";
import { Marquee } from "@/components/marquee";


const arrivals = [
  { name: "Piano Bob Wig", price: "₦40,000.00", image: "/home-arrival-1.jpg" },
  { name: "Deep Wave", price: "₦100,000.00", image: "/home-arrival-2.jpg" },
  {
    name: "SDD Vietnamese Bonestraight",
    price: "₦135,000.00",
    image: "/home-arrival-3.jpg",
  },
];

const services = [
  {
    title: "Barbing",
    summary:
      "For the discerning gentleman, our barbing services are tailored to provide a grooming experience that goes beyond the ordinary.",
  },
  {
    title: "Braiding",
    summary:
      "Transform your look with our expert braiding services. Our skilled stylists create intricate and stylish braided hairstyles that suit your personality.",
  },
  {
    title: "Classic Mani-Pedi",
    summary:
      "Treat your hands and feet to the care they deserve with our classic manicure and pedicure services.",
  },
  {
    title: "Hair Washing & Installation",
    summary:
      "Deep cleanse wash and blow-dry, extension installation, wig fitting, and styling in one polished appointment flow.",
  },
  {
    title: "Massage",
    summary:
      "Swedish massage, deep tissue massage, and hot stone therapy designed to help you reset and recharge.",
  },
  {
    title: "Nail Care",
    summary:
      "Basic manicure, gel nail application, and nail art design delivered with precision and care.",
  },
];

const stories = [
  {
    name: "Michael",
    quote:
      "I visited Hairven for a haircut. The ambiance was soothing, the staff was welcoming, and they delivered exactly the look I wanted.",
  },
  {
    name: "Cynthia",
    quote:
      "My first experience at Hairven was remarkable. I opted for a hair treatment, and it left my hair feeling soft, healthy, and shiny.",
  },
];

const footerGroups = [
  {
    title: "Shop",
    links: ["Shop", "Collections", "Lookbook"],
  },
  {
    title: "Help",
    links: ["Returns & Exchanges", "Privacy Policy", "Terms & Conditions"],
  },
  {
    title: "About",
    links: ["Journal", "Our Story", "Contact"],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#FFE5FF_0%,#FAFDFF_38%,#FFFFFF_100%)] text-[#303940]">
      <section className="relative isolate overflow-hidden border-b border-[#9c9c9c]/25 bg-[#303940] text-[#FAFDFF]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/DSC08825-scaled.webp"
            alt="Hairven Salon Interior"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#303940]/65" />
        </div>
        <Marquee />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#FFE5FF33,transparent_28%),radial-gradient(circle_at_80%_20%,#FFFFFF22,transparent_24%)]" />
        <div className="relative mx-auto w-full px-4 sm:px-8 lg:px-12 bg-[#303940]">
          <nav className="flex items-center justify-between py-2 sm:py-2">
            <a href="/" className="inline-flex items-center">
              <Image
                src="/hairven.png"
                alt="Hairven logo"
                width={140}
                height={48}
                priority
                className="h-8 w-auto object-contain sm:h-10"
              />
            </a>
            <div className="flex items-center gap-6 text-sm font-medium text-[#FAFDFF]/90">
              <a href="/pricing" className="transition hover:text-[#FFE5FF]">
                Pricing
              </a>
              <a
                href="https://hairvenunisexsalon.com/contact/"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-[#FFE5FF]"
              >
                Contact
              </a>
            </div>
          </nav>
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10 lg:px-12 lg:pb-24 lg:pt-14">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#FFE5FF] sm:text-sm sm:tracking-[0.38em]">
                Welcome to Hairven Unisex Salon
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-none tracking-tight sm:text-5xl lg:text-6xl">
                Where Style Meets Personal Touch
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-[#FAFDFF]/80 sm:text-base sm:leading-8 lg:text-lg">
                From chic haircuts and vibrant coloring to rejuvenating beauty treatments,
                we offer a wide range of services to make you look and feel fantastic.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="https://wa.link/57ecax"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#FFE5FF] px-6 py-3 text-sm font-semibold text-[#303940] transition hover:bg-[#FFFFFF] sm:w-auto"
              >
                Make Enquiries
              </a>
              <a
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-[#FAFDFF] transition hover:bg-white/10 sm:w-auto"
              >
                View Pricing
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/8 p-5 backdrop-blur sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FFE5FF]">Atmosphere</p>
              <p className="mt-4 text-xl font-semibold sm:text-2xl">Premium grooming, beauty, and care</p>
              <p className="mt-3 text-sm leading-6 text-[#FAFDFF]/75 sm:leading-7">
                A calm salon environment with modern styling, beauty treatment, and
                personalized service at the center.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-[#FAFDFF] p-5 text-[#303940] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.45)] sm:rounded-[2rem] sm:p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">Service Gallery</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { name: "Barbing", img: "/slide22-1.webp" },
                  { name: "Braiding", img: "/salon-1.webp" },
                ].map((service) => (
                  <div key={service.name} className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition hover:shadow-md">
                    <Image
                      src={service.img}
                      alt={service.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3">
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white">
                        {service.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c] sm:text-sm sm:tracking-[0.35em]">Discover Our</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Newest Arrivals
            </h2>
          </div>
          <a
            href="https://hairvenunisexsalon.com/shop/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-full items-center justify-center rounded-full border border-[#9c9c9c]/30 bg-[#FFFFFF] px-5 py-3 text-sm font-semibold transition hover:bg-[#FFE5FF] sm:w-fit"
          >
            Shop All Products
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
          {arrivals.map((item) => (
            <article
              key={item.name}
              className="group overflow-hidden rounded-[1.75rem] border border-[#9c9c9c]/20 bg-[#FFFFFF] shadow-[0_24px_80px_-48px_rgba(48,57,64,0.22)] sm:rounded-[2rem]"
            >
              <div className="relative h-64 overflow-hidden bg-[#FAFDFF] sm:h-72">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-5 sm:p-6">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{item.name}</h3>
                  <p className="mt-2 text-sm text-[#9c9c9c]">{item.price}</p>
                </div>
                <a
                  href="https://wa.link/57ecax"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#303940] px-5 py-3 text-sm font-semibold text-[#FAFDFF] transition group-hover:bg-[#9c9c9c] group-hover:text-[#303940] sm:w-auto"
                >
                  Chat to buy
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[#9c9c9c]/20 bg-[#FAFDFF]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c] sm:text-sm sm:tracking-[0.35em]">Services We Offer</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Beauty services designed to make you look and feel fantastic.
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#303940]/70 sm:text-base sm:leading-8">
              From chic haircuts and vibrant coloring to rejuvenating beauty treatments,
              Hairven offers a broad service menu for clients who want polish, comfort,
              and consistency.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-[1.75rem] border border-[#9c9c9c]/15 bg-[#FFFFFF] p-5 shadow-[0_24px_80px_-48px_rgba(48,57,64,0.18)] sm:rounded-[2rem] sm:p-6"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c]">Service</p>
                <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">{service.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#303940]/72">{service.summary}</p>
                <a
                  href="/pricing"
                  className="mt-6 inline-flex items-center rounded-full border border-[#9c9c9c]/25 px-4 py-2 text-sm font-semibold transition hover:bg-[#FFE5FF]"
                >
                  Learn More
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9c9c9c] sm:text-sm sm:tracking-[0.35em]">Customer Stories</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Personal service that clients remember.
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#303940]/70 sm:text-base sm:leading-8">
            We believe every client is unique. That is why we offer personalized
            consultations and treatments tailored to your preferences and expectations.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {stories.map((story) => (
            <article
              key={story.name}
              className="rounded-[1.75rem] border border-[#9c9c9c]/20 bg-[#303940] p-6 text-[#FAFDFF] shadow-[0_24px_80px_-48px_rgba(48,57,64,0.38)] sm:rounded-[2rem] sm:p-8"
            >
              <p className="text-sm leading-8 text-[#FAFDFF]/82">“{story.quote}”</p>
              <p className="mt-6 text-lg font-semibold tracking-tight text-[#FFE5FF]">
                {story.name}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#9c9c9c]/20 bg-[#303940] text-[#FAFDFF]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8 sm:py-16 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#FFE5FF] sm:text-sm sm:tracking-[0.35em]">#HAIRVEN</p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Hairven prides itself on offering a diverse range of services tailored to
                meet the unique desires of each client.
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#FFE5FF]">
                    {group.title}
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-[#FAFDFF]/80">
                    {group.links.map((link) => (
                      <p key={link}>{link}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 border-t border-white/10 pt-6 text-sm text-[#FAFDFF]/60">
            © Hairven Salon 2024. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
