import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | UXCSystem",
  description: "Home page for UXCSystem",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}