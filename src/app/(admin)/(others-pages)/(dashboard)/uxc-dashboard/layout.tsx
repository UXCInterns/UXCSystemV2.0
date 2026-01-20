import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UXC Learning Journey Dashboard | UXCSystem",
  description: "UXC Learning Journey Dashboard overview and statistics",
};

export default function UXCDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}