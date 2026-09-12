// ─────────────────────────────────────────────────────────────
// Stripe Payment Links — no backend needed.
//
// HOW TO GO LIVE (owner steps, ~15 min):
// 1. Create your Stripe account at stripe.com
// 2. Dashboard → Products → "Add product" for each item below
//    (one-time price, no shipping — pickup only)
// 3. Dashboard → Payment Links → create a link per product
//    (turn ON "automatic tax" for Texas sales tax)
// 4. Paste each https://buy.stripe.com/... URL below and redeploy.
//
// ⚠️ NEVER put your Secret API key (sk_live_...) in this file or
// anywhere in the website code. Payment Links need no keys at all.
// ─────────────────────────────────────────────────────────────

export const STRIPE_LINKS: Record<string, string> = {
  'solo-innings': 'PASTE_PAYMENT_LINK_HERE', // Solo Innings — $12.97
  'opening-partnership': 'PASTE_PAYMENT_LINK_HERE', // Opening Partnership — $22.95
  'family-stand': 'PASTE_PAYMENT_LINK_HERE', // Family Stand — $50.88
  'full-squad': 'PASTE_PAYMENT_LINK_HERE', // Full Squad XI — $89.81
  'catering-deposit': 'PASTE_PAYMENT_LINK_HERE', // Catering deposit — $50.00
}

export const CATERING_DEPOSIT = 50.0

/** True once a real buy.stripe.com URL has been pasted in. */
export function isStripeLive(id: string): boolean {
  return (STRIPE_LINKS[id] ?? '').startsWith('https://buy.stripe.com/')
}
