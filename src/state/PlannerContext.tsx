import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { getItem, type ComboPreset } from '@/data/menu'

export interface OrderLine {
  id: string
  qty: number
}

export interface Combo {
  name: string
  people: number
  lines: OrderLine[]
}

interface PlannerState {
  // Scorecard (the planned order)
  lines: OrderLine[]
  people: number
  addItem: (id: string) => void
  removeItem: (id: string) => void
  setQty: (id: string, qty: number) => void
  setPeople: (n: number) => void
  clearOrder: () => void
  loadComboIntoOrder: (combo: Combo) => void
  // Combo comparison (up to 3 slots)
  combos: (Combo | null)[]
  setCombo: (slot: number, combo: Combo | null) => void
  loadPreset: (slot: number, preset: ComboPreset) => void
  addToCombo: (slot: number, id: string) => void
  setComboQty: (slot: number, id: string, qty: number) => void
  setComboPeople: (slot: number, n: number) => void
}

const PlannerContext = createContext<PlannerState | null>(null)

function bump(lines: OrderLine[], id: string, delta: number): OrderLine[] {
  const existing = lines.find((l) => l.id === id)
  if (!existing) {
    return delta > 0 ? [...lines, { id, qty: delta }] : lines
  }
  const qty = existing.qty + delta
  if (qty <= 0) return lines.filter((l) => l.id !== id)
  return lines.map((l) => (l.id === id ? { ...l, qty } : l))
}

function setQtyIn(lines: OrderLine[], id: string, qty: number): OrderLine[] {
  if (qty <= 0) return lines.filter((l) => l.id !== id)
  const existing = lines.find((l) => l.id === id)
  if (!existing) return [...lines, { id, qty }]
  return lines.map((l) => (l.id === id ? { ...l, qty } : l))
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([])
  const [people, setPeople] = useState(2)
  const [combos, setCombos] = useState<(Combo | null)[]>([null, null, null])

  const value = useMemo<PlannerState>(
    () => ({
      lines,
      people,
      addItem: (id) => {
        const item = getItem(id)
        if (!item || !item.available) return
        setLines((ls) => bump(ls, id, 1))
      },
      removeItem: (id) => setLines((ls) => bump(ls, id, -1)),
      setQty: (id, qty) => setLines((ls) => setQtyIn(ls, id, qty)),
      setPeople: (n) => setPeople(Math.max(1, Math.min(24, n))),
      clearOrder: () => setLines([]),
      loadComboIntoOrder: (combo) => {
        setLines(combo.lines.filter((l) => l.qty > 0))
        setPeople(combo.people)
      },
      combos,
      setCombo: (slot, combo) =>
        setCombos((cs) => cs.map((c, i) => (i === slot ? combo : c))),
      loadPreset: (slot, preset) =>
        setCombos((cs) =>
          cs.map((c, i) =>
            i === slot
              ? {
                  name: preset.name,
                  people: preset.people,
                  lines: preset.items.map((it) => ({ id: it.id, qty: it.qty })),
                }
              : c,
          ),
        ),
      addToCombo: (slot, id) =>
        setCombos((cs) =>
          cs.map((c, i) => {
            if (i !== slot) return c
            const base: Combo = c ?? { name: `Combo ${'ABC'[slot]}`, people: 2, lines: [] }
            return { ...base, lines: bump(base.lines, id, 1) }
          }),
        ),
      setComboQty: (slot, id, qty) =>
        setCombos((cs) =>
          cs.map((c, i) =>
            i === slot && c ? { ...c, lines: setQtyIn(c.lines, id, qty) } : c,
          ),
        ),
      setComboPeople: (slot, n) =>
        setCombos((cs) =>
          cs.map((c, i) =>
            i === slot && c
              ? { ...c, people: Math.max(1, Math.min(24, n)) }
              : c,
          ),
        ),
    }),
    [lines, people, combos],
  )

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner(): PlannerState {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used inside PlannerProvider')
  return ctx
}

// ── Totals helpers ───────────────────────────────────────────
export interface Totals {
  total: number
  unpricedCount: number
  itemCount: number
}

export function calcTotals(lines: OrderLine[]): Totals {
  let total = 0
  let unpricedCount = 0
  let itemCount = 0
  for (const l of lines) {
    const item = getItem(l.id)
    if (!item) continue
    itemCount += l.qty
    if (item.price === null) unpricedCount += l.qty
    else total += item.price * l.qty
  }
  return { total, unpricedCount, itemCount }
}

export const TAX_RATE = 0.0825 // Texas sales tax estimate
