export default function RoleBadge({ role }) {
  const isAdminOrStaff = role === "admin" || role === "staff";

  return (
    <span
      data-testid="role-badge"
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
