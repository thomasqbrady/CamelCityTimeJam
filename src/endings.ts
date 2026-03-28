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

    let winston = sprites.create(winstonImage(), SpriteKind.Player);
    winston.setPosition(30, 56);

    let friend = sprites.create(Art.friendNpc, SpriteKind.Npc);
    friend.setPosition(128, 56);

    say([
      "Winston lands back at the game jam. It's 2026.",
      "FRIEND: Hey, Winston! You're just in time. The jam is about to start!",
      "Winston walks into the building.",
    ]);

    clearAllSprites();
    scene.setBackgroundColor(15);

    game.showLongText(
      "Winston made it to the game jam. The games were pretty good.",
      DialogLayout.Center,
    );
    game.showLongText(
      "But what if you'd played a little longer...?",
      DialogLayout.Center,
    );
  }

  // ── Ending B: "Creative Spark" (Score 3–4) ─────────────────

  function endingB(): void {
    scene.setBackgroundImage(Art.bg_highschool_future);
    addFloatingDrones();

    let winston = sprites.create(winstonImage(), SpriteKind.Player);
    winston.setPosition(30, 56);

    let friend = sprites.create(Art.friendNpc, SpriteKind.Npc);
    friend.setPosition(128, 56);

    say([
      "Winston lands back at the game jam. It's 2026.",
      "FRIEND: Winston! There you are!",
      "FRIEND: We came up with some killer ideas while we were waiting...",
      "Winston's time-travel adventure sparked some serious creativity.",
    ]);

    clearAllSprites();
    scene.setBackgroundColor(15);

    game.showLongText(
      "Winston pushed a little harder, dug a little deeper to find inspiration.",
      DialogLayout.Center,
    );
    game.showLongText(
      "It's going to pay off at this year's Camel City Game Jam.",
      DialogLayout.Center,
    );

    effects.confetti.startScreenEffect(4800);
    pause(5600);
  }

  // ── Ending C: "Visionary" (Score 5–6) ──────────────────────

  function endingC(): void {
    // Draw futuristic 2030 scene
    scene.setBackgroundImage(Art.bg_highschool_future_kaiju);
    addFloatingDrones();

    let winston = sprites.create(winstonImage(), SpriteKind.Player);
    winston.setPosition(32, 56);

    say([
      "Winston tumbles out of the vortex. Something's different.",
      "The buildings look... futuristic.",
      "WINSTON: Wait... what year is it?",
    ]);

    let student = sprites.create(Art.jetpackStudent, SpriteKind.Npc);
    student.setPosition(128, 56);

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
    effects.confetti.startScreenEffect(8000);
    scene.cameraShake(2, 500);

    game.showLongText(
      "The future of games is in YOUR hands.",
      DialogLayout.Center,
    );
    game.showLongText("Now go make something amazing.", DialogLayout.Center);

    pause(4000);
  }

  // ── Floating Drones ───────────────────────────────────────

  function addFloatingDrones(): void {
    let droneLeft = sprites.create(Art.spotlightDroneWest, SpriteKind.Npc);
    droneLeft.setPosition(30, 40);
    let droneRight = sprites.create(Art.spotlightDroneEast, SpriteKind.Npc);
    droneRight.setPosition(130, 40);

    // Gentle floating wobble — oscillate up/down by 2 pixels
    let wobbleUp = true;
    game.onUpdateInterval(400, function () {
      if (wobbleUp) {
        droneLeft.y -= 2;
        droneRight.y += 2;
      } else {
        droneLeft.y += 2;
        droneRight.y -= 2;
      }
      wobbleUp = !wobbleUp;
    });
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
