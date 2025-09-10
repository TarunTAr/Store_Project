import React from "react";

export default function TopStores({ stores = null, title = "Top Stores" }) {
  const sample = stores || [
    { id: 1, name: "Milano's Italian", rating: 4.8 },
    { id: 2, name: "TechHub Electronics", rating: 4.6 },
    { id: 3, name: "Green Gardens Pharmacy", rating: 4.9 }
  ];

  return (
    <div style={{ padding: 12, borderRadius: 10 }}>
      <h3 style={{ margin: 0, marginBottom: 8, color: "#0f172a" }}>{title}</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {sample.map(s => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 10, borderRadius: 8, background: "white", boxShadow: "0 6px 16px rgba(2,6,23,0.06)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#4338ca" }}>
                {s.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>{s.name}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{s.rating} ★</div>
              </div>
            </div>
            <div>
              <button onClick={() => window.alert(`Open store ${s.id}`)} style={{ padding: "6px 10px", borderRadius: 8, background: "#6366f1", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
