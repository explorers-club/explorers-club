# Explorers Club

Welcome to your next adventure!

![Logo](https://raw.githubusercontent.com/explorers-club/explorers-club/main/apps/web/src/assets/logo.png)

## What is Explorers Club?

Imagine Mario Party, but in a browser, set in an archipelagos in the Pacific ocean, with coconut-inspired characters. Players can play together straight from their phones and TVs, and join using a 4-digit code.

Other inspiration we are drawing from: [Rocket Crab](https://github.com/tannerkrewson/rocketcrab), Destiny, BoardGameArena, Tabletop Simulator, Jackbox.TV

## Ways you can contribute

### 1. 💬 Join the [Discord](https://discord.gg/PUHsGxqBKt)

### 2. 🛒 Buy something from our [merch page](https://merch.explorers.club/) 

### 3. 🛠👷‍♀️👷‍♂️ Contribute directly

We are always looking for talented individuals who want to help out in different ways. We need help today with:

1. Graphics development (using `THREE.js` + `react-three-fiber`)
1. Game logic and network development (Using firebase to power a synced Actor model via Xstate)
1. Concept art
1. Game design
1. Sound design
1. Soundtrack and sound design
1. Merch illustration and designs
1. Content management for [merch site](https://merch.explorers.club) (using Shopify + Printful)

Reach out in the [#contribute](https://discord.com/channels/995376198379122708/1036995345051287552) channel on [Discord](https://discord.gg/PUHsGxqBKt) or reach out on our [contribute@explorers.club](mailto:contribute@explorers.club) mailing list.

### 4. 🤗🤔 Playing and Giving Feedback!

Visit [explorers.club](https://explorers.club) to see the latest code running on the `main` branch. Bring any ideas to the [#feedback](https://discord.com/channels/995376198379122708/1036995388441374720) channel on [Discord](https://discord.gg/PUHsGxqBKt).

## Development

Run the web app with `nx run web:serve`.

## Philosophy

We are wondering—why aren't there more good open-source games? Why is the code for most of the games we play locked and hidden within private repositories that nobody can see and improve?

We believe that this doesn't have to be the case. We believe that many of the games we play in the future will be created by emergent and excited open-source communities—like the one we aim to create around Explorers Club.

## Stack, Patterns, Attribution

- supabase / postgres for database
- firebase for real-time syncing
- [react-three-fiber](https://github.com/pmndrs/react-three-fiber) for 3D graphics
- [styled-components](https://styled-components.com/) for styling
- [xstate](https://xstate.js.org/) for state management + [actor pattern](https://www.youtube.com/watch?v=NTfPtYJORck) for sharing distributed real-time state
- static site hosting on netlify
- game server hosting on fly.io
- [nx](https://nx.dev/) for managing the monorepo
- github actions for CI
- [Honeycomb](https://github.com/flauwekeul/honeycomb) for Hex grids
- Sound effects and sounds from [Zapsplat](https://www.zapsplat.com/)

![image](https://user-images.githubusercontent.com/718391/199243971-7e9556d6-f473-4a86-bc19-d121bdf16592.png)
