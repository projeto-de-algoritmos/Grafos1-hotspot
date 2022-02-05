import React from 'react'
import Sketch from 'react-p5'
import './App.css'

function App() {

  let totalColumns, totalRows
  let cellWidth = 20
  let arrayOfCells = []
  let current
  let stack = []

  function Cell(column, line, p5) {
    this.column = column
    this.line = line
    this.walls = [true, true, true, true] // CIMA, DIREITA, BAIXO, ESQUERDA
    this.visited = false

    this.showCell = function() {
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
        p5.fill(24, 154, 180, 100)
        p5.rect(x, y, cellWidth, cellWidth)
      }
    }

    this.highlight = function() {
      let x = this.column * cellWidth
      let y = this.line * cellWidth
      p5.noStroke()
      p5.fill(0, 0, 255, 100)
      p5.rect(x, y, cellWidth, cellWidth)
    }

    this.checkNeighbors = function() {
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

  const setup = (p5, parentRef) =>{
    p5.createCanvas(400,400).parent(parentRef)
    p5.frameRate(20)

    totalColumns = p5.floor(p5.width / cellWidth)
    totalRows = p5.floor(p5.height / cellWidth)

    for (let j = 0; j < totalRows; j++) {
      for (let i = 0; i < totalColumns; i++) {
        var cell = new Cell(i, j, p5)
        arrayOfCells.push(cell)
      }
    }

    console.log(arrayOfCells)
    current = arrayOfCells[0]
  }

  const draw = (p5) => {
    p5.background(5, 68, 94)

    for (let i = 0; i < arrayOfCells.length; i++) {
      arrayOfCells[i].showCell()
    }

    current.visited = true
    current.highlight()

    let next = current.checkNeighbors()
    if (next) {
      next.visited = true

      stack.push(current)

      removeWalls(current, next)

      current = next

    } else if (stack.length > 0) {
      current = stack.pop()
    }
    
  }

  return (
    <div className="App">
    <Sketch setup={setup} draw={draw} />
    </div>
  )
}

export default App
