export interface BudgetCategory {
  categoryName: string;
  amountRequested: number;
  amountApproved: number;
  amountSpent: number;
}

export interface Receipt {
  id: string; // receiptCode or id
  categoryName: string;
  description: string;
  amountClaimed: number;
  status: "pending" | "approved" | "rejected";
  uploadedDate: string;
  amountApproved?: number;
  approvedBy?: string;
  comment?: string;
}

export interface Report {
  quarter: string;
  dueDate: string;
  submittedDate: string | null;
  status: "submitted" | "upcoming" | "overdue";
}

export interface Grantee {
  id: number;
  // avatar data is now computed on the client from the name
  name: string;
  faculty: string;
  email: string;
  researchTitle: string;
  // UI-only status retained for display
  status: "Selected" | "Rejected";
  amountAllocated: number;
  amountRequested: number;
  budgetCats: BudgetCategory[];
  receipts: Receipt[];
  reports: Report[];
}

export interface Applicant {
  id: number;
  // avatar data is computed from the applicant name when rendering
  name: string;
  faculty: string;
  email?: string;
  researchTitle: string;
  amountRequested: number;
  score: number;
  status: "Selected" | "Rejected" | "Shortlisted" | "Pending";
  linkedGranteeId?: number | null;
}

export interface ScoreEntry {
  n: string;
  s: number[];
}

export type View = "dash" | "apps" | "score" | "grantees" | "email";
