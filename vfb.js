'use strict'

let $ = (id) => document.getElementById(id)
let canvas = $('screen')
let sw = canvas.width
let sh = canvas.height
let ctx = canvas.getContext('2d')

let mouse = {
  x: 0,
  y: 0,
  down: false
}

canvas.addEventListener('mousedown', (e) => { mouse.down = true }, false)
canvas.addEventListener('mouseup', (e) => { mouse.down = false }, false)
canvas.addEventListener('mousemove', mousePos, false)

function mousePos(event) {
  let rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left - 15
  mouse.y = event.clientY - rect.top - 15
}

function drawFrame(w) {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, sw, sh)
  ctx.clearRect(w, w, sw - 2 * w, sh - 2 * w)
}

function drawShape() {
  if (mouse.down) {
    ctx.fillStyle = $('color').value
    if ($('tool').value == 'circle') {
      ctx.beginPath()
      ctx.arc(mouse.x, mouse.y, $('pensize').value, 0, 2 * Math.PI, false)
      ctx.fill()
    } else {
      // Spray
      for (let i = 0; i < 2; i++) {
        let x = mouse.x - ((Math.random() - 1) * 60)
        let y = mouse.y - ((Math.random() - 1) * 60)
        ctx.beginPath()
        ctx.arc(x, y, $('pensize').value, 0, 2 * Math.PI, false)
        ctx.fill()
      }
    }
  }
}

function cloneCanvas(oldCanvas) {
  let newCanvas = document.createElement('canvas')
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  newCanvas.getContext('2d').drawImage(oldCanvas, 0, 0)
  return newCanvas
}

function cameraTransform() {
  let scale = $('1:1').checked ? 1 : $('zoom').value
  let angle = $('rotate').value
  ctx.translate(sw / 2, sh / 2)
  ctx.scale(scale, scale)
  ctx.rotate(angle * Math.PI / 180)
  ctx.translate(-sw / 2, -sh / 2)
}


let layers = new Array()

function draw() {
  layers.unshift(cloneCanvas(canvas))
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, sw, sh)
  if ($('frame').checked) {
    drawFrame(2)
  }
  if (layers.length >= $('delay').value) {
    cameraTransform()
    ctx.drawImage(layers.pop(), 0, 0)
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }
  drawShape()
  window.requestAnimationFrame(draw)
}

draw()
