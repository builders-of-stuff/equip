# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking and syncing
npm run check

# Watch mode type checking
npm run check:watch

# Linting and formatting
npm run lint
npm run format

# Testing
npm run test:unit    # Run tests in watch mode
npm run test         # Run tests once
```

## Project Architecture

This is a SvelteKit application with the following key characteristics:

- **Framework**: SvelteKit with Svelte 5.0
- **Styling**: TailwindCSS v4 with forms and typography plugins
- **Content**: MDsveX for Markdown support in Svelte components
- **Testing**: Vitest with dual environments:
  - Browser tests using Playwright for Svelte components (`.svelte.{test,spec}.{js,ts}`)
  - Node tests for server-side code
- **TypeScript**: Strict mode enabled
- **Build Tool**: Vite
- **Package Manager**: Uses pnpm (see pnpm-lock.yaml)

## Testing Structure

The project uses a dual testing setup:

- **Client-side tests**: Run in browser environment using Playwright, test Svelte components with `vitest-browser-svelte`
- **Server-side tests**: Run in Node environment for server code

Test files follow these patterns:

- Svelte component tests: `*.svelte.{test,spec}.{js,ts}`
- Server/utility tests: `*.{test,spec}.{js,ts}` (excluding Svelte tests)

## File Extensions and Preprocessing

- Svelte components support `.svelte` and `.svx` (MDsveX) extensions
- MDsveX allows writing Markdown with Svelte components
- Vite preprocessing handles TypeScript and other transformations

## Linting and Code Quality

- ESLint with TypeScript, Svelte, and Prettier configurations
- `no-undef` rule disabled for TypeScript projects (per typescript-eslint recommendations)
- Prettier for code formatting with Svelte and TailwindCSS plugins
- Allows use of `any` type and doesn't error on unused variables

## Naming Conventions

- Files and folders use kebab-case (e.g., `my-component.svelte`, `utils/date-helpers.ts`)
