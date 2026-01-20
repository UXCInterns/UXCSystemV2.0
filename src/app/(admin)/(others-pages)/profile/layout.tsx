import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | UXCSystem",
  description: "User profile for details and overview",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}