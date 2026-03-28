// ============================================================
// CAMEL CITY TIME JAM — UI Helpers
// ============================================================
// Dialogue, choice menus, transitions, and sprite management.
// ============================================================

namespace SpriteKind {
  export const Paddle = SpriteKind.create();
  export const Ball = SpriteKind.create();
  export const Brick = SpriteKind.create();
  export const Ghost = SpriteKind.create();
  export const Pellet = SpriteKind.create();
  export const Npc = SpriteKind.create();
  export const Dot = SpriteKind.create();
}

namespace CCTJ {
  // ── Sprite cleanup ─────────────────────────────────────────

  const allKinds = [
    SpriteKind.Player,
    SpriteKind.Paddle,
    SpriteKind.Ball,
    SpriteKind.Brick,
    SpriteKind.Ghost,
    SpriteKind.Pellet,
    SpriteKind.Npc,
    SpriteKind.Dot,
    SpriteKind.Projectile,
    SpriteKind.Food,
    SpriteKind.Enemy,
  ];

  export function clearAllSprites(): void {
    for (let kind of allKinds) {
      for (let s of sprites.allOfKind(kind)) {
        s.destroy();
      }
    }
  }

  // ── Dialogue helpers ───────────────────────────────────────

  /** Show a sequence of dialogue lines (bottom text box). */
  /** Wait for A button to be released (prevents carry-over into next interaction). */
  export function debounceA(): void {
    while (controller.A.isPressed()) { pause(20); }
  }


  export function say(lines: string[]): void {
    for (let line of lines) {
      game.showLongText(line, DialogLayout.Bottom);
    }
    debounceA();
  }

  /** Show a single line of NPC dialogue with their name. */
  export function npcSay(name: string, text: string): void {
    game.showLongText(name + ": " + text, DialogLayout.Bottom);
    debounceA();
  }

  // ── Vortex transition ──────────────────────────────────────

  export function vortexTransition(label: string, skipVortex: boolean = false): void {
    // Flash effect — previous scene sprites stay visible
    for (let i = 0; i < 6; i++) {
      scene.setBackgroundColor(10); // purple
      pause(60);
      scene.setBackgroundColor(8); // blue
      pause(60);
      scene.setBackgroundColor(9); // light blue
      pause(40);
    }

    // Clear sprites after flash, before black screen
    clearAllSprites();
    scene.setBackgroundColor(15); // black
    pause(200);

    if (!skipVortex) {
      // Build spin frames from flipped variants
      let vBase = Art.vortex;
      let vFx = vBase.clone();
      vFx.flipX();
      let vFxy = vFx.clone();
      vFxy.flipY();
      let vFy = vBase.clone();
      vFy.flipY();
      let spinFrames = [vBase, vFx, vFxy, vFy];

      // Show the vortex sprite briefly, spinning
      let v = sprites.create(Art.vortex, SpriteKind.Npc);
      v.setPosition(80, 60);
      scene.cameraShake(4, 500);
      let sf = 0;
      for (let spin = 0; spin < 8; spin++) {
        v.setImage(spinFrames[sf % 4]);
        sf++;
        pause(75);
      }
      v.destroy(effects.disintegrate, 400);
      pause(500);
    }

    // Chapter card
    scene.setBackgroundColor(15);
    game.splash("MEANWHILE...", label);
  }

  // ── Scene setup ────────────────────────────────────────────

  /** Set up a dialogue scene with a colored background and NPC. */
  export function setupDialogueScene(bgColor: number, npcImage: Image): Sprite {
    clearAllSprites();
    scene.setBackgroundColor(bgColor);
    let npc = sprites.create(npcImage, SpriteKind.Npc);
    npc.setPosition(32, 56);
    let winston = sprites.create(winstonImageLeft(), SpriteKind.Player);
    winston.setPosition(128, 56);
    return npc;
  }

  /** Set up a dialogue scene with a pre-rendered background image. */
  export function setupRichScene(bgImage: Image, npcImage: Image, npcX: number, npcY: number, winstonX: number, winstonY: number): Sprite {
    clearAllSprites();
    scene.setBackgroundImage(bgImage);
    let npc = sprites.create(npcImage, SpriteKind.Npc);
    npc.setPosition(npcX, npcY);
    let winston = sprites.create(winstonImageLeft(), SpriteKind.Player);
    winston.setPosition(winstonX, winstonY);
    return npc;
  }

  // ── Choice menu system ─────────────────────────────────────

  export class ChoiceOption {
    label: string;
    unlocked: boolean;

    constructor(label: string, unlocked: boolean) {
      this.label = label;
      this.unlocked = unlocked;
    }
  }

  /** Word-wrap text to fit within a max character width. */
  function wordWrap(text: string, maxChars: number): string[] {
    let words = text.split(" ");
    let lines: string[] = [];
    let line = "";
    for (let word of words) {
      if (line.length == 0) {
        line = word;
      } else if (line.length + 1 + word.length <= maxChars) {
        line = line + " " + word;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line.length > 0) lines.push(line);
    return lines;
  }

  function drawChoiceMenu(
    prompt: string,
    options: ChoiceOption[],
    selected: number,
  ): void {
    let bg = scene.backgroundImage();
    bg.fill(15); // black background

    // Prompt text
    bg.print(prompt, 4, 4, 1);
    bg.drawLine(4, 14, 156, 14, 12);

    let y = 24;
    for (let i = 0; i < options.length; i++) {
      let opt = options[i];
      let color = 1; // white

      // Status indicator and color
      let prefix = "  ";
      let isPlaceholder = opt.label == "Choose an answer...";
      if (!opt.unlocked && !isPlaceholder) {
        prefix = "? ";
        color = 11; // grey — locked
      } else if (selected == i) {
        prefix = "> ";
        color = isPlaceholder ? 11 : 5; // grey for placeholder, yellow for real options
      }

      // Word-wrap the label (24 chars max with prefix and margins)
      let wrappedLines = wordWrap(opt.label, 22);
      let blockHeight = wrappedLines.length * 10 + 4;

      // Draw selection highlight
      if (selected == i) {
        bg.fillRect(2, y - 2, 156, blockHeight, 12); // dark purple highlight
      }

      // Draw wrapped text
      for (let li = 0; li < wrappedLines.length; li++) {
        let linePrefix = li == 0 ? prefix : "  ";
        bg.print(linePrefix + wrappedLines[li], 6, y + li * 10, color);
      }

      // Show lock hint (but not for the placeholder option)
      if (!opt.unlocked && opt.label != "Choose an answer...") {
        bg.print("  (survive to unlock)", 6, y + wrappedLines.length * 10, 12);
        blockHeight += 10;
      }

      y += blockHeight + 4;
    }

    bg.print("D-pad:move  A:select", 4, 110, 11);
  }

  /**
   * Show the A/B/C choice menu. Returns the index of the chosen option.
   * Only unlocked, non-crossed options can be selected.
   */
  export function chooseIdea(prompt: string, options: ChoiceOption[]): number {
    clearAllSprites();
    scene.setBackgroundImage(image.create(160, 120));

    // Add a default placeholder at the top; cursor starts here
    let placeholder = new ChoiceOption("Choose an answer...", false);
    options.insertAt(0, placeholder);
    let selected = 0;

    let lastUp = controller.up.isPressed();
    let lastDown = controller.down.isPressed();
    let lastA = controller.A.isPressed();

    drawChoiceMenu(prompt, options, selected);

    while (true) {
      let up = controller.up.isPressed();
      let down = controller.down.isPressed();
      let a = controller.A.isPressed();

      if (up && !lastUp) {
        selected = (selected + options.length - 1) % options.length;
        drawChoiceMenu(prompt, options, selected);
      }
      if (down && !lastDown) {
        selected = (selected + 1) % options.length;
        drawChoiceMenu(prompt, options, selected);
      }

      if (a && !lastA) {
        let picked = options[selected];
        if (picked.unlocked) {
          // Remove placeholder and adjust index before returning
          options.removeAt(0);
          return selected - 1;
        }
        // No feedback needed — just don't do anything
      }

      lastUp = up;
      lastDown = down;
      lastA = a;
      pause(20);
    }
    return 0;
  }

  // ── Mini-game countdown ────────────────────────────────────

  export function countdown(): void {
    for (let n = 3; n >= 1; n--) {
      game.splash("" + n);
    }
    debounceA();
  }

  // ── Image helpers ──────────────────────────────────────────

  /**
   * Fill transparent pixels (color 0) by expanding from neighboring
   * non-transparent pixels. Repeats until all holes are filled.
   * Returns a new image with no transparency.
   */
  export function fillTransparent(src: Image): Image {
    let img = src.clone()
    let w = img.width
    let h = img.height
    // Repeat passes until no transparent pixels remain
    for (let pass = 0; pass < Math.max(w, h); pass++) {
      let changed = false
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (img.getPixel(x, y) != 0) continue
          // Sample non-transparent neighbors
          let c = 0
          if (x > 0 && img.getPixel(x - 1, y) != 0) c = img.getPixel(x - 1, y)
          else if (x < w - 1 && img.getPixel(x + 1, y) != 0) c = img.getPixel(x + 1, y)
          else if (y > 0 && img.getPixel(x, y - 1) != 0) c = img.getPixel(x, y - 1)
          else if (y < h - 1 && img.getPixel(x, y + 1) != 0) c = img.getPixel(x, y + 1)
          if (c != 0) {
            img.setPixel(x, y, c)
            changed = true
          }
        }
      }
      if (!changed) break
    }
    return img
  }

  // ── Clamp helper ───────────────────────────────────────────

  export function clampVelocity(s: Sprite, max: number): void {
    if (s.vx > max) s.vx = max;
    if (s.vx < -max) s.vx = -max;
    if (s.vy > max) s.vy = max;
    if (s.vy < -max) s.vy = -max;
  }
}
