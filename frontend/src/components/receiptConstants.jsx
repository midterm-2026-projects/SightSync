import React from "react";

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

// Reusable custom badge component
export function RoleBadge({ role }) {
  const isAdminOrStaff = role === "admin" || role === "staff";
  return (
    <span
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        background: isAdminOrStaff ? "#E0F2FE" : "#F3F4F6",
        color: isAdminOrStaff ? "#0369A1" : "#4B5563",
      }}
    >
      {role}
    </span>
  );
}