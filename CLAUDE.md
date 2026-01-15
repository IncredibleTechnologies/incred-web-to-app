# Project Instructions

## Project Overview

**Incredible Web-to-App** - Next.js web funnel for the Incredible fintech app. Guides users through onboarding to collect credit card information, simulate payoff plans, and drive app downloads.

### Tech Stack
- Next.js (App Router) + React + TypeScript
- State: React Context (onboarding flow data)
- Forms: React Hook Form + Zod
- UI: shadcn/ui + Tailwind CSS + Radix primitives
- Backend: Firebase (Auth, Firestore, Analytics) via Reactfire
- Deployment: Netlify (auto-deploy on push to main)

### Key Directories
| Path | Purpose |
|------|---------|
| `/app/` | Next.js App Router pages and layouts |
| `/app/(main)/onboarding/` | Onboarding flow pages |
| `/components/` | React components |
| `/components/ui/` | shadcn/ui primitives (Button, Card, etc.) |
| `/components/onboarding/` | Onboarding-specific components |
| `/contexts/` | React Context providers |
| `/lib/` | Utility functions (`cn`, `isBrowser`) |
| `/pages/api/` | API routes (serverless functions) |
| `/public/` | Static assets (logos, icons, SVGs) |

---

## Coding Standards

### Component Patterns

**Client Components**: Use `"use client"` directive at top of file when using hooks, state, or browser APIs.

**Styling**: Use Tailwind classes with the `cn()` utility for conditional classes:
```typescript
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes"
)} />
```

**shadcn/ui Components**: Located in `/components/ui/`. Use CVA (class-variance-authority) for variants:
```typescript
const buttonVariants = cva("base-styles", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." }
  },
  defaultVariants: { variant: "default", size: "default" }
})
```

### Naming Conventions
- **Components**: PascalCase (`MainGoal`, `ContinueButton`)
- **Files**: kebab-case (`main-goal.tsx`, `continue-button.tsx`)
- **Contexts**: PascalCase with `Context` suffix (`OnboardingContext`)
- **Hooks**: camelCase with `use` prefix (`useOnboarding`)

### State Management

**React Context** for shared onboarding state:
```typescript
// contexts/onboarding-context.tsx
export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider")
  }
  return context
}
```

### Design Tokens

Use Tailwind theme values from `tailwind.config.ts`. Key brand colors:
- `neon-lime` (#c0ff00) - Primary accent/selection
- `carbon` (#0e1d22) - Dark text
- `cloud` (#f6f5f1) - Light backgrounds
- `slate-100` (#71706a) - Muted text

Custom fonts:
- `font-sora` - Headings
- `font-satoshi` - Body text

### Firebase Setup

Firebase config is loaded from environment variables in `/components/firebase-providers.tsx`:
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

Use Reactfire hooks for Firebase access:
```typescript
import { useAuth, useFirestore } from "reactfire"
```

---

## Deployment

### Netlify (Production)
- **Auto-deploy**: Push to `main` triggers deployment
- **Build command**: `npm run build` (Next.js build)
- **Environment variables**: Configure in Netlify dashboard (not committed)

### Local Development
```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:3000)
npm run build      # Production build
npm run lint       # Run ESLint
```

### Environment Files
- `.env` - Development Firebase config
- `.env prod` - Production Firebase config (for reference, configure in Netlify)

---

## Onboarding Flow

The onboarding flow collects user data through these steps:

1. `/onboarding/total-balance` - Enter total credit card balance
2. `/onboarding/credit-cards` - Select credit cards
3. `/onboarding/savings` - Show potential savings
4. `/onboarding/monthly-payment` - Choose payment amount
5. `/onboarding/main-goal` - Select primary goal
6. `/onboarding/choose-plan` - Select a plan
7. `/onboarding/plan-review` - Review selected plan
8. `/onboarding/share-details` - Collect contact info
9. `/onboarding/all-set` - Completion with app download

State is managed via `OnboardingContext` and persists across navigation.

---

## Linear MCP Setup

To connect Linear to Claude Code:

```bash
claude mcp add --transport sse linear https://mcp.linear.app/sse
```

When creating Linear issues:
- **Team**: Incredible
- **Status**: Todo
- **Assignee**: me

Before creating a ticket, ask for **Priority** and **Estimate**. Use `list_cycles` to get the current cycle ID.
