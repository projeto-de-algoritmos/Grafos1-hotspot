import React from 'react'
import Sketch from 'react-p5'
import './App.css'

function Labyrinth({ array = [], endpoint, type, width = 400, height = 400}) {
  let arrayOfCells = array;
  let current = arrayOfCells[0]
  let stack = []

  const setup = (p5, parentRef) => {
    p5.createCanvas(width,height).parent(parentRef)
    p5.frameRate(100)
    p5.background(5, 68, 94)
  }

  const DFS = (p5) => {
    for (let i = 0; i < arrayOfCells.length; i++) {
      arrayOfCells[i].showCell(p5)
    }
    
    current.visited = true

    current.highlight(p5)

    if(current.isEnd) {
      p5.noLoop();
      return;
    }
    let around = current.checkNeighborsAll(arrayOfCells)
    
    if (around?.length) {
      let next = around[0]

      next.visited = true

      stack.push(current)

      current = next

    } else if (stack.length > 0) {
      current = stack.pop()
    }
  }

  const Hotspot = (p5) => {
    for (let i = 0; i < arrayOfCells.length; i++) {
      arrayOfCells[i].showCell(p5)
    }
    
    current.visited = true
    current.highlight(p5)
    if(current.isEnd) {
      p5.noLoop();
      return;
    }
    let around = current.checkNeighborsAll(arrayOfCells)

    if (around?.length) {
      let checkHotspot = around.map(cell => ({
        weight: Math.max(cell.line, endpoint.endline) - Math.min(cell.line, endpoint.endline),
        cell
      }))
  
      checkHotspot.sort((a,b) => a.weight - b.weight)
      let next = checkHotspot[0].cell

      next.visited = true

      stack.push(current)

      current = next

    } else if (stack.length > 0) {
      current = stack.pop()
    }
  }

  const BFS = (p5) => {
    for (let i = 0; i < arrayOfCells.length; i++) {
      arrayOfCells[i].showCell(p5)
    }
    
    current.visited = true
    current.highlight(p5)
    if(current.isEnd) {
      p5.noLoop();
      return;
    }

    let around = current.checkNeighborsAll(arrayOfCells)
    
    if (around?.length) {
      around.forEach(cell => stack.push(cell))

      let next = stack.shift()

      next.visited = true
  
      current = next

    } else if (stack.length > 0) {
      current = stack.shift()
    }
  }

  const draw = (p5) => {
    switch (type) { 
      case 'DFS':
        DFS(p5)
        break;
      case 'BFS':
        BFS(p5)
        break;
      default:
        Hotspot(p5)

    }
  }
  
  return array?.length ? (
    <div>
      <h1>{type}</h1>
      <Sketch setup={setup} draw={draw} />
    </div>
  ) : null
}

export default Labyrinth
