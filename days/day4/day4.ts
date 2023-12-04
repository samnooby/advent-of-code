import { Day, Solution } from "../day";

interface CardWins {
  [key: number]: number;
}

interface ScratchCards {
  [key: number]: ScratchCard;
}

// interface ScratchCard {
//   cardNumber: number;
//   winning: number[];
//   playing: number[];
//   multiple?: number;
// }

type ScratchCard = {
  cardNumber: number;
  winning: number[];
  playing: number[];
  multiple: number;
};

class Day4Solution extends Day {
  dayNumber = 4;

  private getNumbers(card: String): ScratchCard {
    const numRegex = /(\d+)/g;
    const [cardTitle, numbers] = card.split(": ");
    const [winning, playing] = numbers
      .split("|")
      .map((val) => [...val.matchAll(numRegex)].map((match) => +match[0]));
    const cardNum = cardTitle.match(numRegex);
    if (!cardNum?.[0]) throw Error("Card Number not found");
    return {
      cardNumber: +cardNum[0],
      winning,
      playing,
      multiple: 1,
    };
  }

  private getPoints(card: String): number {
    const { winning, playing } = this.getNumbers(card);
    const total = playing.reduce((prev, curr) => {
      if (winning.includes(curr)) {
        // If prev is 0 then make it 1 otherwise double it
        return prev === 0 ? 1 : prev * 2;
      }
      return prev;
    }, 0);
    return total;
  }

  private solvePart1: Solution = (input) => {
    const total = input.reduce((prev, curr) => {
      return prev + this.getPoints(curr);
    }, 0);

    return `${total}`;
  };

  private getNumWins(card: ScratchCard): number {
    return card.playing.reduce((prev, curr) => {
      if (card.winning.includes(curr)) return prev + 1;
      return prev;
    }, 0);
  }

  scratchCards: ScratchCards = {};

  private solveCardWins(card: ScratchCard): number {
    const wins = this.getNumWins(card);
    for (let i = wins; i > 0; i--) {
      const nextCard = this.scratchCards[card.cardNumber + i];
      if (nextCard) {
        nextCard.multiple = nextCard.multiple + card.multiple;
      }
    }

    return card.multiple;
  }

  private solvePart2: Solution = (input) => {
    this.scratchCards = input.reduce((prev, curr) => {
      const newCard = this.getNumbers(curr);
      return { ...prev, [newCard.cardNumber]: newCard };
    }, {});
    const total = Object.values(this.scratchCards).reduce((prev, card) => {
      return prev + this.solveCardWins(card);
    }, 0);
    return `${total}`;
  };

  tests = [
    { file: "test.txt", expected: "13", solution: this.solvePart1 },
    { file: "test.txt", expected: "30", solution: this.solvePart2 },
  ];
  solutions = [
    { file: "input.txt", solution: this.solvePart1 },
    { file: "input.txt", solution: this.solvePart2 },
  ];
}

const Day4 = new Day4Solution();
export { Day4 };
