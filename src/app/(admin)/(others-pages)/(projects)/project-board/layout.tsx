import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kanban Board | UXCSystem",
  description: "Kanban board for project management",
};

export default function KanbanBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}