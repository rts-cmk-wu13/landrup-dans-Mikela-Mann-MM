

# Landrup Dans - Dokumentation
**Navn:** Mikela Mann  
**Hold:** [13]

---

## Tech stack

### Next.js 16
Next.js er et React-baseret JavaScript framework med fil-baseret routing og mulighed for at afvikle kode på serveren gennem Server Components og Server Actions.

Jeg har valgt Next.js af flere årsager: Frameworket har allerede taget en række strukturelle beslutninger for mig — routing, bundling og optimering — hvilket giver mig mere tid til at fokusere på selve funktionaliteten. Det giver desuden en større beskyttelse af sensitive data, fordi API-kald med access tokens kan udføres server-side uden at eksponere tokens til browseren. I dette projekt håndteres session-validering i `proxy.ts` (middleware), som kører server-side og beskytter de routes der kræver login.

Next.js er et af de mest efterspurgte frameworks i branchen — ifølge Stack Overflow Developer Survey 2024 er det det 6. mest populære web framework, og React-økosystemet, som det bygger på, har det største community med over 250.000 npm-pakker.

### REST API
Projektet kommunikerer med et eksisterende REST API (Landrup Dans API) der kører lokalt på `localhost:4000`. REST (Representational State Transfer) er en arkitektur-standard for web-services, som bruger HTTP-requests til at hente og manipulere data. API'et returnerer data i JSON-format og bruger JWT-tokens til autentifikation.

Alle API-kald er samlet i `lib/api.ts`, som er projektets eneste lag der kommunikerer direkte med backend. Dette gør det nemt at ændre endpoints eller skifte API uden at røre ved komponenterne.

### Tailwind CSS v4
Tailwind CSS er et utility-first CSS framework der giver mulighed for at style komponenter direkte i markup ved hjælp af utility classes. Projektet bruger Tailwind v4, som introducerer en ny `@import "tailwindcss"` syntaks frem for de tidligere `@tailwind base/components/utilities` direktiver.

Jeg har valgt Tailwind fordi det passer godt til komponent-baseret udvikling i React/Next.js. Da designet er bygget op omkring et specifikt farvesystem (defineret i Figma), har jeg defineret alle design tokens som CSS custom properties i `globals.css` og kun brugt Tailwind til layout-hjælpeklasser. Design tokens som farver og spacing er holdt i CSS-variabler frem for Tailwind-konfigurationen, da de bruges på tværs af inline styles og CSS-klasser.

### TypeScript
TypeScript er et supersæt af JavaScript der tilføjer statisk type-checking. Det betyder at fejl kan fanges under development i stedet for runtime.

I dette projekt er alle typer samlet i `types/index.ts` — herunder `Activity`, `User`, `Session`, `AuthResponse` og form-payloads som `RegisterPayload` og `CreateActivityPayload`. Dette giver et enkelt sted at vedligeholde datamodellerne og sikrer konsistens på tværs af komponenter og API-funktioner.

---

## Projektstruktur

```
landrup-dans/
│
├── app/
│   ├── (public)/              # Route group — ingen bottom navigation
│   │   ├── login/             # Log ind
│   │   └── opret-bruger/          # Opret bruger (Valgfri opgave B)
│   │
│   ├── (protected)/           # Route group — med bottom navigation
│   │   ├── layout.tsx         # Injekterer BottomNav på alle beskyttede sider
│   │   ├── aktiviteter/        # Aktivitetsoversigt med live søgning
│   │   │   └── [id]/          # Aktivitetsdetaljer + tilmeld/forlad
│   │   │       ├── deltagere/  # Deltagerliste (kun instruktører)
│   │   │       └── rediger      # Rediger hold (Valgfri opgave A)
│   │   ├── aktiviteter/opret/ # Opret hold (Valgfri opgave A)
│   │   └── profil/           # Min profil
│   │
│   ├── layout.tsx             # Root layout med Ubuntu font
│   ├── page.tsx               # Landing page
│   └── globals.css            # Design tokens og CSS custom classes
│
├── components/
│   ├── ui/                    # Generiske komponenter
│   │   ├── BottomNav.tsx
│   │   ├── SearchBar.tsx
│   │   └── FormError.tsx
│   ├── activities/
│   │   └── ActivityCard.tsx
│   └── landing/
│       ├── Hero.tsx
│       ├── ActivityTypes.tsx
│       ├── NewsletterForm.tsx
│       ├── TestimonialsCarousel.tsx
│       ├── ContactForm.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── api.ts                 # Alle API-kald samlet ét sted
│   ├── dal.ts                 # Server-side session (Data Access Layer)
│   ├── session.ts             # Client-side cookie-håndtering
│   └── reportError.ts         # Wrapper om Sentry fejlrapportering
│
├── types/
│   └── index.ts               # Alle TypeScript interfaces
│
└── proxy.ts                   # Route guard / middleware
```

Strukturen er bygget op om en klar adskillelse af ansvar: `api.ts` taler med backend, `dal.ts` og `session.ts` håndterer auth, `types/index.ts` definerer datamodellerne, og komponenter har kun ansvar for UI.

Route groups med parenteser — `(public)` og `(protected)` — bruges til at styre hvilke sider der får bottom navigation uden at påvirke URL-strukturen.

---

## Kodeeksempel

**Hvad er det?** 
**Hvad er formålet?** 
**Hvordan sker det?** 

## Security & Best Practices

**Cookie-baseret autentifikation:**  
Sessions gemmes i cookies via `js-cookie`. "Husk mig"-funktionen (Valgfri opgave C) styrer om cookien er en session-cookie (slettes når browseren lukkes) eller persisteres i 30 dage.

**Route protection:**  
`proxy.ts` (Next.js middleware) beskytter alle routes under `(protected)` server-side. Brugere uden gyldigt session-cookie bliver redirectet til login-siden. Instruktør-specifikke sider som deltagerlisten validerer rollen yderligere client-side.

**Rollebaseret UI:**  
Instruktører og almindelige brugere ser forskelligt indhold på profil- og aktivitetssider — fx ser instruktører "Deltagerliste" og rediger/slet-knapper, mens brugere ser "Tilmeld" og "Forlad".

**Environment variables:**  
API URL opbevares i `.env.local` og er tilgængelig via `process.env.NEXT_PUBLIC_API_URL`. Filen er gitignored og committes aldrig til repository.

---

# Perspektivering

**Deployment:**  
Projektet er deployet på Vercel, som er den anbefalede hosting-platform for Next.js. Vercel håndterer automatisk server-side rendering og CDN-distribution globalt. Deployment sker automatisk ved push til main-branchen via GitHub-integration.

**Sentry fejlmonitorering:**  
Projektet er sat op med Sentry til fejlmonitorering i production. Fejl rapporteres automatisk via `lib/reportError.ts`, som wrapper Sentrys SDK. `global-error.tsx` fanger ubehandlede fejl på applikationsniveau. Dette giver overblik over fejl i production uden at brugeren behøver at rapportere dem manuelt.

**Skalering & Vedligeholdelse:**  
Kodebasen er struktureret med klar adskillelse — API-kald, auth-logik og UI-komponenter er separeret. Alle design tokens er defineret som CSS custom properties i ét sted (`globals.css`), så farver og spacing kan opdateres globalt. Alle TypeScript-typer er samlet i `types/index.ts`, så datamodeller kun vedligeholdes ét sted.

---

## Refleksion

*[Hvad lærte jeg? Hvad ville jeg gøre anderledes?]*

Dette projekt har givet mig praktisk erfaring med Next.js App Router og forskellen på Client og Server Components. Særligt arbejdet med route groups, proxy og cookie-baseret auth var ny læring. Jeg blev også mere bevidst om vigtigheden af at læse API-dokumentation grundigt — flere fejl i projektet skyldtes at jeg antog at endpoints og content-types fulgte en standard, som det konkrete API afveg fra (fx `application/x-www-form-urlencoded` på user-oprettelse og `/auth/token` uden `/api/v1/`-præfikset).

Hvis jeg skulle starte forfra, ville jeg bruge mere tid på at kortlægge API'ets endpoints og datastrukturer inden jeg begyndte at kode, da det ville have sparet mig for en del refaktorering undervejs.