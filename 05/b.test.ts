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

    const possibleSeeds = [];

    for (let i = 0; i < maps.length; i++) {
        const map = maps[i];
        for (const [d] of map) {
            let curr = d;

            for (let k = i; k >= 0; k--) {
                const innerMap = maps[k];
                const instr = innerMap.find((instr) => curr >= instr[0] && curr < instr[0] + instr[2]);
                if (instr) {
                    curr = instr[1] - instr[0] + curr;
                }
            }

            if (seeds.some((seed, i) => i % 2 === 0 && curr >= seed && curr < seed + seeds[i + 1])) {
                possibleSeeds.push(curr);
            }
        }
    }

    const locations = possibleSeeds.map((seed) => {
        let source = seed;
        for (const map of maps) {
            const instr = map.find((instr) => source >= instr[1] && source < instr[1] + instr[2]);
            if (instr) {
                source = instr[0] - instr[1] + source;
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
    const expected = 46;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./05/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 125742456;
    expect(actual).toBe(expected);
});
