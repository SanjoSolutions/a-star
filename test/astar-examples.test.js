import { expect, test } from "vitest"
import { AStar, Graph } from "../src/astar.js"

test("AStar.search - Examples - Minimal", function() {
    const graph = new Graph([
        [1, 1],
        [0, 1]
    ])
    const result = AStar.search(graph, [0, 0], [1, 1])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[0, 1], [1, 1]])
})

test("AStar.search - Examples - Complex", function() {
    const graph = new Graph([
        [1, 1, 0, 0, 0],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 0, 1],
        [1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1],
    ])
    const result = AStar.search(graph, [0, 0], [4, 0])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[0, 1], [1, 1], [1, 2], [2, 2], [3, 2], [3, 1], [3, 0], [4, 0]])
})

test("AStar.search - Examples - Diagonal", function() {
    const graph = new Graph([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ], { diagonal: true })
    const result = AStar.search(graph, [0, 0], [2, 2])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[1, 1], [2, 2]])
})

test("AStar.search - Examples - Weights", function() {
    const graph = new Graph([
        [1, 1],
        [9, 1],
        [1, 1]
    ])
    const result = AStar.search(graph, [0, 0], [2, 0])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[0, 1], [1, 1], [2, 1], [2, 0]])
})

test("AStar.search - Examples - Use grid nodes as start/end", function() {
    const graph = new Graph([
        [1, 1],
        [0, 1]
    ])
    const start = graph.grid[0][0]
    const end = graph.grid[1][1]
    const result = AStar.search(graph, start, end)
        .map(r => [r.x, r.y])
    expect(result).toEqual([[0, 1], [1, 1]])
})
