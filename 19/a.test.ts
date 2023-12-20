import { expect, test } from "bun:test";

function solution(input: string) {
    const [workflowsString, partsString] = input.split("\n\n");
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

    const parts = partsString.split("\n").map((line) => {
        const [x, m, a, s] = line
            .slice(1, -1)
            .split(",")
            .map((p) => Number(p.slice(2)));
        return { x, m, a, s };
    });

    let ans = 0;
    for (const part of parts) {
        let workflowKey = "in";
        while (true) {
            if (workflowKey === "A") {
                ans += part.x + part.m + part.a + part.s;
                break;
            }
            if (workflowKey === "R") {
                break;
            }
            const workflow = workflows[workflowKey];
            const rules = workflow[0];

            let nextWorkflowKey;
            for (const rule of rules) {
                const cond = eval(`${part[rule[0]]} ${rule[1]} ${rule[2]}`);
                if (cond) {
                    nextWorkflowKey = rule[3];
                    break;
                }
            }
            workflowKey = nextWorkflowKey ?? workflow[1];
        }
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 19114;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 330820;
    expect(actual).toBe(expected);
});
