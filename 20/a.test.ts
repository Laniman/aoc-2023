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

    let low = 0;
    let high = 0;

    for (let i = 0; i < 1000; i++) {
        low += 1;

        const queue = broadcastTargets.map(
            (target) => ["broadcaster", target, "low"] as [string, string, "low" | "high"],
        );

        while (queue.length > 0) {
            const cur = queue.shift();

            if (!cur) throw new Error("Unexpected queue");
            const [from, to, pulse] = cur;

            if (pulse === "low") {
                low += 1;
            } else {
                high += 1;
            }

            if (!(to in modules)) {
                continue;
            }

            const module = modules[to];

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

    return low * high;
}

test("example-1", async () => {
    const file = Bun.file(`${import.meta.dir}/example-1.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 32000000;
    expect(actual).toBe(expected);
});

test("example-2", async () => {
    const file = Bun.file(`${import.meta.dir}/example-2.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 11687500;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 919383692;
    expect(actual).toBe(expected);
});
