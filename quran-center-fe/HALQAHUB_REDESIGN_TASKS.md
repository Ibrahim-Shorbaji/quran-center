# HalqaHub Console — redesign work list, by persona

Source design: `HalqaHub Console.dc.html` (Claude Design project *Quran center UI mockups*).

**Decisions taken**
- Drop Ant Design for a custom CSS system.
- Excluded: sidebar role switcher, demo login shortcut buttons, guardian messaging/notifications, certificates.
- Halqa `room` dropped — focus (Hifz/Tajweed) only.
- Student progress stores **the juz a student has finished**; no khatma / remaining-to-khatma maths.
- **Tasmee stays exactly as built today** — no `type` enum, no decimal grade, no free-text portion.

Sequencing is **not yet decided**. This is the inventory only.

Five groups. `Foundation` and `Staff` are shared — the design uses one screen for both Admin and
Sheikh with different scoping, so duplicating them per persona would overstate the work.

| Group | Personas | BE | FE |
|---|---|---|---|
| 0 · Foundation | all | 3 | 4 |
| 1 · Staff console | Admin + Sheikh | 5 | 7 |
| 2 · Admin | Admin | 3 | 4 |
| 3 · Sheikh | Sheikh | 2 | 3 |
| 4 · Student | Student | 3 | 5 |

---

# Group 0 — Foundation (every persona)

## Backend

### B1. Halqa — structured schedule
`schedule` is a free `String`, so the server cannot answer *"which circles meet today?"* — needed by
the staff dashboard **and** the student's "next circle".
- add `daysOfWeek` (set of `DayOfWeek`, join table or CSV column)
- add `startTime` (`LocalTime`)
- decide whether the free-text `schedule` column survives
- migration for existing rows

### B2. Halqa — focus
- `kind` focus enum: `HIFZ` | `TAJWEED`, exposed on `HalqaResponse`
- ~~`room`~~ — dropped

### B5. Student — finished juz
No juz field exists anywhere, and the juz map renders it on three screens.

- store the juz a student has finished
- **recommendation: a set of completed juz numbers, not a single count.** Memorization is often
  non-sequential — Juz 30 (ʿAmma) first, then 29, 28 — so a count of `3` cannot say *which* three.
  A `Set<Integer>` renders the design's 30-cell map exactly and stays honest about real progress.
  A single `memorizedJuz` Integer is simpler but assumes 1→30 order. **Your call.**
- likely shape: `student_completed_juz (student_id, juz_number)` join table
- no khatma percentage, no remaining-to-khatma, no milestone maths

**⚠️ Open: how does a juz get marked finished?** Tasmee is unchanged, so recording a session can no
longer advance progress implicitly — and the design has no UI for editing it (the mockup treats juz
as a static field). Something has to set it. Options: clickable cells on the juz map, a field in the
student edit form, or a small dedicated endpoint. This needs an answer before F7 is built.

### ~~B7. Tasmee — type and grade scale~~ — **dropped**
Tasmee stays as built: structured `fromSurah`/`fromAyah`/`toSurah`/`toAyah`, `Integer` grade
`@Min(0) @Max(10)`, `mistakes`, `sheikhNotes`. Consequences for the FE are recorded in F7 and F12a.

## Frontend

### F0. Design system
- remove `antd` + `@ant-design/icons`, purge every import
- fonts: Cormorant Garamond (headings), IBM Plex Sans (UI), IBM Plex Mono (numerals), Amiri (Arabic)
- `src/styles/tokens.css`
- `src/components/ui/`: `Button`, `Card`, `Pill`, `Segmented`, `StatTile`, `DataTable`, `Modal`,
  `Input`, `Select`, `ProgressBar`, `Avatar`, `EmptyState`
- toast system replacing AntD `message` — bottom-centre dark pill, ~2.6s

| Role | Tokens |
|---|---|
| Green | `#143528` shell · `#1E4D3B` primary · `#8FA79A` `#9DBBAC` `#6E877B` `#B9C9C0` on-dark text |
| Gold | `#B98B2E` accent · `#E9D8A6` `#F3E7C9` `#F6E9CC` · `#8A6516` gold text |
| Cream | `#F6F1E6` app bg · `#EFE9DC` · `#FFFDF8` panel · `#FBF8F1` hover |
| Border | `#E6DCC8` · `#EFE7D6` · `#F2ECDE` · `#DDD2BB` · `#D8CDB6` |
| Text | `#2B2318` · `#5A4E3C` · `#7A6E5C` · `#9C907C` · `#B5A992` |
| Danger | `#A2563C` · `#F5E3DC` · `#F7E7E0` · `#E4C4B6` · `#8C4630` |
| Success | `#E7EFE9` · `#EAF0EA` · `#BFD3C4` |

### F1. App shell — rewrite `AppLayout.jsx`
- 236px fixed dark sidebar, diamond pattern overlay at 8%
- logo tile + "HalqaHub" / "Al-Furqan Center" wordmark
- nav rows with count badges; active = green fill + 3px gold inset left bar
- bottom user block: gold initials circle, name, uppercase role, Exit
- sticky topbar: uppercase gold breadcrumb + serif page title
- route → `{crumb, title}` map, role-aware

### F2. Routing (`App.jsx`)
- new student routes `/my-progress`, `/my-homework`, `/my-attendance`
- student home: does `/dashboard` render the portal, or redirect to `/portal`? *(open)*
- **`/students` must open to `SHEIKH`** — admin-only today, but the design gives sheikhs *My students*

### F3. Login page
Split screen. Left: dark panel, pattern, logo, hadith in Amiri RTL + English attribution, splash
counts line. Right: serif *Sign in*, uppercase micro-labels, error banner, forgot-password note.
Demo account cards **excluded**.

---

# Group 1 — Staff console (Admin + Sheikh)

Same screens for both; Admin sees the whole centre, Sheikh sees only their own halqas.

## Backend

### B3. Halqa roll state for today
Drives `Roll saved` / `Today` / `Scheduled` on halqa cards and the dashboard.
- `GET /attendance/roll?halqaId&date` → exists + present/total tally
- or `rollSavedToday` / `presentToday` / `totalToday` on `HalqaResponse`

### B6. Student computed record fields
Rendered in the students table, profile hero and halqa roster.
- `averageGrade`, `attendanceRate`, `sheikhName` on `StudentResponse`
- **open:** computed per request, or denormalised columns kept fresh on write?

### B8. Attendance — save a whole roll
The design saves an entire circle at once and reports `N of M marked`; today's endpoint is one
student per call.
- `POST /attendance/roll` — `{ halqaId, sessionDate, entries: [{ studentId, status, notes }] }`
- idempotent re-save (a roll can be edited and saved again)
- `GET /attendance/roll?halqaId&date` to rehydrate

### B9. Student attendance window
Last 12 sessions with per-session status and note, plus present/late/absent tally and window rate.
- `GET /students/{id}/attendance?limit=12`
- reused self-scoped by the student portal (Group 4)

### B10. Homework review queue
- `GET /homework/pending-review`, scoped to the caller's halqas, with `daysWaiting`
- `PATCH /homework/{id}/status` → `REVIEWED` *(verify whether this already exists)*
- **open:** homework titles have the same free-text-vs-structured question the tasmee decision just
  settled. Recommend matching it — keep the structured columns, return a formatted display string.

## Frontend

### F4. Dashboard
4 stat tiles (mono numerals) · *Today's circles* with state pill + CTA deep-linking to attendance ·
*Needs your review* with Open + Mark reviewed + empty state · dark ayah card.

⚠️ *Closest to khatma* **removed** per the no-khatma decision. That panel filled the top of the
dashboard's right column, leaving only the ayah card there — the two-column grid will look
lopsided. Either widen the left column, move the ayah card up, or put something else in that slot.

### F5. Attendance
Halqa `<select>` + *Today* pill · *Mark all present* · *Save roll* · stacked present/late/absent bar
with four counts · roster rows (avatar, name, note, term rate, 3-way segmented control) · sticky
footer with autosave hint + *Clear roll* · save disabled until at least one mark.

### F6. Students list
Status filter pills (All/Active/Inactive/Suspended) · count label · card table: avatar + age +
guardian, halqa, juz, colour-graded avg, attendance, status pill · no-match empty state.

### F7. Student profile
Dark hero (back link, avatar, name, meta, *Record tasmee* CTA, 4 stats) · tabs Progress / Homework /
Attendance / Guardian · **juz map** (30 cells, 15 per row, finished / not finished + legend) ·
recent tasmee table · homework list with state pills · attendance tab (last 12, summary dots,
window rate) · guardian 2-col grid.

Deviations from the mockup:
- juz map legend loses *In progress* — there is no in-progress state without khatma maths, so it
  becomes a two-state map (unless B5's editing UI introduces one)
- tasmee table loses the **Type** column (no New/Review) and shows integer grades
- portion column renders from the structured surah/ayah fields, not a free-text string
- *Message guardian* button and certificates panel excluded

### F8. Halqas
Dismissible sheikh filter chip · 3-column cards: name, sheikh, state pill, schedule, enrolment bar
(gold when full), *View circle*. Card meta drops room.

### F9. Halqa detail
Dark hero: back, name, `sheikh · schedule · kind`, *Take attendance* CTA, 3 stats (enrolled / avg
grade / avg attendance). Roster table with per-row *Tasmee* button.

### F12a. Record tasmee modal
**Reshaped from the mockup** — the design's single *Portion recited* text field and New/Review
segmented control don't exist in our model. Real fields: session date, from surah + ayah, to surah +
ayah, grade (0–10 integer), mistakes, sheikh notes. Keeps the design's chrome: serif title + sub,
uppercase micro-labels, inline error banner, cream footer bar.

---

# Group 2 — Admin only

## Backend

### B4. Sheikh teaching profile
- `ijazah` / riwayah (enum or String: Hafs ʿan ʿAsim, Warsh ʿan Nafiʿ, Qalun ʿan Nafiʿ, Al-Duri ʿan Abi ʿAmr)
- `onLeave` boolean → *On leave* standing badge
- `SheikhResponse` gains `halqaNames`, `studentCount`, `averageGrade`
- *You* badge needs no backend work — FE compares against the JWT subject

### B11a. Admin dashboard payload
`AdminDashboardResponse` covers none of what the screen renders.
- today's circles: name, time, kind, student count, roll state
- review queue (B10)
- attendance today %, rolls saved / rolls due
- tasmee this week, average grade
- ~~top 5 closest to khatma~~ — dropped

### B4b. Create-request DTOs
`CreateHalqaRequest` / `CreateSheikhRequest` / `CreateStudentRequest` need the new fields from
B1, B2, B4, B5 — plus validation matching the design (capacity 1–60, age 4–80, password ≥ 6,
username uniqueness).

## Frontend

### F10. Sheikhs page
Count label · *Add sheikh* · table: avatar, name, phone + since, halqa count + names, riwayah,
students, avg, standing badge (You / On leave / Active) · row click filters Halqas by that sheikh.

### F12b. Create modals
- **Add student** — 2-col grid: full name (span 2), username, temp password, phone, age, guardian
  name, guardian phone, address (span 2), halqa select, status segmented
- **Add sheikh** — full name, username, temp password, phone, riwayah select
- **Add halqa** — name, sheikh select, capacity, schedule, focus segmented (no Room select)

### F13. Halqa schedule input
Rework `src/constants/halqaSchedule.js` once B1 lands: display format becomes
`Sat · Mon · Wed, 8:00 AM`, and the form posts structured `daysOfWeek` + `startTime` instead of a
joined string.

### F14. Admin-only gating
*Add student*, *Add sheikh*, *Add halqa* render behind `canManage` — Admin only in the design.
Sheikhs see the same screens without the create buttons.

---

# Group 3 — Sheikh only

## Backend

### B12. Scope `GET /students` for SHEIKH
Currently admin-only, but the design gives sheikhs *My students* — every student across the halqas
they teach. Same for the halqas list and the review queue.

### B11b. Sheikh dashboard payload
Same shape as B11a but scoped to the sheikh's own halqas: my students count, my halqas, attendance
today across my circles, my review queue.

## Frontend

### F15. Scoped nav + copy
Nav reads *My students* / *My halqas* with counts scoped to the sheikh; dashboard greets by name and
the first stat tile reads *My students* rather than *Students*; halqas page title is *My halqas*.

### F16. Sheikh scoping in shared screens
Students, Halqas, Attendance and the dashboard all filter to the caller's halqas — the halqa
`<select>` on Attendance lists only their circles.

### F17. Create buttons hidden
See F14 — the same screens, minus the create affordances.

---

# Group 4 — Student only

Read-only throughout. No search in the topbar.

## Backend

### B13. Today's portion  ⚠️ new gap
The portal header and topbar pill show *Today's portion: Al-Kahf 1–20 · set by {sheikh}*. **There is
no backend concept for this at all.** Options:
- derive it from the homework due today, or
- add a per-halqa daily portion the sheikh sets, or
- drop the feature

### B11c. Student portal payload
- next session: halqa name, time, schedule, sheikh
- finished juz, attendance rate, average grade, homework due count
- recent tasmee list, homework list
- today's portion (B13)

### B9-self. Own attendance window
Same endpoint as B9, self-scoped — a student may only read their own record.

## Frontend

### F11a. Portal home
Dark next-circle card with today's-portion panel · 4 stat tiles · juz map · recent tasmee ·
homework · ayah footer strip. Stat sub-lines drop *of 30 · X% complete*.

### F11b. My progress
Juz map + full graded session history.

### F11c. My homework
Assigned list with due dates and state pills.

### F11d. My attendance
Last 12 sessions + summary dots + window rate.

### F18. Student topbar
*Today's portion: …* gold pill; search input hidden.

---

# Open decisions

1. **B5** — set of finished juz numbers, or a single `memorizedJuz` count?
2. **B5** — how does a juz get marked finished, now that tasmee no longer implies it?
3. **B6** — computed on read vs denormalised columns.
4. **B10** — homework titles: structured columns + formatted string (matching the tasmee decision), or free text?
5. **B13** — where does "today's portion" come from, or is it dropped?
6. **F4** — what fills the dashboard's right column now that *Closest to khatma* is gone?
7. **F2** — does `/dashboard` render the portal for students, or redirect to `/portal`?
8. Fonts — self-hosted or CDN.
9. Sequencing — BE-first, FE-first with stubs, or vertical slices per screen.
