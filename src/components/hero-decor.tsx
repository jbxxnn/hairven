export function HeroDecor() {
  const SvgPath = () => (
    <svg width="120" height="181" viewBox="0 0 120 181" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M29.8771 12.3853C16.6282 29.5485 13.3467 63.8798 23.3317 100.229C33.3168 136.578 53.6571 164.426 73.8053 172.426L75.4493 178.389L91.9584 173.857C116.815 167.029 126.408 123 113.369 75.5187C100.329 28.0367 69.6078 -4.93599 44.7803 1.8962L28.2715 6.42792L29.8771 12.3853Z"
        fill="#FFE5FF"
        stroke="#000000"
        strokeWidth="1.45942"
        strokeMiterlimit="10"
      />
      <path
        d="M96.8624 80.0577C83.826 32.5713 53.1019 -0.390804 28.2383 6.4349C3.3748 13.2606 -6.21323 57.2894 6.82309 104.776C19.8594 152.263 50.5835 185.225 75.4468 178.399C100.31 171.573 109.899 127.544 96.8624 80.0577Z"
        fill="#FFE5FF"
        stroke="#000000"
        strokeWidth="1.45942"
        strokeMiterlimit="10"
      />
      <path
        d="M82.2919 84.0518C72.0138 46.6111 49.3404 20.1965 31.6496 25.0531C13.9589 29.9097 7.94985 64.1983 18.2283 101.639C28.5067 139.079 51.1804 165.494 68.8711 160.637C86.5622 155.78 92.5707 121.492 82.2919 84.0518Z"
        fill="#FFE5FF"
        stroke="#000000"
        strokeWidth="1.45942"
        strokeMiterlimit="10"
      />
    </svg>
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top Left - Overlapping with Marquee */}
      <div className="absolute -top-16 -left-12 rotate-[15deg] scale-[1.3] opacity-100">
        <SvgPath />
      </div>
      
      {/* Top Right - Bleeding out top */}
      <div className="absolute -top-24 -right-16 -rotate-[45deg] scale-150 opacity-100">
        <SvgPath />
      </div>

      {/* Center Bottom (Partially cut/bleeding into pricing) */}
      <div className="absolute -bottom-20 left-1/4 rotate-[110deg] scale-[1.2] opacity-100">
        <SvgPath />
      </div>

      {/* Far Right Bottom - Overlapping pricing section */}
      <div className="absolute -bottom-20 -right-24 rotate-[180deg] scale-125 opacity-100">
        <SvgPath />
      </div>
    </div>
  );
}
