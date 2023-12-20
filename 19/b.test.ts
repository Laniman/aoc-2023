import { expect, test } from "bun:test";

function solution(input: string) {
    const [workflowsString] = input.split("\n\n");
    const workflows = workflowsString
        .split("\n")
        .reduce<Record<string, [["x" | "m" | "a" | "s", ">" | "<", number, string][], string]>>((acc, line) => {
            const [key, value] = line.split("{");
            const rules = value.slice(0, -1).split(",");
            const defaultDest = rules.pop();
            if (!defaultDest) {
                throw new Error("Unexpected");
            }
            acc[key] = [[], defaultDest];
            for (const rule of rules) {
                const [comparison, to] = rule.split(":");
                const category = comparison[0] as "x" | "m" | "a" | "s";
                const op = comparison[1] as ">" | "<";
                const n = Number(comparison.slice(2));
                acc[key][0].push([category, op, n, to]);
            }
            return acc;
        }, {});

    function count(ranges: Record<"x" | "m" | "a" | "s", [number, number]>, name: string) {
        if (name === "R") {
            return 0;
        }

        if (name === "A") {
            return Object.values(ranges).reduce((acc, [low, high]) => acc * (high - low + 1), 1);
        }

        const [rules, defaultDest] = workflows[name];
        let total = 0;
        const copyRanges = { ...ranges };

        for (const [key, op, n, to] of rules) {
            const [low, high] = copyRanges[key];
            let trueRange: [number, number];
            let falseRange: [number, number];

            if (op === ">") {
                trueRange = [n + 1, high];
                falseRange = [low, n];
            } else {
                trueRange = [low, n - 1];
                falseRange = [n, high];
            }

            if (trueRange[0] <= trueRange[1]) {
                total += count({ ...copyRanges, [key]: trueRange }, to);
            }
            if (falseRange[0] <= falseRange[1]) {
                copyRanges[key] = falseRange;
            } else {
                break;
            }
        }

        if (!rules.some(([key, cmp, n, target]) => ranges[key][0] > ranges[key][1])) {
            total += count(copyRanges, defaultDest);
        }

        return total;
    }

    return count({ x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }, "in");
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 167409079868000;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 123972546935551;
    expect(actual).toBe(expected);
});
