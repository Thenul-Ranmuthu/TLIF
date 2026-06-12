"use client";

import { Grantee } from "../types";
import { Bell, Mail, AlertTriangle, FileText, Users, TrendingUp, Wallet, Check, Clock, X } from "lucide-react";

interface DashboardProps {
  grantees: Grantee[];
}

export default function Dashboard({ grantees }: DashboardProps) {
  const totalAllocated = grantees.reduce((a, g) => a + g.amountAllocated, 0);
  const totalSpentAll = grantees.reduce(
    (a, g) => a + g.budgetCats.reduce((b, c) => b + c.amountSpent, 0),
    0
  );
  const totalPending = grantees.reduce(
    (a, g) => a + g.receipts.filter((r) => r.status === "pending").length,
    0
  );
  const lowUtil = grantees.filter((g) => {
    const spent = g.budgetCats.reduce((a, c) => a + c.amountSpent, 0);
    return g.amountAllocated === 0 ? false : (spent / g.amountAllocated) * 100 < 50;
  }).length;

  const overallPct = totalAllocated === 0 ? 0 : Math.round((totalSpentAll / totalAllocated) * 100);

  return (
    <div className="view-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <div className="page-icon">
          <FileText size={18} />
        </div>
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-sub">Financial Year Apr 2024 – Apr 2025</div>
        </div>
        <div className="top-right">
          <button className="btn btn-orange">
            <Bell size={13} /> Send Reminder
          </button>
        </div>
      </div>

      <div className="scroll-body">
        {/* Alert */}
        <div className="alert">
          <AlertTriangle size={17} className="flex-shrink-0" style={{ color: "var(--amber)" }} />
          <div className="alert-text">
            <b>Deadline approaching —</b> Grantees must utilise funds by January 31st.{" "}
            {lowUtil} grantees are below 50% utilisation.
          </div>
          <button className="alert-act">
            <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
            Email All
          </button>
        </div>

        {/* KPI Grid */}
        <div className="grid4">
          <div className="kpi">
            <div className="kpi-accent" style={{ background: "var(--navy2)" }} />
            <div className="kpi-icon" style={{ background: "var(--navy-bg)", color: "var(--navy2)" }}>
              <FileText size={16} />
            </div>
            <div className="kpi-val">10</div>
            <div className="kpi-lbl">Applications</div>
            <div className="kpi-sub">5 selected · 1 rejected</div>
          </div>
          <div className="kpi">
            <div className="kpi-accent" style={{ background: "var(--orange)" }} />
            <div className="kpi-icon" style={{ background: "var(--orange-bg)", color: "var(--amber)" }}>
              <Wallet size={16} />
            </div>
            <div className="kpi-val">Rs. {(totalAllocated / 1000).toFixed(0)}k</div>
            <div className="kpi-lbl">Total allocated</div>
            <div className="kpi-sub">{overallPct}% disbursed</div>
          </div>
          <div className="kpi">
            <div className="kpi-accent" style={{ background: totalPending > 0 ? "var(--orange)" : "#639922" }} />
            <div
              className="kpi-icon"
              style={{
                background: totalPending > 0 ? "var(--orange-bg)" : "var(--green-bg)",
                color: totalPending > 0 ? "var(--amber)" : "var(--green)",
              }}
            >
              <Clock size={16} />
            </div>
            <div className="kpi-val" style={{ color: totalPending > 0 ? "var(--orange)" : "var(--green)" }}>
              {totalPending}
            </div>
            <div className="kpi-lbl">Pending receipts</div>
            <div className="kpi-sub">Across all grantees</div>
          </div>
          <div className="kpi">
            <div className="kpi-accent" style={{ background: lowUtil > 0 ? "var(--red)" : "#639922" }} />
            <div
              className="kpi-icon"
              style={{
                background: lowUtil > 0 ? "var(--red-bg)" : "var(--green-bg)",
                color: lowUtil > 0 ? "var(--red)" : "var(--green)",
              }}
            >
              <TrendingUp size={16} />
            </div>
            <div className="kpi-val" style={{ color: lowUtil > 0 ? "var(--red)" : "var(--green)" }}>
              {lowUtil}
            </div>
            <div className="kpi-lbl">Low utilisation</div>
            <div className="kpi-sub">Below 50% threshold</div>
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid2">
          {/* Fund Utilisation */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <TrendingUp size={16} style={{ color: "var(--orange)" }} /> Fund utilisation by grantee
              </div>
              <span className="card-link">Export</span>
            </div>
            <div className="card-body">
              {grantees.map((g) => {
                const spent = g.budgetCats.reduce((a, c) => a + c.amountSpent, 0);
                const pct = g.amountAllocated === 0 ? 0 : Math.round((spent / g.amountAllocated) * 100);
                const color = pct >= 60 ? "#639922" : pct >= 35 ? "var(--orange)" : "var(--red)";
                return (
                  <div className="prog-row" key={g.id}>
                    <div className="prog-top">
                      <span style={{ fontWeight: 500 }}>{g.name}</span>
                      <span style={{ color: "var(--color-text2)" }}>
                        Rs. {(spent / 1000).toFixed(0)}k / {(g.amountAllocated / 1000).toFixed(0)}k{" "}
                        <b style={{ color }}>{pct}%</b>
                      </span>
                    </div>
                    <div className="prog-bar-wrap">
                      <div className="prog-bar" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Status */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <FileText size={16} style={{ color: "var(--orange)" }} /> Progress report status
              </div>
            </div>
            <div className="card-body" style={{ padding: "8px 16px" }}>
              {grantees.map((g) =>
                g.reports.map((r) => {
                  const pill =
                    r.status === "submitted"
                      ? "pill-green"
                      : r.status === "overdue"
                      ? "pill-red"
                      : "pill-blue";
                  const label =
                    r.status === "submitted"
                      ? "Submitted"
                      : r.status === "overdue"
                      ? "Overdue"
                      : "Upcoming";
                  const dot =
                    r.status === "submitted"
                      ? "#639922"
                      : r.status === "overdue"
                      ? "var(--orange)"
                      : "#b4b2a9";
                  return (
                    <div className="r-item" key={`${g.id}-${r.quarter}`}>
                      <div className="dot" style={{ background: dot }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>
                            {g.name} — {r.quarter}
                          </span>
                          <span className={`pill ${pill}`}>{label}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-text2)" }}>
                          Due: {r.dueDate}
                          {r.submittedDate && ` · Submitted: ${r.submittedDate}`}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
