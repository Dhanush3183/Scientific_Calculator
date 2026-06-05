// ratio.js - Ratio Solver Module

let ratioTabs;
let subPanels;

// Tab Solve buttons
let solveSimplifyBtn;
let solveDivideBtn;
let solveProportionBtn;

// Tab Results Displays
let simplifySolutionDisplay, simplifyResultContent;
let divideSolutionDisplay, divideResultContent;
let proportionSolutionDisplay, proportionResultContent;

// Inputs
let simplifyInput;
let totalInput, dividePartsInput;
let propAInput, propBInput, propCInput, propDInput;

let currentMode = 'simplify';

export function initRatio() {
  ratioTabs = document.querySelectorAll('.ratio-tab');
  subPanels = document.querySelectorAll('.ratio-sub-panel');

  // Query sub-solve buttons
  solveSimplifyBtn = document.getElementById('btnSolveSimplifyRatio');
  solveDivideBtn = document.getElementById('btnSolveDivideRatio');
  solveProportionBtn = document.getElementById('btnSolveProportion');

  // Query sub-results displays
  simplifySolutionDisplay = document.getElementById('ratioSimplifySolutionDisplay');
  simplifyResultContent = document.getElementById('ratioSimplifyResultContent');
  
  divideSolutionDisplay = document.getElementById('ratioDivideSolutionDisplay');
  divideResultContent = document.getElementById('ratioDivideResultContent');

  proportionSolutionDisplay = document.getElementById('ratioProportionSolutionDisplay');
  proportionResultContent = document.getElementById('ratioProportionResultContent');

  simplifyInput = document.getElementById('ratioSimplifyInput');
  totalInput = document.getElementById('ratioTotal');
  dividePartsInput = document.getElementById('ratioDivideParts');
  
  propAInput = document.getElementById('propA');
  propBInput = document.getElementById('propB');
  propCInput = document.getElementById('propC');
  propDInput = document.getElementById('propD');

  // Bind tab switching
  ratioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ratioTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-ratio');
      currentMode = target;

      subPanels.forEach(panel => panel.classList.add('hidden'));

      if (target === 'simplify') {
        document.getElementById('ratioSimplifyPanel').classList.remove('hidden');
      } else if (target === 'divide') {
        document.getElementById('ratioDividePanel').classList.remove('hidden');
      } else if (target === 'proportion') {
        document.getElementById('ratioProportionPanel').classList.remove('hidden');
      }

      // Hide all results displays when switching tabs
      simplifySolutionDisplay?.classList.add('hidden');
      divideSolutionDisplay?.classList.add('hidden');
      proportionSolutionDisplay?.classList.add('hidden');
    });
  });

  // Bind sub-solve buttons
  solveSimplifyBtn?.addEventListener('click', runSimplifySolve);
  solveDivideBtn?.addEventListener('click', runDivideSolve);
  solveProportionBtn?.addEventListener('click', runProportionSolve);
}

function runSimplifySolve() {
  let html = '';
  try {
    html = solveSimplify();
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }
  if (simplifyResultContent) simplifyResultContent.innerHTML = html;
  simplifySolutionDisplay?.classList.remove('hidden');
  simplifySolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function runDivideSolve() {
  let html = '';
  try {
    html = solveDivide();
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }
  if (divideResultContent) divideResultContent.innerHTML = html;
  divideSolutionDisplay?.classList.remove('hidden');
  divideSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function runProportionSolve() {
  let html = '';
  try {
    html = solveProportion();
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }
  if (proportionResultContent) proportionResultContent.innerHTML = html;
  proportionSolutionDisplay?.classList.remove('hidden');
  proportionSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 1. Simplify Ratio using GCD
function solveSimplify() {
  const text = simplifyInput.value.trim();
  if (!text) throw new Error("Please enter ratio terms.");

  // Parse terms separated by space, colon, or comma
  const terms = text
    .split(/[:\s,]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x));

  if (terms.length < 2) {
    throw new Error("Please enter at least 2 numeric terms (e.g. 15 : 25).");
  }

  if (terms.some(x => x <= 0)) {
    throw new Error("Ratio terms must be positive numbers.");
  }

  // To simplify, we find GCD. MathJS support multi-argument GCD, but it requires integers.
  // If there are decimals, we can scale them up first to integers.
  // Let's check max decimal places
  let maxDecimals = 0;
  terms.forEach(term => {
    const str = String(term);
    if (str.includes('.')) {
      const decPart = str.split('.')[1];
      if (decPart.length > maxDecimals) maxDecimals = decPart.length;
    }
  });

  const scale = Math.pow(10, maxDecimals);
  const intTerms = terms.map(t => Math.round(t * scale));

  // Find GCD of scaled integer terms
  let divisor = intTerms[0];
  for (let i = 1; i < intTerms.length; i++) {
    divisor = math.gcd(divisor, intTerms[i]);
  }

  // Divide scaled terms by GCD
  const simplified = intTerms.map(t => t / divisor);

  let steps = `
    <div class="solution-step">
      <strong>Original Ratio:</strong> ${terms.join(' : ')}<br>
      ${scale > 1 ? `Scaled terms to integers (multiplier ×${scale}): ${intTerms.join(' : ')}<br>` : ''}
      <strong>Greatest Common Divisor (GCD):</strong> ${scale > 1 ? divisor / scale : divisor}
    </div>
  `;

  return steps + `
    <div class="solution-final">
      Simplified Ratio = ${simplified.join(' : ')}
    </div>
  `;
}

// 2. Divide Total into Ratio Shares
function solveDivide() {
  const total = parseFloat(totalInput.value);
  const text = dividePartsInput.value.trim();

  if (isNaN(total) || total <= 0) {
    throw new Error("Total amount must be a positive number.");
  }
  if (!text) throw new Error("Please enter ratio parts.");

  const parts = text
    .split(/[:\s,]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x));

  if (parts.length < 2) {
    throw new Error("Please enter at least 2 ratio parts (e.g. 2 : 3).");
  }

  if (parts.some(x => x <= 0)) {
    throw new Error("Ratio parts must be positive numbers.");
  }

  const sumParts = parts.reduce((sum, p) => sum + p, 0);
  const singleShare = total / sumParts;

  let breakdownHTML = '';
  parts.forEach((part, idx) => {
    const shareVal = part * singleShare;
    breakdownHTML += `• Part ${idx + 1} (${part} shares) = ${part} × ${singleShare.toFixed(4)} = <strong>${shareVal.toFixed(2)}</strong><br>`;
  });

  return `
    <div class="solution-step">
      <strong>Total:</strong> ${total}<br>
      <strong>Ratio:</strong> ${parts.join(' : ')} (Sum of parts = ${sumParts})<br>
      <strong>Value of 1 Share:</strong> ${total} / ${sumParts} = ${singleShare.toFixed(6)}
    </div>
    <div class="solution-step">
      <strong>Breakdown:</strong><br>
      ${breakdownHTML}
    </div>
    <div class="solution-final">
      Divided Parts = ${parts.map((p, idx) => (p * singleShare).toFixed(2)).join(' : ')}
    </div>
  `;
}

// 3. Proportion Solver (A : B = C : D)
function solveProportion() {
  const aStr = propAInput.value.trim().toLowerCase();
  const bStr = propBInput.value.trim().toLowerCase();
  const cStr = propCInput.value.trim().toLowerCase();
  const dStr = propDInput.value.trim().toLowerCase();

  const vals = [aStr, bStr, cStr, dStr];
  
  // Find unknown indexes (items that are empty or equal 'x')
  const unknownIdxs = [];
  vals.forEach((v, idx) => {
    if (v === '' || v === 'x' || isNaN(parseFloat(v))) {
      unknownIdxs.push(idx);
    }
  });

  if (unknownIdxs.length !== 1) {
    throw new Error("Please leave exactly one field empty or written as 'x' to solve for it.");
  }

  const numericVals = vals.map(v => parseFloat(v));
  const unknown = unknownIdxs[0];
  
  let result = 0;
  let label = '';
  let formula = '';
  
  // A:B = C:D => A/B = C/D => A·D = B·C
  if (unknown === 0) { // A is unknown
    const B = numericVals[1], C = numericVals[2], D = numericVals[3];
    if (D === 0) throw new Error("Denominator D cannot be zero.");
    result = (B * C) / D;
    label = 'A';
    formula = `A = (B × C) / D = (${B} × ${C}) / ${D}`;
  } 
  else if (unknown === 1) { // B is unknown
    const A = numericVals[0], C = numericVals[2], D = numericVals[3];
    if (C === 0) throw new Error("Denominator C cannot be zero.");
    result = (A * D) / C;
    label = 'B';
    formula = `B = (A × D) / C = (${A} × ${D}) / ${C}`;
  } 
  else if (unknown === 2) { // C is unknown
    const A = numericVals[0], B = numericVals[1], D = numericVals[3];
    if (B === 0) throw new Error("Denominator B cannot be zero.");
    result = (A * D) / B;
    label = 'C';
    formula = `C = (A × D) / B = (${A} × ${D}) / ${B}`;
  } 
  else if (unknown === 3) { // D is unknown
    const A = numericVals[0], B = numericVals[1], C = numericVals[2];
    if (A === 0) throw new Error("Denominator A cannot be zero.");
    result = (B * C) / A;
    label = 'D';
    formula = `D = (B × C) / A = (${B} × ${C}) / ${A}`;
  }

  const displayVals = [...numericVals];
  displayVals[unknown] = '?';

  return `
    <div class="solution-step">
      <strong>Proportion:</strong> ${displayVals[0]} : ${displayVals[1]} = ${displayVals[2]} : ${displayVals[3]}<br>
      <strong>Cross Multiplication Rule:</strong> A × D = B × C
    </div>
    <div class="solution-step">
      <strong>Formula to Solve:</strong><br>
      ${formula}
    </div>
    <div class="solution-final">
      Solved ${label} = ${math.format(result, { precision: 8 })}
    </div>
  `;
}
