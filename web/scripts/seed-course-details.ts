/**
 * Updates BIO 1107 and CHEM 1128Q with actual schedule, section info,
 * and instructor profiles from the enrollment screenshots.
 *
 * Run: SEED_USER_ID=<uuid> tsx scripts/seed-course-details.ts
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const BIO_ID = 'seed-bio-1107'
const CHEM_ID = 'seed-chem-1128q'

const BIO_OVERVIEW_NOTE = {
  id: 'bio-n-overview',
  topicId: null as string | null,
  title: 'Course Overview & Schedule',
  contentMd: `# BIO 1107 — Principles of Biology I
**Summer 2026 · UConn Downtown Hartford (DWTN)**

---

## Section Details

| Field | Info |
|-------|------|
| Component | LAB — Section 810L |
| Class # | 1384 |
| Status | Open |
| Format | Lecture + 3-hour lab each week |
| Credits | 4 |

## Lab Schedule

| Field | Info |
|-------|------|
| Meeting dates | June 1, 2026 – July 2, 2026 |
| Days | Thursday & Friday |
| Time | 10:00 AM – 2:00 PM |
| Room | DWTN 205 |
| Instructors | Nicole Fusco, Jonathan Gilbert |

---

## Instructors

### Nicole Fusco
- **Title:** Assistant Professor-in-Residence, Ecology & Evolutionary Biology
- **Email:** nicole.fusco@uconn.edu
- **Home campus:** UConn Stamford, Room 361
- **Courses:** BIO 1107 (Principles of Biology I)

### Jonathan Gilbert
- **Title:** Instructor-in-Residence, Molecular & Cell Biology
- **Email:** jonathan.gilbert@uconn.edu
- **Phone:** 860-405-9152
- **Home campus:** UConn Stamford, Room 206
- **Courses:** BIO 1107 (Principles of Biology I)
- **Recognition:** 2024–2025 Faculty Recognition Award; involved in community food pantry projects

---

## Grading (Spring 2024 syllabus)

| Component | Weight |
|-----------|--------|
| 4 Exams (50 questions MCQ each) | 50% |
| Laboratory | 45% |
| Topic Multiple-Choice Questions | 5% |

> Lab attendance is mandatory. More than one unexcused absence in the lab → F for the course.

## Required Materials
- *A Life Story: Animal Biological Engineering* — Dr. Thomas D. Abbott (Top Hat Publishing)
- *BIOL 1107 NextGen Biology Laboratory Manual* — Dr. Christopher Malinoski (Top Hat Publishing)

## Exam Dates (Spring 2024 reference — confirm with instructor)
- Exam I · Exam II · Exam III · Exam IV (four exams covering 1/4 of material each)
- HuskyCT: [lms.uconn.edu](https://lms.uconn.edu)

---

## Key Course Objectives
1. Structure leads to function in living systems (core organizing principle)
2. Modern biotechnology methods — Gel Electrophoresis
3. Scientific Method — definition, hypothesis testing, misapplications
4. Analyzing scientific literature for integrity of claims
`,
}

const CHEM_OVERVIEW_NOTE = {
  id: 'chem-n-overview',
  topicId: null as string | null,
  title: 'Course Overview & Schedule',
  contentMd: `# CHEM 1128Q — General Chemistry II
**Summer 2026 · UConn Downtown Hartford (DWTN)**

---

## Section Details

| Field | Info |
|-------|------|
| Component | LAB — Section 880L |
| Class # | 1390 |
| Status | Closed |
| Format | Lecture + 3-hour lab each week |
| Credits | 4 |
| Prerequisite | CHEM 1127Q, 1137Q, or 1147Q |

## Lab Schedule

| Field | Info |
|-------|------|
| Meeting dates | July 13, 2026 – August 21, 2026 |
| Days | Tuesday & Thursday |
| Time | 1:15 PM – 4:15 PM |
| Room | DWTN 243 |
| Instructor | Edward Neth |

---

## Instructor — Edward Neth

- **Title:** Regional Faculty Liaison and Lecturer, Department of Chemistry
- **Email:** edward.neth@uconn.edu
- **Phone:** (203) 251-9535
- **Home campus:** UConn Stamford, Room 3.63 · 1 University Place, Stamford CT 06901
- **Education:**
  - Ph.D. & M.S. — UConn (Inorganic / Materials Chemistry)
  - B.S. Chemistry (minor Politics) — Fairfield University, 1985
- **Courses:** CHEM 1128Q and other general/inorganic chemistry courses
- **Textbooks:**
  - Co-author, *Chemistry: Principles and Reactions* (7th edition)
  - Contributor/editor, *Chemistry: Atoms First 2e* (OpenStax — free open-access textbook at [openstax.org](https://openstax.org/details/books/chemistry-2e))

> Prof. Neth co-created one of the main open-source General Chemistry textbooks used nationwide. The OpenStax *Chemistry 2e* book is the free alternative to a paid textbook for this course.

---

## Grading (Summer 2023 reference — confirm with instructor)

| Component | Points |
|-----------|--------|
| Exams 1–4 | 400 |
| Lab course | 160 |
| Homework (Aktiv Chemistry) | 80 |
| Final Exam (cumulative, Ch 11–17) | 160 |
| **Total** | **800** |

> More than one unexcused lab absence → F for the course regardless of lecture grade.

## Required Materials
- *Chemistry 2e* — OpenStax (free): [openstax.org](https://openstax.org/details/books/chemistry-2e)
- Aktiv Chemistry (one-semester activation — check HuskyCT)
- Calculator with LOG and LN keys, scientific notation capable
- Approved safety goggles

## Course Topics (Chapters)
| Week | Chapters |
|------|---------|
| 1 | CH 11 (Solutions), CH 12 |
| 2 | CH 13 (Kinetics), CH 14 (Equilibrium) |
| 3 | CH 14 continued |
| 4 | CH 15 (Acid/Base), CH 16 (Buffers) |
| 5 | CH 17 (Electrochemistry) |
| 6 | CH 17 + Final Exam |

## HuskyCT
[lms.uconn.edu](https://lms.uconn.edu) — check daily for announcements.
`,
}

async function main() {
  console.log('Updating BIO 1107 — adding overview note...')
  await db.note.upsert({
    where: { id: BIO_OVERVIEW_NOTE.id },
    update: { title: BIO_OVERVIEW_NOTE.title, contentMd: BIO_OVERVIEW_NOTE.contentMd },
    create: {
      id: BIO_OVERVIEW_NOTE.id,
      courseId: BIO_ID,
      topicId: null,
      title: BIO_OVERVIEW_NOTE.title,
      contentMd: BIO_OVERVIEW_NOTE.contentMd,
    },
  })

  console.log('Updating CHEM 1128Q — adding overview note...')
  await db.note.upsert({
    where: { id: CHEM_OVERVIEW_NOTE.id },
    update: { title: CHEM_OVERVIEW_NOTE.title, contentMd: CHEM_OVERVIEW_NOTE.contentMd },
    create: {
      id: CHEM_OVERVIEW_NOTE.id,
      courseId: CHEM_ID,
      topicId: null,
      title: CHEM_OVERVIEW_NOTE.title,
      contentMd: CHEM_OVERVIEW_NOTE.contentMd,
    },
  })

  // Update course term to be more precise
  await db.course.update({
    where: { id: BIO_ID },
    data: { term: 'Summer 2026 · Jun 1–Jul 2' },
  })
  await db.course.update({
    where: { id: CHEM_ID },
    data: { term: 'Summer 2026 · Jul 13–Aug 21' },
  })

  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect().then(() => pool.end()))
