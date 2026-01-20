import AdminClientLayout from "../AdminClientLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
