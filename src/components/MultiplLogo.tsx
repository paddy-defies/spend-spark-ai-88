interface MultiplLogoProps {
  className?: string;
  showText?: boolean;
}

export function MultiplLogo({ className = '', showText = true }: MultiplLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/multipl-logo.png" alt="Multipl" className="w-8 h-8" />
      {showText && (
        <span className="font-display font-semibold text-foreground tracking-tight">
          multipl
        </span>
      )}
    </div>
  );
}
