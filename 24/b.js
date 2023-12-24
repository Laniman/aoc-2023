import assert from "node:assert";
import fs from "node:fs";
import { test } from "node:test";
import { init } from "z3-solver";

async function solution(input) {
    const hailstones = input.split("\n").map((line) => {
        const [coordsString, velocityString] = line.split("@");
        const [x, y, z] = coordsString.split(",").map(Number);
        const [vx, vy, vz] = velocityString.split(",").map(Number);
        return { x, y, z, vx, vy, vz };
    });

    const { Context } = await init();
    const { Real, Solver } = Context("main");

    const x = Real.const("x");
    const y = Real.const("y");
    const z = Real.const("z");

    const vx = Real.const("vx");
    const vy = Real.const("vy");
    const vz = Real.const("vz");

    const solver = new Solver();

    for (const [i, hailstone] of hailstones.slice(0, 3).entries()) {
        const t = Real.const(`t${i}`);

        solver.add(t.ge(0));
        solver.add(x.add(vx.mul(t)).eq(t.mul(hailstone.vx).add(hailstone.x)));
        solver.add(y.add(vy.mul(t)).eq(t.mul(hailstone.vy).add(hailstone.y)));
        solver.add(z.add(vz.mul(t)).eq(t.mul(hailstone.vz).add(hailstone.z)));
    }

    const sat = await solver.check();

    if (sat !== "sat") throw new Error("Unexpected");

    const model = solver.model();
    const rx = Number(model.eval(x));
    const ry = Number(model.eval(y));
    const rz = Number(model.eval(z));

    return rx + ry + rz;
}

test("example", async () => {
    const input = fs.readFileSync(`${import.meta.dirname}/example.txt`, "utf8");
    const actual = await solution(input);
    const expected = 47;
    assert.strictEqual(actual, expected);
});

test("puzzle input", async () => {
    const input = fs.readFileSync(`${import.meta.dirname}/input.txt`, "utf8");
    const actual = await solution(input);
    const expected = 849377770236905;
    assert.strictEqual(actual, expected);
});
