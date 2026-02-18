

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white px-6 py-8 text-center">
      <img
        src="/logo/LD-logo.png"
        alt="Landrup Dans logo"
        className="w-10 h-10 object-contain mb-2 mx-auto"
      />
      <p className="font-display font-bold text-sm mb-1">Landrup Dans</p>
      <p className="text-brand-muted text-xs">
        Pulsen 8 · 4000 Roskilde
        <br />
        Tlf. 3540 4550
      </p>
    </footer>
  );
}