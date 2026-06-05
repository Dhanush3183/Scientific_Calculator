// higher.js - Higher Calculator Module

let higherTabs;
let subPanels;

// Inputs
let nRootDegree, nRootValue;
let logBase, logValue;
let powerVal, powerExp;
let fracNum, fracDen;
let mixedWhole, mixedNum, mixedDen;
let gcdLcmInput, primeInput;

// Solve buttons
let solveNRootBtn;
let solveCustomLogBtn;
let solveStandardFracBtn;
let solveMixedFracBtn;
let solveGcdLcmBtn;
let solvePrimeFactorsBtn;

// Results Displays
let nRootSolutionDisplay, nRootResultContent;
let customLogSolutionDisplay, customLogResultContent;
let powersSolutionDisplay, powersResultContent;
let standardFracSolutionDisplay, standardFracResultContent;
let mixedFracSolutionDisplay, mixedFracResultContent;
let gcdLcmSolutionDisplay, gcdLcmResultContent;
let primeSolutionDisplay, primeResultContent;

let currentTab = 'nroot-log';

export function initHigher() {
  higherTabs = document.querySelectorAll('.higher-tab');
  subPanels = document.querySelectorAll('.higher-sub-panel');

  // Input elements
  nRootDegree = document.getElementById('higherNRootDegree');
  nRootValue = document.getElementById('higherNRootValue');
  logBase = document.getElementById('higherLogBase');
  logValue = document.getElementById('higherLogValue');
  
  powerVal = document.getElementById('higherPowerVal');
  powerExp = document.getElementById('higherPowerExp');
  
  fracNum = document.getElementById('higherFracNum');
  fracDen = document.getElementById('higherFracDen');
  
  mixedWhole = document.getElementById('higherMixedWhole');
  mixedNum = document.getElementById('higherMixedNum');
  mixedDen = document.getElementById('higherMixedDen');
  
  gcdLcmInput = document.getElementById('higherGcdLcmInput');
  primeInput = document.getElementById('higherPrimeInput');

  // Solve buttons
  solveNRootBtn = document.getElementById('btnSolveNRoot');
  solveCustomLogBtn = document.getElementById('btnSolveCustomLog');
  solveStandardFracBtn = document.getElementById('btnSolveStandardFrac');
  solveMixedFracBtn = document.getElementById('btnSolveMixedFrac');
  solveGcdLcmBtn = document.getElementById('btnSolveGcdLcm');
  solvePrimeFactorsBtn = document.getElementById('btnSolvePrimeFactors');

  // Results displays
  nRootSolutionDisplay = document.getElementById('higherNRootSolutionDisplay');
  nRootResultContent = document.getElementById('higherNRootResultContent');

  customLogSolutionDisplay = document.getElementById('higherCustomLogSolutionDisplay');
  customLogResultContent = document.getElementById('higherCustomLogResultContent');

  powersSolutionDisplay = document.getElementById('higherPowersSolutionDisplay');
  powersResultContent = document.getElementById('higherPowersResultContent');

  standardFracSolutionDisplay = document.getElementById('higherStandardFracSolutionDisplay');
  standardFracResultContent = document.getElementById('higherStandardFracResultContent');

  mixedFracSolutionDisplay = document.getElementById('higherMixedFracSolutionDisplay');
  mixedFracResultContent = document.getElementById('higherMixedFracResultContent');

  gcdLcmSolutionDisplay = document.getElementById('higherGcdLcmSolutionDisplay');
  gcdLcmResultContent = document.getElementById('higherGcdLcmResultContent');

  primeSolutionDisplay = document.getElementById('higherPrimeSolutionDisplay');
  primeResultContent = document.getElementById('higherPrimeResultContent');

  // Bind tabs
  higherTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      higherTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-higher');
      currentTab = target;

      subPanels.forEach(panel => panel.classList.add('hidden'));

      if (target === 'nroot-log') {
        document.getElementById('higherNrootLogPanel').classList.remove('hidden');
      } else if (target === 'powers') {
        document.getElementById('higherPowersPanel').classList.remove('hidden');
      } else if (target === 'fractions') {
        document.getElementById('higherFractionsPanel').classList.remove('hidden');
      } else if (target === 'factors-gcd') {
        document.getElementById('higherFactorsGcdPanel').classList.remove('hidden');
      }

      // Hide all results displays when switching tabs
      nRootSolutionDisplay?.classList.add('hidden');
      customLogSolutionDisplay?.classList.add('hidden');
      powersSolutionDisplay?.classList.add('hidden');
      standardFracSolutionDisplay?.classList.add('hidden');
      mixedFracSolutionDisplay?.classList.add('hidden');
      gcdLcmSolutionDisplay?.classList.add('hidden');
      primeSolutionDisplay?.classList.add('hidden');
    });
  });

  // Bind sub-solve buttons
  solveNRootBtn?.addEventListener('click', runNRootSolve);
  solveCustomLogBtn?.addEventListener('click', runCustomLogSolve);
  solveStandardFracBtn?.addEventListener('click', runStandardFracSolve);
  solveMixedFracBtn?.addEventListener('click', runMixedFracSolve);
  solveGcdLcmBtn?.addEventListener('click', runGcdLcmSolve);
  solvePrimeFactorsBtn?.addEventListener('click', runPrimeFactorsSolve);

  // Power solver triggers (direct buttons)
  document.getElementById('btnHigherPowerInv')?.addEventListener('click', () => solvePower('inv'));
  document.getElementById('btnHigherPowerSq')?.addEventListener('click', () => solvePower('sq'));
  document.getElementById('btnHigherPowerY')?.addEventListener('click', () => solvePower('y'));
}

// 1. Roots & Logs Solvers
function runNRootSolve() {
  let html = '';
  try {
    const deg = parseFloat(nRootDegree.value);
    const val = parseFloat(nRootValue.value);
    if (isNaN(deg) || isNaN(val)) {
      throw new Error("Please enter valid numeric parameters in both fields.");
    }
    if (deg === 0) throw new Error("Root degree cannot be 0.");
    const root = math.nthRoot(val, deg);
    html = `
      <div class="solution-step">
        <strong>nth Root:</strong> <sup>${deg}</sup>√${val} = <strong>${math.format(root, { precision: 8 })}</strong>
      </div>
    `;
  } catch (e) {
    html = `<div class="solution-step" style="color: var(--accent-danger)"><strong>Error:</strong> ${e.message}</div>`;
  }
  if (nRootResultContent) nRootResultContent.innerHTML = html;
  nRootSolutionDisplay?.classList.remove('hidden');
  nRootSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function runCustomLogSolve() {
  let html = '';
  try {
    const base = parseFloat(logBase.value);
    const val = parseFloat(logValue.value);
    if (isNaN(base) || isNaN(val)) {
      throw new Error("Please enter valid numeric parameters in both fields.");
    }
    if (base <= 0 || base === 1) throw new Error("Log base must be greater than 0 and not equal to 1.");
    if (val <= 0) throw new Error("Log argument must be greater than 0.");
    const result = math.log(val, base);
    html = `
      <div class="solution-step">
        <strong>Logarithm:</strong> log<sub>${base}</sub>(${val}) = <strong>${math.format(result, { precision: 8 })}</strong>
      </div>
    `;
  } catch (e) {
    html = `<div class="solution-step" style="color: var(--accent-danger)"><strong>Error:</strong> ${e.message}</div>`;
  }
  if (customLogResultContent) customLogResultContent.innerHTML = html;
  customLogSolutionDisplay?.classList.remove('hidden');
  customLogSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 2. Power Solver (Inverses, Squares, Exponents)
function solvePower(type) {
  const x = parseFloat(powerVal.value);
  if (isNaN(x)) {
    alert("Please enter a valid base value (x).");
    return;
  }

  let html = '';
  try {
    if (type === 'inv') {
      if (x === 0) throw new Error("Division by zero (1/0) is undefined.");
      const result = 1 / x;
      html = `
        <div class="solution-step"><strong>Operation:</strong> Multiplicative Inverse (x⁻¹)</div>
        <div class="solution-step">Formula: 1 / x = 1 / ${x}</div>
        <div class="solution-final">x⁻¹ = ${math.format(result, { precision: 8 })}</div>
      `;
    } 
    else if (type === 'sq') {
      const result = x * x;
      html = `
        <div class="solution-step"><strong>Operation:</strong> Square (x²)</div>
        <div class="solution-step">Formula: x × x = ${x} × ${x}</div>
        <div class="solution-final">x² = ${math.format(result, { precision: 8 })}</div>
      `;
    } 
    else if (type === 'y') {
      const y = parseFloat(powerExp.value);
      if (isNaN(y)) throw new Error("Please enter a valid exponent (y).");
      const result = Math.pow(x, y);
      html = `
        <div class="solution-step"><strong>Operation:</strong> Exponentiation (xʸ)</div>
        <div class="solution-step">Formula: ${x}<sup>${y}</sup></div>
        <div class="solution-final">xʸ = ${math.format(result, { precision: 8 })}</div>
      `;
    }
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  if (powersResultContent) powersResultContent.innerHTML = html;
  powersSolutionDisplay?.classList.remove('hidden');
  powersSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 3. Fraction & Mixed Fraction Solvers
function runStandardFracSolve() {
  let html = '';
  try {
    const num = parseFloat(fracNum.value);
    const den = parseFloat(fracDen.value);
    if (isNaN(num) || isNaN(den)) {
      throw new Error("Please enter values for both Numerator and Denominator.");
    }
    if (den === 0) {
      throw new Error("Standard Fraction Denominator cannot be 0.");
    }
    const gcd = math.gcd(Math.round(num), Math.round(den));
    const simpNum = Math.round(num) / gcd;
    const simpDen = Math.round(den) / gcd;
    const dec = num / den;
    
    html = `
      <div class="solution-step">
        • Original Fraction: ${num} / ${den}<br>
        • Greatest Common Divisor (GCD): ${gcd}<br>
        • Simplified Fraction: <strong>${simpNum} / ${simpDen}</strong><br>
        • Decimal Value: <strong>${math.format(dec, { precision: 6 })}</strong>
      </div>
    `;
  } catch (e) {
    html = `<div class="solution-step" style="color: var(--accent-danger)"><strong>Error:</strong> ${e.message}</div>`;
  }
  if (standardFracResultContent) standardFracResultContent.innerHTML = html;
  standardFracSolutionDisplay?.classList.remove('hidden');
  standardFracSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function runMixedFracSolve() {
  let html = '';
  try {
    const whole = parseFloat(mixedWhole.value);
    const mNum = parseFloat(mixedNum.value);
    const mDen = parseFloat(mixedDen.value);
    if (isNaN(whole) || isNaN(mNum) || isNaN(mDen)) {
      throw new Error("Please enter values for Whole number, Numerator, and Denominator.");
    }
    if (mDen === 0) {
      throw new Error("Mixed Fraction Denominator cannot be 0.");
    }
    const impNum = whole * mDen + mNum;
    const gcd = math.gcd(Math.round(impNum), Math.round(mDen));
    const simpImpNum = Math.round(impNum) / gcd;
    const simpImpDen = Math.round(mDen) / gcd;
    
    const addedWhole = Math.floor(mNum / mDen);
    const newWhole = whole + addedWhole;
    const newNum = mNum % mDen;
    
    const gcdMixed = math.gcd(Math.round(newNum), Math.round(mDen));
    const simpNewNum = Math.round(newNum) / gcdMixed;
    const simpNewDen = Math.round(mDen) / gcdMixed;
    
    const dec = whole + (mNum / mDen);
    
    html = `
      <div class="solution-step">
        • Original Mixed Fraction: ${whole} (${mNum}/${mDen})<br>
        • Improper Fraction: ${impNum} / ${mDen}<br>
        • Simplified Improper Fraction: <strong>${simpImpNum} / ${simpImpDen}</strong><br>
        • Simplified Mixed Fraction: <strong>${newWhole} (${simpNewNum}/${simpNewDen})</strong><br>
        • Decimal Value: <strong>${math.format(dec, { precision: 6 })}</strong>
      </div>
    `;
  } catch (e) {
    html = `<div class="solution-step" style="color: var(--accent-danger)"><strong>Error:</strong> ${e.message}</div>`;
  }
  if (mixedFracResultContent) mixedFracResultContent.innerHTML = html;
  mixedFracSolutionDisplay?.classList.remove('hidden');
  mixedFracSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 4. GCD / LCM & Prime Factors Solvers
function runGcdLcmSolve() {
  let html = '';
  try {
    const gcdText = gcdLcmInput.value.trim();
    if (!gcdText) {
      throw new Error("Please enter a list of integers.");
    }
    const nums = gcdText
      .split(/[\s,]+/)
      .map(x => parseInt(x))
      .filter(x => !isNaN(x) && x > 0);
      
    if (nums.length < 2) {
      throw new Error("Please enter at least 2 positive integers for GCD/LCM.");
    }
    let g = nums[0];
    for (let i = 1; i < nums.length; i++) {
      g = math.gcd(g, nums[i]);
    }
    let l = nums[0];
    for (let i = 1; i < nums.length; i++) {
      l = math.lcm(l, nums[i]);
    }
    html = `
      <div class="solution-step">
        • Input Integers: ${nums.join(', ')}<br>
        • Greatest Common Divisor (GCD): <strong>${g}</strong><br>
        • Least Common Multiple (LCM): <strong>${l}</strong>
      </div>
    `;
  } catch (e) {
    html = `<div class="solution-step" style="color: var(--accent-danger)"><strong>Error:</strong> ${e.message}</div>`;
  }
  if (gcdLcmResultContent) gcdLcmResultContent.innerHTML = html;
  gcdLcmSolutionDisplay?.classList.remove('hidden');
  gcdLcmSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function runPrimeFactorsSolve() {
  let html = '';
  try {
    const primeVal = parseInt(primeInput.value);
    if (isNaN(primeVal)) {
      throw new Error("Please enter a valid integer.");
    }
    if (primeVal <= 1) {
      throw new Error("Please enter an integer greater than 1 for prime factorization.");
    }
    const factorsStr = primeFactorize(primeVal);
    html = `
      <div class="solution-step">
        • Number: ${primeVal}<br>
        • Prime Factors: <strong>${factorsStr}</strong>
      </div>
    `;
  } catch (e) {
    html = `<div class="solution-step" style="color: var(--accent-danger)"><strong>Error:</strong> ${e.message}</div>`;
  }
  if (primeResultContent) primeResultContent.innerHTML = html;
  primeSolutionDisplay?.classList.remove('hidden');
  primeSolutionDisplay?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Prime factorizing helper
function primeFactorize(n) {
  let temp = n;
  const factors = {};
  for (let d = 2; d * d <= temp; d++) {
    while (temp % d === 0) {
      factors[d] = (factors[d] || 0) + 1;
      temp /= d;
    }
  }
  if (temp > 1) {
    factors[temp] = (factors[temp] || 0) + 1;
  }
  
  const parts = [];
  for (let base in factors) {
    const exp = factors[base];
    if (exp > 1) {
      parts.push(`${base}<sup>${exp}</sup>`);
    } else {
      parts.push(`${base}`);
    }
  }
  return parts.join(' × ');
}
