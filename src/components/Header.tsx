import { TRUCK } from '@/data/menu'
import { usePlanner, calcTotals } from '@/state/PlannerContext'
import { Button } from '@/components/ui/button'
import { Phone, ClipboardList } from 'lucide-react'

export default function Header() {
  const { lines } = usePlanner()
  const count = calcTotals(lines).itemCount

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-display text-lg tracking-wide">
          C<span className="text-primary">@</span>B
          <span className="ml-2 hidden text-xs font-normal uppercase tracking-[0.25em] text-muted-foreground sm:inline">
            Chill At Boundary
          </span>
        </a>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#menu" className="transition-colors hover:text-primary">Menu</a>
          <a href="#planner" className="transition-colors hover:text-primary">Order Planner</a>
          <a href="#visit" className="transition-colors hover:text-primary">Find Us</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="text-primary md:hidden">
            <a href={TRUCK.phoneHref} aria-label="Call the truck">
              <Phone className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="sm" className="relative font-semibold">
            <a href="#planner">
              <ClipboardList className="mr-1.5 h-4 w-4" />
              Scorecard
              {count > 0 && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-[11px] font-bold text-primary">
                  {count}
                </span>
              )}
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
