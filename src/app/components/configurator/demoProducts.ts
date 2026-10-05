import type { Product } from "./types";

// UI demo only: dimensions, views and rules must be replaced by the final ASEA product matrix.
const entries: [
  string,
  Product["name"],
  Product["category"],
  Product["preferredView"],
][] = [
  ["fryer", ["Friteuse", "Fryer", "Fritéza"], "cooking", "top"],
  [
    "double-fryer",
    ["Doppelfriteuse", "Double fryer", "Dvojitá fritéza"],
    "cooking",
    "top",
  ],
  ["gas-grill", ["Gasbräter", "Gas griddle", "Plynový gril"], "cooking", "top"],
  [
    "fridge",
    ["Kühlschrank Unterbau", "Undercounter fridge", "Podpultová chladnička"],
    "cooling",
    "side",
  ],
  [
    "bottle-fridge",
    ["Flaschenkühlschrank", "Bottle fridge", "Chladnička na nápoje"],
    "cooling",
    "front",
  ],
  [
    "cooling-top",
    ["Kühlaufsatz", "Refrigerated topping unit", "Chladiaca nadstavba"],
    "cooling",
    "side",
  ],
  [
    "contact-grill",
    ["Kontaktgrill", "Contact grill", "Kontaktný gril"],
    "cooking",
    "top",
  ],
  [
    "griddle",
    [
      "Griddleplatte Elektro",
      "Electric griddle",
      "Elektrická grilovacia platňa",
    ],
    "cooking",
    "top",
  ],
  [
    "induction",
    ["Induktionskocher", "Induction hob", "Indukčný varič"],
    "cooking",
    "top",
  ],
  [
    "sink",
    ["Doppelwaschbecken", "Double sink", "Dvojitý drez"],
    "water",
    "top",
  ],
  [
    "hygiene",
    ["Hygienebereich", "Hygiene station", "Hygienická zóna"],
    "water",
    "side",
  ],
  [
    "cabinet",
    ["Hängeschrank", "Wall cabinet", "Závesná skrinka"],
    "furniture",
    "front",
  ],
  [
    "hood",
    ["Dunstabzug", "Extractor hood", "Odsávač pár"],
    "furniture",
    "front",
  ],
  ["table", ["Arbeitstisch", "Worktable", "Pracovný stôl"], "furniture", "top"],
];
export const demoProducts: Product[] = entries.map(
  ([id, name, category, preferredView]) => ({
    id,
    name,
    category,
    preferredView,
    width: 16,
    height: 22,
    depth: 22,
    modelPath: null,
    active: true,
  }),
);
export const productById = (id: string) =>
  demoProducts.find((product) => product.id === id)!;
