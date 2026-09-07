# ROLE

Act as:

- Senior Product Designer
- Senior Visual Designer
- Senior UX Writer
- Senior Frontend Engineer
- Design System Engineer


Use Claude Code with Opus 4.8 High reasoning mode.


Your task is to perform the final UX and visual refinement pass on the product.

This work must happen in a NEW branch created from MAIN.

---

# GIT REQUIREMENT

First:

1. Checkout latest main.
2. Create a new branch from main.

Branch name:

dashboard-final-refinement


All changes must be implemented only inside:

dashboard-final-refinement


Do NOT merge into main.

Do NOT modify main directly.


After completion:

- commit changes;
- push this branch;
- keep it ready for manual Pull Request review.

---

# DESIGN REQUIREMENTS

Continue using:

- shadcn/ui
- Iconsax
- existing Design Tokens
- Vazirmatn font
- RTL support


Use UI/UX Pro Max principles for:

- hierarchy;
- spacing;
- dashboard quality;
- component consistency;
- accessibility.


---

# PRODUCT CONTEXT

This is a Project Governance and Meeting Documentation platform.

Main entities:

Project
Meeting
Decision
Action
Dependency
Blocker
History


Primary users:

PM / PO


The dashboard should help users quickly understand:

- projects;
- meetings;
- important work items.

---

# 1. REMOVE LAST ACTIVITY FROM DASHBOARD


Remove the entire:

"آخرین فعالیت"

section from dashboard.


Reason:

Dashboard should focus on overview and active management.

Activity/history belongs to dedicated history areas.

Remove:

- UI section;
- related empty states;
- unnecessary data fetching if only used here.

---

# 2. ADD UX DESCRIPTIONS TO MEETING SECTIONS


Inside Meeting Create/Edit page add short helper descriptions.

Sections:


## Decisions

Title:

تصمیمات


Description:

"نتیجه‌ها و انتخاب‌هایی که در این جلسه درباره آن‌ها به توافق رسیدید را ثبت کنید."


---

## Actions

Title:

اقدامات


Description:

"کارهایی که پس از جلسه باید انجام شوند، همراه با مسئول و زمان انجام آن‌ها ثبت کنید."


---

## Blockers

Title:

موانع


Description:

"مشکلات یا مواردی که باعث توقف یا کند شدن پیشرفت کار شده‌اند را ثبت کنید."


Descriptions should be:

- short;
- clear;
- PM-friendly;
- consistent with product tone.

---

# 3. ADD CARD / TABLE VIEW SWITCHING


For:

- Projects page
- Meetings page


Add view switcher:

Card View

Table View


User should be able to choose preferred display mode.


---

# PROJECTS TABLE VIEW


Create a professional data table.


Columns:


Project Name

Owner

Status

Phase

Deadline

Last Update


Use shadcn table patterns.


---

# MEETINGS TABLE VIEW


Create table view.


Columns:


Meeting Title

Related Project / Meeting Space

Date

Participants

Status


---

# 4. ADD SEARCH FILTER SORT TO MEETINGS PAGE


Projects already support:

Search

Filter

Sort


Meetings should have the same capabilities.


Add:

Search meetings

Filter by:

- project;
- meeting space;
- date;
- status;


Sort by:

- newest;
- oldest;


Maintain consistency with Projects page.

---

# 5. REDESIGN PROJECT CARDS


Current issue:

Project cards show too much information.

They feel:

- crowded;
- difficult to scan;
- visually noisy.


Redesign based on modern SaaS patterns.


Reference direction:

Linear / Notion / modern enterprise SaaS.


---

# NEW PROJECT CARD STRUCTURE


Primary information:


Project Name


Short description


Status


Owner


Secondary information:


Phase


Progress


Last update


Action:


مشاهده جزئیات →


---

# REMOVE FROM PROJECT CARD


Remove unnecessary overload:


- excessive badges;
- long descriptions;
- duplicate information;
- too many metadata fields.


Do not display every possible project attribute inside the card.

Cards are for scanning, not full detail.

---

# 6. VISUAL REFINEMENT


Improve overall dashboard visual quality.


Avoid:

- excessive borders;
- heavy shadows;
- crowded cards.


Use:


- better spacing;
- typography hierarchy;
- subtle elevation;
- clean surfaces.


Cards:

white surface.


Background:

neutral light surface.


Shadows:

soft and subtle.


---

# 7. RTL AND UX WRITING REVIEW


Audit:

- buttons;
- filters;
- tables;
- cards;
- empty states.


Ensure Persian RTL behavior.

---

# 8. COMPONENT QUALITY


Create reusable components where possible.


Avoid duplicate implementations.


Example:

ViewSwitcher

ProjectCard

ProjectTable

MeetingCard

MeetingTable


---

# FINAL QA


Verify:


Product:

- Dashboard focuses on important information.
- Projects are easy to scan.
- Meetings have equal capabilities.
- PM understands Decisions, Actions, Blockers.


UX:

- Less cognitive overload.
- Better discoverability.
- Clear descriptions.


Visual:

- Premium SaaS feeling.
- Better hierarchy.
- Less noisy cards.


---

# VALIDATION

Run:

npm run lint

npm run build


Run locally and verify:


Dashboard

Projects

Meetings

Card View

Table View


---

# COMMIT


Create commit:


feat: refine dashboard views and improve project cards


Push only:


dashboard-final-refinement


Do NOT merge into main.


---

# FINAL REPORT


Provide:

1. Changed files
2. UX decisions
3. Visual improvements
4. Components created
5. Validation results
6. Git branch status