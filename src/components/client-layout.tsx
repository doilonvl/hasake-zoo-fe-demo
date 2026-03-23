"use client";

import type { ReactNode } from "react";

type ClientLayoutProps = {
  children: ReactNode;
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  return <div className="page">{children}</div>;
}
