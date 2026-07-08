// Roles allowed to view/send updates
export const AUTHORIZED_ROLES = ["admin", "staff"];

// Shared design system theme colors
export const C = {
  primary: "#2563EB",
  success: "#16A34A",
  danger: "#DC2626",
  text: "#1F2937",
  muted: "#4B5563",
  border: "#E5E7EB",
  surface: "#FFFFFF",
  bg: "#F3F4F6",
};

// Global currency formatter to ensure correct numeric strings
export const formatCurrency = (amount) => {
  return `$${Number(amount || 0).toFixed(2)}`;
};
