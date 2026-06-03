// calculus.js - Calculus & Advanced Series Module

let calcTabs;
let subPanels;
let btnSolve;
let calcResultDisplay;
let calcResultContent;

// Inputs
let intLower, intUpper, intExpr;
let derivExpr, derivPoint, derivOrder;
let limExpr, limPoint;
let seriesTypeSum, seriesUpper, seriesLower, seriesExpr;

let currentCalcMode = 'integral';

export function initCalculus() {
  calcTabs = document.querySelectorAll('.calc-tab');
  subPanels = document.querySelectorAll('.calculus-sub-panel');
  btnSolve = document.getElementById('btnSolveCalculus');
  calcResultDisplay = document.getElementById('calcSolutionDisplay');
  calcResultContent = document.getElementById('calcResultContent');

  // Input elements
  intLower = document.getElementById('intLower');
  intUpper = document.getElementById('intUpper');
  intExpr = document.getElementById('intExpr');
  
  derivExpr = document.getElementById('derivExpr');
  derivPoint = document.getElementById('derivPoint');
  derivOrder = document.getElementById('derivOrder');
  
  limExpr = document.getElementById('limExpr');
  limPoint = document.getElementById('limPoint');
  
  seriesTypeSum = document.querySelector('input[name="seriesType"][value="sum"]');
  seriesUpper = document.getElementById('seriesUpper');
  seriesLower = document.getElementById('seriesLower');
  seriesExpr = document.getElementById('seriesExpr');

  // Bind tab switching
  calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calcTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetMode = tab.getAttribute('data-calc');
      currentCalcMode = targetMode;

      subPanels.forEach(panel => panel.classList.add('hidden'));
      
      if (targetMode === 'integral') {
        document.getElementById('calcIntegralPanel').classList.remove('hidden');
      } else if (targetMode === 'derivative') {
        document.getElementById('calcDerivativePanel').classList.remove('hidden');
      } else if (targetMode === 'limit') {
        document.getElementById('calcLimitPanel').classList.remove('hidden');
      } else if (targetMode === 'series') {
        document.getElementById('calcSeriesPanel').classList.remove('hidden');
      }
      
      calcResultDisplay.classList.add('hidden');
    });
  });

  // Derivative order display updates
  derivOrder?.addEventListener('change', () => {
    const order = derivOrder.value;
    document.getElementById('derivOrderLabel').textContent = order === '2' ? '2' : '';
    document.getElementById('derivOrderPower').textContent = order === '2' ? '2' : '';
  });

  // Calculate trigger
  btnSolve?.addEventListener('click', calculateCalculus);
}

function calculateCalculus() {
  let resultHTML = '';
  
  try {
    if (currentCalcMode === 'integral') {
      resultHTML = solveIntegral();
    } else if (currentCalcMode === 'derivative') {
      resultHTML = solveDerivative();
    } else if (currentCalcMode === 'limit') {
      resultHTML = solveLimit();
    } else if (currentCalcMode === 'series') {
      resultHTML = solveSeries();
    }
  } catch (err) {
    resultHTML = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  calcResultContent.innerHTML = resultHTML;
  calcResultDisplay.classList.remove('hidden');
  calcResultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Numerical Definite Integration (Simpson's 1/3 Rule)
function solveIntegral() {
  const expr = intExpr.value.trim();
  const lowerStr = intLower.value.trim();
  const upperStr = intUpper.value.trim();
  
  if (!expr || !lowerStr || !upperStr) {
    throw new Error("All fields must be filled.");
  }

  // Parse bounds (can be expressions like pi, sqrt(2), etc.)
  const a = math.evaluate(lowerStr);
  const b = math.evaluate(upperStr);
  
  if (typeof a !== 'number' || typeof b !== 'number' || isNaN(a) || isNaN(b)) {
    throw new Error("Lower and upper bounds must evaluate to real numbers.");
  }

  // Compile equation
  const compiled = math.compile(expr);
  
  // Numerical Integration using Composite Simpson's Rule
  // We use 1000 intervals (even number)
  const N = 1000;
  const h = (b - a) / N;
  
  let f_a, f_b;
  try {
    f_a = compiled.evaluate({ x: a });
    f_b = compiled.evaluate({ x: b });
  } catch (e) {
    throw new Error("Could not evaluate function at bounds. Ensure variables are written as 'x'.");
  }

  let sumOdd = 0;
  let sumEven = 0;

  for (let i = 1; i < N; i++) {
    const x_val = a + i * h;
    let y_val = compiled.evaluate({ x: x_val });
    
    // Check if result is real number
    if (typeof y_val !== 'number' || isNaN(y_val)) {
      throw new Error(`Function undefined or non-real at x = ${x_val}`);
    }

    if (i % 2 === 0) {
      sumEven += y_val;
    } else {
      sumOdd += y_val;
    }
  }

  const integral = (h / 3) * (f_a + 4 * sumOdd + 2 * sumEven + f_b);
  
  return `
    <div class="solution-step">
      <strong>Problem:</strong> ∫<sub>${lowerStr}</sub><sup>${upperStr}</sup> (${expr}) dx
    </div>
    <div class="solution-step">
      <strong>Integration Details:</strong><br>
      • Lower bound (a) = ${math.format(a, {precision: 6})}<br>
      • Upper bound (b) = ${math.format(b, {precision: 6})}<br>
      • Step size (h) = ${math.format(h, {precision: 5})}<br>
      • Computed numerically using Composite Simpson's Rule (N = 1000).
    </div>
    <div class="solution-final">
      Result ≈ ${math.format(integral, { precision: 10 })}
    </div>
  `;
}

// Numerical Derivative (Central Differences)
function solveDerivative() {
  const expr = derivExpr.value.trim();
  const pointStr = derivPoint.value.trim();
  const order = parseInt(derivOrder.value);
  
  if (!expr || !pointStr) {
    throw new Error("All fields must be filled.");
  }

  const x0 = math.evaluate(pointStr);
  if (typeof x0 !== 'number' || isNaN(x0)) {
    throw new Error("Evaluation point x must be a real number.");
  }

  const compiled = math.compile(expr);
  const evalAt = (xVal) => {
    const res = compiled.evaluate({ x: xVal });
    if (typeof res !== 'number' || isNaN(res)) {
      throw new Error(`Function is undefined or returns non-real at x = ${xVal}`);
    }
    return res;
  };

  let deriv = 0;
  let stepsText = '';
  
  if (order === 1) {
    // 1st Derivative: Central Difference O(h^4)
    const h = 1e-5;
    const f1 = evalAt(x0 + h);
    const f2 = evalAt(x0 - h);
    const f3 = evalAt(x0 + 2 * h);
    const f4 = evalAt(x0 - 2 * h);
    
    // Five-point stencil formula
    deriv = (-f3 + 8 * f1 - 8 * f2 + f4) / (12 * h);
    
    stepsText = `
      • Calculated first derivative f'(x) at x₀ = ${x0}<br>
      • Used five-point stencil method for O(h⁴) numerical precision (h = 10⁻⁵)
    `;
  } else {
    // 2nd Derivative: Central Difference O(h^2)
    const h = 1e-4;
    const f0 = evalAt(x0);
    const f_plus = evalAt(x0 + h);
    const f_minus = evalAt(x0 - h);
    
    deriv = (f_plus - 2 * f0 + f_minus) / (h * h);
    
    stepsText = `
      • Calculated second derivative f''(x) at x₀ = ${x0}<br>
      • Used central second-difference formula: (f(x+h) - 2f(x) + f(x-h)) / h² (h = 10⁻⁴)
    `;
  }

  return `
    <div class="solution-step">
      <strong>Problem:</strong> Find ${order === 1 ? "f'(x)" : "f''(x)"} of (${expr}) at x = ${pointStr}
    </div>
    <div class="solution-step">
      <strong>Calculus Steps:</strong><br>
      ${stepsText}
    </div>
    <div class="solution-final">
      Result ≈ ${math.format(deriv, { precision: 9 })}
    </div>
  `;
}

// Numerical Limit approximation
function solveLimit() {
  const expr = limExpr.value.trim();
  const pointStr = limPoint.value.trim();
  
  if (!expr || !pointStr) {
    throw new Error("All fields must be filled.");
  }

  const c = math.evaluate(pointStr);
  if (typeof c !== 'number' || isNaN(c)) {
    throw new Error("Point c must evaluate to a real number.");
  }

  const compiled = math.compile(expr);
  const evalAt = (xVal) => {
    try {
      const res = compiled.evaluate({ x: xVal });
      return typeof res === 'number' && !isNaN(res) ? res : null;
    } catch (e) {
      return null;
    }
  };

  // Evaluate steps closer to c from left and right
  const steps = [1e-3, 1e-5, 1e-7, 1e-9];
  
  let leftVals = [];
  let rightVals = [];
  
  steps.forEach(h => {
    const lVal = evalAt(c - h);
    const rVal = evalAt(c + h);
    if (lVal !== null) leftVals.push({ h, val: lVal });
    if (rVal !== null) rightVals.push({ h, val: rVal });
  });

  if (leftVals.length === 0 && rightVals.length === 0) {
    throw new Error("Function could not be evaluated around the point.");
  }

  const leftLimit = leftVals.length > 0 ? leftVals[leftVals.length - 1].val : null;
  const rightLimit = rightVals.length > 0 ? rightVals[rightVals.length - 1].val : null;

  let stepsHTML = `<div class="solution-step"><strong>Problem:</strong> lim<sub>x → ${pointStr}</sub> (${expr})</div>`;
  
  stepsHTML += `<div class="solution-step"><strong>Approximations:</strong><br>`;
  if (leftVals.length > 0) {
    stepsHTML += `• Left Limit approximation (x → c⁻):<br>`;
    leftVals.forEach(item => {
      stepsHTML += `  - at x = c - ${item.h} : f(x) = ${math.format(item.val, {precision: 7})}<br>`;
    });
  }
  if (rightVals.length > 0) {
    stepsHTML += `<br>• Right Limit approximation (x → c⁺):<br>`;
    rightVals.forEach(item => {
      stepsHTML += `  - at x = c + ${item.h} : f(x) = ${math.format(item.val, {precision: 7})}<br>`;
    });
  }
  stepsHTML += `</div>`;

  // Compare left and right limit convergence
  if (leftLimit !== null && rightLimit !== null) {
    const diff = Math.abs(leftLimit - rightLimit);
    if (diff < 1e-3) {
      const limitVal = (leftLimit + rightLimit) / 2;
      stepsHTML += `<div class="solution-final">Limit exists!<br>L ≈ ${math.format(limitVal, { precision: 8 })}</div>`;
    } else {
      stepsHTML += `<div class="solution-final" style="color: var(--accent-danger)">
        Limit does not exist (Diverges).<br>
        Left approximation: ${math.format(leftLimit, {precision: 5})}<br>
        Right approximation: ${math.format(rightLimit, {precision: 5})}
      </div>`;
    }
  } else if (leftLimit !== null) {
    stepsHTML += `<div class="solution-final">One-sided Left Limit exists (Right side undefined):<br>L ≈ ${math.format(leftLimit, { precision: 8 })}</div>`;
  } else {
    stepsHTML += `<div class="solution-final">One-sided Right Limit exists (Left side undefined):<br>L ≈ ${math.format(rightLimit, { precision: 8 })}</div>`;
  }

  return stepsHTML;
}

// Summation & Product Series Solver
function solveSeries() {
  const isSum = seriesTypeSum.checked;
  const expr = seriesExpr.value.trim();
  const lowerStr = seriesLower.value.trim();
  const upperStr = seriesUpper.value.trim();

  if (!expr || !lowerStr || !upperStr) {
    throw new Error("All fields must be filled.");
  }

  const start = parseInt(math.evaluate(lowerStr));
  const end = parseInt(math.evaluate(upperStr));

  if (isNaN(start) || isNaN(end)) {
    throw new Error("Start and End bounds must evaluate to integers.");
  }

  if (end < start) {
    throw new Error("Upper bound must be greater than or equal to lower bound.");
  }

  // Safety Cap to prevent freezing browser
  const range = end - start;
  if (range > 100000) {
    throw new Error("Range is too large. Limit series calculations to a range of 100,000 steps.");
  }

  const compiled = math.compile(expr);
  let total = isSum ? 0 : 1;
  
  for (let n = start; n <= end; n++) {
    let term;
    try {
      term = compiled.evaluate({ n: n });
    } catch (e) {
      throw new Error(`Failed to evaluate term at n = ${n}. Ensure variable is 'n'.`);
    }
    
    if (typeof term !== 'number' || isNaN(term)) {
      throw new Error(`Term is non-real or undefined at n = ${n}`);
    }

    if (isSum) {
      total += term;
    } else {
      total *= term;
    }
  }

  const symbol = isSum ? '∑' : '∏';
  const name = isSum ? 'Summation' : 'Product';

  return `
    <div class="solution-step">
      <strong>Problem:</strong> ${symbol}<sub>n=${start}</sub><sup>${end}</sup> (${expr})
    </div>
    <div class="solution-step">
      <strong>Series Evaluation Details:</strong><br>
      • Type: ${name}<br>
      • Bounds: n = ${start} to ${end} (${range + 1} steps)<br>
      • Calculated iteratively.
    </div>
    <div class="solution-final">
      Result = ${math.format(total, { precision: 12 })}
    </div>
  `;
}
