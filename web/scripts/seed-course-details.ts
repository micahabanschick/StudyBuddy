/**
 * Seeds / updates BIO 1107 and CHEM 1128Q with complete lecture + lab
 * schedule, section info, and instructor profiles.
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

const BIO_MD = `# BIO 1107 — Principles of Biology I
**Summer 2026 · UConn Downtown Hartford (DWTN)**

---

## Lecture Schedule

| Field | Info |
|-------|------|
| Meeting dates | June 1, 2026 – July 2, 2026 |
| Days | Monday, Tuesday & Wednesday |
| Time | 10:00 AM – 12:30 PM |
| Room | DWTN 215 |
| Instructor | Nicole Fusco |
| Section | LEC-Section 810 |
| Class # | 1385 |
| Status | Open |

## Lab Schedule

| Field | Info |
|-------|------|
| Meeting dates | June 1, 2026 – July 2, 2026 |
| Days | Thursday & Friday |
| Time | 10:00 AM – 2:00 PM |
| Room | DWTN 205 |
| Instructors | Nicole Fusco, Jonathan Gilbert |
| Section | LAB-Section 810L |
| Class # | 1384 |
| Status | Open |

---

## Instructors

### Nicole Fusco
- **Title:** Assistant Professor-in-Residence, Ecology & Evolutionary Biology
- **Email:** nicole.fusco@uconn.edu
- **Home campus:** UConn Stamford, Room 361
- **Teaches:** Lecture + Lab (BIO 1107)

### Jonathan Gilbert
- **Title:** Instructor-in-Residence, Molecular & Cell Biology
- **Email:** jonathan.gilbert@uconn.edu
- **Phone:** 860-405-9152
- **Home campus:** UConn Stamford, Room 206
- **Recognition:** 2024–2025 Faculty Recognition Award
- **Teaches:** Lab only (BIO 1107)

---

## Grading

| Component | Weight |
|-----------|--------|
| 4 Exams (50 questions MCQ each) | 50% |
| Laboratory | 45% |
| Topic Multiple-Choice Questions | 5% |

> Lab attendance is mandatory. More than one unexcused lab absence → F for the entire course.

## Required Materials
- *A Life Story: Animal Biological Engineering* — Dr. Thomas D. Abbott (Top Hat Publishing)
- *BIOL 1107 NextGen Biology Laboratory Manual* — Dr. Christopher Malinoski
- HuskyCT: [lms.uconn.edu](https://lms.uconn.edu)

## Key Course Objectives
1. Structure leads to function in living systems (core organizing principle)
2. Modern biotechnology methods — Gel Electrophoresis
3. Scientific Method — definition, hypothesis testing, misapplications
4. Analyzing scientific literature for integrity of claims
`

const CHEM_MD = `# CHEM 1128Q — General Chemistry II
**Summer 2026 · UConn Downtown Hartford (DWTN)**

---

## Lecture Schedule

| Field | Info |
|-------|------|
| Meeting dates | July 13, 2026 – August 21, 2026 |
| Days | Tuesday, Wednesday & Thursday |
| Time | 10:00 AM – 12:00 PM |
| Room | DWTN 225 |
| Instructor | Edward Neth |
| Section | LEC-Section 880 |
| Class # | 1405 |
| Status | Closed |

## Lab Schedule

| Field | Info |
|-------|------|
| Meeting dates | July 13, 2026 – August 21, 2026 |
| Days | Tuesday & Thursday |
| Time | 1:15 PM – 4:15 PM |
| Room | DWTN 243 |
| Instructor | Edward Neth |
| Section | LAB-Section 880L |
| Class # | 1390 |
| Status | Closed |

---

## Instructor — Edward Neth

- **Title:** Regional Faculty Liaison and Lecturer, Department of Chemistry
- **Email:** edward.neth@uconn.edu
- **Phone:** (203) 251-9535
- **Home campus:** UConn Stamford, Room 3.63 · 1 University Place, Stamford CT 06901
- **Education:** Ph.D. & M.S. — UConn (Inorganic/Materials Chemistry); B.S. — Fairfield University (1985)
- **Textbooks:** Co-author of *Chemistry: Principles and Reactions* (7th ed.) and OpenStax *Chemistry: Atoms First 2e* (free at [openstax.org](https://openstax.org/details/books/chemistry-2e))
- **Teaches:** Lecture + Lab (CHEM 1128Q)

---

## Grading (Summer reference)

| Component | Points |
|-----------|--------|
| Exams 1–4 | 400 |
| Lab course | 160 |
| Homework (Aktiv Chemistry) | 80 |
| Final Exam (cumulative) | 160 |
| **Total** | **800** |

> More than one unexcused lab absence → F for the course regardless of lecture grade.

## Required Materials
- *Chemistry 2e* — OpenStax (free): [openstax.org](https://openstax.org/details/books/chemistry-2e)
- Aktiv Chemistry (one-semester activation — links on HuskyCT)
- Calculator with LOG and LN keys, scientific notation capable
- Approved safety goggles

## Course Topics
| Week | Chapters |
|------|---------|
| 1 | CH 11 (Solutions), CH 12 |
| 2 | CH 13 (Kinetics), CH 14 (Equilibrium) |
| 3 | CH 14 continued |
| 4 | CH 15 (Acid/Base), CH 16 (Buffers) |
| 5 | CH 17 (Electrochemistry) |
| 6 | CH 17 + Final Exam |

HuskyCT: [lms.uconn.edu](https://lms.uconn.edu) — check daily for announcements.
`

async function main() {
  console.log('Updating BIO 1107 course overview note...')
  await db.note.upsert({
    where: { id: 'bio-n-overview' },
    update: { title: 'Course Overview & Schedule', contentMd: BIO_MD },
    create: { id: 'bio-n-overview', courseId: BIO_ID, topicId: null, title: 'Course Overview & Schedule', contentMd: BIO_MD },
  })

  console.log('Updating CHEM 1128Q course overview note...')
  await db.note.upsert({
    where: { id: 'chem-n-overview' },
    update: { title: 'Course Overview & Schedule', contentMd: CHEM_MD },
    create: { id: 'chem-n-overview', courseId: CHEM_ID, topicId: null, title: 'Course Overview & Schedule', contentMd: CHEM_MD },
  })

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
