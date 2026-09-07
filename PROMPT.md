# ROLE

You are acting as a:

- Senior Product Designer
- Senior UX Designer
- Senior UX Writer
- Senior Frontend Engineer
- Design System Engineer

using Claude Code with Opus 4.8 High reasoning mode.

Your task is to improve the existing Project Governance & Meeting Accountability System.

This is NOT a redesign from scratch.

You must inspect the current implementation and refine the existing product based on UX, IA, and visual maturity principles.


# PROJECT CONTEXT

This product is a Project Governance & Meeting Accountability platform.

Core model:

Project
→ Meeting
→ Decision
→ Action
→ Owner
→ Dependency
→ History
→ Approval

Primary users:

- PM
- PO


The product should help users manage:

- projects
- meetings
- decisions
- actions
- dependencies
- project history


# REQUIRED GIT WORKFLOW

Before any modification:

1. Check current repository.
2. Create a new branch from the current development branch.

Branch name:

dashboard-meeting-improvements


All changes must happen only inside this branch.

Do not modify main directly.

After completion:

- commit changes
- push the branch
- provide summary of changed files


# DESIGN QUALITY REQUIREMENT

Use:

UI/UX Pro Max Skill

for:

- SaaS dashboard patterns
- visual hierarchy
- spacing
- accessibility
- component quality
- interaction patterns


Continue using:

- shadcn/ui
- Iconsax icons
- existing design tokens


Do not introduce random UI libraries.


# 1. APPLICATION SHELL COLOR SYSTEM


Current issue:

Sidebar, header, and content area have insufficient visual separation.


Update layout:

Sidebar:

white background.


Header:

white background.


Main content/workspace:

keep current light gray surface background.


Goal:

Create clear separation between:

Navigation
Global header
Working canvas


Do not make the entire application white.


# 2. DASHBOARD PRIMARY AND SECONDARY CTA SYSTEM


The dashboard needs two creation actions.


## Primary CTA

Keep project creation as the main action.

Button:

"ایجاد پروژه"


This should remain visually dominant.


## Secondary CTA

Add a new action:

"ایجاد دسته جلسات"


Important:

This is NOT creating an empty meeting.


Users should be able to create a meeting category/space.


Example:

"جلسات داخلی سازمان"

Inside this category users can create multiple meetings:

- management meeting
- organization coordination meeting
- internal discussion meetings


# 3. NEW MEETING SPACE CREATION FLOW


Create a new flow similar to project creation.

Reuse existing patterns.

However remove project-specific fields.


Remove:

- Version number
- Current phase
- Deadline
- Executive summary
- Next milestone


Keep:

- Name
- Description
- Owner
- Related people/team if existing pattern supports it


Example:


Create Meeting Space


Name:

جلسات داخلی سازمان


Description:

جلسات مربوط به هماهنگی‌های سازمانی


Owner:


Create


# 4. INFORMATION ARCHITECTURE UPDATE


Current model:

Project
  |
 Meeting


Expand it to:


Workspace

├── Projects

│    └── Project Meetings


└── Meeting Spaces

     ├── Meeting 1
     ├── Meeting 2
     └── Meeting 3


Do not break existing project meetings.

Support both:

1. Project-related meetings

2. Independent organization meetings


# 5. SIDEBAR UPDATE


Add new navigation item:


"جلسات"


The sidebar should include:


Dashboard

Projects

Meetings

History


Follow existing sidebar style.


# 6. DASHBOARD NEW SECTION


Create a new dashboard section below Active Projects.


Current:

Active Projects


New:


Active Projects


Meeting Spaces


The new section should display:

- Meeting space name
- Number of meetings
- Last meeting date
- Owner
- View action


Example:


جلسات داخلی سازمان

12 جلسه ثبت شده

آخرین جلسه:
5 شهریور


مشاهده جلسات →


# 7. REMOVE DUPLICATE DASHBOARD SECTIONS


There are two dashboard sections opposite Active Projects.

Remove them.

Reason:

Their information is already displayed inside project cards as badges.


Avoid duplicate information.

The dashboard should become cleaner.


After removal:

Active Projects should expand and use full available width.


# 8. VISUAL DASHBOARD REFINEMENT


Improve dashboard maturity.


Avoid:

- excessive borders
- flat white cards everywhere
- prototype feeling


Use:

- surface hierarchy
- spacing
- typography hierarchy
- existing design tokens


Preferred structure:


Background:

neutral gray surface


Sections/cards:

white surfaces


Use borders only when necessary.


# 9. RTL QUALITY AUDIT


Review all changed areas.

Fix:

- RTL alignment
- icon placement
- button direction
- spacing
- Persian text handling


Ensure all components behave correctly in RTL.


# 10. UX WRITING REVIEW


Review all new and existing related copy.


Avoid generic labels.


Prefer:


"ایجاد پروژه"

instead of:

"ساخت"


"ایجاد دسته جلسات"

instead of:

"جلسه جدید"


All text should be understandable for PM and PO users.


# 11. RESPONSIVE CHECK


Review:

- desktop
- tablet
- mobile


Ensure:

- CTA hierarchy remains clear
- cards adapt correctly
- navigation works properly


# 12. FINAL REVIEW


Before finishing verify:


Product:

- Can users understand difference between projects and meeting spaces?
- Can users create both project and organization meeting categories?
- Is information architecture clear?


UX:

- Are actions obvious?
- Are labels understandable?
- Is duplicate information removed?


Visual:

- Does dashboard feel like a mature SaaS product?
- Is hierarchy improved?
- Are surfaces separated correctly?


# FINAL REPORT


Provide:

1. Changed files
2. UX improvements
3. Product decisions implemented
4. Visual improvements
5. Testing results
6. Git branch information

Branch:
dashboard-meeting-improvements