import { expect, test } from "bun:test";

function solution(input: string) {
    const [instruction, graphString] = input.split("\n\n");
    const graph = Object.fromEntries(
        graphString.split("\n").map((line) => {
            const [key, value] = line.split(" = ");
            const matcher = value.match(/\w+/g);
            if (!matcher) throw new Error("Wrong input");
            return [key, matcher];
        }),
    );

    let ans = 0;
    let current = "AAA";

    while (current !== "ZZZ") {
        for (const dir of instruction) {
            if (current === "ZZZ") {
                return ans;
            }

            if (dir === "R") {
                current = graph[current][1];
            } else {
                current = graph[current][0];
            }

            ans += 1;
        }
    }

    return ans;
}

test("example-1", async () => {
    const file = Bun.file(`${import.meta.dir}/example-1.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 2;
    expect(actual).toBe(expected);
});

test("example-2", async () => {
    const file = Bun.file(`${import.meta.dir}/example-2.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 6;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 19951;

    expect(actual).toBe(expected);
});
