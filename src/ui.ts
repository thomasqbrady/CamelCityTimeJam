// ============================================================
// CAMEL CITY TIME JAM — UI Helpers
// ============================================================
// Dialogue, choice menus, transitions, and sprite management.
// ============================================================

namespace SpriteKind {
    export const Paddle = SpriteKind.create()
    export const Ball = SpriteKind.create()
    export const Brick = SpriteKind.create()
    export const Ghost = SpriteKind.create()
    export const Pellet = SpriteKind.create()
    export const Npc = SpriteKind.create()
    export const Dot = SpriteKind.create()
}

namespace CCTJ {

    // ── Sprite cleanup ─────────────────────────────────────────

    const allKinds = [
        SpriteKind.Player, SpriteKind.Paddle, SpriteKind.Ball,
        SpriteKind.Brick, SpriteKind.Ghost, SpriteKind.Pellet,
        SpriteKind.Npc, SpriteKind.Dot, SpriteKind.Projectile,
        SpriteKind.Food, SpriteKind.Enemy
    ]

    export function clearAllSprites(): void {
        for (let kind of allKinds) {
            for (let s of sprites.allOfKind(kind)) {
                s.destroy()
            }
        }
    }

    // ── Dialogue helpers ───────────────────────────────────────

    /** Show a sequence of dialogue lines (bottom text box). */
    export function say(lines: string[]): void {
        for (let line of lines) {
            game.showLongText(line, DialogLayout.Bottom)
        }
    }

    /** Show a single line of NPC dialogue with their name. */
    export function npcSay(name: string, text: string): void {
        game.showLongText(name + ": " + text, DialogLayout.Bottom)
    }

    // ── Vortex transition ──────────────────────────────────────

    export function vortexTransition(label: string): void {
        clearAllSprites()

        // Flash effect
        for (let i = 0; i < 6; i++) {
            scene.setBackgroundColor(10) // purple
            pause(60)
            scene.setBackgroundColor(8)  // blue
            pause(60)
            scene.setBackgroundColor(9)  // light blue
            pause(40)
        }

        scene.setBackgroundColor(15) // black
        pause(200)

        // Show the vortex sprite briefly
        let v = sprites.create(Art.vortex, SpriteKind.Npc)
        v.setPosition(80, 60)
        scene.cameraShake(4, 500)
        pause(600)
        v.destroy(effects.disintegrate, 400)
        pause(500)

        // Chapter card
        scene.setBackgroundColor(15)
        game.splash("TIME WARP", label)
    }

    // ── Simple scene setup ─────────────────────────────────────

    /** Set up a dialogue scene with a colored background and NPC. */
    export function setupDialogueScene(bgColor: number, npcImage: Image): Sprite {
        clearAllSprites()
        scene.setBackgroundColor(bgColor)
        let npc = sprites.create(npcImage, SpriteKind.Npc)
        npc.setPosition(40, 60)
        let winston = sprites.create(winstonImage(), SpriteKind.Player)
        winston.setPosition(120, 60)
        return npc
    }

    // ── Choice menu system ─────────────────────────────────────

    export class ChoiceOption {
        label: string
        unlocked: boolean
        crossed: boolean

        constructor(label: string, unlocked: boolean, crossed: boolean) {
            this.label = label
            this.unlocked = unlocked
            this.crossed = crossed
        }
    }

    function drawChoiceMenu(prompt: string, options: ChoiceOption[], selected: number): void {
        let bg = scene.backgroundImage()
        bg.fill(15) // black background

        // Prompt text
        bg.print(prompt, 4, 4, 1)
        bg.drawLine(4, 14, 156, 14, 12)

        for (let i = 0; i < options.length; i++) {
            let opt = options[i]
            let y = 24 + i * 28
            let color = 1  // white

            // Draw selection highlight
            if (selected == i) {
                bg.fillRect(2, y - 2, 156, 24, 12) // dark purple highlight
            }

            // Status indicator and color
            let prefix = "  "
            if (opt.crossed) {
                prefix = "X "
                color = 11 // grey — crossed out
            } else if (!opt.unlocked) {
                prefix = "? "
                color = 11 // grey — locked
            } else if (selected == i) {
                prefix = "> "
                color = 5  // yellow — selected and available
            }

            bg.print(prefix + opt.label, 6, y, color)

            // Show lock status below
            if (!opt.unlocked && !opt.crossed) {
                bg.print("  (locked)", 6, y + 10, 12)
            } else if (opt.crossed) {
                bg.print("  (already suggested)", 6, y + 10, 12)
            }
        }

        bg.print("D-pad:move  A:select", 4, 110, 11)
    }

    /**
     * Show the A/B/C choice menu. Returns the index of the chosen option.
     * Only unlocked, non-crossed options can be selected.
     */
    export function chooseIdea(prompt: string, options: ChoiceOption[]): number {
        clearAllSprites()
        scene.setBackgroundImage(image.create(160, 120))

        let selected = 0
        // Start on the first selectable option
        for (let i = 0; i < options.length; i++) {
            if (options[i].unlocked && !options[i].crossed) {
                selected = i
                break
            }
        }

        let lastUp = false
        let lastDown = false
        let lastA = false

        drawChoiceMenu(prompt, options, selected)

        while (true) {
            let up = controller.up.isPressed()
            let down = controller.down.isPressed()
            let a = controller.A.isPressed()

            if (up && !lastUp) {
                selected = (selected + options.length - 1) % options.length
                drawChoiceMenu(prompt, options, selected)
            }
            if (down && !lastDown) {
                selected = (selected + 1) % options.length
                drawChoiceMenu(prompt, options, selected)
            }

            if (a && !lastA) {
                let picked = options[selected]
                if (picked.unlocked && !picked.crossed) {
                    return selected
                }
                // Feedback for trying to pick a locked/crossed option
                game.showLongText("That option isn't available right now.", DialogLayout.Bottom)
                drawChoiceMenu(prompt, options, selected)
            }

            lastUp = up
            lastDown = down
            lastA = a
            pause(20)
        }
        return 0
    }

    // ── Mini-game countdown ────────────────────────────────────

    export function countdown(): void {
        for (let n = 3; n >= 1; n--) {
            game.splash("" + n)
        }
    }

    // ── Clamp helper ───────────────────────────────────────────

    export function clampVelocity(s: Sprite, max: number): void {
        if (s.vx > max) s.vx = max
        if (s.vx < -max) s.vx = -max
        if (s.vy > max) s.vy = max
        if (s.vy < -max) s.vy = -max
    }
}
