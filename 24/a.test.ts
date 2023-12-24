import { expect, test } from "bun:test";

function solution(input: string, [boundA, boundB]: [number, number]) {
    const hailstones = input.split("\n").map((line) => {
        const [coordsString, velocityString] = line.split("@");
        const [x, y, z] = coordsString.split(",").map(Number);
        const [vx, vy, vz] = velocityString.split(",").map(Number);
        return { x, y, z, vx, vy, vz, a: vy, b: -vx, c: vy * x - vx * y };
    });

    let ans = 0;

    for (let i = 0; i < hailstones.length; i++) {
        for (let j = 0; j < i; j++) {
            const { a: a1, b: b1, c: c1 } = hailstones[i];
            const { a: a2, b: b2, c: c2 } = hailstones[j];

            if (a1 * b2 === b1 * a2) continue;

            const x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
            const y = (c2 * a1 - c1 * a2) / (a1 * b2 - a2 * b1);

            if (boundA <= x && x <= boundB && boundA <= y && y <= boundB) {
                const hasSameVelocitySign = [hailstones[i], hailstones[j]].every((hs) => {
                    return Math.sign(x - hs.x) === Math.sign(hs.vx) && Math.sign(y - hs.y) === Math.sign(hs.vy);
                });

                if (hasSameVelocitySign) {
                    ans += 1;
                }
            }
        }
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input, [7, 27]);
    const expected = 2;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input, [200000000000000, 400000000000000]);
    const expected = 19976;
    expect(actual).toBe(expected);
});
