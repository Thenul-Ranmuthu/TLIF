"use client";

import { Applicant } from "../types";
import { Mail, Star, UserCheck } from "lucide-react";

interface ApplicantDetailProps {
  applicant: Applicant | null;
  onInvite?: (id: number) => void;
  onScore?: (id: number, score: number) => void;
  onOpenGrantee?: (granteeId: number) => void;
}

export default function ApplicantDetail({ applicant, onInvite, onScore, onOpenGrantee }: ApplicantDetailProps) {
  if (!applicant) {
    return (
      <div className="empty">
        <Star size={34} style={{ opacity: 0.3 }} />
        <p>Select an applicant to see details</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{applicant.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text2)", marginTop: 2 }}>{applicant.faculty}</div>
          <div style={{ fontSize: 12, color: "var(--color-text2)", marginTop: 6 }}>{applicant.researchTitle}</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="act-btn" onClick={() => applicant && onInvite?.(applicant.id)}>
            <Mail size={12} style={{ marginRight: 6 }} /> Invite
          </button>
          <button className="act-btn act-a" onClick={() => applicant && onScore?.(applicant.id, applicant.score)}>
            <Star size={12} style={{ marginRight: 6 }} /> Score
          </button>
          {applicant.linkedGranteeId != null && (
            <button className="act-btn" onClick={() => onOpenGrantee?.(applicant.linkedGranteeId!)}>
              <UserCheck size={12} style={{ marginRight: 6 }} /> Open profile
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Applicant summary</div>
        </div>
        <div className="card-body" style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text2)" }}>Requested</div>
              <div style={{ fontWeight: 700 }}>Rs. {applicant.amountRequested.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text2)" }}>Score</div>
              <div style={{ fontWeight: 700 }}>{applicant.score}%</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: "var(--color-text2)" }}>Status</div>
              <div style={{ fontWeight: 700 }}>{applicant.status}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
