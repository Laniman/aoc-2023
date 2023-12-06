import { expect, test } from "bun:test";

function solution(input: string) {
    const [time, distance] = input.split("\n").map((s) => {
        const result = s.match(/\d+/g);
        if (!result) throw new Error();
        return result.map(Number);
    });

    let ans = 1;

    for (let i = 0; i < time.length; i++) {
        const t = time[i];
        const d = distance[i];
        const s = (v: number, t: number): number => v * t;

        let counter = 0;
        for (let j = 1; j < t; j++) {
            if (s(j, t - j) > d) {
                counter += 1;
            }
        }
        ans *= counter;
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file("./06/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 288;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./06/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 500346;
    expect(actual).toBe(expected);
});
