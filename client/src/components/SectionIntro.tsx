import { Link } from 'react-router-dom';

interface Props {
  eyebrow: string;
  title: string;
  description?: string;
  linkTo?: string;
  linkLabel?: string;
  align?: 'left' | 'center';
}

export function SectionIntro({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel = 'View all',
  align = 'left',
}: Props) {
  const centered = align === 'center';

  return (
    <div
      className={`rise flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${
        centered ? 'sm:flex-col sm:items-center' : ''
      }`}
    >
      <div className={centered ? 'text-center' : ''}>
        <p
          className={`flex items-center gap-3 ${centered ? 'justify-center' : ''}`}
        >
          <span aria-hidden="true" className="h-px w-7 bg-gold-500/70" />
          <span className="eyebrow">{eyebrow}</span>
        </p>
        <h2 className="mt-4 font-display text-[2rem] leading-[1.08] text-cream sm:text-[2.8rem]">{title}</h2>
        {description ? (
          <p className={`mt-3.5 max-w-xl text-[14px] leading-relaxed text-muted ${centered ? 'mx-auto' : ''}`}>
            {description}
          </p>
        ) : null}
      </div>

      {linkTo ? (
        <Link
          to={linkTo}
          className="group inline-flex shrink-0 items-center gap-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wide2 text-plum/60 transition-colors hover:text-gold-700"
        >
          {linkLabel}
          <span className="h-px w-6 bg-gold-500/50 transition-all duration-500 ease-silk group-hover:w-10 group-hover:bg-gold-500" />
        </Link>
      ) : null}
    </div>
  );
}
