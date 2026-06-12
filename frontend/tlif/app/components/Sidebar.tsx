"use client";

import { View } from "../types";
import {
  LayoutDashboard,
  FileText,
  Star,
  Users,
  Mail,
} from "lucide-react";

interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dash" as View, label: "Dashboard", icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    label: "Applications",
    items: [
      { id: "apps" as View, label: "Applications", icon: <FileText size={16} />, badge: 10 },
      { id: "score" as View, label: "Scoring & Ranking", icon: <Star size={16} /> },
    ],
  },
  {
    label: "Grantees",
    items: [
      { id: "grantees" as View, label: "All Grantees", icon: <Users size={16} /> },
    ],
  },
  {
    label: "Communication",
    items: [
      { id: "email" as View, label: "Email Center", icon: <Mail size={16} /> },
    ],
  },
];

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
}

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-top">
        <div className="logo-box">SLIIT</div>
        <div>
          <div className="logo-name">TLIF Admin</div>
          <div className="logo-cycle">2024 Grant Cycle</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="nav-group">{group.label}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`ni ${activeView === item.id ? "on" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ni-badge">{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sb-foot">
        <div className="admin-av">AD</div>
        <div>
          <div className="admin-name">Admin</div>
          <div className="admin-role">TLIF Coordinator</div>
        </div>
      </div>
    </aside>
  );
}
