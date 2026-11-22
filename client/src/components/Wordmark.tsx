import { Link } from 'react-router-dom';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  withTagline?: boolean;
  onDark?: boolean;
  asLink?: boolean;
  className?: string;
}

const MARK: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-20 w-20',
};

const NAME: Record<NonNullable<Props['size']>, string> = {
  sm: 'text-[1.05rem] tracking-[0.20em]',
  md: 'text-[1.5rem] tracking-[0.18em]',
  lg: 'text-4xl tracking-[0.14em] sm:text-6xl',
};

/**
 * UV Clinics lockup, rebuilt as vector from the clinic's own mark: an
 * interlocking U/V monogram in a double gold ring — the emblem painted on the
 * clinic's feature wall — set above the CLINICS wordmark and its line,
 * "Where science meets style". Drawn in code so it stays crisp at every size;
 * the gold is a gradient so it reads as foil, not flat yellow.
 */
export function Wordmark({
  size = 'md',
  withTagline = true,
  asLink = true,
  className = '',
}: Props) {
  const content = (
    <span className={`flex items-center gap-3 leading-none ${className}`}>
      <svg
        viewBox="0 0 72 72"
        className={`${MARK[size]} shrink-0`}
        role="img"
        aria-label="UV Clinics monogram"
      >
        <defs>
          <linearGradient id="uv-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B6C32" />
            <stop offset="45%" stopColor="#C6A15B" />
            <stop offset="100%" stopColor="#A8823A" />
          </linearGradient>
        </defs>
        <circle cx="36" cy="36" r="33" fill="none" stroke="url(#uv-gold)" strokeWidth="1.4" />
        <circle cx="36" cy="36" r="29" fill="none" stroke="url(#uv-gold)" strokeWidth="0.6" />
        <text
          x="36"
          y="45.5"
          textAnchor="middle"
          fontFamily="Marcellus, Georgia, serif"
          fontSize="27"
          letterSpacing="0.5"
          fill="url(#uv-gold)"
        >
          UV
        </text>
        <path d="M20 53.5h32" stroke="url(#uv-gold)" strokeWidth="0.7" />
        <circle cx="36" cy="9" r="1.2" fill="#C6A15B" />
        <circle cx="36" cy="63" r="1.2" fill="#C6A15B" />
      </svg>

      <span className="flex flex-col">
        <span className={`gold-text gold-text-animated font-display ${NAME[size]}`}>
          UV CLINICS
        </span>
        {withTagline ? (
          <span className="mt-1.5 text-[7.5px] uppercase tracking-micro text-muted sm:text-[8px]">
            Where science meets style
          </span>
        ) : null}
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link to="/" aria-label="UV Clinics — home" className="shrink-0">
      {content}
    </Link>
  );
}
