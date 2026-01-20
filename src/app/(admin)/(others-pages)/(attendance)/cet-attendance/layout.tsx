import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CET Attendance | UXCSystem",
  description: "CET Training attendance and workshops",
};

export default function CETTrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}