# NOC Copilot

**Copilot for Every Network Engineer**

NOC Copilot is a polished, interactive concept demonstration showing how trusted network-engineering knowledge can become fast, contextual, explainable, and governed guidance. It combines a dedicated web workspace, a simulated Microsoft Teams experience, synthetic network assets, procedures, release notes, configurations, KPIs, and operational scenarios.

> NOC Copilot is **not autonomous network operations**. It does not detect outages autonomously, execute changes, remediate incidents, modify production systems, approve procedures, or replace qualified engineers.

## Business problem

Network engineers often search across MOPs, runbooks, service guides, release notes, configurations, tickets, portals, and the experience of senior engineers. NOC Copilot demonstrates a governed way to retrieve current approved knowledge, explain why it applies, disclose gaps and conflicts, and prepare reviewable work products.

## Target users

- NOC engineers, escalation engineers, shift supervisors, and incident managers
- DOCSIS, CMTS, fibre, transport, IP, wireless, reliability, and capacity teams
- Network operations, engineering, service-assurance, and transformation leaders

## Agent roles

The demonstration presents six understandable agents: NOC Copilot Supervisor, Network Knowledge Agent, MOP and Runbook Agent, Configuration Agent, Troubleshooting Agent, and KPI and Capacity Agent. Agent activity is secondary to the answer and all consequential actions remain subject to human review.

## Primary scenario

The primary journey follows fictional CCAP `TOR-CMTS-145`, currently on Release 7.4.2 and preparing for Release 7.5.0. NOC Copilot finds synthetic `MOP-CMTS-042`, compares it with `TSG-NX9000-7.5`, detects a missing mandatory upstream-profile validation, and drafts a governed update for engineering review.

## Application sections

- Home and Ask NOC Copilot
- Equipment Explorer
- MOP and Upgrade Workspace
- Runbook Intelligence
- Configuration Assistant
- Troubleshooting Assistant
- KPI and Capacity Assistant
- Engineer Learning Centre
- Knowledge Library
- Operational Insights
- Value and ROI
- Proposed Microsoft Architecture
- Governance and Controls

## Executive Demo Overview

Use the prominent **Executive Demo Overview** button in the header. Select any tile or start the guided sequence. Previous, Next, Auto Play, Pause, Restart, Return to Tiles, and direct workspace navigation are supported.

## Simulated Teams experience

Use **Simulated Teams** in the header to open a Teams-style conversation around the primary CMTS upgrade. The interface is entirely local and has no Microsoft Teams integration.

## Local installation

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

## Repository structure

```text
src/
  App.tsx       Application routes, workspaces, and interactions
  data.ts       Stable synthetic demonstration data
  types.ts      Strong TypeScript domain interfaces
  styles.css    Responsive light/dark visual system
  main.tsx      React entry point
staticwebapp.config.json
```

## Azure Static Web Apps deployment

1. Create an Azure Static Web App connected to this GitHub repository.
2. Use `npm run build` as the build command.
3. Set the application location to `/` and output location to `dist`.
4. Keep `staticwebapp.config.json` in the repository root. Its navigation fallback supports direct route navigation and browser refresh.
5. No API location, secrets, API keys, or backend are required.

## Architecture summary

The conceptual production architecture uses Microsoft Teams, Microsoft 365 Copilot, a dedicated web experience, Microsoft Foundry, Azure OpenAI, Azure AI Search, SharePoint, Microsoft Fabric, OneLake, Power BI, Azure integration services, Microsoft Entra ID, Purview, Key Vault, Azure Monitor, and human approval workflows. None of these integrations are live in this demonstration.

## Governance principles

- Qualified engineers retain operational decision, review, approval, and execution authority.
- Answers identify supporting sources and prefer current approved knowledge.
- Superseded, conflicting, stale, restricted, or missing evidence is disclosed.
- Generated configurations remain fictional and non-deployable.
- Draft procedures and checklists remain unapproved until external engineering governance approves them.
- No individual employee ranking or performance scoring is included.

## Production integration requirements

A production implementation would require identity and role design, source-level authorization, approved API contracts, content lifecycle controls, audit and observability, agent evaluation, data-loss prevention, network-security review, ITSM and change-management integration, production support, and formal operational acceptance.

## Knowledge-ingestion considerations

Production ingestion should preserve source ownership, classification, permissions, version, effective date, approval state, supersession, review dates, lineage, and deletion/retention rules. Retrieval evaluation should test source currency, citation completeness, conflicts, and abstention when evidence is insufficient.

## Vendor-document licensing

Vendor manuals, service guides, release notes, and support content may only be ingested and used when licensing, contractual rights, and source permissions explicitly permit it. This repository includes no licensed vendor documentation.

## Recommended production next steps

1. Establish a small set of approved use cases and source systems.
2. Define authority, review, access, and knowledge-lifecycle controls.
3. Build an evaluation set using authorized, non-sensitive engineering questions.
4. Pilot read-only retrieval and explanation before drafting workflows.
5. Validate security, privacy, licensing, safety, and operational support requirements.

## Synthetic-data disclaimer

Concept demonstration using synthetic network assets, configurations, alarms, procedures, technical guides, release notes, incidents, and operational data. Answers, procedures, runbook updates, configuration guidance, and business values are illustrative and do not represent live Rogers systems, approved Rogers procedures, vendor instructions, production configurations, or guaranteed outcomes.
