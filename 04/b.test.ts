import { expect, test } from "bun:test";

function solution(input: string) {
    const lines = input.split("\n");
    const cards = lines.map((line) => {
        const [winning, hand] = line
            .split(": ")[1]
            .trim()
            .split(" | ")
            .map((x) => x.split(/\s+/).map((x) => Number(x)));
        return [winning, new Set(hand), 1] as [number[], Set<number>, number];
    });

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const [winning, hand, copies] = card;
        const filtered = winning.filter((n) => hand.has(n));
        const winCopies = filtered.length;

        for (let j = 1; j <= copies; j++) {
            for (let k = 1; i + k < cards.length && k <= winCopies; k++) {
                cards[i + k][2] += 1;
            }
        }
    }

    return cards.reduce((a, b) => a + b[2], 0);
}

test("example", async () => {
    const file = Bun.file("./04/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 30;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./04/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 13261850;
    expect(actual).toBe(expected);
});
