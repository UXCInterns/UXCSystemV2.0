export async function deleteSession(sessionId: string) {
  const res = await fetch(`/api/sessions/${sessionId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to delete session");
  }

  return true;
}
