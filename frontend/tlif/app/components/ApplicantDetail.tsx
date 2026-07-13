"use client";

import { Applicant } from "../types";
import { Mail, Star, UserCheck, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

interface ApplicantDetailProps {
  applicant: Applicant | null;
  onInvite?: (id: number) => void;
  onScore?: (id: number, score: number) => void;
  onOpenGrantee?: (granteeId: number) => void;
  onPromote?: (id: number, amountAllocated: number) => Promise<void>;
}

export default function ApplicantDetail({
  applicant,
  onInvite,
  onScore,
  onOpenGrantee,
  onPromote,
}: ApplicantDetailProps) {
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [allocatedInput, setAllocatedInput] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);

  const handleOpenPromote = () => {
    if (!applicant) return;
    // Pre-fill with the requested amount as a sensible default
    setAllocatedInput(String(applicant.amountRequested));
    setPromoteError(null);
    setShowPromoteModal(true);
  };

  const handleConfirmPromote = async () => {
    if (!applicant || !onPromote) return;
    const amount = Number(allocatedInput);
    if (!amount || amount <= 0) {
      setPromoteError("Please enter a valid allocated amount.");
      return;
    }
    setPromoting(true);
    setPromoteError(null);
    try {
      await onPromote(applicant.id, amount);
      setShowPromoteModal(false);
    } catch (err: any) {
      setPromoteError(err?.message ?? "Promotion failed. Please try again.");
    } finally {
      setPromoting(false);
    }
  };

  if (!applicant) {
    return (
      <div className="empty">
        <Star size={34} style={{ opacity: 0.3 }} />
        <p>Select an applicant to see details</p>
      </div>
    );
  }

  const isSelected = applicant.status === "SELECTED";
  const alreadyGrantee = applicant.linkedGranteeId != null;

  return (
    <div>
      {/* ── Header row ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>{applicant.name}</div>
          <div style={{ fontSize: 12, color: "var(--color-text2)", marginTop: 2 }}>
            {applicant.faculty}
          </div>
          <div style={{ fontSize: 12, color: "var(--color-text2)", marginTop: 6 }}>
            {applicant.researchTitle}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="act-btn" onClick={() => applicant && onInvite?.(applicant.id)}>
            <Mail size={12} style={{ marginRight: 6 }} /> Invite
          </button>
          <button
            className="act-btn act-a"
            onClick={() => applicant && onScore?.(applicant.id, applicant.score)}
          >
            <Star size={12} style={{ marginRight: 6 }} /> Score
          </button>

          {/* Open grantee profile if already promoted */}
          {alreadyGrantee && (
            <button className="act-btn" onClick={() => onOpenGrantee?.(applicant.linkedGranteeId!)}>
              <UserCheck size={12} style={{ marginRight: 6 }} /> Open profile
            </button>
          )}

          {/* Promote button — only for SELECTED applicants not yet promoted */}
          {isSelected && !alreadyGrantee && onPromote && (
            <button
              className="act-btn"
              style={{
                background: "var(--navy2, #1a3a5c)",
                color: "#fff",
                border: "none",
              }}
              onClick={handleOpenPromote}
            >
              <ShieldCheck size={12} style={{ marginRight: 6 }} /> Promote to Grantee
            </button>
          )}
        </div>
      </div>

      {/* ── Summary card ───────────────────────────────────────────── */}
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
              <div
                style={{
                  fontWeight: 700,
                  color:
                    applicant.status === "SELECTED"
                      ? "var(--green, #22c55e)"
                      : applicant.status === "REJECTED"
                      ? "var(--red, #ef4444)"
                      : "inherit",
                }}
              >
                {applicant.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Promote-to-Grantee modal ───────────────────────────────── */}
      {showPromoteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "var(--color-surface, #fff)",
              border: "1px solid var(--color-border, #e5e7eb)",
              borderRadius: 12,
              padding: 28,
              width: 400,
              maxWidth: "90vw",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={18} style={{ color: "var(--navy2, #1a3a5c)" }} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Promote to Grantee</span>
              </div>
              <button
                onClick={() => setShowPromoteModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "var(--color-text2)",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Applicant info recap */}
            <div
              style={{
                background: "var(--color-surface2, #f9fafb)",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 13,
              }}
            >
              <div style={{ fontWeight: 600 }}>{applicant.name}</div>
              <div style={{ color: "var(--color-text2)", marginTop: 2 }}>{applicant.faculty}</div>
              <div style={{ color: "var(--color-text2)", marginTop: 4 }}>
                Requested:{" "}
                <strong>Rs. {applicant.amountRequested.toLocaleString()}</strong>
              </div>
            </div>

            {/* Amount input */}
            <label style={{ fontSize: 12, fontWeight: 600, display: "block", marginBottom: 6 }}>
              Approved Grant Amount (Rs.)
            </label>
            <input
              type="number"
              min={1}
              value={allocatedInput}
              onChange={(e) => setAllocatedInput(e.target.value)}
              placeholder="Enter approved amount"
              style={{
                width: "100%",
                padding: "9px 12px",
                fontSize: 14,
                border: "1px solid var(--color-border2, #d1d5db)",
                borderRadius: 8,
                background: "var(--color-surface, #fff)",
                color: "var(--color-text, #111)",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: 6,
              }}
            />

            {/* Difference hint */}
            {allocatedInput && Number(allocatedInput) !== applicant.amountRequested && (
              <div style={{ fontSize: 11, color: "var(--color-text2)", marginBottom: 8 }}>
                {Number(allocatedInput) < applicant.amountRequested
                  ? `Rs. ${(applicant.amountRequested - Number(allocatedInput)).toLocaleString()} less than requested`
                  : `Rs. ${(Number(allocatedInput) - applicant.amountRequested).toLocaleString()} more than requested`}
              </div>
            )}

            {/* Error */}
            {promoteError && (
              <div
                style={{
                  color: "var(--red, #ef4444)",
                  fontSize: 12,
                  marginBottom: 10,
                  padding: "6px 10px",
                  background: "rgba(239,68,68,0.08)",
                  borderRadius: 6,
                }}
              >
                {promoteError}
              </div>
            )}

            {/* Note */}
            <div
              style={{
                fontSize: 11,
                color: "var(--color-text2)",
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              This will create a Grantee profile and, if a user account exists for
              this email, upgrade their system role to <strong>Grantee</strong>.
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                className="act-btn"
                onClick={() => setShowPromoteModal(false)}
                disabled={promoting}
              >
                Cancel
              </button>
              <button
                className="act-btn act-a"
                onClick={handleConfirmPromote}
                disabled={promoting}
                style={{
                  background: promoting ? undefined : "var(--navy2, #1a3a5c)",
                  color: promoting ? undefined : "#fff",
                  border: "none",
                  opacity: promoting ? 0.7 : 1,
                }}
              >
                {promoting ? "Promoting…" : "Confirm & Promote"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}