import { expect, test } from "bun:test";

function countIslands(graph: Record<string, string[]>) {
    const visited = new Set<string>();
    const islands: Set<string>[] = [];

    function dfs(nodes: string[]) {
        const queue = nodes.slice();

        while (queue.length > 0) {
            const currentNode = queue.shift();

            if (!currentNode) throw new Error("Unexpected");

            if (visited.has(currentNode)) continue;

            visited.add(currentNode);
            islands[islands.length - 1].add(currentNode);
            queue.push(...graph[currentNode]);
        }
    }

    for (const node in graph) {
        if (!visited.has(node)) {
            islands.push(new Set([node]));
            dfs(graph[node]);
        }
    }

    return islands;
}

function solution(input: string) {
    const instr = input.split("\n").map((line) => {
        const [name, connectionsString] = line.split(": ");
        const connections = connectionsString.split(" ");
        return [name, connections] as const;
    });

    const graph = instr.reduce<Record<string, string[]>>((acc, [node, neighbours]) => {
        if (!acc[node]) {
            acc[node] = neighbours.slice();
        } else {
            acc[node].push(...neighbours);
        }

        for (const neighbour of neighbours) {
            if (acc[neighbour]) {
                acc[neighbour].push(node);
            } else {
                acc[neighbour] = [node];
            }
        }

        return acc;
    }, {});

    const paths: Record<string, Record<string, string[]>> = {};
    let stopCount = 12;

    for (const nodeA in graph) {
        paths[nodeA] = {};

        for (const nodeB in graph) {
            if (nodeA === nodeB) continue;

            function bfs(startNode: string, endNode: string) {
                const queue = [startNode];
                const visited = new Set([startNode]);
                const previousNodes: Record<string, string> = {};

                while (queue.length > 0) {
                    const currentNode = queue.shift();

                    if (!currentNode) throw new Error("Unexpected");

                    if (currentNode === endNode) {
                        const path = [endNode];
                        let cur = endNode;

                        while (cur !== startNode) {
                            cur = previousNodes[cur];
                            path.unshift(cur);
                        }

                        return path;
                    }

                    for (const neighbor of graph[currentNode]) {
                        if (!visited.has(neighbor)) {
                            visited.add(neighbor);
                            queue.push(neighbor);
                            previousNodes[neighbor] = currentNode;
                        }
                    }
                }

                throw new Error("No path found");
            }

            if (paths[nodeB]?.[nodeA]) {
                paths[nodeA][nodeB] = paths[nodeB][nodeA];
                continue;
            }

            paths[nodeA][nodeB] = bfs(nodeA, nodeB);
        }

        if (stopCount-- < 0) {
            break;
        }
    }

    const count: Record<string, Record<string, number>> = {};

    for (const nodeA in paths) {
        for (const nodeB in paths[nodeA]) {
            const path = paths[nodeA][nodeB];

            for (let i = 0; i < path.length - 1; i++) {
                const edgeStart = path[i];
                const edgeEnd = path[i + 1];

                if (!count[edgeStart]) {
                    count[edgeStart] = {};
                }

                if (!count[edgeStart][edgeEnd]) {
                    count[edgeStart][edgeEnd] = 0;
                }

                count[edgeStart][edgeEnd] += 1;
            }
        }
    }

    const flatCount: [number, string, string][] = [];

    for (const nodeA in count) {
        for (const nodeB in count[nodeA]) {
            flatCount.push([count[nodeA][nodeB], nodeA, nodeB]);
        }
    }

    const sorted = flatCount.sort((a, b) => b[0] - a[0]);

    for (let i = 0; i < sorted.length; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
            for (let k = j + 1; k < sorted.length; k++) {
                const [_, ...edge1] = sorted[i];
                const [__, ...edge2] = sorted[j];
                const [___, ...edge3] = sorted[k];

                const g = { ...graph };

                g[edge1[0]] = g[edge1[0]].filter((node) => node !== edge1[1]);
                g[edge1[1]] = g[edge1[1]].filter((node) => node !== edge1[0]);

                g[edge2[0]] = g[edge2[0]].filter((node) => node !== edge2[1]);
                g[edge2[1]] = g[edge2[1]].filter((node) => node !== edge2[0]);

                g[edge3[0]] = g[edge3[0]].filter((node) => node !== edge3[1]);
                g[edge3[1]] = g[edge3[1]].filter((node) => node !== edge3[0]);

                const islands = countIslands(g);

                if (islands.length === 2) {
                    return islands.reduce((acc, nodes) => acc * nodes.size, 1);
                }
            }
        }
    }

    throw new Error("Unexpected");
}

test("example", async () => {
    const file = Bun.file(`${import.meta.dir}/example.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 54;
    expect(actual).toBe(expected);
});

test("puzzle input", async () => {
    const file = Bun.file(`${import.meta.dir}/input.txt`);
    const input = await file.text();

    const actual = solution(input);
    const expected = 507626;
    expect(actual).toBe(expected);
});
