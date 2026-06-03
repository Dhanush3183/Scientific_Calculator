// vectors.js - Vector Calculator Module

let vectorDimRadios;
let vectorUInputs;
let vectorVInputs;
let vectorSolutionDisplay;
let vectorResultContent;

export function initVectors() {
  vectorDimRadios = document.querySelectorAll('input[name="vectorDim"]');
  vectorUInputs = document.getElementById('vectorUInputs');
  vectorVInputs = document.getElementById('vectorVInputs');
  vectorSolutionDisplay = document.getElementById('vectorSolutionDisplay');
  vectorResultContent = document.getElementById('vectorResultContent');

  // Bind change of dimension
  vectorDimRadios.forEach(radio => {
    radio.addEventListener('change', drawVectorInputs);
  });

  // Operations binding
  document.getElementById('btnVecAdd')?.addEventListener('click', () => solveVectors('add'));
  document.getElementById('btnVecSub')?.addEventListener('click', () => solveVectors('sub'));
  document.getElementById('btnVecDot')?.addEventListener('click', () => solveVectors('dot'));
  document.getElementById('btnVecCross')?.addEventListener('click', () => solveVectors('cross'));
  document.getElementById('btnVecMag')?.addEventListener('click', () => solveVectors('mag'));
  document.getElementById('btnVecAngle')?.addEventListener('click', () => solveVectors('angle'));
  document.getElementById('btnVecProj')?.addEventListener('click', () => solveVectors('proj'));

  // Initial draw
  drawVectorInputs();
}

function getActiveDim() {
  const activeRadio = Array.from(vectorDimRadios).find(r => r.checked);
  return parseInt(activeRadio ? activeRadio.value : '3');
}

function drawVectorInputs() {
  const dim = getActiveDim();
  
  let uHtml = '';
  let vHtml = '';
  
  if (dim === 2) {
    uHtml = `
      <span>[</span>
      <input type="number" id="vecU_x" class="form-control small-val" value="3" placeholder="Ux">
      <span>,</span>
      <input type="number" id="vecU_y" class="form-control small-val" value="4" placeholder="Uy">
      <span>]</span>
    `;
    vHtml = `
      <span>[</span>
      <input type="number" id="vecV_x" class="form-control small-val" value="1" placeholder="Vx">
      <span>,</span>
      <input type="number" id="vecV_y" class="form-control small-val" value="2" placeholder="Vy">
      <span>]</span>
    `;
  } else {
    uHtml = `
      <span>[</span>
      <input type="number" id="vecU_x" class="form-control small-val" value="1" placeholder="Ux">
      <span>,</span>
      <input type="number" id="vecU_y" class="form-control small-val" value="2" placeholder="Uy">
      <span>,</span>
      <input type="number" id="vecU_z" class="form-control small-val" value="3" placeholder="Uz">
      <span>]</span>
    `;
    vHtml = `
      <span>[</span>
      <input type="number" id="vecV_x" class="form-control small-val" value="4" placeholder="Vx">
      <span>,</span>
      <input type="number" id="vecV_y" class="form-control small-val" value="5" placeholder="Vy">
      <span>,</span>
      <input type="number" id="vecV_z" class="form-control small-val" value="6" placeholder="Vz">
      <span>]</span>
    `;
  }

  vectorUInputs.innerHTML = uHtml;
  vectorVInputs.innerHTML = vHtml;
  vectorSolutionDisplay.classList.add('hidden');
}

function getVectorValues(name) {
  const dim = getActiveDim();
  const values = [];
  
  const x = parseFloat(document.getElementById(`vec${name}_x`).value);
  const y = parseFloat(document.getElementById(`vec${name}_y`).value);
  values.push(isNaN(x) ? 0 : x);
  values.push(isNaN(y) ? 0 : y);
  
  if (dim === 3) {
    const z = parseFloat(document.getElementById(`vec${name}_z`).value);
    values.push(isNaN(z) ? 0 : z);
  }
  
  return values;
}

function solveVectors(op) {
  const U = getVectorValues('U');
  const V = getVectorValues('V');
  const dim = getActiveDim();
  
  let html = '';
  
  try {
    if (op === 'add') {
      const res = U.map((val, i) => val + V[i]);
      html = `
        <div class="solution-step"><strong>Operation:</strong> Addition (U + V)</div>
        <div class="solution-final">U + V = [${res.join(', ')}]</div>
      `;
    } 
    else if (op === 'sub') {
      const res = U.map((val, i) => val - V[i]);
      html = `
        <div class="solution-step"><strong>Operation:</strong> Subtraction (U - V)</div>
        <div class="solution-final">U - V = [${res.join(', ')}]</div>
      `;
    } 
    else if (op === 'dot') {
      const res = U.reduce((sum, val, i) => sum + val * V[i], 0);
      let stepStr = U.map((val, i) => `(${val} × ${V[i]})`).join(' + ');
      html = `
        <div class="solution-step"><strong>Operation:</strong> Dot Product (U · V)</div>
        <div class="solution-step">U · V = ${stepStr}</div>
        <div class="solution-final">U · V = ${res}</div>
      `;
    } 
    else if (op === 'cross') {
      if (dim === 2) {
        // 2D Vector Cross Product (returns scalar Z component)
        const res = U[0] * V[1] - U[1] * V[0];
        html = `
          <div class="solution-step"><strong>Operation:</strong> 2D Cross Product (U × V)</div>
          <div class="solution-step">Computes equivalent Z-component: UxVy - UyVx</div>
          <div class="solution-final">U × V = ${res} (scalar magnitude along Z-axis)</div>
        `;
      } else {
        // 3D Vector Cross Product
        const x = U[1] * V[2] - U[2] * V[1];
        const y = U[2] * V[0] - U[0] * V[2];
        const z = U[0] * V[1] - U[1] * V[0];
        html = `
          <div class="solution-step"><strong>Operation:</strong> 3D Cross Product (U × V)</div>
          <div class="solution-step">
            Ux = (UyVz - UzVy) = (${U[1]}×${V[2]} - ${U[2]}×${V[1]}) = ${x}<br>
            Uy = (UzVx - UxVz) = (${U[2]}×${V[0]} - ${U[0]}×${V[2]}) = ${y}<br>
            Uz = (UxVy - UyVx) = (${U[0]}×${V[1]} - ${U[1]}×${V[0]}) = ${z}
          </div>
          <div class="solution-final">U × V = [${x}, ${y}, ${z}]</div>
        `;
      }
    } 
    else if (op === 'mag') {
      const magU = Math.sqrt(U.reduce((sum, v) => sum + v*v, 0));
      const magV = Math.sqrt(V.reduce((sum, v) => sum + v*v, 0));
      html = `
        <div class="solution-step"><strong>Operation:</strong> Magnitudes</div>
        <div class="solution-step">
          |U| = √(${U.map(v => `${v}²`).join(' + ')})<br>
          |V| = √(${V.map(v => `${v}²`).join(' + ')})
        </div>
        <div class="solution-final">
          |U| ≈ ${math.format(magU, {precision: 8})}<br>
          |V| ≈ ${math.format(magV, {precision: 8})}
        </div>
      `;
    } 
    else if (op === 'angle') {
      const dot = U.reduce((sum, val, i) => sum + val * V[i], 0);
      const magU = Math.sqrt(U.reduce((sum, v) => sum + v*v, 0));
      const magV = Math.sqrt(V.reduce((sum, v) => sum + v*v, 0));
      
      if (magU === 0 || magV === 0) {
        throw new Error("Cannot calculate angle with a zero vector.");
      }
      
      const cosTheta = dot / (magU * magV);
      // Clamp to prevent floating errors outside [-1, 1]
      const clampedCos = Math.max(-1, Math.min(1, cosTheta));
      const rad = Math.acos(clampedCos);
      const deg = rad * (180 / Math.PI);
      
      html = `
        <div class="solution-step"><strong>Operation:</strong> Angle Between Vectors</div>
        <div class="solution-step">
          cos(θ) = (U · V) / (|U| |V|)<br>
          cos(θ) = ${dot} / (${magU.toFixed(4)} × ${magV.toFixed(4)}) ≈ ${clampedCos.toFixed(6)}
        </div>
        <div class="solution-final">
          θ ≈ ${math.format(rad, {precision: 6})} rad<br>
          θ ≈ ${math.format(deg, {precision: 6})}°
        </div>
      `;
    } 
    else if (op === 'proj') {
      const dot = U.reduce((sum, val, i) => sum + val * V[i], 0);
      const magVSqr = V.reduce((sum, v) => sum + v*v, 0);
      
      if (magVSqr === 0) {
        throw new Error("Cannot project onto a zero vector.");
      }
      
      const scale = dot / magVSqr;
      const res = V.map(val => val * scale);
      
      html = `
        <div class="solution-step"><strong>Operation:</strong> Vector Projection (proj<sub>V</sub> U)</div>
        <div class="solution-step">
          proj<sub>V</sub> U = [ (U · V) / |V|² ] × V<br>
          Scale factor = ${dot} / ${magVSqr} ≈ ${scale.toFixed(6)}
        </div>
        <div class="solution-final">proj<sub>V</sub> U = [${res.map(v => math.format(v, {precision: 6})).join(', ')}]</div>
      `;
    }
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  vectorResultContent.innerHTML = html;
  vectorSolutionDisplay.classList.remove('hidden');
  vectorSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
