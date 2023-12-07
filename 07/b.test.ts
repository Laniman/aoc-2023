import { expect, test } from "bun:test";

const charMap = (s: string): Map<string, number> => {
    const memo = new Map<string, number>();
    for (const char of s.split("")) {
        const amount = memo.get(char);
        memo.set(char, amount ? amount + 1 : 1);
    }
    return memo;
};

const handByType = {
    "five-of-a-kind": (s: string): boolean => {
        const map = charMap(s);
        const jokerCount = map.get("J");

        if (!jokerCount || jokerCount === 5) {
            return map.size === 1;
        }

        const hasFive = Array.from(map.entries()).some(([key, amount]) => amount + jokerCount === 5);
        return map.size === 2 && hasFive;
    },
    "four-of-a-kind": (s: string): boolean => {
        const map = charMap(s);
        const jokerCount = map.get("J");

        if (!jokerCount) {
            const hasFour = Array.from(map.values()).some((amount) => amount === 4);
            return map.size === 2 && hasFour;
        }

        const hasFour = Array.from(map.values()).some((amount) => amount + jokerCount === 4);
        return map.size === 3 && hasFour;
    },
    "full-house": (s: string): boolean => {
        const map = charMap(s);
        const jokerCount = map.get("J");

        if (!jokerCount) {
            const hasThree = Array.from(map.values()).some((amount) => amount === 3);
            return map.size === 2 && hasThree;
        }

        const hasThree = Array.from(map.entries()).some(([key, amount]) => amount + jokerCount === 3);
        return map.size === 3 && hasThree;
    },
    "three-of-a-kind": (s: string): boolean => {
        const map = charMap(s);
        const jokerCount = map.get("J");

        if (!jokerCount) {
            const hasThree = Array.from(map.values()).some((amount) => amount === 3);
            return map.size === 3 && hasThree;
        }

        const hasThree = Array.from(map.entries()).some(([key, amount]) => amount + jokerCount === 3);
        return map.size === 4 && hasThree;
    },
    "two-pair": (s: string): boolean => {
        const map = charMap(s);
        const jokerCount = map.get("J");

        if (!jokerCount) {
            const hasTwo = Array.from(map.values()).some((value) => value === 2);
            return map.size === 3 && hasTwo;
        }

        const hasTwo = Array.from(map.entries()).some(([key, amount]) => amount + jokerCount === 2);
        return map.size === 4 && hasTwo;
    },
    "one-pair": (s: string): boolean => {
        const map = charMap(s);
        const jokerCount = map.get("J");

        if (!jokerCount) {
            const hasTwo = Array.from(map.values()).some((value) => value === 2);
            return map.size === 4 && hasTwo;
        }

        const hasTwo = Array.from(map.values()).some((value) => value + jokerCount === 2);
        return map.size === 5 && hasTwo;
    },
    high: (s: string): boolean => {
        const map = charMap(s);
        return map.size === 5;
    },
};

const order = "AKQT98765432J";

function solution(input: string) {
    const hands = input.split("\n").map((line) => {
        const [hand, scoreString] = line.split(" ");
        return [hand, Number(scoreString)] as const;
    });

    const indexByType = Object.fromEntries(Object.entries(handByType).map(([key, _]) => [key, [] as number[]]));

    const indexes = hands.reduce((acc, [hand], index) => {
        for (const key in handByType) {
            if (handByType[key as keyof typeof handByType](hand)) {
                acc[key].push(index);
                break;
            }
        }
        return acc;
    }, indexByType);

    let rank = 1;
    const ans = Object.values(indexes)
        .filter((val) => val.length > 0)
        .reverse()
        .flatMap((arr) => {
            if (arr.length === 1) {
                const score = hands[arr[0]][1];
                return score * rank++;
            }

            const sorted = arr.slice().sort((a, b) => {
                const [handsA] = hands[a];
                const [handsB] = hands[b];

                for (let i = 0; i < handsA.length; i++) {
                    if (handsA[i] === handsB[i]) {
                        continue;
                    }
                    if (order.indexOf(handsA[i]) > order.indexOf(handsB[i])) {
                        return -1;
                    }
                    return 1;
                }
                return 0;
            });

            return sorted.map((idx) => {
                const score = hands[idx][1];
                return score * rank++;
            });
        })
        .reduce((acc, val, arr) => acc + val, 0);

    return ans;
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 5905;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 249356515;
    expect(actual).toBe(expected);
});
