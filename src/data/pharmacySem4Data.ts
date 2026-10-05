// B.Pharm 4th Semester (PCI Syllabus BP401T - BP405T) Ultimate Study & High-Yield Question Bank
// Detailed 10-Mark Essays, 5-Mark Short Notes, 2-Mark Defs, Drug Synthesis & GPAT Probability

export interface PharmacySubject {
  id: string;
  code: string;
  name: string;
  hindiName: string;
  shortDesc: string;
  badge: string;
  color: string;
  icon: string;
  units: {
    unitNumber: number;
    title: string;
    keyTopics: string[];
    tenMarkQuestion: {
      question: string;
      answerStructure: string[];
      diagramNotes?: string;
      gpatTrick?: string;
    };
    fiveMarkQuestions: {
      question: string;
      answerPoints: string[];
      reactionOrStructure?: string;
    }[];
    twoMarkQuestions: {
      question: string;
      definition: string;
      mnemonic?: string;
    }[];
    gpatProbabilityMcqs: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
      probability: string;
    }[];
  }[];
}

export const PHARMACY_SEM4_SUBJECTS: PharmacySubject[] = [
  // =========================================================================
  // 1. MEDICINAL CHEMISTRY - I (BP402T)
  // =========================================================================
  {
    id: 'medchem-1',
    code: 'BP402T',
    name: 'Medicinal Chemistry - I',
    hindiName: 'औषधीय रसायन शास्त्र - 1 (ड्रग संरचना, SAR व संश्लेषण)',
    shortDesc: 'Physicochemical properties, ANS Drugs (Adrenergic, Cholinergic), Sedative-Hypnotics, Antipsychotics, Anticonvulsants, General & Local Anesthetics with Synthesis & SAR.',
    badge: 'PCI Core BP402T',
    color: 'from-blue-600 to-indigo-700',
    icon: '🧪',
    units: [
      {
        unitNumber: 1,
        title: 'Unit I: Physicochemical Properties & Biological Action',
        keyTopics: ['Ionization & pH', 'Partition Coefficient (Log P)', 'Hydrogen Bonding', 'Protein Binding', 'Bioisosterism'],
        tenMarkQuestion: {
          question: 'Discuss in detail how Physicochemical properties (Ionization, Solubility, Partition Coefficient, and Bioisosterism) govern the biological activity of drugs.',
          answerStructure: [
            '1. Introduction: Physicochemical parameters dictate drug absorption, distribution, receptor binding, and excretion (ADME).',
            '2. Ionization & pH Partition Hypothesis: Only unionized drugs cross biological lipophilic membranes easily. Henderson-Hasselbalch equation governs ratio: pH = pKa + log([Ionized]/[Unionized]) for acids.',
            '3. Partition Coefficient (Log P): Ratio of drug concentration in lipid (octanol) vs water. Optimum Log P is typically 1 to 3 for CNS penetration.',
            '4. Hydrogen Bonding: Intermolecular vs Intramolecular H-bonding affects aqueous solubility and receptor affinity.',
            '5. Bioisosterism: Replacement of atoms/groups with sterically and electronically similar ones (Classical e.g. -F for -H in 5-Fluorouracil, Non-classical e.g. -SO2NH2 for -COOH) to retain or enhance therapeutic effect with lower toxicity.'
          ],
          diagramNotes: 'Sketch Henderson-Hasselbalch graph and octanol-water partition flask representation.',
          gpatTrick: 'Log P > 2 means excellent blood-brain barrier (BBB) crossing for CNS drugs.'
        },
        fiveMarkQuestions: [
          {
            question: 'What is Bioisosterism? Differentiate between Classical and Non-Classical Bioisosteres with suitable examples.',
            answerPoints: [
              'Defined by Langmuir and Grimm: Groups of atoms having similar electronic configuration.',
              'Classical Bioisosteres: Monovalent (-CH3, -NH2, -OH, -F, -Cl), Bivalent (-CH2-, -NH-, -O-, -S-), Trivalent (-CH=, -N=). Example: Procaine and Procainamide.',
              'Non-Classical Bioisosteres: Do not obey valence rules but produce similar steric/electronic properties. Example: Replacement of carboxylic acid (-COOH) with Tetrazole ring in Losartan.'
            ],
            reactionOrStructure: 'R-COOH  ⇄  R-(1H-tetrazol-5-yl)'
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Define Partition Coefficient and write its formula.',
            definition: 'Partition Coefficient (P) is the ratio of equilibrium concentrations of unionized drug in an organic phase (octanol) to that in an aqueous phase: P = [C_octanol] / [C_water].',
            mnemonic: 'P = Oil over Water!'
          },
          {
            question: 'What is meant by Phase-I and Phase-II drug metabolism?',
            definition: 'Phase-I (Functionalization): Introduces polar functional groups (-OH, -NH2, -COOH) via oxidation, reduction, hydrolysis. Phase-II (Conjugation): Attaches endogenous substrates (Glucuronic acid, Sulfate, Glutathione) to make drugs water-soluble for renal excretion.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Which of the following is a classic example of a monovalent bioisosteric replacement used to block metabolic inactivation in anticancer drugs?',
            options: ['Fluorine (-F) replacing Hydrogen (-H) in 5-Fluorouracil', 'Chlorine replacing Bromine', 'Methyl replacing Ethyl', 'Sulfate replacing Phosphate'],
            correctIndex: 0,
            explanation: 'Fluorine has similar van der Waals radius to Hydrogen (1.47 Å vs 1.20 Å) but forms an unbreakable C-F bond that inhibits thymidylate synthase in cancer cells.',
            probability: '🔥 98% GPAT High Frequency'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'Unit II: Drugs Acting on Autonomic Nervous System (Adrenergic Agents)',
        keyTopics: ['Adrenergic Neurotransmission', 'SAR of Beta-phenylethylamines', 'Synthesis of Phenylephrine & Salbutamol', 'Adrenergic Blockers (Propranolol)'],
        tenMarkQuestion: {
          question: 'Classify Sympathomimetic agents with chemical structures. Give the detailed Structure-Activity Relationship (SAR) of Beta-Phenylethylamines and write the chemical synthesis of Salbutamol.',
          answerStructure: [
            '1. Classification: Direct Acting (Epinephrine, Norepinephrine, Phenylephrine, Salbutamol), Indirect Acting (Ephedrine, Amphetamine), Mixed Acting (Pseudoephedrine).',
            '2. SAR of Beta-Phenylethylamines:',
            '   a) Amino Group: Primary or secondary amine is essential. Increasing size of alkyl substituent on Nitrogen shifts activity from Alpha to Beta receptors (N-methyl in Adrenaline = both α & β; N-isopropyl in Isoprenaline = pure β; bulky t-butyl in Salbutamol = selective β2).',
            '   b) Carbon Chain: Two carbons between phenyl ring and amino group gives maximum activity.',
            '   c) Hydroxyl Substitutions on Phenyl Ring: 3,4-dihydroxy (Catechol) gives potent direct agonist action. Replacing 3-OH with -CH2OH (as in Salbutamol) confers resistance to COMT enzyme, prolonging duration of action.',
            '   d) Beta-Hydroxyl Group: (R)-enantiomer has 100-fold higher affinity due to 3-point Easson-Stedman attachment.',
            '3. Synthesis of Salbutamol: From Methyl salicylate by Friedel-Crafts acylation with Chloroacetyl chloride, followed by amination with tert-butylamine and reduction with LiAlH4.'
          ],
          diagramNotes: 'Draw the classic Beta-phenylethylamine core with labels on α-carbon, β-carbon, amino nitrogen, and 3,4-aromatic positions.',
          gpatTrick: 'Bulky N-substituent (t-butyl) = Selective Beta-2 Bronchodilator (Salbutamol)!'
        },
        fiveMarkQuestions: [
          {
            question: 'Write the complete chemical synthesis and medicinal uses of Phenylephrine hydrochloride.',
            answerPoints: [
              'Synthesis: m-Hydroxyacetophenone undergoes alpha-bromination with Bromine to give alpha-bromo-3-hydroxyacetophenone. Reaction with Methylamine yields the methylamino ketone, which on catalytic hydrogenation (H2/Pd-C) gives Phenylephrine.',
              'Medicinal Uses: Selective Alpha-1 adrenergic agonist used as a nasal decongestant, mydriatic agent (eye examination), and vasopressor in hypotension.'
            ],
            reactionOrStructure: 'm-Hydroxyacetophenone + Br2 → α-bromo compound + CH3NH2 → ketone → H2/Pd → Phenylephrine'
          },
          {
            question: 'Give the SAR and synthesis of Propranolol (Non-selective Beta Blocker).',
            answerPoints: [
              'SAR: Aryloxypropanolamine core (-O-CH2-CH(OH)-CH2-NH-). The ether oxygen between aromatic ring and side-chain is crucial for beta-blocking activity. Bulky isopropyl group on amine imparts affinity for beta receptors.',
              'Synthesis: 1-Naphthol is reacted with Epichlorohydrin in alkaline condition to form 1-(naphthalen-1-yloxy)-3-chloropropan-2-ol, which on nucleophilic displacement with Isopropylamine gives Propranolol.',
              'Uses: Hypertension, Angina pectoris, Cardiac arrhythmias, Migraine prophylaxis.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Why is Salbutamol longer-acting than Epinephrine?',
            definition: 'Salbutamol possesses a hydroxymethyl group (-CH2OH) at the 3-position instead of a phenolic hydroxyl, making it resistant to rapid metabolic degradation by Catechol-O-methyltransferase (COMT).',
            mnemonic: 'Salbutamol resists COMT because of its bulky safe coat!'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Which functional group replacement in Salbutamol prevents its rapid degradation by Catechol-O-Methyltransferase (COMT)?',
            options: ['3-Hydroxymethyl group replacing 3-Phenolic OH', 'tert-Butyl group replacing Methyl group', 'Beta-hydroxyl inversion', 'Removal of 4-hydroxyl group'],
            correctIndex: 0,
            explanation: 'COMT specifically transfers a methyl group to the meta-phenolic OH of catecholamines. By substituting it with a -CH2OH group, Salbutamol cannot be recognized by COMT.',
            probability: '🔥 99% GPAT / Drug Inspector Exam Question'
          }
        ]
      },
      {
        unitNumber: 3,
        title: 'Unit III: Cholinergic & Anticholinergic Agents',
        keyTopics: ['Acetylcholine Biosynthesis & Hydrolysis', 'SAR of Parasympathomimetics', 'Reversible vs Irreversible AChE Inhibitors', 'Synthesis of Neostigmine & Dicyclomine'],
        tenMarkQuestion: {
          question: 'Explain the mechanism of Acetylcholinesterase (AChE) enzyme action. Classify Cholinesterase inhibitors with examples. Write the synthesis and mechanism of Neostigmine bromide.',
          answerStructure: [
            '1. AChE Active Site: Composed of Anionic site (Trp84 and Glu199) that binds quaternary nitrogen and Esteratic catalytic triad (Ser200, His440, Glu327) that cleaves ester bond in microseconds.',
            '2. Classification:',
            '   a) Reversible Carbamates: Physostigmine, Neostigmine, Pyridostigmine.',
            '   b) Irreversible Organophosphates: Parathion, Malathion, Echothiophate, Sarin nerve gas (forms covalent phosphate bond with Serine, undergoes aging).',
            '3. Synthesis of Neostigmine:',
            '   Starting Material: 3-Dimethylaminophenol is reacted with Dimethylcarbamoyl chloride in the presence of base to form the carbamate ester. Subsequent quaternization with Methyl bromide yields Neostigmine bromide.',
            '4. Therapeutic Uses: Myasthenia gravis, reversal of non-depolarizing neuromuscular blockade after surgery, paralytic ileus.'
          ],
          diagramNotes: 'Diagram showing Acetylcholine binding to Catalytic triad (Ser-His-Glu) and nucleophilic attack on carbonyl carbon.',
          gpatTrick: 'Pralidoxime (2-PAM) is the cholinesterase reactivator used in organophosphate poisoning BEFORE aging occurs!'
        },
        fiveMarkQuestions: [
          {
            question: 'Give the SAR of Parasympathomimetic agents (Ing’s Five-Atom Rule).',
            answerPoints: [
              'Ing\'s Rule: For maximum muscarinic potency, there should not be more than 5 atoms between the quaternary nitrogen and terminal hydrogen (e.g. N-C-C-O-C-C).',
              'Quaternary Nitrogen: Must possess positive charge. Replacing methyls with ethyls diminishes activity.',
              'Ethylene Bridge: Substitution on alpha-carbon reduces both muscarinic and nicotinic activity. Substitution on beta-carbon (as in Methacholine) retains muscarinic but reduces nicotinic action.',
              'Acyloxy Group: Esters with short acyl groups (acetyl) have high potency; longer chains (propionic, butyric) become antagonists.'
            ]
          },
          {
            question: 'Write the chemical synthesis and uses of Dicyclomine Hydrochloride.',
            answerPoints: [
              'Synthesis: Cyclohexyl phenyl ketone is reduced and cyanated to form 1-cyclohexylcyclohexanecarbonitrile. Alkaline hydrolysis gives 1-cyclohexylcyclohexanecarboxylic acid. Reaction with 2-(diethylamino)ethyl chloride gives Dicyclomine.',
              'Uses: Antispasmodic for Irritable Bowel Syndrome (IBS) and intestinal colic.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'What is the antidote for Organophosphorus pesticide poisoning and why?',
            definition: 'Pralidoxime (2-PAM) combined with Atropine. 2-PAM has a high nucleophilic oxime group that dephosphorylates and regenerates active AChE enzyme before aging occurs.',
            mnemonic: 'PAM unlocks the Serine lock!'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'According to Ing’s five-atom rule for muscarinic agonists, the maximum number of atoms between the quaternary nitrogen and the terminal hydrogen must be:',
            options: ['Five atoms', 'Three atoms', 'Seven atoms', 'Nine atoms'],
            correctIndex: 0,
            explanation: 'HR Ing established in 1949 that optimum fit into the muscarinic receptor pocket requires exactly 5 atoms (N+-C-C-O-C-H) from quaternary nitrogen to the terminal ester methyl.',
            probability: '🔥 96% GPAT / NIPER Probability'
          }
        ]
      },
      {
        unitNumber: 4,
        title: 'Unit IV: Sedatives, Hypnotics & Antipsychotics',
        keyTopics: ['SAR of Barbiturates', 'SAR of Benzodiazepines', 'Synthesis of Diazepam & Barbital', 'Antipsychotic Phenothiazines & Synthesis of Chlorpromazine'],
        tenMarkQuestion: {
          question: 'Classify Sedative and Hypnotic agents. Give the comprehensive SAR of Barbiturates and Benzodiazepines. Write the complete synthesis of Diazepam.',
          answerStructure: [
            '1. Classification: Barbiturates (Long: Phenobarbital, Intermediate: Amobarbital, Ultra-short: Thiopental sodium); Benzodiazepines (Diazepam, Lorazepam, Alprazolam); Non-benzodiazepines / Z-drugs (Zolpidem, Zopiclone).',
            '2. SAR of Barbiturates:',
            '   a) Carbon-5 Substitution: Both hydrogens at C-5 must be replaced by alkyl/aryl groups for hypnotic activity (unsubstituted barbituric acid is inactive due to high acidity and lack of lipid solubility). Total carbons at C-5 should be 6 to 10 for optimum hypnosis.',
            '   b) Branching, unsaturation or cyclic groups at C-5 increase potency and shorten duration of action.',
            '   c) C-2 Oxygen replacement with Sulfur (Thiobarbiturates e.g. Thiopental) results in rapid onset and ultra-short duration due to high lipophilicity and rapid redistribution.',
            '   d) N-alkylation (e.g. Hexobarbital) shortens duration of action.',
            '3. SAR of Benzodiazepines (1,4-Benzodiazepine nucleus):',
            '   a) Ring A: Electron-withdrawing group at position 7 (-Cl in Diazepam, -NO2 in Nitrazepam) dramatically increases potency.',
            '   b) Ring B: Position 1 substitution with small alkyl (-CH3) is optimal. Carbonyl at C-2 and N at C-4 are essential for GABA_A binding.',
            '   c) Ring C (5-Phenyl): Ortho-substitution with -F or -Cl (as in Clonazepam, Flunitrazepam) increases activity.',
            '4. Synthesis of Diazepam: 2-Methylamino-5-chlorobenzophenone reacts with Ethyl glycinate hydrochloride in pyridine to afford Diazepam.'
          ],
          diagramNotes: 'Draw Barbituric acid and 1,4-Benzodiazepine numbering system with arrows pointing to C-5, C-7, N-1, and C-2 positions.',
          gpatTrick: 'C-7 Electronegative group (-Cl, -NO2) is the golden rule for Benzodiazepine potency!'
        },
        fiveMarkQuestions: [
          {
            question: 'Explain the SAR of Phenothiazine antipsychotics and write the synthesis of Chlorpromazine hydrochloride.',
            answerPoints: [
              'SAR: 1) Three-carbon propylene bridge between ring nitrogen (N10) and amino nitrogen is mandatory for antipsychotic activity (2-carbon bridge gives antihistaminic activity as in Promethazine). 2) Substitution at C-2 with electron-withdrawing group (-Cl, -CF3) creates asymmetry and enhances D2 dopamine receptor antagonism. 3) Tertiary amine (dimethylamino or piperazine) is required.',
              'Synthesis: 2-Chlorophenothiazine is condensed with 3-dimethylaminopropyl chloride in the presence of sodamide (NaNH2) in toluene to yield Chlorpromazine.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Why does replacement of C-2 Oxygen with Sulfur in Barbiturates produce ultra-short action?',
            definition: 'Thiobarbiturates (like Thiopental) have extremely high lipid solubility, allowing almost instantaneous penetration into the brain followed by rapid redistribution into muscle and adipose tissue, terminating CNS depression within 10-15 minutes.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'In 1,4-Benzodiazepine drugs (e.g. Diazepam), which position on Ring A is most critical for high anxiolytic/sedative activity when substituted with an electron-withdrawing group like Chlorine or Nitro?',
            options: ['Position 7', 'Position 6', 'Position 8', 'Position 9'],
            correctIndex: 0,
            explanation: 'Position 7 substitution with electronegative groups (-Cl in Diazepam, -NO2 in Nitrazepam) is strictly required for optimal electrostatic interaction with the GABA_A receptor alpha-gamma interface.',
            probability: '🔥 99% GPAT Classic Trap'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 2. PHYSICAL PHARMACEUTICS - II (BP403T)
  // =========================================================================
  {
    id: 'physpharm-2',
    code: 'BP403T',
    name: 'Physical Pharmaceutics - II',
    hindiName: 'भौतिक फार्मास्यूटिक्स - 2 (कोलॉइड, रियोलॉजी व माइक्रोमेरिटिक्स)',
    shortDesc: 'Colloidal Dispersions & DLVO theory, Rheology & Thixotropy, Deformation of Solids, Suspensions, Emulsions stability, Micromeritics & Powder Flow.',
    badge: 'PCI Core BP403T',
    color: 'from-emerald-600 to-teal-700',
    icon: '⚗️',
    units: [
      {
        unitNumber: 1,
        title: 'Unit I: Colloidal Dispersions & Interface Phenomenon',
        keyTopics: ['Lyophilic, Lyophobic & Association Colloids', 'Tyndall Effect & Brownian Motion', 'Zeta Potential & DLVO Theory', 'Donnan Membrane Equilibrium'],
        tenMarkQuestion: {
          question: 'Classify Colloidal Dispersions with comparative characteristics. Explain the Electrical Double Layer and DLVO Theory of colloidal stability in detail with energy curve diagram.',
          answerStructure: [
            '1. Classification: Lyophilic (solvent-loving, spontaneous formation, thermodynamically stable, reversible, e.g. Acacia, Gelatin); Lyophobic (solvent-hating, requires energy, thermodynamically unstable, irreversible, e.g. Gold sol, Silver sol); Association / Amphiphilic (micelles formed above Critical Micelle Concentration CMC, e.g. Polysorbates, SDS).',
            '2. Electrical Double Layer (Stern-Gouy-Chapman Model):',
            '   - Fixed Layer (Stern layer): Firmly attached counter-ions immediately surrounding charged particle.',
            '   - Diffuse Layer (Gouy-Chapman): Loosely held counter-ions that extend into bulk medium.',
            '   - Zeta Potential (ζ): The electrokinetic potential at the shear plane (slipping plane). A Zeta potential > +30 mV or < -30 mV ensures strong electrostatic repulsion and prevents coagulation.',
            '3. DLVO Theory (Derjaguin, Landau, Verwey, Overbeek):',
            '   - Total Interaction Energy: V_total = V_repulsion + V_attraction.',
            '   - V_A arises from London-van der Waals attractive forces.',
            '   - V_R arises from overlapping electrical double layers.',
            '   - Primary Minimum: Deep attraction well causing irreversible coagulation/caking.',
            '   - Secondary Minimum: Shallow attraction well at larger separation distance causing loose, easily reversible flocculation (ideal for pharmaceutical suspensions!).',
            '   - Primary Energy Barrier: Height of maximum repulsion that prevents particles from falling into the primary minimum.'
          ],
          diagramNotes: 'Draw DLVO potential energy curve showing Primary Minimum, Primary Maximum Barrier, Secondary Minimum, and Net Energy curve vs separation distance H.',
          gpatTrick: 'Suspensions must be formulated at the SECONDARY MINIMUM of the DLVO curve to ensure redispersion upon shaking!'
        },
        fiveMarkQuestions: [
          {
            question: 'What is Critical Micelle Concentration (CMC) and how is it determined using physical properties?',
            answerPoints: [
              'CMC is the specific concentration of surfactant at which amphiphilic monomers begin self-assembling into spherical or laminar aggregates (micelles).',
              'Determination: Marked inflection point occurs in physical property graphs plotted against concentration:',
              '1) Surface Tension: Decreases steadily and becomes flat at CMC.',
              '2) Equivalent Conductivity: Drops sharply due to lower mobility of large micelles.',
              '3) Osmotic Pressure: Rate of increase slows down.',
              '4) Light Scattering: Increases sharply above CMC.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Define Zeta Potential and write its significance in dosage forms.',
            definition: 'Zeta Potential is the electrical potential difference between the shear plane of a moving colloidal particle and the electroneutral bulk liquid. If |ζ| > 30 mV, electrostatic repulsion prevents aggregation, ensuring physical stability.'
          },
          {
            question: 'What is Tyndall effect and Brownian motion?',
            definition: 'Tyndall effect is the scattering of visible light by colloidal particles when a beam passes through the sol. Brownian motion is the continuous zig-zag random motion of particles caused by bombardment of solvent molecules, preventing sedimentation.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'In the DLVO theory of colloidal stability, stable pharmaceutical suspensions are preferably formulated at which energy region to allow easy re-dispersion upon shaking?',
            options: ['Secondary Minimum', 'Primary Minimum', 'Primary Maximum', 'Zero potential axis'],
            correctIndex: 0,
            explanation: 'The secondary minimum represents a shallow attraction well (about 5-10 kT) at longer interparticle distances, producing loose, fluffy flocs that do not cake and are easily redispersed.',
            probability: '🔥 99% GPAT Guaranteed Question'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'Unit II: Rheology & Thixotropy',
        keyTopics: ['Newtonian vs Non-Newtonian Systems', 'Plastic, Pseudoplastic & Dilatant Flow', 'Thixotropy & Hysteresis Loop', 'Brookfield & Cup-and-Bob Viscometers'],
        tenMarkQuestion: {
          question: 'Classify Non-Newtonian systems of flow with Rheograms (Shear stress vs Rate of shear). Explain the phenomenon of Thixotropy, its pharmaceutical significance, and measurement using Hysteresis loop.',
          answerStructure: [
            '1. Introduction: Rheology is the study of flow and deformation of matter under applied stress. Non-Newtonian systems do not obey Newton’s law of viscosity (viscosity changes with shear rate).',
            '2. Non-Newtonian Types:',
            '   a) Plastic Flow (Bingham Bodies): Curve does not pass through origin; requires a minimum yield value (f) before flow begins. Slope gives mobility (1/U). Example: Toothpaste, Zinc oxide paste.',
            '   b) Pseudoplastic Flow (Shear-Thinning): Viscosity decreases with increasing shear rate. Polymers untangle and align with streamlines. Example: Tragacanth, Sodium CMC, Methylcellulose solutions.',
            '   c) Dilatant Flow (Shear-Thickening): Viscosity increases with shear rate. Close-packed particles with low void volume expand under shear and become dry/viscous. Example: Deflocculated suspensions with >50% solid content.',
            '3. Thixotropy:',
            '   - Defined as an isothermal and comparatively slow recovery on standing of a consistency lost through shearing.',
            '   - Breakdown of gel network into sol on agitation, followed by slow sol-to-gel rebuilding at rest.',
            '   - Measured by Hysteresis Loop area between up-curve and down-curve on a rotational rheometer.',
            '4. Pharmaceutical Importance: Parenteral depot suspensions (easy injection through fine syringe needle, immediate thick depot in muscle to slow drug release); Lotions and paints (easy spreading without dripping).'
          ],
          diagramNotes: 'Draw the 4 Rheograms side by side: Newtonian (straight line from origin), Plastic (intercept at yield value f), Pseudoplastic (curve bending towards shear rate axis), Dilatant (curve bending towards shear stress axis).',
          gpatTrick: 'Shear-Thinning = Pseudoplastic (Polymer solutions); Shear-Thickening = Dilatant (High-solid suspensions).'
        },
        fiveMarkQuestions: [
          {
            question: 'Differentiate between Flocculated and Deflocculated Suspensions with parameters.',
            answerPoints: [
              'Flocculated: Loose aggregates (flocs) formed at secondary minimum; high sedimentation rate; sediment is loose and does not form cake; easily redispersible; clear supernatant liquid; attractive appearance is less elegant.',
              'Deflocculated: Individual separate particles; very slow sedimentation; forms hard, irreversible cement-like cake (caking) over time; very difficult to redisperse; cloudy supernatant liquid.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'What is Yield Value in Bingham plastic flow?',
            definition: 'Yield Value (f) is the minimum shear stress that must be applied to a plastic material to overcome internal friction and initiate flow.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Which of the following pharmaceutical fluids exhibits Pseudoplastic (Shear-Thinning) flow behavior?',
            options: ['Aqueous solutions of natural gums like Tragacanth and Sodium CMC', 'Concentrated corn starch in water (50% w/w)', 'Water and simple syrup IP', 'Toothpaste and concentrated flocculated pastes'],
            correctIndex: 0,
            explanation: 'Polymer solutions (Sodium CMC, Methylcellulose, Tragacanth) exhibit pseudoplastic flow because random coiled macromolecular chains untangle and orient in the direction of shear as shear rate increases.',
            probability: '🔥 97% GPAT Frequent MCQ'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 3. PHARMACOLOGY - I (BP404T)
  // =========================================================================
  {
    id: 'pharmacol-1',
    code: 'BP404T',
    name: 'Pharmacology - I',
    hindiName: 'फार्माकोलॉजी - 1 (फार्माकोकाइनेटिक्स, रिसेप्टर्स व ANS ड्रग्स)',
    shortDesc: 'Pharmacokinetics (ADME), Pharmacodynamics & Receptor Signaling (GPCR), Neurotransmission in ANS, Glaucoma Drugs, Central Nervous System pharmacology.',
    badge: 'PCI Core BP404T',
    color: 'from-rose-600 to-red-700',
    icon: '💊',
    units: [
      {
        unitNumber: 1,
        title: 'Unit I: General Pharmacology - Pharmacokinetics (ADME)',
        keyTopics: ['Mechanisms of Drug Absorption & Bioavailability', 'Apparent Volume of Distribution (Vd)', 'Biotransformation Phase-I & Phase-II CYP450', 'Renal Excretion & Half-life (t1/2)'],
        tenMarkQuestion: {
          question: 'Define Pharmacokinetics. Explain in detail the mechanisms of Drug Absorption and Biotransformation (Phase I and Phase II metabolic reactions with enzyme systems).',
          answerStructure: [
            '1. Definition: What the body does to the drug — encompasses Absorption, Distribution, Metabolism, and Excretion (ADME).',
            '2. Drug Absorption Mechanisms:',
            '   a) Passive Diffusion: Non-ionic, down concentration gradient, Fick’s Law: Rate = (D × A × K / h) × (C1 - C2).',
            '   b) Carrier-Mediated Transport: Facilitated diffusion (no ATP, saturable) and Active transport (against gradient, requires ATP, e.g. P-glycoprotein, Levodopa via amino acid carrier).',
            '   c) Pinocytosis / Endocytosis: Macromolecules (Insulin, Vitamin B12-intrinsic factor complex).',
            '3. Bioavailability (F): Fraction of administered dose that reaches systemic circulation unchanged. F = (AUC_oral / AUC_IV) × (Dose_IV / Dose_oral).',
            '4. Biotransformation (Drug Metabolism):',
            '   - Primary Organ: Liver (smooth endoplasmic reticulum containing Cytochrome P450 monooxygenases).',
            '   - Phase I (Non-synthetic / Functionalization): Oxidation (CYP3A4, CYP2D6), Reduction, Hydrolysis. Makes drug slightly polar or unmasks functional group.',
            '   - Phase II (Synthetic / Conjugation): Glucuronidation (UDP-glucuronosyltransferase, most common), Sulfation, Acetylation, Glutathione conjugation (detoxifies toxic NAPQI metabolite of Paracetamol!).'
          ],
          diagramNotes: 'Draw hepatic lobule / ER membrane diagram showing CYP450 catalytic cycle with NADPH-CYP450 reductase.',
          gpatTrick: 'CYP3A4 metabolizes >50% of all clinical drugs; Grapefruit juice inhibits CYP3A4!'
        },
        fiveMarkQuestions: [
          {
            question: 'What is Volume of Distribution (Vd) and its clinical significance?',
            answerPoints: [
              'Defined as the hypothetical volume of fluid into which the total amount of drug would need to be dissolved to give the same concentration as that in blood plasma.',
              'Formula: Vd = Total amount of drug in body (Dose) / Plasma concentration (Cp).',
              'Significance: High Vd (>100 L, e.g. Chloroquine, Digoxin) indicates high tissue and lipid binding; Low Vd (<5 L, e.g. Warfarin, Heparin) indicates drug is confined to plasma volume.',
              'Used to calculate Loading Dose: Loading Dose = Vd × Target Cp.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Define First-Pass (Presystemic) Metabolism with examples.',
            definition: 'First-Pass metabolism is the extensive degradation of an orally administered drug by gut enzymes or liver before it reaches systemic circulation. Examples: Glyceryl trinitrate (GTN, 100% first-pass, hence given sublingually), Propranolol, Lidocaine.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Which Phase-II conjugation pathway is most commonly responsible for detoxifying the hepatotoxic metabolite NAPQI produced during Paracetamol (Acetaminophen) overdose?',
            options: ['Glutathione (GSH) Conjugation', 'Glucuronide Conjugation', 'Acetylation by NAT-2', 'Sulfate Conjugation'],
            correctIndex: 0,
            explanation: 'Toxic NAPQI is neutralized by endogenous hepatic Glutathione (GSH). When GSH stores are depleted (>70%), NAPQI binds covalently to hepatic macromolecules causing centrilobular necrosis. N-acetylcysteine (NAC) acts as the specific antidote by replenishing GSH.',
            probability: '🔥 99% GPAT & Clinical Pharmacology Must-Know'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'Unit II: Pharmacodynamics & Receptor Signaling',
        keyTopics: ['Receptor Types (GPCR, Ion-channel, Kinase, Nuclear)', 'Dose-Response Relationships', 'Therapeutic Index & Margin of Safety', 'Agonist, Antagonist & Allosteric Modulators'],
        tenMarkQuestion: {
          question: 'Classify Pharmacological Receptors with signal transduction mechanisms. Explain G-Protein Coupled Receptors (GPCR) and the Second Messenger systems (cAMP and IP3/DAG pathways) in detail.',
          answerStructure: [
            '1. Four Superfamilies of Receptors:',
            '   a) Ligand-Gated Ion Channels (Ionotropic): Milliseconds, e.g. Nicotinic ACh, GABA_A, Glycine.',
            '   b) G-Protein Coupled Receptors (Metabotropic / Heptahelical): Seconds, e.g. Muscarinic, Adrenergic, Opioid.',
            '   c) Kinase-Linked (Enzyme-linked): Minutes to hours, e.g. Insulin, Growth hormone.',
            '   d) Nuclear / Intracellular Receptors: Hours to days, e.g. Steroids (Estrogen, Glucocorticoid), Thyroid hormone.',
            '2. GPCR Molecular Architecture: 7-transmembrane spanning alpha-helices with extracellular N-terminus and intracellular C-terminus coupled to a heterotrimeric G-protein (Gα, Gβ, Gγ).',
            '3. Effector Pathways:',
            '   a) Adenylyl Cyclase Pathway: Gs stimulates AC → converts ATP to cyclic AMP (cAMP) → activates Protein Kinase A (PKA). Gi inhibits AC.',
            '   b) Phospholipase C (PLC) Pathway: Gq activates PLC-beta → cleaves PIP2 into Inositol 1,4,5-trisphosphate (IP3) and Diacylglycerol (DAG). IP3 releases Ca2+ from ER; DAG + Ca2+ activate Protein Kinase C (PKC).',
            '4. Therapeutic Index (TI): Ratio of TD50 (median toxic dose) to ED50 (median effective dose). TI = TD50 / ED50. Drugs with narrow TI (Warfarin, Digoxin, Lithium, Theophylline) require Therapeutic Drug Monitoring (TDM).'
          ],
          diagramNotes: 'Draw 7-transmembrane serpentine GPCR spanning the phospholipid bilayer with G-protein subunits and IP3/DAG cascades.',
          gpatTrick: 'Gs = Stimulates cAMP; Gi = Inhibits cAMP; Gq = Increases IP3 & DAG (G-Q-I-P-3)!'
        },
        fiveMarkQuestions: [
          {
            question: 'Differentiate between Competitive and Non-Competitive Antagonism with Dose-Response Curves.',
            answerPoints: [
              'Competitive Antagonism: Antagonist binds reversibly to the same agonist receptor site; increases ED50 without decreasing maximum efficacy (E_max); causes parallel rightward shift of DRC; overcome by increasing agonist concentration.',
              'Non-Competitive Antagonism: Antagonist binds irreversibly to active site or allosteric site; reduces maximum response (E_max) without necessarily shifting ED50; cannot be overcome by adding more agonist; downward shift of DRC.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Define Therapeutic Index (TI) and name two drugs with a narrow therapeutic index.',
            definition: 'Therapeutic Index (TI) = TD50 / ED50. It measures the safety margin of a drug. Narrow TI drugs: Digoxin, Lithium, Warfarin, Phenytoin.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Which of the following receptor types is located inside the nucleus or cytoplasm and directly regulates gene transcription with the slowest onset of action (hours to days)?',
            options: ['Nuclear / Steroid hormone receptors', 'G-Protein Coupled Receptors (GPCR)', 'Ligand-Gated Ion Channel (GABA_A)', 'Tyrosine Kinase Receptors (Insulin)'],
            correctIndex: 0,
            explanation: 'Nuclear receptors (Glucocorticoids, Estrogens, Thyroid hormones) reside inside the cell. Upon ligand binding, the complex dimerizes, translocates to nucleus, binds Hormone Response Elements (HRE) on DNA, and alters mRNA transcription.',
            probability: '🔥 98% GPAT Receptor Question'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 4. PHARMACOGNOSY & PHYTOCHEMISTRY - I (BP405T)
  // =========================================================================
  {
    id: 'pharmacog-1',
    code: 'BP405T',
    name: 'Pharmacognosy & Phytochemistry - I',
    hindiName: 'फार्माकोग्नोसी व फाइटोकेमिस्ट्री - 1 (पादप ऊतक संवर्धन, अल्कलॉइड्स व ग्लाइकोसाइड्स)',
    shortDesc: 'Classification of Crude Drugs, Plant Tissue Culture, Secondary Metabolites Pathways (Shikimic & Mevalonic), Chemical Identification Tests of Alkaloids, Glycosides, Tannins, Flavonoids.',
    badge: 'PCI Core BP405T',
    color: 'from-amber-600 to-yellow-700',
    icon: '🌿',
    units: [
      {
        unitNumber: 1,
        title: 'Unit I & II: Classification, Adulteration & Plant Tissue Culture',
        keyTopics: ['Morphological vs Pharmacological Classification', 'Types of Adulteration in Crude Drugs', 'Plant Tissue Culture Media (MS Media)', 'Callus & Suspension Cultures'],
        tenMarkQuestion: {
          question: 'Explain the Historical development, nutritional requirements, and types of Plant Tissue Culture (Callus, Suspension, and Protoplast). Discuss its applications in the production of high-value Secondary Metabolites.',
          answerStructure: [
            '1. Introduction: Concept of Totipotency (Gottlieb Haberlandt, 1902) — every plant cell possesses the complete genetic information required to regenerate into a whole plant.',
            '2. Nutritional Media Requirements: Murashige and Skoog (MS) medium is standard: Macronutrients (N, P, K, Ca, Mg, S), Micronutrients (Fe-EDTA, Mn, Zn, B, Cu, Mo), Carbon source (3% Sucrose), Vitamins (Thiamine, Inositol), Gelling agent (0.8% Agar), and Phytohormones (Auxins e.g. 2,4-D, NAA for callus/rooting; Cytokinins e.g. Kinetin, BAP for shoot proliferation).',
            '3. Types of Culture:',
            '   a) Callus Culture: Undifferentiated, unorganized proliferating cell mass grown on solid agar.',
            '   b) Suspension Culture: Agitated liquid media with solitary cells or small aggregates; faster growth; ideal for industrial bioreactors.',
            '   c) Protoplast Culture: Enzymatic digestion of cell wall (Cellulase + Pectinase) followed by somatic hybridization (PEG mediated fusion).',
            '4. Applications in Pharmacy: Large-scale production of Shikonin (from Lithospermum erythrorhizon), Taxol / Paclitaxel (Taxus brevifolia), Digoxin (Digitalis lanata), and Artemisinin (Artemisia annua).'
          ],
          diagramNotes: 'Flowchart of Plant Tissue Culture: Explant selection → Sterilization → Callus induction → Bioreactor → Secondary metabolite harvesting.',
          gpatTrick: 'Auxin/Cytokinin ratio: High Auxin = Rooting; High Cytokinin = Shooting; Balanced = Callus!'
        },
        fiveMarkQuestions: [
          {
            question: 'What is Adulteration? Describe different types of adulteration practiced in crude drugs with examples.',
            answerPoints: [
              'Adulteration is the debasement of an article by adding foreign or inferior substances or removing vital constituents.',
              '1) Substitution with Inferior commercial varieties: Mangosteen bark for Cinchona; Arabian senna for Alexandrian senna.',
              '2) Substitution with Exhausted drugs: Exhausted clove or ginger colored with artificial dyes.',
              '3) Substitution with Artificially manufactured materials: Artificial invert sugar added to natural honey; Paraffin wax colored yellow to fake beeswax.',
              '4) Presence of Toxic materials: Strychnos nux-blanda seeds for Strychnos nux-vomica.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Define Totipotency.',
            definition: 'Totipotency is the inherent genetic potential of a single plant cell to divide, differentiate, and regenerate into a complete, fertile adult plant under sterile in vitro conditions.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'In plant tissue culture, what physiological effect is observed when the nutrient medium contains a high Cytokinin to Auxin ratio?',
            options: ['Induction of Shoot proliferation', 'Induction of Root development', 'Suppression of all growth', 'Formation of pure unorganized callus only'],
            correctIndex: 0,
            explanation: 'Skoog and Miller demonstrated that organogenesis is controlled by the auxin/cytokinin ratio: High Cytokinin/Auxin triggers shoot differentiation; High Auxin/Cytokinin triggers root differentiation; intermediate concentrations favor unorganized callus.',
            probability: '🔥 97% GPAT Plant Tissue Culture Rule'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'Unit IV & V: Secondary Metabolites & Phytochemical Tests',
        keyTopics: ['Shikimic Acid Pathway vs Mevalonic Pathway', 'Alkaloids (Mayer, Dragendorff, Wagner, Hager)', 'Glycosides (Keller-Kiliani, Borntrager)', 'Tannins & Flavonoids Chemical Tests'],
        tenMarkQuestion: {
          question: 'Classify Secondary Metabolites. Outline the Shikimic Acid pathway for the biosynthesis of aromatic amino acids. Provide the definitive qualitative chemical tests for Alkaloids, Cardiac Glycosides, and Tannins.',
          answerStructure: [
            '1. Introduction: Secondary metabolites are non-essential for primary vegetative growth but confer survival, defense against herbivores, and medicinal value.',
            '2. Shikimic Acid Pathway: Phosphoenolpyruvate (PEP from glycolysis) + Erythrose-4-phosphate (E4P from pentose phosphate pathway) → DAHP → 3-Dehydroquinic acid → Shikimic acid → Chorismic acid → Prephenic acid → Phenylalanine, Tyrosine, and Tryptophan (precursors of Tropane, Indole, and Isoquinoline alkaloids!).',
            '3. Qualitative Chemical Tests for Identification:',
            '   a) Alkaloids Identification Tests:',
            '      - Mayer’s Reagent (Potassium Mercuric Iodide): Creamy white precipitate.',
            '      - Dragendorff’s Reagent (Potassium Bismuth Iodide): Orange-brown / reddish-brown precipitate.',
            '      - Wagner’s Reagent (Iodine in Potassium Iodide): Reddish-brown precipitate.',
            '      - Hager’s Reagent (Saturated Picric Acid solution): Bright yellow crystalline precipitate.',
            '   b) Cardiac Glycosides Tests:',
            '      - Keller-Kiliani Test (for 2-deoxysugars like Digitoxose): Glacial acetic acid + trace FeCl3 + conc. H2SO4 forms reddish-brown layer at junction and bluish-green upper acetic layer.',
            '      - Legal Test (pyridine + sodium nitroprusside + NaOH): Deep red / pink color.',
            '   c) Tannins Tests:',
            '      - Ferric Chloride (FeCl3): Blue-black color (Hydrolyzable tannins / Gallotannins) or Greenish-brown color (Condensed tannins / Catechols).',
            '      - Goldbeater’s Skin Test: Positive (deep brown/black stain on untanned animal skin).'
          ],
          diagramNotes: 'Summary table of Reagents and Precipitate colors for Alkaloids and Glycosides.',
          gpatTrick: 'Mayer = Cream; Dragendorff = Orange; Wagner = Brown; Hager = Yellow!'
        },
        fiveMarkQuestions: [
          {
            question: 'What is Borntrager’s and Modified Borntrager’s test and for which phytochemicals are they used?',
            answerPoints: [
              'Borntrager\'s Test: For free Anthraquinone glycosides (Senna, Rhubarb, Cascara). Drug powder boiled with dilute H2SO4, filtered, extracted with ether or benzene, and shaken with dilute ammonia. Rose-pink to cherry-red color in ammoniacal layer indicates anthraquinones.',
              'Modified Borntrager\'s Test: For Anthrone/C-glycosides (Aloin in Aloe). Uses FeCl3 + HCl to oxidize C-C glycosidic bonds prior to ether extraction and ammonia addition.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Name the 4 classical Alkaloidal precipitating reagents and their chemical names.',
            definition: '1) Mayer’s (Potassium mercuric iodide), 2) Dragendorff’s (Potassium bismuth iodide), 3) Wagner’s (Iodine in potassium iodide), 4) Hager’s (Saturated picric acid).'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Which chemical reagent produces an intense orange-reddish precipitate when added to an acidified solution containing alkaloids?',
            options: ['Dragendorff’s Reagent (Potassium Bismuth Iodide)', 'Mayer’s Reagent', 'Hager’s Reagent', 'Fehling’s Reagent'],
            correctIndex: 0,
            explanation: 'Dragendorff\'s reagent (Potassium bismuth iodide, K[BiI4]) yields an orange to reddish-brown precipitate with alkaloids due to coordination complex formation.',
            probability: '🔥 99% GPAT Pharmacognosy Guaranteed MCQ'
          }
        ]
      }
    ]
  },

  // =========================================================================
  // 5. PHARMACEUTICAL ORGANIC CHEMISTRY - III (BP401T)
  // =========================================================================
  {
    id: 'poc-3',
    code: 'BP401T',
    name: 'Pharmaceutical Organic Chemistry - III',
    hindiName: 'फार्मास्युटिकल कार्बनिक रसायन - 3 (स्टीरियोकेमिस्ट्री व हेट्रोसाइक्लिक)',
    shortDesc: 'Stereoisomerism (Enantiomers, Diastereomers, R/S Cahn-Ingold-Prelog), Geometrical Isomerism, Heterocyclic Compounds (Pyrrole, Furan, Thiophene, Pyridine, Quinoline), Named Rearrangements.',
    badge: 'PCI Core BP401T',
    color: 'from-purple-700 to-indigo-800',
    icon: '🔬',
    units: [
      {
        unitNumber: 1,
        title: 'Unit I & II: Stereoisomerism & Conformation',
        keyTopics: ['Optical Activity & Enantiomers vs Diastereomers', 'Meso Compounds & Racemic Mixtures', 'R/S Sequence Rules (CIP System)', 'Conformational Analysis of Cyclohexane'],
        tenMarkQuestion: {
          question: 'Explain Optical Isomerism. Differentiate between Enantiomers and Diastereomers with examples. Discuss the Cahn-Ingold-Prelog (CIP) priority rules for assigning (R) and (S) configurations.',
          answerStructure: [
            '1. Definitions: Chiral Center (asymmetric carbon bonded to 4 different groups); Optical Activity (ability to rotate plane-polarized light, measured by polarimeter; dextrorotatory (+) or levorotatory (-)).',
            '2. Enantiomers vs Diastereomers:',
            '   - Enantiomers: Non-superimposable mirror images; identical physical properties (MP, BP, solubility, refractive index) except direction of optical rotation; react at identical rates with achiral reagents but different rates with chiral biological receptors (e.g. S-Thalidomide is teratogenic while R-Thalidomide is sedative).',
            '   - Diastereomers: Stereoisomers that are NOT mirror images (e.g. cis/trans or molecules with >1 chiral center where some but not all invert); different physical and chemical properties.',
            '   - Meso Compounds: Contain chiral centers but possess an internal plane of symmetry (plane of symmetry σ or center of inversion i), rendering them optically inactive due to internal compensation (e.g. Meso-tartaric acid).',
            '3. CIP Sequence Rules for (R) and (S):',
            '   - Rule 1: Priority assigned based on atomic number of atom directly attached to stereocenter (I > Br > Cl > S > P > F > O > N > C > H).',
            '   - Rule 2: If there is a tie, compare atoms at the second point of difference.',
            '   - Rule 3: Multiple bonds treated as duplicate/triplicate bonds (e.g. -CH=O treated as C bonded to two oxygens).',
            '   - Viewing Rule: Position lowest priority group (Priority 4, usually -H) pointing away from observer (dashed wedge). Trace priorities 1 → 2 → 3: Clockwise = (R) Rectus; Counter-clockwise = (S) Sinister.'
          ],
          diagramNotes: 'Draw Tartaric acid stereoisomers: (2R,3R)-(+)-tartaric acid, (2S,3S)-(-)-tartaric acid, and Meso-tartaric acid with dashed internal symmetry plane.',
          gpatTrick: 'If priority 4 is on horizontal bond in Fischer projection: Clockwise = S, Counter-clockwise = R (Reverse the apparent answer)!'
        },
        fiveMarkQuestions: [
          {
            question: 'Draw and explain the conformational energy diagram of Cyclohexane (Chair, Boat, Twist-Boat, Half-Chair).',
            answerPoints: [
              'Cyclohexane is non-planar to relieve Baeyer angle strain (tetrahedral 109.5° angle).',
              'Conformations in order of stability (lowest to highest energy): Chair (0 kJ/mol, all C-H staggered, zero torsional strain) > Twist-Boat (23 kJ/mol) > Boat (27 kJ/mol, eclipsed C-H bonds + flagpole interactions at C1-C4) > Half-Chair (45 kJ/mol, highest transition state).',
              'Chair conformation has 6 axial (vertical) and 6 equatorial (equator-like) bonds.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'What is a Racemic Mixture and why is it optically inactive?',
            definition: 'A racemic mixture (or racemate, [±]) contains an equimolar (50:50) mixture of two enantiomers. It is optically inactive due to external compensation, where the clockwise rotation of one enantiomer is cancelled by the equal counter-clockwise rotation of the other.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'Why is Meso-tartaric acid optically inactive even though it possesses two chiral (asymmetric) carbon atoms?',
            options: ['Due to internal compensation caused by a plane of symmetry', 'Due to external compensation of enantiomers', 'Due to high molecular weight', 'Because it racemizes instantly at room temperature'],
            correctIndex: 0,
            explanation: 'Meso-tartaric acid has an internal plane of symmetry that bisects the molecule. The optical rotation generated by the top half is exactly cancelled by the equal and opposite rotation of the bottom half (internal compensation).',
            probability: '🔥 99% GPAT Chemistry Classic'
          }
        ]
      },
      {
        unitNumber: 2,
        title: 'Unit III & IV: Heterocyclic Chemistry (Pyrrole, Furan, Thiophene, Pyridine, Quinoline)',
        keyTopics: ['Aromaticity of 5-Membered Rings', 'Electrophilic Substitution at Position 2 vs 3', 'Pyridine Basicity vs Pyrrole', 'Skraup Synthesis of Quinoline'],
        tenMarkQuestion: {
          question: 'Compare the aromaticity and reactivity of Pyrrole, Furan, and Thiophene towards electrophilic substitution. Why does electrophilic substitution occur predominantly at Position 2? Write the chemical synthesis of Pyrrole (Paal-Knorr synthesis).',
          answerStructure: [
            '1. Aromatic Sextet: All three possess 6 pi-electrons (4 from two double bonds + 2 from the lone pair of heteroatom N, O, or S in sp2 orbital) satisfying Huckel’s rule (4n+2 where n=1).',
            '2. Relative Aromaticity Order: Benzene > Thiophene > Pyrrole > Furan.',
            '   - Thiophene is most aromatic of the three because Sulfur 3p-2p orbital overlap allows sulfur d-orbital participation and has low electronegativity (2.5).',
            '   - Furan is least aromatic because Oxygen is highly electronegative (3.5) and tenaciously holds its lone pair.',
            '3. Reactivity towards Electrophilic Substitution: Pyrrole > Furan > Thiophene > Benzene (all are electron-rich / pi-excessive).',
            '4. Orientation of Attack (Position 2 vs Position 3):',
            '   - Attack at Position 2 yields three resonance stabilizing structures for the carbocation intermediate.',
            '   - Attack at Position 3 yields only two resonance stabilizing structures.',
            '   - Hence, attack at Position 2 proceeds through a lower transition energy state and is strongly preferred.',
            '5. Paal-Knorr Synthesis: 1,4-Dicarbonyl compound (e.g. Hexane-2,5-dione) heated with Ammonia or primary amines yields substituted Pyrrole via double enamine cyclization.'
          ],
          diagramNotes: 'Draw the 3 resonance structures for C-2 attack vs 2 resonance structures for C-3 attack.',
          gpatTrick: 'Basicity: Pyridine is basic (pKa 5.2, lone pair in sp2 not in ring) but Pyrrole is NOT basic (lone pair part of aromatic sextet)!'
        },
        fiveMarkQuestions: [
          {
            question: 'Explain Skraup Synthesis of Quinoline with mechanism.',
            answerPoints: [
              'Reactants: Aniline, Glycerol, concentrated Sulfuric acid, and an oxidizing agent (Nitrobenzene or Ferrous sulfate).',
              'Mechanism steps:',
              '1) Dehydration of glycerol by hot H2SO4 to form Acrolein (CH2=CH-CHO).',
              '2) Michael 1,4-nucleophilic addition of Aniline to Acrolein.',
              '3) Acid-catalyzed electrophilic cyclization onto the benzene ring to yield 1,2-dihydroquinoline.',
              '4) Oxidation of dihydroquinoline by Nitrobenzene to form Quinoline.'
            ]
          }
        ],
        twoMarkQuestions: [
          {
            question: 'Why is Pyridine far more basic than Pyrrole?',
            definition: 'In Pyridine, the lone pair on Nitrogen occupies an sp2 hybrid orbital outside the aromatic ring and is readily available for protonation. In Pyrrole, Nitrogen’s lone pair is part of the aromatic 6 pi-electron sextet; protonation destroys aromaticity.'
          }
        ],
        gpatProbabilityMcqs: [
          {
            question: 'What is the correct decreasing order of aromaticity among the following five-membered heterocyclic compounds?',
            options: ['Thiophene > Pyrrole > Furan', 'Furan > Pyrrole > Thiophene', 'Pyrrole > Furan > Thiophene', 'Thiophene > Furan > Pyrrole'],
            correctIndex: 0,
            explanation: 'Aromaticity decreases as the electronegativity of the heteroatom increases: Sulfur (2.5) < Nitrogen (3.0) < Oxygen (3.5). Thus Thiophene is closest to benzene in aromatic resonance stabilization, while Furan is the least aromatic and acts almost like a diene.',
            probability: '🔥 98% GPAT Heterocyclic Order'
          }
        ]
      }
    ]
  }
];
