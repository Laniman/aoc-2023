import { expect, test } from "bun:test";

function count(cfg: string[], nums: number[]): number {
    if (cfg.length === 0) {
        return nums.length === 0 ? 1 : 0;
    }

    if (nums.length === 0) {
        return cfg.includes("#") ? 0 : 1;
    }

    let result = 0;

    if (".?".includes(cfg[0])) {
        result += count(cfg.slice(1), nums);
    }

    if ("#?".includes(cfg[0])) {
        const cond1 = nums[0] <= cfg.length;
        const cond2 = !cfg.slice(0, nums[0]).includes(".");
        const cond3 = nums[0] === cfg.length || cfg[nums[0]] !== "#";
        if (cond1 && cond2 && cond3) {
            result += count(cfg.slice(nums[0] + 1), nums.slice(1));
        }
    }

    return result;
}

function solution(input: string) {
    const records = input.split("\n").map((line) => {
        const [a, b] = line.split(" ");
        return [a.split(""), b.split(",").map(Number)] as const;
    });

    let ans = 0;
    for (const [config, numbers] of records) {
        const a = count(config, numbers);
        ans += a;
    }
    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 21;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 7110;
    expect(actual).toBe(expected);
});
