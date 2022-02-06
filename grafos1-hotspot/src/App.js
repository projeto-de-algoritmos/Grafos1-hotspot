import React, { useState, useEffect } from 'react'
import Labyrinth from './labirinto'
import Sketch from 'react-p5'
import './App.css'

function App() {

  const totalColumns = 20;
  const totalRows = 20;
  let cellWidth = 20
  let arrayOfCells = []
  const [isCreated, setIsCreated] = useState(false);
  const [arrayDFS, setArrayDFS] = useState([]);
  const [arrayBFS, setArrayBFS] = useState([]);
  const [arrayHotspot, setArrayHotspot] = useState([]);


  
  const [_array, setArray] = useState([])

  let current
  let stack = []
  let endpoint = { endline: 19, endcolumn: 19 }

  function Cell(column, line, walls, isEnd) {
    this.column = column
    this.line = line
    this.walls = walls || [true, true, true, true] // CIMA, DIREITA, BAIXO, ESQUERDA
    this.visited = false
    this.isEnd = isEnd || (line === endpoint.endline && column === endpoint.endcolumn)

    this.showCell = function(p5) {
      let x = this.column * cellWidth
      let y = this.line * cellWidth
      p5.stroke(212, 241, 244)
      if (this.walls[0]) {
        p5.line(x, y, x + cellWidth, y)
      }
      if (this.walls[1]) {
        p5.line(x + cellWidth, y, x + cellWidth, y + cellWidth)
      }
      if (this.walls[2]) {
        p5.line(x + cellWidth, y + cellWidth, x, y + cellWidth)
      }
      if (this.walls[3]) {
        p5.line(x, y + cellWidth, x, y)
      }
  
      if (this.visited) {
        p5.noStroke()
        isCreated ? p5.fill('green') : p5.fill(24, 154, 180, 100)
        p5.rect(x, y, cellWidth, cellWidth)
      }

      if (this.isEnd && isCreated) {
        p5.noStroke()
        p5.fill('red')
        p5.rect(x, y, cellWidth, cellWidth)
      }
    }

    this.highlight = function(p5) {
      let x = this.column * cellWidth
      let y = this.line * cellWidth
      p5.noStroke()
      p5.fill(0, 0, 255, 100)
      p5.rect(x, y, cellWidth, cellWidth)
    }

    this.checkNeighbors = function(p5) {
      let neighbors = []
  
      let top = arrayOfCells[getArrayPosition(column, line - 1)]
      let right = arrayOfCells[getArrayPosition(column + 1, line)]
      let bottom = arrayOfCells[getArrayPosition(column, line + 1)]
      let left = arrayOfCells[getArrayPosition(column - 1, line)]
  
      if (top && !top.visited) {
        neighbors.push(top)
      }
      if (right && !right.visited) {
        neighbors.push(right)
      }
      if (bottom && !bottom.visited) {
        neighbors.push(bottom)
      }
      if (left && !left.visited) {
        neighbors.push(left)
      }
  
      if (neighbors.length > 0) {
        let randomPosition = p5.floor(p5.random(0, neighbors.length))
        return neighbors[randomPosition]
      } else {
        return undefined
      }
    }

    this.checkNeighborsAll = function(arrayToFind) {
      let neighbors = []
      let top = arrayToFind[getArrayPosition(column, line - 1)]
      let right = arrayToFind[getArrayPosition(column + 1, line)]
      let bottom = arrayToFind[getArrayPosition(column, line + 1)]
      let left = arrayToFind[getArrayPosition(column - 1, line)]
      if (top && !top.visited && !this.walls[0]) {
        neighbors.push(top)
      }
      if (right && !right.visited && !this.walls[1]) {
        neighbors.push(right)
      }
      if (bottom && !bottom.visited && !this.walls[2]) {
        neighbors.push(bottom)
      }
      if (left && !left.visited && !this.walls[3]) {
        neighbors.push(left)
      }
  
      if (neighbors.length > 0) {
        return neighbors
      } else {
        return undefined
      }
    }
  }

  function getArrayPosition(columnPosition, rowPosition) {
    if (columnPosition < 0 || rowPosition < 0 || columnPosition > totalColumns - 1 || rowPosition > totalRows - 1) {
      return -1
    }
    return columnPosition + rowPosition * totalColumns
  }

  function removeWalls(currentCell, nextCell) {
    let x = currentCell.column - nextCell.column
    if (x === 1) {
      currentCell.walls[3] = false
      nextCell.walls[1] = false
    } else if (x === -1) {
      currentCell.walls[1] = false
      nextCell.walls[3] = false
    }
    let y = currentCell.line - nextCell.line
    if (y === 1) {
      currentCell.walls[0] = false
      nextCell.walls[2] = false
    } else if (y === -1) {
      currentCell.walls[2] = false
      nextCell.walls[0] = false
    }
  }

  const setup = (p5, parentRef) => {
    p5.createCanvas(400,400).parent(parentRef)
    p5.frameRate(2000)

    for (let j = 0; j < totalRows; j++) {
      for (let i = 0; i < totalColumns; i++) {
        var cell = new Cell(i, j)
        arrayOfCells.push(cell)
      }
    }

    current = arrayOfCells[0]
  }

  const draw = (p5) => {
    p5.background(5, 68, 94)
  
      for (let i = 0; i < arrayOfCells.length; i++) {
        arrayOfCells[i].showCell(p5)
      }
      
      current.visited = true
      current.highlight(p5)
  
      let next = current.checkNeighbors(p5)
      
      if (next) {
        next.visited = true
  
        stack.push(current)
  
        removeWalls(current, next)
  
        current = next
  
      } else if (stack.length > 0) {
        current = stack.pop()
      }
      else if (stack.length === 0) {
        setArray(arrayOfCells)
        setIsCreated(true);
        p5.noLoop()
      }
  }

  const setArrayLab = (array, setFunction ) => {
    let auxArray = array.map(({ line, column, walls, isEnd }) => {
      return new Cell(column, line, walls, isEnd)
    });
      setFunction(auxArray)
      
  }

  useEffect(() => {
    if(isCreated) {
      setArrayLab(_array, setArrayDFS)
      setArrayLab(_array, setArrayBFS)
      setArrayLab(_array, setArrayHotspot)
    }
  }, [isCreated, _array])

  return (
    <div className="App">
      <div style={{margin: 10}}>
    <Sketch setup={setup} draw={draw}/>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-around'}}>
    {isCreated && arrayDFS.length && arrayBFS.length && arrayHotspot.length && (
      <>
          <Labyrinth array={arrayDFS} endpoint={endpoint} type="DFS"/>
          <Labyrinth array={arrayBFS} endpoint={endpoint} type="BFS"/>
          <Labyrinth array={arrayHotspot} endpoint={endpoint} type="Hotspot"/>
      </>
    )}
    </div>
    </div>
  )
}

export default App
