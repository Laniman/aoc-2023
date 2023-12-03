import { expect, test } from "bun:test";

const directions = [
    [-1, 0],
    [-1, 1],
    [-1, -1],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, 0],
    [1, -1],
];

const getNeighbors = (grid: string[], x: number, y: number): string[] => {
    return directions
        .map(([dx, dy]) => [x + dx, y + dy])
        .filter(([x, y]) => x >= 0 && x < grid[0].length && y >= 0 && y < grid.length)
        .map(([x, y]) => grid[y][x]);
};

function solution(input: string) {
    const lines = input.split("\n");
    let ans = 0;
    let j = 0;
    for (const line of lines) {
        let digit = "";
        let pos = null;
        let i = 0;
        for (const char of line) {
            if (char >= "0" && char <= "9") {
                digit += char;
                if (pos === null) {
                    pos = i;
                }
            }

            if (char > "9" || char < "0" || i === line.length - 1) {
                if (digit.length > 0) {
                    if (pos !== null) {
                        for (let xi = pos; xi < pos + digit.length; xi++) {
                            const neighbors = getNeighbors(lines, xi, j);
                            const symbols = neighbors.filter((n) => n !== "." && (n > "9" || n < "0"));

                            if (symbols.length > 0) {
                                ans += Number(digit);
                                break;
                            }
                        }
                    }
                }
                digit = "";
                pos = null;
            }
            i++;
        }
        j++;
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file("./03/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 4361;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./03/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 527144;
    expect(actual).toBe(expected);
});
