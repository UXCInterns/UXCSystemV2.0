// /app/participant/layout.tsx
export default function ParticipantLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>; // no AuthContext here
}
