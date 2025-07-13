import { expect, test } from "vitest"
import { AStar, Graph } from "../astar"

test("AStar.search - Basic Horizontal - One step down", function() {
    const result = AStar.search(new Graph([[1], [1]]), [0, 0], [1, 0])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[1, 0]])
})

test("AStar.search - Basic Horizontal - Two steps down", function() {
    const result = AStar.search(new Graph([[1], [1], [1]]), [0, 0], [2, 0])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[1, 0], [2, 0]])
})

test("AStar.search - Basic Horizontal - Three steps down", function() {
    const result = AStar.search(new Graph([[1], [1], [1], [1]]), [0, 0], [3, 0])
        .map(r => [r.x, r.y])
    expect(result).toEqual([[1, 0], [2, 0], [3, 0]])
})
