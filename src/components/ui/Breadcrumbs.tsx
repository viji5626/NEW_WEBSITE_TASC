import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  const getBreadcrumbName = (path: string) => {
    switch (path) {
      case "micro-services":
        return "Micro Services";
      case "consulting":
        return "Consulting";
      case "faq":
        return "FAQ";
      default:
        return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
    }
  };

  return (
    <nav
      className="relative z-20 max-w-[1000px] mx-auto px-6 md:px-10 lg:px-16 pt-32 pb-4 -mb-20 flex items-center text-[10px] font-[Orbitron] uppercase tracking-widest text-tasc-text/50"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            to="/"
            className="flex items-center hover:text-tasc-cyan transition-colors"
            aria-label="Home"
          >
            <Home size={12} className="mb-0.5" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight size={12} className="text-tasc-border" />
              {last ? (
                <span
                  className="text-tasc-cyan font-medium"
                  aria-current="page"
                >
                  {getBreadcrumbName(value)}
                </span>
              ) : (
                <Link
                  to={to}
                  className="hover:text-tasc-cyan transition-colors"
                >
                  {getBreadcrumbName(value)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
