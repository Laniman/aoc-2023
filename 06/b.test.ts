import { expect, test } from "bun:test";

function solution(input: string) {
    const [time, distance] = input.split("\n").map((s) => Number(s.match(/\d+/g)?.join("")));
    const s = (v: number, t: number): number => v * t;

    let counter = 0;
    for (let j = 1; j < time; j++) {
        if (s(j, time - j) > distance) {
            counter += 1;
        }
    }
    return counter;
}

test("example", async () => {
    const file = Bun.file("./06/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 71503;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./06/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 42515755;
    expect(actual).toBe(expected);
});
