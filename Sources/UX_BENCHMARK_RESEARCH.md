---
title: "Project Governance & Meeting Accountability System — UX Benchmark Research"
document_type: "Competitive / Analogous Product Benchmark"
language: "English"
status: "Research synthesis"
version: "1.0"
last_reviewed: "2026-09-05"
researcher_role: "Senior UX Researcher"
primary_platforms:
  - Notion
  - Confluence
  - Asana
  - monday.com
  - Fellow
  - Jira
  - Linear
  - Slack
tags:
  - ux-research
  - benchmark
  - project-management
  - meeting-notes
  - approvals
  - dependencies
  - audit-trail
  - project-health
  - ai-meeting-notes
---

# UX Benchmark Research
## Project Governance & Meeting Accountability System

> **Research objective:** Identify proven interaction and information-architecture patterns that can inform a governance-focused product combining project status, meeting documentation, decisions, action items, dependencies, approvals/signatures, and historical traceability.

---

## 1. Executive Summary

No single benchmark product exactly matches the target product.

The closest mental model is a combination of:

```text
Notion / Confluence
for meeting + project context and documentation

Asana / Jira / Linear
for actions, dependencies, workflow, approvals, and status

monday.com
for project/portfolio health and dashboard visibility

Fellow / Slack AI meeting notes
for meeting capture, summaries, decisions, and action extraction
```

The target product is differentiated by its stronger **governance and evidence model**:

```text
Meeting
→ Decision
→ Action
→ Dependency
→ Project Update
→ Participant Signature
→ Audit History
→ Final CEO Approval
```

Most benchmark products solve only part of this chain.

---

## 2. Research Questions

This benchmark was conducted to answer:

1. How do established products connect projects, meetings, notes, and tasks?
2. How do they model decisions separately from narrative notes?
3. How do they represent ownership and deadlines?
4. How do they show `Blocked by / Blocking` relationships?
5. How do approval workflows work?
6. How are project health and progress summarized?
7. How is historical context preserved?
8. How do meeting-focused products convert conversations into actions?
9. Which patterns are appropriate for a PM/PO-operated governance tool?
10. Which patterns should **not** be copied because they conflict with the project model?

---

## 3. Method

### Research type
Desk research / analogous-product benchmark.

### Evidence priority
1. Official help/documentation
2. Official product pages
3. Official templates/guides
4. Product-design inference derived from documented behavior

### Evaluation dimensions

| Dimension | What was evaluated |
|---|---|
| Project structure | How a project is represented and organized |
| Meeting documentation | How meeting context is captured |
| Decisions | Whether decisions are first-class or buried in notes |
| Action items | Ownership, due dates, status |
| Dependencies | Blocking / blocked relationships |
| Approvals | Approval states and approver UX |
| Project health | Status, risk, milestone, progress |
| History | Change/activity/update chronology |
| Reviewer UX | Lightweight stakeholder review |
| AI meeting support | Recording, summary, decision/action extraction |
| Fit | Relevance to the target product |

---

# 4. Benchmark Overview

| Platform | Primary benchmark value | Fit |
|---|---|---:|
| **Notion** | Relational IA: Projects ↔ Meeting Notes ↔ Tasks/Docs | 5/5 |
| **Confluence** | Structured meeting minutes, decisions, action items, knowledge history | 5/5 |
| **Asana** | Action ownership, due dates, dependencies, approvals | 4.5/5 |
| **monday.com** | Project dashboard, portfolio health, risk/progress visibility | 4.5/5 |
| **Fellow** | Meeting recap, decisions, AI action extraction, cross-meeting continuity | 4.5/5 |
| **Jira** | Workflow, approval states, linked work, dependency visibility | 4/5 |
| **Linear** | Project overview, health updates, milestones, dependencies, activity | 4/5 |
| **Slack** | Lightweight meeting notes/canvas and AI huddle recap | 2.5/5 |

---

# 5. Notion

## Why it matters

Notion is one of the strongest IA references for the target product because it explicitly supports connecting:

- Projects
- Tasks
- Meeting Notes
- Related documents

through database relations.

Official Notion guidance describes connecting a Projects database with Tasks and Meeting Notes so associated information can be found from one project context.

## Patterns to study

### A. Relational project context
Notion lets separate databases remain independent while still being connected.

**Relevant target pattern**

```text
Project
↔ Meetings
↔ Decisions
↔ Actions
↔ Documents
```

### B. Meeting notes as historical project context
Notion recommends linking notes/docs to projects so teams can later understand why a decision was made.

### C. Two-way relations
Notion supports database relations that can be reciprocal.

Useful for:

```text
Project → Meeting
Meeting → Project

Decision → Action
Action → Decision
```

### D. AI meeting notes
Notion AI Meeting Notes can create meeting summaries and connect notes to project/task databases.

This is highly relevant to the target product's future “Meeting Assistant” integration.

## What to borrow

- Project-centric relational architecture
- contextual links between structured entities
- ability to open historical meeting context from a project
- related-record sections
- human-readable page + structured database hybrid
- future AI draft → structured record model

## What not to copy

Notion is deliberately flexible and generic.

The target product needs stronger product rules for:
- mandatory approval/signature;
- authoritative meeting records;
- project lifecycle;
- closure;
- audit history;
- explicit accountability.

Do not expose Notion-level configurability in the MVP unless required.

## Implication for our product

**Strongest IA reference.**

Use Notion to study **how context is connected**, not how governance should work.

## Official sources

- A guide to connecting projects and meeting notes  
  https://www.notion.com/help/guides/a-guide-to-connecting-projects-and-meeting-notes
- Database relations & rollups  
  https://www.notion.com/help/relations-and-rollups
- Preserve perfect meeting memory with AI Meeting Notes  
  https://www.notion.com/help/guides/preserve-perfect-meeting-memory-with-ai-meeting-notes
- Product teams: connect notes/docs to projects  
  https://www.notion.com/help/guides/product-teams-nail-cross-functional-collaboration-with-these-notes-and-docs

---

# 6. Confluence

## Why it matters

Confluence is one of the strongest references for the **meeting-documentation layer**.

Its official meeting-minutes guidance explicitly includes:

- date and time;
- attendees;
- agenda;
- discussion summaries;
- decisions;
- action items;
- owners;
- deadlines.

Confluence also supports recording decisions as dedicated elements in meeting notes.

## Patterns to study

### A. Structured meeting minutes
Meeting notes are not just free text; they are organized around repeatable meeting outcomes.

### B. Decision capture
The `/decision` pattern makes decisions visible instead of burying them in paragraphs.

### C. Action items inside meeting context
Confluence supports action items created directly in meeting notes.

### D. Central archive
Consistent meeting documentation creates a searchable historical knowledge base.

### E. Context linking
Meeting notes can connect to the related project/pages.

## What to borrow

- meeting-detail content hierarchy;
- explicit sections for discussion, decisions, and actions;
- decision prominence;
- consistent meeting template;
- historical project knowledge;
- central location rather than scattered files.

## What not to copy

Confluence remains documentation-first.

The target product must go further by:
- modeling dependencies;
- showing project health;
- tracking approval/signature;
- maintaining governed project state;
- treating action/decision records as cross-project structured data.

## Implication for our product

**Strongest content-structure benchmark for Meeting Detail.**

Confluence is especially valuable when designing:
- Meeting Create/Edit;
- Meeting Summary;
- Decisions;
- Action Items;
- Meeting History.

## Official sources

- Meeting Minutes Template  
  https://www.atlassian.com/software/confluence/templates/meeting-notes
- Weekly Meeting Notes Template  
  https://www.atlassian.com/software/confluence/templates/weekly-meeting-notes

---

# 7. Asana

## Why it matters

Asana is a strong reference for converting meeting follow-up into explicit work.

Its dependency model clearly distinguishes:

- `Blocked by`
- `Blocking`

and can represent one-to-many or many-to-one dependency relationships.

Asana also provides a dedicated Approval task type with outcomes including:

- Approved
- Changes requested
- Rejected

## Patterns to study

### A. Action item structure
Task-oriented details support:
- assignee;
- due date;
- status;
- related project;
- dependencies.

### B. Dependency clarity
Asana's split `Blocked by` and `Blocking` fields are especially relevant.

This directly supports the target question:

> Who is waiting on whom?

### C. Timeline visualization
Dependencies can be drawn visually on timelines.

### D. Approval as a specific object/state
Approval tasks differ from ordinary completion tasks.

This is an important conceptual reference for digital signatures and meeting review.

## What to borrow

- separate `Blocked by` and `Blocking` language;
- explicit ownership;
- deadline visibility;
- clear approval states;
- dependency details close to the action;
- one action record accessible from multiple contexts.

## What not to copy

The target product does not currently notify action owners or make them primary users.

Avoid designing a full personal task inbox or productivity workspace unless requirements change.

Also avoid over-complicated dependency types in MVP unless real use cases require them.

## Implication for our product

**Best benchmark for Action + Dependency + Approval semantics.**

## Official sources

- Task Dependencies  
  https://help.asana.com/s/article/task-dependencies
- Dependency Types  
  https://help.asana.com/s/article/dependency-types
- Use dependencies to kick work off at the right time  
  https://help.asana.com/s/article/use-dependencies-to-kick-work-off-at-the-right-time
- Approvals  
  https://help.asana.com/s/article/approvals

---

# 8. monday.com

## Why it matters

monday.com is a strong reference for the **project dashboard and portfolio visibility** layer.

Official work-management documentation emphasizes:

- project planning/execution;
- clear ownership;
- progress visibility;
- blockers;
- dashboards;
- portfolio oversight;
- dependencies;
- risk visibility.

Its project-management flow also separates high-level project overview from detailed project execution.

## Patterns to study

### A. Board as structured operational data
Items + groups + columns form a configurable work model.

### B. Multiple views over the same data
The same underlying project data can be presented for:
- execution;
- planning;
- review.

### C. High-level dashboard
Dashboards aggregate metrics for stakeholder visibility.

### D. Portfolio / leadership visibility
Portfolio views surface project progress, risk, and status across multiple projects.

### E. Dependencies
monday.com explicitly supports Gantt and dependency visibility, including cross-project dependencies in enterprise contexts.

### F. Contextual updates
Work items have an Updates section so communication remains attached to the specific work record.

## What to borrow

- project overview hierarchy;
- health/status dashboards;
- aggregate metrics;
- portfolio scanability;
- risk and blocker surfacing;
- multiple views over a shared data model;
- progressive disclosure between high-level and detailed project views.

## What not to copy

monday.com is highly configurable.

The target product should not become an open-ended work OS.

Avoid:
- excessive customizable columns in MVP;
- arbitrary board creation;
- user-defined workflow complexity;
- visual overload from too many widgets.

## Implication for our product

**Best benchmark for Project Dashboard and management-level visibility.**

## Official sources

- Get started with monday work management  
  https://support.monday.com/hc/en-us/articles/115005305649-Get-started-with-monday-work-management
- Project management with monday.com  
  https://support.monday.com/hc/en-us/articles/360014437599-Project-management-with-monday-com
- monday work management support hub  
  https://support.monday.com/hc/en-us/p/work-management
- Work Management for Enterprise  
  https://support.monday.com/hc/en-us/articles/23716681570578-Work-Management-for-Enterprise

---

# 9. Fellow

## Why it matters

Fellow is the strongest benchmark for the **meeting-to-action** layer.

Its official product/help material describes:

- recording and transcribing meetings;
- generating summaries;
- extracting decisions;
- generating/suggesting action items;
- sharing meeting recaps with participants;
- keeping action items linked back to the meeting they came from;
- resurfacing follow-up items before future meetings;
- searching across meeting history.

This is extremely close to the target product's future Meeting Assistant direction.

## Patterns to study

### A. Meeting recap as a distinct post-meeting artifact
The recap contains:
- summary;
- decisions;
- action items.

### B. Action provenance
Action items show which meeting they came from.

### C. Cross-meeting continuity
Action items can be resurfaced before the next meeting.

### D. Central action list
Actions from many meetings are aggregated.

### E. AI extraction
Fellow turns conversation into structured suggested outcomes.

### F. Search historical context
Fellow can answer questions across previous transcripts/notes.

## What to borrow

- strong link from action → source meeting;
- structured post-meeting recap;
- next-meeting continuity;
- decisions and actions as separate outcome types;
- AI as draft extraction, not the only user interface;
- searchable meeting history.

## What not to copy

The target product currently has in-person meetings and manual PM entry.

Do not make:
- recording setup;
- video-conferencing integration;
- personal meeting productivity;
- meeting scheduling

the core IA.

These are future integrations.

## Implication for our product

**Best benchmark for future Meeting Assistant integration and Meeting Summary UX.**

## Official sources

- AI Meeting Action Items  
  https://fellow.ai/features/action-items
- AI Meeting Notes  
  https://fellow.ai/features/ai-meeting-notes
- Action Item Page  
  https://help.fellow.app/en/articles/4144380-action-item-page
- Organize Action Items  
  https://help.fellow.app/en/articles/4495787-organize-action-items
- Meeting Minutes App  
  https://fellow.ai/use-cases/meeting-minutes-app
- What is Fellow?  
  https://help.fellow.app/en/articles/3706094-what-is-fellow

---

# 10. Jira

## Why it matters

Jira is a strong workflow/governance benchmark.

Relevant documented capabilities include:
- linked work items;
- `blocks` / `is blocked by`;
- workflow states;
- configurable approval steps;
- defined approvers;
- transition behavior after approval/decline.

Jira Service Management is particularly useful as an approval benchmark because approvers may not need the same operational role as the person managing the workflow.

## Patterns to study

### A. Explicit workflow states
Approval is attached to a particular workflow stage.

### B. Approval gates
Work cannot move forward until approval conditions are satisfied.

### C. Approver configuration
Different people/groups can be defined as approvers.

### D. Approval outcomes drive transitions
Approved vs declined can lead to different next states.

### E. Linked work
Relationships such as:
- blocks;
- is blocked by;
- relates to;
- reviewed by

support explicit context.

### F. Dependency visualization
Dependencies can appear on timeline views.

## What to borrow

- formal approval-state thinking;
- explicit pre/post approval transitions;
- separation of operator from approver;
- linked-record semantics;
- visible dependencies;
- controlled state changes.

## What not to copy

Jira can be cognitively heavy and highly configurable.

Avoid:
- admin-like workflow complexity for ordinary PMs;
- too many issue types;
- technical terminology;
- enterprise configuration exposed in daily UX.

## Implication for our product

Use Jira as a **governance reference**, especially when defining:

```text
Draft
→ Ready for Review
→ Awaiting Approval
→ Approved
```

and what happens when approval fails.

## Official sources

- Link work items  
  https://support.atlassian.com/jira-software-cloud/docs/link-issues/
- Create or remove dependencies on your timeline  
  https://support.atlassian.com/jira-software-cloud/docs/create-or-remove-dependencies-on-your-timeline/
- Set up approval steps  
  https://support.atlassian.com/jira-service-management-cloud/docs/set-up-approvals/
- What are approvals?  
  https://support.atlassian.com/jira-service-management-cloud/docs/what-are-approvals/
- Add an approval step to a workflow  
  https://support.atlassian.com/jira-service-management-cloud/docs/add-an-approval-to-a-workflow/

---

# 11. Linear

## Why it matters

Linear is a strong reference for clarity and information density in:

- Project Overview
- Milestones
- Project health
- Structured updates
- Dependency relationships
- Chronological project change history

Linear separates project-level planning from granular issue execution.

## Patterns to study

### A. Project Overview
Projects have:
- summary;
- properties;
- documents/links;
- milestones;
- progress.

### B. Project status is explicit
Linear documents project status as a manually updated lifecycle signal rather than automatically changing status because issues are complete.

This is highly relevant because the target product also uses a **manual + calculated hybrid model**.

### C. Health updates
Project updates combine:
- health indicator;
- rich-text context;
- progress changes;
- challenges;
- next steps.

Health values include:
- On track
- At risk
- Off track

This closely matches the supplied project dashboard document.

### D. Update history
Linear's Updates tab provides chronological project updates and property changes.

### E. Milestones
Milestone completion reflects linked issue progress.

### F. Dependencies
Linear supports:
- blocked;
- blocking;
- related;
- duplicate

relations between issues and visual project dependencies.

## What to borrow

- concise project overview;
- clear status/health presentation;
- chronological update history;
- separation of high-level project planning from detailed work;
- milestone progress presentation;
- simple dependency language;
- dense but calm visual hierarchy.

## What not to copy

Linear is engineering/product-execution oriented.

The target product should not center the experience on:
- issue triage;
- cycles;
- engineering workflows;
- keyboard-first interaction;
- developer-specific constructs.

## Implication for our product

**Excellent benchmark for visual and interaction quality of Project Overview, Health, Updates, and Dependencies.**

## Official sources

- Projects  
  https://linear.app/docs/projects
- Project Status  
  https://linear.app/docs/project-status
- Initiative and Project Updates  
  https://linear.app/docs/initiative-and-project-updates
- Project Milestones  
  https://linear.app/docs/project-milestones
- Issue Relations  
  https://linear.app/docs/issue-relations
- Project Dependencies  
  https://linear.app/docs/project-dependencies
- Timeline  
  https://linear.app/docs/timeline

---

# 12. Slack

## Why it matters

Slack is not a primary benchmark for the product's IA, but it is relevant for lightweight meeting documentation and future AI meeting capture.

Slack supports:
- canvases for meeting notes, to-dos, and links;
- huddle notes;
- AI-generated huddle notes;
- topics discussed;
- action items;
- participant context.

## Patterns to study

### A. Notes attached to conversation context
Meeting notes are attached to the place where the meeting happened.

### B. Lightweight shared artifact
Canvas provides a low-friction collaborative document.

### C. AI huddle notes
After a huddle, Slack AI can produce notes that include:
- people in the meeting;
- discussed topics;
- action items;
- transcript.

## What to borrow

- simple recap presentation;
- quick access to meeting context;
- future sharing/integration ideas;
- clear separation between conversation and persistent documentation.

## What not to copy

The target product is not chat-first.

Avoid:
- channel-centric navigation;
- message chronology as project history;
- notification-centric workflow;
- informal discussion as the authoritative record.

## Implication for our product

Use Slack only as a **secondary benchmark for meeting recap and integration**, not as the core product model.

## Official sources

- Use AI to take huddle notes in Slack  
  https://slack.com/help/articles/31377193680019-Use-AI-to-take-huddle-notes-in-Slack
- Use huddles in Slack  
  https://slack.com/help/articles/4402059015315-Use-huddles-in-Slack
- Use a canvas in Slack  
  https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack
- Canvases: Take notes and align on tasks  
  https://slack.com/help/articles/14455334890259-Canvases--Take-notes-and-align-on-tasks

---

# 13. Cross-Platform Pattern Analysis

## 13.1 Project ↔ Meeting ↔ Work relationship

### Strong references
- Notion
- Confluence
- Fellow

### Observed pattern
Meeting records are most valuable when they remain connected to the project and to resulting work.

### Recommendation
Never store a meeting as an isolated document.

```text
Project
└── Meeting
    ├── Decisions
    └── Actions
```

---

## 13.2 Decisions should be first-class outcomes

### Strong references
- Confluence
- Fellow

Useful meeting systems distinguish:
- discussion;
- decision;
- action.

### Recommendation
Do not store decisions only inside a summary paragraph.

A decision must be independently:
- identifiable;
- attributable;
- linkable;
- historically retrievable.

---

## 13.3 Action provenance matters

### Strong reference
- Fellow

An action should show the meeting where it originated.

### Recommendation

Every Action Item should preserve:

```text
Source Meeting
Related Decision
Owner
Deadline
Status
Priority
Dependency
```

---

## 13.4 `Blocked by / Blocking` is the clearest dependency language

### Strong references
- Asana
- Linear
- Jira

All three use direct directional relationship language.

### Recommendation
Prefer:

- **Blocked by**
- **Blocking**

over abstract labels such as “dependency type” in everyday UI.

---

## 13.5 Approval is a workflow state, not just a button

### Strong references
- Asana
- Jira Service Management

Approval often changes what can happen next.

### Recommendation

```text
Draft
→ Ready for Review
→ Awaiting Signatures
→ Approved
```

Do not implement “Sign” as a purely decorative action.

---

## 13.6 Project health needs context

### Strong references
- Linear
- monday.com

A health color/status is useful, but the user also needs:
- explanation;
- latest update;
- blockers;
- next milestone;
- changes.

### Recommendation
Pair project health with a short structured update.

---

## 13.7 Historical updates should be chronological

### Strong reference
- Linear

Project update history is valuable when status, milestone, deadline, and membership changes appear together chronologically.

### Recommendation
Create one readable activity stream for meaningful project changes.

---

## 13.8 Multiple views should not mean duplicate data

### Strong references
- monday.com
- Notion

The same structured record can appear as:
- dashboard;
- list;
- timeline;
- project detail;
- related-record panel.

### Recommendation
Build one canonical data model and render different views from it.

---

## 13.9 AI should produce a draft, not final governance truth

### Strong references
- Fellow
- Notion AI Meeting Notes
- Slack AI huddle notes

AI can:
- transcribe;
- summarize;
- detect decisions;
- suggest actions.

### Recommendation

```text
AI Capture
→ Draft
→ PM Review
→ Structured Save
→ Participant Approval
```

This is essential because the target product creates signed and auditable records.

---

# 14. Benchmark-by-Feature Matrix

| Capability | Notion | Confluence | Asana | monday | Fellow | Jira | Linear | Slack |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Project overview | High | Med | High | High | Low | High | High | Low |
| Meeting notes | High | High | Med | Med | High | Med | Low | High |
| Structured decisions | Med | High | Low | Low | High | Med | Low | Low/Med |
| Structured actions | High | High | High | High | High | High | High | Med |
| Owner + deadline | High | High | High | High | High | High | High | Med |
| Dependency model | Med | Low | High | High | Low | High | High | Low |
| Approval workflow | Low | Low/Med | High | Med | Low | High | Low | Low |
| Signature evidence | Low | Low | Low | Low | Low | Low | Low | Low |
| Project health | Med | Low | Med | High | Low | High | High | Low |
| Update history | High | High | High | High | High | High | High | High |
| Meeting AI | High | Med | Low | Med | High | Low | Low | High |
| Cross-meeting continuity | Med | High | Low | Med | High | Low | Low | Med |
| Reviewer-light UX | Share-page style | Share-page style | Approval task | Guest/share patterns | Recap sharing | Approval portal | Share/update | Share/canvas |

> `Signature evidence` is the clearest gap across mainstream benchmarks and is therefore a project-specific differentiator rather than a pattern to copy directly.

---

# 15. What the Target Product Should Borrow

## From Notion
- relational IA;
- linked records;
- project ↔ meeting context.

## From Confluence
- meeting template structure;
- explicit decisions;
- historical documentation.

## From Asana
- action semantics;
- `Blocked by / Blocking`;
- approval outcomes.

## From monday.com
- project health/dashboard hierarchy;
- leadership overview;
- risk/progress aggregation.

## From Fellow
- meeting recap;
- action provenance;
- cross-meeting follow-up;
- future AI extraction.

## From Jira
- stateful approval workflow;
- governed transitions;
- relationship types.

## From Linear
- calm, concise project overview;
- manual project status;
- health update + context;
- chronological updates/history;
- milestones/dependencies.

## From Slack
- lightweight recap sharing;
- future meeting-capture integration.

---

# 16. What the Target Product Should NOT Become

### Not a Notion clone
The product needs stronger rules and less configuration.

### Not a Confluence clone
Meeting notes are only one layer; the product must govern project state.

### Not an Asana/Jira/Linear clone
Action owners are not currently primary users and do not manage their own work in the product.

### Not a monday.com work OS
The product should not expose arbitrary workflow configuration.

### Not a Fellow clone
Meeting recording is future scope; governance is the core.

### Not a Slack workflow
Communication is not the system of record.

---

# 17. Product Opportunity Identified by the Benchmark

Most tools optimize for one of these:

```text
Documentation
OR
Task execution
OR
Project visibility
OR
Meeting capture
```

The target product combines:

```text
Project status
+ Meeting evidence
+ Decisions
+ Action accountability
+ Dependencies
+ Participant confirmation
+ Full change history
+ Final executive sign-off
```

This creates a distinct position:

> **Governed continuity from meeting agreement to project state.**

The most differentiating elements are:

1. signed meeting outcomes;
2. direct traceability from project state back to meeting evidence;
3. PM/PO-controlled data rather than team-wide task management;
4. versioned project closure;
5. final CEO sign-off.

---

# 18. Recommended Benchmark Priorities by Design Phase

## Phase 1 — IA / Content Model
Study:
1. Notion
2. Confluence
3. Linear

Focus:
- relationships;
- project/meeting hierarchy;
- history;
- decisions.

## Phase 2 — Project Dashboard
Study:
1. monday.com
2. Linear
3. Jira

Focus:
- health;
- progress;
- milestones;
- risks;
- compact hierarchy.

## Phase 3 — Meeting Detail
Study:
1. Confluence
2. Fellow
3. Notion

Focus:
- summary;
- decisions;
- actions;
- historical context.

## Phase 4 — Action & Dependency UX
Study:
1. Asana
2. Linear
3. Jira

Focus:
- blocked by / blocking;
- owner;
- due date;
- status;
- relationship visualization.

## Phase 5 — Approval / Signature
Study:
1. Jira Service Management
2. Asana

Focus:
- pending;
- approve;
- changes requested;
- reject;
- transition rules;
- approver role.

> Digital signature itself requires additional domain/legal/product research because these benchmark platforms are primarily approval systems, not signature-governance systems.

## Phase 6 — Future Meeting Assistant
Study:
1. Fellow
2. Notion AI Meeting Notes
3. Slack AI Huddle Notes

Focus:
- transcript;
- recap;
- suggested decisions;
- suggested actions;
- human review.

---

# 19. UX Heuristics Derived from the Benchmark

1. **Keep evidence close to the state it explains.**
2. **Keep decisions separate from actions.**
3. **Make dependency direction explicit.**
4. **Make approval state visible before action.**
5. **Preserve source context.**
6. **Show health + explanation.**
7. **Use one canonical record.**
8. **Keep reviewer UX intentionally narrow.**
9. **Separate AI suggestion from approved record.**

---

# 20. Recommended Design References to Capture Visually

When doing the visual benchmark phase, collect screenshots of these specific areas.

## Notion
- Project page with related tasks/meeting notes
- relation property
- AI Meeting Notes result

## Confluence
- meeting-notes template
- decision element
- action item inside notes

## Asana
- task details with `Blocked by`
- timeline dependencies
- approval task states

## monday.com
- project dashboard
- portfolio dashboard
- health/status widgets
- Gantt dependencies

## Fellow
- meeting recap
- action items page
- decision/action extraction
- pre-meeting brief / previous actions

## Jira
- approval state
- approver panel
- linked work items
- timeline dependency

## Linear
- project overview
- health update
- updates/history tab
- milestones
- blocked/blocking relations

## Slack
- AI huddle notes
- Canvas meeting notes

---

# 21. Benchmark Risks

## Risk 1 — Feature accumulation
Because each benchmark is broad, combining everything would create an oversized product.

**Mitigation:** Copy principles, not entire feature sets.

## Risk 2 — Task-manager drift
Asana/Jira/Linear can pull the design toward full task management.

**Mitigation:** PM/PO remain the active operators in the current model.

## Risk 3 — Flexible-database drift
Notion/monday can lead to excessive customization.

**Mitigation:** Keep the product opinionated.

## Risk 4 — Documentation-only drift
Confluence can make meetings feel like pages instead of structured governance records.

**Mitigation:** Keep Decision, Action, Dependency, Approval, and History as first-class entities.

## Risk 5 — AI-first drift
Fellow/Slack/Notion AI can make capture feel like the core experience.

**Mitigation:** AI is future input assistance; governance remains the core.

---

# 22. Product-Specific Benchmark Synthesis

The most useful combined design model is:

```text
NOTION
relational information architecture

+
CONFLUENCE
structured meeting record

+
FELLOW
meeting → decisions/actions continuity

+
ASANA
action + dependency clarity

+
JIRA
approval workflow

+
LINEAR
project health + update history

+
MONDAY
management dashboard

+
SLACK
lightweight future recap sharing
```

The target product should then add its own differentiator:

```text
DIGITAL MEETING SIGNATURE
+
AUDITABLE PROJECT VERSION CLOSURE
+
CEO FINAL APPROVAL
```

---

# 23. Priority Pattern Recommendations

## P0 — Essential
- Project → Meetings relationship
- structured Meeting Summary
- Decisions as entities
- Action Items with owner/deadline/status/priority
- source meeting
- `Blocked by / Blocking`
- participant approval state
- comment on review
- change history
- project health/status
- project version closure

## P1 — High value
- milestone progress
- cross-meeting open-action carryover
- filtered activity history
- contextual links from dashboard state to source meeting
- assisted “promote to project risk/blocker” flow
- meeting review revision state

## P2 — Future
- AI meeting transcription
- suggested decisions/actions
- meeting assistant import
- advanced global action views
- automatic health suggestions
- portfolio analytics

---

# 24. Open Research Areas

These were not resolved by the benchmark and require project-specific research:

1. Legal/organizational meaning of a “digital signature”.
2. Whether all meeting participants must sign.
3. Signature invalidation after edits.
4. Reviewer identity/authentication.
5. CEO rejection / changes-requested workflow.
6. Required project export/report format.
7. Project completion formula.
8. Whether action owners will ever become direct product users.
9. Whether dependency relationships need more than `Blocked by / Blocking`.
10. Required retention policy for closed projects.
11. Permission visibility of sensitive projects/meetings.
12. Whether comments become part of the signed record.

---

# 25. Official Source Index

## Notion
- https://www.notion.com/help/guides/a-guide-to-connecting-projects-and-meeting-notes
- https://www.notion.com/help/relations-and-rollups
- https://www.notion.com/help/guides/preserve-perfect-meeting-memory-with-ai-meeting-notes
- https://www.notion.com/help/guides/product-teams-nail-cross-functional-collaboration-with-these-notes-and-docs

## Confluence / Atlassian
- https://www.atlassian.com/software/confluence/templates/meeting-notes
- https://www.atlassian.com/software/confluence/templates/weekly-meeting-notes

## Asana
- https://help.asana.com/s/article/task-dependencies
- https://help.asana.com/s/article/dependency-types
- https://help.asana.com/s/article/use-dependencies-to-kick-work-off-at-the-right-time
- https://help.asana.com/s/article/approvals

## monday.com
- https://support.monday.com/hc/en-us/articles/115005305649-Get-started-with-monday-work-management
- https://support.monday.com/hc/en-us/articles/360014437599-Project-management-with-monday-com
- https://support.monday.com/hc/en-us/p/work-management
- https://support.monday.com/hc/en-us/articles/23716681570578-Work-Management-for-Enterprise

## Fellow
- https://fellow.ai/features/action-items
- https://fellow.ai/features/ai-meeting-notes
- https://help.fellow.app/en/articles/4144380-action-item-page
- https://help.fellow.app/en/articles/4495787-organize-action-items
- https://fellow.ai/use-cases/meeting-minutes-app
- https://help.fellow.app/en/articles/3706094-what-is-fellow

## Jira
- https://support.atlassian.com/jira-software-cloud/docs/link-issues/
- https://support.atlassian.com/jira-software-cloud/docs/create-or-remove-dependencies-on-your-timeline/
- https://support.atlassian.com/jira-service-management-cloud/docs/set-up-approvals/
- https://support.atlassian.com/jira-service-management-cloud/docs/what-are-approvals/
- https://support.atlassian.com/jira-service-management-cloud/docs/add-an-approval-to-a-workflow/

## Linear
- https://linear.app/docs/projects
- https://linear.app/docs/project-status
- https://linear.app/docs/initiative-and-project-updates
- https://linear.app/docs/project-milestones
- https://linear.app/docs/issue-relations
- https://linear.app/docs/project-dependencies
- https://linear.app/docs/timeline

## Slack
- https://slack.com/help/articles/31377193680019-Use-AI-to-take-huddle-notes-in-Slack
- https://slack.com/help/articles/4402059015315-Use-huddles-in-Slack
- https://slack.com/help/articles/203950418-Use-a-canvas-in-Slack
- https://slack.com/help/articles/14455334890259-Canvases--Take-notes-and-align-on-tasks

---

# 26. Final Recommendation

Do not ask:

> “Which product should we copy?”

Ask:

> “Which product has already solved this specific interaction problem well?”

Use this benchmark map:

```text
IA / relationships → Notion
Meeting content → Confluence
Meeting continuity → Fellow
Dependencies → Asana / Linear / Jira
Approvals → Jira / Asana
Project health → Linear / monday.com
Dashboard → monday.com
History → Linear
Future AI capture → Fellow / Notion / Slack
```

Then apply the project-specific governance model:

```text
PM/PO controlled
+ participant signed
+ historically traceable
+ versioned
+ CEO closed
```

That combination is the product's real design territory.
