import { expect, test } from "bun:test";

function toKey([r, c]: [number, number]): string {
    return `${r},${c}`;
}

function fromKey(k: string): [number, number] {
    return k.split(",").map(Number).slice(0, 2) as [number, number];
}

function solution(input: string) {
    const grid = input.split("\n");

    const start: [number, number] = [0, grid[0].indexOf(".")];
    const end: [number, number] = [grid.length - 1, grid[grid.length - 1].indexOf(".")];
    const forks = new Set([toKey(start), toKey(end)]);

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const ch = grid[r][c];

            if (ch === "#") continue;

            let neighbours = 0;

            for (const [dr, dc] of [
                [r, c + 1],
                [r, c - 1],
                [r + 1, c],
                [r - 1, c],
            ]) {
                if (dr < 0 || dr >= grid.length || dc < 0 || dc >= grid[0].length) {
                    continue;
                }

                if (grid[dr][dc] !== "#") {
                    neighbours += 1;
                }
            }

            if (neighbours >= 3) {
                forks.add(toKey([r, c]));
            }
        }
    }

    const graph: Record<string, Record<string, number>> = {};

    for (const key of forks) {
        graph[key] = {};
    }

    for (const key of forks) {
        const [r, c] = fromKey(key);
        const stack: [number, number, number][] = [[r, c, 0]];
        const seen = new Set([key]);

        while (stack.length > 0) {
            const stackItem = stack.pop();

            if (!stackItem) throw new Error("Unexpected false");

            const [r, c, n] = stackItem;

            if (n !== 0 && forks.has(toKey([r, c]))) {
                graph[key][toKey([r, c])] = n;
                continue;
            }

            for (const [dr, dc] of [
                [0, 1],
                [0, -1],
                [1, 0],
                [-1, 0],
            ]) {
                const nr = r + dr;
                const nc = c + dc;

                if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) {
                    continue;
                }

                const nextPointString = toKey([nr, nc]);

                if (grid[nr][nc] !== "#" && !seen.has(nextPointString)) {
                    stack.push([nr, nc, n + 1]);
                    seen.add(nextPointString);
                }
            }
        }
    }

    const seen = new Set();

    function dfs([r, c]: [number, number]) {
        if (r === start[0] && c === start[1]) return 0;

        const fromNodeString = toKey([r, c]);
        let max = Number.NEGATIVE_INFINITY;

        seen.add(fromNodeString);

        for (const nodeString in graph[fromNodeString]) {
            if (seen.has(nodeString)) continue;

            const [nr, nc] = fromKey(nodeString);
            const n = graph[fromNodeString][nodeString];
            max = Math.max(max, dfs([nr, nc]) + n);
        }

        seen.delete(fromNodeString);
        return max;
    }

    return dfs(end);
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 154;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 6646;
    expect(actual).toBe(expected);
});
