// ============================================================
// CAMEL CITY TIME JAM — Ending Scenes
// ============================================================

namespace CCTJ {
  export function endingScene(): void {
    vortexTransition("back at the GAME JAM...");

    clearAllSprites();

    if (creativityScore <= 2) {
      endingA();
    } else if (creativityScore <= 4) {
      endingB();
    } else {
      endingC();
    }

    // Credits
    showCredits();
  }

  // ── Ending A: "It's Fine" (Score 0–2) ──────────────────────

  function endingA(): void {
    // Draw present-day scene
    scene.setBackgroundImage(Art.bg_highschool);

    let simon = sprites.create(winstonImage(), SpriteKind.Player);
    simon.setPosition(30, 90);

    let friend = sprites.create(Art.friendNpc, SpriteKind.Npc);
    friend.setPosition(128, 90);

    say([
      "Simon lands back at the game jam. It's 2026.",
      "FRIEND: Hey, Simon! You're just in time for the game jam!",
    ]);

    clearAllSprites();
    scene.setBackgroundColor(15);

    sayCenter([
      "Simon made it to the game jam. The games were pretty good.",
      "But what if you'd played a little harder...?",
    ]);
  }

  // ── Ending B: "Creative Spark" (Score 3–4) ─────────────────

  function endingB(): void {
    scene.setBackgroundImage(Art.bg_highschool_future);
    addFloatingDrones();

    let simon = sprites.create(winstonImage(), SpriteKind.Player);
    simon.setPosition(30, 90);

    let friend = sprites.create(Art.friendNpc, SpriteKind.Npc);
    friend.setPosition(128, 90);

    say([
      "Simon lands back at the game jam. It's 2026.",
      "FRIEND: Simon! There you are!",
      "FRIEND: Check out these cool spotlight drones!",
      "FRIEND: We came up with some killer ideas while we were waiting...",
      "Simon's time-travel adventure sparked some serious creativity.",
    ]);

    clearAllSprites();
    scene.setBackgroundColor(15);

    sayCenter([
      "Simon pushed a little harder, dug a little deeper to find inspiration.",
      "It's going to pay off at this year's Camel City Game Jam.",
    ]);

    playFanfare();
    effects.confetti.startScreenEffect(4800);
    celebrateLEDs(5600);
  }

  // ── Ending C: "Visionary" (Score 5–6) ──────────────────────

  function endingC(): void {
    // Draw futuristic 2030 scene
    scene.setBackgroundImage(Art.bg_highschool_future_kaiju);

    let simon = sprites.create(winstonImage(), SpriteKind.Player);
    simon.setPosition(32, 90);

    say([
      "Simon tumbles out of the vortex. Something's different.",
      "The buildings look... futuristic.",
      "SIMON: Wait... what year is it?",
    ]);

    let student = sprites.create(Art.jetpackStudent, SpriteKind.Npc);
    student.setPosition(128, 90);

    say([
      "A sign reads: CAMEL CITY GAME JAM 2030",
      "A student lands with a jetpack.",
      "STUDENT: Whoa... did you... WALK here?",
      "STUDENT: Well, hurry up!",
      "STUDENT: It was YOUR idea to do 50-foot holographic Kaiju this year!",
      "STUDENT: We don't have time to waste!",
    ]);

    clearAllSprites();

    // Fireworks on the futuristic backdrop
    playFanfare();
    effects.confetti.startScreenEffect(8000);
    scene.cameraShake(2, 500);

    sayCenter([
      "The future of games is in YOUR hands.",
      "Now go make something amazing.",
    ]);

    celebrateLEDs(4000);
  }

  // ── Celebration effects (LEDs + fanfare) ──────────────────

  /** Play a short victory fanfare. */
  function playFanfare(): void {
    music.playTone(262, 150); // C4
    music.playTone(330, 150); // E4
    music.playTone(392, 150); // G4
    music.playTone(523, 400); // C5
  }


  /** Flash PyGamer NeoPixels in celebratory colors via raw sendBuffer. */
  function celebrateLEDs(durationMs: number): void {
    // PyGamer has 5 NeoPixels on D8, GRB color order (mode 1)
    let dataPin = pins.pinByCfg(DAL.CFG_PIN_NEOPIXEL);
    let colors = [
      [0x00, 0xFF, 0x00], // red   (GRB)
      [0x88, 0xFF, 0x00], // orange
      [0xFF, 0xFF, 0x00], // yellow
      [0xFF, 0x00, 0x00], // green
      [0x00, 0x00, 0x88], // blue
      [0x00, 0xFF, 0xFF], // magenta
    ];
    let buf = pins.createBuffer(15); // 5 LEDs × 3 bytes (GRB)
    let end = game.runtime() + durationMs;
    let frame = 0;
    while (game.runtime() < end) {
      for (let i = 0; i < 5; i++) {
        let c = colors[(i + frame) % colors.length];
        buf[i * 3 + 0] = c[0]; // G
        buf[i * 3 + 1] = c[1]; // R
        buf[i * 3 + 2] = c[2]; // B
      }
      light.sendBuffer(dataPin, undefined, 1, buf);
      frame++;
      pause(120);
    }
    // Turn off all LEDs
    buf.fill(0);
    light.sendBuffer(dataPin, undefined, 1, buf);
  }

  // ── Floating Drones ───────────────────────────────────────

  /** Create a copy of an image shifted vertically by dy pixels. */
  function shiftImage(src: Image, dy: number): Image {
    let dst = image.create(src.width, src.height);
    dst.drawImage(src, 0, dy);
    return dst;
  }

  function addFloatingDrones(): void {
    // Generate west-facing drone by flipping east (saves ~8KB)
    let westImg = Art.spotlightDroneEast.clone();
    westImg.flipX();

    let droneLeft = sprites.create(Art.spotlightDroneEast, SpriteKind.Npc);
    droneLeft.setPosition(24, 40);
    let droneRight = sprites.create(westImg, SpriteKind.Npc);
    droneRight.setPosition(136, 40);

    // Build wobble frames by shifting the image up/down within the sprite
    let eastUp = shiftImage(Art.spotlightDroneEast, -2);
    let eastDown = shiftImage(Art.spotlightDroneEast, 2);
    let westUp = shiftImage(westImg, -2);
    let westDown = shiftImage(westImg, 2);

    // Frame-based animation runs during blocking dialog calls
    animation.runImageAnimation(
      droneLeft,
      [Art.spotlightDroneEast, eastUp, Art.spotlightDroneEast, eastDown],
      400,
      true,
    );
    animation.runImageAnimation(
      droneRight,
      [westDown, westImg, westUp, westImg],
      400,
      true,
    );
  }

  // ── Credits ────────────────────────────────────────────────

  function showCredits(): void {
    clearAllSprites();
    scene.setBackgroundColor(15);

    // Show creativity score
    game.splash("Creativity Score", "" + creativityScore + " / 6");

    // Credits text
    say([
      "CAMEL CITY TIME JAM",
      "Created for the Camel City Game Jam -- Winston-Salem, NC",
      "Sponsored by Martes Delta Co, LLC",
      "Made with love on the Adafruit PyGamer",
      "The history of games is the history of people with bold ideas.",
      "Now it's your turn.",
    ]);
  }
}
