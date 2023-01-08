![Splash](https://user-images.githubusercontent.com/718391/210599542-0ca83af2-b2be-46fb-ae3e-db05bc7ab029.jpg)

## What is Explorers Club?

Imagine Mario Party, but in a browser, set in an archipelagos in the Pacific ocean, with coconut-inspired characters. Players can play together straight from their phones, televisions and computers.

Inspiration we are drawing from: [Rocket Crab](https://github.com/tannerkrewson/rocketcrab), Destiny, BoardGameArena, Tabletop Simulator, Jackbox.TV

## Ways you can contribute

### 1. 💬 Join the [Discord](https://discord.gg/PUHsGxqBKt)

### 2. 🛒 Buy something from our [merch page](https://merch.explorers.club/)

### 3. 🛠👷‍♀️👷‍♂️ Contribute directly

We are looking for artists and software developers to help build games. If you are interested reach out in the [#contribute](https://discord.com/channels/995376198379122708/1036995345051287552) channel on [Discord](https://discord.gg/PUHsGxqBKt).

### 4. 🤗🤔 Playing and Giving Feedback!

No games are production ready yet, but star the repo to get updates for when things become playable.

## Development

After cloning and running `npm install`, use these commands to get the code running.

### Website

`npx nx run web:serve`

### Servers

#### Real-time server

`npx nx run room-server:serve`

#### API server

`npx nx run api-server:serve`

### Storybooks

#### Component Library Storybook

`npx nx run components:storybook`

## Stack, Patterns, Attribution

- [react-three-fiber](https://github.com/pmndrs/react-three-fiber) for 3D graphics
- [colyseus](https://www.colyseus.io/) for multiplayer networking
- [stitches](https://stitches.dev/) for CSS-in-JS
- [radix-ui](https://www.radix-ui.com/) for building design system
- [xstate](https://xstate.js.org/) for state + logic
- static site hosting on netlify
- game server hosting on fly.io
- [nx](https://nx.dev/) for managing the monorepo
- github actions for CI
