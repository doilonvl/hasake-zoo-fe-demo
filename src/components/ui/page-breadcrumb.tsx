import { Link } from "@/i18n/navigation";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function PageBreadcrumb({ items, className = "" }: PageBreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={`flex flex-wrap items-center gap-1 text-sm mb-6 ${className}`}
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <svg
              className="w-3 h-3 text-white/25 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          {item.href ? (
            <Link
              href={item.href as never}
              className="text-white/45 hover:text-emerald-400 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white/75">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
