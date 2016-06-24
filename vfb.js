'use strict'

var $ = (id) => document.getElementById(id)
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
  mouse.x = event.clientX - rect.left
  mouse.y = event.clientY - rect.top
}

function mouseup(event) {
  mouse.down = false
}

function drawFrame(w) {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, sw, sh)
  ctx.clearRect(w, w, sw - 2 * w, sh - 2 * w)
}


function draw() {
  if (mouse.down) {
    ctx.beginPath()
    ctx.arc(mouse.x - 5, mouse.y - 5, 50, 0, 2 * Math.PI, false)
    ctx.fillStyle = $('color').value
    ctx.fill()
  }
}

function cameraTransform() {
  let scale = $('1:1').checked ? 1 : $('zoom').value
  let angle = $('rotate').value
  ctx.translate(sw / 2, sh / 2)
  ctx.scale(scale, scale)
  ctx.rotate(angle * Math.PI / 180)
  ctx.translate(-sw / 2, -sh / 2)
}

function cloneCanvas(oldCanvas) {
  var newCanvas = document.createElement('canvas')
  var newContext = newCanvas.getContext('2d')
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  newContext.drawImage(oldCanvas, 0, 0)
  return newCanvas
}


let layers = new Array()

function refresh() {
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
  draw()
}


draw()
setInterval(refresh, 60 / 1000)
