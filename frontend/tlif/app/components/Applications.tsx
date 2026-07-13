"use client";

import { Grantee, Applicant } from "../types";
import { List, Mail } from "lucide-react";
import { useState } from "react";
import ApplicantDetail from "./ApplicantDetail";

interface ApplicationsProps {
  onViewGrantee: (id: number) => void;
  applicants: Applicant[];
  onPromoteToGrantee: (applicantId: number, amountAllocated: number) => Promise<void>;
}

export default function Applications({
  onViewGrantee,
  applicants,
  onPromoteToGrantee,
}: ApplicationsProps) {
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  const handleInvite = (id: number) => {
    alert(`Invite sent to applicant ${id}`);
  };

  const handleScore = (id: number, score: number) => {
    alert(`Open scoring for ${id} (current ${score})`);
  };

  return (
    <div className="view-wrapper">
      <div className="topbar">
        <div className="page-icon">
          <List size={18} />
        </div>
        <div>
          <div className="page-title">Applications</div>
          <div className="page-sub">Review and manage all submitted applications</div>
        </div>
        <div className="top-right">
          <button className="btn btn-orange">
            <Mail size={13} /> Invite Lecturers
          </button>
        </div>
      </div>

      <div className="g-split">
        {/* ── Sidebar list ───────────────────────────────────── */}
        <div className="g-sidebar">
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid var(--color-border)",
              background: "var(--color-surface2)",
            }}
          >
            <div style={{ fontWeight: 600 }}>All applications</div>
            <div style={{ fontSize: 12, color: "var(--color-text2)" }}>
              {applicants.length} submitted
            </div>
          </div>
          <div className="g-list">
            {applicants.map((app) => (
              <div
                key={app.id}
                className={`g-item ${selectedApplicant?.id === app.id ? "on" : ""}`}
                onClick={() => setSelectedApplicant(app)}
              >
                <div className="g-info">
                  <div className="g-name">{app.name}</div>
                  <div className="g-dept">{app.faculty}</div>
                  <div className="g-meta">
                    <span
                      className={`pill ${
                        app.status === "SELECTED" ? "pill-green" : "pill-red"
                      }`}
                    >
                      {app.status}
                    </span>
                    {app.linkedGranteeId != null && (
                      <span className="pill pill-green" style={{ fontSize: 10 }}>
                        Grantee
                      </span>
                    )}
                    <span style={{ fontSize: 10, color: "var(--color-text2)" }}>
                      {app.score}%
                    </span>
                  </div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--color-text2)" }}>
                  Rs. {app.amountRequested.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detail panel ───────────────────────────────────── */}
        <div className="g-detail">
          <ApplicantDetail
            applicant={selectedApplicant}
            onInvite={handleInvite}
            onScore={handleScore}
            onOpenGrantee={(gid) => onViewGrantee(gid)}
            onPromote={async (id, amount) => {
              await onPromoteToGrantee(id, amount);
              // After promotion refresh the selected applicant card to reflect
              // the linked grantee pill (page.tsx will have updated state)
              setSelectedApplicant((prev) =>
                prev?.id === id ? { ...prev, linkedGranteeId: -1 } : prev
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}