import { expect, test } from "bun:test";

function solution(input: string) {
    const [seedsString, ...mapStrings] = input.split("\n\n");
    const seeds = seedsString
        .split(":")[1]
        .trim()
        .split(" ")
        .map((n) => Number(n));

    const maps = mapStrings.map((map) =>
        map
            .split("\n")
            .slice(1)
            .map((string) => string.split(" ").map((n) => Number(n))),
    );

    const locations = seeds.map((seed) => {
        let source = seed;
        for (const map of maps) {
            const instr = map.find(([_, a, r]) => source <= a + r && source >= a);
            if (instr) {
                const [b, a, r] = instr;
                source = b - a + source;
            }
        }
        return source;
    });

    const ans = Math.min(...locations);
    return ans;
}

test("example", async () => {
    const file = Bun.file("./05/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 35;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./05/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 196167384;
    expect(actual).toBe(expected);
});
