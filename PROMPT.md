# ROLE

You are acting as a Senior Git Engineer and Senior Full-Stack Developer.

Your task is to safely synchronize the latest changes from the `main` branch into the existing feature branch:

```
project-meeting-form-improvements
```

The goal is NOT to merge this feature branch into main.

The goal is the opposite:

Update the feature branch so that it contains:

1. All latest changes from `main`
2. All existing changes and implementations from `project-meeting-form-improvements`

The final result must remain inside:

```
project-meeting-form-improvements
```

After verification, I will manually review it and create a Pull Request into `main`.

---

# IMPORTANT GIT RULES

Before doing anything:

1. Check current repository.
2. Check current branch.
3. Check remote configuration.
4. Check working tree status.

Run:

```bash
git status
git branch
git remote -v
```

Make sure you are working on the correct repository.

Do NOT modify:

```
main
```

directly.

Do NOT force push.

Do NOT delete branches.

Do NOT lose any existing work.

---

# CURRENT BRANCH STRUCTURE

Current situation:

```
main
 |
 |-- New updates from teammate are already merged and pushed here
 |
 |
project-meeting-form-improvements
 |
 |-- Contains previous feature development changes
```

The desired final structure:

```
main
 |
 |-- latest shared changes
 |
 |
project-meeting-form-improvements
 |
 |-- latest main changes
 |
 |-- existing feature changes preserved
```

---

# REQUIRED WORKFLOW

## Step 1 — Switch to feature branch

Checkout:

```bash
git checkout project-meeting-form-improvements
```

or:

```bash
git switch project-meeting-form-improvements
```

---

## Step 2 — Update remote references

Fetch latest remote state:

```bash
git fetch origin
```

---

## Step 3 — Integrate latest main changes

Bring the latest `main` branch changes into:

```
project-meeting-form-improvements
```

Preferred approach:

Use a clean merge:

```bash
git merge origin/main
```

Do NOT merge feature branch into main.

The direction must be:

```
origin/main
        ↓
project-meeting-form-improvements
```

---

# CONFLICT HANDLING

If merge conflicts happen:

Do NOT automatically discard either side.

Analyze each conflict carefully.

Priority:

1. Preserve latest main changes.
2. Preserve valuable feature changes from:
   
```
project-meeting-form-improvements
```

3. Resolve conflicts based on the final product behavior.

For important files:

- understand the purpose;
- combine both implementations when needed;
- avoid deleting functionality.

After resolving conflicts:

```bash
git add .
git commit
```

---

# VERIFY FEATURE INTEGRITY

After merge, verify that all previous feature work still exists.

Especially check:

- project creation improvements;
- meeting form improvements;
- meeting space functionality;
- dashboard changes;
- existing UI improvements;
- design system usage;
- shadcn components;
- Iconsax integration.

The goal is:

```
main updates + feature branch functionality
```

not:

```
main replacing feature branch
```

---

# RUN VALIDATION

After synchronization:

Run:

```bash
npm install
npm run lint
npm run build
```

If the project has tests:

Run them as well.

Check for:

- TypeScript errors;
- missing dependencies;
- broken imports;
- runtime errors.

---

# RUN LOCAL CHECK

Start the application:

```bash
npm run dev
```

Verify that:

- application starts successfully;
- dashboard loads;
- project pages load;
- meeting pages load;
- no runtime errors exist.

---

# COMMIT

After successful synchronization create a clear commit:

Example:

```
chore: sync main updates into project-meeting-form-improvements
```

---

# PUSH

Push only this branch:

```bash
git push origin project-meeting-form-improvements
```

Do not push to main.

---

# FINAL REPORT

After completion provide:

## Git status

- current branch
- latest commit
- merge status

## Changes integrated from main

Summarize what was brought from main.

## Feature changes preserved

Summarize what remained from:

```
project-meeting-form-improvements
```

## Conflicts resolved

If any, explain briefly.

## Verification

Report:

- lint result
- build result
- local run result

## Pull Request readiness

Confirm whether:

```
project-meeting-form-improvements
```

is ready to be reviewed and merged into main.