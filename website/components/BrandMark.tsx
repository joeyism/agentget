const ASCII_ART = ` █████╗  ██████╗ ███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔════╝ ██╔════╝████╗  ██║╚══██╔══╝██╔════╝
███████║██║  ███╗█████╗  ██╔██╗ ██║   ██║   ███████╗
██╔══██║██║   ██║██╔══╝  ██║╚██╗██║   ██║   ╚════██║
██║  ██║╚██████╔╝███████╗██║ ╚████║   ██║   ███████║
╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝`;

export function BrandMark() {
  return (
    <pre
      aria-hidden="true"
      className="text-[11px] sm:text-[12px] lg:text-[13px] leading-[120%] text-white select-none whitespace-pre font-mono font-bold drop-shadow-[0_0_1px_rgba(255,255,255,0.35)]"
    >
      {ASCII_ART}
    </pre>
  );
}
