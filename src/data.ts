import type { ExecutiveStep, KnowledgeDocument, NetworkAsset, ReleaseChange } from "./types";

export const disclaimer =
  "Concept demonstration using synthetic network assets, configurations, alarms, procedures, technical guides, release notes, incidents, and operational data. Answers, procedures, runbook updates, configuration guidance, and business values are illustrative and do not represent live Rogers systems, approved Rogers procedures, vendor instructions, production configurations, or guaranteed outcomes.";

const assetSeed = [
  ["TOR-CMTS-145", "CCAP", "NX-9000", "Regional DOCSIS access", "North Toronto", "7.4.2", "7.5.0", 92, "Mandatory Release 7.5 validation gap"],
  ["VAN-OLT-208", "OLT", "PhotonEdge 840", "Fibre access aggregation", "Vancouver", "12.2", "12.4", 97, "None"],
  ["NTO-384", "DOCSIS Node", "NodeWave D4", "Residential access node", "North Toronto", "4.8", "4.8", 88, "Rising evening correctables"],
  ["MTL-TR-044", "Transport Router", "RouteCore X8", "Metro transport", "Montreal", "9.2", "9.4", 95, "Optic lifecycle advisory"],
  ["CGY-ER-018", "Edge Router", "EdgeSphere 16", "Internet edge", "Calgary", "6.1", "6.2", 98, "None"],
  ["OTT-WLC-031", "Wireless Controller", "AirMesh C2", "Enterprise wireless", "Ottawa", "5.5", "5.7", 93, "Telemetry module advisory"],
  ["EDM-AS-240", "Access Switch", "MetroLeaf 48", "Aggregation access", "Edmonton", "3.9", "4.0", 96, "None"],
  ["HAL-OPT-077", "Optical Platform", "Lumina 400", "Long-haul optical", "Halifax", "8.0", "8.1", 91, "Amplifier monitoring update"],
  ["LAB-CCAP-009", "Test CCAP", "NX-9000 Lab", "Upgrade qualification", "Toronto Lab", "7.5.0", "7.5.1", 100, "Lab only"],
  ["WPG-OLT-114", "OLT", "PhotonEdge 640", "Fibre access", "Winnipeg", "11.9", "12.2", 89, "Storage headroom"],
  ["QUE-TR-063", "Transport Router", "RouteCore X4", "Regional transport", "Quebec City", "9.1", "9.4", 94, "Legacy field deprecated"],
  ["TOR-ER-122", "Edge Router", "EdgeSphere 32", "Peering edge", "Toronto", "6.2", "6.2", 99, "None"],
  ["NTO-412", "DOCSIS Node", "NodeWave D4", "Residential access node", "North Toronto", "4.8", "4.8", 90, "Capacity review in 90 days"],
  ["VAN-AS-302", "Access Switch", "MetroLeaf 96", "Service aggregation", "Vancouver", "4.0", "4.1", 96, "None"],
  ["LAB-OPT-015", "Test Optical", "Lumina 800", "Optical validation", "Montreal Lab", "8.2", "8.3", 100, "Lab only"],
];

export const assets: NetworkAsset[] = assetSeed.map((a, index) => ({
  id: a[0] as string,
  family: a[1] as string,
  vendor: "Northstar Networks",
  model: a[2] as string,
  function: a[3] as string,
  region: a[4] as string,
  release: a[5] as string,
  target: a[6] as string,
  lifecycle: index > 12 ? "Lab" : "Active",
  health: index === 2 ? "Watch" : "Healthy",
  compliance: a[7] as number,
  dependencies: ["Monitoring", "Inventory", "Change management"],
  mops: index === 0 ? ["MOP-CMTS-042"] : [`MOP-${String(index + 14).padStart(3, "0")}`],
  runbooks: index === 2 ? ["RB-DOCSIS-014"] : [`RB-NET-${String(index + 20).padStart(3, "0")}`],
  guides: index === 0 ? ["TSG-NX9000-7.5"] : [`TSG-${String(index + 101).padStart(3, "0")}`],
  incidents: (index * 3) % 8,
  issue: a[8] as string,
}));

const knowledgeSeed: Array<[string, string, string, string, string, string, string, KnowledgeDocument["status"], string, string, string, string, number, string]> = [
  ["MOP-CMTS-042", "NX-9000 Release 7.5 Upgrade Method", "MOP", "NX-9000", "DOCSIS", "3.2", "2026-04-12", "Approved", "CMTS Engineering", "2026-04-12", "2026-10-12", "SharePoint", 96, "Internal"],
  ["TSG-NX9000-7.5", "NX-9000 Release 7.5 Technical Service Guide", "Technical service guide", "NX-9000", "DOCSIS", "7.5.1", "2026-08-18", "Approved", "Product Engineering", "2026-08-18", "2027-02-18", "Engineering repository", 98, "Internal"],
  ["RB-DOCSIS-014", "Intermittent Upstream Noise Investigation", "Runbook", "DOCSIS Node", "DOCSIS", "4.1", "2026-06-08", "Approved", "Access Reliability", "2026-06-08", "2026-12-08", "SharePoint", 95, "Internal"],
  ["STD-DOCSIS-019", "DOCSIS Platform Configuration Standard", "Configuration standard", "CCAP", "DOCSIS", "2.8", "2026-07-21", "Approved", "Network Architecture", "2026-07-21", "2027-01-21", "Standards library", 99, "Restricted"],
  ["RN-NX-7.5", "NX Platform Release 7.5 Notes", "Release note", "NX-9000", "DOCSIS", "7.5.0", "2026-08-01", "Approved", "Product Engineering", "2026-08-01", "2027-02-01", "Product lifecycle", 97, "Internal"],
  ["MOP-CMTS-038", "NX-9000 Release 7.4 Upgrade Method", "MOP", "NX-9000", "DOCSIS", "2.9", "2025-11-14", "Superseded", "CMTS Engineering", "2025-11-14", "2026-05-14", "SharePoint", 61, "Internal"],
  ["TSG-UPSTREAM-006", "Understanding Upstream Error Behaviour", "Troubleshooting guide", "DOCSIS Node", "DOCSIS", "1.6", "2026-05-02", "Approved", "Access Reliability", "2026-05-02", "2026-11-02", "Knowledge library", 93, "Internal"],
  ["INC-1842", "Evening Upstream Noise Case Study", "Historical incident", "DOCSIS Node", "DOCSIS", "1.0", "2026-01-17", "Archived", "Major Incident", "2026-01-17", "2027-01-17", "ITSM copy", 85, "Internal"],
  ["STD-RF-011", "Synthetic RF Health Thresholds", "Configuration standard", "DOCSIS Node", "DOCSIS", "3.0", "2026-03-10", "Approved", "RF Engineering", "2026-03-10", "2026-10-10", "Standards library", 97, "Restricted"],
  ["FAQ-DOCSIS-101", "DOCSIS Fundamentals for NOC Engineers", "Training content", "All", "Learning", "2.1", "2026-09-03", "Approved", "NOC Enablement", "2026-09-03", "2027-03-03", "Learning portal", 94, "Internal"],
];

export const knowledge: KnowledgeDocument[] = knowledgeSeed.map((d) => ({
  id: d[0], title: d[1], type: d[2], family: d[3], domain: d[4], version: d[5],
  effective: d[6], status: d[7] as KnowledgeDocument["status"], owner: d[8], reviewed: d[9],
  nextReview: d[10], source: d[11], confidence: Number(d[12]), classification: d[13],
}));

export const releaseChanges: ReleaseChange[] = [
  { category: "Validation", change: "Enhanced upstream-profile validation is mandatory after upgrade.", relevance: "Prevents profile drift from being missed.", action: "Update MOP post-validation section.", impact: "High" },
  { category: "Telemetry", change: "Default collection interval changes.", relevance: "May affect trend comparisons and alert sensitivity.", action: "Confirm approved telemetry standard.", impact: "Medium" },
  { category: "Reliability", change: "Intermittent control-plane synchronization issue resolved.", relevance: "Improves redundancy stability.", action: "Capture pre/post synchronization state.", impact: "Medium" },
  { category: "Configuration", change: "One legacy configuration field is deprecated.", relevance: "Existing templates may contain stale syntax.", action: "Review against STD-DOCSIS-019.", impact: "Medium" },
  { category: "Operations", change: "New health-check output introduced.", relevance: "Changes post-upgrade evidence format.", action: "Update evidence capture guidance.", impact: "Low" },
  { category: "Prerequisite", change: "Temporary storage allocation increases.", relevance: "Upgrade can halt if headroom is insufficient.", action: "Add storage check to preconditions.", impact: "High" },
  { category: "Known issue", change: "Optional telemetry module may report stale state.", relevance: "Could trigger a false operational conclusion.", action: "Use alternate validation source.", impact: "Medium" },
  { category: "Backup", change: "Configuration backup required before image activation.", relevance: "Strengthens rollback readiness.", action: "Record backup evidence.", impact: "High" },
];

export const executiveSteps: ExecutiveStep[] = [
  { number: 1, title: "The Network Knowledge Problem", message: "Critical engineering knowledge is fragmented across procedures, systems, and senior experience.", path: "/" },
  { number: 2, title: "Ask Using Natural Language", message: "An engineer asks for upgrade guidance inside a familiar Teams-style experience.", path: "/ask" },
  { number: 3, title: "Understand Equipment Context", message: "Copilot brings together the asset, release, dependencies, standards, and approvals.", path: "/equipment" },
  { number: 4, title: "Retrieve the Approved MOP", message: "The engineer receives the applicable procedure with status, prerequisites, and caveats.", path: "/mop" },
  { number: 5, title: "Compare Product Releases", message: "Release notes become concise, actionable engineering guidance.", path: "/mop?tab=releases" },
  { number: 6, title: "Detect a Runbook Gap", message: "Current procedure content is checked against newer approved technical guidance.", path: "/runbooks" },
  { number: 7, title: "Propose a Runbook Update", message: "Copilot drafts precise wording while qualified engineering retains authority.", path: "/runbooks" },
  { number: 8, title: "Explain Configuration", message: "Fictional configuration becomes understandable and comparable without deployable commands.", path: "/configuration" },
  { number: 9, title: "Troubleshoot Faster", message: "Signals, hypotheses, procedures, and historical experience are connected.", path: "/troubleshooting" },
  { number: 10, title: "Accelerate Engineer Development", message: "Junior engineers gain guided access to senior-level reasoning.", path: "/learning" },
  { number: 11, title: "Measure Operational Value", message: "Executives see time returned, knowledge reuse, and documentation quality.", path: "/insights" },
  { number: 12, title: "Microsoft Architecture & Governance", message: "Conceptual Microsoft services connect governed knowledge to engineer experiences.", path: "/architecture" },
  { number: 13, title: "Strategic Message", message: "Make senior network engineering knowledge available to every engineer.", path: "/" },
];

export const chartData = [
  { name: "Apr", utilization: 58, correctables: 24, snr: 37, headroom: 42 },
  { name: "May", utilization: 61, correctables: 29, snr: 36, headroom: 39 },
  { name: "Jun", utilization: 64, correctables: 34, snr: 35, headroom: 36 },
  { name: "Jul", utilization: 67, correctables: 42, snr: 34, headroom: 33 },
  { name: "Aug", utilization: 71, correctables: 55, snr: 32, headroom: 29 },
  { name: "Sep", utilization: 74, correctables: 68, snr: 31, headroom: 26 },
];

export const agents = [
  ["NOC Copilot Supervisor", "Combining grounded findings", "Approved sources only", "94%"],
  ["Network Knowledge Agent", "Checking source currency", "MOP + guide + standard", "97%"],
  ["MOP and Runbook Agent", "Comparing validation steps", "Gap and proposed wording", "96%"],
  ["Configuration Agent", "Checking synthetic deviations", "Five review items", "91%"],
  ["Troubleshooting Agent", "Ranking evidence-backed hypotheses", "Guided checks", "88%"],
  ["KPI and Capacity Agent", "Explaining 90-day trend", "Three assets for review", "90%"],
];
