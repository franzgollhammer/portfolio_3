/*
 * Canvas Graphics
 * writte & coded by Franz Gollhammer
 */

const canvas = document.querySelector('div > canvas')
const c = canvas.getContext("2d")
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight

// ***** EVENT LISTENERS *****

// check for resize
window.addEventListener('resize', () => {
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight
})

window.addEventListener('mousemove', (mouse) => {
  mousePos = {
    x: mouse.x,
    y: mouse.y
  }
})

// random int generator
const randomRangeInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// center coords
const center = {
  x: canvas.width / 2,
  y: canvas.height / 2
}

// color array
const colorArray = [
  '#148896',
  '#3FB4BF',
  '#E2E2E2',
  '#00FF8D',
  '#666666',
  '#393636'
]

// mouse stats
mousePos = {}

// max bubbles
const maxBubbles = canvas.width / 4

// bubble stats
const minRadius = 2
const maxRadius = 2
const maxGrowRadius = 10
const minDistRadius = 50
const maxDistRadius = 150
const maxMouseRadius = 50
const a = 2
const v = {
  x: undefined,
  y: undefined
}

// random value generator for bubbles
const random_value = () => {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: randomRangeInt(minRadius, maxRadius),
    v: {
      x: (Math.random() - 0.5) * a,
      y: (Math.random() - 0.5) * a
    }
  }
}

// ***** MAIN *****

const bubbleArray = []

// bubble class
class Bubble {
  constructor(x, y, r, v, col) {
    this.x = x
    this.y = y
    this.r = r
    this.v = v
    this.col = col
    this.distRadius = minDistRadius
  }

  // draw bubble
  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    c.strokeStyle = '#666666'
    c.stroke()
    c.fillStyle = this.col
    c.fill()
  }

  // update bubble
  update() {
    this.x += this.v.x
    this.y += this.v.y
  }

  // check edges
  checkEdges() {
    if (this.x <= 0 || this.x >= innerWidth) {
      this.v.x *= -1
    } else if (this.y <= 0 || this.y >= innerHeight) {
      this.v.y *= -1
    }
  }

  // check distance with radius
  checkRadius(bubble) {
    let r = Math.sqrt(Math.pow((this.x - bubble.x), 2) + Math.pow((this.y - bubble.y), 2))
    return r
  }
}

// init array function
const init = () => {
  for (let i = 0; i < maxBubbles; i++) {
    bubbleArray.push(new Bubble(
      random_value().x,
      random_value().y,
      random_value().r,
      random_value().v,
      // colorArray[randomRangeInt(0, 6)]
      colorArray[3]
    ))
  }
}

// draw array
const drawArray = () => {
  for (let i = 0; i < bubbleArray.length; i++) {
    bubbleArray[i].draw()
  }
}

// uppdate array
const updateArray = () => {
  for (let i = 0; i < bubbleArray.length; i++) {
    bubbleArray[i].update()
    bubbleArray[i].checkEdges()
    drawLineToNeighbour(bubbleArray[i], bubbleArray)
    grow(bubbleArray[i])
  }
}

// animate
const animate = () => {
  requestAnimationFrame(animate)
  c.clearRect(0, 0, innerWidth, innerHeight)
  drawArray()
  updateArray()
}

// draw line to neighbour
const drawLineToNeighbour = (bubble, array) => {
  for (let i = 0; i < array.length; i++) {
    if (bubble.checkRadius(array[i]) <= bubble.distRadius) {
      c.beginPath()
      c.moveTo(bubble.x, bubble.y)
      c.strokeStyle = colorArray[3]
      c.lineTo(array[i].x, array[i].y)
      c.closePath()
      c.stroke()
    }
  }
}

const grow = (bubble) => {
  if (bubble.x + maxMouseRadius >= mousePos.x && bubble.x - maxMouseRadius <= mousePos.x &&
    bubble.y + maxMouseRadius >= mousePos.y && bubble.y - maxMouseRadius <= mousePos.y) {
    if (bubble.distRadius < maxDistRadius) {
      bubble.distRadius = maxDistRadius
    }
  }
  else if (bubble.distRadius > minDistRadius) {
    bubble.distRadius = minDistRadius
  }
}

// ***** MAIN FUNCTION CALLS *****
init()
animate()