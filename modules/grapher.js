// grapher.js - 2D Function Plotter Module

let canvas;
let ctx;
let coordsDisplay;
let graphF1Input, graphF2Input, graphF3Input;
let btnUpdateGraph, btnZoomIn, btnZoomOut, btnResetView;

// Bounds of coordinates
let xMin = -10;
let xMax = 10;
let yMin = -10;
let yMax = 10;

// Drag state
let isDragging = false;
let startX, startY;
let dragXMin, dragXMax, dragYMin, dragYMax;

export function initGrapher() {
  canvas = document.getElementById('graphCanvas');
  ctx = canvas?.getContext('2d');
  coordsDisplay = document.getElementById('coordsDisplay');
  
  graphF1Input = document.getElementById('graphF1');
  graphF2Input = document.getElementById('graphF2');
  graphF3Input = document.getElementById('graphF3');
  
  btnUpdateGraph = document.getElementById('btnUpdateGraph');
  btnZoomIn = document.getElementById('btnZoomIn');
  btnZoomOut = document.getElementById('btnZoomOut');
  btnResetView = document.getElementById('btnResetView');

  // Event bindings
  btnUpdateGraph?.addEventListener('click', drawGraph);
  btnZoomIn?.addEventListener('click', () => zoom(0.8));
  btnZoomOut?.addEventListener('click', () => zoom(1.25));
  btnResetView?.addEventListener('click', resetView);

  // Mouse & touch events for panning
  canvas?.addEventListener('mousedown', startDrag);
  canvas?.addEventListener('mousemove', handleDragAndTracker);
  window.addEventListener('mouseup', stopDrag);
  
  // Touch panning support
  canvas?.addEventListener('touchstart', startDragTouch, { passive: false });
  canvas?.addEventListener('touchmove', handleDragTouch, { passive: false });
  canvas?.addEventListener('touchend', stopDrag);

  // Mouse wheel zooming
  canvas?.addEventListener('wheel', handleWheelZoom, { passive: false });
}

// Fit canvas to CSS size and redraw
export function resizeGraphCanvas() {
  if (!canvas || !canvas.parentElement) return;
  
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  
  drawGraph();
}

function resetView() {
  xMin = -10; xMax = 10;
  yMin = -10; yMax = 10;
  drawGraph();
}

function zoom(factor) {
  const xCenter = (xMin + xMax) / 2;
  const yCenter = (yMin + yMax) / 2;
  const xRange = (xMax - xMin) * factor;
  const yRange = (yMax - yMin) * factor;
  
  xMin = xCenter - xRange / 2;
  xMax = xCenter + xRange / 2;
  yMin = yCenter - yRange / 2;
  yMax = yCenter + yRange / 2;
  
  drawGraph();
}

// Convert Math Coordinates to Canvas pixels
function getPixelX(x) {
  return ((x - xMin) / (xMax - xMin)) * canvas.width;
}

function getPixelY(y) {
  return canvas.height - ((y - yMin) / (yMax - yMin)) * canvas.height;
}

// Convert Canvas pixels to Math coordinates
function getMathX(px) {
  return xMin + (px / canvas.width) * (xMax - xMin);
}

function getMathY(py) {
  return yMin + (1 - py / canvas.height) * (yMax - yMin);
}

// Main Draw loop
function drawGraph() {
  if (!ctx || !canvas) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid & axes
  drawGrid();
  
  // Plot functions
  plotFunction(graphF1Input.value.trim(), '#3b82f6'); // Blue
  plotFunction(graphF2Input.value.trim(), '#10b981'); // Green
  plotFunction(graphF3Input.value.trim(), '#f59e0b'); // Orange
}

// Draw Grid Lines & Numbers
function drawGrid() {
  const W = canvas.width;
  const H = canvas.height;
  
  ctx.save();
  
  // Calculate reasonable step ticks
  const rangeX = xMax - xMin;
  let rawStep = rangeX / 10;
  
  // Find closest nice step size (1, 2, 5, 10, 20, 50, 100...)
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const normalized = rawStep / magnitude;
  let step;
  if (normalized < 1.5) step = magnitude;
  else if (normalized < 3) step = magnitude * 2;
  else if (normalized < 7) step = magnitude * 5;
  else step = magnitude * 10;

  // Gridline style
  ctx.strokeStyle = '#e5e7eb'; // Light gray
  ctx.lineWidth = 1;
  ctx.fillStyle = '#6b7280'; // Gray text
  ctx.font = '10px monospace';

  // Draw Vertical Gridlines (X values)
  const startXVal = Math.floor(xMin / step) * step;
  for (let x = startXVal; x <= xMax; x += step) {
    const px = getPixelX(x);
    
    // Grid line
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, H);
    ctx.stroke();

    // Label offset slightly
    const pyAxis = Math.max(15, Math.min(H - 5, getPixelY(0) + 12));
    // Don't label x = 0 here (avoid axis overlap)
    if (Math.abs(x) > 1e-9) {
      ctx.fillText(math.format(x, {precision: 5}), px + 4, pyAxis);
    }
  }

  // Draw Horizontal Gridlines (Y values)
  const startYVal = Math.floor(yMin / step) * step;
  for (let y = startYVal; y <= yMax; y += step) {
    const py = getPixelY(y);
    
    // Grid line
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(W, py);
    ctx.stroke();

    // Label offset
    const pxAxis = Math.max(5, Math.min(W - 40, getPixelX(0) + 4));
    if (Math.abs(y) > 1e-9) {
      ctx.fillText(math.format(y, {precision: 5}), pxAxis, py - 4);
    }
  }

  // Draw Main Axes (X and Y axis lines)
  ctx.strokeStyle = '#9ca3af'; // Darker gray
  ctx.lineWidth = 1.5;
  
  // Y Axis (x = 0)
  const pyAxisX = getPixelX(0);
  ctx.beginPath();
  ctx.moveTo(pyAxisX, 0);
  ctx.lineTo(pyAxisX, H);
  ctx.stroke();
  
  // X Axis (y = 0)
  const pxAxisY = getPixelY(0);
  ctx.beginPath();
  ctx.moveTo(0, pxAxisY);
  ctx.lineTo(W, pxAxisY);
  ctx.stroke();
  
  // Label Origin
  ctx.fillText('0', pyAxisX + 4, pxAxisY + 12);
  
  ctx.restore();
}

// Compile & plot single equation
function plotFunction(exprStr, color) {
  if (!exprStr) return;
  
  try {
    const compiled = math.compile(exprStr);
    
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    
    let isDrawingSegment = false;
    const W = canvas.width;
    
    // Increment pixel by pixel to draw smoothly
    for (let px = 0; px <= W; px++) {
      const x = getMathX(px);
      let y;
      
      try {
        y = compiled.evaluate({ x: x });
      } catch (e) {
        isDrawingSegment = false;
        continue;
      }
      
      // Filter out non-numbers, infinite, and complex outputs
      if (typeof y !== 'number' || isNaN(y) || !isFinite(y)) {
        isDrawingSegment = false;
        continue;
      }
      
      const py = getPixelY(y);
      
      // Don't draw points extremely far off canvas to avoid coordinate overflow issues
      if (py < -canvas.height || py > canvas.height * 2) {
        isDrawingSegment = false;
        continue;
      }
      
      if (!isDrawingSegment) {
        ctx.moveTo(px, py);
        isDrawingSegment = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  } catch (err) {
    console.warn(`Could not plot function: "${exprStr}":`, err.message);
  }
}

// Mouse dragging / panning logic
function startDrag(e) {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  
  dragXMin = xMin;
  dragXMax = xMax;
  dragYMin = yMin;
  dragYMax = yMax;
}

function handleDragAndTracker(e) {
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  
  // Update coordinate label
  const xVal = getMathX(px);
  const yVal = getMathY(py);
  coordsDisplay.textContent = `x: ${xVal.toFixed(2)}, y: ${yVal.toFixed(2)}`;
  
  if (!isDragging) return;
  
  const dxPix = e.clientX - startX;
  const dyPix = e.clientY - startY;
  
  // Convert pixel delta to coordinate delta
  const scaleX = (dragXMax - dragXMin) / canvas.width;
  const scaleY = (dragYMax - dragYMin) / canvas.height;
  
  const dxMath = dxPix * scaleX;
  const dyMath = dyPix * scaleY;
  
  xMin = dragXMin - dxMath;
  xMax = dragXMax - dxMath;
  yMin = dragYMin + dyMath; // Canvas Y is inverted
  yMax = dragYMax + dyMath;
  
  drawGraph();
}

function stopDrag() {
  isDragging = false;
}

// Touch Drag Helpers (Mobile Panning)
function startDragTouch(e) {
  if (e.touches.length !== 1) return;
  e.preventDefault();
  
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  
  dragXMin = xMin;
  dragXMax = xMax;
  dragYMin = yMin;
  dragYMax = yMax;
}

function handleDragTouch(e) {
  if (!isDragging || e.touches.length !== 1) return;
  e.preventDefault();
  
  const touch = e.touches[0];
  const rect = canvas.getBoundingClientRect();
  const px = touch.clientX - rect.left;
  const py = touch.clientY - rect.top;
  
  const xVal = getMathX(px);
  const yVal = getMathY(py);
  coordsDisplay.textContent = `x: ${xVal.toFixed(2)}, y: ${yVal.toFixed(2)}`;

  const dxPix = touch.clientX - startX;
  const dyPix = touch.clientY - startY;
  
  const scaleX = (dragXMax - dragXMin) / canvas.width;
  const scaleY = (dragYMax - dragYMin) / canvas.height;
  
  const dxMath = dxPix * scaleX;
  const dyMath = dyPix * scaleY;
  
  xMin = dragXMin - dxMath;
  xMax = dragXMax - dxMath;
  yMin = dragYMin + dyMath;
  yMax = dragYMax + dyMath;
  
  drawGraph();
}

// Mouse Wheel Zoom
function handleWheelZoom(e) {
  e.preventDefault();
  
  const rect = canvas.getBoundingClientRect();
  const px = e.clientX - rect.left;
  const py = e.clientY - rect.top;
  
  // Math coordinates of cursor before zoom
  const mouseX = getMathX(px);
  const mouseY = getMathY(py);
  
  // Zoom factor: 1.1 for zoom out, 0.9 for zoom in
  const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
  
  // Re-adjust boundaries around cursor coordinates
  xMin = mouseX - (mouseX - xMin) * zoomFactor;
  xMax = mouseX + (xMax - mouseX) * zoomFactor;
  yMin = mouseY - (mouseY - yMin) * zoomFactor;
  yMax = mouseY + (yMax - mouseY) * zoomFactor;
  
  drawGraph();
}
