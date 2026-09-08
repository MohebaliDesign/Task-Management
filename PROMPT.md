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
Your task is to make a small but important product refinement inside the existing branch:

---

# GIT REQUIREMENT

First:

1. Checkout latest main.
2. Create a new branch from main.

Branch name:
---

dashboard-final-refinement


All changes must be implemented only inside:

dashboard-final-refinement


Do NOT merge into main.

Do NOT modify main directly.


After completion:

- commit changes;
- push this branch;
- keep it ready for manual Pull Request review.
After implementation:

- commit changes;
- push changes to the same branch;
- keep the branch ready for manual review and future pull request.


---

# PRODUCT CONTEXT

- shadcn/ui
- Iconsax
- existing Design Tokens
- Vazirmatn font
- RTL support
This product manages project governance and meeting outcomes.

Core entities:

Use UI/UX Pro Max principles for:
Project
→ Meeting
→ Decision
→ Action
→ Dependency
→ Blocker
→ History

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
Meetings are the main place where PMs document what happened, what was decided, and what needs follow-up.

---

# FEATURE REQUEST

Add "Blockers / Obstacles" support inside the Meeting Creation flow.

Currently:

The product already has a dedicated Blockers section/tab where blockers can be managed.

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
The same concept must also exist during meeting documentation.

When PM is creating or documenting a meeting, they should be able to capture blockers that were identified during that meeting.

---

# 1. ADD BLOCKERS SECTION TO MEETING CREATION PAGE


Location:

Meeting creation/edit page

Activity/history belongs to dedicated history areas.

Add a new section:

- UI section;
- related empty states;
- unnecessary data fetching if only used here.

---

# 2. ADD UX DESCRIPTIONS TO MEETING SECTIONS


Inside Meeting Create/Edit page add short helper descriptions.

Sections:

Title:

"موانع"


This section should be placed logically near:

- Decisions
- Actions
- Dependencies


because blockers are part of meeting outcomes.


---

# 2. BLOCKER ITEM STRUCTURE

## Decisions

Title:

تصمیمات

Reuse the same data model and fields that already exist in the dedicated Blockers section.

Do NOT create a separate blocker implementation.

The meeting blocker should use the same entity/component structure.

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
Each blocker should support the existing blocker information.

Example structure:

- Blocker title
- Description
- Related project/context if required by existing model
- Owner/responsible person (if available)
- Status
- Priority
- Resolution information (if already supported)

Descriptions should be:

- short;
- clear;
- PM-friendly;
- consistent with product tone.

---

# 3. ADD CARD / TABLE VIEW SWITCHING


For:

Follow the existing product pattern.

---

# 3. BLOCKER CREATION EXPERIENCE

- Projects page
- Meetings page

Follow the same UX pattern used for:

- Decisions
- Actions

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
Provide CTA:


"+ ثبت مانع"


When clicked:

Allow PM to add a blocker item.


After saving:

Display it as a lightweight list/card item inside the Meeting form.


---

# 4. VISUAL DESIGN


Follow the existing Decision and Action section styling.


Blocker items should:

- have subtle surface difference;
- avoid heavy borders;
- maintain clear hierarchy;
- work correctly in RTL.


Do not create a new visual pattern.

Related Project / Meeting Space

Date

Participants

Status


---

# 4. ADD SEARCH FILTER SORT TO MEETINGS PAGE


Projects already support:
Reuse existing components where possible.

---

# 5. MEETING DETAIL PAGE

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
After saving the meeting:

The registered blockers must appear inside the Meeting Detail page.


Add a section:


"موانع"


The structure should be consistent with:

- Decisions section
- Actions section


---

# 6. DATA CONSISTENCY


Important:

Do not create blockers only inside meetings.

The blocker created from a meeting should also be available inside the existing Blockers area/tab.

Redesign based on modern SaaS patterns.

The relationship should be preserved.

Reference direction:

Linear / Notion / modern enterprise SaaS.


---

# NEW PROJECT CARD STRUCTURE


Primary information:


Project Name


Short description


Status

Example:


Meeting:

"جلسه بررسی توسعه محصول"


contains:


Blocker:

"عدم دسترسی تیم توسعه به API"

Owner

This blocker should also appear in:

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
Blockers section.


---

# 7. EDIT FLOW


When user clicks:

"ویرایش جلسه"


The existing blockers should be loaded as prefilled data.


User should be able to:

- edit blockers;
- remove blockers;
- add new blockers.


The Meeting edit page remains the single source for editing meeting outcomes.

---

# 8. UX WRITING


Use clear Persian UX writing.


Section title:

"موانع"


Empty state:

"هنوز مانعی برای این جلسه ثبت نشده است."


CTA:

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
"ثبت مانع"


Avoid generic labels such as:

"افزودن"

or

"ثبت"


when context is unclear.

---

# 9. COMPONENT ARCHITECTURE


Do not duplicate blocker components.


If a blocker component already exists:


Reuse it.


If needed:

Extract a reusable component shared between:

- Blockers page
- Meeting form
- Meeting detail


Maintain consistency across the product.

---

# 10. RTL AND ACCESSIBILITY CHECK


Verify:

- RTL alignment;
- Persian typography;
- icon placement;
- keyboard accessibility;
- form validation.


---

# FINAL QA


Verify:


Product:

- Dashboard focuses on important information.
- Projects are easy to scan.
- Meetings have equal capabilities.
- PM understands Decisions, Actions, Blockers.
- Can PM register blockers during meeting documentation?
- Are blockers connected to the existing blocker system?
- Can blockers be edited through meeting edit flow?


UX:

- Less cognitive overload.
- Better discoverability.
- Clear descriptions.
- Is blocker creation consistent with decisions/actions?
- Is the flow clear?


Visual:

- Premium SaaS feeling.
- Better hierarchy.
- Less noisy cards.
- Does the new section match the existing design?


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
Run local application and check:

- Meeting creation
- Meeting editing
- Meeting detail
- Blockers section



---

# FINAL REPORT


Provide:

1. Changed files
2. UX decisions
3. Visual improvements
4. Components created
5. Validation results
6. Git branch status
# COMMIT AND PUSH


Create commit:

```bash
feat: add blockers support to meeting workflow
