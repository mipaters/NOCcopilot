import { useEffect, useState, type ReactNode } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, BarChart3, BookOpen, Bot, BrainCircuit,
  Building2, Check, CheckCircle2, ChevronRight, CircleGauge, ClipboardCheck, Cloud,
  Code2, Database, FileDiff, FileSearch, GraduationCap, Info, Layers3, Library,
  Menu, MessageSquare, Moon, Network, Pause, Play, RefreshCw, RotateCcw, Search,
  Settings2, ShieldCheck, Sparkles, Sun, Users, Wrench, X, Zap,
} from "lucide-react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { agents, assets, chartData, disclaimer, executiveSteps, knowledge, releaseChanges } from "./data";
import type { ROIScenario } from "./types";

const nav = [
  ["/", "Home", Sparkles],
  ["/ask", "Ask NOC Copilot", MessageSquare],
  ["/equipment", "Equipment Explorer", Network],
  ["/mop", "MOP & Upgrade", ClipboardCheck],
  ["/runbooks", "Runbook Intelligence", FileDiff],
  ["/configuration", "Configuration Assistant", Code2],
  ["/troubleshooting", "Troubleshooting", Wrench],
  ["/kpi", "KPI & Capacity", CircleGauge],
  ["/learning", "Learning Centre", GraduationCap],
  ["/knowledge", "Knowledge Library", Library],
  ["/insights", "Operational Insights", BarChart3],
  ["/roi", "Value & ROI", Zap],
  ["/architecture", "Microsoft Architecture", Cloud],
  ["/governance", "Governance & Controls", ShieldCheck],
] as const;

const prompts = [
  "Show me the MOP for upgrading CMTS TOR-CMTS-145.",
  "What changed between Release 7.4 and Release 7.5?",
  "Does the current MOP include every mandatory Release 7.5 validation step?",
  "Explain the configuration on TOR-CMTS-145.",
  "Why are upstream correctables increasing on Node NTO-384?",
  "Which nodes may exceed utilization thresholds in 90 days?",
];

const kpis = [
  ["8,420", "Copilot questions this month", "+12%"],
  ["74%", "Resolved without escalation", "+8 pts"],
  ["62%", "Less knowledge-search time", "Illustrative"],
  ["38%", "Faster troubleshooting preparation", "Illustrative"],
  ["1,240", "Engineer hours returned", "This month"],
  ["186", "Approved procedures indexed", "94% cited"],
  ["37", "Documentation updates under review", "Human governed"],
  ["41%", "Faster new-engineer onboarding", "Illustrative"],
];

function App() {
  const [dark, setDark] = useState(true);
  const [menu, setMenu] = useState(false);
  const [overview, setOverview] = useState(false);
  const [teams, setTeams] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => setMenu(false), [location.pathname]);

  const reset = () => {
    localStorage.removeItem("noc-demo");
    setResetKey((value) => value + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-only" onClick={() => setMenu(!menu)} aria-label="Toggle navigation">
          <Menu size={20} />
        </button>
        <Link className="brand" to="/">
          <span className="brand-mark"><Network size={21} /></span>
          <span><strong>NOC Copilot</strong><small>Copilot for Every Network Engineer</small></span>
        </Link>
        <div className="header-status">
          <span className="connection"><span /> Network Knowledge Connected</span>
          <Badge tone="violet">Synthetic Data</Badge>
        </div>
        <div className="header-actions">
          <button className="button primary executive-button" onClick={() => setOverview(true)}>
            <Sparkles size={16} /> Executive Demo Overview
          </button>
          <button className="button subtle hide-small" onClick={() => setTeams(true)}><MessageSquare size={16} /> Simulated Teams</button>
          <button className="icon-button" onClick={reset} aria-label="Reset demo" title="Reset demo"><RotateCcw size={18} /></button>
          <button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle colour mode">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <nav aria-label="Primary navigation">
          {nav.map(([path, label, Icon]) => (
            <NavLink key={path} to={path} end={path === "/"} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              <Icon size={18} /><span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-card">
          <div className="eyebrow"><Bot size={14} /> Agent team</div>
          <strong>6 specialists ready</strong>
          <span>Grounded guidance with human review.</span>
          <Link to="/governance">View authority model <ChevronRight size={14} /></Link>
        </div>
      </aside>

      <main className="content" key={resetKey}>
        <Routes>
          <Route path="/" element={<Home onAsk={() => setTeams(true)} />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/mop" element={<MopPage />} />
          <Route path="/runbooks" element={<RunbookPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/troubleshooting" element={<TroubleshootingPage />} />
          <Route path="/kpi" element={<KpiPage />} />
          <Route path="/learning" element={<LearningPage />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/roi" element={<RoiPage />} />
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/governance" element={<GovernancePage />} />
          <Route path="*" element={<Home onAsk={() => setTeams(true)} />} />
        </Routes>
      </main>

      <footer>
        <div><strong>NOC Copilot</strong> · Network knowledge connected · Synthetic demonstration</div>
        <p>{disclaimer}</p>
      </footer>
      {overview && <ExecutiveOverview onClose={() => setOverview(false)} />}
      {teams && <TeamsModal onClose={() => setTeams(false)} />}
    </div>
  );
}

function Home({ onAsk }: { onAsk: () => void }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const submit = () => {
    if (question.trim()) navigate(`/ask?q=${encodeURIComponent(question)}`);
  };
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15} /> Network engineering intelligence</div>
          <h1>Copilot for Every<br /><span>Network Engineer</span></h1>
          <p>Turn trusted network knowledge into fast, contextual, and explainable engineering guidance.</p>
          <div className="ask-box">
            <BrainCircuit size={22} />
            <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Ask NOC Copilot a network engineering question" aria-label="Ask NOC Copilot" />
            <button onClick={submit} aria-label="Submit question"><ArrowRight size={19} /></button>
          </div>
          <div className="prompt-row">
            {prompts.slice(0, 4).map((prompt) => <button key={prompt} onClick={() => { setQuestion(prompt); navigate(`/ask?q=${encodeURIComponent(prompt)}`); }}>{prompt}</button>)}
          </div>
        </div>
        <div className="hero-visual">
          <div className="network-orb"><Network size={52} /><span className="pulse p1" /><span className="pulse p2" /></div>
          <div className="floating-card f1"><CheckCircle2 size={18} /><span><b>Approved source found</b>MOP-CMTS-042 · v3.2</span></div>
          <div className="floating-card f2"><AlertTriangle size={18} /><span><b>Documentation gap</b>1 validation step missing</span></div>
          <div className="floating-card f3"><Bot size={18} /><span><b>Copilot confidence</b>96% · human review</span></div>
        </div>
      </section>

      <SectionTitle eyebrow="Simulated executive outcomes" title="Knowledge moves at network speed" action={<Link className="text-link" to="/insights">View operational insights <ArrowRight size={15} /></Link>} />
      <div className="kpi-grid">{kpis.map(([value, label, detail]) => <KpiCard key={label} value={value} label={label} detail={detail} />)}</div>

      <div className="two-col section-gap">
        <Panel>
          <SectionTitle eyebrow="Primary demo scenario" title="Upgrade TOR-CMTS-145 with confidence" compact />
          <div className="asset-highlight">
            <div className="asset-icon"><Layers3 /></div>
            <div><strong>TOR-CMTS-145</strong><span>Northstar NX-9000 · North Toronto</span></div>
            <Badge tone="green">In service</Badge>
          </div>
          <div className="version-flow">
            <div><small>Current</small><b>7.4.2</b></div><ArrowRight /><div><small>Target</small><b>7.5.0</b></div>
          </div>
          <Callout tone="warning" title="Engineering review required">
            The latest technical guide adds a mandatory upstream-profile validation step not present in MOP version 3.2.
          </Callout>
          <div className="button-row">
            <Link className="button primary" to="/mop">Open upgrade workspace</Link>
            <button className="button subtle" onClick={onAsk}>Open in Teams</button>
          </div>
        </Panel>
        <Panel>
          <SectionTitle eyebrow="Knowledge pulse" title="What needs attention" compact />
          <ActivityList />
        </Panel>
      </div>

      <SectionTitle eyebrow="Start with a task" title="Recommended engineer workflows" />
      <div className="feature-grid">
        {[
          [ClipboardCheck, "Prepare an upgrade", "Find the applicable MOP, compare releases, and generate a reviewable checklist.", "/mop", "cyan"],
          [Wrench, "Troubleshoot a signal", "Connect synthetic KPIs to likely causes, guided checks, and escalation criteria.", "/troubleshooting", "violet"],
          [Code2, "Explain a configuration", "Understand fictional syntax and compare it with the approved synthetic standard.", "/configuration", "blue"],
          [GraduationCap, "Learn from senior knowledge", "Move from plain-language concepts to detailed engineering explanations.", "/learning", "green"],
        ].map(([Icon, title, copy, path, tone]) => (
          <Link className={`feature-card ${tone}`} to={String(path)} key={String(title)}>
            <span className="feature-icon"><Icon /></span><h3>{String(title)}</h3><p>{String(copy)}</p><span>Open workspace <ArrowRight size={15} /></span>
          </Link>
        ))}
      </div>
    </>
  );
}

function AskPage() {
  const query = new URLSearchParams(useLocation().search).get("q") || prompts[0];
  const [question, setQuestion] = useState(query);
  const [answer, setAnswer] = useState(true);
  const [showAgents, setShowAgents] = useState(false);
  const ask = () => setAnswer(Boolean(question.trim()));
  return (
    <Page title="Ask NOC Copilot" subtitle="Grounded technical guidance from approved synthetic network knowledge." icon={MessageSquare}>
      <DemoNotice />
      <div className="ask-layout">
        <div>
          <Panel className="conversation-panel">
            <div className="chat-compose">
              <textarea value={question} onChange={(e) => setQuestion(e.target.value)} aria-label="Network engineering question" />
              <button className="button primary" onClick={ask}><Sparkles size={16} /> Ask Copilot</button>
            </div>
            <div className="prompt-row">{prompts.map((p) => <button key={p} onClick={() => { setQuestion(p); setAnswer(true); }}>{p}</button>)}</div>
          </Panel>
          {answer && <TechnicalAnswer question={question} />}
        </div>
        <aside>
          <Panel>
            <SectionTitle eyebrow="Grounding" title="Sources used" compact />
            <SourceCard id="MOP-CMTS-042" title="NX-9000 Release 7.5 Upgrade Method" status="Approved" />
            <SourceCard id="TSG-NX9000-7.5" title="Release 7.5 Technical Service Guide" status="Approved" />
            <SourceCard id="STD-DOCSIS-019" title="DOCSIS Configuration Standard" status="Approved" />
          </Panel>
          <Panel className="top-gap">
            <button className="plain-button full" onClick={() => setShowAgents(!showAgents)}><Bot size={17} /> Show Agent Activity <ChevronRight size={16} /></button>
            {showAgents && <div className="agent-mini-list">{agents.map((a) => <div key={a[0]}><span className="status-dot" /><div><b>{a[0]}</b><small>{a[1]}</small></div></div>)}</div>}
          </Panel>
        </aside>
      </div>
    </Page>
  );
}

function TechnicalAnswer({ question }: { question: string }) {
  const configuration = question.toLowerCase().includes("config");
  const troubleshooting = question.toLowerCase().includes("correctable") || question.toLowerCase().includes("noise");
  const capacity = question.toLowerCase().includes("90 days") || question.toLowerCase().includes("utilization");
  const content = configuration
    ? "The synthetic configuration uses the approved redundancy mode and upstream profile, but differs from **STD-DOCSIS-019** in telemetry interval, description metadata, and one deprecated field. Open the Configuration Assistant for a block-by-block explanation."
    : troubleshooting
      ? "Upstream correctables are trending above the synthetic baseline. The strongest current hypotheses are **intermittent ingress noise**, **connector degradation**, and an **upstream-profile mismatch**. Uncorrectables remain low, so service impact is not yet confirmed."
      : capacity
        ? "Three synthetic assets may require capacity review within 90 days. **NTO-412** has the least projected headroom, followed by **TOR-CMTS-145** and **VAN-OLT-208**. This is an engineering-review recommendation, not an autonomous capacity decision."
        : "I found **MOP-CMTS-042 version 3.2** for the NX-9000 platform. It applies to TOR-CMTS-145, currently running Release 7.4.2. The applicable MOP is approved for this synthetic demonstration, but it may require an update before use because the latest technical service guide contains an additional mandatory validation step.";
  return (
    <Panel className="answer-card">
      <div className="answer-header">
        <div className="copilot-avatar"><Sparkles size={20} /></div>
        <div><strong>NOC Copilot</strong><span>Grounded response · 96% confidence · Synthetic</span></div>
        <Badge tone="green">3 approved sources</Badge>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      {!configuration && !troubleshooting && !capacity && <>
        <div className="summary-grid">
          <DataPoint label="Asset" value="TOR-CMTS-145" />
          <DataPoint label="Current → target" value="7.4.2 → 7.5.0" />
          <DataPoint label="Applicable MOP" value="MOP-CMTS-042 v3.2" />
          <DataPoint label="Maintenance" value="Window required" />
          <DataPoint label="Rollback" value="Available" />
          <DataPoint label="Approval" value="Technical review required" />
        </div>
        <Callout tone="warning" title="Documentation gap detected">TSG-NX9000-7.5 adds a mandatory post-upgrade upstream-profile validation step that is missing from the current MOP.</Callout>
      </>}
      <div className="button-row">
        <Link className="button primary" to={configuration ? "/configuration" : troubleshooting ? "/troubleshooting" : capacity ? "/kpi" : "/mop"}>Open workspace</Link>
        <Link className="button subtle" to="/knowledge">Inspect sources</Link>
        <button className="button subtle">Request senior review</button>
      </div>
      <p className="inline-disclaimer">{disclaimer}</p>
    </Panel>
  );
}

function EquipmentPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(assets[0]);
  const filtered = assets.filter((a) => `${a.id} ${a.family} ${a.region}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <Page title="Equipment Explorer" subtitle="Synthetic inventory connected to procedures, standards, lifecycle, and operational knowledge." icon={Network}>
      <div className="equipment-layout">
        <Panel>
          <SearchBox value={search} onChange={setSearch} placeholder="Search assets, families, or regions" />
          <div className="asset-list">
            {filtered.map((asset) => <button key={asset.id} className={selected.id === asset.id ? "asset-row selected" : "asset-row"} onClick={() => setSelected(asset)}>
              <span className="asset-type"><Layers3 size={17} /></span>
              <span><b>{asset.id}</b><small>{asset.family} · {asset.region}</small></span>
              <span className={`health ${asset.health.toLowerCase()}`}>{asset.health}</span>
            </button>)}
          </div>
        </Panel>
        <div>
          <Panel className="asset-detail">
            <div className="detail-heading">
              <div><div className="eyebrow">Synthetic network asset</div><h2>{selected.id}</h2><p>{selected.function} · {selected.region}</p></div>
              <Badge tone={selected.health === "Healthy" ? "green" : "amber"}>{selected.health}</Badge>
            </div>
            <div className="summary-grid">
              <DataPoint label="Platform" value={`${selected.vendor} ${selected.model}`} />
              <DataPoint label="Release" value={`${selected.release} → ${selected.target}`} />
              <DataPoint label="Lifecycle" value={selected.lifecycle} />
              <DataPoint label="Compliance" value={`${selected.compliance}%`} />
              <DataPoint label="Related MOP" value={selected.mops[0]} />
              <DataPoint label="Recent incidents" value={String(selected.incidents)} />
            </div>
            <Progress label="Upgrade readiness" value={selected.id === "TOR-CMTS-145" ? 82 : selected.compliance} />
            <Callout tone={selected.issue === "None" ? "info" : "warning"} title="Known consideration">{selected.issue}</Callout>
          </Panel>
          <div className="two-col top-gap">
            <Panel><SectionTitle eyebrow="Context" title="Dependencies & service role" compact /><TagList items={selected.dependencies} /><p className="body-copy">Provides {selected.function.toLowerCase()} capabilities. Inventory, monitoring, configuration standards, and change governance must be reviewed together.</p></Panel>
            <Panel><SectionTitle eyebrow="Connected knowledge" title="Procedures & guides" compact /><SourceCard id={selected.mops[0]} title="Applicable maintenance procedure" status="Approved" /><SourceCard id={selected.guides[0]} title="Technical service guide" status="Approved" /></Panel>
          </div>
          {selected.id === "TOR-CMTS-145" && <div className="button-row"><Link className="button primary" to="/mop">Plan Release 7.5 upgrade</Link><Link className="button subtle" to="/configuration">Review configuration</Link></div>}
        </div>
      </div>
    </Page>
  );
}

function MopPage() {
  const initialTab = new URLSearchParams(useLocation().search).get("tab") === "releases" ? "Release comparison" : "Upgrade plan";
  const [tab, setTab] = useState(initialTab);
  const [checklist, setChecklist] = useState(false);
  const [review, setReview] = useState(false);
  const tabs = ["Upgrade plan", "Release comparison", "Rollback plan"];
  return (
    <Page title="MOP & Upgrade Workspace" subtitle="Prepare safe, reviewable synthetic upgrade plans without executing network changes." icon={ClipboardCheck}>
      <DemoNotice text="Demonstration MOP only. No generated procedure is approved for production use." />
      <Tabs tabs={tabs} active={tab} onChange={setTab} />
      {tab === "Release comparison" ? <ReleaseComparison /> : tab === "Rollback plan" ? <RollbackPlan /> : <>
        <div className="summary-strip">
          <DataPoint label="Asset" value="TOR-CMTS-145" /><DataPoint label="Upgrade" value="7.4.2 → 7.5.0" /><DataPoint label="MOP" value="MOP-CMTS-042 v3.2" /><DataPoint label="Duration" value="90 minutes" /><DataPoint label="Window" value="Required" /><DataPoint label="Approval" value="Required" />
        </div>
        <Callout tone="warning" title="Review before use">The applicable MOP is approved for this synthetic demonstration, but it may require an update before use because the latest technical service guide contains an additional mandatory validation step.</Callout>
        <div className="mop-grid">
          <Panel>
            <SectionTitle eyebrow="Readiness" title="Preconditions" compact />
            <Checklist items={["Hardware compatibility confirmed", "Redundancy healthy", "Software image and checksum available", "Configuration backup prepared", "Capacity headroom verified", "Monitoring and alarm baselines ready", "Change approval recorded", "Maintenance notification prepared"]} />
          </Panel>
          <Panel>
            <SectionTitle eyebrow="Method of procedure" title="Upgrade phases" compact />
            <Timeline items={["Preparation", "Pre-validation", "Maintenance-mode entry", "Software installation", "Controlled restart", "Platform health validation", "Service validation", "Post-upgrade monitoring", "Maintenance closure"]} warningAt={6} />
          </Panel>
        </div>
        <Panel className="top-gap">
          <SectionTitle eyebrow="Mandatory validation" title="Post-upgrade checks" compact />
          <div className="check-grid"><Checklist items={["Software version", "Platform health", "Redundancy", "Interface state", "Service-group registration", "Upstream profiles"]} /><Checklist items={["Downstream profiles", "Error rates", "Customer-impact indicators", "Alarm state", "KPI baseline comparison", "Configuration delta"]} /></div>
        </Panel>
        {checklist && <Callout tone="success" title="Simulated checklist generated">18 reviewable items assembled from MOP-CMTS-042, TSG-NX9000-7.5, and STD-DOCSIS-019. Human validation is required.</Callout>}
        {review && <Callout tone="info" title="Technical review requested">The simulated plan is now marked “Under review” and has not been approved or executed.</Callout>}
        <div className="button-row">
          <button className="button primary" onClick={() => setChecklist(true)}>Generate checklist</button>
          <button className="button subtle" onClick={() => setTab("Release comparison")}>Compare release notes</button>
          <Link className="button subtle" to="/runbooks">Review documentation gap</Link>
          <button className="button subtle" onClick={() => setReview(true)}>Mark ready for technical review</button>
        </div>
      </>}
      <InlineDisclaimer />
    </Page>
  );
}

function ReleaseComparison() {
  return (
    <>
      <div className="release-head">
        <Panel><div className="eyebrow">Current release</div><h2>7.4.2</h2><Badge>Stable synthetic baseline</Badge></Panel>
        <ArrowRight size={26} />
        <Panel><div className="eyebrow">Target release</div><h2>7.5.0</h2><Badge tone="violet">Engineering review</Badge></Panel>
      </div>
      <div className="release-list">
        {releaseChanges.map((change) => <Panel key={change.change} className="release-row">
          <Badge tone={change.impact === "High" ? "amber" : change.impact === "Medium" ? "violet" : "default"}>{change.category}</Badge>
          <div><strong>{change.change}</strong><p>{change.relevance}</p></div>
          <div><small>Required action</small><span>{change.action}</span></div>
          <Badge tone={change.impact === "High" ? "red" : "default"}>{change.impact} impact</Badge>
        </Panel>)}
      </div>
    </>
  );
}

function RollbackPlan() {
  return <div className="mop-grid"><Panel><SectionTitle eyebrow="Rollback readiness" title="Triggers" compact /><Checklist items={["Platform health cannot be restored", "Service registration materially degrades", "Redundancy remains impaired", "Unexpected configuration delta appears", "Engineering review directs rollback"]} /></Panel><Panel><SectionTitle eyebrow="Controlled recovery" title="Reviewable sequence" compact /><Timeline items={["Pause maintenance closure", "Notify change authority", "Confirm previous synthetic image", "Restore synthetic configuration baseline", "Validate operational state", "Create incident and evidence package"]} /></Panel></div>;
}

function RunbookPage() {
  const [proposal, setProposal] = useState("Validate that the expected upstream service profiles are active across the selected test service groups. Compare the post-upgrade state with the captured pre-upgrade baseline. If a material mismatch is present, stop the maintenance closure process and escalate for engineering review.");
  const [status, setStatus] = useState("Draft");
  return (
    <Page title="Runbook Intelligence" subtitle="Find documentation gaps, draft precise updates, and preserve engineering approval authority." icon={FileDiff}>
      <DemoNotice text="Fictional demonstration content. NOC Copilot cannot update or approve production procedures." />
      <Tabs tabs={["Find Runbook", "Compare Sources", "Review Gaps", "Proposed Updates", "Approval History", "Stale Knowledge"]} active="Review Gaps" onChange={() => undefined} />
      <div className="gap-banner"><AlertTriangle /><div><b>Mandatory validation step missing</b><span>MOP-CMTS-042 v3.2 does not include the upstream-profile validation introduced by TSG-NX9000-7.5.</span></div><Badge tone="amber">High relevance</Badge></div>
      <div className="diff-grid">
        <Panel><div className="diff-title"><span>Current approved content</span><Badge tone="green">v3.2 Approved</Badge></div><div className="diff-content"><h4>8. Service validation</h4><p>Validate general platform health, service-group registration, active alarms, and key performance indicators before maintenance closure.</p><div className="diff-removed">No explicit upstream-profile comparison is present.</div></div></Panel>
        <Panel><div className="diff-title"><span>Proposed content</span><Badge tone={status === "Approved" ? "green" : "violet"}>{status}</Badge></div><div className="diff-content"><h4>8.1 Upstream-profile validation</h4><textarea value={proposal} onChange={(e) => { setProposal(e.target.value); setStatus("Draft"); }} aria-label="Proposed MOP update" /><div className="diff-added">+ Added from approved synthetic technical guide</div></div></Panel>
      </div>
      <Panel className="top-gap">
        <div className="review-meta"><DataPoint label="Supporting source" value="TSG-NX9000-7.5 §9.4" /><DataPoint label="Risk addressed" value="Post-upgrade profile mismatch" /><DataPoint label="Reviewer role" value="CMTS Engineering Lead" /><DataPoint label="Approval state" value={status} /></div>
      </Panel>
      {status === "Rejected" && <Callout tone="warning" title="Proposal rejected">The draft remains in audit history and the approved MOP is unchanged.</Callout>}
      {status === "Under review" && <Callout tone="info" title="Sent to simulated review">A qualified engineer must validate the evidence and wording before approval.</Callout>}
      {status === "Approved" && <Callout tone="success" title="Approved as simulated version 3.3">This state exists only inside the concept demonstration; no real document was modified.</Callout>}
      <div className="button-row">
        <button className="button primary" onClick={() => setStatus("Under review")}>Send to simulated review</button>
        <button className="button subtle" onClick={() => setStatus("Approved")}>Approve simulated version</button>
        <button className="button danger" onClick={() => setStatus("Rejected")}>Reject proposal</button>
        <button className="button subtle" onClick={() => setProposal(proposal + " Record the validation evidence in the maintenance record.")}>Request more evidence</button>
      </div>
      <InlineDisclaimer />
    </Page>
  );
}

const demoConfig = `NETWORK-DEMO-CONFIG
asset TOR-CMTS-145
release 7.4.2
telemetry interval 60-demo-seconds
upstream profile DEMO-US-04
redundancy mode DEMO-ACTIVE-STANDBY
legacy-field DEMO-COMPATIBILITY
unused service-profile DEMO-OLD-02
END-DEMO-CONFIG`;

function ConfigurationPage() {
  const [mode, setMode] = useState("Explain");
  const deviations = ["Missing asset description", "Telemetry interval differs from standard", "Deprecated legacy configuration field", "Nonstandard warning threshold", "Unused service profile DEMO-OLD-02"];
  return (
    <Page title="Configuration Assistant" subtitle="Explain and compare fictional, non-deployable configuration samples." icon={Code2}>
      <DemoNotice text="Demonstration configuration only. Not valid for production equipment." />
      <div className="config-flags"><Badge tone="violet">Synthetic</Badge><Badge tone="red">Non-deployable</Badge><Badge tone="amber">Human review required</Badge></div>
      <div className="config-layout">
        <Panel>
          <div className="code-header"><span>TOR-CMTS-145.demo-config</span><Badge>Fictional syntax</Badge></div>
          <pre><code>{demoConfig}</code></pre>
        </Panel>
        <Panel>
          <Tabs tabs={["Explain", "Compare", "Deviations", "Proposal"]} active={mode} onChange={setMode} />
          {mode === "Explain" && <div className="explanation-list">{[
            ["asset", "Names the synthetic demonstration asset."],
            ["release", "Records the illustrative software baseline."],
            ["telemetry interval", "Controls fictional collection frequency; it differs from the standard."],
            ["upstream profile", "Associates a non-deployable demonstration service profile."],
            ["redundancy mode", "Represents a healthy active/standby design in fictional syntax."],
          ].map(([key, text]) => <div key={key}><code>{key}</code><p>{text}</p></div>)}</div>}
          {mode === "Compare" && <div><Callout tone="warning" title="92% aligned with STD-DOCSIS-019">Five review items remain. The comparison uses synthetic standard content only.</Callout><Progress label="Configuration compliance" value={92} /><SourceCard id="STD-DOCSIS-019" title="DOCSIS Platform Configuration Standard" status="Approved" /></div>}
          {mode === "Deviations" && <Checklist items={deviations} warning />}
          {mode === "Proposal" && <div><h3>Reviewable change proposal</h3><p className="body-copy">Add a synthetic description, align telemetry timing with the demonstration standard, remove deprecated and unused fields, and restore the approved threshold. No operational CLI or deployable command is generated.</p><Badge tone="amber">Draft · engineering review required</Badge></div>}
        </Panel>
      </div>
      <div className="button-row">{["Explain", "Compare", "Deviations", "Proposal"].map((item) => <button key={item} className={mode === item ? "button primary" : "button subtle"} onClick={() => setMode(item)}>{item === "Proposal" ? "Prepare review proposal" : item}</button>)}<button className="button subtle">Save simulated analysis</button></div>
      <InlineDisclaimer />
    </Page>
  );
}

function TroubleshootingPage() {
  const hypotheses = ["Intermittent ingress noise", "Connector or plant degradation", "Customer-premises interference", "Upstream-profile mismatch", "Monitoring anomaly"];
  const [selected, setSelected] = useState(hypotheses[0]);
  const [checks, setChecks] = useState<boolean[]>(Array(7).fill(false));
  const [review, setReview] = useState(false);
  const checkNames = ["Validate trend against baseline", "Compare modem distribution", "Review recent maintenance", "Review synthetic spectrum evidence", "Compare upstream profile", "Inspect historical cases", "Confirm escalation threshold"];
  return (
    <Page title="Troubleshooting Assistant" subtitle="Evidence-backed guidance for synthetic Node NTO-384 with clear escalation criteria." icon={Wrench}>
      <DemoNotice />
      <Panel className="case-header">
        <div><div className="eyebrow">Primary troubleshooting question</div><h2>Why are upstream correctables increasing on Node NTO-384?</h2><p>Correctables are trending above the synthetic baseline. Strongest hypotheses: ingress noise, connector degradation, and profile mismatch.</p></div>
        <Confidence value={88} />
      </Panel>
      <div className="trouble-grid">
        <Panel>
          <SectionTitle eyebrow="Observed synthetic signals" title="Evidence" compact />
          <Checklist items={["Correctables increase during evening hours", "Signal-to-noise ratio is declining", "Uncorrectables remain low", "Three modems contribute disproportionately", "No recent planned configuration change", "Utilization remains normal"]} />
          <div className="mini-chart"><ResponsiveContainer width="100%" height={190}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--line)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line dataKey="correctables" stroke="#22d3ee" strokeWidth={3} /><Line dataKey="snr" stroke="#a78bfa" strokeWidth={3} /></LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel>
          <SectionTitle eyebrow="Ranked hypotheses" title="Select a line of investigation" compact />
          <div className="hypothesis-list">{hypotheses.map((h, i) => <button className={selected === h ? "selected" : ""} onClick={() => setSelected(h)} key={h}><span>{i + 1}</span><div><b>{h}</b><small>{i === 0 ? "Strong evidence match" : i < 3 ? "Plausible" : "Lower probability"}</small></div><ChevronRight /></button>)}</div>
        </Panel>
      </div>
      <Panel className="top-gap">
        <SectionTitle eyebrow={`Selected: ${selected}`} title="Guided diagnostic checks" compact />
        <div className="guided-checks">{checkNames.map((name, i) => <button key={name} onClick={() => setChecks(checks.map((value, index) => index === i ? !value : value))} className={checks[i] ? "done" : ""}><span>{checks[i] ? <Check size={16} /> : i + 1}</span>{name}<small>{checks[i] ? "Finding recorded" : "Open evidence"}</small></button>)}</div>
      </Panel>
      {review && <Callout tone="info" title="Senior review requested">The synthetic case summary, evidence, selected hypothesis, and completed checks were packaged for review.</Callout>}
      <div className="button-row"><button className="button primary" onClick={() => setReview(true)}>Request simulated senior review</button><button className="button subtle">Create troubleshooting summary</button><Link className="button subtle" to="/knowledge">Open supporting knowledge</Link></div>
    </Page>
  );
}

function KpiPage() {
  const [metric, setMetric] = useState("Utilization");
  const metrics = ["Utilization", "Correctables", "Upstream SNR", "Capacity headroom"];
  return (
    <Page title="KPI & Capacity Assistant" subtitle="Explain synthetic network trends and recommend engineering review—not autonomous decisions." icon={CircleGauge}>
      <DemoNotice />
      <div className="prompt-row">{["Which nodes may exceed thresholds in 90 days?", "What changed after the last release?", "Which KPIs should be monitored during an upgrade?"].map((p) => <button key={p}>{p}</button>)}</div>
      <div className="metric-tabs">{metrics.map((m) => <button className={metric === m ? "active" : ""} onClick={() => setMetric(m)} key={m}>{m}</button>)}</div>
      <div className="kpi-layout">
        <Panel>
          <SectionTitle eyebrow="Six-month synthetic trend" title={metric} compact />
          <ResponsiveContainer width="100%" height={310}><AreaChart data={chartData}><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--line)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey={metric === "Utilization" ? "utilization" : metric === "Correctables" ? "correctables" : metric === "Upstream SNR" ? "snr" : "headroom"} stroke="#22d3ee" fill="url(#area)" strokeWidth={3} /></AreaChart></ResponsiveContainer>
        </Panel>
        <Panel>
          <SectionTitle eyebrow="Copilot explanation" title="Capacity review recommended" compact />
          <p className="body-copy">NTO-412 may approach the synthetic 80% utilization review threshold within 90 days if the current growth rate persists. TOR-CMTS-145 and VAN-OLT-208 should remain on the watchlist.</p>
          <div className="summary-grid"><DataPoint label="Threshold" value="80% review point" /><DataPoint label="Affected assets" value="3 synthetic assets" /><DataPoint label="Confidence" value="90%" /><DataPoint label="Decision authority" value="Capacity engineering" /></div>
          <Callout tone="info" title="Possible explanations">Seasonal growth, service migration, changing peak-hour behaviour, or incomplete inventory context.</Callout>
        </Panel>
      </div>
    </Page>
  );
}

interface LearningTopic {
  simpleTitle: string;
  simple: string;
  technical: string;
  tip: string;
  visual: [string, string, string];
  checks: string[];
  walkthrough: string[];
  example: string;
  question: string;
  answers: [string, string, string];
  explanation: string;
}

const learningTopics: Record<string, LearningTopic> = {
  "DOCSIS fundamentals": {
    simpleTitle: "Think of DOCSIS as a shared digital roadway",
    simple: "Cable modems share upstream and downstream channels to communicate with a CMTS or CCAP. The platform coordinates access so many homes can use the same physical network efficiently.",
    technical: "DOCSIS service groups organize shared RF capacity. Scheduling, modulation profiles, FEC behaviour, SNR, channel occupancy, and modem distribution should be evaluated together.",
    tip: "Connect every KPI to service impact, time of day, affected population, and a known-good baseline.",
    visual: ["Cable modems", "Shared RF channels", "CMTS / CCAP"],
    checks: ["Identify the service-group boundary", "Review upstream and downstream health", "Compare errors with the baseline", "Relate shared capacity to customer impact"],
    walkthrough: ["Locate the affected service group", "Establish the normal baseline", "Review channel health", "Compare modem distribution", "Open the approved runbook", "Escalate with evidence"],
    example: "Evening traffic grows across a shared service group. Utilization rises, but RF health remains stable, so capacity should be reviewed before assuming a plant fault.",
    question: "What makes DOCSIS capacity a shared resource?",
    answers: ["Multiple modems use common RF channels", "Every modem has a dedicated fibre", "Only the CMTS generates traffic"],
    explanation: "Multiple cable modems are coordinated across shared upstream and downstream RF channels.",
  },
  "CMTS and CCAP fundamentals": {
    simpleTitle: "The access platform coordinates neighbourhood connectivity",
    simple: "A CMTS or CCAP connects cable modems to network services, manages registration, assigns channel resources, and provides a central view of service-group health.",
    technical: "The platform combines control, forwarding, RF-service, redundancy, timing, and telemetry functions. Engineers correlate platform health with line-card, service-group, modem, and dependency state.",
    tip: "Do not treat platform health as a single status; validate control plane, forwarding, redundancy, RF services, and customer registration separately.",
    visual: ["Cable nodes", "CMTS / CCAP", "IP core"],
    checks: ["Confirm control-plane health", "Validate redundancy state", "Review service-group registration", "Check upstream and downstream resources"],
    walkthrough: ["Identify the platform role", "Map dependent service groups", "Check redundancy", "Review registration success", "Correlate alarms and KPIs", "Use the applicable MOP"],
    example: "A platform reports healthy hardware while one service group has poor registration. The investigation should narrow to service-group and RF context rather than platform-wide recovery.",
    question: "Which check best confirms service delivery beyond basic platform health?",
    answers: ["Service-group registration success", "Chassis asset label", "Maintenance-window duration"],
    explanation: "Registration success shows whether modems can establish service, not merely whether the chassis is online.",
  },
  "Upstream and downstream channels": {
    simpleTitle: "Two directions, different engineering behaviours",
    simple: "Downstream channels carry data toward customers; upstream channels carry data from customers. Upstream is often more sensitive to noise because many premises transmit into shared plant.",
    technical: "Channel width, modulation, occupancy, power, SNR, profile selection, bonding, and error correction determine usable capacity and resilience in each direction.",
    tip: "Always separate upstream and downstream evidence before deciding whether a symptom is platform, plant, profile, or capacity related.",
    visual: ["Customer traffic", "Upstream ↔ downstream", "Access platform"],
    checks: ["Identify affected direction", "Compare channel occupancy", "Review power and SNR", "Check bonding and profile state"],
    walkthrough: ["Confirm symptom direction", "Select affected channels", "Compare against baseline", "Review bonding membership", "Inspect error behaviour", "Apply escalation criteria"],
    example: "Upstream SNR declines while downstream indicators remain stable. This focuses investigation on return-path conditions rather than a broad platform failure.",
    question: "Which direction is generally more exposed to combined ingress from customer premises?",
    answers: ["Upstream", "Downstream only", "Neither direction"],
    explanation: "Upstream combines transmissions from many premises and is commonly more exposed to ingress.",
  },
  "Signal-to-noise ratio": {
    simpleTitle: "SNR describes how clearly the signal stands above noise",
    simple: "A stronger signal-to-noise ratio generally gives the receiver more room to distinguish valid data from interference. A falling trend can reduce modulation resilience.",
    technical: "SNR should be interpreted with modulation, profile, power, channel frequency, correctables, uncorrectables, time, and affected population. Thresholds vary by design.",
    tip: "A single SNR sample is less useful than a time-correlated trend tied to errors and service impact.",
    visual: ["Useful signal", "Signal vs noise", "Receiver quality"],
    checks: ["Compare with baseline", "Correlate with error rates", "Review time-of-day pattern", "Check affected channel scope"],
    walkthrough: ["Select a stable baseline", "Plot SNR over time", "Overlay error behaviour", "Identify channel concentration", "Review plant evidence", "Escalate if impact expands"],
    example: "SNR drops by several synthetic units each evening while correctables rise. The recurring pattern supports an intermittent interference hypothesis.",
    question: "What makes an SNR decline operationally meaningful?",
    answers: ["Correlation with errors and impact", "The colour of the chart", "A single isolated sample"],
    explanation: "SNR becomes useful evidence when its trend correlates with errors, scope, timing, and service impact.",
  },
  "Correctables and uncorrectables": {
    simpleTitle: "Correctables show recovery; uncorrectables show lost information",
    simple: "Forward error correction can repair some damaged data. Correctables count repaired errors, while uncorrectables indicate data that could not be recovered.",
    technical: "Rates and trends matter more than raw counters. Normalize by traffic and time, then correlate with SNR, modulation, channel, modem distribution, latency, and customer impact.",
    tip: "Rising correctables are an early signal, not automatic proof of customer impact or plant damage.",
    visual: ["Damaged symbols", "Error correction", "Recovered / lost data"],
    checks: ["Normalize error rates", "Separate correctable and uncorrectable trends", "Compare affected modems", "Correlate with RF evidence"],
    walkthrough: ["Confirm counter interval", "Compare with traffic volume", "Find concentrated contributors", "Review SNR and profiles", "Check service impact", "Follow escalation thresholds"],
    example: "Correctables rise but uncorrectables remain low and latency is stable. Investigate the degradation while avoiding an unsupported outage conclusion.",
    question: "What do uncorrectables indicate?",
    answers: ["Errors FEC could not recover", "Every repaired codeword", "Available capacity headroom"],
    explanation: "Uncorrectables represent damaged information that error correction could not recover.",
  },
  "Fibre access basics": {
    simpleTitle: "Fibre access shares optical capacity through passive distribution",
    simple: "An OLT at the network side communicates with customer ONTs through optical splitters. Light levels, registration, split design, and shared capacity shape service health.",
    technical: "PON engineering considers optical budgets, split ratios, wavelengths, ranging, DBA, OLT ports, ONT state, protection, and physical-path loss.",
    tip: "Distinguish a single-ONT issue from a splitter branch, feeder, optics, or OLT-port issue using scope and optical evidence.",
    visual: ["Customer ONTs", "Passive splitter", "OLT"],
    checks: ["Determine affected ONT scope", "Review optical levels", "Check OLT-port registration", "Map splitter and feeder dependencies"],
    walkthrough: ["Identify affected customers", "Map the PON topology", "Compare optical levels", "Review registration events", "Check shared components", "Escalate with path evidence"],
    example: "Several ONTs on one splitter branch lose optical margin while peers on the same OLT port remain stable, focusing field inspection on the branch.",
    question: "Which component passively divides the optical signal?",
    answers: ["Optical splitter", "CMTS", "Edge router"],
    explanation: "A passive optical splitter distributes the optical signal between the OLT and multiple ONTs.",
  },
  "IP routing fundamentals": {
    simpleTitle: "Routers choose paths between network destinations",
    simple: "Routers learn which networks are reachable, compare available paths, and forward packets toward the best next hop based on routing policy.",
    technical: "Troubleshooting separates interface state, adjacency, route learning, best-path selection, forwarding installation, policy, convergence, and end-to-end reachability.",
    tip: "A route in the control plane does not automatically prove that forwarding or the end-to-end service path is healthy.",
    visual: ["Source network", "Routing decision", "Destination network"],
    checks: ["Validate interface state", "Confirm routing adjacency", "Inspect selected path", "Test forwarding and return path"],
    walkthrough: ["Define source and destination", "Inspect physical and logical state", "Confirm route learning", "Review policy", "Validate forwarding", "Check the reverse path"],
    example: "A route is learned but traffic fails because a policy prevents forwarding installation. Control-plane visibility alone would miss the issue.",
    question: "What must be checked after confirming a route is learned?",
    answers: ["Forwarding installation and reachability", "Only the asset name", "The DOCSIS modulation profile"],
    explanation: "Engineers must confirm the route is installed for forwarding and that the complete path works.",
  },
  "Software upgrade practices": {
    simpleTitle: "A safe upgrade is a controlled comparison of before and after",
    simple: "Engineers confirm prerequisites, capture a baseline, follow an approved procedure, validate service, and keep a clear rollback path.",
    technical: "Upgrade readiness includes compatibility, redundancy, image integrity, storage, backup, monitoring, approvals, maintenance communication, release-specific validation, and rollback evidence.",
    tip: "Treat release notes and technical guides as change inputs to the MOP, not as optional background reading.",
    visual: ["Known baseline", "Controlled change", "Validated target"],
    checks: ["Confirm compatibility and approvals", "Capture operational baseline", "Validate image and backup", "Prepare rollback triggers"],
    walkthrough: ["Review release impact", "Validate prerequisites", "Capture baseline", "Perform controlled change", "Validate platform and service", "Close or roll back"],
    example: "Release 7.5 adds a mandatory upstream-profile check. The existing MOP must be updated or supplemented before maintenance closure.",
    question: "What should define a rollback decision?",
    answers: ["Pre-agreed triggers and evidence", "Engineer intuition alone", "Elapsed time only"],
    explanation: "Rollback conditions should be explicit, evidence-based, and agreed before the maintenance starts.",
  },
  "MOP structure": {
    simpleTitle: "A MOP turns an approved change into a reviewable sequence",
    simple: "A good Method of Procedure explains scope, prerequisites, roles, steps, validation, rollback, communication, and approval so engineers can execute consistently.",
    technical: "MOP quality depends on version control, applicability, evidence requirements, stop conditions, decision authority, release-specific checks, dependencies, and auditable review.",
    tip: "A step is incomplete if it says what to do but not what success looks like or when to stop.",
    visual: ["Preconditions", "Controlled steps", "Validation & rollback"],
    checks: ["Confirm scope and applicability", "Review prerequisites", "Check success and stop criteria", "Validate rollback completeness"],
    walkthrough: ["Identify change objective", "Define authority and roles", "Document prerequisites", "Sequence safe actions", "Specify evidence", "Review and approve externally"],
    example: "A MOP says 'validate services' but omits the new upstream-profile check. Comparing it with the current guide reveals a precise documentation gap.",
    question: "Which element prevents an ambiguous maintenance close?",
    answers: ["Explicit success and stop criteria", "A longer document title", "More screenshots alone"],
    explanation: "Success and stop criteria tell engineers whether to proceed, pause, escalate, or roll back.",
  },
  "Troubleshooting methodology": {
    simpleTitle: "Troubleshooting is structured evidence gathering",
    simple: "Start with the symptom and scope, establish what changed, form hypotheses, test the safest discriminating checks, and update confidence as evidence arrives.",
    technical: "A strong method separates observation from inference, prioritizes reversible tests, controls confirmation bias, preserves timelines, and defines escalation thresholds.",
    tip: "Choose the next check for how well it distinguishes between hypotheses, not because it is familiar.",
    visual: ["Observed symptom", "Evidence tests", "Supported cause"],
    checks: ["Define symptom and scope", "Establish timeline and baseline", "Rank competing hypotheses", "Select discriminating checks"],
    walkthrough: ["State the problem", "Collect known facts", "List plausible causes", "Choose a safe test", "Update confidence", "Resolve or escalate"],
    example: "Rising correctables could reflect ingress, a connector, a profile, or monitoring. Comparing modem distribution and SNR helps distinguish them.",
    question: "What is the best next diagnostic check?",
    answers: ["One that separates competing hypotheses", "The longest available test", "The test used in every incident"],
    explanation: "Useful checks reduce uncertainty by producing different expected outcomes for competing hypotheses.",
  },
  "Escalation practices": {
    simpleTitle: "Escalation brings the right expertise in with usable evidence",
    simple: "Escalate when impact, risk, uncertainty, authority, or time thresholds require help. A good escalation clearly states the symptom, scope, evidence, actions, and decision needed.",
    technical: "Effective escalation packages include timeline, topology, customer or service impact, KPI evidence, hypotheses, completed checks, configuration-change context, artifacts, and explicit ownership.",
    tip: "Escalation is not failure; vague escalation is. State exactly what expertise or decision is required.",
    visual: ["NOC evidence", "Senior review", "Decision & ownership"],
    checks: ["Confirm escalation threshold", "Summarize impact and scope", "Attach evidence and completed checks", "State the requested decision"],
    walkthrough: ["Assess impact and risk", "Review runbook thresholds", "Prepare concise evidence", "Identify receiving role", "Transfer ownership clearly", "Record the outcome"],
    example: "Uncorrectables begin rising across multiple service groups. The NOC escalates with timeline, affected assets, RF trends, completed checks, and the requested plant-engineering decision.",
    question: "What makes an escalation actionable?",
    answers: ["Evidence, scope, and a clear request", "A message saying only 'please investigate'", "Assigning it to every team"],
    explanation: "The receiving engineer needs context, evidence, and a clear decision or action request.",
  },
};

function LearningPage() {
  const topics = Object.keys(learningTopics);
  const modes = ["Explain Simply", "Technical Detail", "Walk Me Through It", "Test My Knowledge", "Show an Example"];
  const [topic, setTopic] = useState(topics[0]);
  const [mode, setMode] = useState(modes[0]);
  const [search, setSearch] = useState("");
  const lesson = learningTopics[topic];
  const filteredTopics = topics.filter((item) => item.toLowerCase().includes(search.toLowerCase()));
  return (
    <Page title="Engineer Learning Centre" subtitle="Private, educational access to senior-level concepts without employee scoring." icon={GraduationCap}>
      <div className="learning-layout">
        <Panel><SearchBox value={search} onChange={setSearch} placeholder="Search learning topics" /><div className="topic-list">{filteredTopics.map((t) => <button className={topic === t ? "selected" : ""} onClick={() => setTopic(t)} key={t}><BookOpen size={16} />{t}</button>)}</div></Panel>
        <Panel className="lesson">
          <div className="lesson-head"><div><div className="eyebrow">Network learning path</div><h2>{topic}</h2></div><Badge tone="green">Private learning</Badge></div>
          <Tabs tabs={modes} active={mode} onChange={setMode} />
          {mode === "Explain Simply" && <><h3>{lesson.simpleTitle}</h3><p>{lesson.simple}</p><ConceptVisual labels={lesson.visual} /><Callout tone="info" title="Senior engineer tip">{lesson.tip}</Callout></>}
          {mode === "Technical Detail" && <><h3>Engineering view</h3><p>{lesson.technical}</p><Checklist items={lesson.checks} /></>}
          {mode === "Walk Me Through It" && <Timeline items={lesson.walkthrough} />}
          {mode === "Test My Knowledge" && <KnowledgeCheck key={topic} topic={lesson} />}
          {mode === "Show an Example" && <Callout tone="success" title="Synthetic example">{lesson.example}</Callout>}
        </Panel>
      </div>
    </Page>
  );
}

function KnowledgePage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const filtered = knowledge.filter((d) => (status === "All" || d.status === status) && `${d.id} ${d.title} ${d.type}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <Page title="Knowledge Library" subtitle="Search synthetic procedures, standards, release notes, incidents, and training content." icon={Library}>
      <div className="filter-bar"><SearchBox value={search} onChange={setSearch} placeholder="Search by ID, title, or type" /><select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by approval status"><option>All</option><option>Approved</option><option>Under review</option><option>Superseded</option><option>Archived</option></select></div>
      {status === "Superseded" && <Callout tone="warning" title="Superseded content warning">NOC Copilot prioritizes the current approved source and discloses when older guidance is shown.</Callout>}
      <div className="knowledge-table">
        <div className="table-head"><span>Document</span><span>Type</span><span>Version</span><span>Status</span><span>Owner</span><span>Confidence</span></div>
        {filtered.map((doc) => <div className="table-row" key={doc.id}><span><b>{doc.id}</b><small>{doc.title}</small></span><span>{doc.type}</span><span>{doc.version}</span><span><Badge tone={doc.status === "Approved" ? "green" : doc.status === "Superseded" ? "amber" : "default"}>{doc.status}</Badge></span><span>{doc.owner}</span><span>{doc.confidence}%</span></div>)}
      </div>
    </Page>
  );
}

function InsightsPage() {
  const adoption = [{ name: "Teams", value: 46 }, { name: "Workspace", value: 38 }, { name: "Mobile", value: 16 }];
  const colours = ["#22d3ee", "#8b5cf6", "#10b981"];
  return (
    <Page title="Operational Insights" subtitle="Aggregated simulated adoption, productivity, knowledge quality, and engineering outcomes." icon={BarChart3}>
      <DemoNotice text="All metrics are simulated and aggregated. No individual engineer rankings or performance scoring are shown." />
      <div className="kpi-grid">{kpis.slice(0, 6).map(([v, l, d]) => <KpiCard key={l} value={v} label={l} detail={d} />)}</div>
      <div className="dashboard-grid section-gap">
        <Panel className="wide"><SectionTitle eyebrow="Productivity trend" title="Estimated time returned" compact /><ResponsiveContainer width="100%" height={260}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="var(--line)" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="correctables" name="Hours returned" fill="#22d3ee" radius={[5,5,0,0]} /></BarChart></ResponsiveContainer></Panel>
        <Panel><SectionTitle eyebrow="Adoption channels" title="Where engineers engage" compact /><ResponsiveContainer width="100%" height={210}><PieChart><Pie data={adoption} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82}>{adoption.map((_, i) => <Cell key={i} fill={colours[i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="legend">{adoption.map((a, i) => <span key={a.name}><i style={{background: colours[i]}} />{a.name} {a.value}%</span>)}</div></Panel>
      </div>
      <div className="four-col section-gap">{[
        ["Knowledge usage", ["8,420 questions", "6,912 approved sources used", "43 superseded warnings", "118 unanswered questions"]],
        ["Knowledge quality", ["186 approved procedures", "24 overdue for review", "37 proposed updates", "8 conflicting-source flags"]],
        ["Engineering outcomes", ["74% self-service resolution", "326 review requests", "214 upgrade plans", "481 troubleshooting summaries"]],
        ["Adoption", ["46% Teams usage", "38% workspace usage", "16% mobile usage", "82% return usage"]],
      ].map(([title, values]) => <Panel key={String(title)}><h3>{String(title)}</h3><Checklist items={values as string[]} /></Panel>)}</div>
    </Page>
  );
}

function RoiPage() {
  const [scenario, setScenario] = useState<ROIScenario>({ engineers: 250, questions: 8, searchMinutes: 24, searchReduction: 62, upgrades: 180, upgradeHours: 12, upgradeReduction: 35, cases: 2400, caseHours: 2.5, caseReduction: 30, escalationRate: 28, escalationReduction: 20, newEngineers: 45, onboardingHours: 240, onboardingReduction: 41, hourlyCost: 92, operatingCost: 420000, investment: 850000 });
  const annualQuestions = scenario.engineers * scenario.questions * 52;
  const searchHours = annualQuestions * (scenario.searchMinutes / 60) * (scenario.searchReduction / 100);
  const upgradeHours = scenario.upgrades * scenario.upgradeHours * (scenario.upgradeReduction / 100);
  const caseHours = scenario.cases * scenario.caseHours * (scenario.caseReduction / 100);
  const escalationHours = scenario.cases * (scenario.escalationRate / 100) * (scenario.escalationReduction / 100) * 3;
  const totalHours = searchHours + upgradeHours + caseHours + escalationHours;
  const onboarding = scenario.newEngineers * scenario.onboardingHours * (scenario.onboardingReduction / 100) * scenario.hourlyCost;
  const gross = totalHours * scenario.hourlyCost + onboarding;
  const net = gross - scenario.operatingCost;
  const roi = net / scenario.investment * 100;
  const fields: [keyof ROIScenario, string][] = [["engineers","NOC & network engineers"],["questions","Questions / engineer / week"],["searchMinutes","Baseline search minutes"],["searchReduction","Search-time reduction %"],["upgrades","Annual upgrade events"],["upgradeHours","Preparation hours / upgrade"],["cases","Annual troubleshooting cases"],["caseHours","Preparation hours / case"],["hourlyCost","Loaded hourly cost"],["operatingCost","Annual platform cost"],["investment","Implementation investment"]];
  return (
    <Page title="Value & ROI" subtitle="Edit illustrative assumptions and compare productivity-value scenarios." icon={Zap}>
      <DemoNotice text="All assumptions, calculations, and financial values are illustrative and not guaranteed or committed." />
      <div className="roi-layout">
        <Panel><SectionTitle eyebrow="Editable assumptions" title="Base scenario" compact /><div className="input-grid">{fields.map(([key, label]) => <label key={key}>{label}<input type="number" value={scenario[key]} onChange={(e) => setScenario({...scenario, [key]: Number(e.target.value)})} /></label>)}</div></Panel>
        <div>
          <div className="roi-results"><KpiCard value={Math.round(totalHours).toLocaleString()} label="Engineering hours returned" detail="Illustrative annual" /><KpiCard value={`$${(gross/1e6).toFixed(2)}M`} label="Estimated gross value" detail="Productivity + onboarding" /><KpiCard value={`$${(net/1e6).toFixed(2)}M`} label="Net estimated value" detail="After operating cost" /><KpiCard value={`${roi.toFixed(0)}%`} label="Illustrative ROI" detail={`${Math.max(1, scenario.investment / Math.max(1, net / 12)).toFixed(1)} month payback`} /></div>
          <Panel className="top-gap"><SectionTitle eyebrow="Scenario range" title="Conservative · Base · Upside" compact /><div className="scenario-bars"><Progress label="Conservative" value={Math.min(100, roi * .65)} /><Progress label="Base" value={Math.min(100, roi)} /><Progress label="Upside" value={Math.min(100, roi * 1.28)} /></div></Panel>
        </div>
      </div>
      <InlineDisclaimer />
    </Page>
  );
}

function ArchitecturePage() {
  const layers = [
    ["Engineer experience", ["Microsoft Teams", "Microsoft 365 Copilot", "NOC Copilot web", "Mobile field view", "Power BI"], Users],
    ["Copilot & agents", ["Microsoft Foundry", "Azure OpenAI", "Supervisor", "Specialist agents", "Human review"], BrainCircuit],
    ["Knowledge grounding", ["Azure AI Search", "Foundry IQ", "SharePoint", "MOPs & runbooks", "Standards & incidents"], Database],
    ["Data foundation", ["Microsoft Fabric", "OneLake", "Real-Time Intelligence", "Semantic models", "Data lineage"], Layers3],
    ["Enterprise integration", ["API Management", "Azure Functions", "Logic Apps", "Secure APIs", "Batch interfaces"], Settings2],
    ["Security & governance", ["Microsoft Entra ID", "Purview", "Key Vault", "Azure Monitor", "RBAC & audit"], ShieldCheck],
  ] as const;
  return (
    <Page title="Proposed Microsoft Architecture" subtitle="Conceptual architecture connecting engineer experiences to governed network knowledge." icon={Cloud}>
      <DemoNotice text="All integrations are conceptual. The demonstration has no live Microsoft, Rogers, vendor, network, or production-system connections." />
      <div className="architecture-flow">{layers.map(([title, items, Icon], i) => <div className="architecture-layer" key={title}><span className="layer-number">0{i+1}</span><div className="layer-icon"><Icon /></div><div><h3>{title}</h3><div className="architecture-tags">{items.map((item) => <span key={item}>{item}</span>)}</div></div>{i < layers.length - 1 && <ChevronRight className="layer-arrow" />}</div>)}</div>
      <Panel className="top-gap"><SectionTitle eyebrow="Conceptual request flow" title="Grounded guidance with human authority" compact /><div className="flow-line">{["Engineer question", "Supervisor", "Equipment context", "Approved retrieval", "Specialist analysis", "Currency check", "Grounded response", "Human review"].map((s, i) => <div key={s}><span>{i+1}</span><b>{s}</b>{i < 7 && <ArrowRight />}</div>)}</div></Panel>
      <AgentTeam />
      <InlineDisclaimer />
    </Page>
  );
}

function GovernancePage() {
  const principles = [
    "Qualified engineers make operational decisions.", "NOC Copilot does not execute network changes.", "NOC Copilot does not approve MOPs or runbooks.", "Every technical answer identifies supporting sources.", "Approved and current sources are preferred.", "Conflicting guidance and missing evidence are disclosed.", "Low-confidence answers recommend senior review.", "Generated configuration remains non-deployable.", "Source-level permissions are preserved.", "Feedback is not used for employee performance scoring.", "Every documentation proposal is auditable.", "Vendor content requires appropriate licensing and access.",
  ];
  const authority = [["Retrieve","Find authorized knowledge"],["Explain","Summarize equipment, concepts, procedures, and KPIs"],["Compare","Compare releases, standards, and synthetic configurations"],["Recommend","Suggest checks and review actions"],["Draft","Prepare non-approved content"],["Review","Qualified engineer validates and edits"],["Approve","Existing governance approves outside Copilot"],["Execute","Qualified engineers use existing operational systems"]];
  return (
    <Page title="Governance & Controls" subtitle="Clear authority boundaries, source controls, human review, and auditable knowledge lifecycle." icon={ShieldCheck}>
      <DemoNotice />
      <div className="governance-grid">{[
        ["Identity & access", "Role, access scope, classification, source permissions", "Enforced conceptually"],
        ["Source quality", "Version, approval, freshness, superseded status", "Monitored"],
        ["Response quality", "Confidence, citations, conflict disclosure", "Visible"],
        ["Human authority", "Review, approval, rejection, audit history", "Required"],
      ].map(([title, text, state]) => <Panel key={title}><Badge tone="green">{state}</Badge><h3>{title}</h3><p>{text}</p></Panel>)}</div>
      <div className="two-col section-gap">
        <Panel><SectionTitle eyebrow="Responsible operation" title="Operating principles" compact /><ol className="principle-list">{principles.map((p, i) => <li key={p}><span>{i+1}</span>{p}</li>)}</ol></Panel>
        <Panel><SectionTitle eyebrow="Authority model" title="From retrieval to execution" compact /><div className="authority-list">{authority.map(([name, desc], i) => <div className={i > 4 ? "human" : ""} key={name}><span>{i+1}</span><div><b>{name}</b><small>{desc}</small></div>{i > 4 && <Badge tone="amber">Human authority</Badge>}</div>)}</div></Panel>
      </div>
      <Panel className="top-gap"><SectionTitle eyebrow="Synthetic audit trail" title="Recent governed activity" compact /><div className="audit-list">{[["12:04","Answer generated","3 approved sources · 96% confidence"],["11:48","MOP update drafted","Awaiting CMTS Engineering review"],["11:31","Superseded source blocked","MOP-CMTS-038 replaced by MOP-CMTS-042"],["10:56","Configuration analysis saved","Synthetic · non-deployable · review required"]].map(([time,event,detail]) => <div key={time}><time>{time}</time><span className="status-dot" /><div><b>{event}</b><small>{detail}</small></div></div>)}</div></Panel>
      <InlineDisclaimer />
    </Page>
  );
}

function ExecutiveOverview({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing || index === null) return;
    const timer = window.setInterval(() => setIndex((value) => value === null ? 0 : value >= executiveSteps.length - 1 ? 0 : value + 1), 5000);
    return () => window.clearInterval(timer);
  }, [playing, index]);
  const openStep = (i: number) => { setIndex(i); setCompleted((c) => c.includes(i) ? c : [...c, i]); };
  const goToPage = () => { if (index !== null) { navigate(executiveSteps[index].path); onClose(); } };
  return (
    <div className="modal executive-modal" role="dialog" aria-modal="true" aria-label="Executive Demo Overview">
      <div className="executive-header"><div><div className="eyebrow"><Sparkles size={14} /> Executive Demo Overview</div><h2>{index === null ? "NOC Copilot story" : `Step ${executiveSteps[index].number} of ${executiveSteps.length}`}</h2></div><div className="button-row"><button className="button subtle" onClick={() => { setIndex(0); setCompleted([]); setPlaying(false); }}><RefreshCw size={15} /> Restart</button><button className="icon-button" onClick={onClose}><X /></button></div></div>
      {index === null ? <div className="executive-body"><div className="executive-intro"><h1>Make senior network engineering knowledge available to every engineer.</h1><p>Select any step or start a guided demonstration.</p><button className="button primary" onClick={() => openStep(0)}><Play size={16} /> Start guided demo</button></div><div className="tile-grid">{executiveSteps.map((step, i) => <button className="demo-tile" key={step.number} onClick={() => openStep(i)}><span className="step-number">{String(step.number).padStart(2,"0")}</span>{completed.includes(i) && <CheckCircle2 className="completed" />}<h3>{step.title}</h3><p>{step.message}</p><span>Open step <ArrowRight size={15} /></span></button>)}</div></div> :
        <div className="guided-step">
          <div className="guided-visual"><span className="giant-number">{String(executiveSteps[index].number).padStart(2,"0")}</span><div className="network-orb"><Network size={60} /></div></div>
          <div className="guided-copy"><div className="eyebrow">Executive message</div><h1>{executiveSteps[index].title}</h1><p>{executiveSteps[index].message}</p>{index === executiveSteps.length - 1 && <h2>Ask. Understand. Troubleshoot. Prepare. Review. Learn.</h2>}<button className="button primary" onClick={goToPage}>Open relevant workspace <ArrowRight size={16} /></button><p className="inline-disclaimer">{disclaimer}</p></div>
        </div>}
      <div className="executive-controls">
        <button className="button subtle" disabled={index === null || index === 0} onClick={() => setIndex((i) => i === null ? 0 : Math.max(0, i - 1))}><ArrowLeft size={16} /> Previous</button>
        <button className="button subtle" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? "Pause" : "Auto Play"}</button>
        <button className="button subtle" onClick={() => { setIndex(null); setPlaying(false); }}>Return to Tiles</button>
        <button className="button primary" disabled={index === null || index === executiveSteps.length - 1} onClick={() => setIndex((i) => i === null ? 0 : Math.min(executiveSteps.length - 1, i + 1))}>Next <ArrowRight size={16} /></button>
      </div>
    </div>
  );
}

function TeamsModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(true);
  return <div className="modal-overlay"><div className="teams-modal" role="dialog" aria-modal="true" aria-label="Simulated Microsoft Teams"><aside><div className="teams-logo">T</div>{[Activity, MessageSquare, Users, Building2].map((Icon, i) => <Icon key={i} />)}</aside><div className="teams-list"><h3>NOC Engineering</h3><b>Recent conversations</b><button className="active">NOC Copilot</button><button>CMTS Engineering</button><button>Shift handover</button><span>Synthetic Teams simulation</span></div><main><header><div><b>NOC Copilot</b><span>On-demand network engineering assistant</span></div><button className="icon-button" onClick={onClose}><X /></button></header><div className="teams-chat"><div className="engineer-message"><b>Engineer</b><p>Show me the MOP for upgrading TOR-CMTS-145 to Release 7.5.</p></div>{sent && <div className="copilot-message"><div className="copilot-avatar"><Sparkles size={18} /></div><div><b>NOC Copilot</b><p>I found MOP-CMTS-042 version 3.2 for the NX-9000 platform. The procedure applies to TOR-CMTS-145, currently running Release 7.4.2.</p><p>Before using it, review one documentation gap: Technical Service Guide TSG-NX9000-7.5 adds a mandatory upstream-profile validation step that is not present in the current MOP.</p><div className="teams-actions">{["Open MOP","Compare Releases","Review Documentation Gap","Prepare Upgrade Checklist","Draft MOP Update","View Equipment"].map((a) => <button key={a}>{a}</button>)}</div><SourceCard id="MOP-CMTS-042" title="NX-9000 Release 7.5 Upgrade Method" status="Approved" /></div></div>}</div><div className="teams-compose"><input defaultValue="Show me the MOP for upgrading TOR-CMTS-145 to Release 7.5." aria-label="Teams message" /><button onClick={() => setSent(true)}><ArrowRight /></button></div><p className="inline-disclaimer">{disclaimer}</p></main></div></div>;
}

function Page({ title, subtitle, icon: Icon, children }: { title: string; subtitle: string; icon: typeof Network; children: ReactNode }) {
  return <><div className="page-header"><span className="page-icon"><Icon /></span><div><h1>{title}</h1><p>{subtitle}</p></div></div>{children}</>;
}
function Panel({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`panel ${className}`}>{children}</section>; }
function Badge({ children, tone = "default" }: { children: ReactNode; tone?: string }) { return <span className={`badge ${tone}`}>{children}</span>; }
function SectionTitle({ eyebrow, title, action, compact = false }: { eyebrow: string; title: string; action?: ReactNode; compact?: boolean }) { return <div className={`section-title ${compact ? "compact" : ""}`}><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2></div>{action}</div>; }
function KpiCard({ value, label, detail }: { value: string; label: string; detail: string }) { return <div className="kpi-card"><span className="sim-label">SIMULATED</span><strong>{value}</strong><p>{label}</p><small>{detail}</small></div>; }
function DataPoint({ label, value }: { label: string; value: string }) { return <div className="data-point"><small>{label}</small><b>{value}</b></div>; }
function Callout({ tone, title, children }: { tone: string; title: string; children: ReactNode }) { return <div className={`callout ${tone}`}>{tone === "warning" ? <AlertTriangle /> : tone === "success" ? <CheckCircle2 /> : <Info />}<div><b>{title}</b><p>{children}</p></div></div>; }
function DemoNotice({ text = disclaimer }: { text?: string }) { return <div className="demo-notice"><Info size={17} /><span>{text}</span></div>; }
function InlineDisclaimer() { return <p className="inline-disclaimer">{disclaimer}</p>; }
function SourceCard({ id, title, status }: { id: string; title: string; status: string }) { return <button className="source-card"><FileSearch size={18} /><span><b>{id}</b><small>{title}</small></span><Badge tone="green">{status}</Badge></button>; }
function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) { return <label className="search-box"><Search size={17} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></label>; }
function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (tab: string) => void }) { return <div className="tabs">{tabs.map((tab) => <button key={tab} onClick={() => onChange(tab)} className={active === tab ? "active" : ""}>{tab}</button>)}</div>; }
function Checklist({ items, warning = false }: { items: string[]; warning?: boolean }) { return <ul className="checklist">{items.map((item) => <li key={item}>{warning ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}<span>{item}</span></li>)}</ul>; }
function Timeline({ items, warningAt = -1 }: { items: string[]; warningAt?: number }) { return <div className="timeline">{items.map((item, i) => <div key={item} className={i === warningAt ? "warning" : ""}><span>{i + 1}</span><b>{item}</b>{i === warningAt && <Badge tone="amber">New validation</Badge>}</div>)}</div>; }
function Progress({ label, value }: { label: string; value: number }) { return <div className="progress"><div><span>{label}</span><b>{Math.round(value)}%</b></div><div className="progress-track"><i style={{width: `${Math.min(100, value)}%`}} /></div></div>; }
function TagList({ items }: { items: string[] }) { return <div className="tag-list">{items.map((item) => <span key={item}>{item}</span>)}</div>; }
function Confidence({ value }: { value: number }) { return <div className="confidence"><CircleGauge /><div><b>{value}%</b><small>Confidence</small></div></div>; }
function ActivityList() { return <div className="activity-list">{[["MOP-CMTS-042","Validation gap detected","8 min ago"],["TSG-NX9000-7.5","New guide indexed","2 hours ago"],["RB-DOCSIS-014","Reviewed by Access Reliability","Yesterday"],["STD-DOCSIS-019","Configuration comparison saved","Yesterday"]].map(([id,event,time]) => <div key={id}><span className="status-dot" /><div><b>{event}</b><small>{id}</small></div><time>{time}</time></div>)}</div>; }
function ConceptVisual({ labels }: { labels: [string, string, string] }) { return <div className="concept-visual"><div className="home-node">{labels[0]}</div><div className="channel-lines"><i/><i/><i/></div><div className="hub-node"><Network /> {labels[1]}</div><div className="channel-lines"><i/><i/></div><div className="cloud-node">{labels[2]}</div></div>; }
function KnowledgeCheck({ topic }: { topic: LearningTopic }) { const [selected, setSelected] = useState(""); return <div className="knowledge-check"><h3>{topic.question}</h3>{topic.answers.map((answer, i) => <button className={selected === answer ? (i === 0 ? "correct" : "incorrect") : ""} onClick={() => setSelected(answer)} key={answer}>{answer}{selected === answer && (i === 0 ? <Check /> : <X />)}</button>)}{selected && <p>{selected === topic.answers[0] ? `Correct. ${topic.explanation}` : `Not quite. ${topic.explanation}`}</p>}</div>; }
function AgentTeam() { return <><SectionTitle eyebrow="Six understandable agents" title="Specialists coordinated by a supervisor" /><div className="agent-grid">{agents.map(([name, task, output, confidence]) => <Panel key={name}><div className="agent-head"><span><Bot /></span><Badge tone="green">Ready</Badge></div><h3>{name}</h3><p>{task}</p><div className="agent-meta"><DataPoint label="Output" value={output} /><DataPoint label="Confidence" value={confidence} /></div></Panel>)}</div></>; }

export default App;
