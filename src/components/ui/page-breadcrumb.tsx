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
              className="w-3 h-3 text-gray-300 flex-shrink-0"
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
              className="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
