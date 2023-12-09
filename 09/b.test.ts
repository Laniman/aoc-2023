import { expect, test } from "bun:test";

function solution(input: string) {
    const sequences = input.split("\n").map((line) => line.split(" ").map(Number));

    let ans = 0;

    for (const sequence of sequences) {
        const acc = [sequence];

        let last = acc[acc.length - 1];
        while (!last.every((el) => el === 0)) {
            const next = [];
            for (let i = 1; i < last.length; i++) {
                const el = last[i] - last[i - 1];
                next.push(el);
            }
            acc.push(next);
            last = next;
        }

        const acc1 = acc.map((el) => el[0]);
        const acc2 = [0];

        for (let i = acc1.length - 2; i >= 0; i--) {
            const next = acc1[i] - acc2[acc2.length - 1];
            acc2.push(next);
        }

        ans += acc2[acc2.length - 1];
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 2;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 925;

    expect(actual).toBe(expected);
});
