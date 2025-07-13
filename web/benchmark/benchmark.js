import {AStar, Graph} from "../../src/astar.js";

$(function() {
    var running = false;
    $("#runall").click(function() {
        if (running) {
            return;
        }
        running = true;

        var graph = new Graph(grid),
            start = graph.grid[0][0],
            end = graph.grid[140][140],
            results = [],
            startTime = performance.now(),
            iterations = 1000;

        for (var i = 0; i < iterations; i++) {
            var iterationStartTime = performance.now(),
                result = AStar.search(graph, start, end),
                iterationEndTime = performance.now();

            results.push(
                '<li>Found path with ' + result.length + ' steps.  ' +
                'Took ' + (iterationEndTime - iterationStartTime).toFixed(2) + ' milliseconds.</li>'
            );
        }

        var endTime = performance.now()

        $("#graph").html(graph.toString());
        $("#summary").html('Average time: ' + ((endTime - startTime) / iterations).toFixed(2) + 'ms');
        $("#results").html(results.join(''));

        running = false;
        return false;
    });
});
