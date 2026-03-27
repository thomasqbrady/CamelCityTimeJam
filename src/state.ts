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
        return sunglassesMode ? Art.winstonShades : Art.winstonRight
    }
}
