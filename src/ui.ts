namespace SpriteKind {
    export const Paddle = SpriteKind.create()
    export const Ball = SpriteKind.create()
    export const Brick = SpriteKind.create()
    export const Ghost = SpriteKind.create()
    export const Pellet = SpriteKind.create()
    export const Npc = SpriteKind.create()
    export const Wall = SpriteKind.create()
}

namespace CCTJ {
    export class ChoiceOption {
        label: string
        unlocked: boolean
        crossed: boolean
        note: string

        constructor(label: string, unlocked: boolean, crossed: boolean, note: string) {
            this.label = label
            this.unlocked = unlocked
            this.crossed = crossed
            this.note = note
        }
    }

    export function clearAllSprites() {
        let kinds = [
            SpriteKind.Player,
            SpriteKind.Paddle,
            SpriteKind.Ball,
            SpriteKind.Brick,
            SpriteKind.Ghost,
            SpriteKind.Pellet,
            SpriteKind.Npc,
            SpriteKind.Wall,
            SpriteKind.Projectile,
            SpriteKind.Food,
            SpriteKind.Enemy
        ]
        for (let kind of kinds) {
            for (let s of sprites.allOfKind(kind)) {
                s.destroy()
            }
        }
    }

    export function flashTransition(label: string) {
        clearAllSprites()
        scene.setBackgroundColor(1)
        game.splash("VORTEX", label)
        for (let i = 0; i < 4; i++) {
            scene.setBackgroundColor(15)
            pause(80)
            scene.setBackgroundColor(1)
            pause(80)
        }
        scene.cameraShake(4, 400)
    }

    export function showLines(lines: string[]) {
        for (let line of lines) {
            game.showLongText(line, DialogLayout.Bottom)
        }
    }

    function drawChoiceMenu(title: string, prompt: string, options: ChoiceOption[], selected: number) {
        let bg = scene.backgroundImage()
        bg.fill(1)
        bg.print(title, 8, 4, 15)
        bg.drawLine(8, 14, 152, 14, 15)
        bg.print(prompt, 8, 20, 9)

        for (let i = 0; i < options.length; i++) {
            let option = options[i]
            let y = 42 + i * 22
            let marker = selected == i ? ">" : " "
            let status = "[ ]"
            let color = 15

            if (option.crossed) {
                status = "[X]"
                color = 6
            } else if (!option.unlocked) {
                status = "[L]"
                color = 5
            }

            if (selected == i) {
                bg.fillRect(4, y - 2, 152, 18, 3)
            }

            bg.print(marker + " " + status + " " + option.label, 8, y, color)
            if (option.note.length > 0) {
                bg.print(option.note, 8, y + 9, 13)
            }
        }

        bg.print("UP/DOWN move  A select", 8, 112, 12)
    }

    export function chooseIdea(title: string, prompt: string, options: ChoiceOption[]): number {
        scene.setBackgroundImage(image.create(160, 120))

        let selected = 0
        let lastUp = false
        let lastDown = false
        let lastA = false

        drawChoiceMenu(title, prompt, options, selected)

        while (true) {
            let up = controller.up.isPressed()
            let down = controller.down.isPressed()
            let a = controller.A.isPressed()

            if (up && !lastUp) {
                selected = (selected + options.length - 1) % options.length
                drawChoiceMenu(title, prompt, options, selected)
            }

            if (down && !lastDown) {
                selected = (selected + 1) % options.length
                drawChoiceMenu(title, prompt, options, selected)
            }

            if (a && !lastA) {
                let picked = options[selected]
                if (picked.unlocked && !picked.crossed) {
                    clearAllSprites()
                    return selected
                }
                game.showLongText("That idea is locked right now.", DialogLayout.Bottom)
                drawChoiceMenu(title, prompt, options, selected)
            }

            lastUp = up
            lastDown = down
            lastA = a
            pause(20)
        }

        return 0
    }

    export function openingScene() {
        clearAllSprites()
        scene.setBackgroundColor(9)
        game.splash("CAMEL CITY", "TIME JAM")
        game.showLongText("A Martes Delta Co production for Camel City Game Jam", DialogLayout.Bottom)

        let winston = sprites.create(img`
            ....666666......
            ...67777776.....
            ..6777777776....
            ..67776677776...
            ..67777777776...
            ...6777777776...
            ....66666666....
            ...666....666...
            ..666......666..
            ..66........66..
            ..66........66..
            ..66........66..
            ..66........66..
            ...6........6...
            ................
            ................
        `, SpriteKind.Player)

        let jam = sprites.create(img`
            2222222222222222
            2..............2
            2.....4444.....2
            2....444444....2
            2....444444....2
            2.....4444.....2
            2..............2
            2222222222222222
        `, SpriteKind.Npc)

        winston.setPosition(18, 88)
        jam.setPosition(135, 88)

        for (let i = 0; i < 24; i++) {
            winston.x += 3
            if (i % 2 == 0) {
                winston.y += 1
            } else {
                winston.y -= 1
            }
            pause(90)
        }

        showLines([
            "WINSTON: Almost there! I can't wait to see what everyone is making!",
            "A swirling vortex appears!"
        ])

        for (let i = 0; i < 5; i++) {
            scene.setBackgroundColor(7)
            pause(70)
            scene.setBackgroundColor(9)
            pause(70)
        }

        winston.destroy(effects.disintegrate, 400)
        pause(450)
    }

    export function endingScene() {
        flashTransition("RETURN")
        if (creativityScore <= 2) {
            showLines([
                "Ending A (0-2): It is 2026. The jam starts now.",
                "The games were pretty good.",
                "But what if you had pushed a little farther?"
            ])
        } else if (creativityScore <= 4) {
            showLines([
                "Ending B (3-4): It is 2026. Ideas are sparking.",
                "Your influence helped the team level up."
            ])
        } else {
            showLines([
                "Ending C (5-6): A sign reads CAMEL CITY GAME JAM 2030.",
                "The future of games is in your hands."
            ])
            effects.confetti.startScreenEffect(1600)
        }

        game.splash("Creativity Score", "" + creativityScore + " / 6")
        game.showLongText("Thanks for playing Camel City Time Jam prototype.", DialogLayout.Bottom)
    }
}
