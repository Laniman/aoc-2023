import { expect, test } from "bun:test";

class Module {
    name: string;
    type: "%" | "&";
    outputs: string[];
    memory: "off" | "on" | Record<string, "low" | "high">;

    constructor(name: string, type: "%" | "&", outputs: string[]) {
        this.name = name;
        this.type = type;
        this.outputs = outputs;

        if (type === "%") {
            this.memory = "off";
        } else {
            this.memory = {};
        }
    }
}

function findLCMArray(arr: number[]): number {
    const findGCD = (a: number, b: number): number => (b === 0 ? a : findGCD(b, a % b));
    const findLCM = (a: number, b: number): number => (a * b) / findGCD(a, b);

    return arr.reduce((lcm, num) => findLCM(lcm, num), arr[0]);
}

function solution(input: string) {
    const lines = input.split("\n");
    const modules: Record<string, Module> = {};
    const broadcastTargets: string[] = [];

    for (const line of lines) {
        const [left, right] = line.split(" -> ");
        const outputs = right.split(", ");

        if (left === "broadcaster") {
            broadcastTargets.push(...outputs);
        } else {
            const type = left[0] as "%" | "&";
            const name = left.slice(1);
            modules[name] = new Module(name, type, outputs);
        }
    }

    for (const modulesKey in modules) {
        const module = modules[modulesKey];

        for (const output of module.outputs) {
            const outputModule = modules[output];

            if (output in modules && outputModule.type === "&") {
                const mem = outputModule.memory;

                if (typeof mem === "string") throw new Error("Unexpected");

                mem[modulesKey] = "low";
            }
        }
    }

    const possibleFeed = Object.entries(modules).find(([name, module]) => module.outputs.includes("rx"));

    if (!possibleFeed) throw new Error("Unexpected");

    const [feed] = possibleFeed;
    const cycleLengths: Record<string, number> = {};
    let presses = 0;

    const seen = Object.entries(modules).reduce<Record<string, number>>((acc, [name, module]) => {
        if (module.outputs.includes(feed)) {
            acc[name] = 0;
        }
        return acc;
    }, {});

    while (true) {
        presses += 1;
        const queue = broadcastTargets.map(
            (target) => ["broadcaster", target, "low"] as [string, string, "low" | "high"],
        );

        while (queue.length > 0) {
            const cur = queue.shift();

            if (!cur) throw new Error("Unexpected queue");

            const [from, to, pulse] = cur;

            if (!(to in modules)) {
                continue;
            }

            const module = modules[to];

            if (module.name === feed && pulse === "high") {
                seen[from] += 1;

                if (!(from in cycleLengths)) {
                    cycleLengths[from] = presses;
                } else {
                    if (presses !== seen[from] * cycleLengths[from]) {
                        throw new Error("Unexpected");
                    }
                }

                if (Object.values(seen).every((n) => n > 0)) {
                    return findLCMArray(Object.values(cycleLengths));
                }
            }

            if (module.type === "%") {
                if (pulse === "low") {
                    module.memory = module.memory === "off" ? "on" : "off";
                    const out = module.memory === "on" ? "high" : "low";

                    for (const output of module.outputs) {
                        queue.push([module.name, output, out]);
                    }
                }
            } else {
                const mem = module.memory;

                if (typeof mem === "string") throw new Error("Unexpected");

                mem[from] = pulse;
                const out = Object.values(module.memory).every((m) => m === "high") ? "low" : "high";

                for (const output of module.outputs) {
                    queue.push([module.name, output, out]);
                }
            }
        }
    }
}

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 247702167614647;
    expect(actual).toBe(expected);
});
