// ============================================================
// CAMEL CITY TIME JAM — Chapter 2: Pac-Man (Namco, 1979)
// ============================================================

namespace CCTJ {

    // Ghost colors: Blinky=red(2), Pinky=pink(3), Inky=light-blue(9), Clyde=orange(4)
    const ghostColors = [2, 3, 9, 4]

    // ── Pac-Man round ──────────────────────────────────────────

    /**
     * variant 1: all red ghosts, random movement, no power pellets
     * variant 2: power pellets added, ghosts still random
     * variant 3: colored ghosts with distinct AI + power pellets
     * Returns true if player survived 10 seconds.
     */
    function playPacRound(variant: number, gated: boolean): boolean {
        clearAllSprites()
        scene.setBackgroundColor(15) // black — arcade

        // Create Pac-Man
        let pac = sprites.create(Art.pacOpen, SpriteKind.Player)
        pac.setPosition(80, 70)
        controller.moveSprite(pac, 55, 55)
        pac.setStayInScreen(true)

        // Scatter some dots
        let dots: Sprite[] = []
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 7; c++) {
                let d = sprites.create(Art.dot, SpriteKind.Dot)
                d.setPosition(20 + c * 20, 15 + r * 22)
                dots.push(d)
            }
        }

        // Animate pac-man mouth
        let mouthOpen = true
        let mouthTimer = 0

        // Create ghosts
        let ghosts: Sprite[] = []
        for (let i = 0; i < 4; i++) {
            let baseColor = variant == 3 ? ghostColors[i] : 2 // all red for v1/v2
            let g = sprites.create(Art.ghostSprite(baseColor), SpriteKind.Ghost)
            g.setPosition(30 + i * 30, 20)
            g.vx = randint(-30, 30)
            g.vy = randint(-30, 30)
            g.setStayInScreen(true)
            g.setBounceOnWall(true)
            ghosts.push(g)
        }

        // Power pellets (variant 2+)
        let pellets: Sprite[] = []
        if (variant >= 2) {
            let corners = [[12, 12], [148, 12], [12, 108], [148, 108]]
            for (let pos of corners) {
                let p = sprites.create(Art.powerPellet, SpriteKind.Pellet)
                p.setPosition(pos[0], pos[1])
                pellets.push(p)
            }
        }

        let frightenedUntil = 0
        let failed = false
        let start = game.runtime()
        let lastAiTick = 0

        while (game.runtime() - start < 10000) {
            let now = game.runtime()

            // Pac-man mouth animation
            mouthTimer += 1
            if (mouthTimer > 5) {
                mouthTimer = 0
                mouthOpen = !mouthOpen
                pac.setImage(mouthOpen ? Art.pacOpen : Art.pacClosed)
            }

            // Eat dots
            for (let d of dots) {
                if (d && pac.overlapsWith(d)) {
                    d.destroy()
                }
            }

            // Power pellets
            if (variant >= 2) {
                for (let p of pellets) {
                    if (p && pac.overlapsWith(p)) {
                        p.destroy()
                        frightenedUntil = now + 3000
                        for (let g of ghosts) {
                            g.setImage(Art.ghostFrightened)
                        }
                    }
                }
            }

            // Ghost AI — update every ~200ms
            if (now - lastAiTick > 200) {
                lastAiTick = now
                let frightened = frightenedUntil > now

                for (let i = 0; i < ghosts.length; i++) {
                    let g = ghosts[i]

                    if (frightened) {
                        // Run away randomly
                        g.vx = randint(-40, 40)
                        g.vy = randint(-40, 40)
                    } else {
                        // Restore color
                        if (variant == 3) {
                            g.setImage(Art.ghostSprite(ghostColors[i]))
                        } else {
                            g.setImage(Art.ghostSprite(2))
                        }

                        if (variant <= 2) {
                            // Random wandering
                            if (randint(0, 100) < 40) {
                                g.vx = randint(-50, 50)
                                g.vy = randint(-50, 50)
                            }
                        } else {
                            // Distinct AI personalities (variant 3)
                            if (i == 0) {
                                // Blinky: direct chase
                                g.vx = (pac.x - g.x) * 2
                                g.vy = (pac.y - g.y) * 2
                            } else if (i == 1) {
                                // Pinky: ambush — target ahead of pac
                                let tx = pac.x + pac.vx
                                let ty = pac.y + pac.vy
                                g.vx = (tx - g.x) * 2
                                g.vy = (ty - g.y) * 2
                            } else if (i == 2) {
                                // Inky: fickle — erratic
                                g.vx = randint(-60, 60)
                                g.vy = randint(-60, 60)
                            } else {
                                // Clyde: chases when far, retreats when close
                                let dist = Math.abs(pac.x - g.x) + Math.abs(pac.y - g.y)
                                if (dist < 45) {
                                    // Run to corner
                                    g.vx = (10 - g.x) * 2
                                    g.vy = (110 - g.y) * 2
                                } else {
                                    g.vx = (pac.x - g.x) * 2
                                    g.vy = (pac.y - g.y) * 2
                                }
                            }
                        }
                    }
                    clampVelocity(g, 60)
                }
            }

            // Ghost collision
            for (let g of ghosts) {
                if (pac.overlapsWith(g)) {
                    if (variant >= 2 && frightenedUntil > now) {
                        // Eat the ghost!
                        g.setPosition(80, 30)
                        g.vx = 0
                        g.vy = 0
                    } else {
                        failed = true
                    }
                }
            }

            if (failed) break
            pause(20)
        }

        controller.moveSprite(pac, 0, 0) // stop player control
        clearAllSprites()

        if (!gated) return true
        return !failed
    }

    // ── Chapter 2 flow ─────────────────────────────────────────

    export function playChapter2(): void {
        vortexTransition("1979 - TOKYO")

        // Scene: Namco office
        setupRichScene(Art.drawNamcoOffice, Art.iwatani) // blue bg — clean Japanese office

        npcSay("IWATANI",
            "...Nan desu ka?! How about English?")
        npcSay("IWATANI",
            "I'm Iwatani, and this is Namco. There isn't usually a camel in here.")
        npcSay("IWATANI",
            "Oh! Are you here for the playtest?")
        npcSay("IWATANI",
            "I'm trying to make a game that everyone can enjoy -- not just kids who like shooting aliens.")
        npcSay("IWATANI",
            "My idea? A maze game about eating. The character was inspired by a pizza with a slice removed!")
        npcSay("IWATANI",
            "Try it!")

        clearAllSprites()

        // ── Round 1: Broken prototype ──────────────────────────
        say(["ROUND 1: Maze prototype. Avoid the ghosts for 10 seconds!"])
        let r1 = playPacRound(1, true)

        if (!r1) {
            let pick = chooseIdea("What would you change?", [
                new ChoiceOption("It seems fine to me", true, false),
                new ChoiceOption("Add big power-up dots", false, false),
                new ChoiceOption("Give each ghost personality", false, false)
            ])
            if (pick == 0) {
                setupRichScene(Art.drawNamcoOffice, Art.iwatani)
                npcSay("IWATANI",
                    "Hm. I thought so too at first. But the ghosts are boring, right?")
            }
            return
        }

        // Survived — B unlocks
        setupRichScene(Art.drawNamcoOffice, Art.iwatani)
        npcSay("IWATANI",
            "You survived! The ghosts are boring though, aren't they?")
        npcSay("IWATANI", "What would you do?")

        let pickB = chooseIdea("You survived! Suggest an improvement:", [
            new ChoiceOption("It seems fine to me", false, true),
            new ChoiceOption("Add big power-up dots", true, false),
            new ChoiceOption("Give each ghost personality", false, false)
        ])

        if (pickB == 1) {
            setupRichScene(Art.drawNamcoOffice, Art.iwatani)
            npcSay("IWATANI",
                "Big dots that let you EAT the ghosts?!")
            npcSay("IWATANI",
                "Turn the hunter into the hunted! Brilliant!")
        }

        // ── Round 2: Power pellets ─────────────────────────────
        say(["ROUND 2: Power pellets in the corners! Eat them to fight back!"])
        let r2 = playPacRound(2, true)
        creativityScore += 1

        if (!r2) {
            setupRichScene(Art.drawNamcoOffice, Art.iwatani)
            npcSay("IWATANI",
                "The power pellets change everything! Thank you, camel-san!")
            return
        }

        // Survived — C unlocks
        setupRichScene(Art.drawNamcoOffice, Art.iwatani)
        npcSay("IWATANI",
            "Much better! But the ghosts still feel the same. Any other ideas?")

        let pickC = chooseIdea("Round 2 cleared! One more idea:", [
            new ChoiceOption("It seems fine to me", false, true),
            new ChoiceOption("Add big power-up dots", false, true),
            new ChoiceOption("Give each ghost personality", true, false)
        ])

        if (pickC == 2) {
            setupRichScene(Art.drawNamcoOffice, Art.iwatani)
            npcSay("IWATANI",
                "Different behaviors! One could chase directly...")
            npcSay("IWATANI",
                "One could try to ambush you from ahead...")
            npcSay("IWATANI",
                "They'd work as a team without even knowing it!")
            npcSay("IWATANI",
                "And DIFFERENT COLORS! My boss insisted they all be the same.")
            npcSay("IWATANI",
                "I took a poll: 40 to 0 in favor of different colors.")
            npcSay("IWATANI",
                "Make that 41 now!")
        }

        // ── Round 3: Full Pac-Man ──────────────────────────────
        say(["ROUND 3: Colored ghosts with unique AI! Watch their patterns!"])
        playPacRound(3, false)
        creativityScore += 1

        setupRichScene(Art.drawNamcoOffice, Art.iwatani)
        npcSay("IWATANI",
            "This is going to bring everyone to the arcade!")
        npcSay("IWATANI",
            "I'm calling it... Puck Man!")
        npcSay("IWATANI",
            "...though the American branch may want to rename it.")
    }
}
