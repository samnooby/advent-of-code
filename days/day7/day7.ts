import { Day } from "../day";

const CARDMAP: { [key: string]: number } = {
  T: 10,
  J: 11,
  Q: 12,
  K: 13,
  A: 14,
};

type Hand = {
  cards: string;
  uniqueCards: Set<string>;
  score: number;
};

class Day7Solution extends Day<number> {
  dayNumber = 7;
  expectedTestValues = { part1: 6440, part2: 5905 };

  private compareTie = (a: Hand, b: Hand, wildCard: string = ""): number => {
    let aCard = a.cards.charAt(0);
    let bCard = b.cards.charAt(0);
    for (let i = 0; aCard === bCard; i++) {
      if (i > a.cards.length) {
        throw Error(`Card not found ${a.cards} ${b.cards}`);
      }
      aCard = a.cards.charAt(i);
      bCard = b.cards.charAt(i);
    }
    if (aCard === wildCard) return -1;
    if (bCard === wildCard) return 1;
    return (CARDMAP[aCard] || +aCard) - (CARDMAP[bCard] || +bCard);
  };

  private getHands(input: string[]): Hand[] {
    return input.reduce((prev: Hand[], curr) => {
      const [cards, score] = curr.split(" ");
      const uniqueCards = new Set(cards.split(""));
      return [...prev, { cards, score: +score, uniqueCards }];
    }, []);
  }

  private getSize2Max(a: string, b: string): [number, number] {
    // Full house or 4 of a kind
    const aNumTimes = a.split(a[0]).length - 1;
    const bNumTimes = b.split(b[0]).length - 1;
    const aVal = Math.max(aNumTimes, a.length - aNumTimes);
    const bVal = Math.max(bNumTimes, b.length - bNumTimes);
    return [aVal, bVal];
  }

  private getSize3Max(
    a: string,
    b: string,
    aUnique: Set<string>,
    bUnique: Set<string>
  ): [number, number] {
    const aVal = [...aUnique].reduce(
      (prev, curr) => Math.max(prev, a.split(curr).length - 1),
      0
    );
    const bVal = [...bUnique].reduce(
      (prev, curr) => Math.max(prev, b.split(curr).length - 1),
      0
    );
    return [aVal, bVal];
  }

  private calculateScore(list: Hand[]): number {
    return list.reduce((prev, curr, i) => {
      return prev + curr.score * (i + 1);
    }, 0);
  }

  solvePart1(input: string[]): number {
    const hands = this.getHands(input);
    const sorted = hands.sort((a, b) => {
      const { size } = a.uniqueCards;
      if (size != b.uniqueCards.size) {
        return b.uniqueCards.size - size;
      }
      if (size === 2) {
        const [aVal, bVal] = this.getSize2Max(a.cards, b.cards);
        if (aVal != bVal) return aVal - bVal;
      } else if (size === 3) {
        const [aVal, bVal] = this.getSize3Max(
          a.cards,
          b.cards,
          a.uniqueCards,
          b.uniqueCards
        );
        if (aVal != bVal) return aVal - bVal;
      }
      return this.compareTie(a, b);
    });
    return this.calculateScore(sorted);
  }

  solvePart2(input: string[]): number {
    const hands = this.getHands(input);
    const wildCard = "J";
    const sorted = hands.sort((a, b) => {
      const handLength = a.cards.length;
      const aSize = a.uniqueCards.size - +a.uniqueCards.has(wildCard) || 1;
      const bSize = b.uniqueCards.size - +b.uniqueCards.has(wildCard) || 1;
      if (aSize != bSize) return bSize - aSize;
      const aCards = a.cards.split(wildCard).join("");
      const bCards = b.cards.split(wildCard).join("");
      if (aSize === 2 || aSize === 3) {
        let [aVal, bVal] =
          aSize === 2
            ? this.getSize2Max(aCards, bCards)
            : this.getSize3Max(aCards, bCards, a.uniqueCards, b.uniqueCards);
        aVal += handLength - aCards.length;
        bVal += handLength - bCards.length;
        if (aVal != bVal) return aVal - bVal;
      }

      return this.compareTie(a, b, wildCard);
    });
    return this.calculateScore(sorted);
  }
}

module.exports = new Day7Solution();
