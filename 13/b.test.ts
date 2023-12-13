import { expect, test } from "bun:test";

function zip(arr: string[]): string[] {
    return Array.from({ length: arr[0].length }, (_, i) => arr.map((a) => a[i]).join(""));
}

function zip2<T>(arr1: T[], arr2: T[]): [T, T][] {
    const result: [T, T][] = [];
    for (let i = 0; i < arr1.length; i++) {
        result.push([arr1[i], arr2[i]]);
    }
    return result;
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

        let s = 0;
        for (const [x, y] of zip2(a, b)) {
            const xx = x.split("");
            const yy = y.split("");
            for (const [aa, bb] of zip2(xx, yy)) {
                s += aa === bb ? 0 : 1;
            }
        }

        if (s === 1) {
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
    const expected = 400;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 37876;
    expect(actual).toBe(expected);
});
