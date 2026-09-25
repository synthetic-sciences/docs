# Documentation source map

Audit baseline: OpenScience `3b587c253`, account service `8961df0a` (September 26, 2026). The exact mirrored OpenScience revision and file hashes are recorded in `scripts/openscience-source.json` after synchronization.

## OpenScience

All guides, the scientific database catalog, scientific capability catalog, and bundled skill directory mirror the canonical repository. Its `docs/notes/documentation-map.md` maps pages to implementation and verification. Run its `test:docs`, documentation typecheck/build, and Playwright suite before syncing.

## Account and Graphs

Source paths below are relative to `synthetic-sciences/atlas`.

| Pages | Implementation and behavior |
| --- | --- |
| `index`, `quickstart`, `compatibility` | `AGENTS.md`, `frontend/src/App.tsx`, `backend/app/main.py`: current surfaces, retired product offers, mounted versus retained routes. |
| `authentication`, `api-keys` | `frontend/src/components/organizations/WorkspaceApiKeysSection.tsx`, `backend/app/routes/auth.py`, `backend/app/routes/organizations.py`; OpenScience `src/cli/cmd/connect.ts`: one-time secrets, pinned workspace, revocation, device versus pasted-key logout. |
| `workspaces` | `OrganizationShell.tsx`, `OrganizationMembersSection.tsx`, `OrganizationSettingsPage.tsx` under `frontend/src/components/organizations/`; `backend/app/services/organization_service.py`: membership, permissions, separate ownership transfer, member spend limits. |
| `shared-connections` | `OrganizationSharedCredentialsPage.tsx`, `frontend/src/components/pages/CliPage.tsx`, `backend/app/services/workspace_provider_credential_service.py`: shared scope and permission gates. |
| `billing` | `OrganizationBillingPage.tsx`, `OrganizationAcePage.tsx`, `backend/app/services/organization_auto_reload_service.py`, `ace_pricing_service.py`, `docs/ACE_PROVIDER_PRICING.md`: prepaid/promo access, fixed optional reloads, separate limits, direct versus OpenRouter fees. |
| `usage` | `frontend/src/components/pages/UsagePage.tsx`, `OrganizationUsagePage.tsx`, `frontend/src/components/billing/UsageBreakdown.tsx`, `usage-data.ts`, `backend/app/routes/credits.py`: inclusive UTC dates, 366 days, aggregate CSV, permissions, reported versus estimated usage. |
| `privacy` | OpenScience `frontend/workspace/src/components/settings/General.tsx`; `backend/app/routes/telemetry.py`: device and account consent, deletion scope, redaction, traces versus billing records. |
| `graphs`, `evidence`, `sharing` | `frontend/src/components/node/`, `frontend/src/components/export/`, `backend/app/models/node.py`, `backend/app/routes/nodes.py`, `sharing.py`, `export_import.py`: staged records, commit gates, revisions, explicit sharing, export scope. |
| `ascent` | `frontend/src/components/pages/AscentPage.tsx`, `backend/app/routes/ascent.py`: request, pending/approved/denied states, protected download, entitlement independent of Wallet. |
| `api` | Mounted routes in `backend/app/main.py` and their route modules; no blanket promise that legacy CLI routes are public or accept model-access keys. |
| `troubleshooting` | The sources above and their current error/recovery controls. |

## Maintaining coverage

Update the relevant page when a user action, default, permission, cost, or recovery path changes. Keep operational infrastructure and financial repair procedures in the account repository. Do not publish private source links as setup prerequisites. Verify actual account UI and request contracts before changing financial or access statements.

Run validation, browser checks, and mirror verification before merging. The browser suite visits every page, verifies all second/third-level anchors, checks responsive overflow, and tests old links, search, exports, copy, and unknown routes.
