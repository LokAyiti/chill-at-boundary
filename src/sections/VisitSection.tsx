import { TRUCK } from '@/data/menu'
import { STRIPE_LINKS, isStripeLive } from '@/data/payments'
import { Button } from '@/components/ui/button'
import {
  CalendarClock,
  CreditCard,
  ExternalLink,
  Leaf,
  MapPin,
  Phone,
  PartyPopper,
} from 'lucide-react'

const HOURS: { day: string; time: string }[] = [
  { day: 'Mon – Thu', time: '11:00 AM – 6:00 PM' },
  { day: 'Fri – Sat', time: '11:00 AM – 8:00 PM' },
  { day: 'Sunday', time: '12:00 PM – 6:00 PM' },
]

export default function VisitSection() {
  return (
    <section id="visit" className="stadium-grid relative border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Home ground</p>
          <h2 className="font-display mt-2 text-4xl sm:text-5xl">FIND THE TRUCK</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* location */}
          <div className="rounded-xl border border-border bg-card p-6">
            <MapPin className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display text-lg">LOCATION</h3>
            <p className="mt-2 text-sm text-muted-foreground">{TRUCK.address}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Look for the truck under the lights — pickup window on the driver side.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 border-primary/40 text-primary hover:bg-primary/10">
              <a href={TRUCK.mapsUrl} target="_blank" rel="noreferrer">
                Get directions <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>

          {/* hours */}
          <div className="rounded-xl border border-border bg-card p-6">
            <CalendarClock className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display text-lg">HOURS</h3>
            <ul className="mt-2 space-y-1.5">
              {HOURS.map((h) => (
                <li key={h.day} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{h.day}</span>
                  <span className="font-medium text-foreground">{h.time}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-400">
              Hours can shift for events & weather — check the Square page before heading out.
            </p>
          </div>

          {/* contact + catering */}
          <div className="rounded-xl border border-border bg-card p-6">
            <PartyPopper className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-display text-lg">CATERING & CONTACT</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Match-day parties, office lunches, team events — we bring the full innings to you.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
                <a href={TRUCK.phoneHref}>
                  <Phone className="mr-1.5 h-3.5 w-3.5" /> {TRUCK.phone}
                </a>
              </Button>
              {isStripeLive('catering-deposit') ? (
                <Button asChild size="sm">
                  <a href={STRIPE_LINKS['catering-deposit']} target="_blank" rel="noreferrer">
                    <CreditCard className="mr-1.5 h-4 w-4" /> Pay $50 deposit
                  </a>
                </Button>
              ) : (
                <Button disabled size="sm" variant="secondary">
                  <CreditCard className="mr-1.5 h-4 w-4" /> $50 deposit — coming soon
                </Button>
              )}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Deposit goes toward your final catering bill. Refundable up to 48h before the event.
            </p>
          </div>
        </div>

        {/* diet promise strip */}
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-emerald-600/30 bg-emerald-950/20 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <Leaf className="h-8 w-8 text-emerald-400" />
            <div>
              <p className="font-display text-lg text-emerald-300">100% VEGETARIAN KITCHEN</p>
              <p className="text-sm text-muted-foreground">
                Most items can be made vegan — just ask at the window. Estimated nutrition is
                listed on every item.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10">
            <a href="#menu">Browse vegan options</a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-left">
        <div>
          <p className="font-display text-lg">
            CHILL AT <span className="text-primary">BOUNDARY</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Vegetarian & vegan Indian-fusion street food · Liberty Hill, TX
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          <p>
            Nutrition values are estimates. Online payments are processed securely by{' '}
            <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              Stripe
            </a>
            . All orders are paid online in advance.
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Chill At Boundary. Play your innings.</p>
        </div>
      </div>
    </footer>
  )
}
