# BLEASS — Medusa Backend

## Stack

- **Medusa v2.13.6** (Node.js commerce backend)
- **PostgreSQL** — db: `bleass_db`, socket: `/tmp` (dev)
- **Plugins** : file-s3, notification-sendgrid, payment-stripe, auth-google, auth-github, cache-redis, event-bus-redis
- **Port** : 9000

## Projet

```
bleass-backend/          ← Medusa commerce API
bleass-shop/             ← Storefront React/Vite
```

## Commandes

```bash
cd ~/bleass-backend

# Dev
npm run dev

# Build
npm run build

# Seed produits
npx medusa exec ./src/scripts/bleass-seed.ts

# Script promo
npx medusa exec ./src/scripts/create-promo.js <code> <discount>

# Générer promo codes
npx medusa exec ./src/scripts/generate-promo-codes.js
```

## Config

- `.env` — variables d'environnement (DB, Redis, plugins)
- `medusa-config.ts` — config Medusa (plugins commented out pour éviter crash)

## Plugins (inactive — commented in medusa-config.ts)

- `@medusajs/file-s3` — stockage S3
- `notification-sendgrid` — emails transactionnels
- `payment-stripe` — paiements Stripe (**→ activer via MedusaModule.register() dans src/index.ts**)
- `auth-google` — OAuth Google
- `auth-github` — OAuth GitHub
- `cache-redis` — cache Redis
- `event-bus-redis` — events Redis

## API Custom Routes

| Route | Description |
|-------|-------------|
| `GET /store/custom/bundles` | Liste tous les bundles |
| `GET /store/custom/bundles/:handle` | Bundle par handle |
| `POST /store/custom/promo-codes/:code/validate` | Valide un code promo |

## Admin

- **URL** : `localhost:9000/app`
- **Email** : `v-admin@bleass.com`
- **Password** : `Vadmin2026!`
- **Région** : Europe (`reg_01KNS0WAJBW6V2RKK9PCR97R15`)
- **Devise** : EUR

## Upload Local

```bash
POST /admin/uploads  (FormData)
→ /static/<ulid>.ext
```

## Produits (27 seedés)

| Produit | Prix |
|---------|------|
| Voices | €69 |
| Arpeggiator | €39 |
| Omega | €39 |
| (+ 24 autres plugins audio) |

## Storefront

- `~/bleass-shop` — React/Vite
- **Port dev** : 5175
- **Storefront API key** : `pk_01f8429e23d02db2a7f3d09c793d687d22c227df866b064cab63c4f1f82679a5`

## Prochaine étape

Activer **Stripe** via `MedusaModule.register()` dans `src/index.ts`.
(La config via `medusa-config.ts modules{}` ne fonctionne pas en v2.)
