// ============================================================
// CAMEL CITY TIME JAM — Game State
// ============================================================

namespace CCTJ {
    // Creativity score: 0-2 per chapter, max 6
    export let creativityScore = 0

    // Konami code easter egg — Winston wears shades all game
    export let sunglassesMode = false

    export function resetGameState(): void {
        creativityScore = 0
        sunglassesMode = false
    }

    export function winstonImage(): Image {
        return sunglassesMode ? Art.winstonRight : Art.winstonNoShadesEast
    }

    /** Left-facing Winston for dialogue scenes where he's on the right side. */
    export function winstonImageLeft(): Image {
        return sunglassesMode ? Art.winstonLeft : Art.winstonNoShadesWest
    }

    export function winstonWalkImages(): Image[] {
        return sunglassesMode ? Art.winstonShadesWalkFrames() : Art.winstonWalkFrames()
    }
}
