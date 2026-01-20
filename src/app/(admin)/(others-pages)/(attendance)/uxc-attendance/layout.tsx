import { Metadata } from "next";

export const metadata: Metadata = {
  title: "UXC Learning Journey Attendance | UXCSystem",
  description: "UXC Learning Journey attendance and workshops",
};

export default function UXCAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}