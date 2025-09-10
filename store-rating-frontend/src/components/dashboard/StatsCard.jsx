import React from "react";

export default function StatsCard({ title = "Metric", value = "0", icon = null, color = "#667eea" }) {
  return (
    <div style={{
      padding: 14,
      borderRadius: 12,
      background: "#fff",
      boxShadow: "0 8px 20px rgba(2,6,23,0.06)",
      display: "flex",
      alignItems: "center",
      gap: 12
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
        background: `${color}22`, color
      }}>
        {icon || <span style={{ fontWeight: 700 }}>•</span>}
      </div>
      <div>
        <div style={{ fontSize: 13, color: "#475569" }}>{title}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{value}</div>
      </div>
    </div>
  );
}
