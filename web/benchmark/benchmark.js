import { AStar, Grid } from "../../src/astar.js"

$(function () {
    var running = false
    $("#runall").click(function () {
        if (running) {
            return
        }
        running = true

        var grid = new Grid(grid),
            start = grid.grid[0][0],
            end = grid.grid[140][140],
            results = [],
            startTime = performance.now(),
            iterations = 1000

        for (var i = 0; i < iterations; i++) {
            var iterationStartTime = performance.now(),
                result = AStar.search(grid, start, end),
                iterationEndTime = performance.now()

            results.push(
                "<li>Found path with " +
                    result.length +
                    " steps.  " +
                    "Took " +
                    (iterationEndTime - iterationStartTime).toFixed(2) +
                    " milliseconds.</li>"
            )
        }

        var endTime = performance.now()

        $("#grid").html(grid.toString())
        $("#summary").html(
            "Average time: " +
                ((endTime - startTime) / iterations).toFixed(2) +
                "ms"
        )
        $("#results").html(results.join(""))

        running = false
        return false
    })
})
