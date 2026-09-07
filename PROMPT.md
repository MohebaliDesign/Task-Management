# ROLE

You are acting as:

- Senior Product Designer
- Senior UX Designer
- Senior UX Writer
- Senior Frontend Engineer
- Design System Engineer


You are working inside Claude Code with Opus 4.8 High reasoning mode.


Your task is to make a small but important product refinement inside the existing branch:

project-meeting-form-improvements


---

# IMPORTANT GIT REQUIREMENT

All changes must be implemented only inside:

project-meeting-form-improvements


Do NOT merge into main.

Do NOT modify main directly.


After implementation:

- commit changes;
- push changes to the same branch;
- keep the branch ready for manual review and future pull request.


---

# PRODUCT CONTEXT

This product manages project governance and meeting outcomes.

Core entities:

Project
→ Meeting
→ Decision
→ Action
→ Dependency
→ Blocker
→ History


Meetings are the main place where PMs document what happened, what was decided, and what needs follow-up.

---

# FEATURE REQUEST

Add "Blockers / Obstacles" support inside the Meeting Creation flow.

Currently:

The product already has a dedicated Blockers section/tab where blockers can be managed.

The same concept must also exist during meeting documentation.

When PM is creating or documenting a meeting, they should be able to capture blockers that were identified during that meeting.

---

# 1. ADD BLOCKERS SECTION TO MEETING CREATION PAGE


Location:

Meeting creation/edit page


Add a new section:

Title:

"موانع"


This section should be placed logically near:

- Decisions
- Actions
- Dependencies


because blockers are part of meeting outcomes.


---

# 2. BLOCKER ITEM STRUCTURE


Reuse the same data model and fields that already exist in the dedicated Blockers section.

Do NOT create a separate blocker implementation.

The meeting blocker should use the same entity/component structure.


Each blocker should support the existing blocker information.

Example structure:

- Blocker title
- Description
- Related project/context if required by existing model
- Owner/responsible person (if available)
- Status
- Priority
- Resolution information (if already supported)


Follow the existing product pattern.

---

# 3. BLOCKER CREATION EXPERIENCE


Follow the same UX pattern used for:

- Decisions
- Actions


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


Reuse existing components where possible.

---

# 5. MEETING DETAIL PAGE


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


The relationship should be preserved.


Example:


Meeting:

"جلسه بررسی توسعه محصول"


contains:


Blocker:

"عدم دسترسی تیم توسعه به API"


This blocker should also appear in:

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

- Can PM register blockers during meeting documentation?
- Are blockers connected to the existing blocker system?
- Can blockers be edited through meeting edit flow?


UX:

- Is blocker creation consistent with decisions/actions?
- Is the flow clear?


Visual:

- Does the new section match the existing design?


---

# VALIDATION

Run:

npm run lint

npm run build


Run local application and check:

- Meeting creation
- Meeting editing
- Meeting detail
- Blockers section


---

# COMMIT AND PUSH


Create commit:

```bash
feat: add blockers support to meeting workflow