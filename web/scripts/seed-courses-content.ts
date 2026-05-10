/**
 * Seeds BIO 1107 and CHEM 1128Q with topics, notes, and flashcard decks
 * extracted and enhanced from the uploaded syllabi and exam materials.
 *
 * Run: SEED_USER_ID=<uuid> tsx scripts/seed-courses-content.ts
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

const OWNER_ID = process.env.SEED_USER_ID!
const BIO_ID = 'seed-bio-1107'
const CHEM_ID = 'seed-chem-1128q'

// ─────────────────────────────────────────────────────────────────────────────
// BIO 1107 CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const BIO_TOPICS = [
  { id: 'bio-t-01', title: 'Life in the Beginning', position: 0 },
  { id: 'bio-t-02', title: "Life's Chemistry & Organic Molecules", position: 1 },
  { id: 'bio-t-03', title: 'Macromolecules — Proteins', position: 2 },
  { id: 'bio-t-04', title: 'Macromolecules — Nucleic Acids', position: 3 },
  { id: 'bio-t-05', title: 'Macromolecules — Carbohydrates & Lipids', position: 4 },
  { id: 'bio-t-06', title: 'Animal Nutrition', position: 5 },
  { id: 'bio-t-07', title: 'Cell Membranes & Transport', position: 6 },
  { id: 'bio-t-08', title: 'Gas Exchange — Respiratory System', position: 7 },
  { id: 'bio-t-09', title: 'Energy — Enzymes & Biological Reactions', position: 8 },
  { id: 'bio-t-10', title: 'Energy — Cellular Respiration', position: 9 },
  { id: 'bio-t-11', title: 'Bioenergetics — Ectothermy & Endothermy', position: 10 },
  { id: 'bio-t-12', title: 'Osmoregulation & Kidney Function', position: 11 },
  { id: 'bio-t-13', title: 'DNA Structure & Replication', position: 12 },
  { id: 'bio-t-14', title: 'Genetics — Mendel & Inheritance', position: 13 },
  { id: 'bio-t-15', title: 'Biotechnology & Gel Electrophoresis', position: 14 },
  { id: 'bio-t-16', title: 'Gene Regulation', position: 15 },
  { id: 'bio-t-17', title: 'Protein Synthesis', position: 16 },
  { id: 'bio-t-18', title: 'Circulatory System', position: 17 },
  { id: 'bio-t-19', title: 'Endocrine System', position: 18 },
  { id: 'bio-t-20', title: 'Nervous System', position: 19 },
  { id: 'bio-t-21', title: 'Immune System', position: 20 },
]

const BIO_NOTES: Array<{ id: string; topicId: string; title: string; contentMd: string }> = [
  {
    id: 'bio-n-01',
    topicId: 'bio-t-02',
    title: 'Organic Molecules & Functional Groups',
    contentMd: `# Organic Molecules

**Four major classes** of organic molecules in living organisms:
- **Carbohydrates** — energy source and structural support (cellulose, starch, glycogen)
- **Lipids** — membranes, long-term energy storage, signaling hormones
- **Proteins** — enzymes, structure, transport, defense, regulation
- **Nucleic Acids** — DNA (genetic storage) and RNA (protein synthesis)

In organic molecules, carbon atoms bond covalently to each other and to other atoms. Molecules range from a few atoms to thousands/millions.

---

## Hydrocarbons

Molecules consisting of **carbon linked only to hydrogen** atoms.

- Carbon has **4 unpaired outer electrons** → forms 4 bonds
- Simplest hydrocarbon: **CH₄ (methane)** — one carbon + four hydrogens
- More complex: linear unbranched chains, branched chains, or ring structures
- **Single and double bonds** found in linear and ring hydrocarbons
- **Triple bonds** only in two-carbon hydrocarbons

---

## Functional Groups

Small, reactive groups of atoms that give larger molecules specific chemical properties.
Linked by covalent bonds to carbon atoms (represented as **R**).

| Group | Formula | Key Property |
|-------|---------|-------------|
| **Hydroxyl** | —OH | Polar, participates in H-bonding; found in alcohols |
| **Carbonyl** | C=O | Ketone (mid-chain) or Aldehyde (end of chain) |
| **Carboxyl** | —COOH | **Acidic** — releases H⁺ |
| **Amino** | —NH₂ | **Basic** — accepts H⁺ |
| **Phosphate** | —PO₄ | Acidic; critical in ATP and DNA backbone |
| **Sulfhydryl** | —SH | Forms disulfide (—S—S—) bonds in proteins |

> **Exam tip:** The carboxyl group *releases* H⁺ (acidic); the amino group *accepts* H⁺ (basic). Amino acids have BOTH.

---

## Isomers

Two molecules with the **same chemical formula but different molecular structures**.

### Stereoisomers
- Mirror images of each other (L-form vs D-form)
- Example: **glyceraldehyde** — —H and —OH can be on left or right of carbon chain
- Typically only **one form** (L or D) enters biological reactions
- Enzymes are stereospecific

### Structural Isomers
- Same formula, atoms **arranged differently**
- Example: **glucose** (aldehyde at C1) and **fructose** (ketone at C2) — both C₆H₁₂O₆

---

## The Scientific Method (Course Objective)

1. **Observation** — identify a phenomenon
2. **Question** — what needs explaining?
3. **Hypothesis** — testable prediction (if/then format)
4. **Experiment** — controlled test with independent/dependent variables
5. **Analysis** — interpret data
6. **Conclusion** — support or reject hypothesis

> Structure leads to function — the central organizing principle of BIO 1107.
`,
  },
  {
    id: 'bio-n-02',
    topicId: 'bio-t-03',
    title: 'Proteins — Structure and Function',
    contentMd: `# Proteins

Proteins are **macromolecules** — polymers of amino acid monomers. They perform more diverse functions than any other class of molecule.

---

## Major Protein Functions

| Type | Function | Example |
|------|----------|---------|
| **Structural** | Physical support | Collagen, keratin |
| **Enzymatic** | Increase rate of reactions | Amylase, lipase |
| **Transport** | Move substances across membranes or through blood | Hemoglobin, channel proteins |
| **Mobile** | Produce cellular movements | Actin, myosin (muscle) |
| **Regulatory** | Promote or inhibit other cellular molecules | Transcription factors |
| **Receptor** | Bind molecules at cell surface; trigger responses | Insulin receptor |
| **Hormonal** | Carry regulatory signals between cells | Insulin, glucagon |
| **Defensive** | Defend against invaders | Antibodies (immunoglobulins) |
| **Storage** | Hold amino acids in stored form | Casein (milk), ferritin |

---

## Amino Acids

All organisms use **20 different amino acids** to build proteins.

### General Structure
\`\`\`
        H
        |
H₂N — C — COOH
        |
        R (variable side chain)
\`\`\`

- **Amino group** (—NH₂) on one side → basic
- **Carboxyl group** (—COOH) on other side → acidic
- **Hydrogen** atom
- **R group** — variable, determines amino acid identity and properties

### Amino acid behavior
- All amino acids can act as **acids or bases** (amphoteric)
- Amino group **accepts** H⁺ → basic reaction
- Carboxyl group **releases** H⁺ → acidic reaction

### Special amino acids
- **Proline** — unique ring structure; central carbon bonds to —COOH on one side and =NH (imino) on the other; creates kinks in protein chains
- **Cysteine** — contains sulfhydryl (—SH) group; pairs form **disulfide bonds** (—S—S—) that stabilize 3D protein shape

---

## R Group Properties

| Property | Behavior |
|----------|----------|
| **Polar** | Water-loving (hydrophilic); faces outward in aqueous environments |
| **Nonpolar** | Water-fearing (hydrophobic); buried in protein interior |
| **Charged (+)** | Lysine, arginine, histidine |
| **Charged (−)** | Aspartate, glutamate |
| **Reactive functional groups** | —NH₂, —OH, —COOH, —SH |

> Disulfide linkages from cysteine —SH groups are critical for maintaining protein 3D shape (tertiary/quaternary structure).

---

## Levels of Protein Structure

1. **Primary** — sequence of amino acids (determined by DNA)
2. **Secondary** — local folding: α-helices and β-pleated sheets (H-bonds between backbone atoms)
3. **Tertiary** — overall 3D shape; stabilized by R-group interactions, disulfide bonds, hydrophobic interactions
4. **Quaternary** — multiple polypeptide chains assembled together (e.g., hemoglobin = 4 subunits)

> **Denaturation** = loss of 3D structure (not primary sequence) caused by heat, pH changes, or chemicals → protein loses function.
`,
  },
  {
    id: 'bio-n-03',
    topicId: 'bio-t-04',
    title: 'Nucleic Acids — DNA and RNA',
    contentMd: `# Nucleic Acids

Nucleic acids store and transmit **genetic information** and direct protein synthesis.

Two types:
- **DNA** (deoxyribonucleic acid) — stores genetic information
- **RNA** (ribonucleic acid) — directs protein synthesis

---

## Nucleotide Structure

Each nucleotide has 3 components:
1. **Nitrogenous base**
2. **5-carbon sugar** (deoxyribose in DNA, ribose in RNA)
3. **Phosphate group**

### Nitrogenous Bases

| Purines (double ring) | Pyrimidines (single ring) |
|----------------------|--------------------------|
| Adenine (A) | Cytosine (C) |
| Guanine (G) | Thymine (T) — DNA only |
| | Uracil (U) — RNA only |

### Base Pairing Rules (Chargaff's Rules)
- **A pairs with T** (or U in RNA) — 2 hydrogen bonds
- **G pairs with C** — 3 hydrogen bonds (stronger!)

---

## DNA Structure (Watson & Crick, 1953)

- **Double helix** — two antiparallel strands wound around each other
- Strands run **antiparallel** (5'→3' and 3'→5')
- Sugar-phosphate **backbone** on outside
- Nitrogenous bases on inside, connected by H-bonds

### DNA vs. RNA

| Feature | DNA | RNA |
|---------|-----|-----|
| Sugar | Deoxyribose | Ribose |
| Bases | A, T, G, C | A, U, G, C |
| Structure | Double-stranded helix | Usually single-stranded |
| Function | Genetic storage | Protein synthesis |
| Location | Nucleus (mainly) | Nucleus and cytoplasm |

---

## DNA Replication

Semi-conservative: each new DNA molecule has **one old strand + one new strand**.

Key enzymes:
- **Helicase** — unwinds the double helix
- **DNA Polymerase** — synthesizes new strand (5'→3' direction only)
- **Primase** — lays RNA primer to start replication
- **Ligase** — joins Okazaki fragments on lagging strand

> **Leading strand** — synthesized continuously; **Lagging strand** — synthesized in fragments (Okazaki fragments).
`,
  },
  {
    id: 'bio-n-04',
    topicId: 'bio-t-05',
    title: 'Carbohydrates & Lipids',
    contentMd: `# Carbohydrates

Carbohydrates = **C, H, O** in ratio approximately (CH₂O)n

## Functions
- **Primary energy source** for cells (glucose)
- **Energy storage** — glycogen (animals), starch (plants)
- **Structural** — cellulose (plant cell walls), chitin (insect exoskeletons)
- **Cell recognition** — glycoproteins on cell surfaces

## Monosaccharides (simple sugars)
- 3–7 carbons
- **Glucose** (C₆H₁₂O₆) — most important; aldehyde at C1
- **Fructose** (C₆H₁₂O₆) — structural isomer of glucose; ketone at C2
- **Galactose** — stereoisomer of glucose (differ at C4 only)

## Disaccharides
- Two monosaccharides joined by **glycosidic bond** (dehydration synthesis)
- **Sucrose** = glucose + fructose (table sugar)
- **Lactose** = glucose + galactose (milk sugar)
- **Maltose** = glucose + glucose (malt sugar)

## Polysaccharides
| Polymer | Monomer | Function | Notes |
|---------|---------|----------|-------|
| Starch | Glucose | Energy storage in plants | α-1,4 and α-1,6 glycosidic bonds |
| Glycogen | Glucose | Energy storage in animals | More branched than starch |
| Cellulose | Glucose | Structural (plant cell walls) | β-1,4 bonds; humans can't digest |
| Chitin | N-acetylglucosamine | Structural (fungi, insects) | Like cellulose but with N |

---

# Lipids

Lipids are **hydrophobic** (nonpolar) — largely made of C and H. Contain less oxygen than carbohydrates.

## Major Types

### Fats (Triglycerides)
- Glycerol + 3 fatty acid chains
- Joined by **ester bonds** (dehydration synthesis)
- **Saturated** — no double bonds; solid at room temperature; found in animals
- **Unsaturated** — one or more double bonds (cis conformation); liquid at room temperature; found in plants

### Phospholipids
- Glycerol + 2 fatty acids + phosphate group
- **Amphipathic** — hydrophilic head + hydrophobic tail
- Form **bilayers** → the basis of all cell membranes

### Steroids
- 4-carbon ring framework
- **Cholesterol** — membrane component; precursor to steroid hormones
- Steroid hormones: estrogen, testosterone, cortisol

### Waxes
- Long fatty acid chain + long alcohol
- Waterproofing (cuticle of leaves, earwax, beeswax)

---

## Dehydration Synthesis vs. Hydrolysis

| Process | Direction | Result |
|---------|-----------|--------|
| **Dehydration synthesis** | Monomers → polymer | Removes H₂O; builds macromolecules |
| **Hydrolysis** | Polymer → monomers | Adds H₂O; breaks macromolecules |

> Digestion = hydrolysis of all 4 macromolecule classes.
`,
  },
  {
    id: 'bio-n-05',
    topicId: 'bio-t-09',
    title: 'Enzymes & Biological Reactions',
    contentMd: `# Enzymes & Biological Reactions

## Energy in Biological Systems

- **Free energy (G)** — energy available to do work
- **Exergonic reactions** — release free energy (ΔG < 0); spontaneous; products have less energy than reactants (e.g., cellular respiration)
- **Endergonic reactions** — require free energy input (ΔG > 0); not spontaneous (e.g., photosynthesis, protein synthesis)

## Activation Energy

Even exergonic reactions need an initial energy input = **activation energy (Ea)** to break bonds and start the reaction.

**Enzymes lower activation energy** → speed up reactions without being consumed.

---

## Enzymes

- Biological **catalysts** — almost all are proteins (some RNA = ribozymes)
- Highly **specific** — each enzyme catalyzes one type of reaction
- **Not consumed** in the reaction — can be reused
- Speed up reactions by factors of **10⁶ to 10¹²**

### Enzyme Terminology
- **Substrate** — molecule(s) that bind to the enzyme
- **Active site** — region of enzyme that binds substrate; complementary shape to substrate
- **Enzyme-substrate complex (ES)** — temporary intermediate
- **Product** — result after reaction

### Induced Fit Model
The active site is **flexible** — slightly adjusts its shape when substrate binds to optimize the reaction (not a rigid lock-and-key).

---

## Factors Affecting Enzyme Activity

| Factor | Effect |
|--------|--------|
| **Temperature** | Increases rate up to optimum; above optimum → denaturation |
| **pH** | Each enzyme has optimal pH; extremes denature |
| **Substrate concentration** | Increases rate until enzyme is saturated (Vmax) |
| **Enzyme concentration** | More enzyme → more product (until substrate is limiting) |

### Inhibitors
- **Competitive inhibitors** — mimic substrate; compete for active site; reversible with excess substrate
- **Noncompetitive inhibitors** — bind elsewhere (allosteric site); change active site shape; reduce Vmax
- **Allosteric regulation** — molecule binds away from active site → changes enzyme shape → activates or inhibits

---

## Cofactors & Coenzymes

- **Cofactors** — inorganic ions (Mg²⁺, Zn²⁺, Fe²⁺) that help enzymes work
- **Coenzymes** — organic molecules (often vitamins); e.g., NAD⁺, FAD
`,
  },
  {
    id: 'bio-n-06',
    topicId: 'bio-t-10',
    title: 'Cellular Respiration',
    contentMd: `# Cellular Respiration

**Overall equation:**
$$C_6H_{12}O_6 + 6O_2 → 6CO_2 + 6H_2O + \\text{ATP (energy)}$$

Cellular respiration = controlled, stepwise oxidation of glucose to harvest energy as ATP.

---

## Three Stages

### 1. Glycolysis (Cytoplasm)
- Splits 1 glucose (6C) into 2 pyruvate (3C)
- **Net gain: 2 ATP + 2 NADH**
- Occurs in cytoplasm; does NOT require oxygen (anaerobic)

### 2. Pyruvate Oxidation + Krebs Cycle (Mitochondria Matrix)
- Pyruvate converted to acetyl-CoA (loses CO₂, gains NADH)
- Acetyl-CoA enters **Krebs cycle** (citric acid cycle)
- Per glucose: **2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂**

### 3. Electron Transport Chain + Oxidative Phosphorylation (Inner Mitochondrial Membrane)
- NADH and FADH₂ donate electrons to ETC
- Electrons passed through protein complexes → pump H⁺ ions across membrane
- H⁺ flow back through **ATP synthase** → generates ATP (chemiosmosis)
- **O₂ is final electron acceptor** → forms H₂O
- Gain: **~28–32 ATP**

---

## ATP Yield Summary

| Stage | ATP |
|-------|-----|
| Glycolysis | 2 net |
| Pyruvate oxidation | 0 (but makes NADH) |
| Krebs cycle | 2 |
| ETC/Oxidative phosphorylation | ~28–32 |
| **Total** | **~30–36 ATP** |

---

## Anaerobic Respiration (Fermentation)
When O₂ is absent, cells use fermentation to regenerate NAD⁺ (needed for glycolysis to continue):

- **Lactic acid fermentation** — pyruvate → lactate (muscles during intense exercise, yogurt bacteria)
- **Alcoholic fermentation** — pyruvate → ethanol + CO₂ (yeast, bread rising)

> Fermentation only yields 2 ATP per glucose (vs. 30+ with aerobic respiration).
`,
  },
  {
    id: 'bio-n-07',
    topicId: 'bio-t-13',
    title: 'DNA Structure & Replication',
    contentMd: `# DNA Structure & Replication

## DNA Structure Review
- **Double helix** — two antiparallel polynucleotide strands
- **Base pairs:** A=T (2 H-bonds), G≡C (3 H-bonds)
- Sugar-phosphate backbone on outside; bases on inside
- Strands are antiparallel: one runs 5'→3', the other 3'→5'

---

## DNA Replication

### Key Principle: Semi-Conservative
Each daughter DNA molecule = **one original strand + one new strand**.
Proven by Meselson-Stahl experiment using ¹⁵N/¹⁴N labeling.

### Where it occurs
- Eukaryotes: nucleus; multiple origins of replication
- Prokaryotes: single circular chromosome; one origin

### Key Enzymes

| Enzyme | Function |
|--------|----------|
| **Helicase** | Unwinds and separates the double helix |
| **Primase** | Synthesizes short RNA primer (needed to start) |
| **DNA Polymerase III** | Synthesizes new DNA strand (5'→3' only) |
| **DNA Polymerase I** | Removes RNA primers; fills gaps with DNA |
| **DNA Ligase** | Seals nicks; joins Okazaki fragments |
| **Topoisomerase** | Relieves tension ahead of replication fork |

### Leading vs. Lagging Strand
- **Leading strand** — synthesized **continuously** in 5'→3' direction toward replication fork
- **Lagging strand** — synthesized **discontinuously** away from fork as **Okazaki fragments** (each ~1,000–2,000 nucleotides), then joined by ligase

---

## DNA Repair
DNA polymerase has **proofreading** ability — checks and corrects mismatches.
Additional repair enzymes fix damage from UV light, chemicals, etc.
Without repair → **mutations** (permanent changes in DNA sequence).
`,
  },
  {
    id: 'bio-n-08',
    topicId: 'bio-t-17',
    title: 'Protein Synthesis — Transcription & Translation',
    contentMd: `# Protein Synthesis

**Central Dogma:** DNA → RNA → Protein

---

## Transcription (Nucleus)
DNA is used as a template to synthesize **messenger RNA (mRNA)**.

### Steps:
1. **Initiation** — RNA polymerase binds to **promoter** (specific DNA sequence)
2. **Elongation** — RNA polymerase moves along template strand 3'→5', synthesizing mRNA 5'→3'
3. **Termination** — polymerase reaches terminator sequence; mRNA released

### RNA Processing (Eukaryotes only)
- **5' cap** added (modified guanosine) — protects mRNA, aids ribosome binding
- **Poly-A tail** added to 3' end — protects from degradation
- **Splicing** — introns (noncoding) removed; exons (coding) joined by **spliceosomes**
- Result: mature **mRNA** exported to cytoplasm

---

## Translation (Ribosomes)
mRNA is decoded to synthesize a **polypeptide chain**.

### The Genetic Code
- **Codon** = 3-nucleotide sequence on mRNA = codes for 1 amino acid
- **64 codons** total; 61 code for amino acids; 3 are stop codons
- **Redundant** (degenerate) — multiple codons per amino acid
- **AUG** = start codon (methionine)
- Stop codons: UAA, UAG, UGA

### Key Players
| Molecule | Role |
|----------|------|
| **mRNA** | Carries genetic message from DNA |
| **tRNA** | Brings amino acids; anticodon matches codon |
| **rRNA** | Structural and catalytic component of ribosome |
| **Ribosome** | Site of translation; has A, P, E sites |

### Steps:
1. **Initiation** — ribosome assembles at AUG; first tRNA in P site
2. **Elongation** — new tRNA enters A site; peptide bond forms; ribosome translocates
3. **Termination** — stop codon in A site; **release factor** binds; polypeptide released

---

## Post-Translational Modification
- Folding into 3D structure (often assisted by **chaperone proteins**)
- Cleavage of signal sequences
- Addition of carbohydrates (glycosylation), phosphate groups, etc.
- Delivery to correct cellular location
`,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CHEM 1128Q CONTENT
// ─────────────────────────────────────────────────────────────────────────────

const CHEM_TOPICS = [
  { id: 'chem-t-01', title: 'Solutions & Colligative Properties (Ch 13)', position: 0 },
  { id: 'chem-t-02', title: 'Chemical Kinetics (Ch 14)', position: 1 },
  { id: 'chem-t-03', title: 'Chemical Equilibrium (Ch 15)', position: 2 },
  { id: 'chem-t-04', title: 'Acid-Base Chemistry (Ch 16)', position: 3 },
  { id: 'chem-t-05', title: 'Buffers & Titrations (Ch 17)', position: 4 },
  { id: 'chem-t-06', title: 'Solubility Equilibria — Ksp (Ch 18)', position: 5 },
  { id: 'chem-t-07', title: 'Electrochemistry (Ch 19)', position: 6 },
  { id: 'chem-t-08', title: 'Nuclear Chemistry (Ch 20)', position: 7 },
]

const CHEM_NOTES: Array<{ id: string; topicId: string; title: string; contentMd: string }> = [
  {
    id: 'chem-n-01',
    topicId: 'chem-t-03',
    title: 'Chemical Equilibrium — K Expressions & ICE Tables',
    contentMd: `# Chemical Equilibrium

A reaction reaches **equilibrium** when the forward and reverse rates are equal and concentrations are constant (not necessarily equal).

---

## Equilibrium Constant (K)

For: $$aA + bB \\rightleftharpoons cC + dD$$

$$K_c = \\frac{[C]^c[D]^d}{[A]^a[B]^b}$$

- **K > 1** → products favored (equilibrium lies to the right)
- **K < 1** → reactants favored (equilibrium lies to the left)
- **Pure solids and liquids** are NOT included in K expressions
- K depends only on **temperature** (not concentration, pressure, or catalysts)

### Kp vs. Kc (for gases)
$$K_p = K_c(RT)^{\\Delta n}$$
where Δn = moles of gaseous products − moles of gaseous reactants.

---

## Manipulating Equilibrium Expressions

1. **Reverse reaction** → K becomes 1/K
2. **Multiply by n** → K becomes Kⁿ
3. **Add reactions** → multiply their K values

### Example (from Exam 2):
Given: $2SO_3(g) \\rightleftharpoons 2SO_2(g) + O_2(g)$

At 1000 K, initial P(SO₃) = 0.541 atm. At equilibrium, P(O₂) = 0.216 atm.

| | SO₃ | SO₂ | O₂ |
|--|-----|-----|----|
| I | 0.541 | 0 | 0 |
| C | −2x | +2x | +x |
| E | 0.541−2(0.216) = 0.109 | 0.432 | 0.216 |

$$K = \\frac{(0.432)^2(0.216)}{(0.109)^2} = 3.39$$

---

## Reaction Quotient Q

$$Q = \\text{same expression as K, but using current (non-equilibrium) concentrations}$$

| Comparison | Meaning | Direction |
|-----------|---------|-----------|
| Q < K | Too many reactants | Forward reaction (→) |
| Q > K | Too many products | Reverse reaction (←) |
| Q = K | At equilibrium | No net change |

---

## ICE Table Method

**I**nitial — **C**hange — **E**quilibrium

Steps:
1. Write balanced equation
2. Fill in initial concentrations/pressures
3. Let change = ±x (stoichiometric ratios)
4. Express equilibrium in terms of x
5. Substitute into K expression and solve for x

> **Tip:** If K is very small (K < 10⁻⁴), assume x is negligible → simplifies math. Always check: x/initial < 5%.
`,
  },
  {
    id: 'chem-n-02',
    topicId: 'chem-t-03',
    title: "Le Chatelier's Principle",
    contentMd: `# Le Chatelier's Principle

**If a stress is applied to a system at equilibrium, the equilibrium shifts to partially relieve that stress.**

---

## Types of Stresses

### 1. Concentration Changes
- **Add reactant** or **remove product** → shift **right** (forward)
- **Remove reactant** or **add product** → shift **left** (reverse)

### 2. Pressure Changes (Gases)
- **Increase pressure** (decrease volume) → shift toward side with **fewer moles of gas**
- **Decrease pressure** (increase volume) → shift toward side with **more moles of gas**
- **Add inert gas at constant volume** → NO shift (partial pressures unchanged)

### 3. Temperature Changes
- For **exothermic** reactions (ΔH < 0): treat heat as a **product**
  - Increase T → shift left; K decreases
  - Decrease T → shift right; K increases
- For **endothermic** reactions (ΔH > 0): treat heat as a **reactant**
  - Increase T → shift right; K increases
  - Decrease T → shift left; K decreases

> **Key:** Temperature is the **only stress that changes K**. All others just shift Q toward K.

### 4. Catalyst
- Speeds up both forward AND reverse reactions equally
- **NO shift in equilibrium position**; just reaches equilibrium faster

---

## Example from Exam 2

$$C(s) + O_2(g) \\rightleftharpoons CO_2(g) \\quad \\Delta H° = -393.5 \\text{ kJ/mol}$$

| Stress | Direction |
|--------|-----------|
| Increase temperature | **Left** (exothermic; heat is product) |
| Add O₂(g) | **Right** (add reactant) |
| Remove some C(s) | **No change** (pure solid; not in K) |
| Expand the system | **No change** (equal moles gas on both sides: 1 mol O₂ = 1 mol CO₂) |
`,
  },
  {
    id: 'chem-n-03',
    topicId: 'chem-t-04',
    title: 'Acid-Base Chemistry — pH, Ka, Kb',
    contentMd: `# Acid-Base Chemistry

## Definitions

| Model | Acid | Base |
|-------|------|------|
| **Arrhenius** | Produces H⁺ in water | Produces OH⁻ in water |
| **Brønsted-Lowry** | Proton (H⁺) donor | Proton (H⁺) acceptor |
| **Lewis** | Electron pair acceptor | Electron pair donor |

---

## Strong vs. Weak Acids/Bases

**Strong acids** — dissociate 100% in water: HCl, HBr, HI, HNO₃, H₂SO₄, HClO₄
**Strong bases** — dissociate 100%: NaOH, KOH, Ca(OH)₂, Sr(OH)₂, Ba(OH)₂

**Weak acids** — partially dissociate; equilibrium favors reactants
$$HA \\rightleftharpoons H^+ + A^- \\quad K_a = \\frac{[H^+][A^-]}{[HA]}$$

**Weak bases** — partially react with water
$$B + H_2O \\rightleftharpoons BH^+ + OH^- \\quad K_b = \\frac{[BH^+][OH^-]}{[B]}$$

---

## pH and Related Equations

$$pH = -\\log[H^+]$$
$$pOH = -\\log[OH^-]$$
$$pH + pOH = 14 \\text{ (at 25°C)}$$
$$K_w = [H^+][OH^-] = 1.0 \\times 10^{-14} \\text{ (at 25°C)}$$
$$K_a \\times K_b = K_w = 1.0 \\times 10^{-14}$$

---

## Solving Weak Acid/Base Problems

### Weak Acid ICE Table
For HA with initial concentration C and Ka:

| | HA | H⁺ | A⁻ |
|--|----|----|-----|
| I | C | 0 | 0 |
| C | −x | +x | +x |
| E | C−x | x | x |

$$K_a = \\frac{x^2}{C-x} \\approx \\frac{x^2}{C} \\text{ (if x << C)}$$
$$[H^+] = x = \\sqrt{K_a \\cdot C}$$

**Percent ionization** = (x/C) × 100%

---

## Example Calculations

### Weak base (NH₃, Kb = 1.8×10⁻⁵)
0.020 M NH₃:
- Kb = x²/(0.020) → x = √(1.8×10⁻⁵ × 0.020) = 6.0×10⁻⁴
- pOH = −log(6.0×10⁻⁴) = 3.22
- pH = 14 − 3.22 = **10.78**

### Benzoic acid (Ka = 6.6×10⁻⁵)
0.397 M benzoic acid:
- x² = 6.6×10⁻⁵ × 0.397 = 2.62×10⁻⁵
- x = [H⁺] = 5.12×10⁻³
- pH = 2.29; % ionization = (5.12×10⁻³/0.397) × 100 = **1.29%**

---

## Acid-Base Properties of Salts

| Salt type | Example | Solution |
|-----------|---------|---------|
| Strong acid + strong base | NaCl | Neutral (pH = 7) |
| Strong acid + weak base | NH₄Cl | **Acidic** (NH₄⁺ is weak acid) |
| Weak acid + strong base | CH₃COONa | **Basic** (CH₃COO⁻ is weak base) |
| Weak acid + weak base | CH₃COONH₄ | Depends on Ka vs. Kb |
`,
  },
  {
    id: 'chem-n-04',
    topicId: 'chem-t-05',
    title: 'Buffers & Titrations',
    contentMd: `# Buffers & Titrations

## Buffers

A buffer **resists pH changes** when small amounts of acid or base are added.
Composed of: **weak acid + its conjugate base** (or weak base + conjugate acid)

### Henderson-Hasselbalch Equation
$$pH = pK_a + \\log\\frac{[A^-]}{[HA]}$$

- pH = pKa when [A⁻] = [HA] (equal concentrations) → **most effective buffer**
- Buffer range: approximately **pKa ± 1**

### Example (Exam 2 — Lactic acid buffer)
15.0 g NaC₃H₅O₃ (MM = 112.06) + 12.50 g HC₃H₅O₃ (MM = 90.08) in 500 mL

- mol NaC₃H₅O₃ = 15.0/112.06 = 0.1338 mol → 0.268 M
- mol HC₃H₅O₃ = 12.50/90.08 = 0.1388 mol → 0.278 M
- Ka = 1.4×10⁻⁴ → pKa = 3.85
- pH = 3.85 + log(0.268/0.278) = 3.85 − 0.016 = **3.83**

### Buffer after adding acid
When strong acid added to buffer:
$$A^- + H^+ \\rightarrow HA$$

Recalculate concentrations of A⁻ and HA, then re-apply Henderson-Hasselbalch.

---

## Acid-Base Titrations

**Titration** — slowly adding known concentration of acid/base to determine concentration of unknown.

### Key Terms
- **Equivalence point** — moles acid = moles base; stoichiometric point
- **End point** — indicator color change (should match equivalence point)
- **Half-equivalence point** — pH = pKa (for weak acid/strong base titration)

### Types of Titrations

| Type | pH at equivalence point |
|------|------------------------|
| Strong acid + strong base | 7.00 |
| Weak acid + strong base | **> 7** (conjugate base is basic) |
| Weak base + strong acid | **< 7** (conjugate acid is acidic) |

### Pyridine Titration (Exam 2)
0.175 M pyridine (C₅H₅N, Kb = 1.7×10⁻⁹) titrated with 0.150 M HCl

At equivalence point:
- All pyridine converted to HC₅H₅N⁺ (pyridinium ion)
- Ka of HC₅H₅N⁺ = Kw/Kb = 1.0×10⁻¹⁴/1.7×10⁻⁹ = 5.9×10⁻⁶
- Calculate pH from Ka of conjugate acid → pH < 7 ✓

### Choosing an Indicator
Select indicator with **pKa ≈ pH at equivalence point**:
- **Methyl orange** (pKa ≈ 4) — strong base/strong acid or strong acid/strong base
- **Phenolphthalein** (pKa ≈ 9) — weak acid/strong base titrations
`,
  },
  {
    id: 'chem-n-05',
    topicId: 'chem-t-06',
    title: 'Solubility Equilibria — Ksp',
    contentMd: `# Solubility Equilibria

## Solubility Product Constant (Ksp)

For a **sparingly soluble** ionic compound dissolving in water:
$$MX(s) \\rightleftharpoons M^+(aq) + X^-(aq) \\quad K_{sp} = [M^+][X^-]$$

(Note: the solid is NOT included in Ksp expression)

---

## Ksp and Molar Solubility

Let s = molar solubility (mol/L of solid that dissolves)

| Formula | Ksp expression | Relationship |
|---------|----------------|-------------|
| AB → A⁺ + B⁻ | [A⁺][B⁻] | Ksp = s² |
| AB₂ → A²⁺ + 2B⁻ | [A²⁺][B⁻]² | Ksp = (s)(2s)² = 4s³ |
| A₂B₃ → 2A³⁺ + 3B²⁻ | [A³⁺]²[B²⁻]³ | Ksp = (2s)²(3s)³ = 108s⁵ |

### Example — Lead Iodide (PbI₂)
$$PbI_2(s) \\rightleftharpoons Pb^{2+}(aq) + 2I^-(aq)$$
$$K_{sp} = [Pb^{2+}][I^-]^2 = s(2s)^2 = 4s^3$$

---

## Predicting Precipitation

Compare **Ion Product (Q)** to **Ksp**:
- Q < Ksp → solution is **unsaturated** (more solid can dissolve)
- Q = Ksp → solution is **saturated** (at equilibrium)
- Q > Ksp → solution is **supersaturated** → **precipitation occurs**

---

## Common Ion Effect

Adding a common ion **decreases** solubility (shifts equilibrium left).

Example: PbI₂ in 0.10 M KI solution
- [I⁻] = 0.10 + 2s ≈ 0.10 M
- Ksp = s(0.10)² → s = Ksp/0.01 (much smaller than in pure water)

---

## Selective Precipitation

Used to separate ions by controlling which ions exceed their Ksp first.
Ions with smaller Ksp precipitate first.
`,
  },
  {
    id: 'chem-n-06',
    topicId: 'chem-t-02',
    title: 'Chemical Kinetics — Rate Laws & Mechanisms',
    contentMd: `# Chemical Kinetics

The study of **how fast** chemical reactions occur and the **factors** that affect rate.

---

## Reaction Rate

$$\\text{Rate} = -\\frac{\\Delta[A]}{\\Delta t} = +\\frac{\\Delta[B]}{\\Delta t}$$

(negative for reactants consumed; positive for products formed)

For $aA + bB \\rightarrow cC$:
$$\\text{Rate} = -\\frac{1}{a}\\frac{\\Delta[A]}{\\Delta t} = -\\frac{1}{b}\\frac{\\Delta[B]}{\\Delta t} = +\\frac{1}{c}\\frac{\\Delta[C]}{\\Delta t}$$

---

## Rate Laws

$$\\text{Rate} = k[A]^m[B]^n$$

- **k** = rate constant (temperature dependent)
- **m, n** = reaction orders (determined experimentally, NOT from stoichiometry)
- Overall order = m + n

### Determining Order from Data
Compare experiments where one concentration changes:
$$\\frac{\\text{Rate}_2}{\\text{Rate}_1} = \\left(\\frac{[A]_2}{[A]_1}\\right)^m$$

---

## Integrated Rate Laws

| Order | Rate Law | Integrated Form | Half-life |
|-------|----------|-----------------|-----------|
| 0 | Rate = k | [A] = [A]₀ − kt | t½ = [A]₀/2k |
| **1** | Rate = k[A] | ln[A] = ln[A]₀ − kt | **t½ = 0.693/k** |
| 2 | Rate = k[A]² | 1/[A] = 1/[A]₀ + kt | t½ = 1/(k[A]₀) |

**First-order half-life is constant** (independent of concentration) — used for radioactive decay!

---

## Factors Affecting Reaction Rate

1. **Concentration** — more collisions → faster rate
2. **Temperature** — more energy → more effective collisions
3. **Surface area** — more exposed reactant
4. **Catalyst** — lowers activation energy (Ea)

## Arrhenius Equation
$$k = Ae^{-E_a/RT}$$
$$\\ln k = \\ln A - \\frac{E_a}{RT}$$
$$\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

---

## Iodination of Acetone (Lab)
$$CH_3COCH_3 + I_2 \\xrightarrow{H^+} CH_3COCH_2I + H^+ + I^-$$

Rate = k[acetone]^m[H⁺]^n[I₂]^p

The reaction is **zero order in I₂** (rate independent of I₂ concentration) — determined experimentally!
`,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// FLASHCARD DECKS
// ─────────────────────────────────────────────────────────────────────────────

const BIO_FLASHCARDS = {
  deckId: 'bio-deck-01',
  deckTitle: 'BIO 1107 — Core Concepts & Terms',
  courseId: BIO_ID,
  cards: [
    { front: 'What are the 4 major classes of organic molecules?', back: 'Carbohydrates, Lipids, Proteins, and Nucleic Acids. All contain carbon; most contain H, O, N, and/or S.' },
    { front: 'What is the difference between a stereoisomer and a structural isomer?', back: 'Stereoisomers: mirror images of each other (L- vs D-form); same bonds but different spatial arrangement.\nStructural isomers: same formula but atoms bonded in different arrangements (e.g., glucose vs. fructose — both C₆H₁₂O₆).' },
    { front: 'Which functional group is acidic (releases H⁺)?', back: 'Carboxyl group (—COOH). It donates a proton: —COOH → —COO⁻ + H⁺' },
    { front: 'Which functional group is basic (accepts H⁺)?', back: 'Amino group (—NH₂). It accepts a proton: —NH₂ + H⁺ → —NH₃⁺' },
    { front: 'What are the 9 major protein functions? (mnemonic: SETERMHDS)', back: 'Structural, Enzymatic, Transport (membrane), mobile (movement), Regulatory, Receptor, Hormonal, Defensive, Storage' },
    { front: 'What makes proline unique among amino acids?', back: 'Proline has a ring structure that includes the central carbon AND the nitrogen. The N is part of a ring, bonded as an imino group (=NH) rather than a free amino group. This creates kinks/turns in protein chains.' },
    { front: 'What are disulfide bonds and which amino acid forms them?', back: 'Disulfide bonds (—S—S—) form between two cysteine residues (each has a —SH sulfhydryl group). They help stabilize the tertiary/quaternary structure of proteins.' },
    { front: 'What are the base-pairing rules in DNA?', back: 'A pairs with T (2 hydrogen bonds)\nG pairs with C (3 hydrogen bonds)\nRemember: stronger G≡C bonds (3 H-bonds) make G-C rich regions harder to denature.' },
    { front: 'What does "semi-conservative" replication mean?', back: 'Each daughter DNA molecule consists of one original (parental) strand and one newly synthesized strand. Proven by the Meselson-Stahl experiment using nitrogen isotopes (¹⁵N/¹⁴N).' },
    { front: 'What enzyme unwinds DNA during replication?', back: 'Helicase. It breaks H-bonds between base pairs and separates the two strands at the replication fork.' },
    { front: 'What is a codon? How many are there?', back: 'A codon is a 3-nucleotide sequence on mRNA that specifies one amino acid. There are 64 codons: 61 code for amino acids and 3 are stop codons (UAA, UAG, UGA). AUG = start codon (methionine).' },
    { front: 'What is the overall equation for cellular respiration?', back: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ~30-36 ATP\nGlucose + oxygen → carbon dioxide + water + ATP energy' },
    { front: 'Where does glycolysis occur and what does it produce?', back: 'Location: Cytoplasm (cytosol)\nProducts per glucose: 2 pyruvate + 2 net ATP + 2 NADH\nDoes NOT require oxygen (can occur anaerobically).' },
    { front: 'What is the final electron acceptor in aerobic cellular respiration?', back: 'Oxygen (O₂). It accepts electrons at the end of the electron transport chain and combines with H⁺ to form water (H₂O). Without O₂, the ETC stops and cells switch to fermentation.' },
    { front: 'What is the difference between lactic acid and alcoholic fermentation?', back: 'Lactic acid: pyruvate → lactate. Occurs in muscle cells, red blood cells, some bacteria (yogurt).\nAlcoholic: pyruvate → ethanol + CO₂. Occurs in yeast and some plants.\nBoth regenerate NAD⁺ so glycolysis can continue; both yield only 2 ATP/glucose.' },
    { front: 'What is gel electrophoresis used for in biotechnology?', back: 'Separates DNA, RNA, or proteins by size using an electric field through a gel matrix. Smaller fragments travel farther. Used in: DNA fingerprinting, PCR analysis, genetic testing, protein analysis.' },
    { front: 'What are the 4 levels of protein structure?', back: '1. Primary: amino acid sequence (peptide bonds)\n2. Secondary: α-helices and β-sheets (H-bonds in backbone)\n3. Tertiary: overall 3D shape (R-group interactions, disulfide bonds, hydrophobic)\n4. Quaternary: multiple polypeptide chains (e.g., hemoglobin = 4 subunits)' },
    { front: 'What is the role of hemoglobin and myoglobin?', back: 'Hemoglobin: carries O₂ in red blood cells; 4 subunits (quaternary structure); also carries some CO₂ as carbaminohemoglobin.\nMyoglobin: stores O₂ in muscle cells; single polypeptide (no quaternary structure); higher O₂ affinity than hemoglobin.' },
    { front: 'What is the difference between competitive and noncompetitive inhibition?', back: 'Competitive: inhibitor mimics substrate and competes for the active site. Reversible with more substrate. Does NOT change Vmax; does increase apparent Km.\nNoncompetitive: inhibitor binds allosteric site, changes active site shape. Cannot be overcome with more substrate. Decreases Vmax; Km unchanged.' },
    { front: 'Describe the steps of the scientific method as covered in BIO 1107.', back: '1. Observation\n2. Question (identify the problem)\n3. Hypothesis (testable if/then prediction)\n4. Experiment (controlled, with variables identified)\n5. Data Analysis\n6. Conclusion (support/reject hypothesis)\n7. Share/peer review\nRepeat — science is iterative!' },
  ],
}

const CHEM_FLASHCARDS = {
  deckId: 'chem-deck-01',
  deckTitle: 'CHEM 1128Q — Core Equations & Concepts',
  courseId: CHEM_ID,
  cards: [
    { front: 'Write the equilibrium constant expression for: aA + bB ⇌ cC + dD', back: 'Kc = [C]ᶜ[D]^d / [A]^a[B]^b\n\nRemember: products in numerator, reactants in denominator. Pure solids and pure liquids are NOT included. Coefficients become exponents.' },
    { front: 'If K > 1, where does equilibrium lie? If K < 1?', back: 'K > 1: equilibrium lies to the RIGHT (products favored)\nK < 1: equilibrium lies to the LEFT (reactants favored)\nK = 1: roughly equal amounts of reactants and products' },
    { front: 'What is the reaction quotient Q and how is it used?', back: 'Q uses current (non-equilibrium) concentrations, same formula as K.\n• Q < K → forward reaction (→) to reach equilibrium\n• Q > K → reverse reaction (←) to reach equilibrium\n• Q = K → system is at equilibrium' },
    { front: "State Le Chatelier's Principle", back: "If a stress is applied to a system at equilibrium, the system shifts to partially counteract that stress.\nStresses: adding/removing reactants or products, changing pressure (gases), changing temperature.\nOnly temperature changes the value of K." },
    { front: "How does temperature affect K for an exothermic reaction?", back: 'For an exothermic reaction (ΔH < 0), heat is a product:\n• Increase T → equilibrium shifts LEFT → K decreases\n• Decrease T → equilibrium shifts RIGHT → K increases\nFor endothermic (ΔH > 0): opposite — increase T shifts right, K increases.' },
    { front: 'Write the Henderson-Hasselbalch equation and state when a buffer is most effective.', back: 'pH = pKa + log([A⁻]/[HA])\n\nMost effective (maximum buffering capacity) when [A⁻] = [HA], so pH = pKa.\nUseful range: approximately pKa ± 1 pH unit.' },
    { front: 'What happens at the equivalence point of a strong acid/strong base titration? Weak acid/strong base?', back: 'Strong acid + strong base: equivalence point pH = 7.00 (neutral; only water and salt remain)\nWeak acid + strong base: equivalence point pH > 7 (conjugate base is a weak base; hydrolyzes to give OH⁻)\nWeak base + strong acid: equivalence point pH < 7 (conjugate acid is a weak acid)' },
    { front: 'Write the Ksp expression for lead iodide, PbI₂', back: 'PbI₂(s) ⇌ Pb²⁺(aq) + 2I⁻(aq)\nKsp = [Pb²⁺][I⁻]²\n\nIf molar solubility = s:\nKsp = (s)(2s)² = 4s³\nSolve: s = (Ksp/4)^(1/3)' },
    { front: 'When does precipitation occur in terms of Q vs. Ksp?', back: 'Precipitation occurs when Q > Ksp (the ion product exceeds the solubility product).\n• Q < Ksp: unsaturated, more solid can dissolve\n• Q = Ksp: saturated (at equilibrium)\n• Q > Ksp: supersaturated → precipitation occurs until Q = Ksp' },
    { front: 'What is the rate law for a first-order reaction and what is its half-life?', back: 'Rate = k[A]\nIntegrated: ln[A] = ln[A]₀ − kt  (or [A] = [A]₀e^{−kt})\nHalf-life: t½ = 0.693/k\nKey: first-order half-life is CONSTANT (independent of concentration) — used for radioactive decay!' },
    { front: 'Write the Arrhenius equation and explain how to find Ea from two temperatures.', back: 'k = Ae^{−Ea/RT}\n\nTo find Ea from two rate constants:\nln(k₂/k₁) = (Ea/R)(1/T₁ − 1/T₂)\n\nA = frequency factor\nEa = activation energy (J/mol)\nR = 8.314 J/(mol·K)\nT = temperature in Kelvin' },
    { front: 'What is the common ion effect and how does it affect solubility?', back: 'Adding an ion that is already part of the equilibrium shifts it left (Le Chatelier), DECREASING solubility.\nExample: PbI₂ is LESS soluble in 0.10 M KI than in pure water because the extra I⁻ from KI suppresses dissolution.\nThe common ion effect is why tooth enamel is more stable in fluoride-containing water.' },
    { front: 'What is Kp and how is it related to Kc?', back: 'Kp = equilibrium constant expressed in terms of partial pressures (for gases)\nKp = Kc(RT)^Δn\nwhere Δn = (moles gaseous products) − (moles gaseous reactants)\nIf Δn = 0, then Kp = Kc' },
    { front: 'How do you calculate pH of a weak acid solution? (Steps)', back: '1. Write dissociation equation: HA ⇌ H⁺ + A⁻\n2. Set up ICE table with x = amount dissociated\n3. Ka = x²/(C − x)\n4. Simplify: if Ka << C, then C − x ≈ C\n5. Solve: x = [H⁺] = √(Ka · C)\n6. pH = −log[H⁺]\n7. Check: is x/C < 5%? If not, use quadratic.' },
    { front: 'What makes something a buffer vs. just a weak acid solution?', back: 'A buffer contains BOTH a weak acid AND its conjugate base (in comparable amounts).\nA weak acid solution alone is NOT a buffer — it cannot resist addition of acid (no conjugate base present) effectively.\nRequirements:\n• pKa within ~1 pH unit of desired pH\n• Significant concentrations of both HA and A⁻' },
    { front: 'Describe the four colligative properties and what they depend on.', back: 'Colligative properties depend on the NUMBER of solute particles, NOT their identity:\n1. Vapor pressure lowering: ΔP = Xsolute × P°solvent\n2. Boiling point elevation: ΔTb = Kb × m × i\n3. Freezing point depression: ΔTf = Kf × m × i\n4. Osmotic pressure: π = MRT × i\nwhere i = van\'t Hoff factor (# particles per formula unit), m = molality' },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  if (!OWNER_ID) {
    console.error('Set SEED_USER_ID env var')
    process.exit(1)
  }

  console.log('Seeding BIO 1107 topics...')
  for (const t of BIO_TOPICS) {
    await db.topic.upsert({
      where: { id: t.id },
      update: { title: t.title, position: t.position },
      create: { id: t.id, courseId: BIO_ID, title: t.title, position: t.position },
    })
  }

  console.log('Seeding BIO 1107 notes...')
  for (const n of BIO_NOTES) {
    await db.note.upsert({
      where: { id: n.id },
      update: { title: n.title, contentMd: n.contentMd },
      create: { id: n.id, courseId: BIO_ID, topicId: n.topicId, title: n.title, contentMd: n.contentMd },
    })
  }

  console.log('Seeding CHEM 1128Q topics...')
  for (const t of CHEM_TOPICS) {
    await db.topic.upsert({
      where: { id: t.id },
      update: { title: t.title, position: t.position },
      create: { id: t.id, courseId: CHEM_ID, title: t.title, position: t.position },
    })
  }

  console.log('Seeding CHEM 1128Q notes...')
  for (const n of CHEM_NOTES) {
    await db.note.upsert({
      where: { id: n.id },
      update: { title: n.title, contentMd: n.contentMd },
      create: { id: n.id, courseId: CHEM_ID, topicId: n.topicId, title: n.title, contentMd: n.contentMd },
    })
  }

  console.log('Seeding BIO 1107 flashcard deck...')
  await db.deck.upsert({
    where: { id: BIO_FLASHCARDS.deckId },
    update: {},
    create: {
      id: BIO_FLASHCARDS.deckId,
      courseId: BIO_FLASHCARDS.courseId,
      title: BIO_FLASHCARDS.deckTitle,
    },
  })
  for (let i = 0; i < BIO_FLASHCARDS.cards.length; i++) {
    const c = BIO_FLASHCARDS.cards[i]
    await db.card.upsert({
      where: { id: `bio-card-${String(i + 1).padStart(2, '0')}` },
      update: { front: c.front, back: c.back },
      create: {
        id: `bio-card-${String(i + 1).padStart(2, '0')}`,
        deckId: BIO_FLASHCARDS.deckId,
        front: c.front,
        back: c.back,
        type: 'basic',
      },
    })
  }

  console.log('Seeding CHEM 1128Q flashcard deck...')
  await db.deck.upsert({
    where: { id: CHEM_FLASHCARDS.deckId },
    update: {},
    create: {
      id: CHEM_FLASHCARDS.deckId,
      courseId: CHEM_FLASHCARDS.courseId,
      title: CHEM_FLASHCARDS.deckTitle,
    },
  })
  for (let i = 0; i < CHEM_FLASHCARDS.cards.length; i++) {
    const c = CHEM_FLASHCARDS.cards[i]
    await db.card.upsert({
      where: { id: `chem-card-${String(i + 1).padStart(2, '0')}` },
      update: { front: c.front, back: c.back },
      create: {
        id: `chem-card-${String(i + 1).padStart(2, '0')}`,
        deckId: CHEM_FLASHCARDS.deckId,
        front: c.front,
        back: c.back,
        type: 'basic',
      },
    })
  }

  console.log(`
Done! Inserted:
  BIO 1107:    ${BIO_TOPICS.length} topics, ${BIO_NOTES.length} notes, ${BIO_FLASHCARDS.cards.length} flashcards
  CHEM 1128Q:  ${CHEM_TOPICS.length} topics, ${CHEM_NOTES.length} notes, ${CHEM_FLASHCARDS.cards.length} flashcards
  `)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => db.$disconnect().then(() => pool.end()))
