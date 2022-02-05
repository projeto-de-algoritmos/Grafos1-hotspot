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
      let x = this.column * cellWidth;
      let y = this.line * cellWidth;
      p5.stroke(212, 241, 244);
      if (this.walls[0]) {
        p5.line(x, y, x + cellWidth, y);
      }
      if (this.walls[1]) {
        p5.line(x + cellWidth, y, x + cellWidth, y + cellWidth);
      }
      if (this.walls[2]) {
        p5.line(x + cellWidth, y + cellWidth, x, y + cellWidth);
      }
      if (this.walls[3]) {
        p5.line(x, y + cellWidth, x, y);
      }
  
      if (this.visited) {
        p5.noStroke();
        p5.fill(24, 154, 180, 100);
        p5.rect(x, y, cellWidth, cellWidth);
      }
    }
    
  }

  const setup = (p5, parentRef) =>{
    p5.createCanvas(400,400).parent(parentRef)
    p5.frameRate(50)

    totalColumns = p5.floor(p5.width / cellWidth)
    totalRows = p5.floor(p5.height / cellWidth)

    for (let j = 0; j < totalRows; j++) {
      for (let i = 0; i < totalColumns; i++) {
        var cell = new Cell(i, j, p5)
        arrayOfCells.push(cell)
      }
    }

    current = arrayOfCells[0]
  }

  const draw = (p5) => {
    p5.background(5, 68, 94)

    for (let i = 0; i < arrayOfCells.length; i++) {
      arrayOfCells[i].showCell();
    }
  }

  return (
    <div className="App">
    <Sketch setup={setup} draw={draw} />
    </div>
  )
}

export default App
