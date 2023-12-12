import { expect, test } from "bun:test";

function zip<T>(arr: T[][]): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr[0].length; i++) {
        result.push(arr.map((a) => a[i]));
    }
    return result;
}

function solution(input: string, scale = 2) {
    const grid = input.split("\n").map((line) => line.split(""));

    const emptyRows = new Set();
    for (let i = 0; i < grid.length; i++) {
        const isEmpty = grid[i].every((ch) => ch === ".");
        if (isEmpty) {
            emptyRows.add(i);
        }
    }

    const emptyCols = new Set();
    const zipped = zip(grid);
    for (let i = 0; i < zipped.length; i++) {
        const isEmpty = zipped[i].every((ch) => ch === ".");
        if (isEmpty) {
            emptyCols.add(i);
        }
    }

    const galaxies = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            const ch = grid[i][j];
            if (ch === "#") {
                galaxies.push({ row: i, col: j });
            }
        }
    }

    let ans = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i + 1; j < galaxies.length; j++) {
            const g1 = galaxies[i];
            const g2 = galaxies[j];

            for (let k = Math.min(g1.row, g2.row); k < Math.max(g1.row, g2.row); k++) {
                ans += emptyRows.has(k) ? scale : 1;
            }

            for (let k = Math.min(g1.col, g2.col); k < Math.max(g1.col, g2.col); k++) {
                ans += emptyCols.has(k) ? scale : 1;
            }
        }
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input, 100);
    const expected = 8410;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input, 1_000_000);
    const expected = 702770569197;

    expect(actual).toBe(expected);
});
