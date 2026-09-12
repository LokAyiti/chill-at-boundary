// ─────────────────────────────────────────────────────────────
// Chill At Boundary — menu data
// Prices & availability mirrored from the Square ordering site.
// Nutrition values are ESTIMATES computed from standard ingredient
// data — edit freely, they are clearly labeled in the UI.
// `popular` flags are owner-controlled "crowd favorite" badges.
// ─────────────────────────────────────────────────────────────

export type Category =
  | 'Openers'
  | 'Anchors'
  | 'Pinch Hitters'
  | 'Thirst Quenchers'
  | 'Tail Enders'
  | 'Other items'

export type Protein =
  | 'paneer'
  | 'tofu'
  | 'chickpeas'
  | 'black beans'
  | 'potato'
  | 'dairy'
  | 'mixed'
  | 'none'

export interface Nutrition {
  calories: number // kcal
  protein: number // g
  carbs: number // g
  fat: number // g
  fiber: number // g
  sodium: number // mg
}

export interface MenuItem {
  id: string
  name: string
  category: Category
  price: number | null // null = ask at truck / not listed
  desc: string
  veg: boolean
  vegan: boolean
  proteins: Protein[]
  popular: boolean
  available: boolean
  statusNote?: string // e.g. "Sold out", "Low stock"
  spice: 0 | 1 | 2 | 3
  nutrition: Nutrition
}

export const CATEGORIES: { name: Category; tagline: string }[] = [
  { name: 'Openers', tagline: 'First to the crease — light bites to start your innings' },
  { name: 'Anchors', tagline: 'The backbone of the innings — mains that hold it together' },
  { name: 'Pinch Hitters', tagline: 'Quick-impact Indian street snacks' },
  { name: 'Thirst Quenchers', tagline: 'Drinks to keep the run rate up' },
  { name: 'Tail Enders', tagline: 'The last-wicket stand — sides & bites to finish' },
  { name: 'Other items', tagline: 'Extras off the bat' },
]

export const MENU: MenuItem[] = [
  // ── Openers ──────────────────────────────────────────────
  {
    id: 'bean-tacos',
    name: 'Bean Tacos',
    category: 'Openers',
    price: 3.25,
    desc: 'Slow-simmered black beans in warm tortillas, topped with fresh salsa and melted cheese.',
    veg: true,
    vegan: false,
    proteins: ['black beans'],
    popular: false,
    available: true,
    spice: 1,
    nutrition: { calories: 310, protein: 11, carbs: 42, fat: 11, fiber: 9, sodium: 540 },
  },

  // ── Anchors ──────────────────────────────────────────────
  {
    id: 'fusion-tacos',
    name: 'Fusion Tacos',
    category: 'Anchors',
    price: 7.99,
    desc: 'Your pick of paneer, tofu or chickpeas with fire-roasted veggies, finished with our signature C@B sauce.',
    veg: true,
    vegan: false,
    proteins: ['paneer', 'tofu', 'chickpeas'],
    popular: true,
    available: true,
    spice: 2,
    nutrition: { calories: 480, protein: 18, carbs: 52, fat: 20, fiber: 10, sodium: 720 },
  },
  {
    id: 'cab-wrap',
    name: 'C@B Wrap',
    category: 'Anchors',
    price: 6.99,
    desc: 'Grilled veggies and your choice of paneer or tofu, wrapped in a soft crepe or tortilla with signature sauce.',
    veg: true,
    vegan: false,
    proteins: ['paneer', 'tofu'],
    popular: true,
    available: true,
    statusNote: 'Low stock',
    spice: 2,
    nutrition: { calories: 520, protein: 20, carbs: 58, fat: 22, fiber: 7, sodium: 810 },
  },
  {
    id: 'veggie-lift',
    name: 'The Veggie Lift',
    category: 'Anchors',
    price: null,
    desc: 'Club-style sandwich stacked with hummus, crisp veggies and greens, served with potato chips.',
    veg: true,
    vegan: true,
    proteins: ['chickpeas'],
    popular: false,
    available: false,
    statusNote: 'Sold out',
    spice: 0,
    nutrition: { calories: 450, protein: 14, carbs: 60, fat: 16, fiber: 11, sodium: 690 },
  },
  {
    id: 'mediterranean-platter',
    name: 'Mediterranean Platter',
    category: 'Anchors',
    price: 9.99,
    desc: 'Crispy falafel over a fresh vegetable salad with creamy hummus and our signature sauce.',
    veg: true,
    vegan: true,
    proteins: ['chickpeas'],
    popular: true,
    available: true,
    spice: 1,
    nutrition: { calories: 560, protein: 19, carbs: 62, fat: 26, fiber: 14, sodium: 880 },
  },
  {
    id: 'falawrap',
    name: 'Falawrap',
    category: 'Anchors',
    price: 7.99,
    desc: 'Golden falafel and crunchy veggies rolled in warm pita — our handheld crowd favorite.',
    veg: true,
    vegan: true,
    proteins: ['chickpeas'],
    popular: true,
    available: true,
    spice: 1,
    nutrition: { calories: 490, protein: 15, carbs: 64, fat: 19, fiber: 9, sodium: 760 },
  },
  {
    id: 'kati-roll',
    name: 'Kati Roll',
    category: 'Anchors',
    price: 7.99,
    desc: 'Kolkata-style flaky paratha roll stuffed with a spiced filling, onions and tangy chutney.',
    veg: true,
    vegan: false,
    proteins: ['paneer'],
    popular: false,
    available: true,
    statusNote: 'Low stock',
    spice: 2,
    nutrition: { calories: 510, protein: 17, carbs: 55, fat: 24, fiber: 5, sodium: 830 },
  },

  // ── Pinch Hitters ────────────────────────────────────────
  {
    id: 'samosa',
    name: 'Samosa',
    category: 'Pinch Hitters',
    price: null,
    desc: 'Crisp golden pastry stuffed with potato and mild spices — the classic opening partnership.',
    veg: true,
    vegan: true,
    proteins: ['potato'],
    popular: true,
    available: true,
    spice: 1,
    nutrition: { calories: 260, protein: 5, carbs: 32, fat: 12, fiber: 4, sodium: 420 },
  },
  {
    id: 'vada-pav',
    name: 'Vada Pav',
    category: 'Pinch Hitters',
    price: null,
    desc: "Mumbai's famous potato fritter tucked inside a soft bun with spices and chutney.",
    veg: true,
    vegan: true,
    proteins: ['potato'],
    popular: true,
    available: true,
    spice: 2,
    nutrition: { calories: 330, protein: 7, carbs: 48, fat: 12, fiber: 5, sodium: 520 },
  },

  // ── Thirst Quenchers ─────────────────────────────────────
  {
    id: 'masala-tea',
    name: 'Masala Tea',
    category: 'Thirst Quenchers',
    price: 2.99,
    desc: 'Hot chai brewed with crushed spices, ginger and milk.',
    veg: true,
    vegan: false,
    proteins: ['dairy'],
    popular: true,
    available: true,
    spice: 0,
    nutrition: { calories: 90, protein: 3, carbs: 12, fat: 3, fiber: 0, sodium: 60 },
  },
  {
    id: 'sweet-lassi',
    name: 'Sweet Lassi',
    category: 'Thirst Quenchers',
    price: 3.99,
    desc: 'Chilled yogurt smoothie, lightly sweetened and silky smooth.',
    veg: true,
    vegan: false,
    proteins: ['dairy'],
    popular: false,
    available: true,
    statusNote: 'Low stock',
    spice: 0,
    nutrition: { calories: 180, protein: 6, carbs: 30, fat: 4, fiber: 0, sodium: 90 },
  },
  {
    id: 'shikanji',
    name: 'Shikanji / Lemonade',
    category: 'Thirst Quenchers',
    price: null,
    desc: 'Desi-style lemonade with roasted cumin, black salt and fresh lime.',
    veg: true,
    vegan: true,
    proteins: ['none'],
    popular: false,
    available: false,
    statusNote: 'Sold out',
    spice: 0,
    nutrition: { calories: 70, protein: 0, carbs: 18, fat: 0, fiber: 0, sodium: 210 },
  },
  {
    id: 'majjiga',
    name: 'Majjiga (Chaach)',
    category: 'Thirst Quenchers',
    price: null,
    desc: 'Chilled buttermilk infused with cilantro and dry ginger — light and cooling.',
    veg: true,
    vegan: false,
    proteins: ['dairy'],
    popular: false,
    available: false,
    statusNote: 'Sold out',
    spice: 0,
    nutrition: { calories: 60, protein: 3, carbs: 5, fat: 2, fiber: 0, sodium: 180 },
  },
  {
    id: 'bottled-water',
    name: 'Bottled Water',
    category: 'Thirst Quenchers',
    price: 0.99,
    desc: 'Ice-cold bottled water.',
    veg: true,
    vegan: true,
    proteins: ['none'],
    popular: false,
    available: true,
    spice: 0,
    nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 },
  },
  {
    id: 'soft-drinks',
    name: 'Soft Drinks',
    category: 'Thirst Quenchers',
    price: 1.99,
    desc: 'Assorted canned sodas, served cold.',
    veg: true,
    vegan: true,
    proteins: ['none'],
    popular: false,
    available: true,
    spice: 0,
    nutrition: { calories: 150, protein: 0, carbs: 39, fat: 0, fiber: 0, sodium: 45 },
  },

  // ── Tail Enders ──────────────────────────────────────────
  {
    id: 'protein-balls',
    name: 'Protein Balls',
    category: 'Tail Enders',
    price: 1.99,
    desc: 'C@B special power-packed protein balls — the perfect finishing shot.',
    veg: true,
    vegan: false,
    proteins: ['mixed'],
    popular: true,
    available: true,
    spice: 0,
    nutrition: { calories: 160, protein: 8, carbs: 14, fat: 8, fiber: 3, sodium: 75 },
  },
  {
    id: 'chips',
    name: 'Chips',
    category: 'Tail Enders',
    price: 0.99,
    desc: 'Crunchy side chips — a simple, solid last wicket.',
    veg: true,
    vegan: true,
    proteins: ['none'],
    popular: false,
    available: true,
    spice: 0,
    nutrition: { calories: 150, protein: 2, carbs: 15, fat: 10, fiber: 1, sodium: 170 },
  },

  // ── Other items ──────────────────────────────────────────
  {
    id: 'potato-fries',
    name: 'Potato Fries',
    category: 'Other items',
    price: 2.49,
    desc: 'Hot, golden fries with a light sprinkle of seasoning.',
    veg: true,
    vegan: true,
    proteins: ['potato'],
    popular: false,
    available: true,
    spice: 0,
    nutrition: { calories: 320, protein: 4, carbs: 41, fat: 15, fiber: 4, sodium: 290 },
  },
  {
    id: 'fermented-rice',
    name: 'Fermented Rice',
    category: 'Other items',
    price: 3.99,
    desc: 'Cooling curd-style fermented rice — a traditional, gut-friendly comfort bowl.',
    veg: true,
    vegan: false,
    proteins: ['dairy'],
    popular: false,
    available: true,
    spice: 0,
    nutrition: { calories: 280, protein: 7, carbs: 52, fat: 4, fiber: 2, sodium: 310 },
  },
]

// ── Combo presets (only priced items so totals are exact) ────
export interface ComboPreset {
  id: string
  name: string
  people: number
  blurb: string
  items: { id: string; qty: number }[]
}

export const COMBO_PRESETS: ComboPreset[] = [
  {
    id: 'solo-innings',
    name: 'Solo Innings',
    people: 1,
    blurb: 'One player, full stomach.',
    items: [
      { id: 'falawrap', qty: 1 },
      { id: 'masala-tea', qty: 1 },
      { id: 'protein-balls', qty: 1 },
    ],
  },
  {
    id: 'opening-partnership',
    name: 'Opening Partnership',
    people: 2,
    blurb: 'Built for two at the crease.',
    items: [
      { id: 'fusion-tacos', qty: 2 },
      { id: 'masala-tea', qty: 2 },
      { id: 'chips', qty: 1 },
    ],
  },
  {
    id: 'family-stand',
    name: 'Family Stand',
    people: 4,
    blurb: 'Feeds the whole cheering section.',
    items: [
      { id: 'cab-wrap', qty: 2 },
      { id: 'mediterranean-platter', qty: 2 },
      { id: 'soft-drinks', qty: 4 },
      { id: 'protein-balls', qty: 2 },
      { id: 'potato-fries', qty: 2 },
    ],
  },
  {
    id: 'full-squad',
    name: 'Full Squad XI',
    people: 6,
    blurb: 'Team dinner after the match.',
    items: [
      { id: 'falawrap', qty: 3 },
      { id: 'kati-roll', qty: 3 },
      { id: 'bean-tacos', qty: 4 },
      { id: 'sweet-lassi', qty: 3 },
      { id: 'soft-drinks', qty: 3 },
      { id: 'chips', qty: 3 },
      { id: 'protein-balls', qty: 4 },
    ],
  },
]

export const TRUCK = {
  name: 'Chill At Boundary',
  address: '326 Rio Park Dr, Liberty Hill, TX 78642',
  phone: '+1 512-270-0274',
  phoneHref: 'tel:+15122700274',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=326+Rio+Park+Dr+Liberty+Hill+TX+78642',
  orderUrl:
    'https://chill-at-boundary.square.site/?location_id=L17JB16B9B0HJ&fulfillment=PICKUP',
}

export function getItem(id: string): MenuItem | undefined {
  return MENU.find((m) => m.id === id)
}

export function formatPrice(p: number | null): string {
  return p === null ? 'At truck' : `$${p.toFixed(2)}`
}
