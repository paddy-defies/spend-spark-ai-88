interface MultiplLogoProps {
  className?: string;
  showText?: boolean;
}

export function MultiplLogo({ className = '', showText = true }: MultiplLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo mark - replace src with actual logo file when available */}
      <div className="w-8 h-8 rounded-lg bg-multipl-yellow flex items-center justify-center overflow-hidden">
        {/* Placeholder: Replace with <img src="/multipl-logo.svg" alt="Multipl" className="w-full h-full" /> */}
        <span className="text-multipl-dark font-bold text-sm">M</span>
      </div>
      {showText && (
        <span className="font-display font-semibold text-foreground tracking-tight">
          multipl
        </span>
      )}
    </div>
  );
}
