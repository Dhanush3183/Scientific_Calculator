// equations.js - Polynomial & Linear System Solver

let eqTypeSelect;
let eqInputSection;
let eqSolveBtn;
let eqSolutionDisplay;
let eqSolutionContent;

export function initEquations() {
  eqTypeSelect = document.getElementById('equationType');
  eqInputSection = document.getElementById('eqInputSection');
  eqSolveBtn = document.getElementById('btnSolveEquation');
  eqSolutionDisplay = document.getElementById('eqSolutionDisplay');
  eqSolutionContent = document.getElementById('eqSolutionContent');

  // Trigger input layout generation on select change
  eqTypeSelect?.addEventListener('change', () => {
    generateInputForm(eqTypeSelect.value);
    eqSolutionDisplay.classList.add('hidden');
  });

  // Solve button trigger
  eqSolveBtn?.addEventListener('click', solveEquation);

  // Generate initial form
  generateInputForm('quadratic');
}

// Generate input textboxes based on equation type
function generateInputForm(type) {
  if (!eqInputSection) return;

  let html = '';

  if (type === 'quadratic') {
    html = `
      <div class="eq-coeff-inputs">
        <div class="coeff-field-group">
          <input type="number" id="coeff_a" class="form-control" value="1">
          <span class="coeff-term">x²</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_b" class="form-control" value="-5">
          <span class="coeff-term">x</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_c" class="form-control" value="6">
        </div>
        <span class="coeff-term">= 0</span>
      </div>
    `;
  } else if (type === 'cubic') {
    html = `
      <div class="eq-coeff-inputs">
        <div class="coeff-field-group">
          <input type="number" id="coeff_a" class="form-control" value="1">
          <span class="coeff-term">x³</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_b" class="form-control" value="-6">
          <span class="coeff-term">x²</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_c" class="form-control" value="11">
          <span class="coeff-term">x</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_d" class="form-control" value="-6">
        </div>
        <span class="coeff-term">= 0</span>
      </div>
    `;
  } else if (type === 'quartic') {
    html = `
      <div class="eq-coeff-inputs">
        <div class="coeff-field-group">
          <input type="number" id="coeff_a" class="form-control" value="1">
          <span class="coeff-term">x⁴</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_b" class="form-control" value="-10">
          <span class="coeff-term">x³</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_c" class="form-control" value="35">
          <span class="coeff-term">x²</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_d" class="form-control" value="-50">
          <span class="coeff-term">x</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="coeff_e" class="form-control" value="24">
        </div>
        <span class="coeff-term">= 0</span>
      </div>
    `;
  } else if (type === 'linear2') {
    html = `
      <div class="linear-eqs-grid">
        <h5>Enter equations of the form: ax + by = c</h5>
        <div class="linear-eq-row">
          <span>Eq 1:</span>
          <input type="number" id="a1" value="2"><span>x</span>
          <span>+</span>
          <input type="number" id="b1" value="1"><span>y</span>
          <span>=</span>
          <input type="number" id="c1" value="8">
        </div>
        <div class="linear-eq-row">
          <span>Eq 2:</span>
          <input type="number" id="a2" value="1"><span>x</span>
          <span>+</span>
          <input type="number" id="b2" value="-1"><span>y</span>
          <span>=</span>
          <input type="number" id="c2" value="1">
        </div>
      </div>
    `;
  } else if (type === 'linear3') {
    html = `
      <div class="linear-eqs-grid">
        <h5>Enter equations of the form: ax + by + cz = d</h5>
        <div class="linear-eq-row">
          <span>Eq 1:</span>
          <input type="number" id="a1" value="1"><span>x</span> <span>+</span>
          <input type="number" id="b1" value="1"><span>y</span> <span>+</span>
          <input type="number" id="c1" value="1"><span>z</span> <span>=</span>
          <input type="number" id="d1" value="6">
        </div>
        <div class="linear-eq-row">
          <span>Eq 2:</span>
          <input type="number" id="a2" value="0"><span>x</span> <span>+</span>
          <input type="number" id="b2" value="2"><span>y</span> <span>+</span>
          <input type="number" id="c2" value="5"><span>z</span> <span>=</span>
          <input type="number" id="d2" value="-4">
        </div>
        <div class="linear-eq-row">
          <span>Eq 3:</span>
          <input type="number" id="a3" value="2"><span>x</span> <span>+</span>
          <input type="number" id="b3" value="5"><span>y</span> <span>+</span>
          <input type="number" id="c3" value="-1"><span>z</span> <span>=</span>
          <input type="number" id="d3" value="27">
        </div>
      </div>
    `;
  } else if (type === 'linear4') {
    html = `
      <div class="linear-eqs-grid">
        <h5>Enter equations of the form: ax + by + cz + dw = e</h5>
        <div class="linear-eq-row">
          <span>Eq 1:</span>
          <input type="number" id="a1" value="1"><span>x</span> <span>+</span>
          <input type="number" id="b1" value="1"><span>y</span> <span>+</span>
          <input type="number" id="c1" value="1"><span>z</span> <span>+</span>
          <input type="number" id="d1" value="1"><span>w</span> <span>=</span>
          <input type="number" id="e1" value="10">
        </div>
        <div class="linear-eq-row">
          <span>Eq 2:</span>
          <input type="number" id="a2" value="2"><span>x</span> <span>+</span>
          <input type="number" id="b2" value="-1"><span>y</span> <span>+</span>
          <input type="number" id="c2" value="3"><span>z</span> <span>+</span>
          <input type="number" id="d2" value="-1"><span>w</span> <span>=</span>
          <input type="number" id="e2" value="5">
        </div>
        <div class="linear-eq-row">
          <span>Eq 3:</span>
          <input type="number" id="a3" value="-1"><span>x</span> <span>+</span>
          <input type="number" id="b3" value="3"><span>y</span> <span>+</span>
          <input type="number" id="c3" value="-1"><span>z</span> <span>+</span>
          <input type="number" id="d3" value="2"><span>w</span> <span>=</span>
          <input type="number" id="e3" value="15">
        </div>
        <div class="linear-eq-row">
          <span>Eq 4:</span>
          <input type="number" id="a4" value="3"><span>x</span> <span>+</span>
          <input type="number" id="b4" value="0"><span>y</span> <span>+</span>
          <input type="number" id="c4" value="1"><span>z</span> <span>+</span>
          <input type="number" id="d4" value="-2"><span>w</span> <span>=</span>
          <input type="number" id="e4" value="-3">
        </div>
      </div>
    `;
  }

  eqInputSection.innerHTML = html;
}

// Solve routing
function solveEquation() {
  const type = eqTypeSelect.value;
  let htmlResult = '';

  if (['quadratic', 'cubic', 'quartic'].includes(type)) {
    htmlResult = solvePolynomial(type);
  } else {
    htmlResult = solveLinearSystem(type);
  }

  eqSolutionContent.innerHTML = htmlResult;
  eqSolutionDisplay.classList.remove('hidden');
  
  // Smooth scroll to solution
  eqSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Polynomial Equation Solver (Durand-Kerner)
function solvePolynomial(type) {
  let coeffs = [];
  let a, b, c, d, e;

  if (type === 'quadratic') {
    a = parseFloat(document.getElementById('coeff_a').value);
    b = parseFloat(document.getElementById('coeff_b').value);
    c = parseFloat(document.getElementById('coeff_c').value);
    if (isNaN(a) || isNaN(b) || isNaN(c)) return '<div class="solution-step">Please enter valid coefficients.</div>';
    if (a === 0) return '<div class="solution-step">A quadratic leading coefficient "a" cannot be 0. Solve as a linear equation instead!</div>';
    coeffs = [c, b, a]; // index matches power
  } else if (type === 'cubic') {
    a = parseFloat(document.getElementById('coeff_a').value);
    b = parseFloat(document.getElementById('coeff_b').value);
    c = parseFloat(document.getElementById('coeff_c').value);
    d = parseFloat(document.getElementById('coeff_d').value);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) return '<div class="solution-step">Please enter valid coefficients.</div>';
    if (a === 0) return '<div class="solution-step">Leading coefficient "a" cannot be 0.</div>';
    coeffs = [d, c, b, a];
  } else if (type === 'quartic') {
    a = parseFloat(document.getElementById('coeff_a').value);
    b = parseFloat(document.getElementById('coeff_b').value);
    c = parseFloat(document.getElementById('coeff_c').value);
    d = parseFloat(document.getElementById('coeff_d').value);
    e = parseFloat(document.getElementById('coeff_e').value);
    if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d) || isNaN(e)) return '<div class="solution-step">Please enter valid coefficients.</div>';
    if (a === 0) return '<div class="solution-step">Leading coefficient "a" cannot be 0.</div>';
    coeffs = [e, d, c, b, a];
  }

  const n = coeffs.length - 1; // degree
  let stepsHTML = '';

  // Write out the initial equation
  let eqStr = '';
  for (let idx = n; idx >= 0; idx--) {
    let cf = coeffs[idx];
    if (cf === 0) continue;
    let sign = cf > 0 ? (idx === n ? '' : '+ ') : '- ';
    let absCf = Math.abs(cf);
    let cfStr = absCf === 1 && idx > 0 ? '' : absCf;
    let term = idx === 0 ? absCf : (idx === 1 ? 'x' : `x<sup>${idx}</sup>`);
    if (idx > 0 && absCf === 1) term = (idx === 1 ? 'x' : `x<sup>${idx}</sup>`);
    eqStr += `${sign}${cfStr}${term} `;
  }
  eqStr += '= 0';
  
  stepsHTML += `<div class="solution-step"><strong>Polynomial:</strong> ${eqStr}</div>`;

  // Quadratic has a nice closed-form steps showcase
  if (type === 'quadratic') {
    const disc = b * b - 4 * a * c;
    stepsHTML += `<div class="solution-step"><strong>Step 1: Calculate Discriminant (D)</strong><br>
      D = b² - 4ac<br>
      D = (${b})² - 4 × (${a}) × (${c}) = ${disc}</div>`;
    
    if (disc > 0) {
      const r1 = (-b + Math.sqrt(disc)) / (2 * a);
      const r2 = (-b - Math.sqrt(disc)) / (2 * a);
      stepsHTML += `
        <div class="solution-step"><strong>Step 2: Distinct Real Roots (D > 0)</strong><br>
          x = (-b ± √D) / 2a<br>
          x₁ = (-(${b}) + √${disc}) / (2 × ${a}) = ${r1.toFixed(6)}<br>
          x₂ = (-(${b}) - √${disc}) / (2 × ${a}) = ${r2.toFixed(6)}
        </div>
        <div class="solution-final">
          x₁ = ${math.format(r1, {precision: 8})}<br>
          x₂ = ${math.format(r2, {precision: 8})}
        </div>
      `;
    } else if (disc === 0) {
      const r = -b / (2 * a);
      stepsHTML += `
        <div class="solution-step"><strong>Step 2: Double Real Root (D = 0)</strong><br>
          x = -b / 2a<br>
          x = -(${b}) / (2 × ${a}) = ${r.toFixed(6)}
        </div>
        <div class="solution-final">
          x = ${math.format(r, {precision: 8})} (multiplicity 2)
        </div>
      `;
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-disc) / (2 * a);
      stepsHTML += `
        <div class="solution-step"><strong>Step 2: Complex Conjugate Roots (D &lt; 0)</strong><br>
          x = (-b ± i√|D|) / 2a<br>
          x₁ = ${realPart.toFixed(6)} + ${imagPart.toFixed(6)}i<br>
          x₂ = ${realPart.toFixed(6)} - ${imagPart.toFixed(6)}i
        </div>
        <div class="solution-final">
          x₁ = ${math.format(realPart, {precision: 6})} + ${math.format(imagPart, {precision: 6})}i<br>
          x₂ = ${math.format(realPart, {precision: 6})} - ${math.format(imagPart, {precision: 6})}i
        </div>
      `;
    }
    return stepsHTML;
  }

  // Use Durand-Kerner algorithm for degree >= 3 roots (supports complex numbers)
  stepsHTML += `<div class="solution-step"><strong>Durand-Kerner Convergence method:</strong> Approximating all roots in complex domain...</div>`;
  const roots = durandKerner(coeffs);
  
  stepsHTML += `<div class="solution-step"><strong>Calculated Roots:</strong></div>`;
  
  let finalHTML = '';
  roots.forEach((root, index) => {
    let re = root.re;
    let im = root.im;
    
    // Cleanup small values
    if (Math.abs(re) < 1e-12) re = 0;
    if (Math.abs(im) < 1e-12) im = 0;
    
    let rootStr = '';
    if (im === 0) {
      rootStr = math.format(re, { precision: 8 });
    } else {
      let sign = im > 0 ? '+' : '-';
      rootStr = `${math.format(re, { precision: 8 })} ${sign} ${math.format(Math.abs(im), { precision: 8 })}i`;
    }
    
    finalHTML += `x<sub>${index+1}</sub> = ${rootStr}<br>`;
  });

  stepsHTML += `<div class="solution-final">${finalHTML}</div>`;
  return stepsHTML;
}

// Durand-Kerner polynomial complex roots solver
function durandKerner(coeffs) {
  const n = coeffs.length - 1; // Degree
  
  // Normalize coefficients so leading coefficient is 1
  const leading = coeffs[n];
  const aCoeffs = coeffs.map(c => c / leading); // index 0 is c0, index n is 1
  
  // Polynomial evaluation function at complex input z
  function evalPoly(z) {
    let sum = math.complex(0, 0);
    for (let i = 0; i <= n; i++) {
      let term = math.multiply(aCoeffs[i], math.pow(z, i));
      sum = math.add(sum, term);
    }
    return sum;
  }

  // Initial guesses: complex values arranged in spiral to break symmetry
  let roots = [];
  const initVal = math.complex(0.4, 0.9);
  for (let i = 0; i < n; i++) {
    roots.push(math.pow(initVal, i));
  }

  // Iterate to converge
  const maxIterations = 150;
  const tolerance = 1e-13;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    let maxDiff = 0;
    let nextRoots = [...roots];

    for (let i = 0; i < n; i++) {
      let num = evalPoly(roots[i]);
      let den = math.complex(1, 0);
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          den = math.multiply(den, math.subtract(roots[i], roots[j]));
        }
      }
      let correction = math.divide(num, den);
      nextRoots[i] = math.subtract(roots[i], correction);
      
      let diff = math.abs(correction);
      if (diff > maxDiff) maxDiff = diff;
    }

    roots = nextRoots;
    if (maxDiff < tolerance) break;
  }

  return roots;
}

// Solve linear equations system
function solveLinearSystem(type) {
  let A = [];
  let B = [];
  let vars = [];

  if (type === 'linear2') {
    const a1 = parseFloat(document.getElementById('a1').value);
    const b1 = parseFloat(document.getElementById('b1').value);
    const c1 = parseFloat(document.getElementById('c1').value);
    const a2 = parseFloat(document.getElementById('a2').value);
    const b2 = parseFloat(document.getElementById('b2').value);
    const c2 = parseFloat(document.getElementById('c2').value);
    
    if ([a1,b1,c1,a2,b2,c2].some(isNaN)) return '<div class="solution-step">Please enter valid coefficients.</div>';
    
    A = [[a1, b1], [a2, b2]];
    B = [c1, c2];
    vars = ['x', 'y'];
  } else if (type === 'linear3') {
    const a1 = parseFloat(document.getElementById('a1').value);
    const b1 = parseFloat(document.getElementById('b1').value);
    const c1 = parseFloat(document.getElementById('c1').value);
    const d1 = parseFloat(document.getElementById('d1').value);

    const a2 = parseFloat(document.getElementById('a2').value);
    const b2 = parseFloat(document.getElementById('b2').value);
    const c2 = parseFloat(document.getElementById('c2').value);
    const d2 = parseFloat(document.getElementById('d2').value);

    const a3 = parseFloat(document.getElementById('a3').value);
    const b3 = parseFloat(document.getElementById('b3').value);
    const c3 = parseFloat(document.getElementById('c3').value);
    const d3 = parseFloat(document.getElementById('d3').value);

    if ([a1,b1,c1,d1,a2,b2,c2,d2,a3,b3,c3,d3].some(isNaN)) return '<div class="solution-step">Please enter valid coefficients.</div>';

    A = [[a1, b1, c1], [a2, b2, c2], [a3, b3, c3]];
    B = [d1, d2, d3];
    vars = ['x', 'y', 'z'];
  } else if (type === 'linear4') {
    const coeffs = [];
    const constants = [];
    
    for (let r = 1; r <= 4; r++) {
      const a = parseFloat(document.getElementById(`a${r}`).value);
      const b = parseFloat(document.getElementById(`b${r}`).value);
      const c = parseFloat(document.getElementById(`c${r}`).value);
      const d = parseFloat(document.getElementById(`d${r}`).value);
      const e = parseFloat(document.getElementById(`e${r}`).value);
      
      if ([a,b,c,d,e].some(isNaN)) return '<div class="solution-step">Please enter valid coefficients.</div>';
      
      coeffs.push([a, b, c, d]);
      constants.push(e);
    }
    
    A = coeffs;
    B = constants;
    vars = ['x', 'y', 'z', 'w'];
  }

  let stepsHTML = `<div class="solution-step"><strong>System Representation Matrix:</strong><br>
    M = [${A.map(row => '[' + row.join(', ') + ']').join(', ')}]<br>
    V = [${B.join(', ')}]</div>`;

  try {
    // Solve via math.lusolve
    const solution = math.lusolve(A, B);
    
    let resultHTML = '';
    solution.forEach((val, idx) => {
      // Flatten math.js column matrix response
      const v = Array.isArray(val) ? val[0] : val;
      resultHTML += `${vars[idx]} = ${math.format(v, { precision: 8 })}<br>`;
    });

    stepsHTML += `<div class="solution-step">Solving matrix equation M · X = V using LU Decomposition...</div>`;
    stepsHTML += `<div class="solution-final">${resultHTML}</div>`;
  } catch (err) {
    stepsHTML += `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> Matrix is singular or has no unique solution. (Determinant may be zero).
    </div>`;
  }

  return stepsHTML;
}
