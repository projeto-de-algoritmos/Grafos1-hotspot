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
  }

  const setup = (p5, parentRef) =>{
    p5.createCanvas(400,400).parent(parentRef)
    p5.frameRate(50)

    totalColumns = p5.floor(p5.width / cellWidth)
    totalRows = p5.floor(p5.height / cellWidth)
  }

  const draw = (p5) => {
    p5.background(5, 68, 94)
  }

  return (
    <div className="App">
    <Sketch setup={setup} draw={draw} />
    </div>
  )
}

export default App
