import { expect, test } from "bun:test";

type Maze = string[];
type Point = { row: number; col: number };
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
    const maze = input.split("\n");
    const startPosition = findStartPosition(maze);
    const queue = [startPosition];
    const loop = new Set([pointToString(startPosition)]);
    let possibleS: Pipe[] = ["|", "-", "L", "J", "7", "F"];

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

            if ("|F7".includes(nextPipe) && !loop.has(key)) {
                queue.push(next);
                loop.add(key);

                if (tile === "S") {
                    possibleS = possibleS.filter((pipe) => "|JL".includes(pipe));
                }
            }
        }
        if (point.row < maze.length - 1 && "S|F7".includes(tile)) {
            const next = { row: point.row + 1, col: point.col };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);

            if ("|JL".includes(nextPipe) && !loop.has(key)) {
                queue.push(next);
                loop.add(key);

                if (tile === "S") {
                    possibleS = possibleS.filter((pipe) => "|F7".includes(pipe));
                }
            }
        }
        if (point.col > 0 && "S-J7".includes(tile)) {
            const next = { row: point.row, col: point.col - 1 };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);

            if ("-LF".includes(nextPipe) && !loop.has(key)) {
                queue.push(next);
                loop.add(key);

                if (tile === "S") {
                    possibleS = possibleS.filter((pipe) => "-J7".includes(pipe));
                }
            }
        }
        if (point.col < maze[point.row].length - 1 && "S-FL".includes(tile)) {
            const next = { row: point.row, col: point.col + 1 };
            const nextPipe = maze[next.row][next.col];
            const key = pointToString(next);

            if ("-J7".includes(nextPipe) && !loop.has(key)) {
                queue.push(next);
                loop.add(key);

                if (tile === "S") {
                    possibleS = possibleS.filter((pipe) => "-FL".includes(pipe));
                }
            }
        }
    }

    const [S] = possibleS;
    for (let i = 0; i < maze.length; i++) {
        maze[i] = maze[i].replace("S", S);
    }

    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            const key = pointToString({ row: i, col: j });
            if (!loop.has(key)) {
                maze[i] = `${maze[i].slice(0, j)}.${maze[i].slice(j + 1)}`;
            }
        }
    }

    const outside = new Set();

    for (let i = 0; i < maze.length; i++) {
        let within = false;
        let up = null;

        for (let j = 0; j < maze[i].length; j++) {
            const tile = maze[i][j];

            if (tile === "|") {
                if (up !== null) throw new Error("Unexpected pipe");
                within = !within;
            } else if (tile === "-") {
                if (up === null) throw new Error("Unexpected pipe");
            } else if ("LF".includes(tile)) {
                if (up !== null) throw new Error("Unexpected pipe");
                up = tile === "L";
            } else if ("J7".includes(tile)) {
                if (up === null) throw new Error("Unexpected pipe");
                if (tile !== (up ? "J" : "7")) {
                    within = !within;
                }
                up = null;
            } else if (tile === ".") {
                // Do nothing
            } else {
                throw new Error(`Unexpected tile: ${tile}`);
            }

            if (!within) {
                outside.add(pointToString({ row: i, col: j }));
            }
        }
    }

    return maze.length * maze[0].length - new Set([...loop, ...outside]).size;
}

test("example-b-1", async () => {
    const file = Bun.file(`${import.meta.dir}/example-b-1.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 4;
    expect(actual).toBe(expected);
});

test("example-b-2", async () => {
    const file = Bun.file(`${import.meta.dir}/example-b-2.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 4;
    expect(actual).toBe(expected);
});

test("example-b-3", async () => {
    const file = Bun.file(`${import.meta.dir}/example-b-3.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 8;
    expect(actual).toBe(expected);
});

test("example-b-4", async () => {
    const file = Bun.file(`${import.meta.dir}/example-b-4.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 10;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 453;
    expect(actual).toBe(expected);
});
