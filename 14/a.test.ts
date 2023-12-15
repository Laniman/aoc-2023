import { expect, test } from "bun:test";

function zip<T>(arr: T[][]): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr[0].length; i++) {
        result.push(arr.map((a) => a[i]));
    }
    return result;
}

function solution(input: string) {
    const grid = input.split("\n").map((line) => line.split(""));
    const zipped = zip(grid)
        .map((col) => col.join(""))
        .map((col) => {
            const split = col.split("#").map((c) => c.split(""));
            for (const seg of split) {
                seg.sort((a, b) => (a < b ? 1 : -1));
            }
            return split
                .map((seg) => seg.join(""))
                .join("#")
                .split("");
        });

    const unzipped = zip(zipped);
    let ans = 0;
    for (let i = 0; i < unzipped.length; i++) {
        const j = unzipped.length - i;
        const count = unzipped[i].filter((c) => c === "O").length;
        ans += count * j;
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 136;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 113424;
    expect(actual).toBe(expected);
});
