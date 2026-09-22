import type { ReactNode } from "react";

interface BlockProps {
  children?: ReactNode;
}

export default function WebBlock({ children }: BlockProps) {
  return (
    <div className="flex mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </div>
  );
}
