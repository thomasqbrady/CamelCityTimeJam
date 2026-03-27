# Art Inventory — Camel City Time Jam

All assets target **MakeCode Arcade** on the **Adafruit PyGamer** (160×120 px, 16-color indexed palette). Art should be created with PixelLab and then converted to MakeCode's image literal format for `src/images.ts`.

## MakeCode Arcade 16-Color Palette

| Index | Hex       | Name           |
|-------|-----------|----------------|
| 0     | —         | Transparent    |
| 1     | `#ffffff` | White          |
| 2     | `#ff2121` | Red            |
| 3     | `#ff93c4` | Pink           |
| 4     | `#ff8135` | Orange         |
| 5     | `#fff609` | Yellow         |
| 6     | `#249ca3` | Teal           |
| 7     | `#78dc52` | Green          |
| 8     | `#003fad` | Blue           |
| 9     | `#87f2ff` | Light Blue     |
| 10    | `#8e2ec4` | Purple         |
| 11    | `#a4839f` | Grey-Lavender  |
| 12    | `#5c406c` | Dark Purple    |
| 13    | `#e5cdc4` | Cream/Tan      |
| 14    | `#91463d` | Brown          |
| 15    | `#000000` | Black          |

---

## 1. Character Sprites (16×16)

### 1.1 Winston the Camel — Idle / Walk Right
- **Dimensions:** 16×16
- **Frames:** 2 (idle pose, mid-stride)
- **Description:** A friendly cartoon pixel-art camel facing right. Tan/sandy body (use palette colors 4 orange and 13 cream). Two humps on the back. Simple round black eyes, a small smiling mouth. Short legs. Cute and approachable, not realistic — think mascot character. Retro 8-bit game style.
- **Used in:** Opening scene, dialogue scenes, endings

### 1.2 Winston with Sunglasses
- **Dimensions:** 16×16
- **Frames:** 1
- **Description:** Same camel as 1.1 but wearing black pixel sunglasses across the eyes. Cool, confident look. Easter egg variant triggered by the Konami code.
- **Used in:** Entire game when Konami code is activated

### 1.3 Nolan Bushnell (Atari founder)
- **Dimensions:** 16×16
- **Frames:** 1
- **Description:** A 1970s American businessman in pixel art. Shaggy brown hair, bushy sideburns, wide-collared orange/brown shirt (70s fashion). Friendly, enthusiastic expression. Standing pose facing the viewer. Should evoke the casual, freewheeling energy of 1970s Silicon Valley.
- **Used in:** Chapter 1 dialogue scenes

### 1.4 Toru Iwatani (Pac-Man creator)
- **Dimensions:** 16×16
- **Frames:** 1
- **Description:** A young Japanese game designer in pixel art. Neat black hair, round glasses, white collared shirt. Friendly, thoughtful expression. Standing pose facing the viewer. Clean, professional look befitting a 1979 Tokyo game company.
- **Used in:** Chapter 2 dialogue scenes

### 1.5 Alexey Pajitnov (Tetris creator)
- **Dimensions:** 16×16
- **Frames:** 1
- **Description:** A bearded Russian man in pixel art. Full brown beard, round glasses, dark teal/green knit sweater. Warm, intellectual expression. Standing pose facing the viewer. Should look like a friendly 1984 Soviet-era computer scientist.
- **Used in:** Chapter 3 dialogue scenes

---

## 2. Game Jam Building (16×16)

### 2.1 Game Jam Building
- **Dimensions:** 16×16
- **Frames:** 1
- **Description:** A small pixel-art building front view. Simple rectangular structure with a door in the center, two windows on each side. A sign or banner reading "GAME JAM" above the entrance. Bright, welcoming colors. Modern building style.
- **Used in:** Opening cutscene, Ending A and B scenes

---

## 3. Breakout Assets (Chapter 1)

### 3.1 Paddle
- **Dimensions:** 20×3
- **Frames:** 1
- **Description:** A horizontal game paddle for Breakout. Bright blue with light blue highlight on top edge. Clean, simple rectangular shape with slightly rounded feel. Should read clearly against a black background.
- **Used in:** All Breakout rounds

### 3.2 Ball
- **Dimensions:** 4×4
- **Frames:** 1
- **Description:** A small round ball for Breakout. Bright yellow/white with a slight highlight. Diamond shape (corners transparent) to look round at small size.
- **Used in:** All Breakout rounds

### 3.3 Bricks (runtime-generated)
- **Dimensions:** 16×6 (generated at runtime by filling with palette colors)
- **Note:** Bricks are created programmatically — row 0 is red (2), row 1 is orange (4), row 2 is yellow (5). Monochrome variant uses white (1). No separate art asset needed unless we want textured bricks.

---

## 4. Pac-Man Assets (Chapter 2)

### 4.1 Pac-Man — Mouth Open
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Classic Pac-Man character with mouth wide open facing right. Bright yellow, circular shape. The mouth should be a clear triangular wedge removed from the right side. Black background should show through the mouth opening.
- **Used in:** All Pac-Man rounds (alternates with closed)

### 4.2 Pac-Man — Mouth Closed
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Same Pac-Man as 4.1 but with mouth closed — a complete yellow circle. Used for mouth-chomp animation by alternating with the open frame.
- **Used in:** All Pac-Man rounds

### 4.3 Ghost — Red (Blinky)
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Classic arcade ghost shape in red. Rounded top, wavy bottom edge (two or three scallops). Two white eyes with dark pupils looking forward. Iconic ghost silhouette.
- **Used in:** All Pac-Man rounds (v1/v2 all ghosts are this color)

### 4.4 Ghost — Pink (Pinky)
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Same ghost shape as 4.3 but in pink (palette color 3). White eyes with dark pupils.
- **Used in:** Pac-Man round 3

### 4.5 Ghost — Cyan (Inky)
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Same ghost shape as 4.3 but in light blue/cyan (palette color 9). White eyes with dark pupils.
- **Used in:** Pac-Man round 3

### 4.6 Ghost — Orange (Clyde)
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Same ghost shape as 4.3 but in orange (palette color 4). White eyes with dark pupils.
- **Used in:** Pac-Man round 3

### 4.7 Ghost — Frightened
- **Dimensions:** 8×8
- **Frames:** 1
- **Description:** Ghost in "frightened" state — dark blue body (palette color 8). Same ghost silhouette but with a wobbly/wavy mouth line and small white eyes showing fear. Should look clearly different from the normal ghost colors.
- **Used in:** Pac-Man rounds 2 and 3 (when power pellet is active)

### 4.8 Dot
- **Dimensions:** 3×3
- **Frames:** 1
- **Description:** A tiny white dot (single center pixel with slight cross shape). The pellets Pac-Man eats in the maze.
- **Used in:** All Pac-Man rounds

### 4.9 Power Pellet
- **Dimensions:** 5×5
- **Frames:** 1 (could optionally pulse — 2 frames)
- **Description:** A larger, brighter pellet. Yellow, diamond or circle shape. Should be visually distinct from the small dots — clearly a power-up. Bright and attention-grabbing.
- **Used in:** Pac-Man rounds 2 and 3

---

## 5. Vortex / Portal (16×16)

### 5.1 Time Vortex
- **Dimensions:** 16×16
- **Frames:** 1 (static is fine — animation is handled by screen effects)
- **Description:** A swirling circular portal/vortex. Concentric rings of purple, blue, and light blue spiraling inward to a bright white/transparent center. Should evoke a time warp or dimensional rift. Pixel art style matching the retro game aesthetic.
- **Used in:** Opening cutscene, chapter transitions

---

## 6. Tetris / Falling Blocks (Chapter 3)

### 6.1 Block Cells
- **Note:** Tetris blocks are drawn procedurally on the background image using filled rectangles with palette colors. Each tetromino piece uses a distinct color:
  - I-piece: Light Blue (9)
  - O-piece: Yellow (5)
  - T-piece: Purple (10)
  - L-piece: Orange (4)
  - J-piece: Blue (8)
  - S-piece: Green (7)
  - Z-piece: Red (2)
  - Pentomino pieces: Green (7)
- **No separate sprite assets needed** — blocks are 7×7 pixel filled rectangles drawn directly.

---

## 7. Optional / Nice-to-Have Assets

These would enhance the game but are not required for the initial build:

### 7.1 Chapter Card Banners
- **Dimensions:** 120×20 each
- **Frames:** 1 each
- **Description:** Three small banner images shown during chapter transitions:
  - "1975 — ATARI, CALIFORNIA" in warm brown/orange retro font style
  - "1979 — NAMCO, TOKYO" in cool blue clean font style
  - "1984 — COMPUTING CENTRE, MOSCOW" in grey austere font style
- **Used in:** Chapter transitions (currently handled by game.splash)

### 7.2 Dialogue Portraits (24×24)
- **Dimensions:** 24×24 each
- **Description:** Larger portrait versions of Bushnell, Iwatani, and Pajitnov for display in dialogue boxes. More detail than the 16×16 sprites — show personality and era-appropriate styling. Would appear in a small frame next to dialogue text.
- **Used in:** Could enhance dialogue scenes

### 7.3 Ending C — Futuristic Elements
- **Dimensions:** Various
- **Description:** Small futuristic set pieces for the "Visionary" ending:
  - A "2030" sign in neon/holographic style
  - A tiny student character with a jetpack
  - Firework burst sprites (8×8, 2-3 colors)
- **Used in:** Ending C scene

### 7.4 Winston Walk Animation
- **Dimensions:** 16×16
- **Frames:** 4 (walk cycle: stand, step-right, stand, step-left)
- **Description:** Full walk cycle for Winston the camel moving right. Legs alternate, humps bob slightly. Charming, bouncy movement. Would replace the current programmatic bobble.
- **Used in:** Opening cutscene

---

## Asset Summary

| # | Asset | Size | Priority | Status |
|---|-------|------|----------|--------|
| 1.1 | Winston idle/walk | 16×16 ×2 | **HIGH** | Placeholder |
| 1.2 | Winston sunglasses | 16×16 ×1 | Medium | Placeholder |
| 1.3 | Bushnell NPC | 16×16 ×1 | **HIGH** | Placeholder |
| 1.4 | Iwatani NPC | 16×16 ×1 | **HIGH** | Placeholder |
| 1.5 | Pajitnov NPC | 16×16 ×1 | **HIGH** | Placeholder |
| 2.1 | Game Jam building | 16×16 ×1 | **HIGH** | Placeholder |
| 3.1 | Breakout paddle | 20×3 ×1 | **HIGH** | Placeholder |
| 3.2 | Breakout ball | 4×4 ×1 | **HIGH** | Placeholder |
| 4.1 | Pac-Man open | 8×8 ×1 | **HIGH** | Placeholder |
| 4.2 | Pac-Man closed | 8×8 ×1 | **HIGH** | Placeholder |
| 4.3 | Ghost red | 8×8 ×1 | **HIGH** | Placeholder |
| 4.4 | Ghost pink | 8×8 ×1 | **HIGH** | Placeholder |
| 4.5 | Ghost cyan | 8×8 ×1 | **HIGH** | Placeholder |
| 4.6 | Ghost orange | 8×8 ×1 | **HIGH** | Placeholder |
| 4.7 | Ghost frightened | 8×8 ×1 | **HIGH** | Placeholder |
| 4.8 | Dot | 3×3 ×1 | Medium | Placeholder |
| 4.9 | Power pellet | 5×5 ×1 | Medium | Placeholder |
| 5.1 | Time vortex | 16×16 ×1 | **HIGH** | Placeholder |
| 7.1 | Chapter banners | 120×20 ×3 | Low | Not started |
| 7.2 | Dialogue portraits | 24×24 ×3 | Low | Not started |
| 7.3 | Ending C elements | Various | Low | Not started |
| 7.4 | Winston walk cycle | 16×16 ×4 | Low | Not started |
