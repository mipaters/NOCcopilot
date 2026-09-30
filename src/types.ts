export type Status = "Approved" | "Draft" | "Under review" | "Superseded" | "Archived" | "Expired";

export interface NetworkAsset {
  id: string;
  family: string;
  vendor: string;
  model: string;
  function: string;
  region: string;
  release: string;
  target: string;
  lifecycle: string;
  health: string;
  compliance: number;
  dependencies: string[];
  mops: string[];
  runbooks: string[];
  guides: string[];
  incidents: number;
  issue: string;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: string;
  family: string;
  domain: string;
  version: string;
  effective: string;
  status: Status;
  owner: string;
  reviewed: string;
  nextReview: string;
  source: string;
  confidence: number;
  classification: string;
}

export interface ReleaseChange {
  category: string;
  change: string;
  relevance: string;
  action: string;
  impact: "Low" | "Medium" | "High";
}

export interface ExecutiveStep {
  number: number;
  title: string;
  message: string;
  path: string;
}

export interface ROIScenario {
  engineers: number;
  questions: number;
  searchMinutes: number;
  searchReduction: number;
  upgrades: number;
  upgradeHours: number;
  upgradeReduction: number;
  cases: number;
  caseHours: number;
  caseReduction: number;
  escalationRate: number;
  escalationReduction: number;
  newEngineers: number;
  onboardingHours: number;
  onboardingReduction: number;
  hourlyCost: number;
  operatingCost: number;
  investment: number;
}
