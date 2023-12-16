import { expect, test } from "bun:test";

function toKey([r, c, dr, dc]: [number, number, number, number]): string {
    return `${r},${c},${dr},${dc}`;
}

function count(grid: string[], [r, c, dr, dc]: [number, number, number, number]): number {
    const queue = [[r, c, dr, dc]];
    const visited = new Set<string>();

    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) throw new Error("Unexpected value");

        let [r, c, dr, dc] = current;
        r += dr;
        c += dc;

        if (r < 0 || r >= grid.length || c < 0 || c >= grid[r].length) continue;

        const ch = grid[r][c];
        const key = toKey([r, c, dr, dc]);

        if (ch === "." || (ch === "-" && dc !== 0) || (ch === "|" && dr !== 0)) {
            if (!visited.has(key)) {
                visited.add(key);
                queue.push([r, c, dr, dc]);
            }
        } else if (ch === "/") {
            [dr, dc] = [-dc, -dr];
            if (!visited.has(key)) {
                visited.add(key);
                queue.push([r, c, dr, dc]);
            }
        } else if (ch === "\\") {
            [dr, dc] = [dc, dr];
            const key = toKey([r, c, dr, dc]);
            if (!visited.has(key)) {
                visited.add(key);
                queue.push([r, c, dr, dc]);
            }
        } else {
            const dirs =
                ch === "|"
                    ? [
                          [-1, 0],
                          [1, 0],
                      ]
                    : [
                          [0, 1],
                          [0, -1],
                      ];
            for (const [dr, dc] of dirs) {
                const key = toKey([r, c, dr, dc]);
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push([r, c, dr, dc]);
                }
            }
        }
    }

    const energized = new Set<string>();
    for (const key of visited) {
        const [r, c] = key.split(",").map(Number);
        energized.add(`${r},${c}`);
    }
    return energized.size;
}

function solution(input: string) {
    const grid = input.split("\n");
    let max = 0;
    for (let i = 0; i < grid.length; i++) {
        max = Math.max(max, count(grid, [i, -1, 0, 1]));
        max = Math.max(max, count(grid, [i, grid[i].length, 0, -1]));
    }
    for (let j = 0; j < grid[0].length; j++) {
        max = Math.max(max, count(grid, [-1, j, 1, 0]));
        max = Math.max(max, count(grid, [grid.length, j, -1, 0]));
    }
    return max;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 51;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 9064;
    expect(actual).toBe(expected);
});
