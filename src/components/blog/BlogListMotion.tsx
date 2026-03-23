"use client";

import type { ReactNode } from "react";

type BlogListMotionProps = {
  children: ReactNode;
};

export default function BlogListMotion({ children }: BlogListMotionProps) {
  return <div>{children}</div>;
}
