export function Marquee() {
  const text = "Welcome to Hairven Unisex Salon";
  const items = Array(10).fill(text);

  return (
    <div className="relative flex overflow-x-hidden border-b border-[#000000]/10 bg-[#FFE5FF] py-2 text-[#303940]">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, idx) => (
          <span key={idx} className="mx-4 flex items-center text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
            {item}
            <span className="ml-8 block h-1.5 w-1.5 rounded-full bg-[#303940]/40" />
          </span>
        ))}
      </div>
      <div className="absolute top-0 flex animate-marquee whitespace-nowrap py-2" aria-hidden="true">
        {items.map((item, idx) => (
          <span key={idx} className="mx-4 flex items-center text-xs font-semibold uppercase tracking-[0.2em] sm:text-sm">
            {item}
            <span className="ml-8 block h-1.5 w-1.5 rounded-full bg-[#303940]/40" />
          </span>
        ))}
      </div>
    </div>
  );
}
