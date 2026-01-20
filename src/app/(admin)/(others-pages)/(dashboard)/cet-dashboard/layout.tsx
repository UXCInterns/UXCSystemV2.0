import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CET Dashboard | UXCSystem",
  description: "CET Dashboard overview and statistics",
};

export default function CETDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}