// src/app/accept-invite/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktivasi Akun",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AcceptInviteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
