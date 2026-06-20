"use client";

import { useState } from "react";
import { Users, AlertTriangle, ChevronRight } from "lucide-react";
import { Grantee, Receipt } from "../types";
import GranteeDetail from "./GranteeDetail";

interface GranteesProps {
  grantees: Grantee[];
  onUpdateGrantee: (updated: Grantee) => void;
  initialSelectedId?: number | null;
}

export default function Grantees({ grantees, onUpdateGrantee, initialSelectedId}: GranteesProps) {
  const [selectedId, setSelectedId] = useState<number | null>(initialSelectedId ?? null);
  const [search, setSearch] = useState("");

  const filtered = grantees.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.faculty.toLowerCase().includes(search.toLowerCase()) ||
      g.researchTitle.toLowerCase().includes(search.toLowerCase())
  );

  const selected = grantees.find((g) => g.id === selectedId) ?? null;

  return (
    <div className="view-wrapper">
      <div className="topbar">
        <div className="page-icon">
          <Users size={18} />
        </div>
        <div>
          <div className="page-title">Grantees</div>
          <div className="page-sub">Select a grantee to view their full profile</div>
        </div>
        <div className="top-right">
          {selected && (
            <span className="pill pill-green">Viewing: {selected.name}</span>
          )}
        </div>
      </div>

      <div className="g-split">
        {/* Sidebar list */}
        <div className="g-sidebar">
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-surface2)",
            }}
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search grantees…"
              style={{
                width: "100%",
                fontSize: 12,
                padding: "7px 10px",
                border: "1px solid var(--color-border2)",
                borderRadius: 8,
                background: "var(--color-surface)",
                color: "var(--color-text)",
                outline: "none",
              }}
            />
          </div>
          <div className="g-list">
            {filtered.map((g) => {
              const spent = g.budgetCats.reduce((a, c) => a + c.amountSpent, 0);
              const pct = Math.round((spent / g.amountAllocated) * 100);
              const pendingCount = g.receipts.filter((r) => r.status === "pending").length;
              const isOverdue = g.reports.some((r) => r.status === "overdue");
              return (
                <div
                  key={g.id}
                  className={`g-item ${selectedId === g.id ? "on" : ""}`}
                  onClick={() => setSelectedId(g.id)}
                >
            <div className="g-info" style={{ marginLeft: 0 }}>
                    <div className="g-name">{g.name}</div>
                    <div className="g-dept">{g.faculty}</div>
                    <div className="g-meta">
                      <span className="pill pill-green">{g.status}</span>
                      {pendingCount > 0 && (
                        <span className="pill pill-amber">{pendingCount} pending</span>
                      )}
                      {isOverdue && (
                        <span className="pill pill-red">Overdue</span>
                      )}
                      <span style={{ fontSize: 10, color: "var(--color-text2)" }}>{pct}% used</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail panel */}
        <div className="g-detail">
          {selected ? (
            <GranteeDetail
              grantee={selected}
              onUpdate={onUpdateGrantee}
            />
          ) : (
            <div className="empty">
              <Users size={34} style={{ opacity: 0.3 }} />
              <p>Select a grantee from the list</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
