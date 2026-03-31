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

  /** Play a short victory fanfare using built-in melodies. */
  function playFanfare(): void {
    music.play(music.createSoundEffect(
      WaveShape.Square, 262, 523, 255, 0, 150,
      SoundExpressionEffect.None, InterpolationCurve.Linear
    ), music.PlaybackMode.InBackground);
    pause(160);
    music.play(music.createSoundEffect(
      WaveShape.Square, 330, 659, 255, 0, 150,
      SoundExpressionEffect.None, InterpolationCurve.Linear
    ), music.PlaybackMode.InBackground);
    pause(160);
    music.play(music.createSoundEffect(
      WaveShape.Square, 392, 784, 255, 0, 150,
      SoundExpressionEffect.None, InterpolationCurve.Linear
    ), music.PlaybackMode.InBackground);
    pause(160);
    music.play(music.createSoundEffect(
      WaveShape.Square, 523, 1047, 255, 0, 400,
      SoundExpressionEffect.None, InterpolationCurve.Linear
    ), music.PlaybackMode.InBackground);
  }

  /** Flash NeoPixel LEDs in celebratory colors to simulate confetti/fireworks. */
  function celebrateLEDs(durationMs: number): void {
    let colors = [0xFF0000, 0xFF8800, 0xFFFF00, 0x00FF00, 0x0088FF, 0xFF00FF];
    let end = game.runtime() + durationMs;
    let frame = 0;
    while (game.runtime() < end) {
      for (let i = 0; i < 5; i++) {
        light.setPixelColor(i, colors[(i + frame) % colors.length]);
      }
      frame++;
      pause(120);
    }
    light.clear();
  }

  // ── Floating Drones ───────────────────────────────────────

  /** Create a copy of an image shifted vertically by dy pixels. */
  function shiftImage(src: Image, dy: number): Image {
    let dst = image.create(src.width, src.height);
    dst.drawImage(src, 0, dy);
    return dst;
  }

  function addFloatingDrones(): void {
    // Swapped: east-facing drone on the left, west-facing on the right
    let droneLeft = sprites.create(Art.spotlightDroneEast, SpriteKind.Npc);
    droneLeft.setPosition(24, 40);
    let droneRight = sprites.create(Art.spotlightDroneWest, SpriteKind.Npc);
    droneRight.setPosition(136, 40);

    // Build wobble frames by shifting the image up/down within the sprite
    let eastUp = shiftImage(Art.spotlightDroneEast, -2);
    let eastDown = shiftImage(Art.spotlightDroneEast, 2);
    let westUp = shiftImage(Art.spotlightDroneWest, -2);
    let westDown = shiftImage(Art.spotlightDroneWest, 2);

    // Frame-based animation runs during blocking dialog calls
    animation.runImageAnimation(
      droneLeft,
      [Art.spotlightDroneEast, eastUp, Art.spotlightDroneEast, eastDown],
      400,
      true,
    );
    animation.runImageAnimation(
      droneRight,
      [westDown, Art.spotlightDroneWest, westUp, Art.spotlightDroneWest],
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
