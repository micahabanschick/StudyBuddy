/**
 * Deep-writes CHEM 1128Q notes grounded in OpenStax Chemistry 2e (Ch 11–17).
 * Run: DATABASE_URL=... tsx scripts/seed-chem-deep-notes.ts
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})
const db = new PrismaClient({ adapter: new PrismaPg(pool) })
const CHEM_ID = 'seed-chem-1128q'

const NOTES: Array<{ id: string; topicId: string; title: string; contentMd: string }> = [
  // ─── Ch 11 — SOLUTIONS ───────────────────────────────────────────────────────
  {
    id: 'chem-n-07',
    topicId: 'chem-t-01',
    title: 'Solutions & Colligative Properties',
    contentMd: `# Solutions & Colligative Properties
*OpenStax Chemistry 2e — Chapter 11*

---

## 11.1 The Dissolution Process

**Solution:** A homogeneous mixture with uniform composition at the molecular level.

| Term | Definition |
|------|-----------|
| Solvent | Component present in greater amount |
| Solute | Component present in lesser amount |
| Aqueous solution | Water is the solvent (aq notation) |
| Solvation | Exothermic process of establishing solute–solvent attractions |
| Ideal solution | Forms with no net energy change (solute–solvent IMFs ≈ pure component IMFs) |

### Three-Step Dissolution Model
1. Break solute–solute interactions → **endothermic**
2. Break solvent–solvent interactions → **endothermic**
3. Form solute–solvent interactions → **exothermic**

$$\\Delta H_{solution} = \\Delta H_{step1} + \\Delta H_{step2} + \\Delta H_{step3}$$

Net $\\Delta H_{solution}$ can be positive or negative.

**Entropy always increases upon dissolution** — this thermodynamic driving force can make even endothermic dissolution spontaneous.

> **"Like dissolves like":** Polar solutes in polar solvents; nonpolar in nonpolar. Structural similarity → comparable IMFs → favorable mixing.

---

## 11.2 Electrolytes

| Type | Behavior | Example |
|------|---------|---------|
| Strong electrolyte | ~100% ionization | NaCl, HCl, NaOH |
| Weak electrolyte | Partial ionization | HF, CH₃COOH, NH₃ |
| Nonelectrolyte | No ionization | Glucose, ethanol |

**Ionic compounds:** Physical dissociation — water dipoles surround and separate ions (ion–dipole attraction).

**Covalent electrolytes:** Chemical reaction with water produces ions (e.g., HCl + H₂O → H₃O⁺ + Cl⁻).

Water autoionization:
$$\\text{H}_2\\text{O}(l) + \\text{H}_2\\text{O}(l) \\rightleftharpoons \\text{H}_3\\text{O}^+(aq) + \\text{OH}^-(aq)$$
(only ~2 in 10⁹ molecules at 25°C)

---

## 11.3 Solubility

| Term | Meaning |
|------|---------|
| Saturated | At equilibrium solubility limit |
| Unsaturated | Below limit; more solid can dissolve |
| Supersaturated | Above limit; unstable; will precipitate |
| Miscible | Liquids mix in any proportion |

**Henry's Law** — gas solubility in liquid:
$$C_g = kP_g$$
- $C_g$ = dissolved gas concentration
- $P_g$ = partial pressure of gas above solution
- $k$ = Henry's Law constant (substance- and temperature-specific)

**Solubility trends:**
- Gas solubility **decreases** with increasing temperature, **increases** with increasing pressure
- Solid solubility generally **increases** with temperature (exceptions exist)
- Thermal pollution: warmer water holds less O₂ → harms aquatic ecosystems

**Real-world applications:**
- Carbonation: CO₂ dissolved under high pressure; degasses when bottle opened
- Bends (decompression sickness): rapid pressure drop causes dissolved N₂ to bubble in bloodstream

---

## 11.4 Colligative Properties

**Colligative properties** depend only on the **number** of solute particles, NOT their identity.

### Concentration Units

**Mole fraction:**
$$X_A = \\frac{n_A}{n_{total}}$$

**Molality** (temperature-independent — preferred for colligative calculations):
$$m = \\frac{\\text{mol solute}}{\\text{kg solvent}}$$

**Van't Hoff factor** $i$: accounts for electrolyte dissociation.
$$i = \\frac{\\text{moles particles in solution}}{\\text{moles formula units dissolved}}$$
- NaCl: ideal $i = 2$ (Na⁺ + Cl⁻)
- MgCl₂: ideal $i = 3$
- Glucose: $i = 1$ (nonelectrolyte)
- Measured $i$ < theoretical due to ion pairing at higher concentrations

### Four Colligative Properties

**1. Vapor pressure lowering** — Raoult's Law:
$$P_A = X_A P_A^*$$
$$P_{solution} = \\sum_i X_i P_i^*$$
Solute lowers vapor pressure proportional to mole fraction.

**2. Boiling point elevation:**
$$\\Delta T_b = K_b \\cdot m \\cdot i$$
$K_b$ = ebullioscopic constant (water: 0.512 °C·kg/mol)

**3. Freezing point depression:**
$$\\Delta T_f = K_f \\cdot m \\cdot i$$
$K_f$ = cryoscopic constant (water: 1.86 °C·kg/mol)
Applications: antifreeze, road salt, lab molar mass determination

**4. Osmotic pressure:**
$$\\Pi = iMRT$$
$M$ = molarity, $R$ = 0.08206 L·atm/mol·K, $T$ in Kelvin

> Osmotic pressure is the most sensitive colligative property — used to measure molar masses of large biomolecules.

### Osmosis
- **Semipermeable membrane:** Allows solvent, blocks most solutes
- **Osmosis:** Net solvent diffusion from low solute → high solute concentration
- **Isotonic:** Same concentration inside/outside cell → no net flow
- **Hypotonic:** Less concentrated outside → cell swells (hemolysis)
- **Hypertonic:** More concentrated outside → cell shrinks (crenation)
- **Reverse osmosis:** Applied pressure > $\\Pi$ forces water through membrane (desalination)

---

## 11.5 Colloids

| Dispersed Phase | Medium | Name | Example |
|----------------|--------|------|---------|
| Solid | Liquid | Sol | Paint, blood |
| Liquid | Gas | Aerosol | Fog, clouds |
| Liquid | Liquid | Emulsion | Milk, mayonnaise |
| Gas | Liquid | Foam | Whipped cream |
| Liquid | Solid | Gel | Jelly, gelatin |

**Tyndall Effect:** Colloidal particles scatter light → visible beam (distinguishes colloid from true solution).

**Soap/detergent mechanism:** Nonpolar hydrocarbon tail dissolves in grease; ionic head faces water — bridges oil and water for emulsification.
`,
  },

  // ─── Ch 12 — KINETICS (deepened) ─────────────────────────────────────────────
  {
    id: 'chem-n-06',
    topicId: 'chem-t-02',
    title: 'Chemical Kinetics — Rate Laws & Mechanisms',
    contentMd: `# Chemical Kinetics
*OpenStax Chemistry 2e — Chapter 12*

---

## 12.1 Reaction Rates

**Rate** = change in concentration per unit time.

$$\\text{rate} = -\\frac{\\Delta[\\text{Reactant}]}{\\Delta t} = +\\frac{\\Delta[\\text{Product}]}{\\Delta t}$$

For $aA + bB \\rightarrow cC + dD$:
$$\\text{rate} = -\\frac{1}{a}\\frac{\\Delta[A]}{\\Delta t} = -\\frac{1}{b}\\frac{\\Delta[B]}{\\Delta t} = \\frac{1}{c}\\frac{\\Delta[C]}{\\Delta t} = \\frac{1}{d}\\frac{\\Delta[D]}{\\Delta t}$$

- **Average rate:** Over a time interval
- **Instantaneous rate:** Slope of tangent on concentration–time graph
- **Initial rate:** At $t = 0$ (before products accumulate)

---

## 12.2 Factors Affecting Rate

1. **Chemical nature of reactants** — identity determines intrinsic rate
2. **Physical state / surface area** — smaller particles → more interface → faster
3. **Temperature** — rate roughly doubles per 10°C rise; more molecules exceed $E_a$
4. **Concentration** — more collisions per unit volume
5. **Catalysts** — lower $E_a$; not consumed; don't change equilibrium

---

## 12.3 Rate Laws

$$\\text{rate} = k[A]^m[B]^n$$

| Term | Meaning |
|------|---------|
| $k$ | Rate constant — temperature dependent, concentration independent |
| $m, n$ | Reaction orders — **determined experimentally only** (NOT from coefficients) |
| $m + n$ | Overall reaction order |

**Units of $k$ by order:**

| Order | Units of $k$ |
|-------|-------------|
| 0 | mol·L⁻¹·s⁻¹ |
| 1 | s⁻¹ |
| 2 | L·mol⁻¹·s⁻¹ |
| 3 | L²·mol⁻²·s⁻¹ |

### Method of Initial Rates
Compare two experiments where one concentration changes and others are held constant:
$$\\frac{\\text{rate}_2}{\\text{rate}_1} = \\left(\\frac{[A]_2}{[A]_1}\\right)^m$$

Then solve for $m$.

---

## 12.4 Integrated Rate Laws

| Order | Rate Law | Integrated Form | Linear Plot | Half-life |
|-------|---------|-----------------|-------------|-----------|
| **0** | rate $= k$ | $[A]_t = [A]_0 - kt$ | $[A]$ vs $t$ | $t_{1/2} = \\frac{[A]_0}{2k}$ |
| **1** | rate $= k[A]$ | $\\ln[A]_t = \\ln[A]_0 - kt$ | $\\ln[A]$ vs $t$ | $t_{1/2} = \\frac{0.693}{k}$ |
| **2** | rate $= k[A]^2$ | $\\frac{1}{[A]_t} = \\frac{1}{[A]_0} + kt$ | $\\frac{1}{[A]}$ vs $t$ | $t_{1/2} = \\frac{1}{k[A]_0}$ |

**First-order exponential form:**
$$[A]_t = [A]_0 e^{-kt}$$

> First-order $t_{1/2}$ is **constant** (independent of $[A]_0$) — the defining feature. Used for radioactive decay.

**Determining order graphically:** Plot $[A]$ vs $t$, $\\ln[A]$ vs $t$, and $1/[A]$ vs $t$. The plot that gives a straight line reveals the order (slope = $\\pm k$).

---

## 12.5 Collision Theory & Arrhenius Equation

**Three requirements for a productive collision:**
1. Sufficient energy ≥ activation energy $E_a$
2. Proper molecular orientation
3. Collision must occur

$$k = Ae^{-E_a/RT}$$

Linear form:
$$\\ln k = \\frac{-E_a}{R} \\cdot \\frac{1}{T} + \\ln A$$

**Two-temperature form** (most exam-useful):
$$\\ln\\frac{k_1}{k_2} = \\frac{E_a}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$

where $R = 8.314$ J/mol·K and $T$ must be in Kelvin.

- Higher $T$ → larger fraction of molecules exceed $E_a$ → larger $k$
- Lower $E_a$ → more molecules can react → larger $k$
- Catalyst lowers $E_a$ without changing $\\Delta H$

**Transition state / activated complex:** Unstable species at the energy maximum of the reaction coordinate. Never isolated.

---

## 12.6 Reaction Mechanisms

**Elementary reaction:** A single step that occurs exactly as written. For elementary steps ONLY — rate law exponents equal stoichiometric coefficients.

| Molecularity | Example | Rate Law |
|-------------|---------|---------|
| Unimolecular | $A \\rightarrow$ products | rate $= k[A]$ |
| Bimolecular | $A + B \\rightarrow$ products | rate $= k[A][B]$ |
| Termolecular | $2A + B \\rightarrow$ products | rate $= k[A]^2[B]$ (rare) |

**Intermediate:** Produced in one step, consumed in another. Does NOT appear in the overall equation.

**Rate-determining step:** The slowest elementary step — controls the rate of the overall reaction.

### Identifying a valid mechanism:
1. Elementary steps must sum to the overall balanced equation
2. Rate law from the slow step must match the experimentally determined rate law
3. If slow step involves an intermediate, express it in terms of reactants using a prior fast equilibrium step

---

## 12.7 Catalysis

| Type | Description | Example |
|------|-------------|---------|
| Homogeneous | Same phase as reactants | NO catalyzing O₃ decomposition (both gas) |
| Heterogeneous | Different phase | Ni (solid) catalyzing alkene hydrogenation |
| Enzyme | Biological protein catalyst | Amylase (digests starch) |

**Heterogeneous mechanism:** Adsorption → activation → reaction → desorption of product.

**Enzyme models:**
- **Lock-and-key:** Active site is rigid, perfectly shaped for substrate
- **Induced-fit:** Active site flexibly adjusts when substrate binds

> Catalyst lowers both forward and reverse $E_a$ equally → reaches equilibrium faster but does NOT change $K$ or $\\Delta H$.

---

## Lab Connection: Iodination of Acetone

$$\\text{CH}_3\\text{COCH}_3 + \\text{I}_2 \\xrightarrow{\\text{H}^+} \\text{CH}_3\\text{COCH}_2\\text{I} + \\text{H}^+ + \\text{I}^-$$

Rate law: rate $= k[\\text{acetone}]^m[\\text{H}^+]^n[\\text{I}_2]^p$

The experiment reveals: reaction is **zero order in I₂** — rate is independent of $[\\text{I}_2]$. This demonstrates that rate orders cannot be assumed from stoichiometry.
`,
  },

  // ─── Ch 13 — EQUILIBRIUM (deepened) ──────────────────────────────────────────
  {
    id: 'chem-n-01',
    topicId: 'chem-t-03',
    title: 'Chemical Equilibrium — K Expressions & ICE Tables',
    contentMd: `# Chemical Equilibrium
*OpenStax Chemistry 2e — Chapter 13*

---

## 13.1 Dynamic Equilibrium

A system reaches **chemical equilibrium** when the forward and reverse reaction rates are equal and concentrations remain constant.

$$\\text{rate}_f = k_f[\\text{reactants}] = \\text{rate}_r = k_r[\\text{products}]$$

This is **dynamic** — molecular-level reactions continue in both directions; macroscopic concentrations appear static.

At equilibrium: $\\frac{k_f}{k_r} = K$

> Equilibrium does NOT mean equal concentrations of products and reactants — it means constant concentrations. Systems can be product-rich or reactant-rich.

---

## 13.2 Equilibrium Constants

### Concentration-based ($K_c$)

For $mA + nB \\rightleftharpoons xC + yD$:
$$K_c = \\frac{[C]^x[D]^y}{[A]^m[B]^n}$$

**Rules:**
- Products in numerator, reactants in denominator
- Coefficients become exponents
- **Pure solids and pure liquids are omitted** (activity = 1)
- $K$ depends only on **temperature**

### Pressure-based ($K_p$, for gases)
$$K_p = \\frac{P_C^x P_D^y}{P_A^m P_B^n}$$

**Relationship between $K_p$ and $K_c$:**
$$K_p = K_c(RT)^{\\Delta n}$$
where $\\Delta n$ = (moles gaseous products) − (moles gaseous reactants) and $R = 0.08206$ L·atm/mol·K.

### Manipulating $K$ for Combined Reactions

| Operation | Effect on $K$ |
|-----------|-------------|
| Reverse reaction | $K' = 1/K$ |
| Multiply all coefficients by $n$ | $K' = K^n$ |
| Add two reactions | $K' = K_1 \\times K_2$ |

---

## 13.3 Reaction Quotient ($Q$)

$Q$ has the same form as $K$ but uses **current** (non-equilibrium) concentrations.

| Comparison | Direction of shift |
|-----------|-------------------|
| $Q < K$ | Forward (→) — makes more products |
| $Q > K$ | Reverse (←) — makes more reactants |
| $Q = K$ | At equilibrium — no net change |

---

## 13.4 Le Châtelier's Principle

> If a stress is applied to a system at equilibrium, the equilibrium shifts to partially relieve that stress.

### Concentration Changes

| Stress | Shift |
|--------|-------|
| Add reactant | Forward → |
| Remove reactant | Reverse ← |
| Add product | Reverse ← |
| Remove product | Forward → |

$K$ does NOT change with concentration changes.

### Pressure/Volume Changes (gases only)

- **Decrease volume** (increase pressure) → shift toward **fewer** moles of gas
- **Increase volume** (decrease pressure) → shift toward **more** moles of gas
- Adding inert gas at constant volume → **no shift** (partial pressures unchanged)

### Temperature Changes

| Reaction | Increase $T$ | Decrease $T$ | Effect on $K$ |
|---------|------------|------------|--------------|
| Exothermic ($\\Delta H < 0$) | Shift left | Shift right | $K$ **decreases** |
| Endothermic ($\\Delta H > 0$) | Shift right | Shift left | $K$ **increases** |

> **Only temperature changes $K$. All other stresses only shift $Q$ toward $K$.**

### Catalysts
Reach equilibrium faster. $K$ and equilibrium position unchanged.

### Industrial Example — Haber-Bosch Process
$$\\text{N}_2(g) + 3\\text{H}_2(g) \\rightleftharpoons 2\\text{NH}_3(g) \\quad \\Delta H = -92.2 \\text{ kJ}$$

- **High pressure** (~150–250 atm): favors right (fewer gas moles on product side)
- **Continuous NH₃ removal**: shifts equilibrium right
- **Catalyst + ~400°C**: compromise between rate (needs high $T$) and yield (needs low $T$)

---

## 13.5 ICE Table Method

The standard tool for equilibrium calculations.

$$\\ \\begin{array}{lccc}
& A & + & B & \\rightleftharpoons & C \\\\
\\text{Initial} & [A]_0 & & [B]_0 & & [C]_0 \\\\
\\text{Change} & -ax & & -bx & & +cx \\\\
\\text{Equilibrium} & [A]_0-ax & & [B]_0-bx & & cx
\\end{array}$$

**Steps:**
1. Determine direction using $Q$ vs $K$
2. Set up ICE table with $x$ as the unknown change
3. Substitute equilibrium expressions into $K$
4. Solve for $x$ (may need quadratic: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$)
5. Take physically meaningful root (positive, doesn't exceed initial)

**Small $K$ approximation:** When $K \\ll [A]_0$, assume $[A]_0 - x \\approx [A]_0$. Valid if $x/[A]_0 < 5\\%$.

---

## Worked Example Pattern

Given: $\\text{PCl}_3(g) + \\text{Cl}_2(g) \\rightleftharpoons \\text{PCl}_5(g)$, $K_c = 49$ at a given temperature.

If initial concentrations are [PCl₃] = 0.20 M, [Cl₂] = 0.10 M:

1. $Q = 0$ (no PCl₅ initially) < $K$ → shifts right
2. ICE: Change: PCl₃ by $-x$, Cl₂ by $-x$, PCl₅ by $+x$
3. $K_c = \\frac{x}{(0.20-x)(0.10-x)} = 49$
4. Solve quadratic for $x$
5. Verify: plug back into $K$ expression
`,
  },

  // ─── Ch 14/15 — ACID-BASE (deepened) ────────────────────────────────────────
  {
    id: 'chem-n-03',
    topicId: 'chem-t-04',
    title: 'Acid-Base Chemistry — pH, Ka, Kb, Salt Hydrolysis',
    contentMd: `# Acid-Base Chemistry
*OpenStax Chemistry 2e — Chapter 14*

---

## Definitions

| Model | Acid | Base |
|-------|------|------|
| **Arrhenius** | Produces H⁺ in water | Produces OH⁻ in water |
| **Brønsted-Lowry** | H⁺ donor | H⁺ acceptor |
| **Lewis** | Electron-pair acceptor | Electron-pair donor |

**Conjugate pair:** Acid and the base formed after it donates H⁺ (differ by one H⁺).

**Amphiprotic species:** Can act as either acid or base. Examples: H₂O, HCO₃⁻, H₂PO₄⁻.

---

## Water Autoionization & pH Scale

$$\\text{H}_2\\text{O}(l) + \\text{H}_2\\text{O}(l) \\rightleftharpoons \\text{H}_3\\text{O}^+(aq) + \\text{OH}^-(aq)$$

$$K_w = [\\text{H}_3\\text{O}^+][\\text{OH}^-] = 1.0 \\times 10^{-14} \\text{ at 25°C}$$

(Increases with temperature — autoionization is endothermic)

$$\\text{pH} = -\\log[\\text{H}_3\\text{O}^+] \\qquad \\text{pOH} = -\\log[\\text{OH}^-]$$

$$\\text{pH} + \\text{pOH} = 14.00 \\text{ (at 25°C)}$$

At 25°C: neutral pH = 7.00, acidic pH < 7, basic pH > 7.
*(These cutoffs shift with temperature — at 80°C, neutral pH ≈ 6.31)*

---

## Strong vs Weak Acids & Bases

**Strong acids** — essentially 100% ionization:
HCl, HBr, HI, HNO₃, H₂SO₄ (1st ionization), HClO₄

**Strong bases** — 100% dissociation:
LiOH, NaOH, KOH, Ca(OH)₂, Sr(OH)₂, Ba(OH)₂

**Weak acids** — partial ionization with equilibrium:
$$\\text{HA}(aq) + \\text{H}_2\\text{O}(l) \\rightleftharpoons \\text{H}_3\\text{O}^+(aq) + \\text{A}^-(aq)$$
$$K_a = \\frac{[\\text{H}_3\\text{O}^+][\\text{A}^-]}{[\\text{HA}]}$$

**Weak bases:**
$$\\text{B}(aq) + \\text{H}_2\\text{O}(l) \\rightleftharpoons \\text{BH}^+(aq) + \\text{OH}^-(aq)$$
$$K_b = \\frac{[\\text{BH}^+][\\text{OH}^-]}{[\\text{B}]}$$

### Critical Conjugate Pair Relationship
$$K_a \\times K_b = K_w = 1.0 \\times 10^{-14}$$

> Stronger acid → weaker conjugate base; weaker acid → stronger conjugate base. This is why HF (weak acid) has a stronger conjugate base F⁻ than HCl (strong acid) has in Cl⁻.

**Percent ionization:**
$$\\%\\text{ ionization} = \\frac{[\\text{H}_3\\text{O}^+]_{eq}}{[\\text{HA}]_0} \\times 100\\%$$
Decreases as concentration increases (more concentrated weak acid = less % ionized).

---

## Solving Weak Acid ICE Problems

For HA at initial concentration $C$ with $K_a$:

$$K_a = \\frac{x^2}{C - x} \\approx \\frac{x^2}{C} \\text{ (if } x \\ll C\\text{)}$$

$$[\\text{H}_3\\text{O}^+] = x = \\sqrt{K_a \\cdot C}$$
$$\\text{pH} = -\\log x$$

**Check:** If $x/C < 5\\%$, approximation is valid. Otherwise use quadratic.

For weak base with $K_b$:
$$[\\text{OH}^-] = x = \\sqrt{K_b \\cdot C}$$
$$\\text{pOH} = -\\log x \\quad \\text{then} \\quad \\text{pH} = 14 - \\text{pOH}$$

---

## Structural Trends in Acid Strength

**Binary acids (H-X):**
- Across a period: strength increases with X electronegativity (H₂O < HF)
- Down a group: strength increases as H-X bond weakens (HF < HCl < HBr < HI)

**Oxyacids:**
- More O atoms around central atom → stronger acid (more electron withdrawal)
- $\\text{HClO}_4 > \\text{HClO}_3 > \\text{HClO}_2 > \\text{HClO}$
- Higher electronegativity of central atom → stronger acid

---

## Polyprotic Acids

$K_{a1} \\gg K_{a2} \\gg K_{a3}$ — successive ionizations are progressively weaker.

| Acid | $K_{a1}$ | $K_{a2}$ | $K_{a3}$ |
|------|---------|---------|---------|
| H₂CO₃ | $4.3 \\times 10^{-7}$ | $4.7 \\times 10^{-11}$ | — |
| H₂SO₄ | >10² (strong) | $1.2 \\times 10^{-2}$ | — |
| H₃PO₄ | $7.5 \\times 10^{-3}$ | $6.2 \\times 10^{-8}$ | $4.2 \\times 10^{-13}$ |

When $K_{a1}/K_{a2} \\geq 20$: treat ionizations sequentially — first ionization dominates.

---

## Salt Hydrolysis

Salts that form acidic or basic solutions:

| Salt type | Example | Solution pH |
|-----------|---------|------------|
| Strong acid + strong base | NaCl | Neutral (7.00) |
| Weak acid + strong base | CH₃COONa | **Basic** (anion hydrolyzes) |
| Strong acid + weak base | NH₄Cl | **Acidic** (cation hydrolyzes) |
| Weak acid + weak base | NH₄CH₃COO | Compare $K_a$ vs $K_b$ |

For anion hydrolysis (e.g., CH₃COO⁻ from acetic acid):
$$K_b(\\text{anion}) = \\frac{K_w}{K_a(\\text{parent acid})}$$

For cation hydrolysis (e.g., NH₄⁺ from ammonia):
$$K_a(\\text{cation}) = \\frac{K_w}{K_b(\\text{parent base})}$$

**Hydrated metal ions act as acids** — strength increases with higher charge and smaller ionic radius:
$$\\text{Al}(\\text{H}_2\\text{O})_6^{3+}(aq) + \\text{H}_2\\text{O} \\rightleftharpoons \\text{H}_3\\text{O}^+(aq) + \\text{Al}(\\text{H}_2\\text{O})_5(\\text{OH})^{2+}(aq)$$
`,
  },

  // ─── Ch 14 — BUFFERS & TITRATIONS (deepened) ────────────────────────────────
  {
    id: 'chem-n-04',
    topicId: 'chem-t-05',
    title: 'Buffers & Titrations',
    contentMd: `# Buffers & Titrations
*OpenStax Chemistry 2e — Chapter 14 (Sections 14.6–14.7)*

---

## Buffers

A **buffer** resists pH changes when small amounts of strong acid or base are added.

**Composition:** A weak acid **and** its conjugate base (e.g., CH₃COOH/CH₃COO⁻), or a weak base and its conjugate acid (e.g., NH₃/NH₄⁺).

### Henderson-Hasselbalch Equation
$$\\text{pH} = \\text{p}K_a + \\log\\frac{[\\text{A}^-]}{[\\text{HA}]}$$

- When $[\\text{A}^-] = [\\text{HA}]$: pH = p$K_a$ → **maximum buffering capacity**
- Effective buffer range: **p$K_a$ ± 1**
- Choose weak acid with p$K_a$ close to your target pH

### How Buffers Work

**Adding strong acid (H₃O⁺):** Reacts with conjugate base:
$$\\text{H}_3\\text{O}^+(aq) + \\text{A}^-(aq) \\rightarrow \\text{HA}(aq) + \\text{H}_2\\text{O}(l)$$

**Adding strong base (OH⁻):** Reacts with weak acid:
$$\\text{OH}^-(aq) + \\text{HA}(aq) \\rightarrow \\text{A}^-(aq) + \\text{H}_2\\text{O}(l)$$

After each addition: recalculate $[\\text{A}^-]$ and $[\\text{HA}]$, then reapply Henderson-Hasselbalch.

### Buffer Capacity
Proportional to concentrations of both buffer components. More concentrated buffer = greater capacity but same pH.

### Common Buffers
| System | p$K_a$ | Useful pH range |
|--------|--------|----------------|
| Acetic acid/acetate | 4.74 | 3.7–5.7 |
| Ammonia/ammonium | 9.25 | 8.25–10.25 |
| Bicarbonate/carbonate (blood) | 6.35 (CO₂/HCO₃⁻) | 5.4–7.4 |

**Blood buffer:**
$$\\text{H}_3\\text{O}^+(aq) + \\text{HCO}_3^-(aq) \\rightarrow \\text{H}_2\\text{CO}_3(aq) + \\text{H}_2\\text{O}(l)$$
Normal blood pH = 7.35–7.45. Change of ≥0.4 units is typically fatal.

---

## Acid-Base Titrations

**Equivalence point:** Moles of titrant exactly equals moles of analyte.

### Strong Acid + Strong Base

$$\\text{H}_3\\text{O}^+(aq) + \\text{OH}^-(aq) \\rightarrow 2\\text{H}_2\\text{O}(l)$$

pH curve:
1. **Initial:** pH set by strong acid concentration
2. **Pre-equivalence:** pH rises gradually
3. **Equivalence point:** pH = **7.00** (pure water + salt of strong acid/base)
4. **Post-equivalence:** pH determined by excess base

### Weak Acid + Strong Base

pH at equivalence point **> 7** — the conjugate base hydrolyzes:
$$\\text{A}^-(aq) + \\text{H}_2\\text{O}(l) \\rightleftharpoons \\text{HA}(aq) + \\text{OH}^-(aq)$$

Key calculation: $K_b(\\text{A}^-) = K_w/K_a$, then solve ICE for $[\\text{OH}^-]$.

**Half-equivalence point:** pH = p$K_a$ (buffer region; equal concentrations of HA and A⁻).

### Weak Base + Strong Acid

pH at equivalence **< 7** — the conjugate acid hydrolyzes to give H₃O⁺.

### Four Stages of Titration (General)
1. **Before titrant:** Pure acid or base → use Ka or Kb
2. **Pre-equivalence:** Buffer region → Henderson-Hasselbalch
3. **Equivalence:** Conjugate species only → hydrolysis calculation
4. **Post-equivalence:** Excess titrant dominates → use [excess]

---

## Indicators

**Indicator:** Weak organic acid (HIn) where HIn and In⁻ have different colors.

Color change interval ≈ **p$K_a$(indicator) ± 1**

| Indicator | Color change pH | Used for |
|-----------|----------------|---------|
| Methyl orange | 3.2–4.4 | Strong acid titrations |
| Litmus | 6.0–7.0 | Rough pH test |
| Phenolphthalein | 8.2–10.0 | Weak acid + strong base |
| Thymol blue | 1.2–2.8 and 8.0–9.6 | Both acidic and basic |

> Choose indicator whose color change interval overlaps the steep pH jump at the equivalence point.

---

## Worked Example: Buffer Calculation

Lactic acid buffer (Ka = 1.4×10⁻⁴):
- 15.0 g NaC₃H₅O₃ (MM = 112.06) + 12.50 g HC₃H₅O₃ (MM = 90.08) in 500 mL

Moles:
- NaLactate = 15.0/112.06 = 0.1338 mol → $[\\text{A}^-]$ = 0.2676 M
- Lactic acid = 12.50/90.08 = 0.1388 mol → $[\\text{HA}]$ = 0.2776 M

p$K_a$ = −log(1.4×10⁻⁴) = 3.85

$$\\text{pH} = 3.85 + \\log\\frac{0.2676}{0.2776} = 3.85 - 0.016 = 3.83$$
`,
  },

  // ─── Ch 15 — Ksp & COUPLED EQUILIBRIA (deepened) ────────────────────────────
  {
    id: 'chem-n-05',
    topicId: 'chem-t-06',
    title: 'Solubility Equilibria — Ksp & Coupled Equilibria',
    contentMd: `# Solubility Equilibria
*OpenStax Chemistry 2e — Chapter 15*

---

## 15.1 The Solubility Product Constant ($K_{sp}$)

For a sparingly soluble ionic compound:
$$M_pX_q(s) \\rightleftharpoons pM^{m+}(aq) + qX^{n-}(aq)$$
$$K_{sp} = [M^{m+}]^p [X^{n-}]^q$$

Pure solid is **not** included in the $K_{sp}$ expression.

### Common Ksp Expressions

| Compound | Dissolution | $K_{sp}$ |
|---------|------------|---------|
| AgCl | $\\text{AgCl} \\rightleftharpoons \\text{Ag}^+ + \\text{Cl}^-$ | $[\\text{Ag}^+][\\text{Cl}^-]$ |
| CaF₂ | $\\text{CaF}_2 \\rightleftharpoons \\text{Ca}^{2+} + 2\\text{F}^-$ | $[\\text{Ca}^{2+}][\\text{F}^-]^2$ |
| Ag₂SO₄ | $\\text{Ag}_2\\text{SO}_4 \\rightleftharpoons 2\\text{Ag}^+ + \\text{SO}_4^{2-}$ | $[\\text{Ag}^+]^2[\\text{SO}_4^{2-}]$ |
| Mg(OH)₂ | $\\text{Mg(OH)}_2 \\rightleftharpoons \\text{Mg}^{2+} + 2\\text{OH}^-$ | $[\\text{Mg}^{2+}][\\text{OH}^-]^2$ |

### Molar Solubility Calculations

Let $s$ = molar solubility (mol/L dissolved):

| Formula | $K_{sp}$ in terms of $s$ |
|---------|------------------------|
| AB | $K_{sp} = s^2$ |
| AB₂ or A₂B | $K_{sp} = 4s^3$ |
| AB₃ or A₃B | $K_{sp} = 27s^4$ |
| A₂B₃ | $K_{sp} = 108s^5$ |

**Lab example — PbI₂:**
$$\\text{PbI}_2(s) \\rightleftharpoons \\text{Pb}^{2+}(aq) + 2\\text{I}^-(aq)$$
$$K_{sp} = [\\text{Pb}^{2+}][\\text{I}^-]^2 = (s)(2s)^2 = 4s^3$$

---

## Predicting Precipitation

Compare the **ion product** $Q_{sp}$ to $K_{sp}$:

| $Q_{sp}$ vs $K_{sp}$ | Result |
|---------------------|--------|
| $Q_{sp} < K_{sp}$ | Unsaturated — no precipitation |
| $Q_{sp} = K_{sp}$ | Saturated — at equilibrium |
| $Q_{sp} > K_{sp}$ | Supersaturated — **precipitation occurs** |

---

## Common Ion Effect

Adding an ion already in the dissolution equilibrium **decreases** solubility (Le Châtelier's principle).

**Example:** CaF₂ in 0.10 M NaF solution.

Without NaF: $K_{sp} = 4s^3 \\rightarrow$ solve for $s$

With 0.10 M F⁻:
$$K_{sp} = [\\text{Ca}^{2+}][\\text{F}^-]^2 = s(0.10 + 2s)^2 \\approx s(0.10)^2 = 0.01s$$
$$s = K_{sp}/0.01 \\ll s_{\\text{pure water}}$$

This is why tooth enamel is more stable in fluoride-containing water and why slightly basic urine is better at preventing kidney stones.

---

## Selective Precipitation

Different salts have different $K_{sp}$ values. Adding a precipitating agent selectively removes the ion with the **smallest** $K_{sp}$ product first.

**Example:** Separating Ag⁺ ($K_{sp,\\text{AgCl}} = 1.77 \\times 10^{-10}$) from Pb²⁺ ($K_{sp,\\text{PbCl}_2} = 1.17 \\times 10^{-5}$) by adding Cl⁻ — Ag⁺ precipitates first.

---

## 15.2 Lewis Acids & Bases

| Lewis Acid | Lewis Base |
|-----------|-----------|
| Electron-pair **acceptor** | Electron-pair **donor** |
| Metal cations (Fe³⁺, Al³⁺) | NH₃, H₂O, CN⁻, OH⁻ |

**Coordinate covalent bond:** Both electrons come from the Lewis base (ligand).

**Complex ion formation:**
$$\\text{Cu}^+(aq) + 2\\text{CN}^-(aq) \\rightleftharpoons \\text{Cu(CN)}_2^-(aq)$$
$$K_f = \\frac{[\\text{Cu(CN)}_2^-]}{[\\text{Cu}^+][\\text{CN}^-]^2}$$

Large $K_f$ → very stable complex → drives dissolution of otherwise insoluble compounds.

---

## 15.3 Coupled Equilibria

When two equilibria share a species, net $K$:
$$K_{net} = K_1 \\times K_2$$

**Dissolution + complex formation:**
$$K_{net} = K_{sp} \\times K_f$$

**Dissolution + acid reaction** (pH affects solubility of salts with basic anions):
$$K_{net} = \\frac{K_{sp}}{K_a}$$

**Ocean acidification:**
$$\\text{CaCO}_3(s) + \\text{H}_3\\text{O}^+(aq) \\rightleftharpoons \\text{Ca}^{2+}(aq) + \\text{HCO}_3^-(aq) + \\text{H}_2\\text{O}(l)$$
$$K = \\frac{K_{sp}(\\text{CaCO}_3)}{K_{a2}(\\text{H}_2\\text{CO}_3)} = \\frac{8.7 \\times 10^{-9}}{4.7 \\times 10^{-11}} = 180$$
As CO₂ increases → pH drops → CaCO₃ dissolution increases → coral/shell damage.

**Amphoteric Al(OH)₃:** Dissolves in both acid AND base due to coupled equilibria.
`,
  },

  // ─── Ch 16 — THERMODYNAMICS (new) ────────────────────────────────────────────
  {
    id: 'chem-n-08',
    topicId: 'chem-t-03',
    title: 'Thermodynamics — Entropy, Gibbs Free Energy & K',
    contentMd: `# Thermodynamics
*OpenStax Chemistry 2e — Chapter 16*

---

## 16.1 Spontaneity

A **spontaneous process** occurs naturally under given conditions without continuous external energy input.

**Two driving forces:**
1. **Matter dispersal** — gas expanding into vacuum
2. **Energy dispersal** — heat flowing from hot → cold

> An endothermic process CAN be spontaneous if entropy increase is sufficient.

**Thermodynamically unstable but kinetically stable:** Diamond → graphite is spontaneous but negligibly slow.

---

## 16.2 Entropy ($S$)

**Entropy:** State function quantifying disorder/dispersal of matter and energy.

$$S = k \\ln W$$

where $k = 1.38 \\times 10^{-23}$ J/K (Boltzmann constant) and $W$ = number of microstates.

**Entropy change:**
$$\\Delta S = \\frac{q_{rev}}{T}$$

**Entropy trends:**

| Process | $\\Delta S$ |
|---------|-----------|
| Solid → liquid → gas | **+** |
| Gas → liquid → solid | **−** |
| Dissolving | **+** |
| Increase moles of gas | **+** |
| More complex molecules | **+** (more microstates) |

$$S_{gas} \\gg S_{liquid} > S_{solid}$$

**Standard entropy of reaction:**
$$\\Delta S°_{rxn} = \\sum \\nu S°(\\text{products}) - \\sum \\nu S°(\\text{reactants})$$

---

## 16.3 Second & Third Laws

**Second Law:** All spontaneous changes increase the entropy of the universe.
$$\\Delta S_{univ} = \\Delta S_{sys} + \\Delta S_{surr} > 0 \\text{ (spontaneous)}$$

**Third Law:** Entropy of a pure, perfect crystal at 0 K is zero. All standard entropies are positive.

---

## 16.4 Gibbs Free Energy

$$G = H - TS$$
$$\\Delta G = \\Delta H - T\\Delta S$$
$$\\Delta G° = \\Delta H° - T\\Delta S°$$

| $\\Delta G$ | Spontaneity |
|-----------|-----------|
| $< 0$ | Spontaneous |
| $> 0$ | Nonspontaneous |
| $= 0$ | Equilibrium |

### Temperature Dependence

| $\\Delta H$ | $\\Delta S$ | Spontaneous when |
|-----------|-----------|----------------|
| − | + | **Always** (favored at all $T$) |
| + | − | **Never** |
| − | − | **Low $T$** ($\\Delta H$ dominates) |
| + | + | **High $T$** ($T\\Delta S$ dominates) |

Transition temperature:
$$T_{transition} = \\frac{\\Delta H°}{\\Delta S°}$$

### From Formation Values
$$\\Delta G° = \\sum \\nu \\Delta G_f°(\\text{products}) - \\sum \\nu \\Delta G_f°(\\text{reactants})$$

### Non-standard Conditions
$$\\Delta G = \\Delta G° + RT\\ln Q$$

### Master Relationship: $\\Delta G°$, $K$, and $E°$

$$\\Delta G° = -RT\\ln K = -nFE°_{cell}$$

$$K = e^{-\\Delta G°/RT}$$

| $K$ | $\\Delta G°$ | $E°_{cell}$ | Status |
|-----|-----------|-----------|--------|
| $> 1$ | $< 0$ | $> 0$ | Products favored, spontaneous |
| $< 1$ | $> 0$ | $< 0$ | Reactants favored, nonspontaneous |
| $= 1$ | $= 0$ | $= 0$ | At equilibrium |

---

## Connecting Thermodynamics to Kinetics

- $\\Delta G°$ tells you **IF** a reaction is spontaneous (thermodynamics)
- $E_a$ tells you **HOW FAST** (kinetics)
- A reaction can be thermodynamically spontaneous but kinetically very slow (diamond → graphite)
- A catalyst lowers $E_a$ but does NOT change $\\Delta G°$ or $K$
`,
  },

  // ─── Ch 17 — ELECTROCHEMISTRY (new) ──────────────────────────────────────────
  {
    id: 'chem-n-09',
    topicId: 'chem-t-07',
    title: 'Electrochemistry — Galvanic Cells, Potentials & Nernst',
    contentMd: `# Electrochemistry
*OpenStax Chemistry 2e — Chapter 17*

---

## 17.1 Oxidation-Reduction Review

| Term | Definition |
|------|-----------|
| Oxidation | **Loss** of electrons; oxidation number increases |
| Reduction | **Gain** of electrons; oxidation number decreases |
| Oxidizing agent | Causes oxidation; is itself **reduced** |
| Reducing agent | Causes reduction; is itself **oxidized** |

**Oxidation number rules:**
- Pure element: **0**
- Monatomic ion: equals charge
- O: usually **−2** (except peroxides: −1)
- H: usually **+1** (except metal hydrides: −1)
- Sum = overall charge of species

### Half-Reaction Method (Acidic solution)
1. Write skeletal half-reactions
2. Balance all atoms except H and O
3. Balance O by adding H₂O
4. Balance H by adding H⁺
5. Balance charge by adding electrons
6. Multiply to equalize electrons transferred
7. Add and cancel
8. *For basic solution:* add OH⁻ to both sides to neutralize H⁺

---

## 17.2 Galvanic (Voltaic) Cells

**Galvanic cell:** Spontaneous redox reaction generates electrical current by separating the two half-reactions.

| Electrode | Reaction | Sign in galvanic cell |
|-----------|---------|----------------------|
| **Anode** | Oxidation | Negative (−) |
| **Cathode** | Reduction | Positive (+) |

**Salt bridge:** Provides ion flow to maintain charge neutrality without mixing reactants. Cations migrate toward cathode; anions toward anode.

**Inert electrodes** (Pt): Used when both redox couple members are in solution.

### Cell Notation
$$\\text{anode} \\mid \\text{anode solution} \\parallel \\text{cathode solution} \\mid \\text{cathode}$$

Single line $|$ = phase boundary; Double line $\\|$ = salt bridge.

**Example (Cu/Ag cell):**
$$\\text{Cu}(s) | \\text{Cu(NO}_3)_2(aq) \\| \\text{AgNO}_3(aq) | \\text{Ag}(s)$$

---

## 17.3 Standard Electrode Potentials

**Standard hydrogen electrode (SHE):** Universal reference; $E° = 0$ V exactly.

$$E°_{cell} = E°_{cathode} - E°_{anode}$$

A **positive $E°_{cell}$** means the reaction is spontaneous.

### Selected Standard Reduction Potentials

| Half-reaction | $E°$ (V) |
|--------------|---------|
| $\\text{F}_2 + 2e^- \\rightarrow 2\\text{F}^-$ | +2.87 |
| $\\text{Ag}^+ + e^- \\rightarrow \\text{Ag}$ | +0.80 |
| $\\text{Cu}^{2+} + 2e^- \\rightarrow \\text{Cu}$ | +0.34 |
| $2\\text{H}^+ + 2e^- \\rightarrow \\text{H}_2$ | 0.000 (reference) |
| $\\text{Fe}^{2+} + 2e^- \\rightarrow \\text{Fe}$ | −0.44 |
| $\\text{Zn}^{2+} + 2e^- \\rightarrow \\text{Zn}$ | −0.76 |
| $\\text{Li}^+ + e^- \\rightarrow \\text{Li}$ | −3.04 |

**Activity series from table:** Higher $E°$ = stronger oxidizing agent. Any species spontaneously oxidizes another species below it in the table.

---

## 17.4 $E°$, $\\Delta G°$, and $K$ — The Master Triangle

$$\\Delta G° = -nFE°_{cell} = -RT\\ln K$$

$$E°_{cell} = \\frac{RT}{nF}\\ln K = \\frac{0.0592 \\text{ V}}{n}\\log K \\text{ (at 25°C)}$$

where **$F = 96{,}485$ C/mol e⁻** (Faraday's constant) and $n$ = moles of electrons transferred.

### Nernst Equation (non-standard conditions)

$$E_{cell} = E°_{cell} - \\frac{RT}{nF}\\ln Q$$

At 25°C (simplified):
$$E_{cell} = E°_{cell} - \\frac{0.0592 \\text{ V}}{n}\\log Q$$

**At equilibrium** ($E_{cell} = 0$, $Q = K$):
$$E°_{cell} = \\frac{0.0592}{n}\\log K$$

**Concentration cells:** Both half-cells use same chemistry but different concentrations. $E°_{cell} = 0$ but Nernst gives non-zero $E_{cell}$ — purely concentration-driven.

---

## 17.5 Batteries

| Battery | $E$ | Notes |
|---------|-----|-------|
| Dry cell (Zn/MnO₂) | ~1.5 V | Primary; nonrechargeable |
| Alkaline | ~1.43 V | 3–5× energy of dry cell |
| Lead-acid | ~2 V/cell, 12 V total | Rechargeable; auto batteries |
| Ni-Cd | ~1.2 V | ~1000 cycles; toxic Cd |
| Li-ion | ~3.7 V | High energy density; phones/EVs |
| H₂ fuel cell | ~1.2 V | 50–75% efficient vs 20–25% combustion |

---

## 17.6 Corrosion

Iron rusting is a spontaneous electrochemical process ($E°_{cell} = +1.67$ V!):
- Anode: $\\text{Fe}(s) \\rightarrow \\text{Fe}^{2+}(aq) + 2e^-$
- Cathode: $\\text{O}_2(g) + 4\\text{H}^+(aq) + 4e^- \\rightarrow 2\\text{H}_2\\text{O}(l)$

**Prevention methods:**
1. Painting / coating (barrier)
2. Alloying — stainless steel: Cr forms protective Cr₂O₃ (passivation)
3. Galvanization — Zn coating corrodes preferentially
4. Cathodic protection — connect to more active sacrificial anode (Zn or Mg)

---

## 17.7 Electrolysis

**Electrolysis:** External power drives a NON-spontaneous reaction ($E°_{cell} < 0$).

| | Galvanic | Electrolytic |
|-|---------|-------------|
| Spontaneity | Spontaneous | Nonspontaneous |
| $E°_{cell}$ | Positive | Negative |
| Application | Batteries | Metal refining, electroplating |

### Faraday's Law (quantitative electrolysis)

$$Q = It \\quad \\text{(coulombs = amperes × seconds)}$$
$$n_{e^-} = \\frac{Q}{F} = \\frac{It}{96{,}485}$$

**Steps:**
1. $Q = I \\times t$
2. $n_{e^-} = Q/96{,}485$
3. Use stoichiometry of half-reaction to find mol product
4. Convert to grams using molar mass

**Industrial applications:** Downs process (Na from NaCl), chlor-alkali (Cl₂ + NaOH), water electrolysis, electroplating (Ag, Cu, Cr, Au).
`,
  },
] // end NOTES array

async function main() {
  for (const n of NOTES) {
    console.log(`Upserting: ${n.title}`)
    await db.note.upsert({
      where: { id: n.id },
      update: { title: n.title, contentMd: n.contentMd, topicId: n.topicId },
      create: {
        id: n.id,
        courseId: CHEM_ID,
        topicId: n.topicId,
        title: n.title,
        contentMd: n.contentMd,
      },
    })
  }
  console.log(`\nDone — ${NOTES.length} notes written.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect().then(() => pool.end()))
