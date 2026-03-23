"use client";

import type { ReactNode } from "react";

type BlogDetailMotionProps = {
  children: ReactNode;
};

export default function BlogDetailMotion({ children }: BlogDetailMotionProps) {
  return <div>{children}</div>;
}
