import { expect, test } from "bun:test";

function solution(input: string) {
    const words = input.split(",").map((word) => word.split(""));
    let ans = 0;
    for (const word of words) {
        let value = 0;
        for (const ch of word) {
            value += ch.charCodeAt(0);
            value *= 17;
            value %= 256;
        }
        ans += value;
    }
    return ans;
}

test("example-1", async () => {
    const actual = solution("HASH");
    const expected = 52;
    expect(actual).toBe(expected);
});

test("example-2", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 1320;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 511416;
    expect(actual).toBe(expected);
});
