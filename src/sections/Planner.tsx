import { useMemo, useState } from 'react'
import { COMBO_PRESETS, MENU, formatPrice, getItem } from '@/data/menu'
import { STRIPE_LINKS, isStripeLive } from '@/data/payments'
import { TAX_RATE, calcTotals, usePlanner } from '@/state/PlannerContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Check,
  ClipboardList,
  Copy,
  CreditCard,
  Crown,
  Minus,
  Plus,
  Share2,
  Trash2,
  Users,
} from 'lucide-react'

function money(n: number) {
  return `$${n.toFixed(2)}`
}

/* ── qty stepper ──────────────────────────────────────────── */
function QtyStepper({
  qty,
  onChange,
  small = false,
}: {
  qty: number
  onChange: (qty: number) => void
  small?: boolean
}) {
  const btn = small ? 'h-6 w-6' : 'h-7 w-7'
  const ic = small ? 'h-3 w-3' : 'h-3.5 w-3.5'
  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" className={`${btn} text-primary`} onClick={() => onChange(qty - 1)}>
        <Minus className={ic} />
      </Button>
      <span className={`${small ? 'w-5 text-sm' : 'w-7'} text-center font-semibold text-foreground`}>{qty}</span>
      <Button size="icon" variant="ghost" className={`${btn} text-primary`} onClick={() => onChange(qty + 1)}>
        <Plus className={ic} />
      </Button>
    </div>
  )
}

/* ── share text builder ───────────────────────────────────── */
function buildShareText(lines: { id: string; qty: number }[], people: number): string {
  const { total, unpricedCount } = calcTotals(lines)
  const rows = lines
    .map((l) => {
      const item = getItem(l.id)
      if (!item) return null
      const price = item.price === null ? 'price TBD' : money(item.price * l.qty)
      return `${item.name} x${l.qty}  ${price}`
    })
    .filter(Boolean)
  const perPerson = people > 0 ? total / people : total
  return [
    '🏏 C@B SCORECARD — order plan',
    '────────────────────',
    ...rows,
    '────────────────────',
    `TOTAL: ${money(total)}${unpricedCount ? ` (+${unpricedCount} item(s), price TBD)` : ''}`,
    `Squad: ${people} → ${money(perPerson)} each`,
    `Pickup: 326 Rio Park Dr, Liberty Hill, TX`,
    `Pay online with Stripe — secure checkout`,
  ].join('\n')
}

/* ── Scorecard (planned order) ────────────────────────────── */
function Scorecard() {
  const { lines, people, setQty, setPeople, clearOrder } = usePlanner()
  const [copied, setCopied] = useState(false)
  const totals = useMemo(() => calcTotals(lines), [lines])
  const tax = totals.total * TAX_RATE
  const perPerson = people > 0 ? (totals.total + tax) / people : 0

  const share = async (channel: 'copy' | 'whatsapp') => {
    const text = buildShareText(lines, people)
    if (channel === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.prompt('Copy your scorecard:', text)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-primary/30 bg-card card-glow">
      <div className="border-b border-border p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display flex items-center gap-2 text-xl text-primary">
            <ClipboardList className="h-5 w-5" /> YOUR SCORECARD
          </h3>
          {lines.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearOrder} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Clear
            </Button>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Add items from the menu — all orders are prepaid online with Stripe.
        </p>
      </div>

      <div className="flex-1 p-5">
        {lines.length === 0 ? (
          <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">No runs on the board yet.</p>
            <a href="#menu" className="mt-2 text-sm font-semibold text-primary hover:underline">
              Add items from the menu →
            </a>
          </div>
        ) : (
          <ul className="space-y-3">
            {lines.map((l) => {
              const item = getItem(l.id)
              if (!item) return null
              return (
                <li key={l.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatPrice(item.price)}
                      {item.price !== null && ` each`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <QtyStepper qty={l.qty} onChange={(q) => setQty(l.id, q)} />
                    <span className="w-14 text-right text-sm font-semibold text-primary">
                      {item.price === null ? '—' : money(item.price * l.qty)}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {lines.length > 0 && (
        <div className="border-t border-border p-5">
          <div className="mb-4 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary" /> Feeding how many?
            </span>
            <QtyStepper qty={people} onChange={setPeople} />
          </div>

          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <dt>Subtotal ({totals.itemCount} items)</dt>
              <dd>{money(totals.total)}</dd>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Est. tax (8.25%)</dt>
              <dd>{money(tax)}</dd>
            </div>
            {totals.unpricedCount > 0 && (
              <p className="text-xs text-amber-400">
                + {totals.unpricedCount} item(s) with price to be confirmed
              </p>
            )}
            <div className="flex justify-between border-t border-border pt-2 font-display text-lg">
              <dt className="text-foreground">TOTAL</dt>
              <dd className="text-primary">{money(totals.total + tax)}</dd>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <dt>Per person ({people})</dt>
              <dd className="font-semibold text-foreground">{money(perPerson)}</dd>
            </div>
          </dl>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" onClick={() => share('copy')} className="border-primary/40 text-primary hover:bg-primary/10">
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
              {copied ? 'Copied!' : 'Copy Scorecard'}
            </Button>
            <Button variant="outline" size="sm" onClick={() => share('whatsapp')} className="border-primary/40 text-primary hover:bg-primary/10">
              <Share2 className="mr-1.5 h-3.5 w-3.5" /> WhatsApp
            </Button>
          </div>
          <div className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-center text-xs text-muted-foreground">
            Custom orders are invoiced by secure Stripe link — or{' '}
            <a href="#prepaid" className="font-semibold text-primary hover:underline">
              pick a prepaid combo to pay now →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── one combo column ─────────────────────────────────────── */
function ComboCard({ slot, cheapest }: { slot: number; cheapest: boolean }) {
  const { combos, setCombo, loadPreset, addToCombo, setComboQty, setComboPeople, loadComboIntoOrder } =
    usePlanner()
  const combo = combos[slot]
  const totals = useMemo(() => (combo ? calcTotals(combo.lines) : null), [combo])
  const perPerson = combo && totals ? totals.total / Math.max(1, combo.people) : 0

  if (!combo) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border p-5 text-center">
        <p className="text-sm text-muted-foreground">Empty slot — load a preset or start from scratch.</p>
        <div className="flex flex-wrap justify-center gap-2">
          {COMBO_PRESETS.map((p) => (
            <Button key={p.id} variant="outline" size="sm" onClick={() => loadPreset(slot, p)} className="border-primary/40 text-primary hover:bg-primary/10">
              {p.name}
            </Button>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setCombo(slot, { name: `Combo ${'ABC'[slot]}`, people: 2, lines: [] })}>
          Start empty combo
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`flex h-full flex-col rounded-xl border p-5 ${
        cheapest ? 'border-primary bg-primary/5 card-glow' : 'border-border bg-card'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <Input
          value={combo.name}
          onChange={(e) => setCombo(slot, { ...combo, name: e.target.value })}
          className="h-8 border-transparent bg-transparent font-display text-base text-foreground focus:border-primary/50"
        />
        {cheapest && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            <Crown className="h-3 w-3" /> Best value
          </span>
        )}
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-1.5">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-primary" /> People
        </span>
        <QtyStepper small qty={combo.people} onChange={(n) => setComboPeople(slot, n)} />
      </div>

      <ul className="mb-3 flex-1 space-y-2">
        {combo.lines.length === 0 && (
          <li className="py-4 text-center text-xs text-muted-foreground">No items yet — add some below.</li>
        )}
        {combo.lines.map((l) => {
          const item = getItem(l.id)
          if (!item) return null
          return (
            <li key={l.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="truncate text-foreground">{item.name}</span>
              <div className="flex items-center gap-2">
                <QtyStepper small qty={l.qty} onChange={(q) => setComboQty(slot, l.id, q)} />
                <span className="w-12 text-right text-xs font-semibold text-primary">
                  {item.price === null ? '—' : money(item.price * l.qty)}
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <Select onValueChange={(id) => addToCombo(slot, id)}>
        <SelectTrigger className="mb-3 h-9 text-xs">
          <SelectValue placeholder="+ Add an item…" />
        </SelectTrigger>
        <SelectContent>
          {MENU.filter((m) => m.available).map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name} · {formatPrice(m.price)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="space-y-1 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total</span>
          <span className="font-display text-lg text-primary">{money(totals?.total ?? 0)}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Per person ({combo.people})</span>
          <span className="font-semibold text-foreground">{money(perPerson)}</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={() => loadComboIntoOrder(combo)} className="border-primary/40 text-primary hover:bg-primary/10">
          Use this
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setCombo(slot, null)} className="text-muted-foreground hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}

/* ── prepaid combos (Stripe Payment Links) ────────────────── */
function PrepaidCombos() {
  return (
    <div id="prepaid" className="mb-10 scroll-mt-24">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-xl text-foreground">PREPAID COMBOS — PAY ONLINE</h3>
        <p className="text-xs text-muted-foreground">
          Secure checkout by Stripe · card, Apple Pay & Google Pay · pay now, pick up at the window
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {COMBO_PRESETS.map((p) => {
          const totals = calcTotals(p.items.map((it) => ({ id: it.id, qty: it.qty })))
          const live = isStripeLive(p.id)
          return (
            <div key={p.id} className="flex flex-col rounded-xl border border-primary/30 bg-card p-5 card-glow">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-base text-primary">{p.name}</h4>
                <span className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
                  <Users className="h-3 w-3" /> {p.people}p
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.blurb}</p>
              <ul className="mt-3 flex-1 space-y-1 text-xs text-muted-foreground">
                {p.items.map((it) => {
                  const item = getItem(it.id)
                  return item ? (
                    <li key={it.id} className="flex justify-between">
                      <span className="truncate">{item.name}</span>
                      <span className="ml-2 shrink-0">×{it.qty}</span>
                    </li>
                  ) : null
                })}
              </ul>
              <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">
                  Total <span className="text-[10px]">(+ tax at checkout)</span>
                </span>
                <span className="font-display text-xl text-primary">{money(totals.total)}</span>
              </div>
              {live ? (
                <Button asChild className="mt-3 w-full font-semibold">
                  <a href={STRIPE_LINKS[p.id]} target="_blank" rel="noreferrer">
                    <CreditCard className="mr-1.5 h-4 w-4" /> Pay with Stripe
                  </a>
                </Button>
              ) : (
                <Button disabled variant="secondary" className="mt-3 w-full">
                  <CreditCard className="mr-1.5 h-4 w-4" /> Online pay launching soon
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── section ──────────────────────────────────────────────── */
export default function Planner() {
  const { combos } = usePlanner()

  // cheapest per-person among combos that have priced items
  const cheapestSlot = useMemo(() => {
    let best = -1
    let bestVal = Infinity
    combos.forEach((c, i) => {
      if (!c || c.lines.length === 0) return
      const t = calcTotals(c.lines)
      if (t.total <= 0) return
      const pp = t.total / Math.max(1, c.people)
      if (pp < bestVal) {
        bestVal = pp
        best = i
      }
    })
    return best
  }, [combos])

  return (
    <section id="planner" className="relative mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Game plan</p>
        <h2 className="font-display mt-2 text-4xl sm:text-5xl">PLAN THE ORDER</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
          Compare meal combinations side by side, split the cost per person, then send
          the scorecard to your squad before heading to Rio Park Dr.
        </p>
      </div>

      <PrepaidCombos />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Scorecard />

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-display text-xl text-foreground">COMBO COMPARISON</h3>
            <div className="flex flex-wrap gap-2">
              {COMBO_PRESETS.map((p) => (
                <PresetButton key={p.id} presetId={p.id} />
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((slot) => (
              <ComboCard key={slot} slot={slot} cheapest={slot === cheapestSlot} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Totals exclude sales tax and items priced at the truck. Load any combo into
            your scorecard with "Use this".
          </p>
        </div>
      </div>
    </section>
  )
}

function PresetButton({ presetId }: { presetId: string }) {
  const { combos, loadPreset } = usePlanner()
  const preset = COMBO_PRESETS.find((p) => p.id === presetId)!
  const firstEmpty = combos.findIndex((c) => c === null)
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={firstEmpty === -1}
      onClick={() => loadPreset(firstEmpty, preset)}
      className="border-border text-xs text-muted-foreground hover:border-primary/50 hover:text-primary"
      title={preset.blurb}
    >
      + {preset.name} ({preset.people}p)
    </Button>
  )
}
