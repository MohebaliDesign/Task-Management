# ROLE

Act as:

- Senior Product Designer
- Senior UX Designer
- Senior UX Writer
- Senior Frontend Engineer


Use Claude Opus 4.8 High reasoning.


You are improving an existing Project Governance & Meeting Accountability System.


# PRODUCT MODEL

Core entities:

Project
→ Meeting
→ Decision
→ Action
→ Owner
→ Dependency
→ History
→ Approval


Do not redesign randomly.

Improve the existing implementation according to UX principles, IA consistency, and design system quality.


# GIT REQUIREMENT

Create a new branch:

project-meeting-form-improvements


Branch must be created from current development branch.

All changes only inside this branch.

Commit and push after completion.


# DESIGN SYSTEM

Continue using:

- shadcn/ui
- Iconsax
- existing design tokens
- Vazirmatn font
- RTL support


Use uiux-pro-max skill for all visual improvements.


# 1. VISUAL SYSTEM IMPROVEMENT


Reduce gray intensity in cards and sections.

Improve surfaces:

Main background:

light neutral gray.


Cards:

white.


Reduce excessive borders.


Replace heavy shadows with subtle SaaS-style elevation.


Use soft shadow:

rgba(0,0,0,0.05-0.06)


Goal:

clean, premium, professional dashboard feeling.


# 2. PROJECT CREATION FLOW


Update project creation.


## Version management

Current version behavior is too strict.


Version previous relation must be optional.


Support:


Case 1:

New project version connected to previous version.


Case 2:

User creates version 6 directly without previous versions existing.


Add:

Previous Version selector (optional)


Helper:

"اگر این نسخه ادامه نسخه قبلی است، پروژه مرتبط را انتخاب کنید."


# 3. PROJECT RESPONSIBILITY SECTION


Project Manager:

Required.


Product Owner:

Optional.


Update selects.

At the bottom of user select lists add:


"+ افزودن فرد جدید"


Click opens modal:


Fields:

Name

Role


After saving:

new user becomes selectable.


# 4. PROJECT PHASE MANAGEMENT


Replace simple current phase selection.


Create phase management.


Support multiple phases.


Each phase needs:


Name

Start date

Deadline


Allow adding new phases:


"+ افزودن فاز جدید"


Display selected phases clearly.


# 5. OPTIONAL DEADLINE


Project deadline should not be required.


Make target deadline optional.


# 6. PROJECT STATUS SECTION


Remove:


Executive Summary


Next milestone


Keep only:


Current Project Status


Current Focus


# 7. CREATE MEETING FORM


Improve participants section.


Allow adding new users.


Button:


"+ افزودن شرکت‌کننده"


Modal:


Name

Role


Each participant needs attendance state.


Add checkbox:

"در جلسه حضور نداشت"


# 8. MEETING SUMMARY


Replace large textarea.


Create structured summary items.


Input:

Add summary point.


Enter or plus button creates item.


Display list below.


Each item has:

Edit icon

Delete icon


# 9. DECISIONS IN CREATE MEETING


Add decision section.


Use same structure as existing decision modal.


Each decision needs:


Title

Description

Owner/person responsible

Related information


# 10. ACTIONS IN CREATE MEETING


Add action section.


Use existing action modal structure.


Include:


Title

Owner

Deadline

Priority

Status


# 11. MEETING DETAIL EDITING


Remove separate edit buttons per section.


Add one global button:


"ویرایش جلسه"


Click opens meeting creation/edit page.


All existing data should be prefilled.


# 12. DECISION SOURCE CONTEXT


In meeting details:

Every decision must show:


Created from meeting:

Meeting title

Date


This improves auditability and history.


# 13. RTL AND UX WRITING AUDIT


Review all changed components.


Fix:

RTL alignment

Persian typography

button labels

helper texts

empty states


Use clear Persian UX writing.


# 14. FINAL QA


Verify:


Product:

- Version model supports real usage.
- Meeting and project entities are consistent.
- Decisions/actions preserve source context.


UX:

- Forms are easier to complete.
- Required vs optional fields are clear.
- Adding people is possible everywhere.


Visual:

- Dashboard feels premium.
- Shadows are subtle.
- Gray usage is reduced.


Provide final report:

- changed files
- implemented UX decisions
- visual improvements
- testing results
- git branch


Branch:

project-meeting-form-improvements