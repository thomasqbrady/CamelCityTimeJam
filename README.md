# Camel City Time Jam (MakeCode Arcade Prototype)

This repository now includes a playable MakeCode Arcade prototype implementing the game flow from `gdd.md` with placeholder pixel art.

## Files
- `main.ts`: boot sequence only.
- `src/state.ts`: shared game state (creativity score).
- `src/ui.ts`: transitions, dialogue helpers, and A/B/C choice menu UI.
- `src/minigames.ts`: Breakout/Pac-style/Tetris-style round implementations.
- `src/chapters.ts`: chapter flow and idea-unlock progression logic.
- `pxt.json`: MakeCode Arcade project manifest.
- `docs/pixel-art-shot-list.md`: production art checklist.

## Run in MakeCode Arcade
1. Open https://arcade.makecode.com/
2. Create a new project, then import this folder (`main.ts` + `pxt.json`) or paste `main.ts` into JavaScript view.
3. Download to Adafruit PyGamer from MakeCode using the generated UF2.

## Current status
- Fully playable chapter sequence with skill-gated progression.
- A/B/C feedback moments now use a selectable menu with locked (`[L]`) and crossed (`[X]`) states.
- Placeholder/dummy sprites and backgrounds are embedded in code.
- Replace placeholders according to `docs/pixel-art-shot-list.md`.
