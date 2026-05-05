# CAMEL CITY TIME JAM

## Game Design Document v1.0

**Sponsor:** Martes Delta Co, LLC
**Platform:** Adafruit PyGamer (ATSAMD51, 160×128 TFT, D-pad + A/B buttons)
**Event:** Camel City Game Jam — Winston-Salem, NC 2026
**Prize:** Pre-loaded onto 3 PyGamer devices for the winning team

---

## 1. Concept

You play as **Winston**, a friendly pixel-art camel on his way to the Camel City Game Jam. A mysterious vortex sucks him through time, dropping him into three pivotal moments in video game history. At each stop, a real game designer is working on a prototype of what will become a legendary game — but it's not quite there yet. Winston gets to offer suggestions that nudge each game toward greatness.

**Tone:** Warm, funny, educational, celebratory of game design as a creative act. No fail states — just different levels of reward based on how creative your suggestions are.

**Genre:** Interactive narrative / mini-game anthology

**Estimated play time:** 10–15 minutes

---

## 2. Hardware Constraints & Technical Strategy

### PyGamer Specs

- **CPU:** ATSAMD51 @ 120 MHz (ARM Cortex-M4F)
- **RAM:** 192 KB
- **Flash:** 512 KB (program storage)
- **QSPI Flash:** 8 MB (asset storage for images, sounds, fonts)
- **Display:** 1.8" 160×128 color TFT
- **Input:** D-pad, A button, B button (plus Start/Select, but we'll keep it to D-pad + A/B)
- **Sound:** Speaker driver + headphone jack

### Language Recommendation: **MakeCode Arcade (TypeScript/Blocks)**

After reviewing the options:

| Language            | Pros                                                                                                                                                                                                                                                                                                                                                                                             | Cons                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CircuitPython**   | Readable, Pythonic                                                                                                                                                                                                                                                                                                                                                                               | ~250 line limit on M0; SAMD51 is better but still tight. No built-in game engine. Manual sprite/tilemap management. Students would need hardware to test. |
| **Arduino (C++)**   | Maximum performance & control                                                                                                                                                                                                                                                                                                                                                                    | Least readable for students. Hardest to share/remix.                                                                                                      |
| **MakeCode Arcade** | Built-in game engine with sprites, tilemaps, menus, and scene management. Compiles to efficient native ARM code via STS (Static TypeScript). Browser simulator matches hardware. Can be shared via URL. Students can view in Blocks OR TypeScript/Python. 160×120 native resolution (close match to display). ~96 KB minimum RAM, PyGamer has 192 KB — comfortable margin. 8 MB QSPI for assets. | 16-color palette (but this fits the retro aesthetic perfectly). Resolution is 160×120, not 160×128 (bottom 8 rows unused).                                |

**Recommendation:** MakeCode Arcade is the clear winner. It compiles to efficient native code (not interpreted), so RAM usage is far lower than CircuitPython. The built-in sprite engine, tilemap system, and scene management handle memory efficiently. The 16-color palette and 160×120 resolution actually reinforce the retro aesthetic. Most importantly, **you can share the source as a URL** — students click it and see the full project in Blocks, TypeScript, or Python view, and can remix it immediately in their browser. It runs in the simulator without hardware.

**RAM Budget:** MakeCode Arcade's minimum is 96 KB. The PyGamer has 192 KB. Our game will need to manage scenes carefully (unloading sprites between chapters), but the narrative-heavy, mini-game structure naturally segments memory usage. Each "era" is essentially a fresh scene.

---

## 3. Historical Context (Corrected & Verified)

### Stop 1: Breakout — Atari, Sunnyvale, California, 1975

**The real history:**

- Breakout was designed by **Nolan Bushnell and Steve Bristow** at Atari.
- The concept emerged from an off-site brainstorming retreat around **January 1975** — the idea of turning Pong into a single-player game where you knock a ball against a wall of bricks.
- **Steve Jobs** (Atari employee #40, working the night shift) was assigned to build a prototype. He recruited his friend **Steve Wozniak** (then at HP) to actually design the hardware, promising to split the fee.
- Wozniak built it in **four consecutive sleepless nights**, reducing the chip count dramatically.
- The game was released to arcades in **May 1976** and became one of Atari's biggest hits (11,000+ cabinets).
- Important detail: The arcade cabinet used a **black-and-white monitor with colored cellophane overlays** to simulate color bricks.

**In-game setting:** We place Winston at **Atari's offices in Los Gatos/Sunnyvale, California, late 1975** — during the prototyping phase before the game's name was finalized. Bushnell is playtesting an early concept. The game is being called "Brick" or "Breakthrough" internally (both names appeared in Atari memos before "Breakout" was settled on).

**Why not 1977?** Breakout was already a released, successful arcade game by 1977. The interesting creative decisions happened in 1975 during prototyping. We place Winston there while the game is still being figured out.

**What's "wrong" with the prototype:**

- The ball only goes straight up and down (no angle, no real physics)
- There are bricks, but they're all the same — no color rows, no point values
- It works, but it's... boring

### Stop 2: Pac-Man — Namco, Tokyo, Japan, 1979

**The real history:**

- **Toru Iwatani**, a young designer at **Namco** in Tokyo, began development in **early 1979**.
- Iwatani was frustrated that arcade games only appealed to men through violent themes (Space Invaders, etc.). He wanted to make a game that would attract women and couples to arcades.
- His inspiration came from the concept of **eating** — he believed women enjoyed eating desserts and sweets. The character was inspired by a pizza with a slice removed (and the Japanese character for "mouth," 口, rounded out).
- The game took a year and five months to develop — the longest development for a video game at that time.
- The ghosts were almost all red! **Namco president Masaya Nakamura** ordered them to all be the same color. Iwatani pushed back and surveyed his colleagues — the vote was **40 to 0** in favor of multicolored ghosts.
- Each ghost was given a distinct AI personality to prevent the game from being too boring or too hard:
  - **Blinky** (red) — "Chaser" — directly pursues Pac-Man
  - **Pinky** (pink) — "Ambusher" — tries to position ahead of Pac-Man
  - **Inky** (cyan) — "Fickle" — unpredictable, uses both Pac-Man's and Blinky's positions
  - **Clyde** (orange) — "Feigned Ignorance" — chases when far away, retreats when close
- The game was test-marketed on **May 22, 1980** in Shibuya, Tokyo, as **Puck Man**. It was renamed **Pac-Man** for the US release (fear of vandals changing the P to an F).

**In-game setting:** Winston arrives at **Namco's offices in Tokyo, late 1979**, during development. Iwatani has a working maze game with a character eating dots and four ghosts chasing it — but the ghosts all behave identically (just randomly wandering), and there are no power pellets. The game works but feels flat.

**What's "wrong" with the prototype:**

- All four ghosts look the same (all red) and move randomly
- No power pellets — you can never fight back
- The maze works, eating dots works, but there's no tension or strategy

### Stop 3: Tetris — Dorodnitsyn Computing Centre, Moscow, USSR, 1984

**The real history:**

- **Alexey Pajitnov** was a speech recognition and AI researcher at the **Dorodnitsyn Computing Centre** of the **Soviet Academy of Sciences** in Moscow.
- In **June 1984**, he was inspired by a **pentomino puzzle set** he'd bought from a store. He loved arranging the shapes but found putting them back in the box especially compelling.
- He built the first prototype in **two weeks** on an **Elektronika 60** (a Soviet clone of the PDP-11), programmed in **Pascal**. The machine had no graphics capability — blocks were represented by bracket characters and spaces in text mode.
- Crucially, this first version used **pentominoes** — shapes made of **5 squares**. There are **12 unique pentomino shapes**, traditionally named after letters they resemble: **F, I, L, N, P, T, U, V, W, X, Y, Z** (remembered via the mnemonic "FILiPiNo" + the end of the alphabet, TUVWXYZ). These include complex shapes like the F (a zigzag with a bump), the U (a horseshoe), the W (a staircase), and the X (a plus sign).
- Pajitnov quickly realized that **12 shapes made of 5 squares were too complicated** — too many possibilities, too hard for a player to think quickly about fitting them. In a stroke of elegant simplification, he reduced from pentominoes (5 squares) to **tetrominoes** (4 squares). This brought the number of unique shapes down from 12 to just **7**: the **I** (line), **O** (square), **T** (T-shape), **S** and **Z** (two zigzags, mirror images), **L** and **J** (two L-shapes, mirror images).
- The name **Tetris** was born from this decision: **"tetra"** (Greek for "four") + **"tennis"** (Pajitnov's favorite sport).
- The early version had no scoring system and no levels, but it was already so addictive that Pajitnov couldn't stop playing it at work. His coworker Mikhail Kulagin noted that Pajitnov "smoked an enormous amount of cigarettes" during those long development sessions.
- He recruited colleague **Dmitry Pavlovsky** and 16-year-old prodigy **Vadim Gerasimov** to port it to IBM PC with color and a scoreboard. By summer 1985, the color version was spreading through Moscow on floppy disks. By 1986, reportedly nearly everyone with an IBM PC in Moscow had played it.
- Under Soviet law, intellectual property belonged to the state. Pajitnov received no royalties for years. He finally began earning from Tetris in 1996 after founding **The Tetris Company** with **Henk Rogers**.

**In-game setting:** Winston arrives at the **Computing Centre in Moscow, summer 1984**. Pajitnov has a working prototype on the Elektronika 60's text display. He's excited — he just turned his favorite puzzle, pentominoes, into a computer game where pieces fall from above and you stack them. The pieces are **pentomino shapes** (5 squares each), represented by bracket characters on the text-only display. There are 12 different shapes. The game has gravity and stacking, but no line-clearing, no rotation, and no speed progression. When the pile reaches the top, it's over.

**What's "wrong" with the prototype:**

- **Pentominoes are too complex** — 12 shapes, each made of 5 squares, with awkward asymmetric forms like the F, W, and N. The player can barely think fast enough to place them before the next one drops.
- Pieces can't be rotated — you're stuck with whatever orientation falls
- Lines don't clear when completed — the well just fills up relentlessly
- No scoring, no speed increase — no sense of progression or reward

**The 12 pentomino shapes (for reference and potential pixel art):**

```
F:  .XX    I: XXXXX    L: X.      N: .X     P: XX
    XX.                   X.         XX        XX
    .X.                   X.         X.        X.
                          XX         X.

T:  XXX    U: X.X     V: X..     W: X..    X: .X.
    .X.       XXX        X..        XX.       XXX
    .X.                  XXX        .XX       .X.

Y:  .X     Z: XX.
    XX        .X.
    .X        .XX
    .X
```

_(Approximate — each is 5 connected squares. In-game, these would be shown as bracket characters on the Elektronika 60's text display.)_

---

## 4. Game Flow

### Opening Scene: Winston-Salem, Present Day (2026)

- Title screen: **"CAMEL CITY TIME JAM"** with pixel-art camel in 8-bit style, retro font
- Subtitle: _"A Martes Delta Co Production for the Camel City Game Jam"_
- Press A to start
- Brief cutscene: Winston (pixel camel sprite, maybe 16×16) is walking toward a building labeled "GAME JAM." Dialogue box: _"Almost there! I can't wait to see what everyone's making this year!"_
- A swirling vortex appears. Winston gets sucked in. Screen flash/transition effect.

### Chapter 1: "Brick" — Atari, California, 1975

**Scene:** Simple office interior (tilemap). Bushnell sprite at a desk with an early computer/TV setup.

**Dialogue (condensed for small screen):**

> BUSHNELL: "Whoa! Where'd you come from? Are you a talking cam...? Never mind. I'm Nolan. I run this place — Atari."
>
> BUSHNELL: "Jobs and Woz have been working on a new game. It's like Pong, but instead of another player, you hit a ball against a wall of bricks."
>
> BUSHNELL: "Wanna try it?"

**Round 1: "Brick" prototype** (simplified Breakout)

- Paddle at bottom (controlled by D-pad left/right)
- Ball on the paddle. Press A to release.
- Ball goes **straight up**, bounces off top wall, comes **straight back down** — no angle
- A few rows of identical white bricks at the top
- **Survive 10 seconds without missing the ball = success. Miss the ball = fail.**

**Feedback moment:**

> BUSHNELL: "So? What do you think?"

If the player **failed** (missed the ball before 10 seconds):

- Only option A is available. B and C are shown but **greyed out / locked**.
- **A: "It's great!"** → Bushnell nods. _"I think that Jobs kid has a reality distortion field, and you're in it. Something's missing, if you ask me."_ Move on. Creativity score: 0.
- The player can see what B and C _would have said_ but can't pick them. This creates a "what if" feeling and motivates replaying.

If the player **survived 10 seconds**:

- A is available but crossed out / dimmed. **B is unlocked.**
- **~~A: "It's great!"~~**
- **B: "What if the ball launched at an angle and bounced realistically?"** → Bushnell's eyes light up: _"Angles! Reflections! That changes everything! Woz is going to be busy!"_

**Round 2: Improved "Brick"** (angled ball + reflection physics)

- Same setup, but now the ball launches at a random angle and bounces realistically off walls and bricks
- Much more fun! Bricks start breaking.
- **Survive 10 seconds = success. Miss the ball = done here.**

If the player **failed Round 2:**

- Creativity score: 1. Move on with the B-level improvement.

If the player **survived Round 2:**

- B is now crossed out. **C is unlocked.**
- **~~B: "What if the ball launched at an angle..."~~**
- **C: "What if the angle changed depending on where the ball hits the paddle? Edges send it sideways, center sends it straight."** → Bushnell gets REALLY excited: _"NOW we're talking TENNIS! I LOVE it!"_

**Round 3: Full "Breakout"** (angled ball + physics + paddle-edge deflection)

- Now where the ball hits the paddle matters — edges send it at steep angles, center sends it more vertically. The player can aim.
- A brief, satisfying play session (~10 seconds). Suddenly it feels like a real game.
- No survival gate here — this is the reward. You just play it and enjoy.
- Creativity score: 2.

**Vortex transition.**

---

### Chapter 2: A Maze Game — Namco, Tokyo, 1979

**Scene:** Japanese office interior tilemap. Iwatani sprite at a workstation.

**Dialogue:**

> IWATANI: "[Something in... Japanese?]?! ... How about English? Ah, it looks like you understood that. I'm Iwatani, and this is my office, and there isn't usually a camel in it. What brings you to Namco? OH! Are you here for the playtest?"
>
> IWATANI: "I'm trying to make a game that everyone can enjoy — not just violent kids who like shooting aliens."
>
> IWATANI: "I built a maze game about eating. Try it!"

**Round 1: Early Pac-Man prototype**

- Simple maze (small — maybe 10×8 tiles to fit the screen)
- Yellow Pac-Man character eating dots
- Four RED ghosts — all identical, all moving randomly
- No power pellets
- **Survive 10 seconds without getting caught = success. Caught by a ghost = fail.**

**Feedback moment:**

> IWATANI: "The ghosts are boring, right? I can tell. What would you do?"

If the player **failed** (caught before 10 seconds):

- Only A is available. B and C are visible but **locked**.
- **A: "It seems fine to me."** → Iwatani sighs politely. Creativity score: 0.

If the player **survived 10 seconds**:

- A is crossed out. **B is unlocked.**
- **B: "Add big dots that let you eat the ghosts!"** → Iwatani leaps up: _"Turn the hunter into the hunted!"_

**Round 2: Power Pellets** (power pellets)

- Power pellets in the corners. Eating one turns all ghosts blue and edible.
- Now Pac-Man can fight back.
- Creativity score: 1. Move on.

If the player **survived Round 2:**

- B is crossed out. **C is unlocked.**
- **C: "What if each ghost has a different personality? And style to match?"** → Iwatani gasps: _"Different behaviors! One could chase... one could ambush you... they'd work as a team without even knowing it! You know, my boss INSISTED the ghosts all be the same color. I took a poll: 40 to 0 in favor of different colors. 41 now!"_

If the player **failed Round 2:**

- Creativity score: 1. Move on.

**Round 3: Full Pac-Man** (colored ghosts with distinct AI + power pellets)

- Four ghosts, now different colors: red chases directly, pink tries to get ahead, blue is erratic, orange wanders, until the power pellets turn the tables and they ghosts DO all behave and look the same!
- Much more strategic and tense!
- **Survive 10 seconds = success. Caught = done here.**

**Vortex transition.**

---

### Chapter 3: Falling Blocks — Moscow, USSR, 1984

**Scene:** Austere office interior. Old computer (Elektronika 60) with a text-only display. Pajitnov sprite (bearded, friendly).

**Dialogue:**

> PAJITNOV: "[Something in... Russian?]?! ...A camel? In Moscow?"
>
> PAJITNOV: "I work here at the Computing Centre. I'm supposed to be testing this computer, but... I made a little puzzle instead."
>
> PAJITNOV: "You know pentomino puzzles? Wooden shapes made of five squares you maybe see grandparents play with? I love them. I made a version where the pieces fall from the sky like rain and you stack them."
>
> PAJITNOV: "But... I'm not so sure. You try..."

**Round 1: Proto-Tetris (Pentomino version)**

- Narrow well (maybe 8 columns wide, scaled to screen)
- **Pentomino shapes** (5 squares each) fall from the top — showing 3–4 of the weirder ones (the F, P, U), and a couple more familiar (L, T)
- D-pad left/right to move, down to drop faster
- No rotation. No line clearing. The pile grows chaotically.
- **Survive 10 seconds without the pile reaching the top = success. Top out = fail.**

**Feedback moment:**

> PAJITNOV: "You see? It's too hard, I think."
>
> PAJITNOV: "What am I missing?"

If the player **failed** (topped out before 10 seconds):

- Only A is available. B and C are visible but **locked**.
- **A: "I don't know, it seems like a fine puzzle."** → Pajitnov shrugs. _"Maybe you're right. Or maybe I should get back to testing this computer."_ Creativity score: 0.

If the player **survived 10 seconds**:

- A is crossed out. **B is unlocked.**
- **B: "What if you made the shapes simpler? Use four squares each instead of five — fewer, simpler shapes."** → Pajitnov's face lights up: _"Four squares... that would be only... seven shapes! Much simpler!"_

**Round 2: Tetromino version** (simplified shapes + rotation)

- Same well, but now **tetromino shapes** fall (I, O, T, L) — 4 squares each
- A button rotates the piece
- Pieces fit together much more satisfyingly! But lines still don't clear, so the well still fills up.
- **Survive 10 seconds = success. Top out = done here.**

If the player **failed Round 2:**

- Creativity score: 1. Move on.

If the player **survived Round 2:**

- B is crossed out. **C is unlocked.**
- **C: "What if when you fill a complete row, it disappears?"** → Pajitnov jumps up from his chair: _"Yes! YES! The rows vanish! Then! OOH! Then, if you're good at the game it never has to end! You keep it going by cleaning off the bottom of the screen!"_

**Round 3: Full Tetris** (tetrominoes + rotation + line clearing)

- Line clearing with a satisfying flash effect. Speed slightly increases over time.
- Satisfying ~10 second play session. The complete Tetris loop.
- Creativity score: 2.

**Vortex transition.**

---

### Mechanic Summary: Skill-Gated Creativity

The A/B/C choice is **not a blind menu**. It's a progression system tied to gameplay:

| Round | What you play          | Survive 10s? | What unlocks                                                   |
| ----- | ---------------------- | ------------ | -------------------------------------------------------------- |
| **1** | The broken prototype   | ✗ Fail       | Only A (polite but unhelpful). B and C are visible but locked. |
| **1** | The broken prototype   | ✓ Survive    | A is crossed out. B unlocks (first improvement).               |
| **2** | The B-improved version | ✗ Fail       | Score 1. Move on with the partial improvement.                 |
| **2** | The B-improved version | ✓ Survive    | B is crossed out. C unlocks (the breakthrough idea).           |
| **3** | The C-improved version | (no gate)    | Score 2. This is the reward — you just enjoy it.               |

**Why this works:**

- **No "wrong" answers.** You're never punished — you just see a less improved version of history. The games still get made; you just contributed less.
- **Skill = insight.** Surviving the broken version means you understand _why_ it's broken — you've felt the problem firsthand. That earns you the right to suggest a fix.
- **Visible locked options create intrigue.** Seeing greyed-out B and C options after failing makes the player think _"I wonder what those said..."_ — natural replay motivation without a score screen telling them they failed.
- **Progressive revelation.** Each round literally shows the game getting better, which mirrors the real iterative design process. The students playing this at the game jam will _feel_ how iteration works.

**Creativity score** is still tracked per chapter (0, 1, or 2) for a max of 6 across three chapters. This drives the ending.

---

### Ending: Return to the Game Jam

The vortex appears one final time. Winston tumbles out...

**Ending depends on total creativity score (sum of 0/1/2 across three chapters, max 6):**

#### Ending A: Score 0–2 ("It's Fine" Ending)

- Winston lands back at the game jam. It's **2026**. Everything is normal.
- _"Hey, Winston! You're just in time. The game jam is about to start!"_
- A friend waves. Winston walks into the building.
- Text: _"Winston made it to the game jam. The games were pretty good."_
- Credits roll. Text: **"But what if you'd played a little longer...?"**

#### Ending B: Score 3–4 ("Creative Spark" Ending)

- Winston lands back at the game jam. It's **2026**.
- _"Winston! There you are! We came up with some killer ideas while we were waiting..."_
- Montage of Super Mario Brothers, Sonic, Street Fighter, but with camels
- Text: _"Winston pushed a little harder, dug a little deeper to find inspiration, and it's going to pay off at this year's Camel City Game Jam"_
- Credits roll with fun retro music.

#### Ending C: Score 5–6 ("Visionary" Ending — the full experience)

- Winston tumbles out of the vortex. Something's different. The buildings look futuristic.
- _"Wait... what year is it?"_
- A sign reads: **"CAMEL CITY GAME JAM 2030"**
- A student comes to a soft landing with a jetpack. _"Whoa... did you... walk here?"_
- _"Well, hurry up! It was YOUR idea to do 50-foot holographic Kaiju this year, so we don't have time to waste!"_
- _"Hurry, before we miss the opening ceremonies!"_
- Pixel-art fireworks go off. NeoPixel LEDs on the PyGamer flash. Fireworks sounds?
- Text: **"The future of games is in YOUR hands. Now go make something amazing."**
- Credits roll with upbeat chiptune music.

---

## 5. Art Style & Presentation

- **Palette:** MakeCode Arcade's built-in 16-color palette (which includes rich primaries and a nice range — perfect for retro 8-bit look)
- **Sprites:** 16×16 for characters, 8×8 for small objects (bricks, dots, blocks)
- **Winston the Camel:** Tan/brown, two humps, simple expressive face. Walks with a charming bobble animation.
- **Tilemaps:** Each era has a distinct color scheme:
  - 1975 Atari: Warm browns and oranges (wood-paneled 70s office)
  - 1979 Namco: Cool blues and whites (clean Japanese office)
  - 1984 Moscow: Grey and muted tones (Soviet institutional)
  - 2026/2030 Game Jam: Bright, colorful, celebratory
- **Dialogue:** Bottom of screen, classic RPG-style text boxes. Short lines (the screen is only 160×120). A button to advance.
- **Transitions:** Screen wipe or flash effect for vortex travel

---

## 6. Controls

| Input                | Action                                                                              |
| -------------------- | ----------------------------------------------------------------------------------- |
| **D-pad Left/Right** | Move paddle (Breakout), move Pac-Man (Pac-Man), move block (Tetris), navigate menus |
| **D-pad Up/Down**    | Move Pac-Man (Pac-Man), soft drop (Tetris), navigate menus                          |
| **A Button**         | Launch ball (Breakout), rotate piece (Tetris), confirm/advance dialogue             |
| **B Button**         | Back / skip dialogue (where appropriate)                                            |

---

## 7. Sound Design

- **Vortex:** Swooshing/warping chiptune sound effect
- **Dialogue:** Classic "blip blip blip" text scroll sound
- **Mini-games:** Each gets a brief, era-appropriate music loop:
  - Breakout: Simple percussive beeps (very early arcade)
  - Pac-Man: Bouncy, melodic loop
  - Tetris: A nod to the classic Tetris theme (simplified, original composition to avoid copyright — maybe a folk-style melody in the same spirit)
- **Endings:** Upbeat chiptune theme for credits

---

## 8. Scope & Memory Management

### What keeps this feasible:

1. **Scene-based architecture:** Each chapter is a self-contained scene. When you leave an era, all its sprites and tilemaps are destroyed. MakeCode Arcade handles this natively with `game.pushScene()` and `game.popScene()`.

2. **Small mini-games:** Each playable segment is tiny — small tilemaps, few sprites, simple logic. The Breakout clone needs: 1 paddle, 1 ball, ~24 bricks. Pac-Man needs: 1 player, 4 ghosts, a small tilemap. Tetris needs: 1 falling piece, a grid.

3. **Text-heavy, not asset-heavy:** Most of the game is dialogue and simple scenes. Text is cheap. Large background images are expensive (~10 KB each at full screen). We use tilemaps (cheap) instead of full-screen images.

4. **Rounds reuse the same scene:** Each chapter's 3 rounds happen in the same scene, just swapping out game logic and adding sprites (colored bricks, colored ghosts, new piece shapes). No need to tear down and rebuild between rounds — just modify the active gameplay elements.

5. **16-color palette:** MakeCode Arcade enforces this. It's actually a benefit — every pixel is 4 bits, halving image memory vs. 8-bit color.

6. **No persistent state needed:** We only track 3 integers (creativity flags) across scenes.

### Estimated memory footprint:

- Each mini-game scene: ~10–15 KB (tilemap + sprites + logic)
- Dialogue scenes: ~5 KB each
- Total active memory at any point: well under 100 KB
- **The 192 KB RAM of the PyGamer gives us ample headroom.**

### What to watch for:

- Don't load all mini-games at once — use scene transitions
- Keep tilemaps small (10×8 to 16×12 tiles max)
- Reuse sprite templates where possible
- Test on hardware regularly during development

---

## 9. Easter Eggs & Hidden Details

- **Konami Code?** If the player enters Up-Up-Down-Down-Left-Right-Left-Right-B-A on the title screen, something similar to the coin sound effect from Super Mario Brothers sounds from the speaker, and the NeoPixels flash quickly, and Winston wears sunglasses for the entire game. (Fun, low-memory-cost easter egg.)
- **NeoPixel LEDs:** The PyGamer has 5 NeoPixels below the screen. In the "Visionary" ending, they flash in celebration. During vortex transitions, they could swirl.

---

## 10. Credits Screen

```
CAMEL CITY TIME JAM

Created for the
CAMEL CITY GAME JAM
Winston-Salem, NC

Sponsored by
MARTES DELTA CO, LLC

Made with love on the
Adafruit PyGamer

Source code available at:
[github.com/thomasqbrady/CamelCityTimeJam](https://github.com/thomasqbrady/CamelCityTimeJam)
```
