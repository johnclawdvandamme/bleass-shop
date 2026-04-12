# BLEASS — Storefront

## Stack

- **React 18** + **TypeScript**
- **Vite** (bundler)
- **TailwindCSS** (styling)
- **Medusa.js** (client API)

## Commandes

```bash
cd ~/bleass-shop

# Dev
npm run dev        # → http://localhost:5175

# Build production
npm run build

# Preview production build
npm run preview
```

## Configuration

Le client Medusa est configuré dans `src/lib/medusa.ts`.

**Storefront API key** : `pk_01f8429e23d02db2a7f3d09c793d687d22c227df866b064cab63c4f1f82679a5`

## Archi

```
src/
  App.tsx           ← Application principale
  main.tsx          ← Entry point
  lib/
    medusa.ts       ← Client Medusa (Axios)
  assets/           ← Images statiques
  index.css         ← Tailwind + global styles
public/
  images/products/  ← 27 images produits (JPEG)
```

## Structure Medusa

- **Backend** : `~/bleass-backend` (port 9000)
- **Admin** : `localhost:9000/app`

## Notes

- Les images produits sont locales (`public/images/products/`) et servies via le backend Medusa (`/static/`)
- 27 produits audio (Voices €69, Arpeggiator €39, Omega €39, etc.)
