

# Landrup Dans - Dokumentation
**Navn:** Mikela Mann  
**Hold:** [13]

---

## Tech stack

### Next.js 16
Next.js er et React-baseret JavaScript framework med fil-baseret routing og mulighed for at afvikle kode på serveren gennem Server Components og Server Actions.

Jeg har valgt Next.js af flere årsager. Frameworket har allerede taget en række strukturelle beslutninger for mig, herunder routing, bundling og optimering, hvilket giver mig mere tid til at fokusere på selve funktionaliteten. Det giver desuden en større beskyttelse af sensitive data, fordi API-kald med access tokens kan udføres server-side uden at eksponere tokens til browseren. I dette projekt håndteres session-validering i `proxy.ts` (middleware), som kører server-side og beskytter de routes der kræver login.

Next.js er et af de mest efterspurgte frameworks i branchen. Ifølge Stack Overflow Developer Survey 2024 er det det 6. mest populære web framework, og React-økosystemet, som det bygger på, har det største community med over 250.000 npm-pakker.

### REST API
Projektet kommunikerer med et eksisterende REST API (Landrup Dans API) der kører lokalt på `localhost:4000`. REST (Representational State Transfer) er en arkitektur-standard for web-services, som bruger HTTP-requests til at hente og manipulere data. API'et returnerer data i JSON-format og bruger JWT-tokens til autentifikation.

Alle API-kald er samlet i `lib/api.ts`, som er projektets eneste lag der kommunikerer direkte med backend. Dette gør det nemt at ændre endpoints eller skifte API uden at røre ved komponenterne.

### Tailwind CSS v4
Tailwind CSS er et utility-first CSS framework der giver mulighed for at style komponenter direkte i markup ved hjælp af utility classes. Projektet bruger Tailwind v4, som introducerer en ny `@import "tailwindcss"` syntaks frem for de tidligere `@tailwind base/components/utilities` direktiver.

Jeg har valgt Tailwind fordi det passer godt til komponent-baseret udvikling i React/Next.js. Da designet er bygget op omkring et specifikt farvesystem defineret i Figma, har jeg defineret alle design tokens som CSS custom properties i `globals.css` og kun brugt Tailwind til layout-hjælpeklasser. Design tokens som farver og spacing er holdt i CSS-variabler frem for Tailwind-konfigurationen, da de bruges på tværs af inline styles og CSS-klasser.

### TypeScript
TypeScript er et supersæt af JavaScript der tilføjer statisk type-checking. Det betyder at fejl kan fanges under development i stedet for runtime.

I dette projekt er alle typer samlet i `types/index.ts`, herunder `Activity`, `User`, `Session`, `AuthResponse` og form-payloads som `RegisterPayload` og `CreateActivityPayload`. Dette giver et enkelt sted at vedligeholde datamodellerne og sikrer konsistens på tværs af komponenter og API-funktioner.

---

## Projektstruktur

```
landrup-dans/
│
├── app/
│   ├── (public)/                    # Route group - ingen bottom navigation
│   │   ├── login/                   # Log ind
│   │   │   ├── page.tsx
│   │   │   └── actions.ts           # Server Action: loginAction
│   │   └── opret-bruger/            # Opret bruger (Valgfri opgave B)
│   │       ├── page.tsx
│   │       └── actions.ts           # Server Action: registerAction
│   │
│   ├── (protected)/                 # Route group - med bottom navigation
│   │   ├── layout.tsx               # Injekterer BottomNav på alle beskyttede sider
│   │   ├── aktiviteter/
│   │   │   ├── page.tsx             # Aktivitetsoversigt med live søgning
│   │   │   ├── opret/
│   │   │   │   ├── page.tsx         # Opret hold (Valgfri opgave A)
│   │   │   │   └── actions.ts       # Server Action: createActivityAction
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Aktivitetsdetaljer + tilmeld/forlad
│   │   │       ├── actions.ts       # Server Actions: enrollAction, leaveAction
│   │   │       ├── deltagere/
│   │   │       │   └── page.tsx     # Deltagerliste (kun instruktører)
│   │   │       └── rediger/
│   │   │           ├── page.tsx     # Rediger hold (Valgfri opgave A)
│   │   │           └── actions.ts   # Server Action: updateActivityAction
│   │   └── profil/
│   │       ├── page.tsx             # Min profil
│   │       └── actions.ts           # Server Action: deleteActivityAction
│   │
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   ├── not-found.tsx                # 404-side
│   ├── global-error.tsx             # Global fejlside (Sentry)
│   └── globals.css                  # Design tokens og CSS custom classes
│
├── components/
│   ├── ui/                          # Generiske komponenter
│   │   ├── BottomNav.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FormError.tsx
│   │   ├── BackButton.tsx
│   │   └── LogoutButton.tsx
│   ├── activities/
│   │   ├── ActivityCard.tsx
│   │   └── EnrollButton.tsx         # Tilmeld/forlad knap (client component)
│   ├── profile/
│   │   └── InstructorActivityList.tsx  # Instruktørens holdliste med slet/rediger
│   └── landing/
│       ├── Hero.tsx
│       ├── ActivityTypes.tsx
│       ├── NewsletterForm.tsx
│       ├── TestimonialsCarousel.tsx
│       ├── ContactForm.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── api.ts                       # Alle API-kald samlet ét sted
│   ├── dal.ts                       # Server-side session (Data Access Layer)
│   ├── session.ts                   # Client-side cookie-håndtering
│   ├── errors.ts                    # Custom error-klasser (ApiError, AuthError m.fl.)
│   └── reportError.ts               # Centraliseret fejlrapportering via Sentry
│
├── types/
│   └── index.ts                     # Alle TypeScript interfaces
│
└── proxy.ts                         # Route guard / middleware
```

Strukturen er bygget op om en klar adskillelse af ansvar: `api.ts` taler med backend, `dal.ts` og `session.ts` håndterer auth, `errors.ts` klassificerer fejltyper, og komponenter har kun ansvar for UI.

Hver side der muterer data har sin egen `actions.ts` fil med Server Actions. Det holder side-komponenterne rene, da de kun modtager data og delegerer mutations til actions, som kører server-side og har adgang til session-cookien.

Route groups med parenteser, `(public)` og `(protected)`, bruges til at styre hvilke sider der får bottom navigation uden at påvirke URL-strukturen.

**Begrundelse for valg af mappestruktur uden src-mappe**

Next.js understøtter begge konventioner: at placere koden direkte i roden af projektet eller at samle den under en `src/`-mappe. Jeg har valgt at placere `app/`, `components/`, `lib/` og `types/` direkte i roden, da projektet er relativt lille og overskueligt uden et ekstra abstraktionsniveau.

`src/`-mappen giver primært mening i større projekter eller monorepos, hvor man ønsker en tydelig adskillelse mellem applikationskode og konfigurationsfiler som `next.config.ts`, `tailwind.config.ts` og `package.json`. I et projekt af denne størrelse vurderede jeg at det ekstra mappeniveau ville tilføje kompleksitet uden en reel gevinst.

Havde projektet skullet skalere med fx flere udviklere, tests eller et delt komponentbibliotek, ville en `src/`-struktur have givet mere mening:

```
src/
├── app/
├── components/
├── lib/
└── types/
```

Det ville have holdt roden renere og gjort det tydeligere at skelne mellem projektkonfiguration og applikationskode. En yderligere forbedring ville have været at opdele `components/` i `components/ui/` til generiske, genbrugelige komponenter og `components/features/` til domænespecifikke komponenter som `activities/` og `profile/`, da det skalerer bedre når komponentmappen vokser.

---

## Kodeeksempel

```typescript
// app/(protected)/aktiviteter/[id]/actions.ts
"use server";

export async function enrollAction(activityId: number) {
  const session = await getSession();
  if (!session) return { error: "Ikke logget ind" };

  const [targetActivity, user] = await Promise.all([
    getActivity(activityId),
    getUser(session.userId, session.token),
  ]);

  const userAge = user.age ?? 0;
  if (userAge < targetActivity.minAge || userAge > targetActivity.maxAge) {
    return { error: `Du skal være mellem ${targetActivity.minAge} og ${targetActivity.maxAge} år.` };
  }

  const alreadyOnDay = (user.activities ?? []).some(
    (a) => a.weekday?.toLowerCase() === targetActivity.weekday?.toLowerCase()
  );
  if (alreadyOnDay) {
    return { error: "Du er allerede tilmeldt et hold på denne ugedag." };
  }

  await enrollInActivity(session.userId, activityId, session.token);
  revalidatePath(`/aktiviteter/${activityId}`);
  return { success: true };
}
```

**Hvad er det?**
En Next.js Server Action der håndterer tilmelding til en aktivitet.

**Hvad er formålet?**
At validere om en bruger må tilmelde sig en aktivitet baseret på alder og ugedag, og udføre selve tilmeldingen uden at eksponere JWT-token eller forretningslogik til klienten.

**Hvordan sker det?**
Funktionen er markeret med `"use server"` direktivet, hvilket betyder den udelukkende kører på serveren og aldrig i browseren. Det er afgørende fordi JWT-tokenet er gemt i en `httpOnly` cookie, som JavaScript i browseren ikke kan tilgå af sikkerhedsmæssige årsager.

Sessionen hentes med `getSession()` fra `lib/dal.ts` (Data Access Layer), som læser cookien via Next.js' server-side `cookies()` API.

De to API-kald, `getActivity` og `getUser`, udføres parallelt med `Promise.all` frem for sekventielt. Det halverer ventetiden, da begge kald er uafhængige af hinanden.

Valideringen sker manuelt i applikationslaget frem for at stole på API'ets fejlkoder, fordi API'et i praksis returnerede inkonsistente fejl. Aldersvalidering tjekker om brugerens alder er inden for aktivitetens `minAge`-`maxAge` interval. Ugedagsvalidering tjekker om brugeren allerede har et hold på samme ugedag ved at filtrere brugerens eksisterende aktiviteter.

Til sidst kalder funktionen `revalidatePath`, som fortæller Next.js at invalidere den cachede version af aktivitetssiden, så siden automatisk re-renderes med det opdaterede tilmeldingsstatus næste gang den besøges.

---

## Security & Best Practices

**httpOnly cookie-baseret autentifikation**
Sessions gemmes i `httpOnly` cookies, som sættes server-side via en Next.js Server Action i `login/actions.ts`. `httpOnly` betyder at JavaScript i browseren ikke kan læse cookien, da den kun er tilgængelig for serveren. Det beskytter mod XSS-angreb (Cross-Site Scripting), hvor ondsindet JavaScript ellers kunne stjæle brugerens token.

"Husk mig"-funktionen (Valgfri opgave C) styrer om cookien persisteres i 30 dage eller slettes når browseren lukkes (session-cookie). Fordi cookien er `httpOnly`, kan client-side kode ikke læse den, og alle API-kald der kræver et token skal derfor ske via Server Actions, som har adgang til cookien server-side.

**Route protection**
`proxy.ts` fungerer som Next.js middleware og kører server-side på alle requests. Den beskytter alle routes under `(protected)` ved at parse session-cookien og redirecte brugere uden gyldigt token til login-siden. Instruktør-specifikke sider som `/aktiviteter/opret` og `/rediger` validerer desuden brugerens rolle og redirecter ikke-instruktører til profilsiden.

**Rollebaseret UI**
Instruktører og almindelige brugere ser forskelligt indhold på profil- og aktivitetssider. Instruktører ser "Mine hold" med rediger/slet-knapper og adgang til deltagerlister, mens medlemmer ser "Tilmeld" og "Forlad" på aktiviteter. Rolletjekket sker server-side baseret på `session.role` fra cookien.

**Centraliseret fejlhåndtering**
`lib/errors.ts` definerer custom error-klasser (`ApiError`, `AuthError`, `NotFoundError`, `ServerError`, `NetworkError`) som `apiFetch` kaster ved forskellige fejlscenarier. `lib/reportError.ts` wrapprer Sentry og sikrer at alle fejl logges struktureret med fejltype, HTTP-statuskode og API-path, i development til konsollen og i production til Sentry-dashboardet.

**Environment variables**
API URL og cookie-navn opbevares i `.env.local` og er tilgængelige via `process.env`. Filen er gitignored og committes aldrig til repository. I production sættes variablerne som environment variables i Vercel.

---

# Perspektivering

**Deployment**
Projektet skal deployes på Vercel, som er den anbefalede hosting-platform for Next.js. Vercel håndterer automatisk server-side rendering og CDN-distribution globalt. Deployment sker automatisk ved push til main-branchen via GitHub-integration.

**Sentry fejlmonitorering**
Projektet er sat op med Sentry til fejlmonitorering i production. Fejl rapporteres automatisk via `lib/reportError.ts`, som wrapper Sentrys SDK. `global-error.tsx` fanger ubehandlede fejl på applikationsniveau. Dette giver overblik over fejl i production uden at brugeren behøver at rapportere dem manuelt.

**Skalering og vedligeholdelse**
Kodebasen er struktureret med klar adskillelse, da API-kald, auth-logik og UI-komponenter er separeret. Alle design tokens er defineret som CSS custom properties i ét sted (`globals.css`), så farver og spacing kan opdateres globalt. Alle TypeScript-typer er samlet i `types/index.ts`, så datamodeller kun vedligeholdes ét sted.

---

## Refleksion

Dette projekt har givet mig praktisk erfaring med Next.js App Router og den fundamentale forskel på Client og Server Components, ikke bare teoretisk, men som en arkitekturel beslutning der påvirkede hele projektet.

Det mest lærerige var arbejdet med `httpOnly` cookies og session-håndtering. Det lød enkelt at gemme en session i en cookie, men valget om at bruge `httpOnly` for sikkerhedens skyld betød at al kode der brugte JWT-tokenet måtte omskrives fra client components til Server Actions, fordi browseren ikke kan læse en `httpOnly` cookie. Det var en god lære om at sikkerhedsbeslutninger har arkitekturelle konsekvenser, og at det er vigtigere at forstå *hvorfor* man vælger en løsning end blot at implementere den.

Jeg blev også mere bevidst om vigtigheden af at læse API-dokumentation grundigt inden man begynder at kode. Flere fejl skyldtes at jeg antog at endpoints og content-types fulgte REST-konventioner, som det konkrete API afveg fra, fx `application/x-www-form-urlencoded` på user-oprettelse, `/auth/token` uden `/api/v1/`-præfikset, og at list-endpointet for aktiviteter ikke returnerede instruktørdata som enkelt-endpointet gjorde. Det kostede en del refaktorering undervejs.

**Hvad ville jeg gøre anderledes?**
Jeg ville starte med at kortlægge alle API-endpoints, deres content-types og response-strukturer, gerne med et enkelt API-kald i terminalen, inden jeg begyndte at bygge komponenter. Jeg ville også sætte proxy og auth-arkitekturen op fra start, da det er svære at refaktorere sent i forløbet.

Jeg ville desuden overveje om et `httpOnly` cookie-setup er den rigtige løsning til et projekt af denne størrelse, eller om en enklere tilgang uden `httpOnly` ville have reduceret kompleksiteten uden at kompromittere sikkerheden væsentligt, da projektet kører på et lokalt API uden real-world brugere.