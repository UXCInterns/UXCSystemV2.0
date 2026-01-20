//hooks/innopoll/updateSessionTitle.ts

export const updateSessionTitle = async (
  sessionId: string,
  title: string
) => {
  if (!sessionId || !title.trim()) return;

  const res = await fetch(`/api/sessions/${sessionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to update session title");
  }
};


