import React, { useState, useEffect } from 'react'
import Node from "./Node"
import "./Pathfind.css"
import Astar from "../astarAlgorithm/astar"

const cols = 30 
const rows = 15 

const NODE_START_ROW = 0
const NODE_START_COL = 0
const NODE_END_ROW = rows - 1
const NODE_END_COL = cols - 1

function Pathfind() {
    const [Grid, setGrid] = useState([])
    const [Path, setPath] = useState([])
    const [VisitedNodes, setVisitedNodes] = useState([])

    // initialize grid before dom is generated
    useEffect(() => {
        initalizeGrid()
    }, [])

    const initalizeGrid = () => {
        const grid = new Array(rows);

        for (let i = 0; i < rows; i++){
            grid[i] = new Array(cols)
        }

        createSpot(grid)

        setGrid(grid)

        addNeighbours(grid); 

        const startNode = grid[NODE_START_ROW][NODE_START_COL]
        const endNode = grid[NODE_END_ROW][NODE_END_COL]

        // start and end nodes never be wall nodes 
        startNode.isWall = false
        endNode.isWall = false

        let path = Astar(startNode, endNode)

        setPath(path.path)

        setVisitedNodes(path.visitedNodes)

    }

    const createSpot = (grid) => {
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++){
                grid[i][j] = new Spot(i, j)
            }
        }
    }

    const addNeighbours = (grid) => {
        for (let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                grid[i][j].addNeighbours(grid)
            }
        }
    }

    const gridWithNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const { isStart, isEnd, isWall } = col
                            return (
                                <Node key={colIndex} 
                                isStart={isStart} 
                                isEnd={isEnd}
                                row={rowIndex}
                                col={colIndex}
                                isWall={isWall}
                            />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )

    function Spot(i, j){
        this.x = i
        this.y = j
        this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
        this.g = 0 
        this.f = 0
        this.h = 0
        this.isWall = false
        if (Math.random(1) < 0.2){ // 20% of nodes will be walls
            this.isWall = true
        }
        this.neighbours = []
        this.previous = undefined 
        this.addNeighbours = (grid) => {
            let i = this.x
            let j = this.y

            if (i > 0) { this.neighbours.push(grid[i - 1][j]) } 
            if (i < rows - 1) { this.neighbours.push(grid[i + 1][j]) }
            if (j > 0) { this.neighbours.push(grid[i][j - 1]) }
            if (j < cols - 1) { this.neighbours.push(grid[i][j + 1])}
            
        }
    }

    const visualizeShortestPath = (shortestPathNodes) => {
        for (let i = 0; i < shortestPathNodes.length; i++){
            setTimeout(() => {
                const node = shortestPathNodes[i]
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path"
            }, 50 * i)
        }
    }

    const visualizePath = () => {
        for (let i = 0; i <= VisitedNodes.length; i++) {
            if (i === VisitedNodes.length) {
                setTimeout(() => {
                    visualizeShortestPath(Path)
                }, 5500)
            } else {
                setTimeout(() => {
                    const node = VisitedNodes[i]
                    document.getElementById(`node-${node.x}-${node.y}`).className =
                        "node node-visited"
                }, 15 * i)
            }
        }
    }

    const resetGrid = () => {
        for (let i = 0; i <= VisitedNodes.length - 1; i++){
            
            const node = VisitedNodes[i]

            const classes = 
                node.isStart ? "node-start" :
                node.isWall ? "isWall" :
                node.isEnd ? "node-end" : ""

                document.getElementById(`node-${node.x}-${node.y}`).className = `node ${classes}`
        }

        initalizeGrid()
    }

    // console.log(Path)
    return (
        <div className="wrapper">
            <div className="table-wrapper">
                <h1>A* Pathfinding Algo Visualizer</h1>
                <div className="table">{gridWithNode}</div>
            </div>
            <div className="button-wrapper">
                <div className="button" onClick={visualizePath}>Visualize Path</div>
                <div className="button" onClick={resetGrid}>Reset</div>
            </div>
        </div>
    )
}

export default Pathfind
