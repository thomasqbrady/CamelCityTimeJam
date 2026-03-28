// ============================================================
// CAMEL CITY TIME JAM — Game State
// ============================================================

namespace CCTJ {
    // Creativity score: 0-2 per chapter, max 6
    export let creativityScore = 0

    // Konami code easter egg — Simon wears shades all game
    export let sunglassesMode = false

    export function resetGameState(): void {
        creativityScore = 0
        sunglassesMode = false
    }

    export function winstonImage(): Image {
        return sunglassesMode ? Art.winstonRight : Art.winstonNoShadesEast
    }

    /** Left-facing Simon for dialogue scenes where he's on the right side. */
    export function winstonImageLeft(): Image {
        return sunglassesMode ? Art.winstonLeft : Art.winstonNoShadesWest
    }

    export function winstonWalkImages(): Image[] {
        return sunglassesMode ? Art.winstonShadesWalkFrames() : Art.winstonWalkFrames()
    }

    /** Build the 4 vortex spin frames (original + 3 flipped variants). */
    export function vortexFrames(): Image[] {
        let base = Art.vortex
        let fx = base.clone()
        fx.flipX()
        let fxy = fx.clone()
        fxy.flipY()
        let fy = base.clone()
        fy.flipY()
        return [base, fx, fxy, fy]
    }
}
