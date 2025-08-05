import { expect, test } from "vitest"
import { AStar, Grid, GridNode } from "../src/astar.js"

test("AStar.search - Examples - Minimal", function () {
    const grid = new Grid([
        [1, 0],
        [1, 1],
    ])
    const result = AStar.search(grid, [0, 0], [1, 1]).map((r) => [r.x, r.y])
    expect(result).toEqual([
        [0, 1],
        [1, 1],
    ])
})

test("AStar.search - Examples - Complex", function () {
    const grid = new Grid([
        [1, 0, 0, 1, 1],
        [1, 1, 0, 1, 0],
        [0, 1, 1, 1, 1],
        [0, 1, 0, 0, 1],
        [0, 1, 1, 1, 1],
    ])
    const result = AStar.search(grid, [0, 0], [4, 0]).map((r) => [r.x, r.y])
    expect(result).toEqual([
        [0, 1],
        [1, 1],
        [1, 2],
        [2, 2],
        [3, 2],
        [3, 1],
        [3, 0],
        [4, 0],
    ])
})

test("AStar.search - Examples - Diagonal", function () {
    const grid = new Grid(
        [
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1],
        ],
        { diagonal: true }
    )
    const result = AStar.search(grid, [0, 0], [2, 2]).map((r) => [r.x, r.y])
    expect(result).toEqual([
        [1, 1],
        [2, 2],
    ])
})

test("AStar.search - Examples - Closest", function () {
    const grid = new Grid([
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
    ])
    const result = AStar.search(grid, [0, 0], [2, 2], { closest: true }).map(
        (r) => [r.x, r.y]
    )
    expect(result).toEqual([
        [0, 1],
        [1, 1],
        [1, 2],
    ])
})

test("AStar.search - Examples - Weights", function () {
    const grid = new Grid([
        [1, 9, 1],
        [1, 1, 1],
    ])
    const result = AStar.search(grid, [0, 0], [2, 0]).map((r) => [r.x, r.y])
    expect(result).toEqual([
        [0, 1],
        [1, 1],
        [2, 1],
        [2, 0],
    ])
})

test("AStar.search - Examples - Use grid nodes as start/end", function () {
    const grid = new Grid([
        [1, 0],
        [1, 1],
    ])
    const start = grid.grid[0][0]
    const end = grid.grid[1][1]
    const result = AStar.search(grid, start, end).map((r) => [r.x, r.y])
    expect(result).toEqual([
        [0, 1],
        [1, 1],
    ])
})

test("AStar.search - Examples - Typed result", function () {
    /** @returns {GridNode[]} */
    function findPath() {
        const grid = new Grid([
            [1, 1],
            [0, 1],
        ])
        return AStar.search(grid, [0, 0], [1, 1])
    }

    const result = findPath()
    expect(result).toBeInstanceOf(Array)
    expect(result[0]).toBeInstanceOf(GridNode)
})
