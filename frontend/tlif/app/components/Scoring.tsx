"use client";

import { useState } from "react";
import { Star, RefreshCw, Table } from "lucide-react";
import { SCORE_DATA, SCORE_HEADERS, SCORE_WEIGHTS, calcTotal } from "../data";

export default function Scoring() {
  const [scores, setScores] = useState(SCORE_DATA.map((d) => ({ ...d, s: [...d.s] })));

  const ranked = scores
    .map((d, i) => ({ ...d, origIdx: i, total: calcTotal(d.s) }))
    .sort((a, b) => b.total - a.total);

  const handleScoreChange = (origIdx: number, col: number, val: number) => {
    setScores((prev) =>
      prev.map((d, i) => {
        if (i !== origIdx) return d;
        const newS = [...d.s];
        newS[col] = Math.max(1, Math.min(5, val));
        return { ...d, s: newS };
      })
    );
  };

  const getRankClass = (rank: number) =>
    rank === 0 ? "rk1" : rank === 1 ? "rk2" : rank === 2 ? "rk3" : "rkn";

  return (
    <div className="view-wrapper">
      <div className="topbar">
        <div className="page-icon">
          <Star size={18} />
        </div>
        <div>
          <div className="page-title">Scoring &amp; Ranking</div>
          <div className="page-sub">Edit scores → Recalculate — top 5 auto-selected</div>
        </div>
        <div className="top-right">
          <button className="btn btn-orange">
            <RefreshCw size={13} /> Recalculate
          </button>
        </div>
      </div>

      <div className="scroll-body">
        <div className="card">
          <div className="card-head">
            <div className="card-title">
              <Table size={15} style={{ color: "var(--orange)" }} /> Evaluation matrix
            </div>
            <span style={{ fontSize: 11, color: "var(--color-text2)" }}>
              Scores 1–5 · Weighted per TLIF rubric
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ minWidth: 140 }}>Applicant</th>
                  {SCORE_HEADERS.map((h) => (
                    <th key={h.label} style={{ textAlign: "center", minWidth: 70 }}>
                      {h.label}
                      <br />
                      <span style={{ fontWeight: 400, fontSize: 9 }}>{h.weight}</span>
                    </th>
                  ))}
                  <th style={{ textAlign: "center", minWidth: 60 }}>Total</th>
                  <th style={{ textAlign: "center", minWidth: 50 }}>Rank</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((d, rank) => {
                  const sel = rank < 5;
                  return (
                    <tr key={d.n}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                          <span style={{ fontWeight: 500 }}>{d.n}</span>
                          {sel && (
                            <span className="pill pill-green" style={{ fontSize: 9 }}>
                              Selected
                            </span>
                          )}
                        </div>
                      </td>
                      {d.s.map((v, si) => (
                        <td key={si} style={{ textAlign: "center" }}>
                          <input
                            className="sc-in"
                            type="number"
                            min={1}
                            max={5}
                            value={v}
                            onChange={(e) =>
                              handleScoreChange(d.origIdx, si, parseFloat(e.target.value) || 1)
                            }
                          />
                        </td>
                      ))}
                      <td
                        style={{
                          textAlign: "center",
                          fontWeight: 600,
                          color: "var(--navy)",
                        }}
                      >
                        {d.total}%
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className={`rank-b ${getRankClass(rank)}`}>{rank + 1}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
