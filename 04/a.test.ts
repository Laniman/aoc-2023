import { expect, test } from "bun:test";

function solution(input: string) {
    const lines = input.split("\n");
    const cards = lines.map((line) => {
        const [winning, hand] = line
            .split(": ")[1]
            .trim()
            .split(" | ")
            .map((x) => x.split(/\s+/).map((x) => Number(x)));
        return [winning, new Set(hand)] as const;
    });

    const ans = cards.reduce((acc, card) => {
        const [winning, hand] = card;
        const pow = winning.filter((n) => hand.has(n));
        const score = pow.length > 0 ? 2 ** (pow.length - 1) : 0;
        return acc + score;
    }, 0);

    return ans;
}

test("example", async () => {
    const file = Bun.file("./04/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 13;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./04/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 23750;
    expect(actual).toBe(expected);
});
