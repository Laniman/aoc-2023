import { expect, test } from "bun:test";

const parse = (input: string): [number, number, number][][] => {
    const lines = input.split("\n");
    return lines.map((line) => {
        return line
            .split(": ")[1]
            .split("; ")
            .map((item) => {
                return item.split(", ").reduce(
                    (acc, colorString) => {
                        const [amount, color] = colorString.split(" ");
                        if (color === "red") {
                            acc[0] += Number(amount);
                        } else if (color === "green") {
                            acc[1] += Number(amount);
                        } else if (color === "blue") {
                            acc[2] += Number(amount);
                        }
                        return acc;
                    },
                    [0, 0, 0] as [number, number, number],
                );
            });
    });
};

function solution(input: string) {
    const games = parse(input);

    const ans = games.reduce((acc, game, index) => {
        const minimal = game.reduce((acc, bucket) => {
            let colorIdx = 0;
            for (const n of bucket) {
                if (Math.max(n, acc[colorIdx]) === n) {
                    acc[colorIdx] = n;
                }
                colorIdx++;
            }
            return acc;
        });

        return minimal.reduce((acc, n) => acc * n, 1) + acc;
    }, 0);

    return ans;
}

test("example", async () => {
    const file = Bun.file("./02/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 2286;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./02/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 69629;
    expect(actual).toBe(expected);
});
