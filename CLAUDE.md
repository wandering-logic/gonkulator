# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gonkulator is a 1990's style scientific calculator webapp modeled after the TI-30. Binary operators are infix, unary operators are postfix. Built as a TypeScript PWA with Vite.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Run checks + typecheck + build to dist/
npm run preview      # Preview production build
npm run check        # Run Biome linting
npm run format       # Format code with Biome
npm run typecheck    # Run TypeScript type checking
```

## Code Quality Rules

Always keep code clean before commits:
- `npm run check` must pass (Biome lint)
- `npm run typecheck` must pass (TypeScript strict mode)
- When tests exist, test suite must pass

## Architecture

- **src/main.ts** - Calculator initialization and event handling (pointer events with long-press detection for shift key toggle)
- **src/style.css** - Calculator styling (360x460px fixed layout)
- **index.html** - Calculator UI with button grid (digits, operators, scientific functions)
- **public/** - Static assets including PWA icons
- **vite.config.ts** - Vite configuration with PWA plugin (vite-plugin-pwa)

Note: The calculator logic (operators, equals, clear) is not yet implemented - currently only digit display and shift-key detection work.
