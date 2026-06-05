// inequality.js - Inequality Solver Module

let ineqTypeSelect;
let ineqCoeffContainer;
let ineqOpSelect;
let solveBtn;
let ineqSolutionDisplay;
let ineqSolutionContent;

export function initInequality() {
  ineqTypeSelect = document.getElementById('ineqType');
  ineqCoeffContainer = document.getElementById('ineqCoeffContainer');
  ineqOpSelect = document.getElementById('ineqOp');
  solveBtn = document.getElementById('btnSolveInequality');
  ineqSolutionDisplay = document.getElementById('ineqSolutionDisplay');
  ineqSolutionContent = document.getElementById('ineqSolutionContent');

  ineqTypeSelect?.addEventListener('change', () => {
    drawCoefficients();
    ineqSolutionDisplay.classList.add('hidden');
  });

  solveBtn?.addEventListener('click', solveInequality);

  // Initial draw
  drawCoefficients();
}

function drawCoefficients() {
  const type = ineqTypeSelect.value;
  let html = '';
  
  if (type === 'linear') {
    html = `
      <div class="eq-coeff-inputs">
        <div class="coeff-field-group">
          <input type="number" id="ineq_a" class="form-control" value="2" style="width: 70px; text-align: center;">
          <span class="coeff-term">x</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="ineq_b" class="form-control" value="-4" style="width: 70px; text-align: center;">
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="eq-coeff-inputs">
        <div class="coeff-field-group">
          <input type="number" id="ineq_a" class="form-control" value="1" style="width: 70px; text-align: center;">
          <span class="coeff-term">x²</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="ineq_b" class="form-control" value="-5" style="width: 70px; text-align: center;">
          <span class="coeff-term">x</span>
        </div>
        <span class="coeff-term">+</span>
        <div class="coeff-field-group">
          <input type="number" id="ineq_c" class="form-control" value="6" style="width: 70px; text-align: center;">
        </div>
      </div>
    `;
  }
  
  ineqCoeffContainer.innerHTML = html;
}

function solveInequality() {
  const type = ineqTypeSelect.value;
  const op = ineqOpSelect.value;
  let html = '';
  
  try {
    if (type === 'linear') {
      html = solveLinear(op);
    } else {
      html = solveQuadratic(op);
    }
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }
  
  ineqSolutionContent.innerHTML = html;
  ineqSolutionDisplay.classList.remove('hidden');
  ineqSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function solveLinear(op) {
  const a = parseFloat(document.getElementById('ineq_a').value);
  const b = parseFloat(document.getElementById('ineq_b').value);
  
  if (isNaN(a) || isNaN(b)) {
    throw new Error("Please enter valid coefficients.");
  }
  
  let steps = `<div class="solution-step"><strong>Inequality:</strong> ${a}x + (${b}) ${op.replace(/>=/g, '≥').replace(/<=/g, '≤')} 0</div>`;
  
  if (a === 0) {
    const isTrue = evalComparison(b, 0, op);
    if (isTrue) {
      steps += `
        <div class="solution-step">Since a = 0, the expression simplifies to ${b} ${op} 0, which is always true.</div>
        <div class="solution-final">Solution: All Real Numbers (ℝ)<br>Interval: (-∞, +∞)</div>
      `;
    } else {
      steps += `
        <div class="solution-step">Since a = 0, the expression simplifies to ${b} ${op} 0, which is never true.</div>
        <div class="solution-final">Solution: No Solution (∅)</div>
      `;
    }
    return steps;
  }
  
  const bound = -b / a;
  const boundFormatted = math.format(bound, { precision: 6 });
  
  steps += `<div class="solution-step">
    <strong>Step 1: Isolate term</strong><br>
    ${a}x ${op.replace(/>=/g, '≥').replace(/<=/g, '≤')} ${-b}<br><br>
    <strong>Step 2: Divide by coefficient 'a' (${a})</strong><br>
    ${a < 0 ? '<em>Warning: Dividing by a negative flips the operator direction!</em><br>' : ''}
  </div>`;
  
  let algebraicResult = '';
  let intervalResult = '';
  
  if (a > 0) {
    algebraicResult = `x ${op.replace(/>=/g, '≥').replace(/<=/g, '≤')} ${boundFormatted}`;
    if (op === '>') intervalResult = `(${boundFormatted}, +∞)`;
    else if (op === '<') intervalResult = `(-∞, ${boundFormatted})`;
    else if (op === '>=') intervalResult = `[${boundFormatted}, +∞)`;
    else if (op === '<=') intervalResult = `(-∞, ${boundFormatted}]`;
  } else {
    // Flip operator
    const flippedOp = flipOperator(op);
    algebraicResult = `x ${flippedOp.replace(/>=/g, '≥').replace(/<=/g, '≤')} ${boundFormatted}`;
    if (flippedOp === '>') intervalResult = `(${boundFormatted}, +∞)`;
    else if (flippedOp === '<') intervalResult = `(-∞, ${boundFormatted})`;
    else if (flippedOp === '>=') intervalResult = `[${boundFormatted}, +∞)`;
    else if (flippedOp === '<=') intervalResult = `(-∞, ${boundFormatted}]`;
  }
  
  steps += `
    <div class="solution-final">
      Algebraic Solution: ${algebraicResult}<br>
      Interval Notation: ${intervalResult}
    </div>
  `;
  
  return steps;
}

function solveQuadratic(op) {
  const a = parseFloat(document.getElementById('ineq_a').value);
  const b = parseFloat(document.getElementById('ineq_b').value);
  const c = parseFloat(document.getElementById('ineq_c').value);
  
  if (isNaN(a) || isNaN(b) || isNaN(c)) {
    throw new Error("Please enter valid coefficients.");
  }
  
  if (a === 0) {
    throw new Error("Leading coefficient 'a' cannot be 0 for quadratic inequality. Solve as a linear inequality instead!");
  }
  
  let steps = `<div class="solution-step"><strong>Inequality:</strong> ${a}x² + (${b})x + (${c}) ${op.replace(/>=/g, '≥').replace(/<=/g, '≤')} 0</div>`;
  
  // Solve roots
  const disc = b*b - 4*a*c;
  steps += `<div class="solution-step">
    <strong>Step 1: Find roots of ax² + bx + c = 0</strong><br>
    Discriminant (D) = b² - 4ac = (${b})² - 4·(${a})·(${c}) = ${disc}
  </div>`;
  
  let algebraicResult = '';
  let intervalResult = '';
  
  if (disc > 0) {
    const root1 = (-b - Math.sqrt(disc)) / (2 * a);
    const root2 = (-b + Math.sqrt(disc)) / (2 * a);
    const roots = [root1, root2].sort((x, y) => x - y);
    const r1 = math.format(roots[0], { precision: 5 });
    const r2 = math.format(roots[1], { precision: 5 });
    
    steps += `<div class="solution-step">
      D > 0, so there are two real roots:<br>
      r₁ = ${r1}<br>
      r₂ = ${r2}<br><br>
      <strong>Step 2: Sign analysis on intervals</strong><br>
      - Interval (-∞, ${r1}): sign is same as a (${a > 0 ? '+' : '-'})<br>
      - Interval (${r1}, ${r2}): sign is opposite to a (${a > 0 ? '-' : '+'})<br>
      - Interval (${r2}, +∞): sign is same as a (${a > 0 ? '+' : '-'})
    </div>`;
    
    // Choose intervals
    if (a > 0) {
      if (op === '>') {
        algebraicResult = `x < ${r1} or x > ${r2}`;
        intervalResult = `(-∞, ${r1}) ∪ (${r2}, +∞)`;
      } else if (op === '<') {
        algebraicResult = `${r1} < x < ${r2}`;
        intervalResult = `(${r1}, ${r2})`;
      } else if (op === '>=') {
        algebraicResult = `x ≤ ${r1} or x ≥ ${r2}`;
        intervalResult = `(-∞, ${r1}] ∪ [${r2}, +∞)`;
      } else if (op === '<=') {
        algebraicResult = `${r1} ≤ x ≤ ${r2}`;
        intervalResult = `[${r1}, ${r2}]`;
      }
    } else {
      // a < 0
      if (op === '>') {
        algebraicResult = `${r1} < x < ${r2}`;
        intervalResult = `(${r1}, ${r2})`;
      } else if (op === '<') {
        algebraicResult = `x < ${r1} or x > ${r2}`;
        intervalResult = `(-∞, ${r1}) ∪ (${r2}, +∞)`;
      } else if (op === '>=') {
        algebraicResult = `${r1} ≤ x ≤ ${r2}`;
        intervalResult = `[${r1}, ${r2}]`;
      } else if (op === '<=') {
        algebraicResult = `x ≤ ${r1} or x ≥ ${r2}`;
        intervalResult = `(-∞, ${r1}] ∪ [${r2}, +∞)`;
      }
    }
  } 
  else if (disc === 0) {
    const rootVal = -b / (2 * a);
    const r = math.format(rootVal, { precision: 5 });
    
    steps += `<div class="solution-step">
      D = 0, so there is one double root:<br>
      r = ${r}<br><br>
      <strong>Step 2: Sign analysis</strong><br>
      The parabola touches 0 at x = ${r} and has the same sign as a (${a > 0 ? '+' : '-'}) everywhere else.
    </div>`;
    
    if (a > 0) {
      if (op === '>') {
        algebraicResult = `x ≠ ${r}`;
        intervalResult = `(-∞, ${r}) ∪ (${r}, +∞)`;
      } else if (op === '<') {
        algebraicResult = 'No Solution';
        intervalResult = '∅';
      } else if (op === '>=') {
        algebraicResult = 'All Real Numbers';
        intervalResult = '(-∞, +∞)';
      } else if (op === '<=') {
        algebraicResult = `x = ${r}`;
        intervalResult = `[${r}, ${r}]`;
      }
    } else {
      // a < 0
      if (op === '>') {
        algebraicResult = 'No Solution';
        intervalResult = '∅';
      } else if (op === '<') {
        algebraicResult = `x ≠ ${r}`;
        intervalResult = `(-∞, ${r}) ∪ (${r}, +∞)`;
      } else if (op === '>=') {
        algebraicResult = `x = ${r}`;
        intervalResult = `[${r}, ${r}]`;
      } else if (op === '<=') {
        algebraicResult = 'All Real Numbers';
        intervalResult = '(-∞, +∞)';
      }
    }
  } 
  else {
    // disc < 0 (no real roots, completely above or below x-axis)
    steps += `<div class="solution-step">
      D < 0, so there are no real roots.<br>
      The expression is always ${a > 0 ? 'positive' : 'negative'} for all real x.
    </div>`;
    
    if (a > 0) {
      if (op === '>' || op === '>=') {
        algebraicResult = 'All Real Numbers';
        intervalResult = '(-∞, +∞)';
      } else {
        algebraicResult = 'No Solution';
        intervalResult = '∅';
      }
    } else {
      // a < 0
      if (op === '<' || op === '<=') {
        algebraicResult = 'All Real Numbers';
        intervalResult = '(-∞, +∞)';
      } else {
        algebraicResult = 'No Solution';
        intervalResult = '∅';
      }
    }
  }
  
  steps += `
    <div class="solution-final">
      Algebraic Solution: ${algebraicResult}<br>
      Interval Notation: ${intervalResult}
    </div>
  `;
  
  return steps;
}

function flipOperator(op) {
  if (op === '>') return '<';
  if (op === '<') return '>';
  if (op === '>=') return '<=';
  if (op === '<=') return '>=';
  return op;
}

function evalComparison(val1, val2, op) {
  if (op === '>') return val1 > val2;
  if (op === '<') return val1 < val2;
  if (op === '>=') return val1 >= val2;
  if (op === '<=') return val1 <= val2;
  return false;
}
