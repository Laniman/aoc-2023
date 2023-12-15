import { expect, test } from "bun:test";

function zip<T>(arr: T[][]): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr[0].length; i++) {
        result.push(arr.map((a) => a[i]));
    }
    return result;
}

function solution(input: string) {
    let grid = input.split("\n").map((line) => line.split(""));

    const key = JSON.stringify(grid);
    const seen = new Set<string>(key);
    const prev = [key];

    function cycle() {
        for (let i = 0; i < 4; i++) {
            const zipped = zip(grid)
                .map((col) => col.join(""))
                .map((col) => {
                    const split = col.split("#").map((c) => c.split(""));
                    for (const seg of split) {
                        seg.sort((a, b) => (a < b ? 1 : -1));
                    }
                    return split
                        .map((seg) => seg.join(""))
                        .join("#")
                        .split("");
                });
            grid = zipped.map((x) => x.reverse());
        }
    }

    let i = 0;
    while (true) {
        i += 1;
        cycle();
        const key = JSON.stringify(grid);
        if (seen.has(key)) {
            break;
        }
        seen.add(key);
        prev.push(key);
    }

    const first = prev.indexOf(JSON.stringify(grid));
    const gridString = prev[first + ((1_000_000_000 - first) % (i - first))];
    grid = JSON.parse(gridString);

    let ans = 0;
    for (let i = 0; i < grid.length; i++) {
        const j = grid.length - i;
        const count = grid[i].filter((c) => c === "O").length;
        ans += count * j;
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 64;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 96003;
    expect(actual).toBe(expected);
});
