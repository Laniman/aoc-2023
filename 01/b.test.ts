import { expect, test } from "bun:test";

const digit = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
};

const startsWith = (str: string, pos: number): number | null => {
    for (const key in digit) {
        if (str.startsWith(key, pos)) {
            return digit[key];
        }
    }
    return null;
};

const endsWith = (str: string, pos: number): number | null => {
    for (const key in digit) {
        if (str.endsWith(key, pos)) {
            return digit[key];
        }
    }
    return null;
};

function solution(input: string) {
    const lines = input.split("\n");

    const ans = lines.reduce((acc, line) => {
        let i = 0;
        let j = line.length - 1;
        let d = "";
        while (i < line.length) {
            const symb = line[i];
            const num = startsWith(line, i);
            if (symb >= "0" && symb <= "9") {
                d += symb;
                break;
            }
            if (num) {
                d += num;
                break;
            }
            i++;
        }
        while (j > -1) {
            const symb = line[j];
            const num = endsWith(line, j + 1);
            if (symb >= "0" && symb <= "9") {
                d += symb;
                break;
            }
            if (num) {
                d += num;
                break;
            }
            j--;
        }
        return acc + Number(d);
    }, 0);

    return ans;
}

test("example-b", async () => {
    const file = Bun.file("./01/example-b.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 281;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file("./01/input.txt");
    const input = await file.text();

    const actual = solution(input);
    const expected = 54249;
    expect(actual).toBe(expected);
});
