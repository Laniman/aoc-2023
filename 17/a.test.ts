import { expect, test } from "bun:test";

function toKey<T>(value: T[]): string {
    return value.join(",");
}

const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
];

function insertInQueue<T extends number[]>(sortedArray: T[], element: T) {
    let low = 0;
    let high = sortedArray.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        const midPriority = sortedArray[mid][0];
        const insertPriority = element[0];
        if (midPriority === insertPriority) {
            sortedArray.splice(mid + 1, 0, element);
            return;
        }

        if (midPriority > insertPriority) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    sortedArray.splice(low, 0, element);
}

function solution(input: string) {
    const grid = input.split("\n").map((line) => line.split("").map(Number));
    const start: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];
    const queue = [start];
    const visited = new Set<string>();

    while (queue.length) {
        const value = queue.pop();
        if (!value) throw new Error("Unexpected value");
        const [heat, r, c, dr, dc, steps] = value;
        const key = toKey([r, c, dr, dc, steps]);

        if (r === grid.length - 1 && c === grid[0].length - 1) {
            return heat;
        }

        if (visited.has(key)) continue;

        visited.add(key);

        const isStand = dr === 0 && dc === 0;
        if (steps < 3 && !isStand) {
            const nr = r + dr;
            const nc = c + dc;
            if (0 <= nr && nr < grid.length && 0 <= nc && nc < grid[0].length) {
                insertInQueue(queue, [heat + grid[nr][nc], nr, nc, dr, dc, steps + 1]);
            }
        }

        for (const [ndr, ndc] of directions) {
            const isSameDirection = dr === ndr && dc === ndc;
            const isNegativeDirection = -dr === ndr && -dc === ndc;
            if (!isSameDirection && !isNegativeDirection) {
                const nr = r + ndr;
                const nc = c + ndc;
                if (0 <= nr && nr < grid.length && 0 <= nc && nc < grid[0].length) {
                    insertInQueue(queue, [heat + grid[nr][nc], nr, nc, ndr, ndc, 1]);
                }
            }
        }
    }
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 102;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 902;
    expect(actual).toBe(expected);
});
