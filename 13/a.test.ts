import { expect, test } from "bun:test";

function zip(arr: string[]): string[] {
    return Array.from({ length: arr[0].length }, (_, i) => arr.map((a) => a[i]).join(""));
}

function findMirrorIndex(arr: string[]): number | undefined {
    for (let i = 1; i < arr.length; i++) {
        const a = arr.slice(0, i).reverse();
        const b = arr.slice(i);

        if (a.length < b.length) {
            b.length = a.length;
        } else {
            a.length = b.length;
        }

        if (Bun.deepEquals(a, b)) {
            return i;
        }
    }
}

function solution(input: string) {
    const records = input.split("\n\n").map((block) => block.split("\n"));
    let left = 0;
    let top = 0;

    for (const record of records) {
        const row = findMirrorIndex(record);
        if (row !== undefined) {
            top += row;
            continue;
        }

        const zipped = zip(record);
        const col = findMirrorIndex(zipped);
        if (col !== undefined) {
            left += col;
            continue;
        }

        throw new Error("Unexpected");
    }

    return left + 100 * top;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 405;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 30802;
    expect(actual).toBe(expected);
});
