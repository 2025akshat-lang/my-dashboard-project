export type ElementCategory =
  | "alkali"
  | "alkaline"
  | "transition"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export interface ChemElement {
  n: number;
  sym: string;
  name: string;
  mass: number;
  cat: ElementCategory;
  group: number;
  period: number;
  col: number;
  row: number;
}

export const ELEMENTS: ChemElement[] = [
  // Period 1
  { n: 1,   sym: "H",   name: "Hydrogen",      mass: 1.008,   cat: "nonmetal",        group: 1,  period: 1, col: 1,  row: 1 },
  { n: 2,   sym: "He",  name: "Helium",         mass: 4.003,   cat: "noble",           group: 18, period: 1, col: 18, row: 1 },
  // Period 2
  { n: 3,   sym: "Li",  name: "Lithium",        mass: 6.941,   cat: "alkali",          group: 1,  period: 2, col: 1,  row: 2 },
  { n: 4,   sym: "Be",  name: "Beryllium",      mass: 9.012,   cat: "alkaline",        group: 2,  period: 2, col: 2,  row: 2 },
  { n: 5,   sym: "B",   name: "Boron",          mass: 10.81,   cat: "metalloid",       group: 13, period: 2, col: 13, row: 2 },
  { n: 6,   sym: "C",   name: "Carbon",         mass: 12.01,   cat: "nonmetal",        group: 14, period: 2, col: 14, row: 2 },
  { n: 7,   sym: "N",   name: "Nitrogen",       mass: 14.01,   cat: "nonmetal",        group: 15, period: 2, col: 15, row: 2 },
  { n: 8,   sym: "O",   name: "Oxygen",         mass: 16.00,   cat: "nonmetal",        group: 16, period: 2, col: 16, row: 2 },
  { n: 9,   sym: "F",   name: "Fluorine",       mass: 19.00,   cat: "halogen",         group: 17, period: 2, col: 17, row: 2 },
  { n: 10,  sym: "Ne",  name: "Neon",           mass: 20.18,   cat: "noble",           group: 18, period: 2, col: 18, row: 2 },
  // Period 3
  { n: 11,  sym: "Na",  name: "Sodium",         mass: 22.99,   cat: "alkali",          group: 1,  period: 3, col: 1,  row: 3 },
  { n: 12,  sym: "Mg",  name: "Magnesium",      mass: 24.31,   cat: "alkaline",        group: 2,  period: 3, col: 2,  row: 3 },
  { n: 13,  sym: "Al",  name: "Aluminum",       mass: 26.98,   cat: "post-transition", group: 13, period: 3, col: 13, row: 3 },
  { n: 14,  sym: "Si",  name: "Silicon",        mass: 28.09,   cat: "metalloid",       group: 14, period: 3, col: 14, row: 3 },
  { n: 15,  sym: "P",   name: "Phosphorus",     mass: 30.97,   cat: "nonmetal",        group: 15, period: 3, col: 15, row: 3 },
  { n: 16,  sym: "S",   name: "Sulfur",         mass: 32.07,   cat: "nonmetal",        group: 16, period: 3, col: 16, row: 3 },
  { n: 17,  sym: "Cl",  name: "Chlorine",       mass: 35.45,   cat: "halogen",         group: 17, period: 3, col: 17, row: 3 },
  { n: 18,  sym: "Ar",  name: "Argon",          mass: 39.95,   cat: "noble",           group: 18, period: 3, col: 18, row: 3 },
  // Period 4
  { n: 19,  sym: "K",   name: "Potassium",      mass: 39.10,   cat: "alkali",          group: 1,  period: 4, col: 1,  row: 4 },
  { n: 20,  sym: "Ca",  name: "Calcium",        mass: 40.08,   cat: "alkaline",        group: 2,  period: 4, col: 2,  row: 4 },
  { n: 21,  sym: "Sc",  name: "Scandium",       mass: 44.96,   cat: "transition",      group: 3,  period: 4, col: 3,  row: 4 },
  { n: 22,  sym: "Ti",  name: "Titanium",       mass: 47.87,   cat: "transition",      group: 4,  period: 4, col: 4,  row: 4 },
  { n: 23,  sym: "V",   name: "Vanadium",       mass: 50.94,   cat: "transition",      group: 5,  period: 4, col: 5,  row: 4 },
  { n: 24,  sym: "Cr",  name: "Chromium",       mass: 52.00,   cat: "transition",      group: 6,  period: 4, col: 6,  row: 4 },
  { n: 25,  sym: "Mn",  name: "Manganese",      mass: 54.94,   cat: "transition",      group: 7,  period: 4, col: 7,  row: 4 },
  { n: 26,  sym: "Fe",  name: "Iron",           mass: 55.85,   cat: "transition",      group: 8,  period: 4, col: 8,  row: 4 },
  { n: 27,  sym: "Co",  name: "Cobalt",         mass: 58.93,   cat: "transition",      group: 9,  period: 4, col: 9,  row: 4 },
  { n: 28,  sym: "Ni",  name: "Nickel",         mass: 58.69,   cat: "transition",      group: 10, period: 4, col: 10, row: 4 },
  { n: 29,  sym: "Cu",  name: "Copper",         mass: 63.55,   cat: "transition",      group: 11, period: 4, col: 11, row: 4 },
  { n: 30,  sym: "Zn",  name: "Zinc",           mass: 65.38,   cat: "transition",      group: 12, period: 4, col: 12, row: 4 },
  { n: 31,  sym: "Ga",  name: "Gallium",        mass: 69.72,   cat: "post-transition", group: 13, period: 4, col: 13, row: 4 },
  { n: 32,  sym: "Ge",  name: "Germanium",      mass: 72.63,   cat: "metalloid",       group: 14, period: 4, col: 14, row: 4 },
  { n: 33,  sym: "As",  name: "Arsenic",        mass: 74.92,   cat: "metalloid",       group: 15, period: 4, col: 15, row: 4 },
  { n: 34,  sym: "Se",  name: "Selenium",       mass: 78.97,   cat: "nonmetal",        group: 16, period: 4, col: 16, row: 4 },
  { n: 35,  sym: "Br",  name: "Bromine",        mass: 79.90,   cat: "halogen",         group: 17, period: 4, col: 17, row: 4 },
  { n: 36,  sym: "Kr",  name: "Krypton",        mass: 83.80,   cat: "noble",           group: 18, period: 4, col: 18, row: 4 },
  // Period 5
  { n: 37,  sym: "Rb",  name: "Rubidium",       mass: 85.47,   cat: "alkali",          group: 1,  period: 5, col: 1,  row: 5 },
  { n: 38,  sym: "Sr",  name: "Strontium",      mass: 87.62,   cat: "alkaline",        group: 2,  period: 5, col: 2,  row: 5 },
  { n: 39,  sym: "Y",   name: "Yttrium",        mass: 88.91,   cat: "transition",      group: 3,  period: 5, col: 3,  row: 5 },
  { n: 40,  sym: "Zr",  name: "Zirconium",      mass: 91.22,   cat: "transition",      group: 4,  period: 5, col: 4,  row: 5 },
  { n: 41,  sym: "Nb",  name: "Niobium",        mass: 92.91,   cat: "transition",      group: 5,  period: 5, col: 5,  row: 5 },
  { n: 42,  sym: "Mo",  name: "Molybdenum",     mass: 95.96,   cat: "transition",      group: 6,  period: 5, col: 6,  row: 5 },
  { n: 43,  sym: "Tc",  name: "Technetium",     mass: 98.00,   cat: "transition",      group: 7,  period: 5, col: 7,  row: 5 },
  { n: 44,  sym: "Ru",  name: "Ruthenium",      mass: 101.07,  cat: "transition",      group: 8,  period: 5, col: 8,  row: 5 },
  { n: 45,  sym: "Rh",  name: "Rhodium",        mass: 102.91,  cat: "transition",      group: 9,  period: 5, col: 9,  row: 5 },
  { n: 46,  sym: "Pd",  name: "Palladium",      mass: 106.42,  cat: "transition",      group: 10, period: 5, col: 10, row: 5 },
  { n: 47,  sym: "Ag",  name: "Silver",         mass: 107.87,  cat: "transition",      group: 11, period: 5, col: 11, row: 5 },
  { n: 48,  sym: "Cd",  name: "Cadmium",        mass: 112.41,  cat: "transition",      group: 12, period: 5, col: 12, row: 5 },
  { n: 49,  sym: "In",  name: "Indium",         mass: 114.82,  cat: "post-transition", group: 13, period: 5, col: 13, row: 5 },
  { n: 50,  sym: "Sn",  name: "Tin",            mass: 118.71,  cat: "post-transition", group: 14, period: 5, col: 14, row: 5 },
  { n: 51,  sym: "Sb",  name: "Antimony",       mass: 121.76,  cat: "metalloid",       group: 15, period: 5, col: 15, row: 5 },
  { n: 52,  sym: "Te",  name: "Tellurium",      mass: 127.60,  cat: "metalloid",       group: 16, period: 5, col: 16, row: 5 },
  { n: 53,  sym: "I",   name: "Iodine",         mass: 126.90,  cat: "halogen",         group: 17, period: 5, col: 17, row: 5 },
  { n: 54,  sym: "Xe",  name: "Xenon",          mass: 131.29,  cat: "noble",           group: 18, period: 5, col: 18, row: 5 },
  // Period 6 (pre-lanthanides)
  { n: 55,  sym: "Cs",  name: "Cesium",         mass: 132.91,  cat: "alkali",          group: 1,  period: 6, col: 1,  row: 6 },
  { n: 56,  sym: "Ba",  name: "Barium",         mass: 137.33,  cat: "alkaline",        group: 2,  period: 6, col: 2,  row: 6 },
  // Lanthanides (row=9, col=n-57+3)
  { n: 57,  sym: "La",  name: "Lanthanum",      mass: 138.91,  cat: "lanthanide",      group: 3,  period: 6, col: 3,  row: 9 },
  { n: 58,  sym: "Ce",  name: "Cerium",         mass: 140.12,  cat: "lanthanide",      group: 3,  period: 6, col: 4,  row: 9 },
  { n: 59,  sym: "Pr",  name: "Praseodymium",   mass: 140.91,  cat: "lanthanide",      group: 3,  period: 6, col: 5,  row: 9 },
  { n: 60,  sym: "Nd",  name: "Neodymium",      mass: 144.24,  cat: "lanthanide",      group: 3,  period: 6, col: 6,  row: 9 },
  { n: 61,  sym: "Pm",  name: "Promethium",     mass: 145.00,  cat: "lanthanide",      group: 3,  period: 6, col: 7,  row: 9 },
  { n: 62,  sym: "Sm",  name: "Samarium",       mass: 150.36,  cat: "lanthanide",      group: 3,  period: 6, col: 8,  row: 9 },
  { n: 63,  sym: "Eu",  name: "Europium",       mass: 151.96,  cat: "lanthanide",      group: 3,  period: 6, col: 9,  row: 9 },
  { n: 64,  sym: "Gd",  name: "Gadolinium",     mass: 157.25,  cat: "lanthanide",      group: 3,  period: 6, col: 10, row: 9 },
  { n: 65,  sym: "Tb",  name: "Terbium",        mass: 158.93,  cat: "lanthanide",      group: 3,  period: 6, col: 11, row: 9 },
  { n: 66,  sym: "Dy",  name: "Dysprosium",     mass: 162.50,  cat: "lanthanide",      group: 3,  period: 6, col: 12, row: 9 },
  { n: 67,  sym: "Ho",  name: "Holmium",        mass: 164.93,  cat: "lanthanide",      group: 3,  period: 6, col: 13, row: 9 },
  { n: 68,  sym: "Er",  name: "Erbium",         mass: 167.26,  cat: "lanthanide",      group: 3,  period: 6, col: 14, row: 9 },
  { n: 69,  sym: "Tm",  name: "Thulium",        mass: 168.93,  cat: "lanthanide",      group: 3,  period: 6, col: 15, row: 9 },
  { n: 70,  sym: "Yb",  name: "Ytterbium",      mass: 173.05,  cat: "lanthanide",      group: 3,  period: 6, col: 16, row: 9 },
  { n: 71,  sym: "Lu",  name: "Lutetium",       mass: 174.97,  cat: "lanthanide",      group: 3,  period: 6, col: 17, row: 9 },
  // Period 6 (post-lanthanides)
  { n: 72,  sym: "Hf",  name: "Hafnium",        mass: 178.49,  cat: "transition",      group: 4,  period: 6, col: 4,  row: 6 },
  { n: 73,  sym: "Ta",  name: "Tantalum",       mass: 180.95,  cat: "transition",      group: 5,  period: 6, col: 5,  row: 6 },
  { n: 74,  sym: "W",   name: "Tungsten",       mass: 183.84,  cat: "transition",      group: 6,  period: 6, col: 6,  row: 6 },
  { n: 75,  sym: "Re",  name: "Rhenium",        mass: 186.21,  cat: "transition",      group: 7,  period: 6, col: 7,  row: 6 },
  { n: 76,  sym: "Os",  name: "Osmium",         mass: 190.23,  cat: "transition",      group: 8,  period: 6, col: 8,  row: 6 },
  { n: 77,  sym: "Ir",  name: "Iridium",        mass: 192.22,  cat: "transition",      group: 9,  period: 6, col: 9,  row: 6 },
  { n: 78,  sym: "Pt",  name: "Platinum",       mass: 195.08,  cat: "transition",      group: 10, period: 6, col: 10, row: 6 },
  { n: 79,  sym: "Au",  name: "Gold",           mass: 196.97,  cat: "transition",      group: 11, period: 6, col: 11, row: 6 },
  { n: 80,  sym: "Hg",  name: "Mercury",        mass: 200.59,  cat: "transition",      group: 12, period: 6, col: 12, row: 6 },
  { n: 81,  sym: "Tl",  name: "Thallium",       mass: 204.38,  cat: "post-transition", group: 13, period: 6, col: 13, row: 6 },
  { n: 82,  sym: "Pb",  name: "Lead",           mass: 207.2,   cat: "post-transition", group: 14, period: 6, col: 14, row: 6 },
  { n: 83,  sym: "Bi",  name: "Bismuth",        mass: 208.98,  cat: "post-transition", group: 15, period: 6, col: 15, row: 6 },
  { n: 84,  sym: "Po",  name: "Polonium",       mass: 209,     cat: "metalloid",       group: 16, period: 6, col: 16, row: 6 },
  { n: 85,  sym: "At",  name: "Astatine",       mass: 210,     cat: "halogen",         group: 17, period: 6, col: 17, row: 6 },
  { n: 86,  sym: "Rn",  name: "Radon",          mass: 222,     cat: "noble",           group: 18, period: 6, col: 18, row: 6 },
  // Period 7 (pre-actinides)
  { n: 87,  sym: "Fr",  name: "Francium",       mass: 223,     cat: "alkali",          group: 1,  period: 7, col: 1,  row: 7 },
  { n: 88,  sym: "Ra",  name: "Radium",         mass: 226,     cat: "alkaline",        group: 2,  period: 7, col: 2,  row: 7 },
  // Actinides (row=10, col=n-89+3)
  { n: 89,  sym: "Ac",  name: "Actinium",       mass: 227,     cat: "actinide",        group: 3,  period: 7, col: 3,  row: 10 },
  { n: 90,  sym: "Th",  name: "Thorium",        mass: 232.04,  cat: "actinide",        group: 3,  period: 7, col: 4,  row: 10 },
  { n: 91,  sym: "Pa",  name: "Protactinium",   mass: 231.04,  cat: "actinide",        group: 3,  period: 7, col: 5,  row: 10 },
  { n: 92,  sym: "U",   name: "Uranium",        mass: 238.03,  cat: "actinide",        group: 3,  period: 7, col: 6,  row: 10 },
  { n: 93,  sym: "Np",  name: "Neptunium",      mass: 237,     cat: "actinide",        group: 3,  period: 7, col: 7,  row: 10 },
  { n: 94,  sym: "Pu",  name: "Plutonium",      mass: 244,     cat: "actinide",        group: 3,  period: 7, col: 8,  row: 10 },
  { n: 95,  sym: "Am",  name: "Americium",      mass: 243,     cat: "actinide",        group: 3,  period: 7, col: 9,  row: 10 },
  { n: 96,  sym: "Cm",  name: "Curium",         mass: 247,     cat: "actinide",        group: 3,  period: 7, col: 10, row: 10 },
  { n: 97,  sym: "Bk",  name: "Berkelium",      mass: 247,     cat: "actinide",        group: 3,  period: 7, col: 11, row: 10 },
  { n: 98,  sym: "Cf",  name: "Californium",    mass: 251,     cat: "actinide",        group: 3,  period: 7, col: 12, row: 10 },
  { n: 99,  sym: "Es",  name: "Einsteinium",    mass: 252,     cat: "actinide",        group: 3,  period: 7, col: 13, row: 10 },
  { n: 100, sym: "Fm",  name: "Fermium",        mass: 257,     cat: "actinide",        group: 3,  period: 7, col: 14, row: 10 },
  { n: 101, sym: "Md",  name: "Mendelevium",    mass: 258,     cat: "actinide",        group: 3,  period: 7, col: 15, row: 10 },
  { n: 102, sym: "No",  name: "Nobelium",       mass: 259,     cat: "actinide",        group: 3,  period: 7, col: 16, row: 10 },
  { n: 103, sym: "Lr",  name: "Lawrencium",     mass: 266,     cat: "actinide",        group: 3,  period: 7, col: 17, row: 10 },
  // Period 7 (post-actinides)
  { n: 104, sym: "Rf",  name: "Rutherfordium",  mass: 267,     cat: "transition",      group: 4,  period: 7, col: 4,  row: 7 },
  { n: 105, sym: "Db",  name: "Dubnium",        mass: 268,     cat: "transition",      group: 5,  period: 7, col: 5,  row: 7 },
  { n: 106, sym: "Sg",  name: "Seaborgium",     mass: 271,     cat: "transition",      group: 6,  period: 7, col: 6,  row: 7 },
  { n: 107, sym: "Bh",  name: "Bohrium",        mass: 272,     cat: "transition",      group: 7,  period: 7, col: 7,  row: 7 },
  { n: 108, sym: "Hs",  name: "Hassium",        mass: 270,     cat: "transition",      group: 8,  period: 7, col: 8,  row: 7 },
  { n: 109, sym: "Mt",  name: "Meitnerium",     mass: 278,     cat: "transition",      group: 9,  period: 7, col: 9,  row: 7 },
  { n: 110, sym: "Ds",  name: "Darmstadtium",   mass: 281,     cat: "transition",      group: 10, period: 7, col: 10, row: 7 },
  { n: 111, sym: "Rg",  name: "Roentgenium",    mass: 282,     cat: "transition",      group: 11, period: 7, col: 11, row: 7 },
  { n: 112, sym: "Cn",  name: "Copernicium",    mass: 285,     cat: "transition",      group: 12, period: 7, col: 12, row: 7 },
  { n: 113, sym: "Nh",  name: "Nihonium",       mass: 286,     cat: "post-transition", group: 13, period: 7, col: 13, row: 7 },
  { n: 114, sym: "Fl",  name: "Flerovium",      mass: 289,     cat: "post-transition", group: 14, period: 7, col: 14, row: 7 },
  { n: 115, sym: "Mc",  name: "Moscovium",      mass: 290,     cat: "post-transition", group: 15, period: 7, col: 15, row: 7 },
  { n: 116, sym: "Lv",  name: "Livermorium",    mass: 293,     cat: "post-transition", group: 16, period: 7, col: 16, row: 7 },
  { n: 117, sym: "Ts",  name: "Tennessine",     mass: 294,     cat: "halogen",         group: 17, period: 7, col: 17, row: 7 },
  { n: 118, sym: "Og",  name: "Oganesson",      mass: 294,     cat: "noble",           group: 18, period: 7, col: 18, row: 7 },
];

export const CAT_STYLES: Record<ElementCategory, { bg: string; border: string; text: string }> = {
  alkali:          { bg: "bg-red-100",    border: "border-red-300",    text: "text-red-800" },
  alkaline:        { bg: "bg-orange-100", border: "border-orange-300", text: "text-orange-800" },
  transition:      { bg: "bg-yellow-100", border: "border-yellow-300", text: "text-yellow-800" },
  "post-transition": { bg: "bg-lime-100", border: "border-lime-300",   text: "text-lime-800" },
  metalloid:       { bg: "bg-teal-100",   border: "border-teal-300",   text: "text-teal-800" },
  nonmetal:        { bg: "bg-sky-100",    border: "border-sky-300",    text: "text-sky-800" },
  halogen:         { bg: "bg-blue-100",   border: "border-blue-300",   text: "text-blue-800" },
  noble:           { bg: "bg-violet-100", border: "border-violet-300", text: "text-violet-800" },
  lanthanide:      { bg: "bg-pink-100",   border: "border-pink-300",   text: "text-pink-800" },
  actinide:        { bg: "bg-fuchsia-100",border: "border-fuchsia-300",text: "text-fuchsia-800" },
};

export const ELEMENT_MAP: Record<string, ChemElement> = Object.fromEntries(
  ELEMENTS.map((el) => [el.sym.toUpperCase(), el])
);

// ---- Molar Mass Parser ----

type ParseResult = { mass: number; breakdown: Record<string, number> } | { error: string };

function mergeBreakdown(
  target: Record<string, number>,
  source: Record<string, number>,
  multiplier: number
): void {
  for (const [sym, count] of Object.entries(source)) {
    target[sym] = (target[sym] ?? 0) + count * multiplier;
  }
}

function parseFormula(
  formula: string,
  pos: { i: number }
): { mass: number; breakdown: Record<string, number> } | { error: string } {
  let totalMass = 0;
  const breakdown: Record<string, number> = {};

  while (pos.i < formula.length && formula[pos.i] !== ")") {
    const ch = formula[pos.i];

    if (ch === "(") {
      pos.i++; // consume "("
      const inner = parseFormula(formula, pos);
      if ("error" in inner) return inner;
      if (formula[pos.i] !== ")") return { error: "Missing closing parenthesis" };
      pos.i++; // consume ")"

      // read optional multiplier
      let numStr = "";
      while (pos.i < formula.length && formula[pos.i] >= "0" && formula[pos.i] <= "9") {
        numStr += formula[pos.i++];
      }
      const mult = numStr ? parseInt(numStr, 10) : 1;
      totalMass += inner.mass * mult;
      mergeBreakdown(breakdown, inner.breakdown, mult);
    } else if (ch >= "A" && ch <= "Z") {
      // read element symbol
      let sym = ch;
      pos.i++;
      while (pos.i < formula.length && formula[pos.i] >= "a" && formula[pos.i] <= "z") {
        sym += formula[pos.i++];
      }
      const el = ELEMENT_MAP[sym.toUpperCase()];
      if (!el) return { error: `Unknown element: ${sym}` };

      // read optional count
      let numStr = "";
      while (pos.i < formula.length && formula[pos.i] >= "0" && formula[pos.i] <= "9") {
        numStr += formula[pos.i++];
      }
      const count = numStr ? parseInt(numStr, 10) : 1;
      totalMass += el.mass * count;
      breakdown[el.sym] = (breakdown[el.sym] ?? 0) + count;
    } else if (ch >= "0" && ch <= "9") {
      return { error: `Unexpected digit at position ${pos.i}` };
    } else {
      return { error: `Unexpected character: ${ch}` };
    }
  }

  return { mass: totalMass, breakdown };
}

export function parseMolarMass(formula: string): ParseResult {
  if (!formula.trim()) return { error: "Empty formula" };
  const pos = { i: 0 };
  const result = parseFormula(formula.trim(), pos);
  if ("error" in result) return result;
  if (pos.i < formula.trim().length) {
    return { error: `Unexpected character at position ${pos.i}: ${formula[pos.i]}` };
  }
  return result;
}

// ---- Solubility Matrix ----

export const SOLUBILITY: {
  cations: string[];
  anions: string[];
  data: Record<string, Record<string, "S" | "SS" | "I">>;
} = {
  cations: ["Na⁺", "K⁺", "Ca²⁺", "Mg²⁺", "Fe²⁺", "Fe³⁺", "Cu²⁺", "Ag⁺", "Ba²⁺", "Pb²⁺"],
  anions:  ["Cl⁻", "Br⁻", "I⁻", "SO₄²⁻", "CO₃²⁻", "OH⁻", "NO₃⁻", "PO₄³⁻"],
  data: {
    // Na⁺ — almost all soluble
    "Na⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "S",
      "CO₃²⁻": "S",
      "OH⁻":         "S",
      "NO₃⁻":   "S",
      "PO₄³⁻": "S",
    },
    // K⁺ — almost all soluble
    "K⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "S",
      "CO₃²⁻": "S",
      "OH⁻":         "S",
      "NO₃⁻":   "S",
      "PO₄³⁻": "S",
    },
    // Ca²⁺
    "Ca²⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "SS",
      "CO₃²⁻": "I",
      "OH⁻":         "SS",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Mg²⁺
    "Mg²⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "S",
      "CO₃²⁻": "I",
      "OH⁻":         "I",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Fe²⁺
    "Fe²⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "S",
      "CO₃²⁻": "I",
      "OH⁻":         "I",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Fe³⁺
    "Fe³⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "S",
      "CO₃²⁻": "I",
      "OH⁻":         "I",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Cu²⁺
    "Cu²⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "I",
      "SO₄²⁻": "S",
      "CO₃²⁻": "I",
      "OH⁻":         "I",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Ag⁺
    "Ag⁺": {
      "Cl⁻":         "I",
      "Br⁻":         "I",
      "I⁻":          "I",
      "SO₄²⁻": "SS",
      "CO₃²⁻": "I",
      "OH⁻":         "I",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Ba²⁺
    "Ba²⁺": {
      "Cl⁻":         "S",
      "Br⁻":         "S",
      "I⁻":          "S",
      "SO₄²⁻": "I",
      "CO₃²⁻": "I",
      "OH⁻":         "S",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
    // Pb²⁺
    "Pb²⁺": {
      "Cl⁻":         "SS",
      "Br⁻":         "SS",
      "I⁻":          "I",
      "SO₄²⁻": "I",
      "CO₃²⁻": "I",
      "OH⁻":         "I",
      "NO₃⁻":   "S",
      "PO₄³⁻": "I",
    },
  },
};
