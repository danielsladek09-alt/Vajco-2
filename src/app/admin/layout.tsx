import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrace",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-cream-dark/40">{children}</div>;
}
