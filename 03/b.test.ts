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
    const neighbors = [];
    const visited = new Set();
    const isVisited = (x: number, y: number) => {
        return visited.has(`${x},${y}`);
    };
    const visit = (x: number, y: number) => {
        visited.add(`${x},${y}`);
    };

    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length) {
            if (isVisited(nx, ny)) {
                continue;
            }
            if (grid[ny][nx] >= "0" && grid[ny][nx] <= "9") {
                let pos = nx;
                while (
                    pos - 1 >= 0 &&
                    pos - 1 < grid[0].length &&
                    grid[ny][pos - 1] >= "0" &&
                    grid[ny][pos - 1] <= "9"
                ) {
                    pos -= 1;
                }
                let digit = "";
                while (pos >= 0 && pos < grid[0].length && grid[ny][pos] >= "0" && grid[ny][pos] <= "9") {
                    digit += grid[ny][pos];
                    pos += 1;
                    visit(pos, ny);
                }
                neighbors.push(digit);
            }
        }
    }

    return neighbors;
};

function solution(input: string) {
    const lines = input.split("\n");
    let ans = 0;

    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].length; j++) {
            const char = lines[i][j];
            if (char !== "*") {
                continue;
            }

            const neighbors = getNeighbors(lines, j, i);
            if (neighbors.length > 1) {
                ans += neighbors.reduce((a, b) => a * Number(b), 1);
            }
        }
    }

    return ans;
}

test("example", async () => {
    const file = Bun.file("./03/example.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 467835;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./03/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 81463996;
    expect(actual).toBe(expected);
});
