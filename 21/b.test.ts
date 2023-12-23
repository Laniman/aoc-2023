import { expect, test } from "bun:test";

const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
] as const;

function toKey([r, c]: [number, number]): string {
    return `${r},${c}`;
}

function fillGrid(start: [number, number], grid: string[], steps: number) {
    const ans = new Set();
    const seen = new Set();
    const queue = [[start, steps] as const];

    while (queue.length > 0) {
        const item = queue.shift();

        if (!item) throw new Error("Unexpected");

        const [point, steps] = item;

        if (steps % 2 === 0) ans.add(toKey(point));

        if (!steps) continue;

        for (const [dr, dc] of directions) {
            const [r, c] = point;
            const nr = r + dr;
            const nc = c + dc;

            if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid.length) {
                continue;
            }

            if (grid[nr][nc] === "#") {
                continue;
            }

            const key = toKey([nr, nc]);

            if (seen.has(key)) continue;

            seen.add(key);
            queue.push([[nr, nc], steps - 1]);
        }
    }

    return ans.size;
}

function solution(input: string, steps: number) {
    const grid = input.split("\n");

    if (grid.length !== grid[0].length) {
        throw new Error("Grid is not a square");
    }

    const gridSize = grid.length;
    const halfGridSize = Math.floor(gridSize / 2);

    let s: [number, number] | undefined;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j] === "S") {
                s = [i, j];
            }
        }
    }

    if (!s) throw new Error("Unexpected");

    if (s[0] !== s[1] || s[0] !== halfGridSize || s[1] !== halfGridSize) {
        throw new Error("Start is not at the center of the grid");
    }

    if (steps % gridSize !== halfGridSize) {
        throw new Error("Steps is not a multiple of the grid size");
    }

    const gridWidth = Math.floor(steps / gridSize) - 1;

    const odd = (Math.floor(gridWidth / 2) * 2 + 1) ** 2;
    const odds = fillGrid(s, grid, gridSize * 2 + 1) * odd;

    const even = (Math.floor((gridWidth + 1) / 2) * 2) ** 2;
    const evens = fillGrid(s, grid, gridSize * 2) * even;

    const corners = [
        fillGrid([gridSize - 1, s[1]], grid, gridSize - 1), // Top
        fillGrid([s[0], 0], grid, gridSize - 1), // Right
        fillGrid([0, s[1]], grid, gridSize - 1), // Bottom
        fillGrid([s[0], gridSize - 1], grid, gridSize - 1), // Left
    ].reduce((acc, item) => acc + item, 0);

    const smalls =
        [
            fillGrid([gridSize - 1, 0], grid, Math.floor(gridSize / 2) - 1), // Top-right
            fillGrid([gridSize - 1, gridSize - 1], grid, Math.floor(gridSize / 2) - 1), // Top-left
            fillGrid([0, 0], grid, Math.floor(gridSize / 2) - 1), // Bottom-right
            fillGrid([0, gridSize - 1], grid, Math.floor(gridSize / 2) - 1), // Bottom-left
        ].reduce((acc, item) => acc + item, 0) *
        (gridWidth + 1);

    const larges =
        [
            fillGrid([gridSize - 1, 0], grid, Math.floor((gridSize * 3) / 2) - 1), // Top-right
            fillGrid([gridSize - 1, gridSize - 1], grid, Math.floor((gridSize * 3) / 2) - 1), // Top-left
            fillGrid([0, 0], grid, Math.floor((gridSize * 3) / 2) - 1), // Bottom-right
            fillGrid([0, gridSize - 1], grid, Math.floor((gridSize * 3) / 2) - 1), // Bottom-left
        ].reduce((acc, item) => acc + item, 0) * gridWidth;

    return odds + evens + corners + smalls + larges;
}

// test("example-1", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 6);
//     const expected = 16;
//     expect(actual).toBe(expected);
// });

// test("example-2", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 10);
//     const expected = 50;
//     expect(actual).toBe(expected);
// });
//
// test("example-3", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 50);
//     const expected = 1594;
//     expect(actual).toBe(expected);
// });
//
// test("example-4", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 100);
//     const expected = 6536;
//     expect(actual).toBe(expected);
// });

// test("example-5", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 500);
//     const expected = 167004;
//     expect(actual).toBe(expected);
// });
//
// test("example-6", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 1000);
//     const expected = 668697;
//     expect(actual).toBe(expected);
// });
//
// test("example-7", async () => {
//     const file = Bun.file(`${import.meta.dir}/example.txt`);
//     const input = await file.text();
//
//     const actual = solution(input, 5000);
//     const expected = 16733044;
//     expect(actual).toBe(expected);
// });

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input, 26_501_365);
    const expected = 621494544278648;
    expect(actual).toBe(expected);
});
