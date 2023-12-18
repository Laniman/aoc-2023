import { expect, test } from "bun:test";

const directions = {
    U: [-1, 0],
    D: [1, 0],
    R: [0, 1],
    L: [0, -1],
};

// for A formula: https://en.wikipedia.org/wiki/Shoelace_formula
// for i formula: https://en.wikipedia.org/wiki/Pick%27s_theorem
function solution(input: string) {
    const lines = input.split("\n").map((line) => line.split(" ") as ["U" | "D" | "R" | "L", string, string]);

    let b = 0;
    const points: [number, number][] = [[0, 0]];
    for (const line of lines) {
        const [direction, distanceString] = line;
        const distance = Number(distanceString);
        b += distance;
        const [dr, dc] = directions[direction];
        const last = points.at(-1);
        if (!last) throw new Error("Unexpected");
        const [r, c] = last;
        points.push([r + dr * distance, c + dc * distance]);
    }

    let A = 0;
    for (let i = 0; i < points.length; i++) {
        const prev = points.at(i - 1);
        if (!prev) throw new Error("Unexpected");
        A += points[i][0] * (prev[1] - points[(i + 1) % points.length][1]);
    }
    A = Math.abs(A) / 2;
    const i = A - b / 2 + 1;
    return i + b;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 62;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 48652;
    expect(actual).toBe(expected);
});
