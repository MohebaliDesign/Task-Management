# ROLE

You are acting as:

- Senior Product Designer
- Senior UX Designer
- Senior UX Writer
- Senior Frontend Engineer
- Design System Engineer


You are working inside Claude Code with Opus 4.8 High reasoning mode.

Your task is to refine and improve the existing product implementation.

This is NOT a new feature development task.

You must improve the current branch:

project-meeting-form-improvements


The goal is to fix remaining UX inconsistencies, improve visual quality, and make shared product patterns consistent across the application.

---

# IMPORTANT GIT REQUIREMENT

Before making any changes:

1. Verify current repository.
2. Verify current branch.
3. Make sure you are working on:

project-meeting-form-improvements


Do NOT merge into main.

Do NOT modify main directly.

All changes must remain inside:

project-meeting-form-improvements


After finishing:

- commit all changes;
- push this branch;
- do NOT create a merge into main.

I will review the branch and merge manually later.

---

# DESIGN REQUIREMENTS

Continue using:

- shadcn/ui
- Iconsax icon system
- existing Design Tokens
- Vazirmatn typography
- RTL layout


For visual improvements use:

UI/UX Pro Max Skill

Focus on:

- hierarchy
- spacing
- visual maturity
- SaaS dashboard quality
- accessibility
- consistency


Do not replace the existing company Design System.

---

# PRODUCT PRINCIPLE

This product contains shared concepts:

Project
Meeting
Decision
Action
Phase
User


Whenever the same concept exists in multiple places, it must behave consistently.

Example:

A Meeting created from:

- Project context
- Meeting Space context


is still the same Meeting entity.

The creation flow, detail structure, and editing experience must remain consistent.

---

# 1. PROJECT CREATION — PHASE MANAGEMENT IMPROVEMENT


Location:

Create Project flow

Section:

Project Phases Management


## Current problem

Phase cards currently have:

- unnecessary padding;
- unnecessary borders;
- too much card feeling.


Improve this design.


## Required changes


Remove:

- outer border around phase items;
- unnecessary card containers;
- excessive padding.


Use a cleaner list-based pattern:


Example:


Phase name

Date information

Actions

--------------------

Phase name

Date information

Actions


Use:

- Divider between phases;
- proper spacing;
- clear hierarchy.


The goal:

Phases should feel like a structured timeline/list, not independent cards.

---

# 2. PHASE SELECTOR EXPERIENCE


Current behavior:

Users only select from existing phases.


Improve it similar to the Project Manager selector pattern.


Required behavior:


User can:

1. Search existing phases.
2. Select an existing phase.
3. Create a new phase if it does not exist.


The selector should support:


Search input:


"جستجوی فاز"


Existing phases list:


Design

Development

Testing


At the bottom:


"+ افزودن فاز جدید"


When clicked:

Do NOT open a separate page.

Show inline input inside the selector menu.


Example:


نام فاز جدید:

[________]

ثبت


After creation:

The new phase should immediately become selectable.

---

# 3. MEETING CREATE PAGE — DECISION AND ACTION CARDS


Location:

Meeting creation page


Sections:

- Decisions
- Actions


## Current problem

Newly created decision/action items appear too flat or invisible.


Improve card styling.


Requirements:


Cards should have:

- very subtle gray surface;
- minimal contrast from section background;
- clear separation;
- no heavy border.


Example:

Section background:

very light neutral


Item card:

slightly darker neutral surface


Avoid:

- strong shadows;
- dark borders;
- heavy cards.


The cards should feel lightweight and structured.

---

# 4. REMOVE OPEN QUESTIONS FROM MEETING CREATION


Remove the:

"Open Questions"

section completely.


Reason:

This concept is not required in the current meeting documentation workflow.


Do not leave empty placeholders.

Remove:

- UI section;
- related fields;
- unnecessary validation;
- unused state/data handling if it exists.


---

# 5. REMOVE DIRECT ADD ACTION/DECISION FROM MEETING DETAIL PAGE


Location:

Meeting Detail page


Current behavior:

There are separate buttons to:

- add decision;
- add action.


Remove these.


Reason:

Meeting information should have a single editing source.


Required behavior:


Meeting Detail:

Only show:

"ویرایش جلسه"


When user clicks:

Navigate to Meeting Edit page.


The edit page should:

- load existing data;
- prefill all fields;
- allow editing decisions and actions;
- save changes together.


Do not create multiple editing entry points.

---

# 6. MEETING SPACE DETAIL — RESPONSIBLE PERSON SECTION


Location:

Organization Meeting Space detail page


Current issue:

Responsible person section feels:

- visually empty;
- dry;
- poorly aligned;
- not matching product quality.


Improve this section using UI/UX Pro Max principles.


Requirements:


Fix:

- RTL alignment;
- spacing;
- hierarchy;
- visual presentation.


Consider a better pattern:

Example:


Responsible person


[Avatar]

Name

Role


or a compact profile-style component.


Do not simply move text.

Improve the visual experience.

---

# 7. UNIFY MEETING CREATION EXPERIENCE


This is a critical consistency requirement.


Currently there are differences between:

1. Creating meeting from Project page

2. Creating meeting from Meeting section


This should not happen.


A Meeting is the same entity everywhere.


Required:


Both flows must use:

- same form structure;
- same fields;
- same sections;
- same validation;
- same components;
- same UX behavior.


The only difference should be:

Context source.


Example:


Project Meeting:

Related Project = Project X


Organization Meeting:

Meeting Space = Internal Organization Meetings


Everything else must remain identical.

---

# 8. UNIFY MEETING DETAIL EXPERIENCE


The same rule applies to Meeting Detail pages.


Whether the meeting belongs to:

- a project;
- an organization meeting space;


The detail page structure must be identical.


The following sections must follow one shared structure:


Meeting Overview

Participants

Attendance

Summary

Decisions

Actions

Dependencies (if applicable)

Comments / Feedback

Approval / Signature

History


Do not create separate versions of Meeting Detail.

Create reusable components if needed.

---

# 9. COMPONENT ARCHITECTURE IMPROVEMENT


Avoid duplicated implementations.


If Project Meeting and Organization Meeting use the same:


- Meeting Form
- Meeting Detail
- Decision Item
- Action Item
- Participant Selector


Extract reusable components.


Example structure:


components/

meeting/

  meeting-form.tsx

  meeting-detail.tsx

  participant-selector.tsx

  decision-list.tsx

  action-list.tsx


Adapt to the existing architecture.

---

# 10. RTL AND UX QUALITY AUDIT


Review all changed components.


Check:

- text alignment;
- icon position;
- spacing;
- dropdown direction;
- input alignment;
- modal layout.


Everything must behave naturally in Persian RTL.

---

# 11. UX WRITING REVIEW


Review all new and modified text.


Use clear Persian UX writing.


Avoid generic labels.


Examples:


Instead of:

"اضافه"


Use:

"افزودن فاز"


Instead of:

"ویرایش"

where context is unclear:


Use:

"ویرایش جلسه"


Instead of:

"ثبت"

where possible:


Use:

"ثبت تصمیم"

"ثبت اقدام"

"افزودن فرد جدید"


---

# 12. FINAL QA


Before finishing verify:


## Product consistency

- Are all meetings using the same structure?
- Are decisions and actions managed from one source?
- Are phases easier to manage?
- Are users able to create missing phases?


## UX quality

- Are unnecessary sections removed?
- Are flows simpler?
- Are duplicate actions removed?


## Visual quality

- Are phase items cleaner?
- Are decision/action cards subtle?
- Is the UI less card-heavy?
- Is hierarchy improved?


---

# VALIDATION

Run:

npm run lint

npm run build


Start locally:

npm run dev


Check:

- Project creation
- Phase management
- Meeting creation
- Meeting detail
- Organization meetings
- Decision creation
- Action creation


Fix runtime issues before completion.

---

# FINAL COMMIT

Create a meaningful commit:

example:

chore: refine meeting flows and improve project phase UX


Push:

project-meeting-form-improvements


Do NOT merge into main.

---

# FINAL REPORT

Provide:

1. Changed files
2. UX improvements implemented
3. Visual improvements implemented
4. Shared components created/refactored
5. Validation results
6. Git branch and commit information

Confirm:

Branch:

project-meeting-form-improvements

was pushed successfully.