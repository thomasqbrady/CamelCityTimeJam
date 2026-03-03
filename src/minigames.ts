namespace CCTJ {
    function clampVelocity(s: Sprite, speed: number) {
        if (s.vx > speed) s.vx = speed
        if (s.vx < -speed) s.vx = -speed
        if (s.vy > speed) s.vy = speed
        if (s.vy < -speed) s.vy = -speed
    }

    function createBreakoutBricks(variant: number): Sprite[] {
        let bricks: Sprite[] = []
        let rows = 3
        let cols = 8
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let brick = sprites.create(image.create(16, 6), SpriteKind.Brick)
                let color = 1
                if (variant >= 2) {
                    color = 2 + r
                }
                brick.image.fill(color)
                brick.setPosition(15 + c * 18, 16 + r * 9)
                bricks.push(brick)
            }
        }
        return bricks
    }

    export function playBreakoutRound(variant: number, gated: boolean): boolean {
        clearAllSprites()
        scene.setBackgroundColor(12)

        let paddle = sprites.create(img`
            88888888888888888888
            8..................8
            88888888888888888888
        `, SpriteKind.Paddle)
        paddle.setPosition(80, 110)

        let ball = sprites.create(img`
            .55.
            5555
            5555
            .55.
        `, SpriteKind.Ball)
        ball.setPosition(paddle.x, 104)

        let bricks = createBreakoutBricks(variant)
        let launched = false
        let failed = false
        let start = game.runtime()
        let lastA = false

        game.showLongText("Breakout prototype: survive 10 seconds.", DialogLayout.Bottom)

        while (game.runtime() - start < 10000) {
            let move = 0
            if (controller.left.isPressed()) {
                move = -3
            }
            if (controller.right.isPressed()) {
                move = 3
            }
            paddle.x += move
            if (paddle.left < 12) paddle.left = 12
            if (paddle.right > 148) paddle.right = 148

            let nowA = controller.A.isPressed()
            if (nowA && !lastA && !launched) {
                launched = true
                if (variant == 1) {
                    ball.vx = 0
                } else {
                    ball.vx = randint(-45, 45)
                    if (Math.abs(ball.vx) < 15) {
                        ball.vx = 20
                    }
                }
                ball.vy = -65
            }
            lastA = nowA

            if (!launched) {
                ball.x = paddle.x
            } else {
                if (ball.left <= 1 || ball.right >= 159) {
                    if (variant >= 2) ball.vx *= -1
                }
                if (ball.top <= 1) {
                    ball.vy = Math.abs(ball.vy)
                }

                if (ball.overlapsWith(paddle) && ball.vy > 0) {
                    ball.vy = -Math.abs(ball.vy)
                    if (variant >= 3) {
                        let dx = ball.x - paddle.x
                        ball.vx = dx * 4
                        if (ball.vx > 90) ball.vx = 90
                        if (ball.vx < -90) ball.vx = -90
                    } else if (variant >= 2) {
                        if (ball.vx == 0) ball.vx = randint(-35, 35)
                    }
                }

                for (let brick of bricks) {
                    if (brick && ball.overlapsWith(brick)) {
                        ball.vy *= -1
                        if (variant >= 2) {
                            brick.destroy(effects.disintegrate, 100)
                        }
                        break
                    }
                }

                if (ball.top > 124) {
                    failed = true
                    break
                }
            }
            pause(20)
        }

        clearAllSprites()
        if (!gated) {
            game.showLongText("You helped shape a real Breakout loop.", DialogLayout.Bottom)
            return true
        }
        return !failed
    }

    function ghostImage(color: number): Image {
        let imgGhost = img`
            .999999.
            99999999
            99999999
            99999999
            99999999
            9.9.9.9.
            9.9.9.9.
            ........
        `
        imgGhost.replace(9, color)
        return imgGhost
    }

    export function playPacRound(variant: number, gated: boolean): boolean {
        clearAllSprites()
        scene.setBackgroundColor(11)

        let pac = sprites.create(img`
            .7777777.
            777777777
            777777...
            77777....
            77777....
            777777...
            777777777
            .7777777.
        `, SpriteKind.Player)
        pac.setPosition(80, 70)
        controller.moveSprite(pac, 60, 60)
        pac.setStayInScreen(true)

        let colors = [2, 13, 8, 4]
        let ghosts: Sprite[] = []
        for (let i = 0; i < 4; i++) {
            let baseColor = variant == 3 ? colors[i] : 2
            let g = sprites.create(ghostImage(baseColor), SpriteKind.Ghost)
            g.setPosition(35 + i * 28, 28)
            g.vx = randint(-35, 35)
            g.vy = randint(-35, 35)
            g.setStayInScreen(true)
            ghosts.push(g)
        }

        let pellets: Sprite[] = []
        if (variant >= 2) {
            let corners = [[10, 10], [150, 10], [10, 110], [150, 110]]
            for (let p of corners) {
                let pellet = sprites.create(img`
                    .3.
                    333
                    .3.
                `, SpriteKind.Pellet)
                pellet.setPosition(p[0], p[1])
                pellets.push(pellet)
            }
        }

        let frightenedUntil = 0
        let failed = false
        let start = game.runtime()
        let lastAiTick = 0

        game.showLongText("Maze prototype: survive 10 seconds.", DialogLayout.Bottom)

        while (game.runtime() - start < 10000) {
            if (variant >= 2) {
                for (let pellet of pellets) {
                    if (pac.overlapsWith(pellet)) {
                        pellet.destroy(effects.hearts, 100)
                        frightenedUntil = game.runtime() + 2800
                        for (let g of ghosts) {
                            g.setImage(ghostImage(1))
                        }
                    }
                }
            }

            if (game.runtime() - lastAiTick > 220) {
                lastAiTick = game.runtime()
                for (let i = 0; i < ghosts.length; i++) {
                    let g = ghosts[i]
                    if (frightenedUntil > game.runtime()) {
                        g.vx = randint(-45, 45)
                        g.vy = randint(-45, 45)
                    } else {
                        if (variant == 3) {
                            g.setImage(ghostImage(colors[i]))
                        } else {
                            g.setImage(ghostImage(2))
                        }

                        if (variant == 1 || variant == 2) {
                            if (randint(0, 100) < 45) {
                                g.vx = randint(-55, 55)
                                g.vy = randint(-55, 55)
                            }
                        } else {
                            if (i == 0) {
                                g.vx = (pac.x - g.x) * 2
                                g.vy = (pac.y - g.y) * 2
                            } else if (i == 1) {
                                g.vx = (pac.x + pac.vx / 2 - g.x) * 2
                                g.vy = (pac.y + pac.vy / 2 - g.y) * 2
                            } else if (i == 2) {
                                g.vx = randint(-70, 70)
                                g.vy = randint(-70, 70)
                            } else {
                                if (Math.abs(pac.x - g.x) + Math.abs(pac.y - g.y) < 50) {
                                    g.vx = (10 - g.x) * 2
                                    g.vy = (110 - g.y) * 2
                                } else {
                                    g.vx = (pac.x - g.x) * 2
                                    g.vy = (pac.y - g.y) * 2
                                }
                            }
                        }
                    }
                    clampVelocity(g, 65)
                }
            }

            for (let g of ghosts) {
                if (pac.overlapsWith(g)) {
                    if (variant >= 2 && frightenedUntil > game.runtime()) {
                        g.setPosition(randint(20, 140), randint(20, 60))
                        g.vx = randint(-45, 45)
                        g.vy = randint(-45, 45)
                    } else {
                        failed = true
                    }
                }

                if (g.left <= 0 || g.right >= 160) g.vx *= -1
                if (g.top <= 0 || g.bottom >= 120) g.vy *= -1
            }

            if (failed) break
            pause(20)
        }

        clearAllSprites()
        if (!gated) {
            game.showLongText("The maze game now has real strategy.", DialogLayout.Bottom)
            return true
        }
        return !failed
    }

    class PieceDef {
        blocks: number[][]
        constructor(blocks: number[][]) {
            this.blocks = blocks
        }
    }

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

    function lockPiece(board: number[][], blocks: number[][], px: number, py: number, color: number) {
        for (let b of blocks) {
            board[py + b[1]][px + b[0]] = color
        }
    }

    function clearLines(board: number[][], w: number, h: number): number {
        let cleared = 0
        for (let y = h - 1; y >= 0; y--) {
            let full = true
            for (let x = 0; x < w; x++) {
                if (board[y][x] == 0) full = false
            }
            if (full) {
                for (let yy = y; yy > 0; yy--) {
                    for (let x = 0; x < w; x++) {
                        board[yy][x] = board[yy - 1][x]
                    }
                }
                for (let x = 0; x < w; x++) {
                    board[0][x] = 0
                }
                cleared += 1
                y += 1
            }
        }
        return cleared
    }

    function drawBoard(board: number[][], active: number[][], px: number, py: number, activeColor: number, w: number, h: number) {
        let bg = scene.backgroundImage()
        bg.fill(1)
        let cell = 7
        let ox = 52
        let oy = 10

        bg.drawRect(ox - 2, oy - 2, w * cell + 4, h * cell + 4, 15)

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                let c = board[y][x]
                if (c > 0) {
                    bg.fillRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1, c)
                } else {
                    bg.drawRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1, 5)
                }
            }
        }

        for (let b of active) {
            bg.fillRect(ox + (px + b[0]) * cell, oy + (py + b[1]) * cell, cell - 1, cell - 1, activeColor)
        }

        bg.print("STACK", 3, 2, 11)
    }

    export function playTetrisRound(variant: number, gated: boolean): boolean {
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

        let pentominoes: PieceDef[] = [
            new PieceDef([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]]),
            new PieceDef([[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]]),
            new PieceDef([[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]),
            new PieceDef([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]])
        ]
        let tetrominoes: PieceDef[] = [
            new PieceDef([[0, 0], [1, 0], [2, 0], [3, 0]]),
            new PieceDef([[0, 0], [1, 0], [0, 1], [1, 1]]),
            new PieceDef([[0, 0], [1, 0], [2, 0], [1, 1]]),
            new PieceDef([[0, 0], [0, 1], [0, 2], [1, 2]]),
            new PieceDef([[1, 0], [1, 1], [1, 2], [0, 2]])
        ]

        let pieceSet = variant == 1 ? pentominoes : tetrominoes
        let active = cloneBlocks(pieceSet[randint(0, pieceSet.length - 1)].blocks)
        let px = 2
        let py = 0
        let activeColor = variant == 1 ? 7 : 9
        let failed = false
        let start = game.runtime()

        let dropMs = variant == 1 ? 340 : 260
        let lastDrop = game.runtime()
        let lastLeft = false
        let lastRight = false
        let lastDown = false
        let lastA = false

        game.showLongText("Falling blocks: survive 10 seconds.", DialogLayout.Bottom)

        if (!canPlace(board, active, px, py, w, h)) {
            failed = true
        }

        while (!failed && game.runtime() - start < 10000) {
            let nowLeft = controller.left.isPressed()
            let nowRight = controller.right.isPressed()
            let nowDown = controller.down.isPressed()
            let nowA = controller.A.isPressed()

            if (nowLeft && !lastLeft) {
                if (canPlace(board, active, px - 1, py, w, h)) px -= 1
            }
            if (nowRight && !lastRight) {
                if (canPlace(board, active, px + 1, py, w, h)) px += 1
            }
            if (variant >= 2 && nowA && !lastA) {
                let rotated = rotateBlocks(active)
                if (canPlace(board, rotated, px, py, w, h)) active = rotated
            }

            let localDrop = dropMs
            if (nowDown && !lastDown) {
                localDrop = 50
            }

            if (game.runtime() - lastDrop >= localDrop) {
                lastDrop = game.runtime()
                if (canPlace(board, active, px, py + 1, w, h)) {
                    py += 1
                } else {
                    lockPiece(board, active, px, py, activeColor)

                    if (variant >= 3) {
                        let removed = clearLines(board, w, h)
                        if (removed > 0) {
                            scene.cameraShake(2, 100)
                            dropMs = Math.max(120, dropMs - removed * 12)
                        }
                        dropMs = Math.max(120, dropMs - 1)
                    }

                    active = cloneBlocks(pieceSet[randint(0, pieceSet.length - 1)].blocks)
                    px = 2
                    py = 0
                    activeColor = variant == 1 ? 7 : randint(2, 13)
                    if (!canPlace(board, active, px, py, w, h)) {
                        failed = true
                    }
                }
            }

            drawBoard(board, active, px, py, activeColor, w, h)

            lastLeft = nowLeft
            lastRight = nowRight
            lastDown = nowDown
            lastA = nowA
            pause(20)
        }

        clearAllSprites()
        if (!gated) {
            game.showLongText("The final loop clicks: rotate, clear, survive.", DialogLayout.Bottom)
            return true
        }
        return !failed
    }
}
