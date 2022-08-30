# Explorers Club

Think of Explorers Club similar to the game Destiny, but replace planets with islands, and each island is a different board, card or drawing game. Players can join up to play together in a browser using 4-digit join codes.

Run the web app with `nx run web:serve`.

## Core Stack and Patterns

- supabase / postgres for database
- supabase real-time for syncing game state
- react-three-fiber for 3D graphics
- styled-components for styling
- xstate for state management + actor pattern for sharing distributed real-time state
- static site hosting on netlify
- game server hosting on fly.io
- nx for managing the monorepo
- github actions for CI

## Inspirations
Boardgamearna.com, rocketcrab.com, Jagex, Destiny, Jackbox.