import { expect, test } from "vitest"
import { AStar, Graph } from "../src/astar.js"

test("AStar.search - Basic Horizontal - One step down", function () {
    const result = AStar.search(new Graph([[1, 1]]), [0, 0], [1, 0]).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([[1, 0]])
})

test("AStar.search - Basic Horizontal - Two steps down", function () {
    const result = AStar.search(new Graph([[1, 1, 1]]), [0, 0], [2, 0]).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([
        [1, 0],
        [2, 0],
    ])
})

test("AStar.search - Basic Horizontal - Three steps down", function () {
    const result = AStar.search(new Graph([[1, 1, 1, 1]]), [0, 0], [3, 0]).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([
        [1, 0],
        [2, 0],
        [3, 0],
    ])
})

test("AStar.search - Basic Vertical - One step across", function () {
    const result = AStar.search(new Graph([[1], [1]]), [0, 0], [0, 1]).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([[0, 1]])
})

test("AStar.search - Basic Vertical - Two steps across", function () {
    const result = AStar.search(new Graph([[1], [1], [1]]), [0, 0], [0, 2]).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([
        [0, 1],
        [0, 2],
    ])
})

test("AStar.search - Basic Vertical - Three steps across", function () {
    const result = AStar.search(
        new Graph([[1], [1], [1], [1]]),
        [0, 0],
        [0, 3]
    ).map((r) => [r.x, r.y])
    expect(result).toEqual([
        [0, 1],
        [0, 2],
        [0, 3],
    ])
})

test("AStar.search - Closest - Path to closest node", function () {
    const graph = new Graph([
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
    ])
    const result = AStar.search(graph, [0, 0], [2, 1], { closest: true }).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([
        [0, 1],
        [1, 1],
    ])
})

test("AStar.search - Closest - Start node was closest node", function () {
    const graph = new Graph([
        [1, 0, 0],
        [0, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
    ])
    const result = AStar.search(graph, [0, 0], [2, 1], { closest: true }).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([])
})

test("AStar.search - Closest - End node was reachable", function () {
    const graph = new Graph([
        [1, 0, 0],
        [1, 1, 1],
        [1, 1, 1],
        [1, 0, 1],
    ])
    const result = AStar.search(graph, [0, 0], [2, 1], { closest: true }).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([
        [0, 1],
        [1, 1],
        [2, 1],
    ])
})

test("AStar.search - Multiple runs on the same graph", function () {
    const graph = new Graph([
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
        [1, 0, 1],
    ])

    // Initial
    const result1 = AStar.search(graph, [0, 0], [2, 3]).map((r) => [r.x, r.y])
    expect(result1).toEqual([
        [0, 1],
        [1, 1],
        [1, 2],
        [2, 2],
        [2, 3],
    ])

    // Initial repeated
    const result2 = AStar.search(graph, [0, 0], [2, 3]).map((r) => [r.x, r.y])
    expect(result2).toEqual([
        [0, 1],
        [1, 1],
        [1, 2],
        [2, 2],
        [2, 3],
    ])

    // Back to start
    const result3 = AStar.search(graph, [2, 3], [0, 0]).map((r) => [r.x, r.y])
    expect(result3).toEqual([
        [2, 2],
        [1, 2],
        [0, 2],
        [0, 1],
        [0, 0],
    ])

    // To a spot that has been attempted
    const result4 = AStar.search(graph, [0, 0], [0, 3]).map((r) => [r.x, r.y])
    expect(result4).toEqual([
        [0, 1],
        [0, 2],
        [0, 3],
    ])

    // To a spot that has been attempted
    const result5 = AStar.search(graph, [0, 0], [1, 1]).map((r) => [r.x, r.y])
    expect(result5).toEqual([
        [0, 1],
        [1, 1],
    ])
})

test("GridNode - getCost", function () {
    const graph1 = new Graph(
        [
            [1, 1, 1],
            [2, 1, 1],
            [2, 2, 2],
        ],
        { diagonal: true }
    )

    // Test straight neighbor
    expect(graph1.grid[0][1].getCost(graph1.grid[0][0])).toBe(1)
    // Test diagonal neighbor
    expect(graph1.grid[1][1].getCost(graph1.grid[0][0])).toBe(1.41421)
    // Test diagonal neighbor with weight
    expect(graph1.grid[2][2].getCost(graph1.grid[1][1])).toBe(2.82842)
})
