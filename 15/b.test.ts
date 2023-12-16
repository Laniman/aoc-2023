import { expect, test } from "bun:test";

function hash(s: string): number {
    let value = 0;
    for (const ch of s) {
        value += ch.charCodeAt(0);
        value *= 17;
        value %= 256;
    }
    return value;
}

function solution(input: string) {
    const sequences: string[] = input.split(",");
    const boxes: (string[] | undefined)[] = [];
    const byLabel: Record<string, number> = {};

    for (const sequence of sequences) {
        if (sequence.includes("-")) {
            const label = sequence.slice(0, -1);
            const index = hash(label);
            const box = boxes[index];
            if (box) {
                const i = box.findIndex((l) => l === label);
                if (i !== -1) {
                    box.splice(i, 1);
                }
            }
        } else {
            const [label, focalString] = sequence.split("=");
            const focal = Number(focalString);
            const index = hash(label);
            const box = boxes[index];
            byLabel[label] = focal;
            if (box) {
                const i = box.findIndex((l) => l === label);
                if (i === -1) {
                    box.push(label);
                } else {
                    box.splice(i, 1, label);
                }
            } else {
                boxes[index] = [label];
            }
        }
    }

    let ans = 0;
    for (let i = 0; i < 255; i++) {
        const box = boxes[i];
        if (!box) continue;
        for (let j = 0; j < box.length; j++) {
            const s = (i + 1) * (j + 1) * byLabel[box[j]];
            ans += s;
        }
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 145;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 290779;
    expect(actual).toBe(expected);
});
