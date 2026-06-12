"use client";

import { useState } from "react";
import { Wallet, Banknote, PiggyBank, Receipt, BarChart2, FileText, AlertTriangle, Check, X, MessageSquare } from "lucide-react";
import { Grantee, Receipt as ReceiptType } from "../types";

interface GranteeDetailProps {
  grantee: Grantee;
  onUpdate: (updated: Grantee) => void;
}

export default function GranteeDetail({ grantee: g, onUpdate }: GranteeDetailProps) {
  const [approveAmts, setApproveAmts] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const totalApproved = g.budgetCats.reduce((a, c) => a + c.amountApproved, 0);
  const spent = g.budgetCats.reduce((a, c) => a + c.amountSpent, 0);
  const remaining = totalApproved - spent;
  const pct = totalApproved > 0 ? Math.round((spent / totalApproved) * 100) : 0;
  const pendingCount = g.receipts.filter((r) => r.status === "pending").length;
  const isOverdue = g.reports.some((r) => r.status === "overdue");

  const handleApprove = (ri: number) => {
    const r = g.receipts[ri];
    const amt = approveAmts[ri] ?? r.amountClaimed;
    const cmt = comments[ri] ?? "";
    const updatedReceipts = g.receipts.map((rec, i) =>
      i === ri
        ? { ...rec, status: "approved" as const, amountApproved: amt, approvedBy: "Admin", comment: cmt }
        : rec
    );
    const updatedCats = g.budgetCats.map((c) =>
      c.categoryName === r.categoryName ? { ...c, amountSpent: c.amountSpent + amt } : c
    );
    onUpdate({ ...g, receipts: updatedReceipts, budgetCats: updatedCats });
  };

  const handleReject = (ri: number) => {
    const updatedReceipts = g.receipts.map((rec, i) =>
      i === ri ? { ...rec, status: "rejected" as const, amountApproved: 0 } : rec
    );
    onUpdate({ ...g, receipts: updatedReceipts });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--color-text)" }}>{g.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text2)", marginTop: 2 }}>
            {g.faculty} ·{" "}
            <a href={`mailto:${g.email}`} style={{ color: "var(--orange)" }}>
              {g.email}
            </a>
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text2)", marginTop: 3 }}>
            <FileText size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 3 }} />
            {g.researchTitle}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {isOverdue && (
            <span className="pill pill-red">
              <AlertTriangle size={11} style={{ display: "inline", marginRight: 3 }} />
              Report overdue
            </span>
          )}
          {pendingCount > 0 && (
            <span className="pill pill-amber">
              {pendingCount} receipt{pendingCount > 1 ? "s" : ""} pending
            </span>
          )}
          <span className="pill pill-green">Selected</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid4" style={{ marginBottom: 18 }}>
        <div className="kpi">
          <div className="kpi-accent" style={{ background: "var(--navy2)" }} />
          <div className="kpi-icon" style={{ background: "var(--navy-bg)", color: "var(--navy2)" }}>
            <Wallet size={16} />
          </div>
          <div className="kpi-val" style={{ fontSize: 16 }}>
            Rs. {(totalApproved / 1000).toFixed(0)}k
          </div>
          <div className="kpi-lbl">Total approved</div>
          <div className="kpi-sub">Requested Rs. {(g.amountRequested / 1000).toFixed(0)}k</div>
        </div>
        <div className="kpi">
          <div className="kpi-accent" style={{ background: "var(--orange)" }} />
          <div className="kpi-icon" style={{ background: "var(--orange-bg)", color: "var(--amber)" }}>
            <Banknote size={16} />
          </div>
          <div className="kpi-val" style={{ fontSize: 16, color: "var(--orange)" }}>
            Rs. {(spent / 1000).toFixed(0)}k
          </div>
          <div className="kpi-lbl">Spent &amp; approved</div>
          <div className="kpi-sub">{pct}% of total</div>
        </div>
        <div className="kpi">
          <div className="kpi-accent" style={{ background: "#639922" }} />
          <div className="kpi-icon" style={{ background: "var(--green-bg)", color: "var(--green)" }}>
            <PiggyBank size={16} />
          </div>
          <div
            className="kpi-val"
            style={{ fontSize: 16, color: remaining < 50000 ? "var(--red)" : "var(--green)" }}
          >
            Rs. {(remaining / 1000).toFixed(0)}k
          </div>
          <div className="kpi-lbl">Remaining balance</div>
          <div className="kpi-sub">{100 - pct}% unused</div>
        </div>
        <div className="kpi">
          <div
            className="kpi-accent"
            style={{ background: pendingCount > 0 ? "var(--orange)" : "#639922" }}
          />
          <div
            className="kpi-icon"
            style={{
              background: pendingCount > 0 ? "var(--orange-bg)" : "var(--green-bg)",
              color: pendingCount > 0 ? "var(--amber)" : "var(--green)",
            }}
          >
            <Receipt size={16} />
          </div>
          <div
            className="kpi-val"
            style={{ color: pendingCount > 0 ? "var(--orange)" : "var(--green)" }}
          >
            {pendingCount}
          </div>
          <div className="kpi-lbl">Pending receipts</div>
          <div className="kpi-sub">
            {g.receipts.filter((r) => r.status === "approved").length} approved
          </div>
        </div>
      </div>

      {/* Budget + Reports + Receipts */}
      <div className="grid2" style={{ marginBottom: 0 }}>
        <div>
          {/* Budget Breakdown */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <BarChart2 size={15} style={{ color: "var(--orange)" }} /> Budget breakdown by category
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th style={{ textAlign: "right" }}>Requested</th>
                    <th style={{ textAlign: "right" }}>Approved</th>
                    <th style={{ textAlign: "right" }}>Spent</th>
                    <th style={{ textAlign: "right" }}>Remaining</th>
                    <th style={{ minWidth: 90 }}>Used</th>
                  </tr>
                </thead>
                <tbody>
                  {g.budgetCats.map((c) => {
                          const rem = c.amountApproved - c.amountSpent;
                          const p = c.amountApproved > 0 ? Math.round((c.amountSpent / c.amountApproved) * 100) : 0;
                    const col = p >= 75 ? "#639922" : p >= 40 ? "var(--orange)" : "var(--red)";
                      return (
                      <tr key={c.categoryName}>
                              <td style={{ fontWeight: 500 }}>{c.categoryName}</td>
                              <td style={{ textAlign: "right", color: "var(--color-text2)" }}>
                                Rs. {c.amountRequested.toLocaleString()}
                              </td>
                              <td style={{ textAlign: "right" }}>Rs. {c.amountApproved.toLocaleString()}</td>
                              <td style={{ textAlign: "right", color: "var(--orange)" }}>
                                Rs. {c.amountSpent.toLocaleString()}
                              </td>
                        <td
                          style={{
                            textAlign: "right",
                            fontWeight: 600,
                            color:
                                    rem === 0
                                      ? "var(--green)"
                                      : rem < 10000
                                      ? "var(--red)"
                                      : "var(--color-text)",
                          }}
                        >
                          Rs. {rem.toLocaleString()}
                        </td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div className="prog-bar-wrap" style={{ flex: 1, height: 6 }}>
                              <div
                                className="prog-bar"
                                style={{ width: `${p}%`, background: col }}
                              />
                            </div>
                            <span style={{ fontSize: 10, color: "var(--color-text2)", minWidth: 26 }}>
                              {p}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Progress Reports */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <FileText size={15} style={{ color: "var(--orange)" }} /> Progress reports
              </div>
            </div>
            <div className="card-body" style={{ padding: "8px 16px" }}>
              {g.reports.map((r) => {
                const dot =
                  r.status === "submitted"
                    ? "#639922"
                    : r.status === "overdue"
                    ? "var(--orange)"
                    : "#b4b2a9";
                const pill =
                  r.status === "submitted"
                    ? "pill-green"
                    : r.status === "overdue"
                    ? "pill-red"
                    : "pill-blue";
                const pillLabel =
                  r.status === "submitted"
                    ? "Submitted"
                    : r.status === "overdue"
                    ? "Overdue"
                    : "Upcoming";
                return (
                  <div className="r-item" key={r.quarter}>
                    <div className="dot" style={{ background: dot }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{r.quarter} Report</span>
                        <span className={`pill ${pill}`}>{pillLabel}</span>
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-text2)" }}>
                        Due: {r.dueDate}
                        {r.submittedDate && ` · Submitted: ${r.submittedDate}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Receipts */}
        <div>
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <Receipt size={15} style={{ color: "var(--orange)" }} /> Receipts
              </div>
              <span className="pill pill-amber">{pendingCount} pending</span>
            </div>
            <div>
              {g.receipts.length === 0 ? (
                <div className="empty">
                  <Receipt size={34} style={{ opacity: 0.3 }} />
                  <p>No receipts uploaded</p>
                </div>
              ) : (
                g.receipts.map((r, ri) => (
                  <ReceiptRow
                      key={r.id}
                      receipt={r}
                      ri={ri}
                      approveAmt={approveAmts[ri] ?? r.amountClaimed}
                      comment={comments[ri] ?? ""}
                      onAmountChange={(val) =>
                        setApproveAmts((prev) => ({ ...prev, [ri]: val }))
                      }
                      onCommentChange={(val) =>
                        setComments((prev) => ({ ...prev, [ri]: val }))
                      }
                      onApprove={() => handleApprove(ri)}
                      onReject={() => handleReject(ri)}
                    />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReceiptRowProps {
  receipt: ReceiptType;
  ri: number;
  approveAmt: number;
  comment: string;
  onAmountChange: (val: number) => void;
  onCommentChange: (val: string) => void;
  onApprove: () => void;
  onReject: () => void;
}

function ReceiptRow({
  receipt: r,
  approveAmt,
  comment,
  onAmountChange,
  onCommentChange,
  onApprove,
  onReject,
}: ReceiptRowProps) {
  if (r.status !== "pending") {
    const statusPill =
      r.status === "approved" ? "pill-green" : "pill-red";
    const statusLabel = r.status === "approved" ? "Approved" : "Rejected";
    return (
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--color-border)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}
        >
          <div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{r.description}</span>
            <span className="pill pill-navy" style={{ marginLeft: 6 }}>
              {r.categoryName}
            </span>
          </div>
          <span className={`pill ${statusPill}`}>{statusLabel}</span>
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text2)" }}>
          Claimed: Rs. {r.amountClaimed.toLocaleString()} · Approved:{" "}
            <b style={{ color: "var(--green)" }}>Rs. {(r.amountApproved ?? 0).toLocaleString()}</b> ·{" "}
            {r.uploadedDate} · by {r.approvedBy}
        </div>
        {r.comment && (
          <div style={{ fontSize: 11, color: "var(--color-text2)", marginTop: 3 }}>
            <MessageSquare size={11} style={{ display: "inline", marginRight: 3 }} />
            {r.comment}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid var(--color-border)",
        background: "#fffbf5",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <div>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{r.description}</span>
          <span className="pill pill-navy" style={{ marginLeft: 6 }}>
            {r.categoryName}
          </span>
        </div>
        <span className="pill pill-amber">Pending review</span>
      </div>
      <div style={{ fontSize: 11, color: "var(--color-text2)", marginBottom: 8 }}>
  Claimed: <b>Rs. {r.amountClaimed.toLocaleString()}</b> · Uploaded {r.uploadedDate}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ fontSize: 11, color: "var(--color-text2)" }}>Approve Rs.</label>
        <input
          type="number"
          className="amt-in"
          value={approveAmt}
          onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
        />
        <input
          type="text"
          className="comment-in"
          placeholder="Comment (optional)"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
        />
        <button className="act-btn act-a" onClick={onApprove}>
          <Check size={11} style={{ display: "inline", marginRight: 3 }} /> Approve
        </button>
        <button className="act-btn act-r" onClick={onReject}>
          <X size={11} style={{ display: "inline", marginRight: 3 }} /> Reject
        </button>
      </div>
    </div>
  );
}
