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
    const current = Object.keys(graph).filter((key) => key.endsWith("A"));
    const history = new Map();
    while (!current.every((key) => key.endsWith("Z"))) {
        for (const dir of instruction) {
            if (current.every((key) => key.endsWith("Z"))) {
                return ans;
            }

            for (let i = 0; i < current.length; i++) {
                const key = current[i];
                let next;
                if (dir === "R") {
                    next = graph[key][1];
                } else {
                    next = graph[key][0];
                }
                current[i] = next;

                if (next.endsWith("Z")) {
                    const val = history.get(i);
                    if (!val) {
                        history.set(i, [ans]);
                    } else if (Array.isArray(val)) {
                        history.set(i, ans - val[0]);
                    }
                }
            }

            ans += 1;
        }

        const numbers = Array.from(history.values());
        if (numbers.length > 0 && numbers.every((val) => typeof val === "number")) {
            function findLCMArray(arr: number[]): number {
                const findGCD = (a: number, b: number): number => (b === 0 ? a : findGCD(b, a % b));
                const findLCM = (a: number, b: number): number => (a * b) / findGCD(a, b);

                return arr.reduce((lcm, num) => findLCM(lcm, num), arr[0]);
            }

            return findLCMArray(numbers);
        }
    }

    return ans;
}

test("example-3", async () => {
    const file = Bun.file(`${import.meta.dir}/example-3.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 6;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 16342438708751;
    expect(actual).toBe(expected);
});
