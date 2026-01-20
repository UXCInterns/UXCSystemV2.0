import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manpower | UXCSystem",
  description: "Manpower management and overview",
};

export default function ManpowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}