// ============================================================
// CAMEL CITY TIME JAM — Chapter 1: Breakout (Atari, 1975)
// ============================================================

namespace CCTJ {

    // ── Brick factory ──────────────────────────────────────────

    function makeBricks(colored: boolean): Sprite[] {
        let bricks: Sprite[] = []
        let rows = 3
        let cols = 8
        let rowColors = [2, 4, 5] // red, orange, yellow
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let brickImg = image.create(16, 6)
                let color = colored ? rowColors[r] : 1 // white if not colored
                brickImg.fill(color)
                let brick = sprites.create(brickImg, SpriteKind.Brick)
                brick.setPosition(15 + c * 18, 14 + r * 9)
                bricks.push(brick)
            }
        }
        return bricks
    }

    // ── Breakout round ─────────────────────────────────────────

    /**
     * variant 1: ball goes straight up/down, white bricks
     * variant 2: angled bounce + reflection, colored bricks
     * variant 3: paddle-edge deflection, full breakout
     * Returns true if player survived 10 seconds.
     */
    function playBreakoutRound(variant: number, gated: boolean): boolean {
        clearAllSprites()
        scene.setBackgroundColor(15) // black — arcade feel

        let paddleSprite = sprites.create(Art.paddle, SpriteKind.Paddle)
        paddleSprite.setPosition(80, 110)
        paddleSprite.setStayInScreen(true)

        let ballSprite = sprites.create(Art.ball, SpriteKind.Ball)
        ballSprite.setPosition(paddleSprite.x, 104)

        let bricks = makeBricks(variant >= 2)
        let launched = false
        let failed = false
        let start = game.runtime()
        let lastA = false

        while (game.runtime() - start < 10000) {
            // Paddle movement
            if (controller.left.isPressed()) paddleSprite.x -= 3
            if (controller.right.isPressed()) paddleSprite.x += 3
            if (paddleSprite.left < 2) paddleSprite.left = 2
            if (paddleSprite.right > 158) paddleSprite.right = 158

            let nowA = controller.A.isPressed()

            // Launch ball
            if (nowA && !lastA && !launched) {
                launched = true
                if (variant == 1) {
                    // Straight up — intentionally boring
                    ballSprite.vx = 0
                    ballSprite.vy = -65
                } else {
                    // Angled launch
                    ballSprite.vx = randint(-40, 40)
                    if (Math.abs(ballSprite.vx) < 15) ballSprite.vx = 20
                    ballSprite.vy = -65
                }
            }
            lastA = nowA

            if (!launched) {
                // Ball sits on paddle
                ballSprite.x = paddleSprite.x
            } else {
                // Wall bounces
                if (ballSprite.left <= 1) {
                    ballSprite.left = 2
                    if (variant >= 2) ballSprite.vx = Math.abs(ballSprite.vx)
                }
                if (ballSprite.right >= 159) {
                    ballSprite.right = 158
                    if (variant >= 2) ballSprite.vx = -Math.abs(ballSprite.vx)
                }
                if (ballSprite.top <= 1) {
                    ballSprite.top = 2
                    ballSprite.vy = Math.abs(ballSprite.vy)
                }

                // Paddle collision
                if (ballSprite.overlapsWith(paddleSprite) && ballSprite.vy > 0) {
                    ballSprite.vy = -Math.abs(ballSprite.vy)

                    if (variant >= 3) {
                        // Paddle-edge deflection — the key insight!
                        let offset = ballSprite.x - paddleSprite.x
                        ballSprite.vx = offset * 5
                        if (ballSprite.vx > 90) ballSprite.vx = 90
                        if (ballSprite.vx < -90) ballSprite.vx = -90
                    } else if (variant >= 2) {
                        // Just add a bit of randomness
                        if (ballSprite.vx == 0) ballSprite.vx = randint(-30, 30)
                    }
                }

                // Brick collision
                for (let brick of bricks) {
                    if (brick && ballSprite.overlapsWith(brick)) {
                        ballSprite.vy *= -1
                        if (variant >= 2) {
                            brick.destroy(effects.disintegrate, 80)
                        }
                        break
                    }
                }

                // Ball falls off screen
                if (ballSprite.top > 120) {
                    if (variant == 1) {
                        // In variant 1 it just comes straight back — relaunch
                        launched = false
                        ballSprite.vx = 0
                        ballSprite.vy = 0
                        ballSprite.setPosition(paddleSprite.x, 104)
                    } else {
                        failed = true
                        break
                    }
                }
            }

            pause(20)
        }

        clearAllSprites()

        if (!gated) {
            return true
        }
        return !failed
    }

    // ── Chapter 1 flow ─────────────────────────────────────────

    export function playChapter1(): void {
        vortexTransition("1975 - CALIFORNIA")

        // Scene: Atari office
        setupRichScene(Art.drawAtariOffice, Art.bushnell)

        npcSay("BUSHNELL",
            "Whoa! Where'd you come from? Are you a talking cam...? Never mind.")
        npcSay("BUSHNELL",
            "I'm Nolan. I run this place -- Atari.")
        npcSay("BUSHNELL",
            "Jobs and Woz have been working nights on a new game.")
        npcSay("BUSHNELL",
            "It's like Pong, but you hit a ball against a wall of bricks.")
        npcSay("BUSHNELL",
            "Wanna try it?")

        clearAllSprites()

        // ── Round 1: Broken prototype ──────────────────────────
        say(["ROUND 1: The prototype. Press A to launch the ball."])
        let r1 = playBreakoutRound(1, true)

        if (!r1) {
            // Failed — only option A available
            let pick = chooseIdea("What do you think?", [
                new ChoiceOption("It's great!", true, false),
                new ChoiceOption("Add angled bouncing", false, false),
                new ChoiceOption("Paddle-edge aiming", false, false)
            ])
            if (pick == 0) {
                setupRichScene(Art.drawAtariOffice, Art.bushnell)
                npcSay("BUSHNELL",
                    "I think that Jobs kid has a reality distortion field, and you're in it.")
                npcSay("BUSHNELL",
                    "Something's missing, if you ask me.")
            }
            return
        }

        // Survived — B unlocks
        setupRichScene(Art.drawAtariOffice, Art.bushnell)
        npcSay("BUSHNELL", "Not bad! You kept it going. So what do you think?")

        let pickB = chooseIdea("You survived! Suggest an improvement:", [
            new ChoiceOption("It's great!", false, true),
            new ChoiceOption("Add angled bouncing", true, false),
            new ChoiceOption("Paddle-edge aiming", false, false)
        ])

        if (pickB == 1) {
            setupRichScene(Art.drawAtariOffice, Art.bushnell)
            npcSay("BUSHNELL",
                "Angles! Reflections! That changes everything!")
            npcSay("BUSHNELL",
                "Woz is going to be busy tonight...")
        }

        // ── Round 2: Angled bounce ─────────────────────────────
        say(["ROUND 2: Now with angles and colored bricks!"])
        let r2 = playBreakoutRound(2, true)
        creativityScore += 1

        if (!r2) {
            setupRichScene(Art.drawAtariOffice, Art.bushnell)
            npcSay("BUSHNELL",
                "Better! Those angles make all the difference. Thanks, camel.")
            return
        }

        // Survived — C unlocks
        setupRichScene(Art.drawAtariOffice, Art.bushnell)
        npcSay("BUSHNELL", "Now THAT feels like a game! Any other ideas?")

        let pickC = chooseIdea("Round 2 cleared! One more idea:", [
            new ChoiceOption("It's great!", false, true),
            new ChoiceOption("Add angled bouncing", false, true),
            new ChoiceOption("Paddle-edge aiming", true, false)
        ])

        if (pickC == 2) {
            setupRichScene(Art.drawAtariOffice, Art.bushnell)
            npcSay("BUSHNELL",
                "The angle changes where you HIT the paddle?!")
            npcSay("BUSHNELL",
                "Edges go sideways, center goes straight... NOW we're talking TENNIS!")
            npcSay("BUSHNELL",
                "I LOVE it!")
        }

        // ── Round 3: Full Breakout ─────────────────────────────
        say(["ROUND 3: Full Breakout! Aim with the paddle edges."])
        playBreakoutRound(3, false)
        creativityScore += 1

        setupRichScene(Art.drawAtariOffice, Art.bushnell)
        npcSay("BUSHNELL",
            "This is going to be huge. Thanks, mysterious camel friend!")
        npcSay("BUSHNELL",
            "I'm calling it... Breakout.")
    }
}
