// ============================================================
// CAMEL CITY TIME JAM — Centralized Image Definitions
// ============================================================
// All sprite images live here so PixelLab-generated art can be
// swapped in by replacing these constants. Each image uses the
// MakeCode Arcade 16-color palette:
//   0=transparent 1=white 2=red 3=pink 4=orange 5=yellow
//   6=teal 7=green 8=blue 9=light-blue 10=purple
//   11=grey-lavender 12=dark-purple 13=cream/tan 14=brown 15=black
// ============================================================

namespace Art {

    // ── Winston the Camel (16×16) ──────────────────────────────
    // Tan/brown camel, two humps, friendly pixel face
    export const winstonRight: Image = img`
        . . . . e e e e e . . . . . . .
        . . . e 4 4 4 4 4 e . . . . . .
        . . e 4 4 4 4 4 4 4 e . . . . .
        . . e 4 4 f 4 4 f 4 e . . . . .
        . . e 4 4 4 4 4 4 4 e . . . . .
        . . . e 4 4 2 4 4 e . . . . . .
        . . e 4 e e e e e 4 e . . . . .
        . e 4 4 4 4 4 4 4 4 4 e . . . .
        e 4 4 4 4 4 4 4 4 4 4 4 e . . .
        . e 4 4 e 4 4 4 e 4 4 e . . . .
        . . e 4 4 4 4 4 4 4 e . . . . .
        . . . e 4 . . . 4 e . . . . . .
        . . . e 4 . . . 4 e . . . . . .
        . . . e e . . . e e . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // Winston with sunglasses (Konami code easter egg)
    export const winstonShades: Image = img`
        . . . . e e e e e . . . . . . .
        . . . e 4 4 4 4 4 e . . . . . .
        . . e 4 4 4 4 4 4 4 e . . . . .
        . . e f f f f f f f e . . . . .
        . . e 4 4 4 4 4 4 4 e . . . . .
        . . . e 4 4 2 4 4 e . . . . . .
        . . e 4 e e e e e 4 e . . . . .
        . e 4 4 4 4 4 4 4 4 4 e . . . .
        e 4 4 4 4 4 4 4 4 4 4 4 e . . .
        . e 4 4 e 4 4 4 e 4 4 e . . . .
        . . e 4 4 4 4 4 4 4 e . . . . .
        . . . e 4 . . . 4 e . . . . . .
        . . . e 4 . . . 4 e . . . . . .
        . . . e e . . . e e . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // ── NPC Sprites (16×16) ────────────────────────────────────

    // Nolan Bushnell — 70s businessman, brown hair, sideburns
    export const bushnell: Image = img`
        . . . . e e e e . . . . . . . .
        . . . e e e e e e . . . . . . .
        . . e e d d d d e e . . . . . .
        . . e d d f d f d e . . . . . .
        . . e d d d d d d e . . . . . .
        . . . e d d 2 d e . . . . . . .
        . . . e 4 4 4 4 e . . . . . . .
        . . e 4 4 4 4 4 4 e . . . . . .
        . . e 4 4 4 4 4 4 e . . . . . .
        . . . e 4 4 4 4 e . . . . . . .
        . . . . e 8 8 e . . . . . . . .
        . . . . e 8 8 e . . . . . . . .
        . . . e 8 . . 8 e . . . . . . .
        . . . e e . . e e . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // Toru Iwatani — neat Japanese designer, glasses
    export const iwatani: Image = img`
        . . . . f f f f . . . . . . . .
        . . . f f f f f f . . . . . . .
        . . f f d d d d f f . . . . . .
        . . f d f d d f d f . . . . . .
        . . f d d d d d d f . . . . . .
        . . . f d d 2 d f . . . . . . .
        . . . f 1 1 1 1 f . . . . . . .
        . . f 1 1 1 1 1 1 f . . . . . .
        . . f 1 1 1 1 1 1 f . . . . . .
        . . . f 1 1 1 1 f . . . . . . .
        . . . . f 8 8 f . . . . . . . .
        . . . . f 8 8 f . . . . . . . .
        . . . f 8 . . 8 f . . . . . . .
        . . . f f . . f f . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // Alexey Pajitnov — bearded, glasses, sweater
    export const pajitnov: Image = img`
        . . . . e e e e . . . . . . . .
        . . . e e e e e e . . . . . . .
        . . e d d d d d d e . . . . . .
        . . e d f d d f d e . . . . . .
        . . e d d d d d d e . . . . . .
        . . e d e e e e d e . . . . . .
        . . . e 6 6 6 6 e . . . . . . .
        . . e 6 6 6 6 6 6 e . . . . . .
        . . e 6 6 6 6 6 6 e . . . . . .
        . . . e 6 6 6 6 e . . . . . . .
        . . . . e b b e . . . . . . . .
        . . . . e b b e . . . . . . . .
        . . . e b . . b e . . . . . . .
        . . . e e . . e e . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // ── Game Jam building (16×16) ──────────────────────────────
    export const gameJamBuilding: Image = img`
        . . . . . . . . . . . . . . . .
        . . . b b b b b b b b b b . . .
        . . b b b b b b b b b b b b . .
        . . b b 1 1 b b b 1 1 b b b . .
        . . b b 1 1 b b b 1 1 b b b . .
        . . b b b b b b b b b b b b . .
        . . b b 1 1 b 4 b 1 1 b b b . .
        . . b b 1 1 b 4 b 1 1 b b b . .
        . . b b b b b 4 b b b b b b . .
        . . . . . . . 4 . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // ── Breakout assets ────────────────────────────────────────

    // Paddle (20×3) — placeholder
    export const paddle: Image = img`
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
        9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9 9
        8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8 8
    `

    // Ball (4×4)
    export const ball: Image = img`
        . 5 5 .
        5 5 5 5
        5 5 5 5
        . 5 5 .
    `

    // Brick colors per row (16×6 filled rectangles created at runtime)
    // Row 0: red(2), Row 1: orange(4), Row 2: yellow(5)

    // ── Pac-Man assets ─────────────────────────────────────────

    // Pac-Man open mouth (8×8)
    export const pacOpen: Image = img`
        . 5 5 5 5 5 5 .
        5 5 5 5 5 5 5 5
        5 5 5 5 5 5 . .
        5 5 5 5 5 . . .
        5 5 5 5 5 . . .
        5 5 5 5 5 5 . .
        5 5 5 5 5 5 5 5
        . 5 5 5 5 5 5 .
    `

    // Pac-Man closed mouth (8×8)
    export const pacClosed: Image = img`
        . 5 5 5 5 5 5 .
        5 5 5 5 5 5 5 5
        5 5 5 5 5 5 5 5
        5 5 5 5 5 5 5 5
        5 5 5 5 5 5 5 5
        5 5 5 5 5 5 5 5
        5 5 5 5 5 5 5 5
        . 5 5 5 5 5 5 .
    `

    // Ghost base shape (8×8) — color is swapped at runtime
    export function ghostSprite(color: number): Image {
        let g = img`
            . 9 9 9 9 9 9 .
            9 9 9 9 9 9 9 9
            9 1 f 9 9 1 f 9
            9 9 9 9 9 9 9 9
            9 9 9 9 9 9 9 9
            9 9 9 9 9 9 9 9
            9 . 9 9 9 9 . 9
            9 . 9 . . 9 . 9
        `
        g.replace(9, color)
        return g
    }

    // Frightened ghost (8×8) — blue
    export const ghostFrightened: Image = img`
        . 8 8 8 8 8 8 .
        8 8 8 8 8 8 8 8
        8 1 1 8 8 1 1 8
        8 8 8 8 8 8 8 8
        8 1 8 1 1 8 1 8
        8 8 1 8 8 1 8 8
        8 . 8 8 8 8 . 8
        8 . 8 . . 8 . 8
    `

    // Dot (3×3)
    export const dot: Image = img`
        . 1 .
        1 1 1
        . 1 .
    `

    // Power pellet (5×5)
    export const powerPellet: Image = img`
        . . 5 . .
        . 5 5 5 .
        5 5 5 5 5
        . 5 5 5 .
        . . 5 . .
    `

    // ── Tetris / falling blocks ────────────────────────────────
    // Block cells are drawn procedurally on the board background.
    // No separate sprite images needed — colors are palette indices.

    // ── Vortex (16×16) — swirling portal ───────────────────────
    export const vortex: Image = img`
        . . . . a a a a a a . . . . . .
        . . . a 8 8 8 8 8 8 a . . . . .
        . . a 8 9 9 9 9 9 8 8 a . . . .
        . a 8 9 9 1 1 1 9 9 8 a . . . .
        a 8 9 9 1 . . . 1 9 8 8 a . . .
        a 8 9 1 . . . . . 1 9 8 a . . .
        a 8 9 1 . . . . . 1 9 8 a . . .
        a 8 9 1 . . . . . 1 9 8 a . . .
        a 8 9 9 1 . . . 1 9 9 8 a . . .
        . a 8 9 9 1 1 1 9 9 8 a . . . .
        . . a 8 9 9 9 9 9 8 8 a . . . .
        . . . a 8 8 8 8 8 8 a . . . . .
        . . . . a a a a a a . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
        . . . . . . . . . . . . . . . .
    `

    // ── Title logo text — rendered procedurally via game.splash
    // (keeping it simple for 160×120)

    // ── UI elements ────────────────────────────────────────────
    // Dialogue boxes use MakeCode's built-in game.showLongText
    // Choice menu is drawn procedurally on the background image
}
