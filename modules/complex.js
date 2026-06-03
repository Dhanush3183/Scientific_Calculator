// complex.js - Complex Number Calculator Module

let z1RealEl, z1ImagEl;
let z2RealEl, z2ImagEl;
let complexSolutionDisplay;
let complexResultContent;

export function initComplex() {
  z1RealEl = document.getElementById('compZ1Real');
  z1ImagEl = document.getElementById('compZ1Imag');
  z2RealEl = document.getElementById('compZ2Real');
  z2ImagEl = document.getElementById('compZ2Imag');
  complexSolutionDisplay = document.getElementById('complexSolutionDisplay');
  complexResultContent = document.getElementById('complexResultContent');

  // Operations binding
  document.getElementById('btnCompAdd')?.addEventListener('click', () => solveComplex('add'));
  document.getElementById('btnCompSub')?.addEventListener('click', () => solveComplex('sub'));
  document.getElementById('btnCompMul')?.addEventListener('click', () => solveComplex('mul'));
  document.getElementById('btnCompDiv')?.addEventListener('click', () => solveComplex('div'));
  document.getElementById('btnCompPolar')?.addEventListener('click', () => solveComplex('polar'));
  document.getElementById('btnCompConj')?.addEventListener('click', () => solveComplex('conj'));
}

function getComplexInputs() {
  const r1 = parseFloat(z1RealEl.value);
  const i1 = parseFloat(z1ImagEl.value);
  const r2 = parseFloat(z2RealEl.value);
  const i2 = parseFloat(z2ImagEl.value);
  
  if (isNaN(r1) || isNaN(i1) || isNaN(r2) || isNaN(i2)) {
    throw new Error("Please enter valid real and imaginary coefficients.");
  }
  
  const z1 = math.complex(r1, i1);
  const z2 = math.complex(r2, i2);
  
  return { z1, z2 };
}

function solveComplex(op) {
  let html = '';
  
  try {
    const { z1, z2 } = getComplexInputs();
    
    if (op === 'add') {
      const res = math.add(z1, z2);
      html = `
        <div class="solution-step"><strong>Operation:</strong> Complex Addition (Z₁ + Z₂)</div>
        <div class="solution-step">Z₁ + Z₂ = (${z1.re} + ${z1.im}i) + (${z2.re} + ${z2.im}i)</div>
        <div class="solution-final">Z₁ + Z₂ = ${res.toString()}</div>
      `;
    } 
    else if (op === 'sub') {
      const res = math.subtract(z1, z2);
      html = `
        <div class="solution-step"><strong>Operation:</strong> Complex Subtraction (Z₁ - Z₂)</div>
        <div class="solution-step">Z₁ - Z₂ = (${z1.re} + ${z1.im}i) - (${z2.re} + ${z2.im}i)</div>
        <div class="solution-final">Z₁ - Z₂ = ${res.toString()}</div>
      `;
    } 
    else if (op === 'mul') {
      const res = math.multiply(z1, z2);
      // step-by-step
      const stepReal = z1.re * z2.re - z1.im * z2.im;
      const stepImag = z1.re * z2.im + z1.im * z2.re;
      html = `
        <div class="solution-step"><strong>Operation:</strong> Complex Multiplication (Z₁ × Z₂)</div>
        <div class="solution-step">
          Z₁ × Z₂ = (a·c - b·d) + (a·d + b·c)i<br>
          Real part = (${z1.re}·${z2.re} - ${z1.im}·${z2.im}) = ${stepReal}<br>
          Imag part = (${z1.re}·${z2.im} + ${z1.im}·${z2.re}) = ${stepImag}
        </div>
        <div class="solution-final">Z₁ × Z₂ = ${res.toString()}</div>
      `;
    } 
    else if (op === 'div') {
      if (z2.re === 0 && z2.im === 0) throw new Error("Division by zero complex number Z₂ is undefined.");
      const res = math.divide(z1, z2);
      html = `
        <div class="solution-step"><strong>Operation:</strong> Complex Division (Z₁ / Z₂)</div>
        <div class="solution-step">Multiplied by conjugate of Z₂ / conjugate of Z₂: Z₁·Z₂* / |Z₂|²</div>
        <div class="solution-final">Z₁ / Z₂ = ${res.toString()}</div>
      `;
    } 
    else if (op === 'polar') {
      const polar1 = z1.toPolar();
      const polar2 = z2.toPolar();
      
      const phi1Deg = polar1.phi * (180 / Math.PI);
      const phi2Deg = polar2.phi * (180 / Math.PI);

      html = `
        <div class="solution-step"><strong>Polar / Euler representation:</strong></div>
        <div class="solution-step">
          <strong>Z₁:</strong><br>
          • Modulus (r₁) = ${polar1.r.toFixed(5)}<br>
          • Argument (θ₁) = ${polar1.phi.toFixed(5)} rad (${phi1Deg.toFixed(2)}°)<br>
          • Euler Form = ${polar1.r.toFixed(4)} · e<sup>i(${polar1.phi.toFixed(4)})</sup>
        </div>
        <div class="solution-step">
          <strong>Z₂:</strong><br>
          • Modulus (r₂) = ${polar2.r.toFixed(5)}<br>
          • Argument (θ₂) = ${polar2.phi.toFixed(5)} rad (${phi2Deg.toFixed(2)}°)<br>
          • Euler Form = ${polar2.r.toFixed(4)} · e<sup>i(${polar2.phi.toFixed(4)})</sup>
        </div>
        <div class="solution-final">
          Z₁ (polar) ≈ ${polar1.r.toFixed(4)} ∠ ${phi1Deg.toFixed(2)}°<br>
          Z₂ (polar) ≈ ${polar2.r.toFixed(4)} ∠ ${phi2Deg.toFixed(2)}°
        </div>
      `;
    } 
    else if (op === 'conj') {
      const c1 = math.conj(z1);
      const c2 = math.conj(z2);
      html = `
        <div class="solution-step"><strong>Complex Conjugates (Z*):</strong> Reverses sign of imaginary part</div>
        <div class="solution-final">
          Z₁* = ${c1.toString()}<br>
          Z₂* = ${c2.toString()}
        </div>
      `;
    }
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  complexResultContent.innerHTML = html;
  complexSolutionDisplay.classList.remove('hidden');
  complexSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
