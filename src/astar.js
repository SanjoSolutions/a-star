export class AStar {
    /**
     * Perform an A* Search on a graph given a start and end node.
     * @param {Graph} graph
     * @param {GridNode|[number, number]} start
     * @param {GridNode|[number, number]} end
     * @param {object} [options]
     * @param {boolean} [options.closest] Specifies whether to return the path to the closest node if the target is unreachable.
     * @param {Function} [options.heuristic] Heuristic function (see astar.heuristics).
     * @returns {GridNode[]}
     */
    static search(graph, start, end, options) {
        graph.cleanDirty()
        start = start instanceof GridNode ? start : graph.grid[start[0]][start[1]]
        end = end instanceof GridNode ? end : graph.grid[end[0]][end[1]]
        options = options || {}
        const heuristic = options.heuristic || (graph.diagonal ? AStar.heuristics.diagonal : AStar.heuristics.manhattan)
        const closest = options.closest || false

        const openHeap = new BinaryHeap()
        let closestNode = start // set the start node to be the closest if required

        start.h = heuristic(start, end)
        graph.markDirty(start)

        openHeap.push(start)

        while (openHeap.size() > 0) {
            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            const currentNode = openHeap.pop()

            // End case -- result has been found, return the traced path.
            if (currentNode === end)
                return this.#pathTo(currentNode)

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true

            // Find all neighbors for the current node.
            const neighbors = graph.neighbors(currentNode)

            for (let i = 0, il = neighbors.length; i < il; ++i) {
                const neighbor = neighbors[i]

                if (neighbor.closed || neighbor.isWall()) {
                    // Not a valid node to process, skip to next neighbor.
                    continue
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                const gScore = currentNode.g + neighbor.getCost(currentNode)
                const beenVisited = neighbor.visited

                if (!beenVisited || gScore < neighbor.g) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true
                    neighbor.parent = currentNode
                    neighbor.h = neighbor.h || heuristic(neighbor, end)
                    neighbor.g = gScore
                    neighbor.f = neighbor.g + neighbor.h
                    graph.markDirty(neighbor)
                    if (closest) {
                        // If the neighbour is closer than the current closestNode or if it's equally close but has
                        // a cheaper path than the current closest node then it becomes the closest node
                        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g))
                            closestNode = neighbor
                    }

                    // Already seen the node, but since it has been rescored we need to reorder it in the heap
                    if (beenVisited)
                        openHeap.rescoreElement(neighbor)
                    // Pushing to heap will put it in proper place based on the 'f' value.
                    else
                        openHeap.push(neighbor)
                }
            }
        }

        if (closest)
            return this.#pathTo(closestNode)

        // No result was found - empty array signifies failure to find path.
        return []
    }

    /**
     * @param {GridNode} node
     * @returns {GridNode[]}
     */
    static #pathTo(node) {
        let curr = node
        const path = []
        while (curr.parent) {
            path.push(curr)
            curr = curr.parent
        }
        return path.reverse()
    }

    /** See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html */
    static heuristics = {
        /**
         * @param {GridNode} pos0
         * @param {GridNode} pos1
         * @returns {number}
         */
        manhattan: function(pos0, pos1) {
            const d1 = Math.abs(pos1.x - pos0.x)
            const d2 = Math.abs(pos1.y - pos0.y)
            return d1 + d2
        },
        /**
         * @param {GridNode} pos0
         * @param {GridNode} pos1
         * @returns {number}
         */
        diagonal: function(pos0, pos1) {
            const D = 1
            const D2 = Math.sqrt(2)
            const d1 = Math.abs(pos1.x - pos0.x)
            const d2 = Math.abs(pos1.y - pos0.y)
            return (D * (d1 + d2)) + ((D2 - (2 * D)) * Math.min(d1, d2))
        }
    }
}

export class Graph {
    /**
     * A graph memory structure
     * @param {Array} gridIn 2D array of input weights
     * @param {object} [options]
     * @param {boolean} [options.diagonal] Specifies whether diagonal moves are allowed
     */
    constructor(gridIn, options) {
        options = options || {}
        /** @type {GridNode[]} */
        this.nodes = []
        this.diagonal = !!options.diagonal
        /** @type {GridNode[][]} */
        this.grid = []
        this.dirtyNodes = []
        for (let x = 0; x < gridIn.length; x++) {
            this.grid[x] = []
            for (let y = 0, row = gridIn[x]; y < row.length; y++) {
                const node = new GridNode(x, y, row[y])
                this.grid[x][y] = node
                this.nodes.push(node)
            }
        }
        for (let i = 0; i < this.nodes.length; i++)
            this.nodes[i].clean()
    }

    cleanDirty() {
        for (let i = 0; i < this.dirtyNodes.length; i++)
            this.dirtyNodes[i].clean()

        this.dirtyNodes = []
    }

    /** @param {GridNode} node */
    markDirty(node) {
        this.dirtyNodes.push(node)
    }

    /**
     * @param {GridNode} node
     * @returns {GridNode[]}
     */
    neighbors(node) {
        const ret = []
        const x = node.x
        const y = node.y
        const grid = this.grid

        // West
        if (grid[x - 1] && grid[x - 1][y])
            ret.push(grid[x - 1][y])

        // East
        if (grid[x + 1] && grid[x + 1][y])
            ret.push(grid[x + 1][y])

        // South
        if (grid[x] && grid[x][y - 1])
            ret.push(grid[x][y - 1])

        // North
        if (grid[x] && grid[x][y + 1])
            ret.push(grid[x][y + 1])

        if (this.diagonal) {
            // Southwest
            if (grid[x - 1] && grid[x - 1][y - 1])
                ret.push(grid[x - 1][y - 1])

            // Southeast
            if (grid[x + 1] && grid[x + 1][y - 1])
                ret.push(grid[x + 1][y - 1])

            // Northwest
            if (grid[x - 1] && grid[x - 1][y + 1])
                ret.push(grid[x - 1][y + 1])

            // Northeast
            if (grid[x + 1] && grid[x + 1][y + 1])
                ret.push(grid[x + 1][y + 1])
        }

        return ret
    }

    /** @returns {string} */
    toString() {
        const graphString = []
        const nodes = this.grid
        for (let x = 0; x < nodes.length; x++) {
            const rowDebug = []
            const row = nodes[x]
            for (let y = 0; y < row.length; y++)
                rowDebug.push(row[y].weight)

            graphString.push(rowDebug.join(" "))
        }
        return graphString.join("\n")
    }
}

export class GridNode {
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} weight
     */
    constructor(x, y, weight) {
        this.x = x
        this.y = y
        this.weight = weight
        this.f = 0
        this.g = 0
        this.h = 0
        this.visited = false
        this.closed = false
        this.parent = null
    }

    clean() {
        this.f = 0
        this.g = 0
        this.h = 0
        this.visited = false
        this.closed = false
        this.parent = null
    }

    /** @returns {string} */
    toString() {
        return `[${this.x} ${this.y}]`
    }

    /**
     * @param {GridNode} fromNeighbor
     * @returns {number}
     */
    getCost(fromNeighbor) {
        // Take diagonal weight into consideration.
        if (fromNeighbor && fromNeighbor.x !== this.x && fromNeighbor.y !== this.y)
            return this.weight * 1.41421

        return this.weight
    }

    /** @returns {boolean} */
    isWall() {
        return this.weight === 0
    }
}

class BinaryHeap {
    /** @param {Function=} scoreFunction */
    constructor(scoreFunction) {
        /** @type {GridNode[]} */
        this.content = []
        this.scoreFunction = scoreFunction ?? BinaryHeap.defaultScoreFunction
    }

    /**
     * @param {GridNode} node
     * @returns {number}
     */
    static defaultScoreFunction(node) {
        return node.f
    }

    /** @param {GridNode} element */
    push(element) {
        // Add the new element to the end of the array.
        this.content.push(element)

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1)
    }

    /** @returns {GridNode} */
    pop() {
        // Store the first element so we can return it later.
        const result = this.content[0]
        // Get the element at the end of the array.
        const end = this.content.pop()
        if (!end)
            throw new Error("Heap is empty, cannot pop element.")
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end
            this.bubbleUp(0)
        }
        return result
    }

    /** @returns {number} */
    size() {
        return this.content.length
    }

    /** @param {GridNode} node */
    rescoreElement(node) {
        this.sinkDown(this.content.indexOf(node))
    }

    /** @param {number} n */
    sinkDown(n) {
        // Fetch the element that has to be sunk.
        const element = this.content[n]

        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            const parentN = ((n + 1) >> 1) - 1
            const parent = this.content[parentN]
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element
                this.content[n] = parent
                // Update 'n' to continue at the new position.
                n = parentN
            }
            // Found a parent that is less, no need to sink any further.
            else
                break
        }
    }

    /** @param {number} n */
    bubbleUp(n) {
        // Look up the target element and its score.
        const length = this.content.length
        const element = this.content[n]
        const elemScore = this.scoreFunction(element)

        while (true) {
            // Compute the indices of the child elements.
            const child2N = (n + 1) << 1
            const child1N = child2N - 1
            // This is used to store the new position of the element, if any.
            let swap = null
            let child1Score
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                const child1 = this.content[child1N]
                child1Score = this.scoreFunction(child1)

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                const child2 = this.content[child2N]
                const child2Score = this.scoreFunction(child2)
                if (child2Score < (swap === null ? elemScore : child1Score))
                    swap = child2N
            }

            // If the element needs to be moved, swap it, and continue. Otherwise, we are done.
            if (swap === null)
                break
            else {
                this.content[n] = this.content[swap]
                this.content[swap] = element
                n = swap
            }
        }
    }
}
