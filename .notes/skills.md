# Skills & Technologies

## Tech Stack Deep Dive

### Go (API Backend)
- **Framework**: [Fiber v3](https://gofiber.io/)
  - Usage: Routing, request binding, and JSON serialization. Note that `fiber.New()` does not come bundled with default middlewares like `Recover` or `Logger` in our setup to keep it minimal.
- **ORM**: [GORM](https://gorm.io/) with `postgres` dialect plugin.
  - Setup involves `gorm.Config{}`.
- **Environment Management**: `github.com/joho/godotenv`
  - Loads variables locally for database strings. Overrides/system variables have precedence when running inside Docker.

### Data Base
- **Engine**: PostgreSQL
- **Usage**: Used securely with environment variabled `dsn` mappings. Explicit `timezone=UTC` behavior and `sslmode=disable` is standard for development configuration.

### Frontend
- **Framework**: [Svelte 5](https://svelte.dev/)
  - Core mechanism revolves around `.svelte` component building, `<script lang="ts">` setup, reactive variables (`let foo =`), event listeners (`onsubmit` explicitly, not `on:submit` as of Svelte 5).
- **TypeScript**: Used robustly across `.svelte` component scripts for safe data types (ex: defining `interface Transaction {}`).
- **Styling**: Vanilla CSS implemented in `app.css`. Focuses on native CSS variables (Custom properties), CSS Grid splits (`display: grid; grid-template-columns`), and flex centering.
- **Bundler**: [Vite](https://vitejs.dev/)
  - Setup heavily relies on `vite.config.ts`. In our project, an essential aspect to prevent CORS is mapping API routes through standard Vite proxies.
