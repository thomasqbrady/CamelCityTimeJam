// ============================================================
// CAMEL CITY TIME JAM — Chapter 2: Pac-Man (Namco, 1979)
// ============================================================

namespace CCTJ {
  // Ghost colors: Blinky=red(2), Pinky=pink(3), Inky=light-blue(9), Clyde=orange(4)
  const ghostColors = [2, 3, 9, 4];

  // ── Maze data ─────────────────────────────────────────────
  // 20×15 tiles (8px each = 160×120 screen)
  // 0=dot, 1=wall, 2=power pellet, 3=empty corridor (no dot)
  //
  // Inspired by classic maze games but with an original layout
  // designed for our compact 160×120 play-field.

  const TILE = 8;
  const MAZE_COLS = 20;
  const MAZE_ROWS = 15;

  const MAZE: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 1, 0, 2, 1],
    [1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  /** Pac-Man start position (center bottom area) */
  const PAC_COL = 9;
  const PAC_ROW = 11;

  /** Ghost start positions (center of maze) */
  const GHOST_STARTS: number[][] = [
    [8, 7],
    [9, 7],
    [10, 7],
    [11, 7],
  ];

  // ── Maze helpers ──────────────────────────────────────────

  function mazeWalkable(col: number, row: number): boolean {
    if (row < 0 || row >= MAZE_ROWS || col < 0 || col >= MAZE_COLS)
      return false;
    return MAZE[row][col] != 1;
  }

  function tileX(col: number): number {
    return col * TILE + 4;
  }
  function tileY(row: number): number {
    return row * TILE + 4;
  }

  /** Draw the maze walls on a background image. */
  function drawMaze(bg: Image): void {
    bg.fill(15); // black

    // Fill wall tiles with dark blue
    for (let row = 0; row < MAZE_ROWS; row++) {
      for (let col = 0; col < MAZE_COLS; col++) {
        if (MAZE[row][col] == 1) {
          bg.fillRect(col * TILE, row * TILE, TILE, TILE, 8);
        }
      }
    }

    // Draw light-blue outlines on wall edges facing corridors
    for (let row = 0; row < MAZE_ROWS; row++) {
      for (let col = 0; col < MAZE_COLS; col++) {
        if (MAZE[row][col] != 1) continue;
        let x0 = col * TILE;
        let y0 = row * TILE;
        // Inner edges (corridor-facing)
        if (row > 0 && MAZE[row - 1][col] != 1)
          bg.drawLine(x0, y0, x0 + TILE - 1, y0, 9);
        if (row < MAZE_ROWS - 1 && MAZE[row + 1][col] != 1)
          bg.drawLine(x0, y0 + TILE - 1, x0 + TILE - 1, y0 + TILE - 1, 9);
        if (col > 0 && MAZE[row][col - 1] != 1)
          bg.drawLine(x0, y0, x0, y0 + TILE - 1, 9);
        if (col < MAZE_COLS - 1 && MAZE[row][col + 1] != 1)
          bg.drawLine(x0 + TILE - 1, y0, x0 + TILE - 1, y0 + TILE - 1, 9);
        // Outer border edges
        if (row == 0) bg.drawLine(x0, y0, x0 + TILE - 1, y0, 9);
        if (row == MAZE_ROWS - 1)
          bg.drawLine(x0, y0 + TILE - 1, x0 + TILE - 1, y0 + TILE - 1, 9);
        if (col == 0) bg.drawLine(x0, y0, x0, y0 + TILE - 1, 9);
        if (col == MAZE_COLS - 1)
          bg.drawLine(x0 + TILE - 1, y0, x0 + TILE - 1, y0 + TILE - 1, 9);
      }
    }
  }

  /** Place dots on the background and build the collection map. */
  function placeDots(bg: Image, variant: number, dotMap: boolean[][]): void {
    for (let row = 0; row < MAZE_ROWS; row++) {
      dotMap.push([]);
      for (let col = 0; col < MAZE_COLS; col++) {
        let cell = MAZE[row][col];
        if (cell == 0) {
          dotMap[row].push(true);
          // Small white pellet dot
          bg.fillRect(col * TILE + 3, row * TILE + 3, 2, 2, 1);
        } else if (cell == 2 && variant >= 2) {
          dotMap[row].push(true);
          // Large yellow power pellet
          bg.fillRect(col * TILE + 2, row * TILE + 2, 4, 4, 5);
        } else if (cell == 2) {
          // Variant 1: power pellet spots become regular dots
          dotMap[row].push(true);
          bg.fillRect(col * TILE + 3, row * TILE + 3, 2, 2, 1);
        } else {
          dotMap[row].push(false);
        }
      }
    }
  }

  /** Eat a dot at the given tile. Returns 0=nothing, 1=dot, 2=power pellet */
  function eatDot(
    col: number,
    row: number,
    bg: Image,
    dotMap: boolean[][],
    variant: number,
  ): number {
    if (row < 0 || row >= MAZE_ROWS || col < 0 || col >= MAZE_COLS) return 0;
    if (!dotMap[row][col]) return 0;
    dotMap[row][col] = false;
    // Erase from background
    bg.fillRect(col * TILE + 1, row * TILE + 1, 6, 6, 15);
    if (MAZE[row][col] == 2 && variant >= 2) return 2;
    return 1;
  }

  // ── Pac-Man round ──────────────────────────────────────────

  /**
   * variant 1: all red ghosts, random movement, no power pellets
   * variant 2: power pellets added, ghosts still random
   * variant 3: colored ghosts with distinct AI + power pellets
   * Returns true if player survived 10 seconds.
   */
  function playPacRound(variant: number, gated: boolean): boolean {
    clearAllSprites();

    // ── Draw maze background ──
    let bg = image.create(160, 120);
    scene.setBackgroundImage(bg);
    let dotMap: boolean[][] = [];
    drawMaze(bg);
    placeDots(bg, variant, dotMap);

    // ── Create Pac-Man ──
    let pac = sprites.create(Art.pacOpen, SpriteKind.Player);
    let pcol = PAC_COL;
    let prow = PAC_ROW;
    let ptcol = pcol; // target tile column
    let ptrow = prow; // target tile row
    pac.setPosition(tileX(pcol), tileY(prow));
    let pdx = -1,
      pdy = 0; // current move direction (start going left)
    let pwdx = -1,
      pwdy = 0; // buffered input direction
    let pacSpeed = 1; // pixels per frame

    // Mouth animation
    let mouthOpen = true;
    let mouthFrame = 0;

    // ── Create ghosts ──
    let gs: Sprite[] = [];
    let gcols: number[] = [];
    let grows: number[] = [];
    let gtcols: number[] = [];
    let gtrows: number[] = [];
    let gdxs: number[] = [];
    let gdys: number[] = [];

    // Stagger ghost start directions for variety
    let startDxs = [0, 0, -1, 1];
    let startDys = [-1, 1, 0, 0];

    for (let i = 0; i < 4; i++) {
      let color = variant == 3 ? ghostColors[i] : 2;
      let g = sprites.create(Art.ghostSprite(color), SpriteKind.Ghost);
      let sc = GHOST_STARTS[i][0];
      let sr = GHOST_STARTS[i][1];
      g.setPosition(tileX(sc), tileY(sr));
      gs.push(g);
      gcols.push(sc);
      grows.push(sr);
      gtcols.push(sc);
      gtrows.push(sr);
      gdxs.push(startDxs[i]);
      gdys.push(startDys[i]);
    }

    let ghostSpd = 1;

    // ── Game state ──
    let frightenedUntil = 0;
    let failed = false;
    let start = game.runtime();
    let ghostTick = 0;

    // ── Main game loop ──
    while (game.runtime() - start < 10000) {
      let now = game.runtime();
      let frightened = frightenedUntil > now;

      // ── Read input ──
      if (controller.left.isPressed()) {
        pwdx = -1;
        pwdy = 0;
      } else if (controller.right.isPressed()) {
        pwdx = 1;
        pwdy = 0;
      } else if (controller.up.isPressed()) {
        pwdx = 0;
        pwdy = -1;
      } else if (controller.down.isPressed()) {
        pwdx = 0;
        pwdy = 1;
      }

      // ── Pac-Man movement (grid-snapped) ──
      let ptx = tileX(ptcol);
      let pty = tileY(ptrow);
      let atTarget =
        Math.abs(pac.x - ptx) <= pacSpeed && Math.abs(pac.y - pty) <= pacSpeed;

      if (atTarget) {
        // Snap to tile center
        pac.x = ptx;
        pac.y = pty;
        pcol = ptcol;
        prow = ptrow;

        // Eat dot at this tile
        let ate = eatDot(pcol, prow, bg, dotMap, variant);
        if (ate == 2) {
          frightenedUntil = now + 4000;
          for (let g of gs) g.setImage(Art.ghostFrightened);
        }

        // Try buffered direction first
        if (mazeWalkable(pcol + pwdx, prow + pwdy)) {
          pdx = pwdx;
          pdy = pwdy;
        }

        // Advance in current direction if clear
        if (mazeWalkable(pcol + pdx, prow + pdy)) {
          ptcol = pcol + pdx;
          ptrow = prow + pdy;
        }
        // else: pac stays put until a valid direction is pressed
      } else {
        // Lerp toward target tile
        if (pac.x != ptx) pac.x += pac.x < ptx ? pacSpeed : -pacSpeed;
        else if (pac.y != pty) pac.y += pac.y < pty ? pacSpeed : -pacSpeed;
      }

      // Mouth animation
      mouthFrame++;
      if (mouthFrame > 4) {
        mouthFrame = 0;
        mouthOpen = !mouthOpen;
        pac.setImage(mouthOpen ? Art.pacOpen : Art.pacClosed);
      }

      // ── Ghost movement (grid-snapped, skip 2 of every 5 frames for 40% slower) ──
      ghostTick++;
      let moveGhosts = ghostTick % 5 < 3;
      for (let i = 0; moveGhosts && i < 4; i++) {
        let gtx = tileX(gtcols[i]);
        let gty = tileY(gtrows[i]);
        let gAt =
          Math.abs(gs[i].x - gtx) <= ghostSpd &&
          Math.abs(gs[i].y - gty) <= ghostSpd;

        if (gAt) {
          // Snap to tile center
          gs[i].x = gtx;
          gs[i].y = gty;
          gcols[i] = gtcols[i];
          grows[i] = gtrows[i];

          // Restore ghost appearance when fright ends
          if (!frightened) {
            let c = variant == 3 ? ghostColors[i] : 2;
            gs[i].setImage(Art.ghostSprite(c));
          }

          // ── Choose next direction at intersection ──
          let dirs = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
          ];
          let valid: number[][] = [];
          for (let d of dirs) {
            // No reversing (classic rule)
            if (d[0] == -gdxs[i] && d[1] == -gdys[i]) continue;
            if (mazeWalkable(gcols[i] + d[0], grows[i] + d[1])) valid.push(d);
          }
          // Dead-end: allow reverse
          if (valid.length == 0) {
            let rd = [-gdxs[i], -gdys[i]];
            if (mazeWalkable(gcols[i] + rd[0], grows[i] + rd[1]))
              valid.push(rd);
          }

          if (valid.length > 0) {
            let chosen = valid[0];

            if (frightened || variant <= 2) {
              // Random direction when frightened or early variants
              chosen = valid[randint(0, valid.length - 1)];
            } else {
              // Variant 3: personality-based targeting
              let targetCol = pcol;
              let targetRow = prow;

              if (i == 0) {
                // Blinky — direct chase
                targetCol = pcol;
                targetRow = prow;
              } else if (i == 1) {
                // Pinky — 4 tiles ahead of pac
                targetCol = pcol + pdx * 4;
                targetRow = prow + pdy * 4;
              } else if (i == 2) {
                // Inky — erratic (random offset)
                targetCol = pcol + randint(-5, 5);
                targetRow = prow + randint(-5, 5);
              } else {
                // Clyde — chase far, scatter near
                let dist =
                  Math.abs(pcol - gcols[i]) + Math.abs(prow - grows[i]);
                if (dist < 6) {
                  targetCol = 1;
                  targetRow = 13;
                } else {
                  targetCol = pcol;
                  targetRow = prow;
                }
              }

              // Pick direction that minimizes distance to target
              let bestDist = 999;
              for (let d of valid) {
                let nc = gcols[i] + d[0];
                let nr = grows[i] + d[1];
                let dd = Math.abs(targetCol - nc) + Math.abs(targetRow - nr);
                if (dd < bestDist) {
                  bestDist = dd;
                  chosen = d;
                }
              }
            }

            gdxs[i] = chosen[0];
            gdys[i] = chosen[1];
            gtcols[i] = gcols[i] + gdxs[i];
            gtrows[i] = grows[i] + gdys[i];
          }
        } else {
          // Lerp toward target tile
          if (gs[i].x != gtx) gs[i].x += gs[i].x < gtx ? ghostSpd : -ghostSpd;
          else if (gs[i].y != gty)
            gs[i].y += gs[i].y < gty ? ghostSpd : -ghostSpd;
        }
      }

      // ── Ghost collision ──
      for (let i = 0; i < 4; i++) {
        if (Math.abs(pac.x - gs[i].x) < 6 && Math.abs(pac.y - gs[i].y) < 6) {
          if (variant >= 2 && frightened) {
            // Eat ghost — send back to pen
            let sc = GHOST_STARTS[i][0];
            let sr = GHOST_STARTS[i][1];
            gcols[i] = sc;
            grows[i] = sr;
            gtcols[i] = sc;
            gtrows[i] = sr;
            gs[i].x = tileX(sc);
            gs[i].y = tileY(sr);
            gdxs[i] = 0;
            gdys[i] = -1;
          } else {
            failed = true;
          }
        }
      }

      if (failed) break;
      pause(20);
    }

    clearAllSprites();

    if (!gated) return true;
    return !failed;
  }

  // ── Chapter 2 flow ─────────────────────────────────────────

  export function playChapter2(): void {
    vortexTransition("1979 - TOKYO");

    // Scene: Namco office
    setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84); // blue bg — clean Japanese office

    npcSay("IWATANI", "...Nan desu ka?! How about English?");
    npcSay(
      "IWATANI",
      "I'm Iwatani, and this is Namco. There isn't usually a camel in here.",
    );
    npcSay("IWATANI", "Oh! Are you here for the playtest?");
    npcSay(
      "IWATANI",
      "I'm trying to make a game that everyone can enjoy -- not just kids who like shooting aliens.",
    );
    npcSay(
      "IWATANI",
      "My idea? A maze game about eating. The character was inspired by a pizza with a slice removed!",
    );
    npcSay("IWATANI", "Try it!");

    clearAllSprites();

    // ── Round 1: Broken prototype ──────────────────────────
    say(["ROUND 1: Maze prototype. Avoid the ghosts for 10 seconds!"]);
    let r1 = playPacRound(1, true);

    setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
    if (r1) {
      npcSay(
        "IWATANI",
        "You survived! The ghosts are boring though, aren't they?",
      );
    } else {
      npcSay("IWATANI", "Those ghosts are tricky! What do you think?");
    }

    let pick1 = chooseIdea("How would you improve it?", [
      new ChoiceOption("It seems fine to me", true),
      new ChoiceOption("Is it just about running away?", r1),
    ]);

    if (pick1 == 0) {
      setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
      npcSay(
        "IWATANI",
        "Hm. I thought so too at first. But the ghosts are boring, right?",
      );
      npcSay("IWATANI", "Well, thank you for playing, camel-san!");
      return;
    }

    // Player chose to improve — add power pellets
    creativityScore += 1;
    setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
    npcSay("IWATANI", "Turn the hunter into the hunted! Brilliant!");
    npcSay(
      "IWATANI",
      "We could add special pills at the edges that let YOU eat the GHOSTS!",
    );

    // ── Round 2: Power pellets ─────────────────────────────
    say(["ROUND 2: Power pellets let you fight back!"]);
    let r2 = playPacRound(2, true);

    setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
    if (r2) {
      npcSay(
        "IWATANI",
        "Much better! But the ghosts still feel the same. Any other ideas?",
      );
    } else {
      npcSay(
        "IWATANI",
        "The power pellets help! But what about the ghosts themselves?",
      );
    }

    let pick2 = chooseIdea("Any more ideas?", [
      new ChoiceOption("It's good now", true),
      new ChoiceOption("Give each ghost personality", r2),
    ]);

    if (pick2 == 0) {
      setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
      npcSay(
        "IWATANI",
        "The power pellets change everything! Thank you, camel-san!",
      );
      return;
    }

    // Player chose ghost personalities
    creativityScore += 1;
    setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
    npcSay("IWATANI", "Different behaviors! One could chase directly...");
    npcSay("IWATANI", "One could try to ambush you from ahead...");
    npcSay("IWATANI", "They'd work as a team without even knowing it!");
    npcSay(
      "IWATANI",
      "And DIFFERENT COLORS! My boss insisted they all be the same.",
    );
    npcSay("IWATANI", "I took a poll: 40 to 0 in favor of different colors.");
    npcSay("IWATANI", "Make that 41 now!");

    // ── Round 3: Full Pac-Man ──────────────────────────────
    say(["ROUND 3: Colored ghosts with unique AI! Watch their patterns!"]);
    playPacRound(3, false);

    setupRichScene(Art.bg_namco, Art.iwatani, 32, 84, 128, 84);
    npcSay("IWATANI", "This is going to bring everyone to the arcade!");
    npcSay("IWATANI", "I'm calling it... Puck Man!");
    npcSay("IWATANI", "...though the American branch may want to rename it.");
  }
}
