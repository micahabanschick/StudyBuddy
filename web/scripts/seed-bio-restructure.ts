/**
 * Restructures BIOL 1107 to match Dr. Fusco's Summer 2025 Campbell Biology 12th Ed. syllabus.
 *
 * 1. Renames course code BIO 1107 → BIOL 1107
 * 2. Upserts 26 chapter-aligned topics
 * 3. Updates topicIds on 8 existing notes
 * 4. Deletes orphaned topics bio-t-04, bio-t-05
 * 5. Creates 21 new chapter notes with embedded OpenStax Biology 2e figures
 * 6. Updates bio-n-overview (grading, schedule, textbook)
 * 7. Creates 12 quiz-prep flashcard decks (15 cards each)
 *
 * Run: DATABASE_URL=... tsx scripts/seed-bio-restructure.ts
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
const adapter = new PrismaPg(pool)
const db = new PrismaClient({ adapter })

const BIO_ID = 'seed-bio-1107'
const CDN = 'https://openstax.org/apps/image-cdn/v1/f=webp/apps/archive/20260407.195030/resources/'

// ─────────────────────────────────────────────────────────────────────────────
// 26 CHAPTER-ALIGNED TOPICS
// ─────────────────────────────────────────────────────────────────────────────

const TOPICS = [
  { id: 'bio-t-01', title: 'Ch 1 — Evolution, Themes & Scientific Inquiry',       position: 0  },
  { id: 'bio-t-02', title: 'Ch 2 — Chemical Context of Life',                      position: 1  },
  { id: 'bio-t-22', title: 'Ch 3 — Water and Life',                                position: 2  },
  { id: 'bio-t-23', title: 'Ch 4 — Carbon & Molecular Diversity',                  position: 3  },
  { id: 'bio-t-03', title: 'Ch 5 — Macromolecules',                                position: 4  },
  { id: 'bio-t-24', title: 'Ch 6 — A Tour of the Cell',                            position: 5  },
  { id: 'bio-t-07', title: 'Ch 7 — Membrane Structure & Function',                 position: 6  },
  { id: 'bio-t-09', title: 'Ch 8 — Introduction to Metabolism & Enzymes',          position: 7  },
  { id: 'bio-t-10', title: 'Ch 9 — Cellular Respiration & Fermentation',           position: 8  },
  { id: 'bio-t-11', title: 'Ch 12 — Cell Cycle & Mitosis',                         position: 9  },
  { id: 'bio-t-14', title: 'Ch 13 — Meiosis & Sexual Life Cycles',                 position: 10 },
  { id: 'bio-t-13', title: 'Ch 16 — Molecular Basis of Inheritance',               position: 11 },
  { id: 'bio-t-17', title: 'Ch 17 — From Gene to Protein',                         position: 12 },
  { id: 'bio-t-16', title: 'Ch 19 — Viruses',                                      position: 13 },
  { id: 'bio-t-15', title: 'Ch 20 — Biotechnology',                                position: 14 },
  { id: 'bio-t-25', title: 'Ch 40 — Animal Form & Function',                       position: 15 },
  { id: 'bio-t-06', title: 'Ch 41 — Nutrition & Digestion',                        position: 16 },
  { id: 'bio-t-18', title: 'Ch 42 — Circulatory System',                           position: 17 },
  { id: 'bio-t-08', title: 'Ch 42 — Respiratory System',                           position: 18 },
  { id: 'bio-t-12', title: 'Ch 43 — Excretory System',                             position: 19 },
  { id: 'bio-t-21', title: 'Ch 44 — Immune System',                                position: 20 },
  { id: 'bio-t-19', title: 'Ch 45 — Endocrine System',                             position: 21 },
  { id: 'bio-t-26', title: 'Ch 46 — Reproduction',                                 position: 22 },
  { id: 'bio-t-27', title: 'Ch 48 — Neurons, Synapses & Signaling',               position: 23 },
  { id: 'bio-t-20', title: 'Ch 49 — Nervous System',                               position: 24 },
  { id: 'bio-t-28', title: 'Ch 50 — Sensory & Motor Mechanisms',                   position: 25 },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXISTING NOTE TOPIC REASSIGNMENTS
// ─────────────────────────────────────────────────────────────────────────────

const NOTE_TOPIC_UPDATES: Array<{ id: string; topicId: string }> = [
  { id: 'bio-n-01', topicId: 'bio-t-03' }, // Organic Molecules → Ch 5
  { id: 'bio-n-02', topicId: 'bio-t-03' }, // Proteins → Ch 5
  { id: 'bio-n-03', topicId: 'bio-t-13' }, // Nucleic Acids → Ch 16
  { id: 'bio-n-04', topicId: 'bio-t-03' }, // Carbs & Lipids → Ch 5
  { id: 'bio-n-05', topicId: 'bio-t-09' }, // Enzymes → Ch 8 (no change)
  { id: 'bio-n-06', topicId: 'bio-t-10' }, // Respiration → Ch 9 (no change)
  { id: 'bio-n-07', topicId: 'bio-t-13' }, // DNA Structure → Ch 16 (no change)
  { id: 'bio-n-08', topicId: 'bio-t-17' }, // Protein Synthesis → Ch 17 (no change)
]

// ─────────────────────────────────────────────────────────────────────────────
// NEW NOTES — bio-n-09 through bio-n-29
// ─────────────────────────────────────────────────────────────────────────────

const N09_CH1 = `# Ch 1 — Evolution, Themes & Scientific Inquiry
*Campbell Biology 12th Ed. · Chapter 1*

---

## Properties of Life

All living things share eight properties:

| Property | Description | Example |
|----------|-------------|---------|
| **Order** | Complex, organized structure | Cell organelles |
| **Evolutionary adaptation** | Traits that improve survival | Camouflage coloring |
| **Response to environment** | Reacts to stimuli | Plant turning toward light |
| **Regulation (homeostasis)** | Maintains internal balance | Blood sugar control |
| **Energy processing** | Uses and transforms energy | Cellular respiration |
| **Growth & development** | Increases in size, specializes | Embryo → organism |
| **Reproduction** | Produces offspring | Mitosis, meiosis |
| **Biological evolution** | Populations change over generations | Antibiotic resistance |

---

## Levels of Biological Organization

From smallest to largest:

**Molecule → Organelle → Cell → Tissue → Organ → Organ System → Organism → Population → Community → Ecosystem → Biosphere**

> **Core theme:** Structure determines function at every level of organization.

---

## Darwin's Theory of Natural Selection

Four observations/inferences:
1. **Variation** — individuals in a population differ in heritable traits
2. **Overproduction** — more offspring are produced than can survive
3. **Differential survival** — individuals with favorable traits survive and reproduce more
4. **Adaptation** — favorable traits become more common over generations

Evolution = change in allele frequencies in a population over time.

![Figure 1.16 — Phylogenetic tree showing the three domains of life: Bacteria, Archaea, and Eukarya, reflecting evolutionary relationships.](${CDN}c1d242cd4ab1c5cea605d9074da958c8a9ee62d3)

*Figure 1.16 — All life shares a common ancestor; branches represent evolutionary divergence.*

---

## The Scientific Method

| Step | Description |
|------|-------------|
| **Observation** | Noticing a phenomenon |
| **Question** | What explains it? |
| **Hypothesis** | Testable, falsifiable prediction (if/then format) |
| **Prediction** | Expected outcome if hypothesis is true |
| **Experiment** | Controlled test; one independent variable at a time |
| **Conclusion** | Support or reject hypothesis; share and peer review |

- **Inductive reasoning** — specific observations → broad generalization (most scientific discovery)
- **Deductive reasoning** — general principle → specific prediction (hypothesis testing)

![Figure 1.7 — The scientific method: a series of well-defined steps. A rejected hypothesis leads to a revised hypothesis.](${CDN}9aa61725c0d4e976f8913875044720987232aa1a)

*Figure 1.7 — Science is iterative; rejected hypotheses drive new questions.*

![Figure 1.10 — Scientists use both inductive reasoning (specific → general) and deductive reasoning (general → specific prediction).](${CDN}74d85631b95b42ac995c6271a6bf3b8c2f437606)

*Figure 1.10 — Both reasoning strategies are essential to scientific inquiry.*

> **Exam tip:** A hypothesis must be falsifiable. A theory in science is a well-substantiated explanation supported by extensive evidence — NOT a guess.
`

const N10_CH2 = `# Ch 2 — Chemical Context of Life
*Campbell Biology 12th Ed. · Chapter 2*

---

## Atomic Structure

All matter is made of **atoms** — the smallest unit of an element.

| Particle | Location | Charge | Mass |
|----------|----------|--------|------|
| **Proton** | Nucleus | +1 | ~1 dalton |
| **Neutron** | Nucleus | 0 | ~1 dalton |
| **Electron** | Orbitals | −1 | ~0 (negligible) |

- **Atomic number** = # protons (defines the element)
- **Mass number** = protons + neutrons
- **Isotopes** = same element, different neutron count; radioactive isotopes used in research (e.g., ¹⁴C for carbon dating, ³²P to label DNA)

![Figure 2.2 — Atomic structure of helium: 2 protons and 2 neutrons in nucleus; 2 electrons in the 1st orbital shell.](${CDN}7c45adfc64c83df97a28e2339c45504cede5c51f)

*Figure 2.2 — Protons give each element its identity; electrons determine reactivity.*

---

## Electron Shells & Valence Electrons

- Shell 1: holds 2 electrons
- Shell 2–3: hold up to 8 electrons each
- **Valence shell** = outermost shell; determines bonding behavior
- **Octet rule** — atoms gain, lose, or share electrons to fill their valence shell (8 electrons = stable)

| Element | Atomic # | Valence electrons | Bonds formed |
|---------|----------|-------------------|--------------|
| H | 1 | 1 | 1 |
| C | 6 | 4 | 4 |
| N | 7 | 5 | 3 |
| O | 8 | 6 | 2 |

![Figure 2.9 — Periodic table excerpt showing atomic number and mass for biologically important elements.](${CDN}8fd8eec6fc1a0ccdacba65824f831afdc6555c19)

*Figure 2.9 — The periodic table organizes elements by atomic number and electron configuration.*

---

## Chemical Bonds

### Ionic Bonds
- One atom **transfers** electrons to another
- Creates ions (cations +, anions −)
- Example: NaCl (Na⁺ + Cl⁻)
- Weak in water (dissociates); strong in dry environments

### Covalent Bonds
- Atoms **share** electrons; strongest biological bond
- **Nonpolar covalent** — electrons shared equally (C–H, C–C); hydrophobic
- **Polar covalent** — unequal sharing due to electronegativity differences (O–H, N–H); hydrophilic
- **Electronegativity order:** O > N > C ≈ H

### Hydrogen Bonds
- Weak attraction between δ+ hydrogen and δ− electronegative atom (O or N) in a nearby molecule
- Individually weak but collectively powerful (e.g., holds DNA strands together, gives water its properties)

![Figure 2.11 — Covalent bond formation: two hydrogen atoms share electrons to form H₂.](${CDN}764726839cb8de785d05e3b8f26c2d7fe96172eb)

*Figure 2.11 — Sharing valence electrons fills both atoms' outer shells.*

> **Exam tip:** Electronegativity is O > N > C > H. When O bonds to H, the electrons spend more time near O (δ−), making H slightly positive (δ+) — this polarity drives hydrogen bonding and water's unique properties.
`

const N11_CH3 = `# Ch 3 — Water and Life
*Campbell Biology 12th Ed. · Chapter 3*

---

## Why Water? — Hydrogen Bonding

Water molecules (H₂O) are **polar** — oxygen is δ− and each hydrogen is δ+. This allows water molecules to form **hydrogen bonds** with each other and with other polar molecules.

![Figure 2.16 — Water polarity: the bent structure creates partial charges; hydrogen bonds form between adjacent molecules.](${CDN}54cdc44367e8c019bd73f0f8f8a1e89c79369866)

*Figure 2.16 — Each water molecule can form up to four hydrogen bonds.*

---

## Four Emergent Properties of Water

| Property | Explanation | Biological Importance |
|----------|-------------|----------------------|
| **Cohesion & Adhesion** | H-bonds hold water molecules together (cohesion) and to other surfaces (adhesion) | Water transport up plant xylem; surface tension |
| **Temperature moderation** | High specific heat (absorbs/releases large amounts of heat with small temp change) | Oceans and large bodies of water buffer climate |
| **Ice floats** | Hydrogen bonds in ice crystal are less dense than liquid water | Ice insulates aquatic ecosystems from freezing solid |
| **Universal solvent** | Polar water molecules surround and dissolve ionic and polar solutes | Biological reactions occur in aqueous solution |

![Figure 2.17 — Ice lattice structure: hydrogen bonds hold water molecules farther apart than in liquid water, making ice less dense.](${CDN}58f7ad26f6b8a528481c7e0a6a8b79c68d1782c5)

*Figure 2.17 — Ice floating on water is ecologically critical.*

![Figure 2.19 — Hydration shells: water molecules surround Na⁺ and Cl⁻ ions when NaCl dissolves, separating them.](${CDN}096d7ae47b2e5af098671182bffd2254062fd667)

*Figure 2.19 — Water's polarity makes it an excellent solvent for ionic and polar substances.*

---

## pH, Acids, and Bases

Water undergoes **autoionization**: H₂O ⇌ H⁺ + OH⁻ (Kw = 10⁻¹⁴)

$$pH = -\log_{10}[H^+]$$

- **Acid** — releases H⁺ (lowers pH below 7)
- **Base** — accepts H⁺ or releases OH⁻ (raises pH above 7)
- Each pH unit = 10× change in [H⁺]
- Human blood: pH 7.35–7.45

![Figure 2.21 — The pH scale from 0–14 with examples of common biological fluids and substances.](${CDN}7243590453e03848e7d35504b5cc6e211d89bf5a)

*Figure 2.21 — Blood (pH 7.4) is slightly basic; stomach acid (pH 2) is strongly acidic.*

---

## Buffers

A **buffer** is a solution that resists pH changes by accepting or donating H⁺.

**Carbonic acid–bicarbonate buffer** (blood):
CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻

- Excess H⁺ → shifts left (H⁺ removed)
- Too basic → shifts right (H⁺ added)

> **Exam tip:** Acidic = more H⁺ than OH⁻; basic (alkaline) = more OH⁻ than H⁺. A change from pH 7 to pH 6 represents a 10× increase in [H⁺], not just a one-unit change.
`

const N12_CH4 = `# Ch 4 — Carbon & Molecular Diversity
*Campbell Biology 12th Ed. · Chapter 4*

---

## Carbon: The Backbone of Life

Carbon has **4 valence electrons** and forms 4 covalent bonds — it can bond to H, O, N, S, and other carbons in chains, rings, and branched structures. This versatility creates the enormous diversity of organic molecules.

**Hydrocarbons** (C and H only) are nonpolar and hydrophobic. Biological molecules have carbon skeletons modified by functional groups.

---

## Functional Groups

| Group | Structure | Properties | Found in |
|-------|-----------|------------|---------|
| **Hydroxyl** | —OH | Polar, H-bonding; hydrophilic | Alcohols, sugars |
| **Carbonyl** | C=O | Polar; ketone (mid-chain) or aldehyde (end) | Sugars, steroids |
| **Carboxyl** | —COOH | **Acidic** — donates H⁺; polar | Amino acids, fatty acids |
| **Amino** | —NH₂ | **Basic** — accepts H⁺; polar | Amino acids, nucleotides |
| **Sulfhydryl** | —SH | Forms disulfide bonds | Cysteine, proteins |
| **Phosphate** | —OPO₃²⁻ | Acidic; stores/transfers energy | ATP, nucleic acids |
| **Methyl** | —CH₃ | Nonpolar; affects gene expression when added to DNA | DNA, proteins |

> **Exam tip:** An amino acid has BOTH a carboxyl (acidic) AND an amino (basic) group — making it amphoteric.

---

## Isomers — Same Formula, Different Structure

| Type | Definition | Example |
|------|-----------|---------|
| **Structural isomers** | Different arrangement of bonds | Glucose vs. fructose (both C₆H₁₂O₆) |
| **Geometric isomers** | Different arrangement around a C=C double bond | Cis-fat vs. trans-fat |
| **Enantiomers** | Mirror images (L vs. D forms) | L-alanine (biological) vs. D-alanine |

Enzymes are **stereospecific** — they recognize only one enantiomer.

---

## Building & Breaking Polymers

**Dehydration synthesis (condensation):** monomers joined → polymer + H₂O

**Hydrolysis:** polymer + H₂O → monomers

![Figure 3.2 — Dehydration synthesis: two glucose monomers are joined by a glycosidic bond with the release of a water molecule.](${CDN}17215ad494549d74bf598ac85103e23b09c4f627)

*Figure 3.2 — Building polymers always removes water; breaking them adds water.*

![Figure 3.3 — Hydrolysis is the reverse: addition of water breaks the glycosidic bond into monomers.](${CDN}bac340d3e94099ab5cf86f612177b6bc4c941ebd)

*Figure 3.3 — Digestion = enzymatic hydrolysis of macromolecules.*

![Figure 3.5 — Classification of monosaccharides: aldoses (carbonyl at C1) vs. ketoses (carbonyl at C2).](${CDN}40f7e2f1c807926c0c8ef13d8e3e358ad1eb02ff)

*Figure 3.5 — Glucose is an aldose; fructose is a ketose — both are C₆H₁₂O₆ structural isomers.*
`

const N13_CH6 = `# Ch 6 — A Tour of the Cell
*Campbell Biology 12th Ed. · Chapter 6*

---

## Prokaryotes vs. Eukaryotes

| Feature | Prokaryote | Eukaryote |
|---------|-----------|-----------|
| Nucleus | No (nucleoid region) | Yes (membrane-bound) |
| Size | 1–10 μm | 10–100 μm |
| DNA | Circular, no histones | Linear, with histones |
| Membrane organelles | None | Yes |
| Ribosomes | 70S | 80S (cytoplasm); 70S (mito/chloro) |
| Examples | Bacteria, Archaea | Plants, animals, fungi, protists |

![Figure 4.4 — Prokaryotic cell: DNA in nucleoid region, ribosomes, cell membrane, and (in most) a cell wall.](${CDN}50163f8ff80f335574f41bfc10cc49a1e87cf9df)

*Figure 4.4 — Prokaryotes lack a nucleus but are metabolically diverse.*

---

## Key Eukaryotic Organelles

### Nucleus
- Double membrane (nuclear envelope) with nuclear pores
- Contains DNA organized as chromatin; **nucleolus** assembles ribosomes
- Function: houses genetic information; directs cellular activity

### Endomembrane System
Pathway: Rough ER → transport vesicle → Golgi → secretory vesicle → plasma membrane or lysosome

| Organelle | Function |
|-----------|---------|
| **Rough ER** | Ribosomes attached; synthesizes membrane proteins and secretory proteins |
| **Smooth ER** | Lipid synthesis; drug/toxin detox; Ca²⁺ storage in muscle |
| **Golgi apparatus** | Modifies, packages, sorts proteins; has *cis* (receiving) and *trans* (shipping) faces |
| **Lysosomes** | Digest macromolecules; fuse with vacuoles or phagosomes (pH ≈ 5) |
| **Vacuoles** | Storage (plant central vacuole); turgor pressure; digestion (food vacuoles) |

### Energy Organelles
| Organelle | Function | Unique Features |
|-----------|---------|----------------|
| **Mitochondria** | Cellular respiration; ATP synthesis | Double membrane; cristae (inner); matrix; own circular DNA |
| **Chloroplasts** | Photosynthesis | Thylakoids (grana stacks); stroma; own DNA |

![Figure 4.8 — Typical animal cell and plant cell with labeled membrane-bound organelles.](${CDN}cc7c0da98dd7e0bb4de6e8ff7f79364434c2ce57)

*Figure 4.8 — Animal cells have centrosomes and lysosomes; plant cells have chloroplasts, central vacuole, and cell wall.*

![Figure 4.10 — Nucleus structure: double nuclear envelope, nuclear pores, nucleolus, and chromatin inside.](${CDN}de9726d2bc6b966f638a4dd00f3a899bb955c006)

*Figure 4.10 — Nuclear pores regulate traffic between nucleus and cytoplasm.*

![Figure 4.14 — Mitochondrion: outer membrane, inner membrane (cristae), intermembrane space, and matrix.](${CDN}00abe6130e466e45f70e9e3b98dca42bdcd1409a)

*Figure 4.14 — Cristae folds increase surface area for ATP synthesis.*

---

## Cytoskeleton

| Component | Diameter | Composition | Function |
|-----------|----------|-------------|---------|
| **Microtubules** | 25 nm | Tubulin dimers | Cell shape, tracks for motor proteins, spindle fibers |
| **Microfilaments (actin)** | 7 nm | Actin | Cell motility, muscle contraction, cytokinesis |
| **Intermediate filaments** | 8–12 nm | Various (keratin, etc.) | Structural support, anchor nucleus |

> **Exam tip:** Mitochondria and chloroplasts have their own circular DNA and 70S ribosomes — evidence for **endosymbiotic theory** (ancient prokaryotes engulfed by a larger cell).
`

const N14_CH7 = `# Ch 7 — Membrane Structure & Function
*Campbell Biology 12th Ed. · Chapter 7*

---

## The Fluid Mosaic Model

The plasma membrane is a **phospholipid bilayer** with embedded proteins, cholesterol, glycolipids, and glycoproteins. It is:
- **Fluid** — phospholipids move laterally; membrane is not rigid
- **Mosaic** — various proteins are embedded throughout

**Phospholipid structure:** hydrophilic head (glycerol + phosphate) faces water; two hydrophobic fatty acid tails point inward.

![Figure 5.2 — Fluid mosaic model: phospholipid bilayer with integral and peripheral proteins, cholesterol, and carbohydrate chains.](${CDN}52bfcab8c986c794f20141487ae15a68f1ac7ac4)

*Figure 5.2 — Integral proteins span the bilayer; peripheral proteins attach to the surface.*

![Figure 5.3 — Phospholipid molecule: hydrophilic head (glycerol + phosphate) and two hydrophobic hydrocarbon tails.](${CDN}c26a0c1bfcf4afb4693bcd93c9375c12686672bc)

*Figure 5.3 — Phospholipids spontaneously form bilayers in water.*

**Membrane fluidity** is regulated by:
- **Unsaturated fatty acids** (cis double bonds → kinks → more fluid)
- **Cholesterol** — buffers fluidity; prevents extremes (too rigid in cold, too fluid in heat)

---

## Selective Permeability & Passive Transport

The membrane is **selectively permeable** — small nonpolar molecules (O₂, CO₂) cross freely; large or charged molecules need help.

| Type | Mechanism | Energy | Examples |
|------|-----------|--------|---------|
| **Simple diffusion** | Through lipid bilayer | None | O₂, CO₂, small nonpolar |
| **Facilitated diffusion** | Channel or carrier proteins | None | Glucose, ions, water (aquaporins) |
| **Osmosis** | Water through aquaporins | None | Water moving down water potential |

**Osmosis** — movement of water from high water potential (low solute) to low water potential (high solute).

![Figure 5.11 — Osmosis: water moves across a semipermeable membrane from the side with lower solute concentration to the side with higher solute concentration.](${CDN}d985b82f4ac322a5c1b79be395b065d01ba84a72)

*Figure 5.11 — Osmosis is passive; no ATP needed.*

**Tonicity effects on animal cells:**
- **Hypotonic** solution → cell swells → lyses (cytolysis)
- **Isotonic** solution → no net water movement → normal
- **Hypertonic** solution → cell shrinks → crenation

![Figure 5.12 — Red blood cells in hypotonic, isotonic, and hypertonic solutions showing lysis, normal shape, and crenation.](${CDN}544869222299197c04f854f532422e3e3aeefba7)

*Figure 5.12 — Plant cells in hypotonic solution become turgid (good); animal cells lyse.*

---

## Active Transport & Bulk Transport

**Active transport** — moves solutes AGAINST their concentration gradient; requires ATP.

**Na⁺/K⁺ ATPase:** pumps 3 Na⁺ out and 2 K⁺ in per ATP hydrolyzed — maintains membrane potential.

| Bulk Transport | Direction | Mechanism |
|----------------|-----------|-----------|
| **Endocytosis** | Into cell | Membrane engulfs material |
| — Phagocytosis | | Solid particles ("cell eating") |
| — Pinocytosis | | Fluid droplets ("cell drinking") |
| — Receptor-mediated | | Specific molecules (LDL, insulin) |
| **Exocytosis** | Out of cell | Vesicle fuses with plasma membrane; secretes contents |

> **Exam tip:** Diffusion, facilitated diffusion, and osmosis are all **passive** (no ATP). Active transport and bulk transport require **ATP**. Osmosis is always about water; tonicity refers to the solute concentration of the surrounding solution.
`

const N15_CH9_FIGS = `# Ch 9 — Cellular Respiration: Pathways & Energy Diagrams
*Campbell Biology 12th Ed. · Chapter 9 — Supplemental Figures*

---

## Overview: Three Stages

C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~32 ATP

| Stage | Location | Inputs | Outputs |
|-------|----------|--------|---------|
| **Glycolysis** | Cytoplasm | Glucose (1×) | 2 Pyruvate, 2 net ATP, 2 NADH |
| **Pyruvate oxidation + Krebs cycle** | Mitochondrial matrix | 2 Pyruvate | 4 CO₂, 2 ATP, 6 NADH, 2 FADH₂ |
| **ETC + Oxidative phosphorylation** | Inner mitochondrial membrane | NADH, FADH₂, O₂ | ~28 ATP, H₂O |

---

## Glycolysis — Step by Step

Glycolysis splits one 6-carbon glucose into two 3-carbon pyruvate molecules in 10 enzymatic steps.

**Energy investment phase (steps 1–5):** 2 ATP used to phosphorylate glucose; glucose is split into two glyceraldehyde-3-phosphate (G3P) molecules.

**Energy payoff phase (steps 6–10):** 4 ATP produced + 2 NADH per glucose → net = **2 ATP + 2 NADH**.

![Figure 7.5 — Glycolysis overview: investment phase uses ATP to activate glucose; payoff phase produces ATP and NADH.](${CDN}fafd32072487bf1d3e8a0d71ae8179da0561625f)

*Figure 7.5 — No oxygen is needed; glycolysis occurs in all living cells.*

---

## Pyruvate Oxidation & Krebs Cycle

Each pyruvate enters the mitochondrial matrix → oxidized to acetyl-CoA (loses 1 CO₂, gains 1 NADH).

Acetyl-CoA (2C) + oxaloacetate (4C) → citrate (6C) → Krebs cycle completes, regenerating oxaloacetate.

**Per cycle (one turn):** 1 ATP, 3 NADH, 1 FADH₂, 2 CO₂ → **Per glucose (2 turns):** 2 ATP, 6 NADH, 2 FADH₂, 4 CO₂

![Figure 7.10 — Pyruvate oxidation: the pyruvate dehydrogenase complex converts pyruvate to acetyl-CoA, releasing CO₂ and forming NADH.](${CDN}189892a2e492714e5e91daa0ba12912a21ffd287)

*Figure 7.10 — Each glucose yields 2 acetyl-CoA entering the Krebs cycle.*

![Figure 7.11 — The citric acid cycle: 8 steps regenerate oxaloacetate while releasing CO₂ and reducing NAD⁺ and FAD.](${CDN}a84c5164820430e4fbb277e533da26ccdbba5490)

*Figure 7.11 — The Krebs cycle is a true cycle — oxaloacetate is regenerated each turn.*

---

## Electron Transport Chain & Chemiosmosis

NADH and FADH₂ donate electrons to the ETC (Complexes I–IV). Electrons are passed along and ultimately combine with O₂ and H⁺ to form water.

The energy released pumps H⁺ from the matrix into the intermembrane space → electrochemical gradient → H⁺ flow through **ATP synthase** → ATP synthesis (chemiosmosis).

**NADH → ~2.5 ATP; FADH₂ → ~1.5 ATP**

![Figure 7.12 — The electron transport chain: electrons from NADH/FADH₂ flow through protein complexes, pumping H⁺ across the inner membrane.](${CDN}13960959567cae51dab62cce59daade453ccfddf)

*Figure 7.12 — O₂ is the final electron acceptor; without it, the ETC stops.*

![Figure 7.14 — Oxidative phosphorylation: the proton gradient drives H⁺ through ATP synthase, producing ATP from ADP + Pᵢ.](${CDN}51448a57b43ca03f026f8d69fe0e788b3cf7e559)

*Figure 7.14 — Chemiosmosis couples the proton gradient to ATP synthesis.*

---

## Fermentation (Anaerobic)

When O₂ is absent: NADH cannot be oxidized by ETC → NAD⁺ must be regenerated by fermentation to keep glycolysis running.

| Type | Organisms | Reaction |
|------|-----------|---------|
| **Lactic acid** | Muscle cells, Lactobacillus | Pyruvate + NADH → Lactate + NAD⁺ |
| **Alcoholic** | Yeast, some bacteria | Pyruvate + NADH → Ethanol + CO₂ + NAD⁺ |

> **Exam tip:** Fermentation does NOT produce more ATP — it only regenerates NAD⁺ so glycolysis can continue yielding its 2 ATP. O₂ is the final electron acceptor in aerobic respiration, not in fermentation.
`

const N16_CH12 = `# Ch 12 — Cell Cycle & Mitosis
*Campbell Biology 12th Ed. · Chapter 12*

---

## The Cell Cycle

The cell cycle has two major phases:

**Interphase** (~90% of cycle time):
- **G₁ (Gap 1):** cell grows; normal metabolic activities; passes the restriction point to commit to division
- **S (Synthesis):** DNA replication; each chromosome duplicated into two sister chromatids joined at centromere
- **G₂ (Gap 2):** continued growth; cell prepares for mitosis

**Mitotic Phase (M):** mitosis + cytokinesis

![Figure 10.5 — The cell cycle: interphase occupies most of the cycle; the mitotic phase includes mitosis and cytokinesis.](${CDN}418e5abd3be4fb9a0f0f1c81b82f0d51f93c81d4)

*Figure 10.5 — A typical human cell completes the cell cycle in about 24 hours.*

---

## Mitosis — PMAT

| Phase | Key Events |
|-------|-----------|
| **Prophase** | Chromatin condenses → visible chromosomes; mitotic spindle begins forming from centrosomes; nucleolus disappears |
| **Prometaphase** | Nuclear envelope breaks down; spindle fibers attach to kinetochores on chromosomes |
| **Metaphase** | Chromosomes align at **metaphase plate** (cell equator); kinetochore microtubules fully attached |
| **Anaphase** | Sister chromatids separate → pulled to opposite poles by shortening microtubules; cell elongates |
| **Telophase** | Nuclear envelopes reform around each set of chromosomes; chromosomes decondense; spindle disappears |

![Figure 10.6 — The five phases of mitosis shown in a plant cell with 2n=6: prophase through telophase and cytokinesis.](${CDN}9164050222aea02b2e227df8a18237e79017ab20)

*Figure 10.6 — Each stage is defined by chromosome behavior and spindle dynamics.*

---

## Cytokinesis

| | Animal Cells | Plant Cells |
|--|-------------|-------------|
| Mechanism | **Cleavage furrow** — actin ring pinches membrane inward | **Cell plate** — Golgi-derived vesicles fuse at equator; new cell wall forms outward |

![Figure 10.9 — Cytokinesis: cleavage furrow in animal cells (left); cell plate formation in plant cells (right).](${CDN}213428fcc920be6a5ce5c5eb1852a51a0f6e5c5f)

*Figure 10.9 — Plant cells cannot pinch inward because of their rigid cell wall.*

---

## Cell Cycle Regulation

**Checkpoints** are monitored by proteins:

| Checkpoint | Monitors | Halts cycle if… |
|------------|---------|----------------|
| **G₁ checkpoint** (restriction point) | Cell size, nutrients, growth factors | Insufficient resources |
| **G₂ checkpoint** | DNA replication completeness, DNA damage | DNA errors exist |
| **M checkpoint** (spindle assembly) | Kinetochore-spindle attachment | Not all chromosomes attached |

**Cyclins + CDKs (Cyclin-dependent kinases):** cyclins accumulate and activate CDKs → phosphorylate target proteins → push cell through cycle.

![Figure 10.11 — Cell cycle checkpoints at G₁, G₂, and M restrict progression until conditions are satisfied.](${CDN}755633905f8113fc2d7549500b0a31e8b515b37f)

*Figure 10.11 — Most cells in the body are arrested at the G₁ checkpoint.*

---

## Cancer

- **Proto-oncogenes** → normal growth signals → mutated → **oncogenes** (stuck "on")
- **Tumor suppressor genes** (p53, Rb) — normally halt cell cycle → mutated → lose brake function
- Cancer cells: ignore checkpoints, do not respond to growth-limiting signals, loss of contact inhibition, angiogenesis, metastasis

> **Exam tip:** Mitosis produces 2 genetically IDENTICAL daughter cells. Meiosis produces 4 genetically UNIQUE haploid cells. The key event of S phase is DNA replication (not mitosis itself).
`

const N17_CH13 = `# Ch 13 — Meiosis & Sexual Life Cycles
*Campbell Biology 12th Ed. · Chapter 13*

---

## Key Vocabulary

| Term | Definition |
|------|-----------|
| **Diploid (2n)** | Two sets of chromosomes (one from each parent); human 2n = 46 |
| **Haploid (n)** | One set of chromosomes; human n = 23 |
| **Homologs** | Chromosome pairs with same genes but possibly different alleles |
| **Sister chromatids** | Identical copies joined at centromere; result of S-phase replication |
| **Gamete** | Haploid reproductive cell (sperm or egg) |
| **Zygote** | Diploid cell formed by fertilization (egg + sperm) |

---

## Meiosis I — Reductional Division

Homologs separate → each daughter cell gets ONE of each homolog pair.

| Phase | Key Events |
|-------|-----------|
| **Prophase I** ★ | Synapsis: homologs pair via **synaptonemal complex** → form **bivalents (tetrads)**; **crossing over** at chiasmata; longest, most complex phase |
| **Metaphase I** | Bivalents align at metaphase plate; orientation is RANDOM (independent assortment) |
| **Anaphase I** | Homologs pulled to opposite poles (sister chromatids remain joined) |
| **Telophase I** | Two haploid cells form; chromosomes still consist of 2 sister chromatids |

---

## Meiosis II — Equational Division

Sister chromatids separate → 4 haploid cells total.

![Figure 11.7 — All stages of meiosis in a cell with 2n = 4: meiosis I separates homologs; meiosis II separates sister chromatids.](${CDN}7cb5f265649551518cf52d24ff8caa12a57a07c2)

*Figure 11.7 — Meiosis requires two divisions because DNA replicates only once.*

---

## Crossing Over — Genetic Recombination

During Prophase I, non-sister chromatids of homologous chromosomes exchange segments at **chiasmata**. This shuffles alleles between chromosomes, creating new combinations not present in either parent.

![Figure 11.4 — Crossing over between non-sister chromatids of homologs; chiasmata mark the exchange points.](${CDN}8cc4db844fe92aabfacd0bee8c6053b7e8229d92)

*Figure 11.4 — Each crossover event swaps genetic material, increasing diversity.*

---

## Sources of Genetic Variation in Sexual Reproduction

1. **Independent assortment** (Metaphase I) — 2²³ ≈ 8 million possible chromosome combinations for humans
2. **Crossing over** (Prophase I) — further shuffles alleles within chromosomes
3. **Random fertilization** — any sperm + any egg → 8 million × 8 million = 64 trillion possible zygotes

---

## Meiosis vs. Mitosis

| Feature | Mitosis | Meiosis |
|---------|---------|---------|
| Purpose | Growth, repair, asexual reproduction | Sexual reproduction (gamete production) |
| Divisions | 1 | 2 |
| Daughter cells | 2 | 4 |
| Ploidy of products | 2n (same as parent) | n (haploid) |
| Genetic identity | Identical to parent | Genetically unique |
| Crossing over | None | Yes (Prophase I) |
| Homolog pairing | No | Yes (synapsis) |

![Figure 11.8 — Comparison of meiosis and mitosis: one DNA replication but two divisions in meiosis produces four haploid cells.](${CDN}d71b9fcb5f73571d2355ee3b9d81b75d20faba7c)

*Figure 11.8 — The key distinction: meiosis I separates homologs (no equivalent in mitosis).*

> **Exam tip:** Crossing over occurs between **non-sister chromatids** of **homologous** chromosomes — never between sister chromatids (which are already identical). Crossing over happens in Prophase I, not Prophase II.
`

const N18_CH16 = `# Ch 16 — Molecular Basis of Inheritance
*Campbell Biology 12th Ed. · Chapter 16*

---

## The Discovery That DNA Is the Genetic Material

### Griffith's Transformation Experiment (1928)
- **S strain** (smooth, virulent) + **R strain** (rough, harmless)
- Heat-killed S + live R → mice DIED; R bacteria had been **transformed** (acquired heritable change)
- Conclusion: a "transforming principle" could convert R cells to S cells

### Avery, MacLeod & McCarty (1944)
- Treated cell extract with enzymes that destroy proteins, RNA, or DNA
- Only **DNase** (destroys DNA) eliminated transformation
- Conclusion: DNA is the transforming principle

### Hershey-Chase Experiment (1952)
- Labeled phage DNA with ³²P (radioactive phosphorus) and phage protein with ³⁵S (radioactive sulfur)
- After infecting bacteria: ³²P (DNA) found INSIDE bacteria; ³⁵S (protein) stayed OUTSIDE
- Conclusion: **DNA**, not protein, is injected into bacteria → DNA is the genetic material

![Figure 14.4 — Hershey-Chase experiment: only radioactive ³²P (DNA label) entered bacteria after phage infection.](${CDN}f10c6582cdbe25272a463fce0f3876c12d7f7004)

*Figure 14.4 — This confirmed DNA carries genetic information.*

---

## DNA Structure — Watson, Crick & Franklin (1953)

### Chargaff's Rules
- [A] = [T] and [G] = [C] in any DNA molecule (ratio varies by species)
- Suggests complementary base pairing

### The Double Helix
- Two antiparallel polynucleotide strands wound around each other
- **Base pairs** (inside): A=T (2 hydrogen bonds), G≡C (3 hydrogen bonds)
- **Sugar-phosphate backbone** (outside)
- Helix dimensions: 3.4 nm per turn; 0.34 nm between base pairs; 2 nm wide

### Nitrogenous Bases
- **Purines** (double ring): Adenine, Guanine
- **Pyrimidines** (single ring): Cytosine, Thymine (DNA), Uracil (RNA)

![Figure 14.5 — Purines have a double ring structure; pyrimidines have a single six-membered ring; always a purine pairs with a pyrimidine.](${CDN}16a00dd26c3e187bca99ad57925b3ab08370562c)

*Figure 14.5 — Purine-pyrimidine pairing ensures consistent helix width.*

---

## Chromosome Packaging

DNA must be compacted ~10,000× to fit in the nucleus:

1. DNA wraps around **nucleosomes** (8 histone proteins) → "beads-on-a-string"
2. Nucleosomes coil into 30-nm chromatin fiber
3. Loops attach to protein scaffold → 300-nm fiber
4. Further coiling → **metaphase chromosome** (700-nm width)

![Figure 14.11 — Levels of chromosome compaction: double helix → nucleosome → 30-nm fiber → looped domains → metaphase chromosome.](${CDN}de1365f75f9780e09b9a379bf11912984578cd5b)

*Figure 14.11 — Histones are positively charged (basic) — they attract the negatively charged DNA backbone.*

> **Exam tip:** Chargaff's rules (A=T, G=C) are the reason one strand of DNA can serve as a template for the other — complementary base pairing is the basis of both replication and transcription.
`

const N19_CH17 = `# Ch 17 — From Gene to Protein
*Campbell Biology 12th Ed. · Chapter 17*

---

## The Central Dogma

**DNA** → (transcription) → **RNA** → (translation) → **Protein**

- **Transcription:** DNA → mRNA (in nucleus)
- **Translation:** mRNA → protein (at ribosomes)

Three types of RNA: mRNA (message), tRNA (adaptor), rRNA (ribosome structure + catalysis)

![Figure 15.2 — Central dogma: DNA is transcribed to mRNA; the ribosome translates mRNA into a polypeptide chain.](${CDN}abdd78d09479f6d641ea2add24d0634f8bd27358)

*Figure 15.2 — Information flows from DNA to RNA to protein — never in reverse in normal cells.*

---

## Transcription

**Template strand:** RNA polymerase reads 3'→5'; synthesizes mRNA 5'→3'.
**Non-template (coding) strand:** same sequence as mRNA (with U instead of T).

| Stage | Events |
|-------|--------|
| **Initiation** | RNA polymerase binds **promoter** (includes TATA box in eukaryotes) |
| **Elongation** | RNA polymerase moves along template; adds complementary RNA nucleotides |
| **Termination** | Poly-A signal or terminator sequence → RNA polymerase releases mRNA |

**Eukaryotic RNA processing (pre-mRNA → mature mRNA):**
1. **5' cap** (7-methylguanosine) — protects mRNA; aids ribosome recognition
2. **Poly-A tail** (150–200 A nucleotides at 3' end) — protection from degradation
3. **Splicing** — spliceosomes remove **introns** (non-coding); join **exons** (coding)

![Figure 15.7 — Transcription: RNA polymerase opens the DNA and synthesizes mRNA from the template strand 3'→5'.](${CDN}60a31ba84d26f5b1d6aadc5887f89d55258f84cb)

*Figure 15.7 — In prokaryotes, transcription and translation occur simultaneously (no nuclear membrane).*

---

## The Genetic Code

| Feature | Detail |
|---------|--------|
| Codon | 3-nucleotide mRNA sequence specifying one amino acid |
| Total codons | 64 |
| Sense codons | 61 (code for amino acids) |
| Stop codons | 3: UAA, UAG, UGA |
| Start codon | AUG (methionine) |
| Redundancy | Multiple codons → same amino acid (degenerate) |
| Universality | Nearly all organisms use the same code |

![Figure 15.3 — The genetic code table: 64 codons organized by first, second, and third nucleotide position.](${CDN}d99b2d20bb12abe0a633a49c567152957e014db7)

*Figure 15.3 — The code is read 5'→3' on mRNA; UAG, UAA, UGA are stop codons.*

---

## Translation

**Ribosomes** have three sites:
- **A site** (aminoacyl): incoming charged tRNA
- **P site** (peptidyl): growing polypeptide chain
- **E site** (exit): empty tRNA exits

| Stage | Events |
|-------|--------|
| **Initiation** | Small ribosomal subunit + mRNA; initiator tRNA (Met-tRNA) at P site; large subunit joins |
| **Elongation** | Aminoacyl-tRNA enters A site (anticodon matches codon); peptide bond forms (peptidyl transferase = rRNA ribozyme); ribosome translocates 1 codon 5'→3'; tRNA exits via E site |
| **Termination** | Stop codon in A site → release factor binds → polypeptide released → ribosome dissembles |

![Figure 15.15 — Ribosome structure: three tRNA binding sites (A, P, E); mRNA threads through as the polypeptide grows.](${CDN}e509d44e4464bb32316d892e989af64df955eb4c)

*Figure 15.15 — Polyribosomes (polysomes) — multiple ribosomes translating one mRNA simultaneously — increase protein output.*

> **Exam tip:** The anticodon is on tRNA; it pairs antiparallel with the mRNA codon. Remember: tRNA brings amino acids; mRNA carries the message; rRNA is the enzyme (ribozyme) that catalyzes peptide bond formation.
`

const N20_CH19 = `# Ch 19 — Viruses
*Campbell Biology 12th Ed. · Chapter 19*

---

## What Is a Virus?

Viruses are **not alive** — they cannot reproduce independently. They are:
- **Obligate intracellular parasites** — must use a host cell's machinery
- Smaller than bacteria (20–300 nm)
- Genome: DNA or RNA (single- or double-stranded)
- Surrounded by a protein **capsid**; some also have a lipid **envelope** (from host membrane)

| Component | Function |
|-----------|---------|
| Capsid | Protects nucleic acid; host recognition |
| Envelope (some) | Helps fusion with host membrane; from host cell membrane |
| Spike glycoproteins | Receptor binding (e.g., influenza hemagglutinin) |

![Figure 21.3 — Viral capsid morphologies: (a) helical (tobacco mosaic), (b) icosahedral (adenovirus), (c) complex (bacteriophage T4).](${CDN}2382dabbbb22e9286b3d4463c9e10dda2ee5113a)

*Figure 21.3 — Capsid shape is determined by the arrangement of protein subunits (capsomeres).*

---

## Bacteriophage Life Cycles

### Lytic Cycle
1. Phage attaches to bacterial surface (specific receptor)
2. Phage injects DNA into bacterium
3. Phage DNA → uses host ribosomes/enzymes to make phage DNA + capsid proteins
4. ~200 new phages assembled
5. Lysozyme lyses cell → phages released → infect new cells

### Lysogenic Cycle
1. Phage DNA integrates into bacterial chromosome → **prophage**
2. Prophage replicated with bacterial DNA during cell division (silent)
3. Environmental stress (UV, chemicals) → **induction** → prophage excised → enters lytic cycle

![Figure 21.10 — Lytic cycle: phage destroys host immediately. Lysogenic cycle: phage DNA integrates and is carried silently until induced.](${CDN}098f7cf5c804ea30fcc78fad46466d051c653ac0)

*Figure 21.10 — Lambda phage can switch between cycles depending on host health.*

---

## Animal Viruses & HIV

Animal viruses enter cells by **endocytosis** (non-enveloped) or **membrane fusion** (enveloped).

**HIV (Human Immunodeficiency Virus):**
- Retrovirus: RNA genome; **reverse transcriptase** converts RNA → DNA (RNA → DNA → integrated **provirus**)
- Targets CD4+ helper T cells → progressive immune failure → AIDS
- Antiretroviral therapy (ART) inhibits reverse transcriptase and protease; does not eliminate provirus

---

## Emerging Viruses

New viruses arise through:
1. **Mutation** — RNA viruses have high error rates (no proofreading); rapid antigenic change (influenza)
2. **Recombination** — two viruses infect same cell → exchange genome segments
3. **Zoonosis** — animal virus jumps to humans (HIV from SIV/primates; COVID-19 from bats)

> **Exam tip:** The lytic cycle KILLS the host cell; the lysogenic cycle does NOT (immediately). HIV is a retrovirus because it uses reverse transcriptase to copy its RNA genome into DNA — "reverse" of normal information flow.
`

const N21_CH20 = `# Ch 20 — Biotechnology
*Campbell Biology 12th Ed. · Chapter 20*

---

## Recombinant DNA Technology

**Recombinant DNA** = DNA from two or more different sources combined in vitro.

Key tools:
- **Restriction enzymes** — cut DNA at specific palindromic sequences; create blunt or sticky ends
- **DNA ligase** — joins DNA fragments with covalent bonds
- **Plasmid vectors** — small circular bacterial DNA; carries: origin of replication, antibiotic resistance gene, multiple cloning site (MCS)

![Figure 17.7 — Molecular cloning: restriction enzyme cuts both plasmid and foreign DNA; sticky ends anneal and ligase seals the recombinant plasmid; bacteria are transformed and selected by antibiotic resistance.](${CDN}5acef6c92935df62a0ff3ed56e586c0463e6c008)

*Figure 17.7 — Recombinant plasmids are introduced into bacteria by transformation.*

---

## Gel Electrophoresis

DNA fragments separated by size through agarose gel under electric field:
- **Smaller fragments** migrate farther (toward + electrode)
- **Larger fragments** stay near wells
- DNA stained with SYBR green or ethidium bromide; visualized under UV

Applications: DNA fingerprinting, RFLP analysis, Southern blotting, confirming cloning

![Figure 17.2 — Gel electrophoresis: fragments from different samples run in parallel lanes; size determined by comparison to DNA ladder.](${CDN}3555fbfb5d60aac2f601b4e04e73054022bf2cb2)

*Figure 17.2 — Each lane can be a different sample; fragments are compared to a molecular weight ladder.*

---

## PCR — Polymerase Chain Reaction

PCR amplifies a specific DNA sequence exponentially in vitro — no cells needed.

**Requirements:** target DNA, two primers (flanking sequence), Taq polymerase (heat-stable), dNTPs, Mg²⁺

**Three-step cycle:**
1. **Denaturation** (94°C) — double helix separates into single strands
2. **Annealing** (50–65°C) — primers bind to complementary sequences
3. **Extension** (72°C) — Taq polymerase synthesizes new strand from primers

After n cycles: **2ⁿ copies** of target sequence. 30 cycles → >1 billion copies.

Applications: forensics, pathogen detection, COVID-19 testing, prenatal diagnosis, ancient DNA

---

## CRISPR-Cas9 Gene Editing

- **Guide RNA** directs Cas9 protein to a specific genomic DNA sequence
- Cas9 creates a double-strand break
- Cell repairs via **NHEJ** (non-homologous end joining → gene disruption) or **HDR** (homology-directed repair → precise editing with a template)

Applications: correcting disease mutations, cancer immunotherapy, crop improvement, gene drives

> **Exam tip:** PCR does not require cells or a living organism — just the DNA template, primers, Taq polymerase, and nucleotides. Gel electrophoresis separates by SIZE (small goes far), not charge, because all DNA has the same charge-to-mass ratio.
`

const N22_CH40 = `# Ch 40 — Animal Form & Function
*Campbell Biology 12th Ed. · Chapter 40*

---

## Body Plans & Organization

Animals are multicellular with specialized **tissues** → **organs** → **organ systems**.

**Body symmetry:**
- **Radial** — multiple planes of symmetry (cnidarians, echinoderms)
- **Bilateral** — one plane; anterior/posterior, dorsal/ventral, left/right (most animals)

**Body cavities (coeloms)** provide space for organ development and circulation of fluids.

---

## Four Types of Animal Tissue

| Tissue | Structure | Function | Examples |
|--------|-----------|---------|---------|
| **Epithelial** | Tightly packed cells; apical + basal surface; avascular | Protection, absorption, secretion, gas exchange | Skin, gut lining, gland cells |
| **Connective** | Sparse cells in ECM (extracellular matrix) | Support, binding, transport | Bone, cartilage, blood, adipose, tendons |
| **Muscle** | Contractile cells with actin + myosin | Movement | Skeletal (voluntary), smooth (involuntary), cardiac |
| **Nervous** | Neurons + glia | Receive/transmit signals | Brain, spinal cord, nerves |

![Figure 33.11 — Three muscle tissue types: smooth (visceral organs), skeletal (voluntary, striated), cardiac (heart, striated, with intercalated discs).](${CDN}8dd6a7b206b305b7cc2afe63d365ddbb5f807d80)

*Figure 33.11 — Cardiac muscle has gap junctions (intercalated discs) that allow synchronized contraction.*

---

## Homeostasis

The maintenance of a stable internal environment despite external fluctuations.

**Negative feedback** (most common):
- Response **counteracts** the stimulus
- Example: Body temp rises → sweating + vasodilation → temp drops

**Positive feedback** (amplifying):
- Response **amplifies** the stimulus (not self-correcting)
- Examples: Childbirth (oxytocin), blood clotting, LH surge (ovulation), action potential

![Figure 33.19 — Negative feedback: elevated blood glucose → insulin released → cells take up glucose → blood glucose falls → insulin release stops.](${CDN}013140dc79086c7e1266b60de62a6de87c07ad49)

*Figure 33.19 — Most homeostatic systems use negative feedback.*

![Figure 33.20 — Positive feedback in childbirth: cervical stretch → oxytocin → stronger contractions → more stretch → more oxytocin, until birth.](${CDN}f2eb68f661149efeb0aabb7ffe1da0b623d9cd1a)

*Figure 33.20 — Positive feedback is self-amplifying; it ends only when the process completes.*

---

## Thermoregulation

| Type | Source of body heat | Energy cost | Example |
|------|---------------------|------------|---------|
| **Ectotherm** | Environment | Low | Fish, reptiles, amphibians, insects |
| **Endotherm** | Internal metabolism (shivering, brown fat) | High | Mammals, birds |

Mechanisms:
- **Vasodilation** → more blood to skin → heat loss
- **Vasoconstriction** → less blood to skin → heat conservation
- **Sweating/panting** → evaporative cooling
- **Countercurrent exchange** → retains heat in limbs (artery and vein run adjacent)

> **Exam tip:** Ectotherms are NOT "cold-blooded" — they can have warm body temperatures; they just acquire heat from the environment rather than generating it internally.
`

const N23_CH41 = `# Ch 41 — Nutrition & Digestion
*Campbell Biology 12th Ed. · Chapter 41*

---

## Digestive System Organization

**Incomplete digestive system:** single opening (mouth = anus); gastrovascular cavity (flatworms, cnidarians)

**Complete digestive system:** two openings (mouth → anus); allows specialization along the alimentary canal (most animals)

![Figure 34.2 — Gastrovascular cavity (1 opening) vs. alimentary canal (tube with 2 openings): evolutionary comparison.](${CDN}e5ddc9c78cd5c4f611db57562be8d86aaacaf763)

*Figure 34.2 — A complete gut allows simultaneous ingestion and digestion in different compartments.*

---

## Human Digestive System — Organ by Organ

| Organ | Secretion | Digestion |
|-------|-----------|---------|
| **Mouth** | Salivary amylase | Starch → maltose; mechanical (teeth) |
| **Esophagus** | Mucus | Peristalsis only |
| **Stomach** | HCl (pH 2) + pepsinogen → pepsin | Protein → peptides; churning → chyme |
| **Small intestine** | Bile (from liver/GB), pancreatic enzymes | All macromolecules; major absorption |
| **Large intestine** | Mucus | Water and ion absorption; compaction of waste |

![Figure 34.7 — Human digestive system with all organs labeled from mouth through anus.](${CDN}d9961231646dfaa6c9aef86b9c5e2d654e454fe6)

*Figure 34.7 — The small intestine (~6 m) is the primary site of chemical digestion and nutrient absorption.*

---

## Small Intestine Adaptations for Absorption

- **Villi** — finger-like projections that increase surface area (~600×)
- **Microvilli** (brush border) — on epithelial cells of villi; further increase SA; contain enzymes
- **Lacteals** — lymphatic vessels in villi; absorb fats (chylomicrons)
- **Capillaries** — absorb amino acids, monosaccharides, water-soluble vitamins

![Figure 34.9 — Cross section of small intestine showing villi and microvilli (brush border) that dramatically increase absorptive surface area.](${CDN}b254e8d30a1adabb91df2c900c119be34e58ddb4)

*Figure 34.9 — The total absorptive surface of the human small intestine ≈ a tennis court.*

---

## Key Digestive Enzymes

| Substrate | Enzyme | Location | Product |
|-----------|--------|---------|---------|
| Starch | Salivary amylase | Mouth | Maltose |
| Starch | Pancreatic amylase | Small intestine | Maltose |
| Proteins | Pepsin | Stomach (pH 2) | Peptides |
| Proteins | Trypsin, chymotrypsin | Small intestine | Peptides |
| Peptides | Peptidases (brush border) | Small intestine | Amino acids |
| Fats | Lipase | Small intestine | Fatty acids + glycerol |
| DNA/RNA | Nucleases | Small intestine | Nucleotides |

> **Exam tip:** Bile is NOT an enzyme — it emulsifies fat (breaks large droplets into small ones), increasing surface area for lipase. Bile is made in the liver and stored in the gallbladder.
`

const N24_CH42_CIRC = `# Ch 42 — Circulatory System
*Campbell Biology 12th Ed. · Chapter 42 (Part 1)*

---

## Open vs. Closed Circulation

| Type | Mechanism | Animals |
|------|-----------|---------|
| **Open** | Blood (hemolymph) flows from heart into body cavities; bathes tissues | Insects, most mollusks |
| **Closed** | Blood confined to vessels; heart pumps through arteries/capillaries/veins | Vertebrates, earthworms |

Closed circulation delivers O₂ and nutrients faster and at higher pressure.

---

## Vertebrate Heart Evolution

- **Fish:** Single circulation; 2-chambered heart (1 atrium + 1 ventricle); blood: heart → gills → body → heart
- **Amphibians/most reptiles:** Double circulation; 3-chambered (2 atria + 1 ventricle); some mixing
- **Mammals & birds:** Double circulation; 4-chambered; fully separated pulmonary and systemic circuits

---

## Human Heart Anatomy

**4 Chambers:**
- Right atrium → right ventricle → pulmonary arteries → lungs → pulmonary veins → left atrium → left ventricle → aorta → body

**Valves:**
- **AV valves** (between atria and ventricles): Tricuspid (right), Bicuspid/Mitral (left) — prevent backflow into atria
- **Semilunar valves** (at exits): Pulmonary (right), Aortic (left) — prevent backflow into ventricles

**Heart sounds:** "lub" = AV valves closing; "dub" = semilunar valves closing

![Figure 40.10 — Human double circulatory system: pulmonary circuit (right heart → lungs) and systemic circuit (left heart → body).](${CDN}4437db7f4cf2e47504059658cbfa0396d87339d8)

*Figure 40.10 — Fully separated circuits allow high-pressure systemic delivery with low-pressure pulmonary flow.*

![Figure 40.11 — Heart anatomy: four chambers, major vessels, and surrounding pericardium labeled.](${CDN}829a536bb7154bdd0b23402c1f8762b776673f99)

*Figure 40.11 — The left ventricle has the thickest wall because it pumps blood to the entire body.*

---

## Cardiac Cycle & Electrical Conduction

**Cardiac cycle:** Diastole (chambers fill) → Atrial systole (atria contract) → Ventricular systole (ventricles contract)

**Electrical conduction:**
1. **SA node** (sinoatrial, "pacemaker") — generates impulse in right atrium
2. **AV node** — slight delay; allows atria to contract first
3. **Bundle of His** → **Bundle branches** → **Purkinje fibers** → ventricle walls contract from apex up

![Figure 40.13 — Cardiac cycle phases: diastole (filling), atrial systole, ventricular systole; correlated with pressure and volume changes.](${CDN}39ab03830816d9c9a7165153410d5202392c779d)

*Figure 40.13 — The heartbeat is initiated by the SA node — a self-generating electrical signal.*

---

## Blood & Blood Vessels

**Blood vessels:**
- **Arteries** — thick, elastic walls; carry blood AWAY from heart; high pressure
- **Capillaries** — one cell thick; site of gas, nutrient, waste exchange
- **Veins** — thinner walls; valves prevent backflow; carry blood TOWARD heart; low pressure

**Blood components:**
| Component | % | Function |
|-----------|---|---------|
| **Plasma** | 55% | Water, proteins, nutrients, hormones, CO₂ transport |
| **Erythrocytes (RBCs)** | 44% | O₂ transport (hemoglobin); no nucleus; 120-day lifespan |
| **Leukocytes (WBCs)** | <1% | Immune defense |
| **Platelets (thrombocytes)** | <1% | Clotting; fragments of megakaryocytes |

> **Exam tip:** Arteries carry blood AWAY from the heart (not necessarily oxygenated — pulmonary arteries carry deoxygenated blood). Veins carry blood TOWARD the heart (pulmonary veins carry oxygenated blood). The distinction is direction, not O₂ content.
`

const N25_CH42_RESP = `# Ch 42 — Respiratory System
*Campbell Biology 12th Ed. · Chapter 42 (Part 2)*

---

## Gas Exchange Principles

All respiratory surfaces share:
- High surface area : volume ratio
- Thin, moist surface (gases diffuse in aqueous film)
- Permeable to O₂ and CO₂
- Close to circulatory system

Gas exchange occurs by **diffusion** down partial pressure gradients.

---

## Human Respiratory Anatomy

**Air pathway:** Nasal cavity/mouth → pharynx → larynx (vocal cords) → trachea → bronchi → bronchioles → alveoli

**Alveoli** — microscopic air sacs (300 million in human lungs):
- Surface area ≈ 70 m² (≈ tennis court)
- Walls = single layer of epithelial cells
- Surrounded by capillaries
- Surfactant (secreted by type II cells) reduces surface tension, prevents collapse

---

## Breathing Mechanics

**Inhalation (active):**
- Diaphragm contracts → moves down; rib cage expands → lung volume increases → pressure drops below atmospheric → air flows in

**Exhalation (passive at rest):**
- Diaphragm relaxes → moves up; lung volume decreases → pressure rises above atmospheric → air flows out

**Key lung volumes:**
| Volume | Amount | Description |
|--------|--------|------------|
| Tidal volume | ~500 mL | Normal breath |
| Vital capacity | ~4.8 L | Maximum breath out after max breath in |
| Residual volume | ~1.2 L | Air remaining after maximum exhalation |

---

## Gas Exchange & Transport

**At alveoli:** PO₂ alveoli (104 mmHg) > PO₂ blood (40 mmHg) → O₂ diffuses into blood
**At alveoli:** PCO₂ blood (46 mmHg) > PCO₂ alveoli (40 mmHg) → CO₂ diffuses out

**O₂ transport:** 98.5% bound to hemoglobin (Hb) in RBCs; 1.5% dissolved in plasma
- Hb has 4 subunits; each carries one O₂
- **Bohr effect:** lower pH (more CO₂, exercise) → Hb releases O₂ more readily to active tissues

**CO₂ transport:**
- 70% as **bicarbonate ions** (HCO₃⁻) in plasma: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻ (carbonic anhydrase in RBCs)
- 23% bound to hemoglobin (carbaminohemoglobin)
- 7% dissolved in plasma

> **Exam tip:** O₂ diffuses from high PO₂ (alveoli) to low PO₂ (blood); CO₂ diffuses the opposite way. The Bohr effect means active muscles (low pH) get more O₂ — a built-in regulation mechanism.
`

const N26_CH43 = `# Ch 43 — Excretory System
*Campbell Biology 12th Ed. · Chapter 43*

---

## Osmoregulation & Nitrogenous Waste

Animals must balance water and solutes. Metabolic waste products include:
| Waste | Toxicity | Water needed | Produced by |
|-------|---------|-------------|------------|
| **Ammonia** (NH₃) | Very high | A lot | Aquatic invertebrates, bony fish |
| **Urea** | Low | Moderate | Mammals, amphibians, cartilaginous fish |
| **Uric acid** | Very low | Minimal | Birds, reptiles, insects |

---

## Human Kidney Structure

![Figure 41.11 — The kidneys filter blood; urine drains through ureters to the bladder and out the urethra.](${CDN}ccc6952feb8594529853f1b53ba73d079a0138a5)

*Figure 41.11 — Each kidney contains ~1 million nephrons.*

![Figure 41.13 — The nephron: functional unit of the kidney. Glomerulus and Bowman's capsule form the renal corpuscle.](${CDN}dcb82e7e45c1b8cf99d37ce2d840f5058fbda7d0)

*Figure 41.13 — Each nephron consists of a renal corpuscle, tubule, and associated capillaries.*

---

## Urine Formation — Three Processes

| Process | Location | What happens |
|---------|----------|-------------|
| **Filtration** | Glomerulus → Bowman's capsule | Blood pressure forces water, ions, glucose, urea into filtrate (proteins + cells stay) |
| **Reabsorption** | Tubules → capillaries | ~99% of filtrate returned to blood (glucose, amino acids, water, ions) |
| **Secretion** | Capillaries → tubules | Additional wastes actively pumped in (H⁺, drugs, K⁺) |

**Proximal convoluted tubule (PCT):** reabsorbs ~65% of filtrate; glucose and amino acids 100% reabsorbed

**Loop of Henle:** descending limb permeable to water (water exits by osmosis into salty medulla); ascending limb pumps NaCl out → maintains medullary osmotic gradient → concentrated urine possible

**Distal convoluted tubule (DCT) + Collecting duct:** regulated by hormones

![Figure 41.15 — Loop of Henle countercurrent multiplier: NaCl concentration gradient builds up in medulla, enabling water reabsorption from collecting duct.](${CDN}48a241eba9492d671e67e509e450bf8f9d70ecc0)

*Figure 41.15 — The longer the loop of Henle (desert animals), the more concentrated the urine.*

---

## Hormonal Regulation

| Hormone | Source | Effect on Kidney |
|---------|--------|-----------------|
| **ADH** (antidiuretic hormone) | Posterior pituitary | ↑ aquaporins in collecting duct → more water reabsorbed → concentrated urine |
| **Aldosterone** | Adrenal cortex | ↑ Na⁺ reabsorption in DCT → water follows → increased blood volume/pressure |
| **ANP** (atrial natriuretic peptide) | Heart | Opposes aldosterone; ↑ Na⁺ excretion → lower blood pressure |

> **Exam tip:** Drinking alcohol inhibits ADH → dilute urine and dehydration. Drinking salty water or sweating a lot triggers ADH release → concentrated urine. ADH does NOT affect the glomerular filtration rate directly.
`

const N27_CH44 = `# Ch 44 — Immune System
*Campbell Biology 12th Ed. · Chapter 44*

---

## Three Lines of Defense

| Line | Type | Components |
|------|------|-----------|
| **1st** | Physical/chemical barriers | Skin, mucus, cilia, stomach acid, lysozyme, normal microbiome |
| **2nd** | Innate immunity (nonspecific) | Phagocytes, NK cells, complement, inflammation, fever |
| **3rd** | Adaptive immunity (specific) | B lymphocytes (humoral), T lymphocytes (cell-mediated) |

---

## Innate Immunity

Pattern recognition receptors (PRRs) on phagocytes detect **PAMPs** (pathogen-associated molecular patterns) shared by many pathogens.

- **Neutrophils** — first responders; engulf and destroy bacteria
- **Macrophages** — phagocytize; present antigens to T cells (APCs)
- **Dendritic cells** — APC; bridge innate and adaptive immunity
- **Natural killer (NK) cells** — kill virus-infected and cancer cells (recognize absence of MHC I)
- **Complement system** — cascade of blood proteins that lyse pathogens and attract phagocytes
- **Inflammation:** mast cells release histamine → vasodilation + increased permeability → redness, warmth, swelling, pain → phagocytes recruited

---

## Adaptive Immunity — Lymphocytes

Both B and T cells develop from stem cells in bone marrow; T cells mature in thymus.

**Clonal selection:** antigen binds specific lymphocyte → that cell proliferates → **clonal expansion** → effector cells + long-lived **memory cells**

**Memory cells** → secondary response: faster, stronger, more antibody than primary (basis of vaccination)

![Figure 42.16 — B cell differentiation: antigen + T helper cell stimulation → plasma cells (antibody secreting) + memory B cells.](${CDN}600bcc597e8aab3d0d2cb8573a3e736d7e50fd5a)

*Figure 42.16 — Memory B cells persist for years, enabling rapid secondary responses.*

### Humoral Immunity (B cells)
- B cells → **plasma cells** → secrete **antibodies** (immunoglobulins)
- Antibodies: Y-shaped; variable region binds specific antigen; constant region determines class
- IgG (most abundant, crosses placenta), IgA (mucus/milk), IgM (first produced), IgE (allergies), IgD
- Antibodies: neutralize, opsonize (tag for phagocytosis), activate complement

### Cell-Mediated Immunity (T cells)
- **Helper T cells (CD4+):** activate B cells and cytotoxic T cells; secrete cytokines; HIV target
- **Cytotoxic T cells (CD8+):** directly kill virus-infected cells and cancer cells via perforin + granzymes

**MHC (Major Histocompatibility Complex):**
- **MHC I** — on all nucleated cells; presents INTRACELLULAR peptides → cytotoxic T cells (CD8+)
- **MHC II** — on APCs (macrophages, dendritic cells, B cells); presents EXTRACELLULAR peptides → helper T cells (CD4+)

> **Exam tip:** HIV attacks helper T cells (CD4+) → without helper T cells, neither humoral nor cell-mediated immunity functions → AIDS. Vaccines work by creating memory cells WITHOUT causing disease.
`

const N28_CH45 = `# Ch 45 — Endocrine System
*Campbell Biology 12th Ed. · Chapter 45*

---

## Hormones: Two Chemical Classes

| Class | Examples | Receptor location | Mechanism | Speed |
|-------|---------|-------------------|-----------|-------|
| **Water-soluble** (peptide hormones, catecholamines) | Insulin, glucagon, epinephrine, ADH | Plasma membrane | Signal transduction → second messengers (cAMP, IP₃) → enzyme cascade | Fast (seconds–minutes) |
| **Lipid-soluble** (steroids, thyroid hormones) | Cortisol, testosterone, estrogen, T₃/T₄ | Intracellular (cytoplasm or nucleus) | Hormone-receptor complex → DNA binding → gene transcription | Slow (hours–days), long-lasting |

![Figure 37.8 — Membrane receptor signaling: epinephrine binds G-protein coupled receptor → adenylyl cyclase activated → cAMP (second messenger) → protein kinase A → cellular response.](${CDN}0ab92ea65fc072a31188d8fd0ebbe646997dbe3b)

*Figure 37.8 — Signal amplification: one hormone molecule can trigger thousands of enzyme activations via cascade.*

![Figure 37.7 — Intracellular receptor pathway: steroid hormone crosses membrane → binds receptor → complex enters nucleus → activates specific genes.](${CDN}caf612da724356bb394176d161f903d022df6ceb)

*Figure 37.7 — Steroid hormones directly alter gene expression.*

---

## Major Endocrine Glands & Hormones

| Gland | Hormone | Target | Effect |
|-------|---------|--------|-------|
| **Hypothalamus** | Releasing/inhibiting hormones | Ant. pituitary | Controls pituitary hormone secretion |
| **Anterior pituitary** | GH, TSH, ACTH, FSH, LH, PRL | Many | Growth, stimulate other glands |
| **Posterior pituitary** | ADH, Oxytocin | Kidney, uterus/breast | Water retention; contractions/milk ejection |
| **Thyroid** | T₃, T₄ (thyroxine) | Most cells | Metabolism rate; development |
| **Adrenal cortex** | Cortisol (glucocorticoid), Aldosterone | Many, kidney | Stress response; Na⁺ retention |
| **Adrenal medulla** | Epinephrine (adrenaline) | Heart, blood vessels | Fight-or-flight: ↑HR, ↑BP, ↑blood glucose |
| **Pancreas** | Insulin (β cells), Glucagon (α cells) | Liver, muscle, fat | Blood glucose regulation |

---

## Negative Feedback in Endocrine Systems

Most endocrine regulation uses negative feedback. Example — thyroid hormone:

Hypothalamus → TRH → anterior pituitary → TSH → thyroid gland → T₃/T₄ → (negative feedback) → inhibits hypothalamus and pituitary

**Positive feedback examples:** LH surge triggers ovulation; oxytocin during childbirth.

---

## Blood Glucose Regulation

- **Insulin** (pancreatic β cells) — released when blood glucose is HIGH → promotes glucose uptake by liver, muscle, fat cells → glucose stored as glycogen; lowers blood glucose
- **Glucagon** (pancreatic α cells) — released when blood glucose is LOW → triggers glycogen breakdown (glycogenolysis) + gluconeogenesis in liver; raises blood glucose

> **Exam tip:** Type 1 diabetes = autoimmune destruction of β cells → no insulin. Type 2 diabetes = cells become insulin resistant. Both result in high blood glucose. Epinephrine and glucagon BOTH raise blood glucose; insulin LOWERS it.
`

const N29_CH46 = `# Ch 46 — Reproduction
*Campbell Biology 12th Ed. · Chapter 46*

---

## Asexual vs. Sexual Reproduction

| Feature | Asexual | Sexual |
|---------|---------|-------|
| Offspring genetics | Identical to parent (clones) | Genetically unique |
| Speed | Fast | Slower |
| Energy | Low (no mate needed) | High |
| Adaptation | Slow (low variation) | Fast (high variation) |

Types of asexual reproduction: **fission** (prokaryotes), **budding** (Hydra, yeast), **fragmentation** (sea stars), **parthenogenesis** (unfertilized egg develops — some lizards, insects)

---

## Human Male Reproductive Anatomy

**Sperm production pathway:**
Testes (seminiferous tubules) → Epididymis (maturation/storage) → Vas deferens → Ejaculatory duct → Urethra

**Accessory glands contribute to semen:**
- Seminal vesicles: fructose (energy for sperm), prostaglandins
- Prostate gland: alkaline fluid (neutralizes vaginal acid)
- Bulbourethral glands: mucus pre-ejaculate

**Spermatogenesis:** in seminiferous tubules; begins at puberty; continuous; ~74 days per sperm
- Spermatogonia (diploid) → meiosis → 4 spermatids → spermatozoa (sperm)
- Each primary spermatocyte → **4 functional sperm**

![Figure 43.11 — Human male reproductive anatomy: testis, epididymis, vas deferens, seminal vesicles, prostate, and penis labeled.](${CDN}c1dbdde182944c85e2a8e6f8831522ee95237a3d)

*Figure 43.11 — Sperm are produced in the testes and stored in the epididymis.*

---

## Human Female Reproductive Anatomy

**Egg pathway:** Ovary → Fallopian tube (oviduct) → Uterus → Cervix → Vagina

**Oogenesis** — begins in fetal development; primary oocytes arrested in Prophase I until puberty
- One oocyte completes Meiosis I per month → secondary oocyte + first polar body
- Secondary oocyte arrested in Metaphase II → released at **ovulation**
- Meiosis II completed ONLY if fertilized → egg + second polar body
- Each primary oocyte → **1 egg + 3 polar bodies** (only egg is functional)

![Figure 43.17 — Oogenesis: primary oocyte → secondary oocyte (Meiosis I) → egg + 3 polar bodies (Meiosis II, only if fertilized).](${CDN}2f2b574339a2dd9b03c33ab0732a57a647fe9333)

*Figure 43.17 — Oogenesis is highly asymmetric; almost all cytoplasm goes to the egg.*

---

## Ovarian & Menstrual Cycles (~28 days)

**Follicular phase (days 1–14):**
- FSH → follicle development → estrogen ↑ → LH surge → **ovulation** (day 14)

**Luteal phase (days 15–28):**
- Ruptured follicle → **corpus luteum** → secretes progesterone + estrogen → maintains endometrium
- No fertilization → corpus luteum degenerates → progesterone ↓ → **menstruation**
- Fertilization → HCG maintains corpus luteum → no menstruation → pregnancy

> **Exam tip:** Compare spermatogenesis vs. oogenesis: spermatogenesis produces 4 functional sperm from each primary spermatocyte; oogenesis produces 1 functional egg + 3 non-functional polar bodies. The unequal cytokinesis ensures the egg retains maximum cytoplasm for the future embryo.
`

const N30_CH48 = `# Ch 48 — Neurons, Synapses & Signaling
*Campbell Biology 12th Ed. · Chapter 48*

---

## Neuron Anatomy

| Part | Function |
|------|---------|
| **Cell body (soma)** | Contains nucleus and organelles; integrates signals |
| **Dendrites** | Receive incoming signals from other neurons |
| **Axon** | Conducts signals away from cell body to next cell |
| **Myelin sheath** | Fatty insulation (Schwann cells in PNS; oligodendrocytes in CNS); speeds transmission |
| **Nodes of Ranvier** | Gaps in myelin; ion channel-dense; site of action potential regeneration |
| **Synaptic terminal** | Releases neurotransmitters into synapse |

**Glial cells:** astrocytes (support, BBB), oligodendrocytes (myelin CNS), Schwann cells (myelin PNS), microglia (immune surveillance)

---

## Resting Membrane Potential (−70 mV)

Inside is negative relative to outside. Maintained by:
- **Na⁺/K⁺ ATPase:** pumps 3 Na⁺ out + 2 K⁺ in per ATP → creates concentration gradients
- **K⁺ leak channels:** K⁺ diffuses out → negative inside
- At rest: [K⁺] high inside; [Na⁺] high outside

---

## Action Potential

A rapid, all-or-nothing reversal of membrane potential.

| Step | Event | Ion movement |
|------|-------|-------------|
| **Resting** | −70 mV; voltage-gated Na⁺/K⁺ channels closed | — |
| **Depolarization** | Stimulus opens Na⁺ channels; Na⁺ rushes IN | Na⁺ → inside |
| **Peak** | Membrane potential reaches +30 mV; Na⁺ channels inactivate | — |
| **Repolarization** | K⁺ channels open; K⁺ rushes OUT | K⁺ → outside |
| **Hyperpolarization** | Brief undershoot below −70 mV; K⁺ channels closing | K⁺ → outside |
| **Restoration** | Na⁺/K⁺ pump restores ion gradients; Na⁺ channel inactivation gate resets | Pump |

- **Threshold:** ~−55 mV; must be reached for AP to fire
- **All-or-nothing:** AP is either full or absent; amplitude doesn't code intensity (frequency does)
- **Absolute refractory period:** Na⁺ channels inactivated; no AP possible regardless of stimulus size

![Figure 35.16 — Action potential: voltage vs. time graph showing depolarization, repolarization, and hyperpolarization phases.](${CDN}dbe79b659256cef76f0b0377d48c78ad3fd8edc0)

*Figure 35.16 — The action potential lasts ~1–2 ms and travels in one direction (no backward propagation due to refractory period).*

**Conduction:**
- **Unmyelinated:** continuous conduction (~0.5–2 m/s)
- **Myelinated (saltatory conduction):** AP jumps node to node via nodes of Ranvier (~70–120 m/s)

---

## Chemical Synapses

**Sequence of events:**
1. AP arrives at presynaptic terminal
2. Voltage-gated Ca²⁺ channels open → Ca²⁺ influx
3. Synaptic vesicles fuse with membrane → neurotransmitters released by exocytosis
4. NTs diffuse across synaptic cleft → bind receptors on postsynaptic membrane
5. Ion channels open → EPSP (excitatory) or IPSP (inhibitory)
6. NT removed: enzymatic degradation (ACh → acetylcholinesterase), reuptake, diffusion

![Figure 35.19 — Chemical synapse: Ca²⁺ triggers vesicle fusion; neurotransmitter diffuses across the cleft and binds postsynaptic receptors.](${CDN}cb6d479cc9f33a2cd7b18f980c22a887ec64b676)

*Figure 35.19 — The synaptic cleft is 20–40 nm wide; diffusion is fast but the signal must be terminated.*

**Signal summation at axon hillock:**
- **Temporal summation:** repeated EPSPs from same synapse add up
- **Spatial summation:** EPSPs from multiple synapses add up simultaneously

> **Exam tip:** The action potential travels in ONE direction because the region just behind it is in the absolute refractory period. Myelin speeds conduction without requiring more ion channels — energy efficient.
`

const N31_CH49 = `# Ch 49 — Nervous System Organization
*Campbell Biology 12th Ed. · Chapter 49*

---

## CNS & PNS Overview

**CNS:** Brain + Spinal Cord — integration center

**PNS:** All nervous tissue outside CNS
- **Somatic:** voluntary motor control of skeletal muscle; sensory from body surface
- **Autonomic:** involuntary control of viscera
  - **Sympathetic:** "fight-or-flight" — NE; ↑HR, ↑BP, dilates pupils, ↓digestion, ↑blood glucose
  - **Parasympathetic:** "rest-and-digest" — ACh; ↓HR, constricts pupils, ↑digestion

---

## Brain Regions & Functions

| Region | Key Functions |
|--------|-------------|
| **Cerebral cortex** | Conscious thought, language, sensory perception, voluntary movement |
| **Frontal lobe** | Motor cortex, executive function, personality, Broca's area (speech production) |
| **Parietal lobe** | Somatosensory cortex, spatial processing, Wernicke's area (language comprehension) |
| **Temporal lobe** | Auditory processing, memory, language |
| **Occipital lobe** | Visual processing (primary visual cortex) |
| **Cerebellum** | Coordination, balance, fine motor control, procedural memory |
| **Thalamus** | Relay station for all sensory information (except smell) to cortex |
| **Hypothalamus** | Homeostasis (temperature, hunger, thirst, circadian rhythm, sleep); controls pituitary |
| **Amygdala** | Fear, aggression, emotional memory |
| **Hippocampus** | Formation of new explicit (declarative) memories; spatial navigation |
| **Brainstem** | Medulla (breathing, heart rate, BP), Pons (sleep/wake), Midbrain (eye movement) |

![Figure 35.27 — Human brain: four cortical lobes (frontal, parietal, temporal, occipital) with functional areas labeled.](${CDN}ea61a415aa7b240beb0e528f22828939c8019cac)

*Figure 35.27 — Different lobes handle different sensory and motor functions.*

![Figure 35.31 — The limbic system: amygdala, hippocampus, thalamus, and hypothalamus work together for emotion and memory.](${CDN}0d19fadc54dcb8b225de22cf4f533c51051b5b43)

*Figure 35.31 — Damage to the hippocampus prevents formation of new long-term memories.*

---

## Spinal Cord

- **Gray matter** (H-shape): cell bodies, interneurons, synapses
- **White matter** (surrounds gray): myelinated axon tracts
  - **Ascending tracts** — carry sensory signals to brain
  - **Descending tracts** — carry motor commands from brain to muscles

**Reflex arc:** simplest neural circuit; sensory neuron → interneuron (spinal cord) → motor neuron → effector. Bypasses brain (faster response).

> **Exam tip:** Broca's area (frontal lobe) controls speech production; Wernicke's area (temporal lobe) controls language comprehension. Damage to either produces distinct types of aphasia. The cerebellum does NOT initiate movement — it refines and coordinates it.
`

const N32_CH50 = `# Ch 50 — Sensory & Motor Mechanisms
*Campbell Biology 12th Ed. · Chapter 50*

---

## Sensory Reception & Transduction

**Sensory transduction** — converting stimulus energy into a receptor potential (graded electrical change).

**Adaptation** — receptor sensitivity decreases with prolonged stimulation (why you stop noticing a smell).

| Receptor Type | Stimulus | Examples |
|---------------|---------|---------|
| **Mechanoreceptors** | Pressure, stretch, vibration | Touch (Meissner's/Pacinian corpuscles), sound (hair cells), proprioception |
| **Thermoreceptors** | Temperature | Warmth and cold receptors in skin |
| **Nociceptors** | Tissue damage | Pain |
| **Chemoreceptors** | Chemicals | Taste (gustation), smell (olfaction), blood O₂/CO₂ |
| **Photoreceptors (EM)** | Light | Rods and cones in retina |

![Figure 36.3 — Sensory pathways: all modalities except olfaction synapse in the thalamus before reaching cortical areas.](${CDN}be9b1989ecf35559b3f934e2d89b4806d64893ae)

*Figure 36.3 — The thalamus is the gateway to conscious sensory perception.*

---

## Vision — The Eye

**Key structures:**
- **Cornea** — fixed refraction of incoming light
- **Lens** — variable focus (accommodation via ciliary muscles)
- **Retina** — contains photoreceptors (rods + cones)
- **Fovea** — highest cone density; sharpest vision
- **Optic disc** — optic nerve exits; blind spot (no photoreceptors)

![Figure 36.19 — Human eye cross-section: retinal layers from ganglion cells (facing vitreous) to rods/cones (at back).](${CDN}73a574964b3cd7e464b9db2805254ac141d37eb9)

*Figure 36.19 — Light must pass through ganglion and bipolar cell layers to reach rods and cones.*

| Photoreceptor | Location | Function | Pigment |
|---------------|---------|---------|--------|
| **Rods** | Periphery | Dim light, motion, peripheral vision (black & white) | Rhodopsin |
| **Cones** | Fovea mostly | Color, fine detail (requires bright light) | 3 opsins (L, M, S) |

**Phototransduction (rods, dark adaptation):**
1. Dark: cGMP keeps Na⁺ channels open → continuous depolarization → constant glutamate release
2. Light hits rhodopsin → activates transducin (G protein) → activates phosphodiesterase → cGMP decreases → Na⁺ channels CLOSE → **hyperpolarization** → less glutamate → bipolar cell activates ganglion cell → AP in optic nerve

---

## Hearing

Sound waves → ear canal → tympanic membrane → ossicles (malleus, incus, stapes) → oval window → fluid in cochlea → basilar membrane vibration → **hair cells** bent → K⁺ influx → depolarization → auditory nerve → auditory cortex (temporal lobe).

**Pitch:** different frequencies cause maximum vibration at different positions along basilar membrane (high frequency = base; low frequency = apex).

> **Exam tip:** In the dark, rods are depolarized and constantly releasing glutamate. Light HYPERpolarizes rods — this is the opposite of what you might expect from excitation. The brain interprets reduced glutamate release as a "light" signal.
`

const OVERVIEW_MD = `# BIOL 1107 — Principles of Biology I
**Summer 2025 · UConn Downtown Hartford (DWTN) · Dr. Nicole Fusco**

---

## Grading

| Component | Points | Notes |
|-----------|--------|-------|
| **12 Quizzes** (36 pts each) — best 10 count | 360 | Drop 2 lowest |
| **OR Final Exam** (cumulative) | 360 | Whichever is HIGHER replaces quiz total |
| **SLIDO Participation** | 40 | In-class response questions |
| **Lab** | 200 | Separate grade; see lab syllabus |
| **Lecture Total** | **400** | Quizzes/Final + SLIDO |
| **Grand Total** | **600** | |

**Grade Scale:** A = 540–600 · B = 480–539 · C = 420–479 · D = 360–419 · F = below 360

> ⚠️ More than **one unexcused lab absence → automatic F** for the entire course regardless of lecture grade.

---

## Required Materials

- **Campbell Biology** 12th Edition (Urry et al.) — primary text
- **OpenStax Biology 2e** — free alternative at [openstax.org](https://openstax.org/details/books/biology-2e)
- HuskyCT: [lms.uconn.edu](https://lms.uconn.edu) — check daily for updates

---

## Lecture Schedule & Quiz Map

*Lectures: Mon/Tue/Wed · Quizzes administered at the start of class (cover previous day's chapters)*

| Day | Chapters Covered | Quiz (at start of class) |
|-----|-----------------|--------------------------|
| 1 — Mon W1 | Ch 1 (Evolution & Inquiry), Ch 2 (Chemistry) | — |
| 2 — Tue W1 | Ch 3 (Water), Ch 4 (Carbon) | — |
| 3 — Wed W1 | Ch 5 (Macromolecules), Ch 6 (Cell Tour) | **Quiz 1** — Ch 1–2 |
| 4 — Mon W2 | Ch 7 (Membranes), Ch 8 (Metabolism/Enzymes) | **Quiz 2** — Ch 3–4 |
| 5 — Tue W2 | Ch 9 (Cellular Respiration) | **Quiz 3** — Ch 5–6 |
| 6 — Wed W2 | Ch 12 (Cell Cycle), Ch 13 (Meiosis) | **Quiz 4** — Ch 7–8 |
| 7 — Mon W3 | Ch 16 (DNA Inheritance), Ch 17 (Gene→Protein) | **Quiz 5** — Ch 9 + 12 |
| 8 — Tue W3 | Ch 19 (Viruses), Ch 20 (Biotechnology) | **Quiz 6** — Ch 13 + 16 |
| 9 — Wed W3 | Ch 40 (Animal Form), Ch 41 (Digestion) | **Quiz 7** — Ch 17 + 19 |
| 10 — Mon W4 | Ch 42 (Circulation) | **Quiz 8** — Ch 20 + 40 |
| 11 — Tue W4 | Ch 42 (Respiration), Ch 43 (Excretion) | **Quiz 9** — Ch 41 + 42 Circ |
| 12 — Wed W4 | Ch 44 (Immune System), Ch 45 (Endocrine) | **Quiz 10** — Ch 42 Resp + 43 |
| 13 — Mon W5 | Ch 46 (Reproduction) | **Quiz 11** — Ch 44 + 45 |
| 14 — Tue W5 | Ch 48 (Neurons), Ch 49 (Nervous System) | **Quiz 12** — Ch 46 |
| 15 — Wed W5 | Ch 50 (Sensory & Motor); Review | — |

**Final Exam:** Cumulative (all 25 chapters); replaces quiz average if higher.

---

## Lecture Information

| Field | Info |
|-------|------|
| Meeting dates | Summer Session I 2025 |
| Days | Monday, Tuesday & Wednesday |
| Time | 10:00 AM – 12:30 PM |
| Room | DWTN 215 |
| Instructor | Prof. Nicole Fusco |
| Email | nicole.fusco@uconn.edu |

## Lab Information

| Field | Info |
|-------|------|
| Days | Thursday & Friday |
| Time | 10:00 AM – 2:00 PM |
| Room | DWTN 205 |
| Instructors | Nicole Fusco, Jonathan Gilbert |

---

## Core Course Objectives

1. **Structure → Function** is the central organizing principle at every level of biology
2. Evolution unifies all of biology — traits, diversity, and similarity are explained by descent with modification
3. Scientific method: observation → hypothesis → experiment → conclusion (iterative and evidence-based)
4. Modern biotechnology: gel electrophoresis, PCR, CRISPR, recombinant DNA
5. Analyzing scientific literature for integrity of claims and appropriate use of evidence
`

// ─────────────────────────────────────────────────────────────────────────────
// NEW NOTES ARRAY
// ─────────────────────────────────────────────────────────────────────────────

const NEW_NOTES: Array<{ id: string; topicId: string; title: string; contentMd: string }> = [
  { id: 'bio-n-09', topicId: 'bio-t-01', title: 'Ch 1 — Evolution, Themes & Scientific Inquiry',    contentMd: N09_CH1 },
  { id: 'bio-n-10', topicId: 'bio-t-02', title: 'Ch 2 — Chemical Context of Life',                  contentMd: N10_CH2 },
  { id: 'bio-n-11', topicId: 'bio-t-22', title: 'Ch 3 — Water and Life',                            contentMd: N11_CH3 },
  { id: 'bio-n-12', topicId: 'bio-t-23', title: 'Ch 4 — Carbon & Molecular Diversity',              contentMd: N12_CH4 },
  { id: 'bio-n-13', topicId: 'bio-t-24', title: 'Ch 6 — A Tour of the Cell',                        contentMd: N13_CH6 },
  { id: 'bio-n-14', topicId: 'bio-t-07', title: 'Ch 7 — Membrane Structure & Function',             contentMd: N14_CH7 },
  { id: 'bio-n-15', topicId: 'bio-t-10', title: 'Ch 9 — Respiration Pathways & Figures',            contentMd: N15_CH9_FIGS },
  { id: 'bio-n-16', topicId: 'bio-t-11', title: 'Ch 12 — Cell Cycle & Mitosis',                     contentMd: N16_CH12 },
  { id: 'bio-n-17', topicId: 'bio-t-14', title: 'Ch 13 — Meiosis & Sexual Life Cycles',             contentMd: N17_CH13 },
  { id: 'bio-n-18', topicId: 'bio-t-13', title: 'Ch 16 — Molecular Basis of Inheritance',           contentMd: N18_CH16 },
  { id: 'bio-n-19', topicId: 'bio-t-17', title: 'Ch 17 — From Gene to Protein',                     contentMd: N19_CH17 },
  { id: 'bio-n-20', topicId: 'bio-t-16', title: 'Ch 19 — Viruses',                                  contentMd: N20_CH19 },
  { id: 'bio-n-21', topicId: 'bio-t-15', title: 'Ch 20 — Biotechnology',                            contentMd: N21_CH20 },
  { id: 'bio-n-22', topicId: 'bio-t-25', title: 'Ch 40 — Animal Form & Function',                   contentMd: N22_CH40 },
  { id: 'bio-n-23', topicId: 'bio-t-06', title: 'Ch 41 — Nutrition & Digestion',                    contentMd: N23_CH41 },
  { id: 'bio-n-24', topicId: 'bio-t-18', title: 'Ch 42 — Circulatory System',                       contentMd: N24_CH42_CIRC },
  { id: 'bio-n-25', topicId: 'bio-t-08', title: 'Ch 42 — Respiratory System',                       contentMd: N25_CH42_RESP },
  { id: 'bio-n-26', topicId: 'bio-t-12', title: 'Ch 43 — Excretory System',                         contentMd: N26_CH43 },
  { id: 'bio-n-27', topicId: 'bio-t-21', title: 'Ch 44 — Immune System',                            contentMd: N27_CH44 },
  { id: 'bio-n-28', topicId: 'bio-t-19', title: 'Ch 45 — Endocrine System',                         contentMd: N28_CH45 },
  { id: 'bio-n-29', topicId: 'bio-t-26', title: 'Ch 46 — Reproduction',                             contentMd: N29_CH46 },
  { id: 'bio-n-30', topicId: 'bio-t-27', title: 'Ch 48 — Neurons, Synapses & Signaling',            contentMd: N30_CH48 },
  { id: 'bio-n-31', topicId: 'bio-t-20', title: 'Ch 49 — Nervous System Organization',              contentMd: N31_CH49 },
  { id: 'bio-n-32', topicId: 'bio-t-28', title: 'Ch 50 — Sensory & Motor Mechanisms',               contentMd: N32_CH50 },
]

// ─────────────────────────────────────────────────────────────────────────────
// 12 QUIZ-PREP FLASHCARD DECKS
// ─────────────────────────────────────────────────────────────────────────────

type Deck = { deckId: string; title: string; topicId?: string; cards: Array<{ front: string; back: string }> }

const QUIZ_DECKS: Deck[] = [
  {
    deckId: 'bio-deck-q1',
    title: 'Quiz 1 Prep — Evolution & Chemistry (Ch 1–2)',
    cards: [
      { front: 'What are the eight properties shared by all living things?', back: 'Order, Evolutionary adaptation, Response to environment, Regulation (homeostasis), Energy processing, Growth & development, Reproduction, Biological evolution. Mnemonic: OERREGR + Evolution.' },
      { front: 'What are Darwin\'s four key components of natural selection?', back: '1. Variation — heritable differences exist in populations\n2. Overproduction — more offspring than can survive\n3. Differential survival/reproduction — individuals with favorable traits survive more\n4. Adaptation — favorable traits increase in frequency over generations' },
      { front: 'List the levels of biological organization from atom to biosphere.', back: 'Atom → Molecule → Organelle → Cell → Tissue → Organ → Organ System → Organism → Population → Community → Ecosystem → Biosphere' },
      { front: 'What is the difference between inductive and deductive reasoning?', back: 'Inductive: specific observations → broad generalization (used to form hypotheses)\nDeductive: general principle → specific prediction (used to test hypotheses)\nBoth are used in science; deductive produces "if-then" predictions from a hypothesis.' },
      { front: 'What are the three subatomic particles and their charges/locations?', back: 'Protons (+1) — nucleus; define the element (atomic number)\nNeutrons (0) — nucleus; contribute to mass number\nElectrons (−1) — orbitals; determine bonding and reactivity' },
      { front: 'What are isotopes? Give a biological example.', back: 'Isotopes: atoms of the same element with different numbers of neutrons (same atomic number, different mass number).\nExamples: ¹²C vs ¹⁴C (carbon dating), ³²P (labels DNA), ¹⁸O (tracing water/O₂ in photosynthesis).' },
      { front: 'Define electronegativity and rank O, N, C, H from highest to lowest.', back: 'Electronegativity = an atom\'s ability to attract shared electrons in a covalent bond.\nRanking: O > N > C ≈ H\nWhen O bonds to H, electrons spend more time near O → partial charges (δ− on O, δ+ on H) → polar bond.' },
      { front: 'Compare ionic, covalent, and hydrogen bonds.', back: 'Ionic: electron TRANSFER; forms ions; broken in water (NaCl)\nCovalent: electron SHARING; strongest biological bond; polar (unequal) or nonpolar (equal) sharing\nHydrogen: weak attraction between δ+ H and δ− O or N on nearby molecule; individually weak but collectively important' },
      { front: 'What is the octet rule and why is it important in biology?', back: 'Atoms tend to gain, lose, or share electrons to achieve 8 electrons in their outermost (valence) shell.\nImportance: determines how many bonds an atom forms (C forms 4, N forms 3, O forms 2, H forms 1). Explains covalent bonding in organic molecules.' },
      { front: 'What is the difference between a polar covalent bond and a nonpolar covalent bond?', back: 'Nonpolar covalent: electrons shared equally (between same or similar atoms, e.g., C–C, C–H). Hydrophobic.\nPolar covalent: electrons shared unequally due to electronegativity difference (e.g., O–H, N–H). Creates partial charges. Hydrophilic.' },
      { front: 'How many valence electrons does carbon have, and what does this mean for bonding?', back: 'Carbon has 4 valence electrons → forms 4 covalent bonds. It can bond to H, O, N, S, and other C atoms in chains, branches, or rings — creating the enormous structural diversity of organic molecules.' },
      { front: 'What is a hypothesis vs. a theory in science?', back: 'Hypothesis: a specific, testable, falsifiable explanation for an observation (an educated guess).\nTheory: a broad, well-substantiated explanation supported by extensive evidence and repeated testing (e.g., cell theory, evolutionary theory). NOT a guess — a theory is the highest level of scientific understanding.' },
      { front: 'What is the difference between a control group and an experimental group?', back: 'Experimental group: exposed to the independent variable being tested.\nControl group: identical in all ways EXCEPT the independent variable; provides a baseline for comparison.\nBoth groups are treated identically otherwise to isolate the effect of the independent variable.' },
      { front: 'What is radioactive carbon-14 (¹⁴C) dating and what is it used for?', back: '¹⁴C is a radioactive isotope of carbon incorporated into living organisms from CO₂. When an organism dies, ¹⁴C decays at a known rate (half-life = 5,730 years). By measuring remaining ¹⁴C, scientists can date organic materials up to ~50,000 years old.' },
      { front: 'What is van der Waals interaction and when is it biologically significant?', back: 'Weak, transient attractions between nonpolar molecules due to temporary dipoles caused by electron movement.\nSignificant when many are present simultaneously (e.g., hydrophobic interactions in proteins, gecko feet adhesion, packing of hydrophobic tails in membranes).' },
    ],
  },
  {
    deckId: 'bio-deck-q2',
    title: 'Quiz 2 Prep — Water & Carbon (Ch 3–4)',
    cards: [
      { front: 'What are the four emergent properties of water that make it vital for life?', back: '1. Cohesion & adhesion (hydrogen bonds between water molecules; water–surface bonds)\n2. Temperature moderation (high specific heat; high heat of vaporization)\n3. Ice less dense than liquid water (ice floats; protects aquatic life)\n4. Versatile solvent (dissolves polar and ionic substances)' },
      { front: 'Why does evaporative cooling work, and why is it important for organisms?', back: 'Evaporation of water requires breaking hydrogen bonds → absorbs heat. The highest-energy (hottest) water molecules evaporate first, cooling the remaining liquid.\nImportance: sweating cools mammals; water transpiring from leaves cools plants.' },
      { front: 'Why is ice less dense than liquid water? What is the ecological significance?', back: 'In ice, each water molecule forms 4 hydrogen bonds in a crystal lattice → molecules are held farther apart than in liquid water → lower density.\nEcological significance: ice floats and insulates liquid water below, preventing lakes and ponds from freezing solid and allowing aquatic life to survive winter.' },
      { front: 'Define pH. What does a change of one pH unit represent?', back: 'pH = −log₁₀[H⁺]. Measures hydrogen ion concentration.\nA change of 1 pH unit = a 10× change in [H⁺] (logarithmic scale).\npH 7 = neutral; below 7 = acidic (more H⁺); above 7 = basic (more OH⁻).' },
      { front: 'What is a buffer, and how does the bicarbonate buffer system work?', back: 'Buffer: a substance that minimizes pH changes by accepting or donating H⁺.\nBicarbonate buffer: CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻\nExcess H⁺ → shifts left (absorbed); too basic → shifts right (H⁺ released). Maintains blood pH at 7.35–7.45.' },
      { front: 'Why is carbon ideal for building the large, complex molecules of life?', back: 'Carbon has 4 valence electrons → forms 4 covalent bonds. It can bond to H, O, N, S, and other carbons in chains, branches, and rings, creating enormous structural diversity. Carbon–carbon bonds are stable and allow long polymers.' },
      { front: 'List the seven major functional groups with their formulas and properties.', back: 'Hydroxyl (–OH): polar, H-bonding\nCarbonyl (C=O): polar; ketone or aldehyde\nCarboxyl (–COOH): acidic, donates H⁺\nAmino (–NH₂): basic, accepts H⁺\nSulfhydryl (–SH): forms disulfide bonds\nPhosphate (–OPO₃²⁻): acidic; energy transfer\nMethyl (–CH₃): nonpolar; affects gene regulation' },
      { front: 'What are structural isomers vs. geometric isomers vs. enantiomers?', back: 'Structural isomers: same molecular formula, different covalent arrangements (e.g., glucose vs. fructose, both C₆H₁₂O₆)\nGeometric isomers: same bonds but different spatial arrangement around a double bond (cis vs. trans fats)\nEnantiomers: mirror images (L vs. D forms); only one form is biologically active (stereospecific enzymes)' },
      { front: 'What is dehydration synthesis? What is hydrolysis? What bonds do they form/break?', back: 'Dehydration synthesis (condensation): monomers join by releasing H₂O; forms glycosidic bonds (sugars), peptide bonds (proteins), ester bonds (fats), phosphodiester bonds (nucleic acids).\nHydrolysis: polymer + H₂O → monomers; breaks those same bonds. Digestion is enzymatic hydrolysis.' },
      { front: 'Why are L-amino acids and D-sugars used in biology instead of their mirror images?', back: 'Life uses only L-amino acids and D-sugars (chirality is asymmetric). Enzymes are stereospecific — they have a precise 3D active site that only fits one enantiomer. Using one form ensures consistent molecular interactions and enzyme activity.' },
      { front: 'What distinguishes a saturated fatty acid from an unsaturated one?', back: 'Saturated: all C–C single bonds; maximum H atoms; straight chain → pack tightly → solid at room temperature (animal fats, butter).\nUnsaturated: one or more C=C double bonds; cis configuration creates kinks → cannot pack tightly → liquid at room temperature (plant oils).' },
      { front: 'What is the difference between hydrophilic and hydrophobic molecules?', back: 'Hydrophilic ("water-loving"): polar or charged molecules that interact with water via hydrogen bonds (sugars, amino acids, salts). Dissolve in water.\nHydrophobic ("water-fearing"): nonpolar molecules that do not interact with water (fats, oils, hydrocarbons). Do not dissolve in water; cluster together (hydrophobic effect).' },
      { front: 'What makes phospholipids amphipathic, and why is this property critical?', back: 'Amphipathic: having both hydrophilic and hydrophobic regions.\nPhospholipid: hydrophilic head (phosphate + glycerol) + two hydrophobic fatty acid tails.\nIn water, phospholipids spontaneously form bilayers (heads face water, tails face inward) → the basis of all cell membranes.' },
      { front: 'What functional groups are on an amino acid, and which is acidic vs. basic?', back: 'Every amino acid has:\n• Amino group (–NH₂) → BASIC (accepts H⁺)\n• Carboxyl group (–COOH) → ACIDIC (donates H⁺)\n• R group (side chain) → determines identity and properties\nAmino acids are amphoteric — they can act as acids OR bases.' },
      { front: 'What are steroids structurally, and what are three biological examples?', back: 'Steroids: lipids with four fused carbon rings (not fatty acid chains). Are hydrophobic.\nExamples: cholesterol (membrane component; precursor to steroid hormones), testosterone (male sex hormone), estrogen (female sex hormone), cortisol (stress hormone).' },
    ],
  },
  {
    deckId: 'bio-deck-q3',
    title: 'Quiz 3 Prep — Macromolecules & Cell Tour (Ch 5–6)',
    cards: [
      { front: 'Name the four classes of biological macromolecules and their monomers.', back: 'Carbohydrates → monosaccharides (glucose, fructose, galactose)\nLipids → glycerol + fatty acids (not true polymers)\nProteins → amino acids (20 types)\nNucleic acids → nucleotides (sugar + phosphate + nitrogenous base)' },
      { front: 'Compare starch, glycogen, and cellulose — monomers, bonds, and functions.', back: 'Starch (plants): α-glucose; α-1,4 + α-1,6 glycosidic bonds; energy storage\nGlycogens (animals): α-glucose; more branched than starch; rapid energy mobilization in liver/muscle\nCellulose (plants): β-glucose; β-1,4 bonds; structural (cell walls); humans cannot digest' },
      { front: 'What are the four levels of protein structure?', back: '1. Primary: amino acid sequence (peptide bonds)\n2. Secondary: α-helices and β-pleated sheets (H-bonds between backbone atoms)\n3. Tertiary: overall 3D shape — R-group interactions, disulfide bonds, hydrophobic core\n4. Quaternary: multiple polypeptide subunits (e.g., hemoglobin = 4 subunits)' },
      { front: 'What is protein denaturation and what causes it?', back: 'Denaturation: disruption of 3D structure (secondary, tertiary, quaternary) without breaking peptide bonds (primary structure intact) → protein loses function.\nCauses: heat, extreme pH, chemical denaturants (urea), detergents.\nOften irreversible (cooked egg white).' },
      { front: 'What distinguishes saturated from unsaturated fats physically and structurally?', back: 'Saturated: no C=C double bonds; straight, packed hydrocarbon tails; solid at room temp (butter, lard).\nUnsaturated: one or more cis C=C double bonds; kinked tails; cannot pack tightly; liquid at room temp (olive oil).\nTrans fats: partially hydrogenated; straight (like saturated) → raise LDL, lower HDL.' },
      { front: 'What is the structural difference between DNA and RNA?', back: 'DNA: deoxyribose sugar; bases A, T, G, C; double-stranded helix; nucleus\nRNA: ribose sugar (has 2\'–OH); bases A, U, G, C (uracil replaces thymine); usually single-stranded; nucleus + cytoplasm' },
      { front: 'What are the key differences between prokaryotes and eukaryotes?', back: 'Prokaryotes: no membrane-bound nucleus; circular DNA; no membrane organelles; 70S ribosomes; bacteria and archaea; 1–10 μm\nEukaryotes: membrane-bound nucleus; linear DNA + histones; membrane organelles; 80S ribosomes (70S in mitochondria/chloroplasts); 10–100 μm' },
      { front: 'Describe the structure and function of the nucleus.', back: 'Structure: double-membrane nuclear envelope with nuclear pores; nucleolus (rRNA + ribosome assembly); chromatin (DNA + histone proteins)\nFunction: stores genetic information; site of DNA replication and transcription; ribosome assembly in nucleolus' },
      { front: 'What is the endomembrane system? List its components and general function.', back: 'A network of membranes that manufactures, processes, and ships proteins/lipids.\nComponents: rough ER (protein synthesis/modification) → transport vesicles → Golgi apparatus (modify/sort/ship) → secretory vesicles → plasma membrane or lysosomes\nSmooth ER: lipid synthesis, detox, Ca²⁺ storage' },
      { front: 'What is the role of the Golgi apparatus?', back: 'Receives vesicles from rough ER (cis face), modifies proteins (glycosylation, phosphorylation), sorts them, and ships them via secretory vesicles from the trans face.\nDestinations: plasma membrane (secretion), lysosomes (digestion), or retention in endomembrane system.\nOften called the "post office" of the cell.' },
      { front: 'What are lysosomes, and what happens if they malfunction?', back: 'Lysosomes: membrane-bound vesicles containing ~40 hydrolytic enzymes; internal pH ≈ 5 (acidic).\nFunction: digest macromolecules, worn-out organelles (autophagy), foreign material (phagocytosis).\nMalfunction (e.g., Tay-Sachs): enzyme deficiency → accumulation of undigested material → cell death.' },
      { front: 'What are three components of the cytoskeleton and their functions?', back: 'Microtubules (25 nm, tubulin): cell shape; chromosome movement (spindle fibers); cilia/flagella; tracks for motor proteins (kinesin, dynein)\nMicrofilaments/actin (7 nm): cell shape; muscle contraction; cell motility; cytokinesis cleavage furrow\nIntermediate filaments (8–12 nm): structural support; anchor nucleus; resist mechanical stress' },
      { front: 'What evidence supports the endosymbiotic theory for the origin of mitochondria and chloroplasts?', back: '1. Both have double membranes (outer = engulfment; inner = original prokaryote membrane)\n2. Both contain circular DNA (like bacteria)\n3. Both have 70S ribosomes (like bacteria, not eukaryotic 80S)\n4. Both reproduce by binary fission\n5. Inner membrane composition similar to bacteria' },
      { front: 'What is cell fractionation and what is it used for?', back: 'Cell fractionation: breaking cells and using centrifugation at progressively higher speeds to separate organelles by size/density.\nSequence: nuclei (low speed) → mitochondria/chloroplasts (medium) → ribosomes/ER fragments (high) → cytosol (supernatant).\nUsed to isolate organelles and study their specific biochemical functions.' },
      { front: 'What is the surface area-to-volume ratio, and why does it limit cell size?', back: 'As a cell grows, volume increases faster than surface area (surface area ∝ r²; volume ∝ r³).\nSmall SA:V ratio means: insufficient membrane to exchange nutrients/wastes fast enough for the entire cell volume.\nThis limits maximum cell size and explains why cells divide (mitosis) rather than growing indefinitely.' },
    ],
  },
  {
    deckId: 'bio-deck-q4',
    title: 'Quiz 4 Prep — Membranes & Metabolism (Ch 7–8)',
    cards: [
      { front: 'Describe the fluid mosaic model of the plasma membrane.', back: 'A phospholipid bilayer that is:\n• Fluid — phospholipids and proteins move laterally (not flip-flop without flipase)\n• Mosaic — diverse proteins embedded (integral = span bilayer; peripheral = attached to surface)\nAlso contains cholesterol (fluidity buffer), glycolipids, and glycoproteins (cell recognition).' },
      { front: 'What makes the membrane selectively permeable?', back: 'The hydrophobic core of the phospholipid bilayer blocks passage of large or charged molecules.\nAllows free passage: small nonpolar (O₂, CO₂, N₂), small uncharged polar (water, ethanol)\nRequires protein assistance: ions, large polar molecules (glucose, amino acids)' },
      { front: 'What is osmosis? Define osmolarity, hypo/hyper/isotonic.', back: 'Osmosis: diffusion of water across a selectively permeable membrane from low solute concentration to high solute concentration (down the water potential gradient).\nHypotonic: solute outside < inside → water enters → cell swells (animal: lyses; plant: turgid = good)\nHypertonic: solute outside > inside → water exits → cell shrinks (animal: crenation; plant: plasmolysis)\nIsotonic: equal solutes; no net water movement' },
      { front: 'Compare passive and active transport.', back: 'Passive transport: moves substances DOWN their concentration gradient; NO ATP required\n• Simple diffusion: through lipid bilayer (O₂, CO₂, small nonpolar)\n• Facilitated diffusion: through channel or carrier proteins (glucose, ions, water/aquaporins)\nActive transport: moves substances AGAINST their concentration gradient; REQUIRES ATP\n• Example: Na⁺/K⁺ ATPase (3 Na⁺ out, 2 K⁺ in per ATP)' },
      { front: 'How does the Na⁺/K⁺ ATPase pump work and why is it important?', back: 'Pumps 3 Na⁺ OUT of cell and 2 K⁺ INTO cell per ATP hydrolyzed (against their gradients).\nImportance:\n1. Maintains resting membrane potential (−70 mV) in neurons\n2. Drives secondary active transport (cotransporters use Na⁺ gradient)\n3. Regulates cell volume (prevents osmotic swelling)\nUses ~30% of a typical cell\'s ATP.' },
      { front: 'Compare endocytosis types: phagocytosis, pinocytosis, receptor-mediated.', back: 'All bring material IN by membrane engulfment (requires ATP).\nPhagocytosis ("cell eating"): large solid particles (bacteria, food); forms phagosome → fuses with lysosome\nPinocytosis ("cell drinking"): nonspecific; small droplets of extracellular fluid; forms tiny vesicle\nReceptor-mediated endocytosis: specific molecules (LDL, insulin, iron) bind cell surface receptors → coated pit → coated vesicle. Most selective and efficient.' },
      { front: 'What is free energy (ΔG) and how does it determine if a reaction is spontaneous?', back: 'Free energy (G): the energy available to do work in a biological system.\nΔG < 0 (negative): exergonic reaction; releases free energy; spontaneous; products more stable\nΔG > 0 (positive): endergonic reaction; requires free energy input; NOT spontaneous\nΔG = 0: at equilibrium\nCells couple exergonic reactions (usually ATP hydrolysis) to drive endergonic ones.' },
      { front: 'What is activation energy, and how do enzymes lower it?', back: 'Activation energy (Ea): the energy needed to break reactant bonds and start a reaction, even if the reaction is exergonic overall.\nEnzymes LOWER Ea (without being consumed) by:\n1. Positioning substrates correctly in active site\n2. Stressing/distorting substrate bonds\n3. Providing a microenvironment (pH, charge) that promotes the reaction\nResult: reaction rate increases by 10⁶–10¹² fold.' },
      { front: 'Describe the induced-fit model of enzyme action.', back: 'The enzyme active site is NOT a rigid lock. When the substrate binds, both the substrate AND the enzyme change shape slightly (conformational change) to optimize the interaction.\nThis is "induced fit" — the active site molds around the substrate.\nThe enzyme then destabilizes the substrate → transition state → products form → enzyme releases and returns to original shape.' },
      { front: 'Compare competitive vs. noncompetitive inhibition.', back: 'Competitive: inhibitor MIMICS substrate; competes for active site; overcome by adding more substrate; increases apparent Km; does NOT change Vmax\nNoncompetitive: inhibitor binds allosteric site (away from active site); changes active site shape; cannot be overcome with more substrate; decreases Vmax; does NOT change Km' },
      { front: 'What is allosteric regulation and why is it important?', back: 'Allosteric regulation: binding of a molecule at a site OTHER than the active site that changes the enzyme\'s shape and activity.\nActivators: increase enzyme activity (positive allosteric regulation)\nInhibitors: decrease enzyme activity (negative allosteric regulation → feedback inhibition)\nImportance: allows rapid, reversible regulation without gene expression changes; key in metabolic pathway control.' },
      { front: 'What are cofactors and coenzymes? Give examples.', back: 'Cofactors: inorganic ions required for enzyme activity. Examples: Mg²⁺ (many enzymes), Zn²⁺ (carbonic anhydrase), Fe²⁺ (hemoglobin, cytochromes)\nCoenzymes: organic molecules (often vitamins) that act as cofactors. Examples: NAD⁺/NADH (niacin/B3), FAD/FADH₂ (riboflavin/B2), Coenzyme A (pantothenic acid)' },
      { front: 'How does cholesterol affect membrane fluidity, and why is this important?', back: 'Cholesterol is wedged between phospholipids in the bilayer.\nAt high temperatures: cholesterol restrains phospholipid movement → prevents excessive fluidity\nAt low temperatures: cholesterol disrupts packing → prevents membrane from becoming too rigid\nResult: cholesterol acts as a "fluidity buffer" — maintains appropriate membrane fluidity across temperature ranges.' },
      { front: 'What factors affect enzyme activity?', back: 'Temperature: increases rate up to optimum; above optimum → denaturation\npH: each enzyme has optimal pH; extremes disrupt bonds and ionization of active site\nSubstrate concentration: increases rate until enzyme is saturated (all active sites occupied) = Vmax\nEnzyme concentration: more enzyme = more product (if substrate is not limiting)\nInhibitors: decrease activity (competitive or noncompetitive)' },
      { front: 'What is the role of ATP in cellular work, and how is it regenerated?', back: 'ATP (adenosine triphosphate) is the universal energy currency of cells.\nHydrolysis: ATP + H₂O → ADP + Pᵢ releases ~7.3 kcal/mol free energy → powers cellular work\nThree types of work: mechanical (motor proteins), transport (active transport), chemical (biosynthesis)\nRegenerated: by cellular respiration (oxidative phosphorylation) + substrate-level phosphorylation + photosynthesis in plants.' },
    ],
  },
  {
    deckId: 'bio-deck-q5',
    title: 'Quiz 5 Prep — Respiration & Mitosis (Ch 9 + 12)',
    cards: [
      { front: 'Write the overall equation for aerobic cellular respiration.', back: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~32 ATP\n(Glucose + Oxygen → Carbon dioxide + Water + ATP)' },
      { front: 'What happens in glycolysis? Where? What are the products?', back: 'Location: CYTOPLASM (cytosol); does not require O₂\nProcess: 1 glucose (6C) → 2 pyruvate (3C) in 10 enzymatic steps\nEnergy investment: 2 ATP used\nEnergy payoff: 4 ATP + 2 NADH produced\nNet per glucose: 2 ATP + 2 NADH + 2 pyruvate' },
      { front: 'What happens in the Krebs cycle? Where? What are the products per glucose?', back: 'Location: MITOCHONDRIAL MATRIX\nEach pyruvate → acetyl-CoA (loses CO₂, makes NADH)\nAcetyl-CoA + oxaloacetate → citrate → 8-step cycle → oxaloacetate regenerated\nPer glucose (2 turns): 2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂ released' },
      { front: 'What is the electron transport chain? Where is it located? What is O₂\'s role?', back: 'Location: INNER MITOCHONDRIAL MEMBRANE\nNADH and FADH₂ donate electrons to protein complexes (I→III→IV)\nElectrons pass along, releasing energy → H⁺ pumped into intermembrane space\nO₂ is the FINAL ELECTRON ACCEPTOR: O₂ + 4e⁻ + 4H⁺ → 2H₂O\nWithout O₂, ETC stops and aerobic respiration halts.' },
      { front: 'What is chemiosmosis and how does ATP synthase work?', back: 'Chemiosmosis: coupling of ion gradient to ATP synthesis.\n1. ETC pumps H⁺ into intermembrane space → electrochemical gradient (proton-motive force)\n2. H⁺ flows DOWN gradient back into matrix through ATP synthase\n3. ATP synthase uses this H⁺ flow to phosphorylate ADP → ATP\nATP synthase is a molecular motor — H⁺ flow spins a rotor, driving conformational changes that catalyze ATP synthesis.' },
      { front: 'What is the total ATP yield from one glucose in aerobic respiration?', back: 'Glycolysis: 2 ATP (net) + 2 NADH\nPyruvate oxidation: 2 NADH\nKrebs cycle: 2 ATP + 6 NADH + 2 FADH₂\nETC: ~28 ATP (from 10 NADH × ~2.5 + 2 FADH₂ × ~1.5)\nTotal: ~32 ATP per glucose (textbook values vary from 30–36)' },
      { front: 'Compare lactic acid and alcoholic fermentation.', back: 'Both: anaerobic; only produce 2 ATP (from glycolysis); purpose is to regenerate NAD⁺\nLactic acid: pyruvate + NADH → lactate + NAD⁺; occurs in muscle cells, red blood cells, Lactobacillus\nAlcoholic: pyruvate + NADH → ethanol + CO₂ + NAD⁺; occurs in yeast and some bacteria\nNeither produces more ATP — they only enable glycolysis to continue.' },
      { front: 'What are the phases of the cell cycle in order?', back: 'INTERPHASE:\n• G₁ (Gap 1): growth, normal functions, decision to divide\n• S (Synthesis): DNA replication\n• G₂ (Gap 2): growth, preparation for mitosis\nM PHASE:\n• Mitosis (PMAT: Prophase, Prometaphase, Metaphase, Anaphase, Telophase)\n• Cytokinesis (cell division)' },
      { front: 'What are the four stages of mitosis and the key event of each?', back: 'Prophase: chromatin condenses → chromosomes visible; spindle forms; nucleolus disappears\nMetaphase: chromosomes align at METAPHASE PLATE (cell equator); kinetochore microtubules fully attached\nAnaphase: sister chromatids separate → pulled to opposite poles; cell elongates\nTelophase: nuclear envelopes reform; chromosomes decondense; spindle disappears' },
      { front: 'How does cytokinesis differ in animal vs. plant cells?', back: 'Animal cells: CLEAVAGE FURROW — actin microfilament ring pinches inward at the cell equator until the cell divides\nPlant cells: CELL PLATE — Golgi-derived vesicles carrying cell wall material fuse at cell equator; new cell wall (cell plate) grows outward to periphery\nReason for difference: plant cells have rigid cell walls that prevent pinching.' },
      { front: 'What are the three cell cycle checkpoints and what do they monitor?', back: 'G₁ checkpoint (RESTRICTION POINT): cell size, nutrient availability, growth factors, DNA integrity. If OK → commits to divide (S phase)\nG₂ checkpoint: checks DNA replication completeness, DNA damage. If OK → enters mitosis\nM checkpoint (SPINDLE ASSEMBLY): checks that all kinetochores are attached to spindle fibers. If OK → anaphase begins' },
      { front: 'How do cyclins and CDKs regulate the cell cycle?', back: 'CDKs (Cyclin-Dependent Kinases): always present; inactive alone.\nCyclins: accumulate at specific cell cycle phases; bind CDK → active complex that phosphorylates target proteins → advances cell through cycle.\nExample: cyclin D/CDK4-6 at G₁ → phosphorylates Rb → releases E2F transcription factor → S phase genes expressed.\nCyclin levels fall after each phase; rapid degradation prevents re-entry.' },
      { front: 'What is the difference between a proto-oncogene and an oncogene?', back: 'Proto-oncogene: normal gene that promotes cell growth and division when activated (e.g., Ras GTPase, growth factor receptors).\nOncogene: mutated/overexpressed proto-oncogene that promotes cell division even WITHOUT proper signals ("stuck on" = accelerator stuck down).\nMutation types: point mutation, gene amplification, translocation (Philadelphia chromosome in CML).' },
      { front: 'How do tumor suppressor genes normally function, and what happens when they are mutated?', back: 'Tumor suppressors (e.g., p53, Rb/retinoblastoma protein):\n• Rb: blocks cell cycle at G₁ until phosphorylated; prevents premature S phase entry\n• p53: activated by DNA damage → arrests cell cycle, stimulates DNA repair, or triggers apoptosis\nMutation: lose their braking function → cell divides despite damage or without proper signals → cancer risk.\nBOTH copies of gene must usually be mutated (two-hit hypothesis).' },
      { front: 'What is contact inhibition, and how is it lost in cancer?', back: 'Contact inhibition: normal cells stop dividing when they make contact with neighboring cells (density-dependent inhibition) — they only form a single-cell layer.\nCancer cells: lose contact inhibition → continue dividing when touching other cells → pile up into tumor masses.\nAlso lose anchorage dependence (normal cells require attachment to substrate to divide; cancer cells do not).' },
    ],
  },
  {
    deckId: 'bio-deck-q6',
    title: 'Quiz 6 Prep — Meiosis & DNA Inheritance (Ch 13 + 16)',
    cards: [
      { front: 'What are the key differences between mitosis and meiosis?', back: 'Mitosis: 1 division → 2 genetically IDENTICAL diploid (2n) cells; for growth, repair, asexual reproduction\nMeiosis: 2 divisions → 4 genetically UNIQUE haploid (n) cells; for sexual reproduction (gamete production)\nMeiosis includes synapsis and crossing over in Prophase I — no equivalent in mitosis' },
      { front: 'What are homologous chromosomes?', back: 'Homologs (homologous chromosome pairs): two chromosomes with the same genes at the same loci but potentially different alleles; one inherited from each parent.\nIn humans: 23 pairs (46 total); includes one pair of sex chromosomes (XX or XY).\nHomologs pair during Prophase I (synapsis); sisters chromatids pair during Prophase of mitosis.' },
      { front: 'What is synapsis and when does it occur?', back: 'Synapsis: the precise alignment (pairing) of homologous chromosomes during PROPHASE I of meiosis, held together by the synaptonemal complex.\nResult: forms a BIVALENT (or TETRAD) = 4 chromatids (2 chromosomes × 2 sister chromatids each).\nCrossing over occurs at synapsis between non-sister chromatids of homologs.' },
      { front: 'What is crossing over and what is its significance?', back: 'Crossing over (recombination): exchange of DNA segments between NON-SISTER chromatids of homologous chromosomes during Prophase I.\nOccurs at CHIASMATA (visible as X-shaped structures in microscopy).\nSignificance: creates new combinations of alleles on a single chromosome → genetic recombination → increased variation among offspring. This is why you are not simply a mix of just your parents\' combinations.' },
      { front: 'What is independent assortment and how much variation does it produce in humans?', back: 'Independent assortment: homologous chromosome pairs orient RANDOMLY at the metaphase I plate; which chromosome goes to which pole is independent for each pair.\nFor humans (23 pairs): 2²³ = ~8.4 million possible combinations of chromosomes in a gamete.\nRandom fertilization: 8.4 million × 8.4 million ≈ 70 trillion possible zygote combinations.' },
      { front: 'What happens in Meiosis I vs. Meiosis II?', back: 'Meiosis I (REDUCTIONAL): homologs separate; diploid → two haploid cells (each still has 2 chromatids per chromosome)\nMeiosis II (EQUATIONAL): sister chromatids separate; like mitosis; each haploid cell → two haploid cells\nKey: DNA replicates ONCE before meiosis, but the cell divides TWICE → net = 4 haploid cells.' },
      { front: 'What are the three sources of genetic variation in sexual reproduction?', back: '1. Crossing over (Prophase I) — new allele combinations within chromosomes\n2. Independent assortment (Metaphase I) — random distribution of homologs → 2²³ chromosome combinations\n3. Random fertilization — any sperm + any egg → enormous diversity\nThese three mechanisms together explain why offspring of the same parents are not identical (except identical twins).' },
      { front: 'Describe Griffith\'s transformation experiment (1928). What was the conclusion?', back: 'Griffith mixed heat-killed virulent S-strain bacteria with live non-virulent R-strain bacteria, then injected into mice → mice DIED.\nS bacteria were recovered from mice — R bacteria had been transformed into virulent S.\nConclusion: a "transforming principle" passed from heat-killed S to live R cells, converting them permanently.\n(Griffith did NOT know the chemical identity of the transforming principle.)' },
      { front: 'What did the Hershey-Chase experiment prove? How?', back: 'Proved DNA (not protein) is the genetic material.\nMethod: labeled phage DNA with ³²P (radioactive phosphorus) and phage protein with ³⁵S (radioactive sulfur).\nResult after infection: bacteria were radioactive for ³²P (DNA entered) but NOT ³⁵S (protein stayed outside in capsid).\nConclusion: DNA is the molecule injected into bacteria → DNA carries hereditary information.' },
      { front: 'State Chargaff\'s rules. Why are they significant?', back: 'In any DNA sample: [A] = [T] and [G] = [C] (amounts of purines = amounts of pyrimidines).\nBut A+T / G+C ratio varies by species.\nSignificance: suggested complementary base pairing between A-T and G-C → key insight for Watson & Crick\'s double helix model. Explains why one strand can serve as template for the other.' },
      { front: 'Describe the structure of the DNA double helix.', back: 'Two antiparallel polynucleotide strands wound in a right-handed helix.\nBases on INSIDE: A=T (2 hydrogen bonds); G≡C (3 hydrogen bonds) — always purine-pyrimidine pairing\nSugar-phosphate BACKBONE on outside\nDimensions: 3.4 nm per complete turn; 0.34 nm between base pairs; 2 nm wide; 10 base pairs per turn' },
      { front: 'What are nucleosomes and how do they compact DNA?', back: 'A nucleosome = 147 bp of DNA wrapped ~2 times around an octamer of 8 histone proteins (2 each of H2A, H2B, H3, H4).\nHistones are positively charged (Lys, Arg-rich) → attract negatively charged DNA backbone.\nCompaction levels: nucleosomes ("beads on a string") → 30-nm fiber → looped domains → metaphase chromosome (~10,000× compaction total).' },
      { front: 'What is the difference between a purine and a pyrimidine? Which bases are which?', back: 'Purines: TWO fused rings (larger) → Adenine and Guanine (A and G)\nPyrimidines: ONE ring (smaller) → Cytosine, Thymine, Uracil (C, T, U)\nBase pairing rule: purine always pairs with pyrimidine → ensures consistent helix width.\nA pairs with T (DNA) or U (RNA); G pairs with C.' },
      { front: 'What is the difference between euchromatin and heterochromatin?', back: 'Euchromatin: loosely packed chromatin; genes are accessible to RNA polymerase → TRANSCRIPTIONALLY ACTIVE\nHeterochromatin: tightly packed; genes are silenced → TRANSCRIPTIONALLY INACTIVE (constitutive: always condensed; facultative: can switch, e.g., Barr body = inactivated X chromosome)\nHistone modification (acetylation → less condensed; methylation → more condensed) regulates this.' },
      { front: 'Describe DNA replication and the key enzymes involved.', back: 'Semi-conservative replication: each new double helix = one original + one new strand.\nKey enzymes:\nHelicase — unwinds double helix at replication fork\nPrimase — makes short RNA primer (required to start synthesis)\nDNA Polymerase III — adds nucleotides 5\'→3\' (cannot start de novo)\nDNA Polymerase I — removes RNA primer, fills with DNA\nLigase — joins Okazaki fragments on lagging strand\nLeading strand: continuous synthesis; Lagging strand: discontinuous (Okazaki fragments)' },
    ],
  },
  {
    deckId: 'bio-deck-q7',
    title: 'Quiz 7 Prep — Gene Expression & Viruses (Ch 17 + 19)',
    cards: [
      { front: 'State the central dogma of molecular biology.', back: 'DNA → (transcription) → RNA → (translation) → Protein\nInformation flows from DNA to RNA to protein.\nException in retroviruses: RNA → (reverse transcription) → DNA\nKEY: information never flows from protein back to nucleic acid.' },
      { front: 'What is transcription? Where does it occur in eukaryotes?', back: 'Transcription: synthesis of an RNA molecule using one strand of DNA as a template.\nLocation: NUCLEUS in eukaryotes; cytoplasm in prokaryotes\nRNA polymerase reads template strand 3\'→5\'; synthesizes mRNA 5\'→3\'.\nInitiation: RNA polymerase binds promoter; Elongation: adds nucleotides; Termination: reaches terminator or poly-A signal.' },
      { front: 'What three modifications are made to pre-mRNA in eukaryotes?', back: '1. 5\' CAP: 7-methylguanosine added to 5\' end → protects mRNA from degradation, aids ribosome binding\n2. POLY-A TAIL: 150–250 adenine nucleotides added to 3\' end → protects from degradation, aids export from nucleus\n3. RNA SPLICING: spliceosomes remove INTRONS (non-coding sequences) and join EXONS (coding sequences) → mature mRNA' },
      { front: 'What is the difference between introns and exons?', back: 'Introns ("intervening sequences"): non-coding sequences within a gene; removed from pre-mRNA during splicing.\nExons ("expressed sequences"): coding sequences that remain in mature mRNA and are translated into protein.\nAlternative splicing: different combinations of exons can be joined → one gene → multiple protein isoforms (explains why humans have ~25,000 genes but >100,000 proteins).' },
      { front: 'What is a codon? How many are there, and how many code for amino acids?', back: 'Codon: a three-nucleotide sequence on mRNA that specifies one amino acid (or a start/stop signal).\n64 total codons (4³ = 64)\n61 sense codons: specify amino acids\n3 stop codons: UAA, UAG, UGA (signal termination)\n1 start codon: AUG (codes for methionine; begins translation)' },
      { front: 'Describe translation: initiation, elongation, and termination.', back: 'INITIATION: small ribosomal subunit + mRNA; initiator tRNA (Met-tRNA) binds AUG in P site; large subunit joins.\nELONGATION: aminoacyl-tRNA enters A site (anticodon matches codon); peptidyl transferase (rRNA ribozyme) catalyzes peptide bond formation; ribosome translocates one codon 3\' → empty tRNA exits E site. Repeat.\nTERMINATION: stop codon (UAA/UAG/UGA) in A site → release factor binds → polypeptide released → ribosome dissembles.' },
      { front: 'What are the three ribosomal sites? What happens at each?', back: 'A site (Aminoacyl): incoming charged tRNA (brings next amino acid)\nP site (Peptidyl): tRNA carrying the growing polypeptide chain; peptide bond formed here\nE site (Exit): departing uncharged tRNA exits the ribosome\nMovement: A → P → E (ribosome translocates 5\'→3\' on mRNA)' },
      { front: 'What does it mean that the genetic code is redundant and (nearly) universal?', back: 'Redundant (degenerate): multiple codons can specify the same amino acid (e.g., 6 codons for Leu, 4 for Val). Third-position wobble.\nNearly universal: the same codons specify the same amino acids in almost all organisms (from bacteria to humans) → evidence for a single origin of life.\nExceptions: some mitochondrial codons differ from standard code.' },
      { front: 'What is a virus? Why is it not considered alive?', back: 'A virus is an infectious agent consisting of a nucleic acid genome (DNA or RNA) enclosed in a protein capsid (some also have an envelope).\nNot alive because it:\n• Cannot reproduce independently (needs host cell\'s ribosomes, ATP, enzymes)\n• Has no metabolism\n• Is not made of cells\nViruses are "obligate intracellular parasites."' },
      { front: 'Compare the lytic and lysogenic cycles of a bacteriophage.', back: 'Lytic cycle: phage DNA → directs host to make phage parts → assembly → lysis (cell death) → ~200 new phages released. KILLS host.\nLysogenic cycle: phage DNA integrates into bacterial chromosome as PROPHAGE → replicated harmlessly with host DNA for generations → induced by stress → excises → enters lytic cycle. Does NOT immediately kill host.' },
      { front: 'What is a provirus and when does it become lytic?', back: 'Provirus: viral DNA integrated into the host cell\'s chromosome. Present in every daughter cell after division.\nThe prophage (bacteriophage) or provirus (animal virus like HIV) stays dormant until:\n• Environmental stress (UV radiation, chemicals) induces a bacteriophage\n• HIV provirus reactivates when the immune system is stimulated\nInduction: provirus excises from chromosome → enters lytic cycle → new virions produced.' },
      { front: 'How does HIV infect T cells and cause AIDS?', back: 'HIV (retrovirus): RNA genome + reverse transcriptase enzyme\n1. HIV spike proteins (gp120) bind CD4 receptor + co-receptor (CCR5 or CXCR4) on helper T cells\n2. Membrane fusion → RNA + reverse transcriptase enter cell\n3. Reverse transcriptase: RNA → DNA (reverse transcription)\n4. Viral DNA integrates into host chromosome → PROVIRUS\n5. Provirus → new HIV particles produced → CD4+ T cells destroyed\n6. CD4+ count falls below 200/μL → AIDS (opportunistic infections)' },
      { front: 'What is reverse transcriptase? Why is it significant for HIV?', back: 'Reverse transcriptase: viral enzyme that synthesizes DNA using RNA as a template — "reverse" of normal transcription (DNA → RNA).\nSignificance: enables HIV (an RNA virus) to integrate its genome into host DNA as a provirus.\nTarget for antiretroviral drugs (e.g., AZT = reverse transcriptase inhibitor).\nReverse transcriptase lacks proofreading → high mutation rate → rapid HIV evolution → drug resistance.' },
      { front: 'What is a viral envelope and where does it come from?', back: 'Viral envelope: a lipid bilayer surrounding the capsid of some animal viruses (HIV, influenza, herpes, Ebola).\nOrigin: STOLEN from the host cell\'s plasma membrane (or other membrane) as the virus buds out.\nEnvelope contains viral GLYCOPROTEINS (spike proteins) that recognize host receptors.\nEnveloped viruses: enter by membrane fusion; sensitive to detergents (soap!) and drying.\nNon-enveloped viruses: more resistant to harsh environments.' },
      { front: 'Why do new viruses emerge, and give three reasons.', back: '1. Mutation: RNA viruses have no proofreading → high error rate → rapid antigenic change. Influenza mutates yearly (why we need annual vaccines).\n2. Recombination/Reassortment: two different viral strains infect same cell → exchange genome segments → novel strain (pandemic influenza: human + bird + swine strains recombine).\n3. Zoonosis: animal virus evolves ability to infect humans (HIV from SIV in chimps; SARS-CoV-2 from bats). Animals are reservoirs for novel human pathogens.' },
    ],
  },
  {
    deckId: 'bio-deck-q8',
    title: 'Quiz 8 Prep — Biotechnology & Animal Form (Ch 20 + 40)',
    cards: [
      { front: 'What is recombinant DNA technology?', back: 'Technology that combines DNA from two or more different sources — often different species — into a single DNA molecule.\nKey applications: gene cloning (producing many copies of a gene), creating transgenic organisms, gene therapy, producing useful proteins (insulin, growth hormone) in bacteria or yeast.' },
      { front: 'What are restriction enzymes and what are sticky ends?', back: 'Restriction enzymes (restriction endonucleases): bacterial enzymes that cut double-stranded DNA at specific palindromic sequences (restriction sites).\nSticky ends: short, single-stranded overhangs left after cutting (e.g., EcoRI: cuts GAATTC between G and A).\nSticky ends from different DNA samples with the same restriction enzyme can base-pair (anneal) → ligase seals → recombinant DNA.' },
      { front: 'Describe the three steps of PCR and what it produces.', back: 'PCR (Polymerase Chain Reaction): amplifies a specific DNA sequence exponentially.\n1. DENATURATION (94°C): double helix separates into single strands\n2. ANNEALING (50–65°C): short primers (15–25 nt) bind to complementary sequences flanking target\n3. EXTENSION (72°C): Taq polymerase (heat-stable) extends primers → new strand\nAfter 30 cycles: 2³⁰ ≈ 1 billion copies of target sequence from a single molecule.' },
      { front: 'What does gel electrophoresis separate, and how does it work?', back: 'Separates DNA, RNA, or protein fragments by SIZE (and charge for proteins).\nMechanism: electric field pulls negatively charged DNA toward + electrode; smaller fragments move faster through the gel matrix → travel farther.\nVisualization: DNA stained with SYBR green or ethidium bromide → bands fluoresce under UV light.\nApplications: check PCR products, DNA fingerprinting, confirm gene cloning, RFLP analysis.' },
      { front: 'What is a plasmid and how is it used as a cloning vector?', back: 'Plasmid: small, circular bacterial DNA that replicates independently of the chromosome.\nAs a cloning vector, a plasmid contains:\n• Origin of replication (allows autonomous replication in bacteria)\n• Antibiotic resistance gene (selects transformed bacteria)\n• Multiple cloning site/MCS (unique restriction sites for inserting foreign DNA)\nProcess: cut plasmid + foreign DNA with same restriction enzyme → anneal + ligate → transform bacteria → select for antibiotic resistance.' },
      { front: 'What is CRISPR-Cas9 and how does it edit genes?', back: 'CRISPR-Cas9: RNA-guided gene editing system derived from bacterial immune defense.\nComponents: Guide RNA (gRNA) — complementary to target DNA sequence + Cas9 — endonuclease that cuts both strands.\nMechanism:\n1. gRNA directs Cas9 to specific genomic location\n2. Cas9 makes double-strand break (DSB)\n3. Cell repairs by NHEJ (imperfect → gene disrupted) or HDR (precise replacement using template)\nApplications: disease gene correction, cancer immunotherapy, crop engineering, gene drives.' },
      { front: 'Name four practical applications of biotechnology.', back: '1. Medical: recombinant insulin (diabetes), human growth hormone, blood clotting factors, vaccines\n2. Forensics: DNA fingerprinting (STR analysis), paternity testing, crime scene analysis\n3. Agriculture: Bt corn (insect resistance), golden rice (vitamin A), herbicide-tolerant crops\n4. Research: knockout mice (model human disease), green fluorescent protein (GFP) reporter genes\n5. Gene therapy: correcting genetic diseases (SCID-ADA cured by adding ADA gene)' },
      { front: 'What are the four types of animal tissue and their general functions?', back: 'Epithelial: covers surfaces and lines cavities; protection, secretion, absorption, gas exchange\nConnective: sparse cells in ECM; support, binding, transport (bone, cartilage, blood, adipose, tendons)\nMuscle: contractile; skeletal (voluntary), smooth (involuntary viscera), cardiac (heart)\nNervous: receives, processes, transmits signals; neurons + supporting glial cells' },
      { front: 'What makes epithelial tissue distinctive?', back: 'Epithelium is:\n• Avascular (no blood vessels; nutrients diffuse from below)\n• Tightly packed cells with little ECM\n• Has apical (facing lumen/outside) and basal (attached to basement membrane) surfaces\n• Connected by tight junctions, desmosomes, gap junctions\n• High regeneration rate (skin replaced every 2 weeks; gut lining every few days)\nClassified by shape (squamous/cuboidal/columnar) and layering (simple/stratified).' },
      { front: 'Compare the three types of muscle tissue.', back: 'Skeletal: STRIATED (regular actin-myosin bands); multinucleated; VOLUNTARY; attached to bones\nSmooth: NOT striated; single nucleus; INVOLUNTARY; walls of blood vessels, gut, bladder, uterus\nCardiac: STRIATED; single nucleus; INVOLUNTARY; heart; connected by INTERCALATED DISCS (gap junctions allow synchronized contraction; desmosomes provide structural integrity)' },
      { front: 'What is homeostasis, and why is negative feedback the most common mechanism?', back: 'Homeostasis: maintenance of stable internal conditions (body temperature, blood pH, blood glucose, osmolarity) despite external fluctuations.\nNegative feedback: the response COUNTERACTS the stimulus (brings the variable back toward the set point) → self-correcting, stable.\nPositive feedback amplifies the stimulus → unstable (used only when a process must be completed quickly: childbirth, blood clotting).' },
      { front: 'Compare ectotherms and endotherms.', back: 'Ectotherms: gain heat from environment; body temp fluctuates with environment; lower metabolic costs; less food needed. Examples: fish, amphibians, reptiles, most invertebrates.\nEndotherms: generate heat internally (mitochondria, brown fat, shivering); stable body temperature independent of environment; high metabolic costs; require more food. Examples: mammals, birds.' },
      { front: 'What physiological mechanisms do endotherms use for thermoregulation?', back: 'Heat excess (too hot):\n• Vasodilation: blood vessels near skin dilate → more heat lost to environment\n• Sweating/panting: evaporative cooling\n• Behavioral: seeking shade, reducing activity\nHeat conservation (too cold):\n• Vasoconstriction: blood vessels constrict → less heat to skin\n• Shivering: skeletal muscle contractions generate heat\n• Countercurrent exchange: arteries and veins run adjacent → warm blood heats cool returning blood (dolphins, seals)' },
      { front: 'Give an example of positive feedback in animal physiology and explain why it is used.', back: 'Childbirth: baby\'s head presses cervix → oxytocin released from posterior pituitary → stronger uterine contractions → more cervical pressure → more oxytocin → more contractions (cycle amplifies until birth).\nAlso: blood clotting, LH surge at ovulation, action potential depolarization (Na⁺ entry → more depolarization).\nPositive feedback is used when a process must be completed quickly and completely — not for maintaining a stable set point.' },
      { front: 'What is the extracellular matrix (ECM) and what does connective tissue contain?', back: 'ECM: network of proteins (collagen, elastin, fibronectin) and polysaccharides (proteoglycans) secreted by cells; provides structural support and signals.\nConnective tissue types:\n• Loose CT: fibroblasts in ECM; binds organs; includes areolar and adipose tissue\n• Dense CT: densely packed collagen; tendons (muscle→bone) and ligaments (bone→bone)\n• Bone: mineralized ECM (hydroxyapatite); osteoblasts make matrix\n• Blood: liquid ECM (plasma); RBCs, WBCs, platelets' },
    ],
  },
]

const QUIZ_DECKS_2: Deck[] = [
  {
    deckId: 'bio-deck-q9',
    title: 'Quiz 9 Prep — Digestion & Circulation (Ch 41 + 42 Circ)',
    cards: [
      { front: 'What is the difference between an incomplete and a complete digestive system?', back: 'Incomplete: single opening serves as both mouth and anus (gastrovascular cavity). Examples: cnidarians, flatworms.\nComplete: two separate openings — mouth and anus — allowing simultaneous digestion in specialized regions. Examples: all vertebrates.' },
      { front: 'Trace the path of food through the human digestive system in order.', back: 'Mouth → Pharynx → Esophagus → Stomach → Small intestine (duodenum → jejunum → ileum) → Large intestine (cecum → colon → rectum) → Anus' },
      { front: 'What are the major pancreatic enzymes and what does each digest?', back: 'Pancreatic amylase → starch → maltose\nPancreatic lipase → triglycerides → fatty acids + glycerol\nTrypsin + Chymotrypsin → proteins → peptides\nCarboxypeptidase → peptides → amino acids\nPancreatic nucleases → DNA/RNA → nucleotides\nAll secreted into duodenum; activated by enterokinase (trypsinogen → trypsin activates the rest).' },
      { front: 'What is the role of bile, where is it produced and stored?', back: 'Bile: mixture of bile salts, cholesterol, phospholipids, bilirubin.\nRole: EMULSIFIES fat — breaks large lipid droplets into smaller ones, increasing surface area for lipase. NOT an enzyme.\nProduced: LIVER\nStored: GALLBLADDER\nReleased into duodenum via bile duct when fat is present.' },
      { front: 'How do villi and microvilli increase nutrient absorption?', back: 'Villi: finger-like projections (~1 mm tall); increase SA ~10×\nMicrovilli (brush border): on epithelial cells of villi; increase SA ~20× more\nTogether: ~250–600 m² total absorptive surface\nEach villus: capillaries (absorb amino acids, monosaccharides, water-soluble vitamins) + lacteal (absorbs fats as chylomicrons)' },
      { front: 'Compare open and closed circulatory systems.', back: 'Open: hemolymph bathes tissues directly in body cavities; low pressure; slow delivery. Examples: insects, most mollusks.\nClosed: blood confined to vessels; higher pressure; faster, more precise delivery. Examples: vertebrates, cephalopods, earthworms.' },
      { front: 'Trace blood flow through the human heart naming all four chambers and valves.', back: 'Body → Vena cavae → RIGHT ATRIUM → (Tricuspid valve) → RIGHT VENTRICLE → (Pulmonary semilunar) → Pulmonary arteries → Lungs → Pulmonary veins → LEFT ATRIUM → (Bicuspid/Mitral) → LEFT VENTRICLE → (Aortic semilunar) → Aorta → Body' },
      { front: 'What is the cardiac conduction system and what is the pacemaker?', back: 'SA node (sinoatrial) — PACEMAKER; generates spontaneous AP ~70×/min in right atrium → both atria contract.\nAV node — brief delay (~0.1s); allows atria to finish → Bundle of His → Bundle branches → Purkinje fibers → ventricles contract from apex upward.' },
      { front: 'Describe the cardiac cycle.', back: 'DIASTOLE: all chambers relax and fill.\nATRIAL SYSTOLE: atria contract → push blood into ventricles.\nVENTRICULAR SYSTOLE: ventricles contract → AV valves close (LUB) → blood ejected → semilunar valves close (DUB).\nBlood pressure: systolic/diastolic (normal ~120/80 mmHg).' },
      { front: 'How do arteries, veins, and capillaries differ?', back: 'Arteries: carry blood AWAY from heart; thick elastic walls; high pressure; pulse-able.\nCapillaries: one cell thick; site of O₂, nutrient, waste exchange.\nVeins: carry blood TOWARD heart; thinner walls; valves prevent backflow; low pressure.' },
      { front: 'What are the four components of blood and their functions?', back: 'Plasma (55%): water + proteins + nutrients + hormones + CO₂\nErythrocytes/RBCs (44%): carry O₂ via hemoglobin; no nucleus; 120-day lifespan\nLeukocytes/WBCs (<1%): immune defense\nPlatelets (<1%): fragments of megakaryocytes; initiate clotting' },
      { front: 'What is blood pressure and what is normal?', back: 'Force exerted by blood on vessel walls; reported as systolic/diastolic mmHg.\nNormal: ~120/80 mmHg. Hypertension: consistently >130/80.\nSystolic = ventricles contracting (maximum pressure).\nDiastolic = ventricles relaxed (minimum pressure).' },
      { front: 'What is the ABO blood typing system based on?', back: 'Surface antigens on RBCs:\nType A: A antigen; anti-B antibodies\nType B: B antigen; anti-A antibodies\nType AB: A+B antigens; no antibodies (universal recipient)\nType O: no antigens; anti-A and anti-B antibodies (universal donor)\nMismatched transfusion → agglutination → hemolysis.' },
      { front: 'What is the lymphatic system and how does it interact with circulation?', back: 'Recollects interstitial fluid that leaks from capillaries → lymph → returned to blood via thoracic duct (left subclavian vein) and right lymphatic duct.\nAlso transports dietary fats (chylomicrons from lacteals) and houses lymphocytes (lymph nodes filter pathogens).' },
      { front: 'What is single vs. double circulation?', back: 'Single: blood passes through heart once per body circuit (fish; 2-chambered heart); lower pressure after gills.\nDouble: blood passes through heart twice (pulmonary + systemic circuits); mammals/birds (4-chambered, fully separated) maintain high systemic pressure; amphibians (3-chambered) have some mixing.' },
    ],
  },
  {
    deckId: 'bio-deck-q10',
    title: 'Quiz 10 Prep — Respiration & Excretion (Ch 42 Resp + 43)',
    cards: [
      { front: 'Trace the pathway of air from the nose to the alveoli.', back: 'Nasal cavity → Pharynx → Larynx (epiglottis guards) → Trachea (cartilage rings; ciliated) → Bronchi → Bronchioles (no cartilage) → Terminal bronchioles → Alveolar ducts → Alveoli' },
      { front: 'Explain pressure changes driving inhalation and exhalation.', back: 'Inhalation (ACTIVE): diaphragm contracts + external intercostals lift ribs → thoracic volume INCREASES → lung pressure drops below atmospheric → air flows IN.\nExhalation (PASSIVE at rest): diaphragm relaxes → volume DECREASES → pressure rises → air flows OUT.' },
      { front: 'Why are alveoli so effective at gas exchange?', back: '• Enormous SA (~70 m²)\n• Very thin walls (single epithelial layer, ~0.1 μm)\n• Surrounded by dense capillaries\n• Short diffusion distance (<0.5 μm)\n• Surfactant prevents collapse\n• Moist surface (gases dissolve before diffusing)' },
      { front: 'What partial pressure gradients drive gas exchange at the lungs?', back: 'O₂: alveolar PO₂ (104 mmHg) > venous blood (40 mmHg) → O₂ into blood.\nCO₂: venous PCO₂ (46 mmHg) > alveolar PCO₂ (40 mmHg) → CO₂ out of blood.\nAt tissues: O₂ moves from blood (100 mmHg) to cells (40 mmHg); CO₂ moves from cells (46 mmHg) to blood (40 mmHg).' },
      { front: 'How does hemoglobin carry O₂ and what is the Bohr effect?', back: 'Hb: 4 subunits, each with heme (Fe²⁺); carries up to 4 O₂; cooperative binding → sigmoidal dissociation curve.\nBohr effect: ↑CO₂/↓pH → Hb releases O₂ more readily. Ensures O₂ delivered to metabolically active (acidic) tissues.' },
      { front: 'How is CO₂ transported in blood?', back: '~70% as bicarbonate (HCO₃⁻) in plasma: CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻ (carbonic anhydrase in RBCs)\n~23% bound to Hb as carbaminohemoglobin\n~7% dissolved in plasma' },
      { front: 'What are the three forms of nitrogenous waste and which animals produce each?', back: 'Ammonia: most toxic, aquatic animals (bony fish, many invertebrates) — needs lots of water.\nUrea: less toxic, mammals/amphibians/sharks — moderate water needed.\nUric acid: least toxic, birds/reptiles/insects — minimal water; paste form.' },
      { front: 'Describe the nephron structure in order.', back: 'Glomerulus + Bowman\'s capsule (filtration) → Proximal convoluted tubule (PCT) → Loop of Henle (descending → ascending) → Distal convoluted tubule (DCT) → Collecting duct → Renal pelvis → Ureter' },
      { front: 'What are the three processes of urine formation?', back: 'FILTRATION: blood pressure forces fluid from glomerulus into Bowman\'s capsule (~180 L/day).\nREABSORPTION: ~99% returned to blood (glucose, amino acids, water, ions; ~178.5 L/day).\nSECRETION: H⁺, K⁺, drugs, toxins actively pumped from blood into tubule.' },
      { front: 'What is reabsorbed in the proximal convoluted tubule?', back: '~65% of filtrate: 100% of glucose and amino acids (active transport; why diabetes → glucosuria), ~65% Na⁺/Cl⁻/K⁺/water, most HCO₃⁻, ~50% urea.' },
      { front: 'What is the function of the loop of Henle?', back: 'Creates osmotic gradient in renal medulla for concentrated urine production.\nDescending limb: water exits (osmosis) → filtrate concentrated.\nAscending limb: NaCl pumped out (impermeable to water) → medulla becomes hypertonic.\nGradient enables water reabsorption from collecting duct.' },
      { front: 'How does ADH regulate urine concentration?', back: 'ADH released when blood osmolarity is high (dehydration).\nEffect: inserts aquaporin-2 channels in collecting duct → more water reabsorbed → concentrated urine, small volume.\nADH absent → no aquaporins → dilute urine, large volume.\nAlcohol inhibits ADH → dehydration.' },
      { front: 'What is aldosterone\'s role in the kidney?', back: 'Released when blood Na⁺ is low or BP is low (via RAAS).\nEffect: ↑Na⁺ reabsorption (+ Na⁺/K⁺ ATPase synthesis) in DCT/collecting duct → water follows → ↑blood volume and BP; ↑K⁺ excretion.' },
      { front: 'What is countercurrent exchange in the loop of Henle?', back: 'Descending and ascending limbs run parallel in opposite directions:\nDescending: water exits → filtrate concentrated.\nAscending: NaCl pumped out → builds medullary concentration gradient.\nPositive feedback: concentrated descending fluid delivers more NaCl to ascending limb → steeper gradient.\nResult: medulla osmolarity up to ~1200 mOsm → concentrated urine possible.' },
      { front: 'What drives glomerular filtration?', back: 'BLOOD PRESSURE (hydrostatic pressure) in glomerular capillaries forces fluid into Bowman\'s capsule.\nOpposed by: colloid osmotic pressure (plasma proteins hold water back) + capsular pressure.\nGFR: ~125 mL/min = ~180 L/day. Proteins and cells NOT filtered (too large + charge barrier).' },
    ],
  },
  {
    deckId: 'bio-deck-q11',
    title: 'Quiz 11 Prep — Immune & Endocrine Systems (Ch 44 + 45)',
    cards: [
      { front: 'What are the three lines of defense against pathogens?', back: '1st: Physical/chemical barriers — skin, mucus, cilia, stomach acid, lysozyme, normal microbiome.\n2nd: Innate immunity — phagocytes, NK cells, complement, inflammation, fever.\n3rd: Adaptive immunity — B and T lymphocytes with immunological memory.' },
      { front: 'Compare innate and adaptive immunity.', back: 'Innate: present at birth; nonspecific; fast (minutes–hours); no memory; recognizes PAMPs via PRRs.\nAdaptive: develops upon exposure; highly specific to one antigen; slow initially (days); has immunological memory (rapid secondary response); B + T lymphocytes.' },
      { front: 'What is an antigen and an antibody?', back: 'Antigen: molecule (usually foreign protein/polysaccharide) that triggers immune response and binds to lymphocyte receptors.\nAntibody: Y-shaped glycoprotein from plasma cells; variable region binds specific antigen; constant region determines class (IgG, IgM, IgA, IgD, IgE) and effector function.' },
      { front: 'Compare B cells and T cells.', back: 'B cells: mature in BONE MARROW; produce antibodies (humoral immunity); recognize intact antigen.\nT cells: mature in THYMUS; recognize antigen only as peptide-MHC complex.\n• Helper T (CD4+): activate B cells and cytotoxic T; secrete cytokines.\n• Cytotoxic T (CD8+): kill virus-infected and cancer cells via perforin + granzymes.' },
      { front: 'What is clonal selection and why is it important?', back: 'Antigen binds specific lymphocyte (one in ~10 million) → activated → proliferates (clonal expansion) → effector cells + memory cells.\nImportance: explains why immune response is specific and improves with repeated exposure. Basis of vaccination (create memory without disease).' },
      { front: 'Compare primary and secondary immune responses.', back: 'Primary: first exposure; 7–14 days to peak; mostly IgM; lower antibody levels.\nSecondary: re-exposure; 2–3 days to peak; 10–100× more antibody; mostly IgG; longer-lasting. Due to MEMORY CELLS from first exposure.' },
      { front: 'What are MHC I and MHC II and what cells bear each?', back: 'MHC I: ALL nucleated cells; presents intracellular peptides → recognized by CD8+ cytotoxic T cells ("kill infected cell").\nMHC II: APCs only (macrophages, dendritic cells, B cells); presents extracellular peptides → recognized by CD4+ helper T cells ("alert adaptive immunity").' },
      { front: 'What are the two chemical classes of hormones and their mechanisms?', back: 'Water-soluble (peptides, catecholamines): bind SURFACE receptors → signal transduction → second messengers (cAMP, IP₃) → enzyme cascade. Fast (seconds–minutes).\nLipid-soluble (steroids, thyroid hormones): cross membrane → intracellular receptor → hormone-receptor complex enters nucleus → alters gene transcription. Slow (hours–days), long-lasting.' },
      { front: 'Name two adrenal hormones and their effects.', back: 'Cortisol (adrenal cortex; glucocorticoid; steroid): stress response; ↑blood glucose, suppresses inflammation and immunity, mobilizes fat and protein.\nEpinephrine (adrenal medulla; catecholamine): fight-or-flight; ↑HR, ↑BP, ↑blood glucose, dilates pupils, inhibits digestion, dilates bronchioles.' },
      { front: 'What is the hypothalamus-pituitary axis?', back: 'Hypothalamus → releasing/inhibiting hormones → anterior pituitary → tropic hormones → target glands → target hormones → negative feedback to hypothalamus and pituitary.\nExample: TRH → TSH → T₃/T₄ → inhibits TRH and TSH.\nPosterior pituitary: releases ADH and oxytocin (made in hypothalamus).' },
      { front: 'How do insulin and glucagon regulate blood glucose?', back: 'INSULIN (β cells): high blood glucose → promotes cellular uptake, glycogen synthesis, fat storage → lowers blood glucose.\nGLUCAGON (α cells): low blood glucose → promotes glycogen breakdown (glycogenolysis) + gluconeogenesis → raises blood glucose.\nAntagonistic pair; maintain ~90 mg/dL.' },
      { front: 'Give an example of negative feedback in the endocrine system.', back: 'Thyroid hormone regulation:\nLow T₃/T₄ → hypothalamus releases TRH → pituitary releases TSH → thyroid releases T₃/T₄.\nHigh T₃/T₄ → INHIBITS hypothalamus and pituitary → T₃/T₄ levels drop.\nThis maintains stable thyroid hormone levels around a set point.' },
      { front: 'What are thyroid hormones\' functions, and what do TRH and TSH stand for?', back: 'TRH: Thyrotropin-Releasing Hormone (hypothalamus).\nTSH: Thyroid-Stimulating Hormone (anterior pituitary).\nT₃/T₄ functions: regulate basal metabolic rate; essential for fetal brain development; regulate heart rate and heat production.\nIodine deficiency → goiter (enlarged thyroid overworking to compensate).' },
      { front: 'What is oxytocin and is it positive or negative feedback?', back: 'Oxytocin: peptide hormone released from posterior pituitary; stimulates uterine contractions (childbirth) and milk ejection (breastfeeding); involved in bonding.\nPOSITIVE feedback during childbirth: cervical stretch → more oxytocin → stronger contractions → more stretch → more oxytocin. Ends when baby is born.\nPositive feedback because the process (birth) must be completed quickly.' },
      { front: 'What is the RAAS (renin-angiotensin-aldosterone system)?', back: 'Low BP → kidney releases RENIN → converts angiotensinogen → Angiotensin I → ACE (in lungs) → Angiotensin II.\nAngiotensin II: constricts vessels (↑BP) + stimulates aldosterone release (↑Na⁺/water retention → ↑blood volume → ↑BP).\nACE inhibitors (e.g., lisinopril): block this cascade; used to treat hypertension.' },
    ],
  },
  {
    deckId: 'bio-deck-q12',
    title: 'Quiz 12 Prep — Reproduction (Ch 46)',
    cards: [
      { front: 'Compare asexual and sexual reproduction in genetic variation and energetic cost.', back: 'Asexual: offspring genetically IDENTICAL to parent; fast; no mate needed; low cost; low variation → slow adaptation.\nSexual: offspring genetically UNIQUE; slower; requires mate; high cost; high variation → rapid adaptation to changing environments.' },
      { front: 'What are four types of asexual reproduction?', back: 'Binary fission: prokaryotes split in two.\nBudding: new organism grows from parent (Hydra, yeast).\nFragmentation: body breaks → each piece regenerates (sea stars, planaria).\nParthenogenesis: unfertilized egg → new organism (bees/drones, Komodo dragons, some lizards).' },
      { front: 'Trace the path of sperm from production to ejaculation.', back: 'Seminiferous tubules (testes) → Epididymis (maturation/storage) → Vas deferens → Ejaculatory duct → Urethra → outside.' },
      { front: 'What do seminal vesicles, prostate, and bulbourethral glands contribute?', back: 'Seminal vesicles: fructose (sperm energy), prostaglandins (~60% of semen volume).\nProstate: alkaline fluid (neutralizes vaginal acid); PSA (~30%).\nBulbourethral glands: mucus; lubricates urethra; neutralizes residual urine (~10%).' },
      { front: 'What is spermatogenesis and where does it occur?', back: 'Production of sperm in seminiferous tubules (testes).\nSpermatogonia → primary spermatocyte → Meiosis I → secondary spermatocytes → Meiosis II → spermatids → spermatozoa.\n1 primary spermatocyte → 4 functional sperm.\n~74 days; continuous from puberty throughout life; optimal at 35°C.' },
      { front: 'Trace the path of an egg from production to implantation.', back: 'Ovarian follicle (primary oocyte) → ovulation (secondary oocyte released) → Fallopian tube (fertilization here within 24 hrs) → if fertilized, zygote cleaves during 3–4 day journey → Uterus → blastocyst implants in endometrium (6–10 days post-fertilization).' },
      { front: 'How does oogenesis differ from spermatogenesis?', back: 'Spermatogenesis: 4 functional sperm per primary spermatocyte; continuous; begins puberty.\nOogenesis: 1 functional egg + 3 polar bodies per primary oocyte (unequal cytokinesis preserves cytoplasm for egg); begins fetal development; arrested Prophase I until puberty; meiosis II completes ONLY if fertilized; ~400 eggs total.' },
      { front: 'What is the ovarian cycle and what hormones control it?', back: 'Follicular phase: FSH → follicle matures → estrogen ↑ → LH surge → ovulation (day ~14).\nLuteal phase: ruptured follicle → corpus luteum → progesterone + estrogen → maintains endometrium.\nNo fertilization: corpus luteum degenerates → hormone levels fall → menstruation.\nFertilization: HCG maintains corpus luteum.' },
      { front: 'What is the menstrual cycle and how is it coordinated with the ovarian cycle?', back: 'Menstruation (days 1–5): endometrium shed (progesterone/estrogen fall).\nProliferative phase (days 6–14): estrogen (from follicle) rebuilds endometrium.\nSecretory phase (days 15–28): progesterone (corpus luteum) prepares endometrium for implantation.\nNo implantation → corpus luteum degenerates → next cycle.' },
      { front: 'What is the corpus luteum and what happens to it?', back: 'Structure formed from ruptured follicle after ovulation; secretes progesterone + estrogen.\nIf NOT fertilized: degenerates after ~14 days → hormone levels drop → menstruation.\nIf fertilized: HCG (from embryo/trophoblast) maintains corpus luteum through first trimester → continues progesterone until placenta takes over.\nHCG is detected by home pregnancy tests.' },
      { front: 'What hormones are involved in the LH surge and ovulation?', back: 'Rising estrogen (from maturing follicle) initially causes negative feedback.\nWhen estrogen exceeds threshold for ≥36 hours → switches to POSITIVE feedback → hypothalamus releases GnRH → massive LH surge from anterior pituitary.\nLH surge → oocyte completes meiosis I → ovulation → follicle becomes corpus luteum.' },
      { front: 'What is parthenogenesis and in which animals does it naturally occur?', back: 'Parthenogenesis: unfertilized egg develops into a new organism.\nExamples: bees/wasps (unfertilized eggs → haploid males/drones), Komodo dragons, some lizards, some fish and sharks (facultative).\nNot normal in mammals — requires imprinted genes from both parents.' },
      { front: 'Why is oogenesis arrested in Prophase I, and when does meiosis complete?', back: 'Primary oocytes arrested in Prophase I during fetal development (inhibitory signals maintain arrest).\nLH surge → meiosis I resumes → ovulation (secondary oocyte arrested in Metaphase II).\nMeiosis II completes ONLY IF sperm fertilizes the egg.\nLong arrest (up to 50 years!) may contribute to increased chromosomal errors in older eggs.' },
      { front: 'What are the acrosome reaction and cortical reaction?', back: 'Acrosome reaction: sperm contacts egg jelly coat → acrosome (vesicle at sperm tip) releases hydrolytic enzymes → digests path through egg coat → sperm-egg membrane fusion.\nCortical reaction: sperm entry → Ca²⁺ wave → cortical granules exocytose → modify zona pellucida → fertilization envelope forms → BLOCKS POLYSPERMY (prevents additional sperm entry).' },
      { front: 'What are the advantages of sexual reproduction in evolutionary terms?', back: '1. Genetic variation: crossing over + independent assortment + random fertilization → unique offspring\n2. Rapid adaptation: variation allows natural selection to act faster in changing environments\n3. Recombination can separate beneficial mutations from harmful ones\n4. "Red Queen hypothesis": sexual reproduction helps hosts keep up with rapidly evolving parasites\nDisadvantage: only 50% of offspring can reproduce (males don\'t directly make eggs); costs of finding mates.' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('── Renaming course code to BIOL 1107 ──')
  await db.course.update({ where: { id: BIO_ID }, data: { code: 'BIOL 1107' } })

  console.log('── Upserting 26 chapter-aligned topics ──')
  for (const t of TOPICS) {
    await db.topic.upsert({
      where: { id: t.id },
      update: { title: t.title, position: t.position },
      create: { id: t.id, courseId: BIO_ID, title: t.title, position: t.position },
    })
  }

  console.log('── Reassigning existing note topicIds ──')
  for (const u of NOTE_TOPIC_UPDATES) {
    await db.note.update({ where: { id: u.id }, data: { topicId: u.topicId } })
  }

  console.log('── Deleting orphaned topics bio-t-04, bio-t-05 ──')
  await db.topic.deleteMany({ where: { id: { in: ['bio-t-04', 'bio-t-05'] } } })

  console.log('── Creating 24 new chapter notes ──')
  for (const n of NEW_NOTES) {
    await db.note.upsert({
      where: { id: n.id },
      update: { title: n.title, contentMd: n.contentMd, topicId: n.topicId },
      create: { id: n.id, courseId: BIO_ID, topicId: n.topicId, title: n.title, contentMd: n.contentMd },
    })
  }

  console.log('── Updating course overview note ──')
  await db.note.upsert({
    where: { id: 'bio-n-overview' },
    update: { title: 'Course Overview & Schedule', contentMd: OVERVIEW_MD },
    create: { id: 'bio-n-overview', courseId: BIO_ID, topicId: null, title: 'Course Overview & Schedule', contentMd: OVERVIEW_MD },
  })

  console.log('── Creating 12 quiz-prep flashcard decks ──')
  const allDecks = [...QUIZ_DECKS, ...QUIZ_DECKS_2]
  for (const deck of allDecks) {
    await db.deck.upsert({
      where: { id: deck.deckId },
      update: { title: deck.title },
      create: { id: deck.deckId, courseId: BIO_ID, title: deck.title },
    })
    for (let i = 0; i < deck.cards.length; i++) {
      const c = deck.cards[i]
      const cardId = `${deck.deckId}-c${String(i + 1).padStart(2, '0')}`
      await db.card.upsert({
        where: { id: cardId },
        update: { front: c.front, back: c.back },
        create: { id: cardId, deckId: deck.deckId, front: c.front, back: c.back, type: 'basic' },
      })
    }
    console.log(`  ✓ ${deck.title} (${deck.cards.length} cards)`)
  }

  console.log(`
Done! BIOL 1107 restructured:
  26 chapter-aligned topics
  24 new notes with OpenStax figures
  12 quiz-prep decks × 15 cards = 180 flashcards
  Course overview updated with Fusco's grading & schedule
  `)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect().then(() => pool.end()))

