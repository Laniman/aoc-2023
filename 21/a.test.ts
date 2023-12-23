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

function fromKey(k: string): [number, number] {
    return k.split(",").map(Number).slice(0, 2) as [number, number];
}

function solution(input: string, steps: number) {
    const grid = input.split("\n");

    let s: [number, number] | undefined;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
            if (grid[i][j] === "S") {
                s = [i, j];
            }
        }
    }

    if (!s) throw new Error("Unexpected");

    const queue = new Set([toKey(s)]);

    for (let step = 1; step <= steps; step++) {
        const copyQueue = new Set(queue);
        queue.clear();

        for (const key of copyQueue) {
            const [r, c] = fromKey(key);

            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid.length) {
                    continue;
                }

                if (grid[nr][nc] === "#") {
                    continue;
                }

                queue.add(toKey([nr, nc]));
            }
        }
    }

    return queue.size;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input, 6);
    const expected = 16;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input, 64);
    const expected = 3758;
    expect(actual).toBe(expected);
});
