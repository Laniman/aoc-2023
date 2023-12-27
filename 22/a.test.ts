import { expect, test } from "bun:test";

type Brick = [startX: number, startY: number, startZ: number, endX: number, endY: number, endZ: number];

function byAscZ([, , sz1, , , ez1]: Brick, [, , sz2, , , ez2]: Brick) {
    return Math.min(sz1, ez1) - Math.min(sz2, ez2);
}

function overlaps([sx1, sy1, , ex1, ey1]: Brick, [sx2, sy2, , ex2, ey2]: Brick) {
    return Math.max(sx1, sx2) <= Math.min(ex1, ex2) && Math.max(sy1, sy2) <= Math.min(ey1, ey2);
}

function solution(input: string) {
    const bricks = input.split("\n").map((line) => {
        return line.replace("~", ",").split(",").map(Number) as Brick;
    });

    bricks.sort(byAscZ);

    for (const [index, brick] of bricks.entries()) {
        let maxZ = 1;

        for (const check of bricks.slice(0, index)) {
            if (overlaps(check, brick)) {
                maxZ = Math.max(maxZ, check[5] + 1);
            }
        }

        brick[5] -= brick[2] - maxZ;
        brick[2] = maxZ;
    }

    bricks.sort(byAscZ);

    const brickSupportedBy = Array.from({ length: bricks.length }, () => new Set<number>());
    const brickSupports = Array.from({ length: bricks.length }, () => new Set<number>());

    for (const [i, upper] of bricks.entries()) {
        for (const [j, lower] of bricks.slice(0, i).entries()) {
            if (overlaps(lower, upper) && upper[2] === lower[5] + 1) {
                brickSupportedBy[j].add(i);
                brickSupports[i].add(j);
            }
        }
    }

    let ans = 0;

    for (const i of bricks.keys()) {
        const supportedByCurrent = [...brickSupportedBy[i]];

        if (supportedByCurrent.every((j) => brickSupports[j].size >= 2)) {
            ans += 1;
        }
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 5;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 432;
    expect(actual).toBe(expected);
});
