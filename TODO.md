# TODO

## Pending: Google Sheets Write Integration
**Blocked on**: Google Service Account setup

### Prerequisites
1. Create Google Cloud project (or reuse existing)
2. Enable Google Sheets API
3. Create Service Account and download JSON key
4. Share each Google Sheet with the service account email (as Editor)
5. Add env vars:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

### Features to build once unblocked
- [ ] **`/join` page** — Public submission form for fintech companies to self-register (appends to Fintech Google Sheet)
- [ ] **`POST /api/intake`** — Authenticated API endpoint for partner data intake (banks, investors, insurance, securities). Accepts JSON, appends to the correct Sheet. Secured with API key.

## Pending: Payment & Subscription
- [ ] **Upstash Redis** — Set up via Vercel Marketplace for user storage (replaces `data/users.json` which won't work on Vercel deployments)
- [ ] **Stripe integration** — To be added later alongside MoMo

## Pending: Auth Improvements
- [ ] Email verification on signup
- [ ] Password reset flow
