import { useMemo, useState } from 'react'
import { CATEGORIES, MENU, type Category, type Protein } from '@/data/menu'
import MenuCard from '@/components/MenuCard'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Leaf, RotateCcw, Search, Trophy } from 'lucide-react'

const PROTEIN_FILTERS: Protein[] = ['paneer', 'tofu', 'chickpeas', 'black beans']
const MAX_PRICE = 10

export default function MenuBrowser() {
  const [category, setCategory] = useState<Category | 'All'>('All')
  const [vegOnly, setVegOnly] = useState(false)
  const [veganOnly, setVeganOnly] = useState(false)
  const [popularOnly, setPopularOnly] = useState(false)
  const [proteins, setProteins] = useState<Protein[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE])
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return MENU.filter((item) => {
      if (category !== 'All' && item.category !== category) return false
      if (vegOnly && !item.veg) return false
      if (veganOnly && !item.vegan) return false
      if (popularOnly && !item.popular) return false
      if (proteins.length > 0 && !proteins.some((p) => item.proteins.includes(p))) return false
      if (item.price !== null && (item.price < priceRange[0] || item.price > priceRange[1])) return false
      if (query && !`${item.name} ${item.desc}`.toLowerCase().includes(query.toLowerCase())) return false
      return true
    })
  }, [category, vegOnly, veganOnly, popularOnly, proteins, priceRange, query])

  const reset = () => {
    setCategory('All')
    setVegOnly(false)
    setVeganOnly(false)
    setPopularOnly(false)
    setProteins([])
    setPriceRange([0, MAX_PRICE])
    setQuery('')
  }

  const grouped = useMemo(() => {
    const map = new Map<Category, typeof filtered>()
    for (const cat of CATEGORIES) map.set(cat.name, [])
    for (const item of filtered) map.get(item.category)?.push(item)
    return map
  }, [filtered])

  return (
    <section id="menu" className="stadium-grid relative mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Step up to the crease</p>
        <h2 className="font-display mt-2 text-4xl sm:text-5xl">THE MENU</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Every category is a position in the batting order. Filter by diet, protein and
          price — everything is vegetarian, with plenty of vegan plays.
        </p>
      </div>

      {/* category tabs */}
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1">
        {(['All', ...CATEGORIES.map((c) => c.name)] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              category === cat
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* filter bar */}
      <div className="mb-10 grid gap-5 rounded-xl border border-border bg-card/80 p-5 backdrop-blur-sm lg:grid-cols-4">
        {/* search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu…"
            className="pl-9"
          />
        </div>

        {/* diet toggles */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2">
            <Switch id="veg" checked={vegOnly} onCheckedChange={setVegOnly} />
            <Label htmlFor="veg" className="flex cursor-pointer items-center gap-1 text-sm">
              Vegetarian
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="vegan" checked={veganOnly} onCheckedChange={setVeganOnly} />
            <Label htmlFor="vegan" className="flex cursor-pointer items-center gap-1 text-sm">
              <Leaf className="h-3.5 w-3.5 text-emerald-400" /> Vegan
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="popular" checked={popularOnly} onCheckedChange={setPopularOnly} />
            <Label htmlFor="popular" className="flex cursor-pointer items-center gap-1 text-sm">
              <Trophy className="h-3.5 w-3.5 text-primary" /> Crowd favorites
            </Label>
          </div>
        </div>

        {/* protein chips */}
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">Primary protein</p>
          <div className="flex flex-wrap gap-1.5">
            {PROTEIN_FILTERS.map((p) => {
              const active = proteins.includes(p)
              return (
                <button
                  key={p}
                  onClick={() =>
                    setProteins((ps) => (active ? ps.filter((x) => x !== p) : [...ps, p]))
                  }
                  className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    active
                      ? 'border-primary bg-primary/20 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>
        </div>

        {/* price range */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Price range</p>
            <span className="text-xs font-semibold text-primary">
              ${priceRange[0].toFixed(0)} – ${priceRange[1].toFixed(0)}
              {priceRange[1] >= MAX_PRICE ? '+' : ''}
            </span>
          </div>
          <div className="space-y-2 pt-1">
            <Slider
              value={[priceRange[0]]}
              min={0}
              max={MAX_PRICE}
              step={1}
              onValueChange={([v]) => setPriceRange(([_, hi]) => [Math.min(v, hi), hi])}
            />
            <Slider
              value={[priceRange[1]]}
              min={0}
              max={MAX_PRICE}
              step={1}
              onValueChange={([v]) => setPriceRange(([lo]) => [lo, Math.max(v, lo)])}
            />
          </div>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filtered.length}</span> of {MENU.length} items
        </p>
        <Button variant="ghost" size="sm" onClick={reset} className="text-muted-foreground hover:text-primary">
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset filters
        </Button>
      </div>

      {/* grouped grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
          Bowled out — no items match those filters. Try loosening them.
        </div>
      ) : (
        CATEGORIES.map((cat) => {
          const items = grouped.get(cat.name) ?? []
          if (items.length === 0) return null
          return (
            <div key={cat.name} className="mb-12">
              <div className="mb-5 flex items-baseline gap-3">
                <h3 className="font-display text-2xl text-primary">{cat.name}</h3>
                <p className="hidden text-sm text-muted-foreground sm:block">{cat.tagline}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          )
        })
      )}
    </section>
  )
}
