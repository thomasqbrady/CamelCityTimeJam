namespace CCTJ {
  function choiceA(
    label: string,
    unlocked: boolean,
    crossed: boolean,
  ): ChoiceOption {
    return new ChoiceOption(label, unlocked, crossed, "");
  }

  export function playChapter1() {
    flashTransition("1975 - ATARI");
    showLines([
      "BUSHNELL: Talking camel? Sure. Welcome to Atari.",
      "Try this brick game prototype.",
    ]);

    let r1 = playBreakoutRound(1, true);
    if (!r1) {
      let pickA = chooseIdea("Chapter 1 Feedback", "So? What do you think?", [
        choiceA("A: It is great!", true, false),
        choiceA("B: Add angled bounce", false, false),
        choiceA("C: Paddle edge aim", false, false),
      ]);
      if (pickA == 0) {
        showLines(["BUSHNELL: Something is missing, if you ask me."]);
      }
      return;
    }

    let pickB = chooseIdea(
      "Chapter 1 Feedback",
      "You survived. Suggest an idea:",
      [
        choiceA("A: It is great!", false, true),
        choiceA("B: Add angled bounce", true, false),
        choiceA("C: Paddle edge aim", false, false),
      ],
    );
    if (pickB == 1) {
      showLines(["BUSHNELL: Angles and reflections! That changes everything."]);
    }

    let r2 = playBreakoutRound(2, true);
    creativityScore += 1;
    if (!r2) return;

    let pickC = chooseIdea(
      "Chapter 1 Feedback",
      "Round 2 cleared. Next idea:",
      [
        choiceA("A: It is great!", false, true),
        choiceA("B: Add angled bounce", false, true),
        choiceA("C: Paddle edge aim", true, false),
      ],
    );
    if (pickC == 2) {
      showLines(["BUSHNELL: Now we are talking tennis!"]);
    }

    playBreakoutRound(3, false);
    creativityScore += 1;
  }

  export function playChapter2() {
    flashTransition("1979 - NAMCO");
    showLines([
      "IWATANI: I want a game everyone can enjoy.",
      "Try this maze prototype.",
    ]);

    let r1 = playPacRound(1, true);
    if (!r1) {
      let pickA = chooseIdea("Chapter 2 Feedback", "What would you change?", [
        choiceA("A: It seems fine.", true, false),
        choiceA("B: Add power pellets", false, false),
        choiceA("C: Ghost personalities", false, false),
      ]);
      if (pickA == 0) {
        showLines(["IWATANI: Hm. I think it still needs more life."]);
      }
      return;
    }

    let pickB = chooseIdea(
      "Chapter 2 Feedback",
      "You survived. Suggest an idea:",
      [
        choiceA("A: It seems fine.", false, true),
        choiceA("B: Add power pellets", true, false),
        choiceA("C: Ghost personalities", false, false),
      ],
    );
    if (pickB == 1) {
      showLines(["IWATANI: Turn the hunter into the hunted!"]);
    }

    let r2 = playPacRound(2, true);
    creativityScore += 1;
    if (!r2) return;

    let pickC = chooseIdea(
      "Chapter 2 Feedback",
      "Round 2 cleared. Next idea:",
      [
        choiceA("A: It seems fine.", false, true),
        choiceA("B: Add power pellets", false, true),
        choiceA("C: Ghost personalities", true, false),
      ],
    );
    if (pickC == 2) {
      showLines(["IWATANI: Different behaviors and style. Perfect!"]);
    }

    playPacRound(3, false);
    creativityScore += 1;
  }

  export function playChapter3() {
    flashTransition("1984 - MOSCOW");
    showLines([
      "PAJITNOV: I made a falling puzzle from pentominoes.",
      "It feels too hard. Try it.",
    ]);

    let r1 = playTetrisRound(1, true);
    if (!r1) {
      let pickA = chooseIdea("Chapter 3 Feedback", "What is missing?", [
        choiceA("A: It seems fine.", true, false),
        choiceA("B: Simpler shapes", false, false),
        choiceA("C: Clear full rows", false, false),
      ]);
      if (pickA == 0) {
        showLines(["PAJITNOV: Maybe I should return to my normal work."]);
      }
      return;
    }

    let pickB = chooseIdea(
      "Chapter 3 Feedback",
      "You survived. Suggest an idea:",
      [
        choiceA("A: It seems fine.", false, true),
        choiceA("B: Simpler shapes", true, false),
        choiceA("C: Clear full rows", false, false),
      ],
    );
    if (pickB == 1) {
      showLines(["PAJITNOV: Four squares each... only seven shapes!"]);
    }

    let r2 = playTetrisRound(2, true);
    creativityScore += 1;
    if (!r2) return;

    let pickC = chooseIdea(
      "Chapter 3 Feedback",
      "Round 2 cleared. Next idea:",
      [
        choiceA("A: It seems fine.", false, true),
        choiceA("B: What if the shapes were simpler?", false, true),
        choiceA("C: Clear full rows", true, false),
      ],
    );
    if (pickC == 2) {
      showLines(["PAJITNOV: Yes. Full rows should disappear!"]);
    }

    playTetrisRound(3, false);
    creativityScore += 1;
  }
}
