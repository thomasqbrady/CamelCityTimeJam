// ============================================================
// CAMEL CITY TIME JAM — Main Entry Point
// ============================================================
// Title screen, Konami code detection, and game loop.
// ============================================================

// ── Konami code detection on title screen ──────────────────────

function waitForStartWithKonami(): void {
  // Konami: Up Up Down Down Left Right Left Right B A
  let konamiSeq = [1, 1, 2, 2, 3, 4, 3, 4, 5, 6];
  // 1=up, 2=down, 3=left, 4=right, 5=B, 6=A
  let konamiPos = 0;

  let lastUp = controller.up.isPressed();
  let lastDown = controller.down.isPressed();
  let lastLeft = controller.left.isPressed();
  let lastRight = controller.right.isPressed();
  let lastA = controller.A.isPressed();
  let lastB = controller.B.isPressed();

  while (true) {
    let up = controller.up.isPressed();
    let down = controller.down.isPressed();
    let left = controller.left.isPressed();
    let right = controller.right.isPressed();
    let a = controller.A.isPressed();
    let b = controller.B.isPressed();

    // Check for new button presses
    let pressed = 0;
    if (up && !lastUp) pressed = 1;
    if (down && !lastDown) pressed = 2;
    if (left && !lastLeft) pressed = 3;
    if (right && !lastRight) pressed = 4;
    if (b && !lastB) pressed = 5;
    if (a && !lastA) pressed = 6;

    if (pressed > 0) {
      if (pressed == konamiSeq[konamiPos]) {
        konamiPos += 1;
        if (konamiPos >= konamiSeq.length) {
          // Konami code entered!
          CCTJ.sunglassesMode = true;
          music.baDing.play();
          scene.cameraShake(2, 200);
          // Brief flash to confirm
          for (let i = 0; i < 3; i++) {
            scene.setBackgroundColor(5);
            pause(60);
            scene.setBackgroundColor(15);
            pause(60);
          }
          drawTitleScreen();
          konamiPos = 0;
        }
      } else {
        konamiPos = 0;
        // Check if this press starts a new sequence
        if (pressed == konamiSeq[0]) konamiPos = 1;
      }

      // A button (without Konami context) starts the game
      if (pressed == 6 && konamiPos <= 1) {
        return;
      }
    }

    lastUp = up;
    lastDown = down;
    lastLeft = left;
    lastRight = right;
    lastA = a;
    lastB = b;
    pause(30);
  }
}

// ── Title screen ───────────────────────────────────────────────

function drawTitleScreen(): void {
  scene.setBackgroundColor(15); // black

  let bg = scene.backgroundImage();
  bg.fill(15);

  // Title
  bg.print("CAMEL CITY", 36, 10, 5); // yellow
  bg.print("TIME JAM", 44, 22, 9); // light blue

  // Subtitle
  bg.print("A Martes Delta Co", 24, 44, 11);
  bg.print("Production", 48, 54, 11);

  // Winston
  let wImg = CCTJ.sunglassesMode ? Art.winstonShades : Art.winstonRight;
  bg.drawImage(wImg, 72, 68);

  // Prompt
  bg.print("Press A to start", 28, 100, 1); // white
}

// ── Opening cutscene ───────────────────────────────────────────

function openingCutscene(): void {
  CCTJ.clearAllSprites();

  // Draw the present-day game jam scene
  scene.setBackgroundImage(Art.bg_gamejam);

  let winston = sprites.create(CCTJ.winstonImage(), SpriteKind.Player);
  winston.setPosition(0, 86);

  // Winston walks toward the building with walk animation
  let walkFrames = CCTJ.winstonWalkImages();
  for (let i = 0; i < 20; i++) {
    winston.setImage(walkFrames[i % walkFrames.length]);
    winston.x += 3;
    pause(120);
  }
  winston.setImage(CCTJ.winstonImage());

  CCTJ.npcSay(
    "WINSTON",
    "Almost there! I can't wait to see what everyone's making this year!",
  );

  // Vortex appears!
  CCTJ.say(["Suddenly, a swirling vortex appears!"]);

  // Build spin frames: original + 3 flipped variants
  let vBase = Art.vortex;
  let vFx = vBase.clone();
  vFx.flipX();
  let vFxy = vFx.clone();
  vFxy.flipY();
  let vFy = vBase.clone();
  vFy.flipY();
  let vortexFrames = [vBase, vFx, vFxy, vFy];

  let vortex = sprites.create(Art.vortex, SpriteKind.Npc);
  vortex.setPosition(winston.x + 20, winston.y - 20);

  // Flash, shake, and spin the vortex
  let vFrame = 0;
  for (let i = 0; i < 8; i++) {
    vortex.setImage(vortexFrames[vFrame % 4]);
    vFrame++;
    scene.setBackgroundColor(10); // purple
    pause(120);
    vortex.setImage(vortexFrames[vFrame % 4]);
    vFrame++;
    scene.setBackgroundColor(8); // blue
    pause(120);
  }

  scene.cameraShake(6, 600);
  // Keep spinning as Winston gets pulled in
  for (let i = 0; i < 6; i++) {
    vortex.setImage(vortexFrames[vFrame % 4]);
    vFrame++;
    pause(150);
  }
  winston.destroy(effects.disintegrate, 400);
  // Spin through the destroy
  for (let i = 0; i < 6; i++) {
    vortex.setImage(vortexFrames[vFrame % 4]);
    vFrame++;
    pause(150);
  }
  vortex.destroy(effects.disintegrate, 300);
  pause(400);

  CCTJ.clearAllSprites();
}

// ── Main game loop ─────────────────────────────────────────────

function startGame(): void {
  CCTJ.resetGameState();

  // Title screen with Konami code support
  scene.setBackgroundImage(image.create(160, 120));
  drawTitleScreen();
  waitForStartWithKonami();

  // Opening cutscene
  openingCutscene();

  // Three chapters
  CCTJ.playChapter1();
  CCTJ.playChapter2();
  CCTJ.playChapter3();

  // Ending
  CCTJ.endingScene();

  // Return to title
  game.reset();
}

// ── Entry point ────────────────────────────────────────────────
startGame();
