"use client";

import { useState } from "react";
import { View, Grantee, Applicant } from "./types";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Applications from "./components/Applications";
import Scoring from "./components/Scoring";
import Grantees from "./components/Grantees";
import EmailCenter from "./components/EmailCenter";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dash");
  const [grantees, setGrantees] = useState<Grantee[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialGranteeId, setInitialGranteeId] = useState<number | null>(null);

  const handleUpdateGrantee = (updated: Grantee) => {
    setGrantees((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  };

  const handleCreateGrantee = () => {
    // create a simple skeleton grantee and add to state
    const nextId = grantees.length > 0 ? Math.max(...grantees.map((g) => g.id)) + 1 : 1;
    const newG: Grantee = {
      id: nextId,
      name: "New Grantee",
      faculty: "TBD",
      email: "",
      researchTitle: "(to be updated)",
      status: "Selected",
      amountAllocated: 0,
      amountRequested: 0,
      budgetCats: [],
      receipts: [],
      reports: [],
    };
    setGrantees((prev) => [newG, ...prev]);
    setInitialGranteeId(newG.id);
    setActiveView("grantees");
  };

  const handleNavigate = (view: View) => {
    setActiveView(view);
  };

  const handleViewGrantee = (id: number) => {
    setInitialGranteeId(id);
    setActiveView("grantees");
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [gRes, aRes] = await Promise.all([
          fetch('/api/grantees'),
          fetch('/api/applicants'),
        ]);
        if (!gRes.ok || !aRes.ok) throw new Error('Failed to fetch data');
        const [gData, aData] = await Promise.all([gRes.json(), aRes.json()]);
        setGrantees(gData);
        setApplicants(aData);
      } catch (e: any) {
        setError(e?.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="shell">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      <div className="main">
        {activeView === "dash" && <Dashboard grantees={grantees} />}
        {activeView === "apps" && <Applications applicants={applicants} onViewGrantee={handleViewGrantee} />}
        {activeView === "score" && <Scoring />}
        {activeView === "grantees" && (
          <Grantees
            grantees={grantees}
            onUpdateGrantee={handleUpdateGrantee}
            initialSelectedId={initialGranteeId}
          />
        )}
        {activeView === "email" && <EmailCenter />}
      </div>
    </div>
  );
}
