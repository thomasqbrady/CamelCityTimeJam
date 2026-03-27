// ============================================================
// CAMEL CITY TIME JAM — Chapter 3: Tetris (Moscow, 1984)
// ============================================================

namespace CCTJ {

    // ── Piece definitions ──────────────────────────────────────

    class PieceDef {
        blocks: number[][]
        constructor(blocks: number[][]) {
            this.blocks = blocks
        }
    }

    // Pentominoes — 5-cell shapes (subset of the 12, using the trickier ones)
    const pentominoes: PieceDef[] = [
        // T-pentomino
        new PieceDef([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]]),
        // N-pentomino (zigzag)
        new PieceDef([[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]]),
        // F-pentomino
        new PieceDef([[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]]),
        // P-pentomino
        new PieceDef([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]]),
        // U-pentomino
        new PieceDef([[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]])
    ]

    // Tetrominoes — the classic 7 Tetris pieces
    const tetrominoes: PieceDef[] = [
        // I
        new PieceDef([[0, 0], [1, 0], [2, 0], [3, 0]]),
        // O
        new PieceDef([[0, 0], [1, 0], [0, 1], [1, 1]]),
        // T
        new PieceDef([[0, 0], [1, 0], [2, 0], [1, 1]]),
        // L
        new PieceDef([[0, 0], [0, 1], [0, 2], [1, 2]]),
        // J
        new PieceDef([[1, 0], [1, 1], [1, 2], [0, 2]]),
        // S
        new PieceDef([[1, 0], [2, 0], [0, 1], [1, 1]]),
        // Z
        new PieceDef([[0, 0], [1, 0], [1, 1], [2, 1]])
    ]

    // Piece colors for tetrominoes (classic-ish palette mapping)
    const tetroColors = [9, 5, 10, 4, 8, 7, 2]
    //                    I   O   T   L   J   S   Z

    function cloneBlocks(blocks: number[][]): number[][] {
        let out: number[][] = []
        for (let b of blocks) {
            out.push([b[0], b[1]])
        }
        return out
    }

    function rotateBlocks(blocks: number[][]): number[][] {
        let out: number[][] = []
        for (let b of blocks) {
            out.push([-b[1], b[0]])
        }
        // Normalize so min x and min y are 0
        let minX = out[0][0]
        let minY = out[0][1]
        for (let b of out) {
            if (b[0] < minX) minX = b[0]
            if (b[1] < minY) minY = b[1]
        }
        for (let b of out) {
            b[0] -= minX
            b[1] -= minY
        }
        return out
    }

    function canPlace(board: number[][], blocks: number[][], px: number, py: number, w: number, h: number): boolean {
        for (let b of blocks) {
            let x = px + b[0]
            let y = py + b[1]
            if (x < 0 || x >= w || y < 0 || y >= h) return false
            if (board[y][x] > 0) return false
        }
        return true
    }

    function lockPiece(board: number[][], blocks: number[][], px: number, py: number, color: number): void {
        for (let b of blocks) {
            board[py + b[1]][px + b[0]] = color
        }
    }

    function clearLines(board: number[][], w: number, h: number): number {
        let cleared = 0
        for (let y = h - 1; y >= 0; y--) {
            let full = true
            for (let x = 0; x < w; x++) {
                if (board[y][x] == 0) {
                    full = false
                    break
                }
            }
            if (full) {
                // Shift everything down
                for (let yy = y; yy > 0; yy--) {
                    for (let x = 0; x < w; x++) {
                        board[yy][x] = board[yy - 1][x]
                    }
                }
                for (let x = 0; x < w; x++) {
                    board[0][x] = 0
                }
                cleared += 1
                y += 1 // re-check this row
            }
        }
        return cleared
    }

    // ── Board renderer ─────────────────────────────────────────

    function drawBoard(board: number[][], active: number[][], px: number, py: number,
        activeColor: number, w: number, h: number, variant: number,
        remaining: number): void {

        let bg = scene.backgroundImage()
        bg.fill(15) // black

        let cell = 7
        let ox = 52  // center the well horizontally
        let oy = 6

        // Well border
        bg.drawRect(ox - 2, oy - 2, w * cell + 4, h * cell + 4, 11)

        // Draw locked cells
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let c = board[y][x]
                if (c > 0) {
                    bg.fillRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1, c)
                }
            }
        }

        // Draw active piece
        for (let b of active) {
            let dx = px + b[0]
            let dy = py + b[1]
            if (dy >= 0) {
                bg.fillRect(ox + dx * cell, oy + dy * cell, cell - 1, cell - 1, activeColor)
            }
        }

        // Labels
        if (variant == 1) {
            bg.print("PENTOMINOES", 2, 2, 7)
            bg.print("No rotate", 2, 14, 11)
        } else {
            bg.print("TETROMINOES", 2, 2, 9)
            bg.print("A: rotate", 2, 14, 11)
        }
        if (variant >= 3) {
            bg.print("Lines clear!", 2, 26, 5)
        }

        bg.print("" + remaining, 148, 2, 5)
    }

    // ── Tetris round ───────────────────────────────────────────

    /**
     * variant 1: pentominoes, no rotation, no line clearing
     * variant 2: tetrominoes, rotation, no line clearing
     * variant 3: tetrominoes, rotation, line clearing + speed
     * Returns true if player survived 10 seconds.
     */
    function playTetrisRound(variant: number, gated: boolean): boolean {
        clearAllSprites()
        scene.setBackgroundImage(image.create(160, 120))

        let w = 8
        let h = 14
        let board: number[][] = []
        for (let y = 0; y < h; y++) {
            let row: number[] = []
            for (let x = 0; x < w; x++) row.push(0)
            board.push(row)
        }

        let pieceSet = variant == 1 ? pentominoes : tetrominoes
        let pieceIdx = randint(0, pieceSet.length - 1)
        let active = cloneBlocks(pieceSet[pieceIdx].blocks)
        let px = 2
        let py = 0
        let activeColor = variant == 1 ? 7 : tetroColors[pieceIdx]

        let dropMs = variant == 1 ? 400 : 300
        let lastDrop = game.runtime()
        let failed = false
        let start = game.runtime()

        let lastLeft = controller.left.isPressed()
        let lastRight = controller.right.isPressed()
        let lastDown = controller.down.isPressed()
        let lastA = controller.A.isPressed()

        if (!canPlace(board, active, px, py, w, h)) {
            failed = true
        }

        while (!failed && game.runtime() - start < 10000) {
            let now = game.runtime()
            let remaining = Math.ceil((10000 - (now - start)) / 1000)

            let nowLeft = controller.left.isPressed()
            let nowRight = controller.right.isPressed()
            let nowDown = controller.down.isPressed()
            let nowA = controller.A.isPressed()

            // Move left/right
            if (nowLeft && !lastLeft) {
                if (canPlace(board, active, px - 1, py, w, h)) px -= 1
            }
            if (nowRight && !lastRight) {
                if (canPlace(board, active, px + 1, py, w, h)) px += 1
            }

            // Rotate (variant 2+)
            if (variant >= 2 && nowA && !lastA) {
                let rotated = rotateBlocks(active)
                if (canPlace(board, rotated, px, py, w, h)) {
                    active = rotated
                }
            }

            // Drop speed
            let currentDrop = nowDown ? 50 : dropMs

            if (now - lastDrop >= currentDrop) {
                lastDrop = now
                if (canPlace(board, active, px, py + 1, w, h)) {
                    py += 1
                } else {
                    // Lock piece
                    lockPiece(board, active, px, py, activeColor)

                    // Line clearing (variant 3)
                    if (variant >= 3) {
                        let removed = clearLines(board, w, h)
                        if (removed > 0) {
                            scene.cameraShake(2, 100)
                            // Speed up slightly
                            dropMs = Math.max(100, dropMs - removed * 15)
                        }
                    }

                    // Gradually speed up
                    if (variant >= 3) {
                        dropMs = Math.max(100, dropMs - 2)
                    }

                    // Next piece
                    pieceIdx = randint(0, pieceSet.length - 1)
                    active = cloneBlocks(pieceSet[pieceIdx].blocks)
                    px = 2
                    py = 0
                    activeColor = variant == 1 ? 7 : tetroColors[pieceIdx]

                    if (!canPlace(board, active, px, py, w, h)) {
                        failed = true
                    }
                }
            }

            drawBoard(board, active, px, py, activeColor, w, h, variant, remaining)

            lastLeft = nowLeft
            lastRight = nowRight
            lastDown = nowDown
            lastA = nowA
            pause(20)
        }

        clearAllSprites()
        scene.setBackgroundImage(image.create(160, 120)) // clear

        if (!gated) return true
        return !failed
    }

    // ── Chapter 3 flow ─────────────────────────────────────────

    export function playChapter3(): void {
        vortexTransition("1984 - MOSCOW")

        // Scene: Soviet computing centre
        setupRichScene(Art.bg_moscow, Art.pajitnov) // grey bg — austere office

        npcSay("PAJITNOV",
            "...Chto?! A camel? In Moscow?")
        npcSay("PAJITNOV",
            "I work here at the Computing Centre. I'm supposed to be testing this computer, but...")
        npcSay("PAJITNOV",
            "I made a little puzzle instead.")
        npcSay("PAJITNOV",
            "You know pentomino puzzles? Wooden shapes made of five squares?")
        npcSay("PAJITNOV",
            "I made a version where the pieces fall from above and you stack them.")
        npcSay("PAJITNOV",
            "But I'm not so sure about it. You try...")

        clearAllSprites()

        // ── Round 1: Pentomino version ─────────────────────────
        say(["ROUND 1: Pentominoes! 5-square shapes. No rotation. Survive 10 seconds!"])
        let r1 = playTetrisRound(1, true)

        setupRichScene(Art.bg_moscow, Art.pajitnov)
        if (r1) {
            npcSay("PAJITNOV",
                "You see? The shapes are too complicated. 12 different pieces, each with 5 squares...")
        } else {
            npcSay("PAJITNOV",
                "See? It's too hard! What do you think?")
        }

        let pick1 = chooseIdea("How would you improve it?", [
            new ChoiceOption("It seems like a fine puzzle", true),
            new ChoiceOption("Simpler shapes (4 squares)", r1)
        ])

        if (pick1 == 0) {
            setupRichScene(Art.bg_moscow, Art.pajitnov)
            npcSay("PAJITNOV",
                "Maybe you're right. Or maybe I should get back to testing this computer.")
            return
        }

        // Player chose to improve — simpler shapes
        creativityScore += 1
        setupRichScene(Art.bg_moscow, Art.pajitnov)
        npcSay("PAJITNOV",
            "Four squares each... that would be only... seven shapes!")
        npcSay("PAJITNOV",
            "Much simpler! And you could rotate them!")
        npcSay("PAJITNOV",
            "Four... tetra... I could call it... hmm, never mind the name.")

        // ── Round 2: Tetrominoes ───────────────────────────────
        say(["ROUND 2: Tetrominoes! 4-square shapes. Press A to rotate!"])
        let r2 = playTetrisRound(2, true)

        setupRichScene(Art.bg_moscow, Art.pajitnov)
        if (r2) {
            npcSay("PAJITNOV",
                "Better! But the well still fills up with no hope... any ideas?")
        } else {
            npcSay("PAJITNOV",
                "The simpler shapes help! But the well fills up fast. Any ideas?")
        }

        let pick2 = chooseIdea("Any more ideas?", [
            new ChoiceOption("It's good enough", true),
            new ChoiceOption("Clear completed rows", r2)
        ])

        if (pick2 == 0) {
            setupRichScene(Art.bg_moscow, Art.pajitnov)
            npcSay("PAJITNOV",
                "The simpler shapes fit together so much better! Spasibo, camel friend!")
            return
        }

        // Player chose line clearing
        creativityScore += 1
        setupRichScene(Art.bg_moscow, Art.pajitnov)
        npcSay("PAJITNOV",
            "YES! When you fill a complete row, it disappears!")
        npcSay("PAJITNOV",
            "Then if you're good, the game NEVER has to end!")
        npcSay("PAJITNOV",
            "You keep going by cleaning the bottom of the well!")
        npcSay("PAJITNOV",
            "I cannot stop playing this. I have smoked so many cigarettes today...")

        // ── Round 3: Full Tetris ───────────────────────────────
        say(["ROUND 3: Full Tetris! Lines clear, speed increases!"])
        playTetrisRound(3, false)

        setupRichScene(Art.bg_moscow, Art.pajitnov)
        npcSay("PAJITNOV",
            "This is... this is something special. I can feel it.")
        npcSay("PAJITNOV",
            "Tetra... plus tennis, my favorite sport...")
        npcSay("PAJITNOV",
            "TETRIS. I'm calling it Tetris.")
    }
}
