import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Board | UXCSystem",
  description: "Project board for project management",
};

export default function ProjectBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}