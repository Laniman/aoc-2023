import { expect, test } from "bun:test";

function solution(input: string) {
  const lines = input.split("\n");
  const ans = lines.reduce((acc, line) => {
    let i = 0;
    let j = line.length - 1;
    let d = '';
    while (i < line.length) {
      const symb = line[i];
      if (symb >= '0' && symb <= '9') {
          d += symb;
          break;
      } else {
        i++;
      }
    }
    while (j < line.length) {
      const symb = line[j];
      if (symb >= '0' && symb <= '9') {
        d += symb;
        break;
      } else {
        j--;
      }
    }
    return acc + Number(d);
  } ,0);

  return ans;
}

test("example-a", async () => {
  const file = Bun.file("./01/example-a.txt");
  const input = await file.text();

  const actual = solution(input);
  const expected = 142;
  expect(actual).toBe(expected);
});

test("puzzle input", async () => {
  const file = Bun.file("./01/input.txt");
  const input = await file.text();

  const actual = solution(input);
  const expected = 53194;
  expect(actual).toBe(expected);
});
