"use client";

import { useState } from "react";
import { Mail, Clock, Send } from "lucide-react";

const AUTOMATED = [
  {
    label: "Application invite",
    pill: "pill-blue",
    pillText: "Auto · Dec 1",
    desc: "Sent to all SLIIT lecturers on Dec 1st",
    dot: "var(--navy2)",
  },
  {
    label: "Fund utilisation reminder",
    pill: "pill-amber",
    pillText: "Auto · Jan",
    desc: "Sent when remaining balance > 30%",
    dot: "var(--orange)",
  },
  {
    label: "Progress report reminder",
    pill: "pill-amber",
    pillText: "Auto · 1mo before",
    desc: "Sent 1 month before each Q deadline",
    dot: "var(--orange)",
  },
  {
    label: "Receipt approved/rejected",
    pill: "pill-green",
    pillText: "Triggered",
    desc: "Fires immediately on admin action",
    dot: "#639922",
  },
  {
    label: "Selection notification",
    pill: "pill-navy",
    pillText: "Manual",
    desc: "Award ceremony + account setup link",
    dot: "#639922",
  },
];

export default function EmailCenter() {
  const [recipient, setRecipient] = useState("All grantees");
  const [template, setTemplate] = useState("Award ceremony invitation");
  const [message, setMessage] = useState(
    "Dear Grantee,\n\nCongratulations on being selected for TLIF 2024..."
  );
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="view-wrapper">
      <div className="topbar">
        <div className="page-icon">
          <Mail size={18} />
        </div>
        <div>
          <div className="page-title">Email Center</div>
          <div className="page-sub">Automated schedules &amp; manual outreach</div>
        </div>
      </div>

      <div className="scroll-body">
        <div className="grid2">
          {/* Automated Emails */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <Clock size={15} style={{ color: "var(--orange)" }} /> Automated emails
              </div>
            </div>
            <div className="card-body" style={{ padding: "8px 16px" }}>
              {AUTOMATED.map((item) => (
                <div className="r-item" key={item.label}>
                  <div className="dot" style={{ background: item.dot }} />
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                      {item.label}{" "}
                      <span className={`pill ${item.pill}`} style={{ marginLeft: 5 }}>
                        {item.pillText}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--color-text2)" }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div className="card">
            <div className="card-head">
              <div className="card-title">
                <Send size={15} style={{ color: "var(--orange)" }} /> Compose email
              </div>
            </div>
            <div className="card-body email-form">
              <label>Send to</label>
              <select value={recipient} onChange={(e) => setRecipient(e.target.value)}>
                <option>All grantees</option>
                <option>Low utilisation grantees</option>
                <option>Overdue report grantees</option>
                <option>Selected applicants only</option>
              </select>

              <label>Template</label>
              <select value={template} onChange={(e) => setTemplate(e.target.value)}>
                <option>Award ceremony invitation</option>
                <option>Fund utilisation reminder</option>
                <option>Report reminder</option>
                <option>Custom</option>
              </select>

              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button
                className={`btn ${sent ? "btn-navy" : "btn-orange"}`}
                style={{ width: "100%", justifyContent: "center" }}
                onClick={handleSend}
              >
                {sent ? (
                  <>✓ Email sent successfully</>
                ) : (
                  <>
                    <Send size={13} /> Send Email
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
