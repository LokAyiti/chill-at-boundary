import { useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, type MenuItem } from '@/data/menu'
import { usePlanner } from '@/state/PlannerContext'
import { Flame, Leaf, Minus, Plus, Trophy, ChevronDown, CircleDot } from 'lucide-react'

const SPICE_LABEL = ['Mild', 'Mild+', 'Medium', 'Hot']

export default function MenuCard({ item }: { item: MenuItem }) {
  const { lines, addItem, removeItem } = usePlanner()
  const [showNutrition, setShowNutrition] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const qty = lines.find((l) => l.id === item.id)?.qty ?? 0

  // 3D tilt on pointer
  const onMove = (e: React.PointerEvent) => {
    const el = cardRef.current
    if (!el || e.pointerType === 'touch') return
    const r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -7
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 9
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'rotateX(0) rotateY(0)'
  }

  const n = item.nutrition

  return (
    <div className="perspective-800">
      <div
        ref={cardRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className={`preserve-3d relative flex h-full flex-col rounded-xl border bg-card p-5 transition-transform duration-150 ease-out ${
          item.available ? 'border-border hover:border-primary/50 hover:card-glow' : 'border-border opacity-60'
        }`}
      >
        {/* badges */}
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          {item.popular && (
            <Badge className="gap-1 bg-primary text-primary-foreground hover:bg-primary">
              <Trophy className="h-3 w-3" /> Crowd Favorite
            </Badge>
          )}
          {item.vegan ? (
            <Badge variant="outline" className="gap-1 border-emerald-500/50 text-emerald-400">
              <Leaf className="h-3 w-3" /> Vegan
            </Badge>
          ) : item.veg ? (
            <Badge variant="outline" className="gap-1 border-emerald-600/40 text-emerald-500">
              <CircleDot className="h-3 w-3" /> Veg
            </Badge>
          ) : null}
          {item.spice > 0 && (
            <Badge variant="outline" className="gap-1 border-accent/50 text-accent">
              <Flame className="h-3 w-3" /> {SPICE_LABEL[item.spice]}
            </Badge>
          )}
          {item.statusNote && (
            <Badge
              variant="outline"
              className={
                item.statusNote === 'Sold out'
                  ? 'border-destructive/60 text-destructive'
                  : 'border-amber-500/50 text-amber-400'
              }
            >
              {item.statusNote}
            </Badge>
          )}
        </div>

        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg tracking-wide text-foreground">{item.name}</h3>
          <span className="shrink-0 font-display text-lg text-primary">{formatPrice(item.price)}</span>
        </div>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>

        {/* protein tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {item.proteins
            .filter((p) => p !== 'none')
            .map((p) => (
              <span key={p} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                {p}
              </span>
            ))}
        </div>

        {/* nutrition toggle */}
        <button
          onClick={() => setShowNutrition((s) => !s)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showNutrition ? 'rotate-180' : ''}`} />
          Nutrition (estimated) · {n.calories} kcal · {n.protein}g protein
        </button>
        {showNutrition && (
          <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg border border-border bg-background/60 p-3 text-center">
            {[
              ['Calories', `${n.calories}`, 'kcal'],
              ['Protein', `${n.protein}`, 'g'],
              ['Carbs', `${n.carbs}`, 'g'],
              ['Fat', `${n.fat}`, 'g'],
              ['Fiber', `${n.fiber}`, 'g'],
              ['Sodium', `${n.sodium}`, 'mg'],
            ].map(([label, val, unit]) => (
              <div key={label}>
                <div className="font-display text-sm text-foreground">
                  {val}
                  <span className="ml-0.5 text-[10px] font-normal text-muted-foreground">{unit}</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
              </div>
            ))}
            <p className="col-span-3 mt-1 text-[10px] leading-snug text-muted-foreground">
              Estimated from standard ingredient data — ask at the truck for allergen details.
            </p>
          </div>
        )}

        {/* add to scorecard */}
        <div className="mt-4">
          {!item.available ? (
            <Button disabled variant="secondary" className="w-full">
              Back soon
            </Button>
          ) : qty === 0 ? (
            <Button onClick={() => addItem(item.id)} variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10">
              <Plus className="mr-1 h-4 w-4" /> Add to Scorecard
            </Button>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-primary/50 bg-primary/10 px-2 py-1">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => removeItem(item.id)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-display text-lg text-primary">{qty}</span>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-primary" onClick={() => addItem(item.id)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
