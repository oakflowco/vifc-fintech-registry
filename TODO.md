# TODO

## Premium Features Roadmap

### Phase 1: Quick Wins (no AI, no external services)

- [ ] **Unified Search & Filtering** — `/search` page that queries across all 5 registries (fintech, investors, banks, securities, insurance). Filters by category, status, city, license type. Premium: advanced filters + export results.
- [ ] **Company Profiles** — `/company/[id]` dynamic pages. Click any row in a registry → detail page with overview, license info, category, HQ, website, and links to related entities. Data sourced from existing Google Sheets with added columns.
- [ ] **Downloadable Country Report** — `/api/report` generates a PDF combining macro data (GDP, FDI, VN-Index), registry stats, regulatory timeline, and ASEAN comparison. Premium-only download.

### Phase 2: ESG & Country Screening (needs additional data sources)

- [ ] **ESG Tags on Registries** — Add ESG-relevant columns to Google Sheets: `Green Finance`, `Social Impact`, `Governance Score`, `SDG Alignment`. Display as badges on registry tables and company profiles.
- [ ] **Country ESG Risk Screening** — `/esg` dashboard comparing Vietnam vs ASEAN on ESG metrics (World Bank ESG data, SDG indicators). Heatmap + radar chart. Premium feature.
- [ ] **SDG Alignment Mapping** — Tag companies and sectors to UN SDG goals. Filterable view showing which SDGs are covered by Vietnam's fintech ecosystem.

### Phase 3: AI-Powered Features (needs AI Gateway + model access)

- [ ] **AI ESG Analysis** — Upload a company report (PDF/DOCX) → AI extracts ESG risk terms, sentiment, and key findings. Uses AI SDK + AI Gateway. Premium feature.
- [ ] **Document Upload & Analysis** — `/analyze` page with file upload. Processes annual reports, sustainability reports, due diligence docs. Returns structured ESG insights, risk flags, and recommendations.
- [ ] **AI Company Summaries** — Auto-generate company profile summaries from uploaded docs + registry data.

### Phase 4: API Access (needs auth + rate limiting)

- [ ] **Public REST API** — `/api/v1/registry`, `/api/v1/companies`, `/api/v1/esg`, `/api/v1/macro`. API key auth for premium users. Rate limited.
- [ ] **API Documentation Page** — `/api-docs` with endpoint reference, example requests, and usage limits.
- [ ] **API Key Management** — Generate/revoke API keys from account page.

---

## Infrastructure (Pending)

### Google Sheets Write Integration
**Blocked on**: Google Service Account setup

#### Prerequisites
1. Create Google Cloud project (or reuse existing)
2. Enable Google Sheets API
3. Create Service Account and download JSON key
4. Share each Google Sheet with the service account email (as Editor)
5. Add env vars: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

#### Features to build once unblocked
- [ ] **`/join` page** — Public submission form for fintech companies to self-register
- [ ] **`POST /api/intake`** — Authenticated API endpoint for partner data intake

### Payment & Subscription
- [ ] **Upstash Redis** — Set up via Vercel Marketplace for user storage
- [ ] **Stripe integration** — To be added later alongside MoMo

### Auth Improvements
- [ ] Email verification on signup
- [ ] Password reset flow
