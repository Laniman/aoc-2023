import { expect, test } from "bun:test";

type Maze = (Pipe | Ground | Animal)[][];
type Point = { row: number; col: number };
type Ground = ".";
type Animal = "S";
type Pipe = "|" | "-" | "L" | "J" | "7" | "F";

function pointToString(point: Point): string {
    return `(${point.row},${point.col})`;
}

function findStartPosition(maze: Maze): Point {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            const t = maze[i];
            if (maze[i][j] === "S") {
                return { row: i, col: j };
            }
        }
    }

    throw new Error("No start position found");
}

function solution(input: string) {
    const maze = input.split("\n").map((line) => line.split("")) as Maze;
    const startPosition = findStartPosition(maze);
    const queue = [startPosition];
    const visited = new Set([pointToString(startPosition)]);

    while (queue.length > 0) {
        const point = queue.shift();
        if (!point) {
            throw new Error("Unexpected undefined");
        }
        const tile = maze[point.row][point.col];

        if (point.row > 0 && "S|JL".includes(tile)) {
            const next = { row: point.row - 1, col: point.col };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);
            if ("|F7".includes(nextPipe) && !visited.has(key)) {
                queue.push(next);
                visited.add(key);
            }
        }
        if (point.row < maze.length - 1 && "S|F7".includes(tile)) {
            const next = { row: point.row + 1, col: point.col };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);
            if ("|JL".includes(nextPipe) && !visited.has(key)) {
                queue.push(next);
                visited.add(key);
            }
        }
        if (point.col > 0 && "S-J7".includes(tile)) {
            const next = { row: point.row, col: point.col - 1 };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);
            if ("-LF".includes(nextPipe) && !visited.has(key)) {
                queue.push(next);
                visited.add(key);
            }
        }
        if (point.col < maze[point.row].length - 1 && "S-FL".includes(tile)) {
            const next = { row: point.row, col: point.col + 1 };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);
            if ("-J7".includes(nextPipe) && !visited.has(key)) {
                queue.push(next);
                visited.add(key);
            }
        }
    }

    return Math.ceil(visited.size / 2);
}

test("example-a-1", async () => {
    const file = Bun.file(`${import.meta.dir}/example-a-1.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 4;
    expect(actual).toBe(expected);
});

test("example-a-2", async () => {
    const file = Bun.file(`${import.meta.dir}/example-a-2.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 4;
    expect(actual).toBe(expected);
});

test("example-a-3", async () => {
    const file = Bun.file(`${import.meta.dir}/example-a-3.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 8;
    expect(actual).toBe(expected);
});

test("example-a-4", async () => {
    const file = Bun.file(`${import.meta.dir}/example-a-4.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 8;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 6890;
    expect(actual).toBe(expected);
});
