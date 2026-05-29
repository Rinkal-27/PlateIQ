/**
 * Ingredient knowledge base — curated, free, on-device.
 * Each entry includes aliases used by manufacturers to disguise the ingredient,
 * a severity (info | caution | bad), tags, and a plain-language explanation.
 *
 * Sources: Open Food Facts open data, EFSA additive list, WHO guidance, EWG.
 * Keep entries short; the decoder concatenates the explanation into the report.
 */
export type Severity = "info" | "caution" | "bad";

export interface IngredientEntry {
  id: string;
  display: string;
  aliases: string[]; // lowercase substrings to match
  severity: Severity;
  tags: string[]; // e.g. "hidden-sugar", "preservative", "trans-fat", "msg"
  explain: string; // plain-language, max ~140 chars
}

export const INGREDIENT_DB: IngredientEntry[] = [
  // ── Hidden sugars ────────────────────────────────────────────────────────
  { id: "hfcs", display: "High-Fructose Corn Syrup", aliases: ["high fructose corn syrup", "hfcs", "glucose-fructose syrup", "isoglucose"], severity: "bad", tags: ["hidden-sugar"], explain: "Cheap industrial sweetener linked to fatty liver, insulin resistance and obesity." },
  { id: "invert-sugar", display: "Invert Sugar", aliases: ["invert sugar", "invert syrup"], severity: "caution", tags: ["hidden-sugar"], explain: "Sugar broken into glucose + fructose. Same calories as sugar, often used to hide sweetness." },
  { id: "dextrose", display: "Dextrose", aliases: ["dextrose"], severity: "caution", tags: ["hidden-sugar"], explain: "Another name for glucose. Spikes blood sugar fast." },
  { id: "maltodextrin", display: "Maltodextrin", aliases: ["maltodextrin"], severity: "caution", tags: ["hidden-sugar"], explain: "Highly processed starch with a glycaemic index higher than table sugar." },
  { id: "fructose", display: "Crystalline Fructose", aliases: ["crystalline fructose", "fructose syrup"], severity: "bad", tags: ["hidden-sugar"], explain: "Concentrated fructose stresses the liver more than regular sugar." },
  { id: "cane-juice", display: "Evaporated Cane Juice", aliases: ["evaporated cane juice", "cane sugar", "cane syrup"], severity: "caution", tags: ["hidden-sugar"], explain: "Marketing name for sugar. Same impact on blood glucose." },
  { id: "agave", display: "Agave Nectar", aliases: ["agave nectar", "agave syrup"], severity: "caution", tags: ["hidden-sugar"], explain: "70–90% fructose — higher than HFCS. Not a health food." },

  // ── Trans / problem fats ─────────────────────────────────────────────────
  { id: "hydrogenated", display: "Hydrogenated Oil", aliases: ["partially hydrogenated", "hydrogenated vegetable oil", "hydrogenated palm", "vanaspati"], severity: "bad", tags: ["trans-fat"], explain: "Source of artificial trans-fats. WHO calls for global elimination — strongly linked to heart disease." },
  { id: "palm-oil", display: "Palm Oil", aliases: ["palm oil", "palmolein", "palm kernel oil"], severity: "caution", tags: ["sat-fat", "environmental"], explain: "High in saturated fat; also linked to deforestation. Refined palm oil contains 3-MCPD." },
  { id: "interesterified", display: "Interesterified Fat", aliases: ["interesterified"], severity: "bad", tags: ["processed-fat"], explain: "Industrial alternative to hydrogenation. May lower HDL and raise blood sugar." },

  // ── Artificial colours ──────────────────────────────────────────────────
  { id: "e102", display: "Tartrazine (E102)", aliases: ["e102", "tartrazine", "yellow 5", "fd&c yellow 5"], severity: "bad", tags: ["artificial-colour", "allergen"], explain: "Yellow azo dye linked to hyperactivity in children; banned/warned in several EU countries." },
  { id: "e110", display: "Sunset Yellow (E110)", aliases: ["e110", "sunset yellow", "yellow 6", "fd&c yellow 6"], severity: "bad", tags: ["artificial-colour"], explain: "Azo dye; EU requires hyperactivity warning label." },
  { id: "e124", display: "Ponceau 4R (E124)", aliases: ["e124", "ponceau", "cochineal red a"], severity: "bad", tags: ["artificial-colour"], explain: "Red azo dye banned in USA, Norway, Finland — possible carcinogen." },
  { id: "e129", display: "Allura Red (E129)", aliases: ["e129", "allura red", "red 40", "fd&c red 40"], severity: "caution", tags: ["artificial-colour"], explain: "Most-used red dye in processed food; linked to behavioural changes in children." },
  { id: "e150d", display: "Caramel IV (E150d)", aliases: ["e150d", "caramel color iv", "caramel colour iv", "sulphite ammonia caramel"], severity: "bad", tags: ["artificial-colour"], explain: "Industrial caramel containing 4-MEI, classified as possibly carcinogenic by IARC." },

  // ── Preservatives ───────────────────────────────────────────────────────
  { id: "e211", display: "Sodium Benzoate (E211)", aliases: ["e211", "sodium benzoate"], severity: "caution", tags: ["preservative"], explain: "With vitamin C can form benzene, a known carcinogen. Common in soft drinks." },
  { id: "e221", display: "Sodium Sulphite (E221)", aliases: ["e221", "sodium sulphite", "sodium sulfite"], severity: "caution", tags: ["preservative", "allergen"], explain: "Triggers asthma in sensitive people. Common in wine, dried fruit." },
  { id: "e249", display: "Potassium Nitrite (E249)", aliases: ["e249", "potassium nitrite"], severity: "bad", tags: ["preservative", "nitrite"], explain: "Cured-meat preservative; forms nitrosamines linked to colorectal cancer (IARC Group 1)." },
  { id: "e250", display: "Sodium Nitrite (E250)", aliases: ["e250", "sodium nitrite"], severity: "bad", tags: ["preservative", "nitrite"], explain: "Same nitrosamine concern. Reason WHO classes processed meat as carcinogenic." },
  { id: "bha", display: "BHA (E320)", aliases: ["bha", "e320", "butylated hydroxyanisole"], severity: "bad", tags: ["preservative"], explain: "Synthetic antioxidant; reasonably anticipated human carcinogen (NTP)." },
  { id: "bht", display: "BHT (E321)", aliases: ["bht", "e321", "butylated hydroxytoluene"], severity: "caution", tags: ["preservative"], explain: "Synthetic antioxidant; some studies show tumour-promoting activity." },
  { id: "tbhq", display: "TBHQ (E319)", aliases: ["tbhq", "e319", "tert-butylhydroquinone"], severity: "bad", tags: ["preservative"], explain: "Petroleum-derived antioxidant; chronic exposure linked to immune effects." },

  // ── Flavour enhancers ───────────────────────────────────────────────────
  { id: "msg", display: "MSG (E621)", aliases: ["e621", "monosodium glutamate", "msg", "ajinomoto"], severity: "caution", tags: ["msg", "flavour-enhancer"], explain: "Safe for most but triggers headaches/flushing in sensitive individuals. Drives overeating." },
  { id: "disodium-inosinate", display: "Disodium Inosinate (E631)", aliases: ["e631", "disodium inosinate"], severity: "caution", tags: ["flavour-enhancer"], explain: "Almost always paired with MSG to amplify umami. Often derived from animal sources (non-veg)." },

  // ── Sweeteners ──────────────────────────────────────────────────────────
  { id: "aspartame", display: "Aspartame (E951)", aliases: ["aspartame", "e951"], severity: "caution", tags: ["artificial-sweetener"], explain: "IARC classed as ‘possibly carcinogenic’ (2023). Avoid if phenylketonuric." },
  { id: "sucralose", display: "Sucralose (E955)", aliases: ["sucralose", "e955"], severity: "caution", tags: ["artificial-sweetener"], explain: "May disrupt gut microbiome; forms harmful compounds when heated." },
  { id: "acesulfame", display: "Acesulfame-K (E950)", aliases: ["acesulfame", "e950", "ace-k"], severity: "caution", tags: ["artificial-sweetener"], explain: "Animal studies suggest metabolic and gut effects; long-term human data limited." },

  // ── Emulsifiers / thickeners flagged by recent research ────────────────
  { id: "carrageenan", display: "Carrageenan (E407)", aliases: ["carrageenan", "e407"], severity: "caution", tags: ["emulsifier"], explain: "Linked to gut inflammation in animal studies; banned in EU infant formula." },
  { id: "polysorbate-80", display: "Polysorbate 80 (E433)", aliases: ["polysorbate 80", "e433"], severity: "caution", tags: ["emulsifier"], explain: "Recent studies link emulsifiers like this to gut microbiome disruption." },
  { id: "cmc", display: "Carboxymethyl Cellulose (E466)", aliases: ["carboxymethyl cellulose", "e466", "cmc"], severity: "caution", tags: ["emulsifier"], explain: "Common thickener; emerging evidence of gut microbiome effects." },

  // ── Allergens / dietary flags ───────────────────────────────────────────
  { id: "gluten", display: "Gluten source", aliases: ["wheat", "barley", "rye", "malt", "semolina", "spelt", "triticale", "atta", "maida"], severity: "info", tags: ["gluten", "allergen"], explain: "Contains gluten — avoid if coeliac or gluten-intolerant." },
  { id: "milk", display: "Milk / Dairy", aliases: ["milk", "lactose", "whey", "casein", "ghee", "butter", "cream", "paneer", "cheese"], severity: "info", tags: ["dairy", "allergen", "non-vegan"], explain: "Dairy-derived; not suitable for vegans or those with lactose intolerance." },
  { id: "egg", display: "Egg", aliases: ["egg", "albumen", "ovalbumin", "egg white", "egg yolk"], severity: "info", tags: ["egg", "allergen", "non-vegan"], explain: "Egg-derived; not vegan; common allergen." },
  { id: "soy", display: "Soy", aliases: ["soy", "soya", "soybean", "soy lecithin"], severity: "info", tags: ["soy", "allergen"], explain: "Soy-derived; common allergen." },
  { id: "peanut", display: "Peanut", aliases: ["peanut", "groundnut", "arachis"], severity: "info", tags: ["peanut", "allergen"], explain: "Severe-allergy risk." },
  { id: "treenut", display: "Tree nuts", aliases: ["almond", "cashew", "walnut", "pecan", "hazelnut", "pistachio", "macadamia", "brazil nut"], severity: "info", tags: ["tree-nut", "allergen"], explain: "Tree-nut allergen." },
  { id: "fish", display: "Fish / Seafood", aliases: ["fish", "anchovy", "tuna", "salmon", "shrimp", "prawn", "crab", "lobster", "shellfish"], severity: "info", tags: ["fish", "non-veg"], explain: "Animal-derived; not vegetarian." },
  { id: "meat", display: "Meat", aliases: ["chicken", "beef", "pork", "mutton", "lamb", "gelatin", "gelatine", "lard", "tallow", "rennet"], severity: "info", tags: ["meat", "non-veg"], explain: "Animal-derived; not vegetarian." },

  // ── Jain-specific flags (root vegetables, fermentation) ─────────────────
  { id: "jain-roots", display: "Root vegetables", aliases: ["onion", "garlic", "potato", "carrot", "ginger", "beetroot", "radish"], severity: "info", tags: ["root", "non-jain"], explain: "Root vegetable / allium — not consumed in strict Jain diet." },
  { id: "alcohol", display: "Alcohol", aliases: ["alcohol", "ethanol", "wine", "beer", "rum", "vodka", "ethyl alcohol"], severity: "info", tags: ["alcohol", "non-jain", "non-halal"], explain: "Contains alcohol." },
];
