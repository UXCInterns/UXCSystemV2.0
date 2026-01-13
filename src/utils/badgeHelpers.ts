// Task status badges
export function getStatusBadgeProps(status: string) {
  switch (status) {
    case "Done":
      return { color: "success" as const, variant: "light" as const };
    case "In Progress":
      return { color: "warning" as const, variant: "light" as const };
    case "Review":
      return { color: "purple" as const, variant: "light" as const };
    case "To Do":
      return { color: "error" as const, variant: "light" as const };
    default:
      return { color: "light" as const, variant: "light" as const };
  }
}

export function getPriorityBadgeProps(priority: string) {
  switch (priority) {
    case "Critical":
      return { color: "error" as const, variant: "light" as const };
    case "High":
      return { color: "warning" as const, variant: "light" as const };
    case "Medium":
      return { color: "primary" as const, variant: "light" as const };
    case "Low":
      return { color: "success" as const, variant: "light" as const };
    default:
      return { color: "light" as const, variant: "light" as const };
  }
}

// Project status badges
export function getProjectStatusBadgeProps(status: string) {
  switch (status) {
    case "Completed":
      return { color: "success" as const, variant: "light" as const };
    case "In Progress":
      return { color: "primary" as const, variant: "light" as const };
    case "On Hold":
      return { color: "warning" as const, variant: "light" as const };
    case "Not Started":
      return { color: "light" as const, variant: "light" as const };
    case "Cancelled":
      return { color: "error" as const, variant: "light" as const };
    default:
      return { color: "light" as const, variant: "light" as const };
  }
}