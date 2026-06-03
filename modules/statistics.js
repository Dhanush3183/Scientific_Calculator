// statistics.js - Stats & Probability Module

let statsTabs;
let subPanels;
let dataInput;
let probDistSelect;
let probInputsContainer;
let combN, combR;
let statsSolveBtn;
let statsResultDisplay;
let statsResultContent;

let currentTab = 'descriptive';

export function initStats() {
  statsTabs = document.querySelectorAll('.stats-tab');
  subPanels = document.querySelectorAll('.stats-sub-panel');
  dataInput = document.getElementById('statsDataInput');
  probDistSelect = document.getElementById('probDistType');
  probInputsContainer = document.getElementById('probInputsContainer');
  combN = document.getElementById('combN');
  combR = document.getElementById('combR');
  statsSolveBtn = document.getElementById('btnSolveStats');
  statsResultDisplay = document.getElementById('statsSolutionDisplay');
  statsResultContent = document.getElementById('statsResultContent');

  // Bind tabs
  statsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statsTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-stats');
      currentTab = target;

      subPanels.forEach(panel => panel.classList.add('hidden'));

      if (target === 'descriptive') {
        document.getElementById('statsDescriptivePanel').classList.remove('hidden');
      } else if (target === 'prob-dist') {
        document.getElementById('statsProbDistPanel').classList.remove('hidden');
        drawProbInputs();
      } else if (target === 'combinatorics') {
        document.getElementById('statsCombinatoricsPanel').classList.remove('hidden');
      }

      statsResultDisplay.classList.add('hidden');
    });
  });

  // Probability distribution type change
  probDistSelect?.addEventListener('change', drawProbInputs);

  // Solve button click
  statsSolveBtn?.addEventListener('click', solveStats);

  // Combinatorics button direct clicks
  document.getElementById('btnCombPerm')?.addEventListener('click', () => solveCombinatorics('perm'));
  document.getElementById('btnCombComb')?.addEventListener('click', () => solveCombinatorics('comb'));
}

// Generate distribution inputs
function drawProbInputs() {
  if (!probInputsContainer) return;
  const dist = probDistSelect.value;
  let html = '';

  if (dist === 'normal') {
    html = `
      <div class="prob-field-group">
        <label for="normMean">Mean (μ):</label>
        <input type="number" id="normMean" class="form-control small-val" value="0">
      </div>
      <div class="prob-field-group">
        <label for="normStd">Std Dev (σ):</label>
        <input type="number" id="normStd" class="form-control small-val" value="1">
      </div>
      <div class="prob-field-group">
        <label for="normX">Value (x):</label>
        <input type="number" id="normX" class="form-control small-val" value="1.96" step="0.01">
      </div>
      <div class="prob-field-group">
        <label for="normType">Calculation:</label>
        <select id="normType" class="form-select" style="width:160px;">
          <option value="cdf" selected>CDF P(X ≤ x)</option>
          <option value="pdf">PDF f(x)</option>
        </select>
      </div>
    `;
  } else if (dist === 'binomial') {
    html = `
      <div class="prob-field-group">
        <label for="binN">Trials (n):</label>
        <input type="number" id="binN" class="form-control small-val" value="10">
      </div>
      <div class="prob-field-group">
        <label for="binP">Prob Success (p):</label>
        <input type="number" id="binP" class="form-control small-val" value="0.5" step="0.05">
      </div>
      <div class="prob-field-group">
        <label for="binK">Successes (k):</label>
        <input type="number" id="binK" class="form-control small-val" value="5">
      </div>
      <div class="prob-field-group">
        <label for="binType">Calculation:</label>
        <select id="binType" class="form-select" style="width:160px;">
          <option value="pmf" selected>PMF P(X = k)</option>
          <option value="cdf">CDF P(X ≤ k)</option>
        </select>
      </div>
    `;
  } else if (dist === 'poisson') {
    html = `
      <div class="prob-field-group">
        <label for="poiLambda">Average Rate (λ):</label>
        <input type="number" id="poiLambda" class="form-control small-val" value="3">
      </div>
      <div class="prob-field-group">
        <label for="poiK">Events (k):</label>
        <input type="number" id="poiK" class="form-control small-val" value="2">
      </div>
      <div class="prob-field-group">
        <label for="poiType">Calculation:</label>
        <select id="poiType" class="form-select" style="width:160px;">
          <option value="pmf" selected>PMF P(X = k)</option>
          <option value="cdf">CDF P(X ≤ k)</option>
        </select>
      </div>
    `;
  }

  probInputsContainer.innerHTML = html;
}

// Router Solve
function solveStats() {
  let html = '';
  try {
    if (currentTab === 'descriptive') {
      html = solveDescriptive();
    } else if (currentTab === 'prob-dist') {
      html = solveProbDist();
    } else if (currentTab === 'combinatorics') {
      // Direct solve for combinatorics tab via standard calculate button
      html = solveCombinatorics('both');
    }
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  statsResultContent.innerHTML = html;
  statsResultDisplay.classList.remove('hidden');
  statsResultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Descriptive Statistics Calculations
function solveDescriptive() {
  const text = dataInput.value.trim();
  if (!text) {
    throw new Error("Please enter a dataset.");
  }

  // Parse comma/space separated values
  const data = text
    .split(/[\s,]+/)
    .map(x => parseFloat(x))
    .filter(x => !isNaN(x));

  if (data.length === 0) {
    throw new Error("Dataset contains no valid numeric inputs.");
  }

  const N = data.length;
  const sorted = [...data].sort((a, b) => a - b);
  
  // MathJS descriptive operations
  const sum = math.sum(data);
  const mean = math.mean(data);
  const median = math.median(data);
  const modes = math.mode(data);
  const min = math.min(data);
  const max = math.max(data);
  const range = max - min;

  // Variances & Standard deviations
  let sampleVar = 0;
  let sampleStd = 0;
  let popVar = 0;
  let popStd = 0;

  if (N > 1) {
    sampleVar = math.variance(data); // math.variance computes sample variance
    sampleStd = math.std(data); // math.std computes sample std dev
    
    // Population variance calculations: Sum( (x - mean)^2 ) / N
    const devSqSum = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0);
    popVar = devSqSum / N;
    popStd = Math.sqrt(popVar);
  }

  return `
    <div class="solution-step">
      <strong>Sorted Dataset:</strong> [${sorted.join(', ')}]<br>
      • Data point count (N) = ${N}
    </div>
    <div class="solution-step">
      <strong>Measures of Central Tendency:</strong><br>
      • Sum (∑x) = ${math.format(sum, {precision: 8})}<br>
      • Mean (μ) = ${math.format(mean, {precision: 8})}<br>
      • Median = ${math.format(median, {precision: 8})}<br>
      • Mode = ${modes.join(', ')}
    </div>
    <div class="solution-step">
      <strong>Measures of Dispersion:</strong><br>
      • Min = ${min}<br>
      • Max = ${max}<br>
      • Range = ${range}<br>
      ${N > 1 ? `
      • Sample Variance (s²) = ${math.format(sampleVar, {precision: 8})}<br>
      • Sample Std Dev (s) = ${math.format(sampleStd, {precision: 8})}<br>
      • Population Variance (σ²) = ${math.format(popVar, {precision: 8})}<br>
      • Population Std Dev (σ) = ${math.format(popStd, {precision: 8})}` : `
      • Need at least N > 1 data points to calculate variance and standard deviations.`}
    </div>
    <div class="solution-final">
      Mean = ${math.format(mean, {precision: 8})}<br>
      Median = ${math.format(median, {precision: 8})}<br>
      Std Dev (Sample) = ${N > 1 ? math.format(sampleStd, {precision: 8}) : 'N/A'}
    </div>
  `;
}

// Probability distributions solver
function solveProbDist() {
  const dist = probDistSelect.value;
  let html = '';

  if (dist === 'normal') {
    const mu = parseFloat(document.getElementById('normMean').value);
    const sigma = parseFloat(document.getElementById('normStd').value);
    const x = parseFloat(document.getElementById('normX').value);
    const type = document.getElementById('normType').value;

    if ([mu, sigma, x].some(isNaN)) throw new Error("Please enter valid numeric parameters.");
    if (sigma <= 0) throw new Error("Standard deviation σ must be greater than 0.");

    if (type === 'pdf') {
      // Normal Probability Density Function
      const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2)));
      html = `
        <div class="solution-step"><strong>Normal PDF f(x; μ, σ) at x = ${x}:</strong><br>
          f(x) = (1 / (σ√(2π))) * exp( -(x-μ)² / 2σ² )
        </div>
        <div class="solution-final">f(x) ≈ ${math.format(pdf, {precision: 10})}</div>
      `;
    } else {
      // Normal Cumulative Distribution Function
      const z = (x - mu) / sigma;
      // Φ(z) = 0.5 * (1 + erf(z / sqrt(2)))
      const cdf = 0.5 * (1 + math.erf(z / Math.sqrt(2)));
      html = `
        <div class="solution-step"><strong>Normal CDF P(X ≤ x) at x = ${x}:</strong><br>
          Standard Score (Z-score) = (x - μ) / σ = (${x} - ${mu}) / ${sigma} = ${z.toFixed(4)}<br>
          P(X ≤ x) = Φ(Z) = 0.5 * [1 + erf(Z / √2)]
        </div>
        <div class="solution-final">P(X ≤ ${x}) ≈ ${math.format(cdf, {precision: 10})}</div>
      `;
    }
  } 
  else if (dist === 'binomial') {
    const n = parseInt(document.getElementById('binN').value);
    const p = parseFloat(document.getElementById('binP').value);
    const k = parseInt(document.getElementById('binK').value);
    const type = document.getElementById('binType').value;

    if ([n, p, k].some(isNaN)) throw new Error("Please enter valid numeric parameters.");
    if (n < 0 || k < 0) throw new Error("n and k must be non-negative integers.");
    if (k > n) throw new Error("k (successes) cannot be greater than n (trials).");
    if (p < 0 || p > 1) throw new Error("Success probability p must be in the interval [0, 1].");

    // PMF calculation: nCr * p^k * (1-p)^(n-k)
    const binomialPMF = (nVal, kVal, pVal) => {
      const comb = math.combinations(nVal, kVal);
      return comb * Math.pow(pVal, kVal) * Math.pow(1 - pVal, nVal - kVal);
    };

    if (type === 'pmf') {
      const pmf = binomialPMF(n, k, p);
      html = `
        <div class="solution-step"><strong>Binomial PMF P(X = k):</strong><br>
          P(X = k) = ⁿCₖ · pᵏ · (1-p)ⁿ⁻ᵏ<br>
          P(X = ${k}) = <sup>${n}</sup>C<sub>${k}</sub> · (${p})<sup>${k}</sup> · (${(1-p).toFixed(4)})<sup>${n-k}</sup>
        </div>
        <div class="solution-final">P(X = ${k}) ≈ ${math.format(pmf, {precision: 8})}</div>
      `;
    } else {
      // CDF calculation: sum of PMF from 0 to k
      let cdf = 0;
      for (let i = 0; i <= k; i++) {
        cdf += binomialPMF(n, i, p);
      }
      html = `
        <div class="solution-step"><strong>Binomial CDF P(X ≤ k):</strong><br>
          P(X ≤ k) = ∑ᵢ₌₀ᵏ ⁿCᵢ · pⁱ · (1-p)ⁿ⁻ⁱ
        </div>
        <div class="solution-final">P(X ≤ ${k}) ≈ ${math.format(cdf, {precision: 8})}</div>
      `;
    }
  } 
  else if (dist === 'poisson') {
    const lambda = parseFloat(document.getElementById('poiLambda').value);
    const k = parseInt(document.getElementById('poiK').value);
    const type = document.getElementById('poiType').value;

    if ([lambda, k].some(isNaN)) throw new Error("Please enter valid numeric parameters.");
    if (lambda <= 0) throw new Error("Rate λ must be greater than 0.");
    if (k < 0) throw new Error("Events count k must be a non-negative integer.");

    // PMF: lambda^k * e^-lambda / k!
    const poissonPMF = (lam, kVal) => {
      return (Math.pow(lam, kVal) * Math.exp(-lam)) / math.factorial(kVal);
    };

    if (type === 'pmf') {
      const pmf = poissonPMF(lambda, k);
      html = `
        <div class="solution-step"><strong>Poisson PMF P(X = k):</strong><br>
          P(X = k) = (λᵏ · e⁻λ) / k!<br>
          P(X = ${k}) = (${lambda}<sup>${k}</sup> · e<sup>-${lambda}</sup>) / ${k}!
        </div>
        <div class="solution-final">P(X = ${k}) ≈ ${math.format(pmf, {precision: 8})}</div>
      `;
    } else {
      let cdf = 0;
      for (let i = 0; i <= k; i++) {
        cdf += poissonPMF(lambda, i);
      }
      html = `
        <div class="solution-step"><strong>Poisson CDF P(X ≤ k):</strong><br>
          P(X ≤ k) = ∑ᵢ₌₀ᵏ (λⁱ · e⁻λ) / i!
        </div>
        <div class="solution-final">P(X ≤ ${k}) ≈ ${math.format(cdf, {precision: 8})}</div>
      `;
    }
  }

  return html;
}

// Combinatorics (nPr, nCr)
function solveCombinatorics(mode) {
  const nVal = parseInt(combN.value);
  const rVal = parseInt(combR.value);

  if (isNaN(nVal) || isNaN(rVal)) {
    throw new Error("Parameters n and r must be integers.");
  }
  if (nVal < 0 || rVal < 0) {
    throw new Error("Parameters must be non-negative integers.");
  }
  if (rVal > nVal) {
    throw new Error("r cannot be greater than n.");
  }

  let html = '';
  
  if (mode === 'perm' || mode === 'both') {
    const perm = math.permutations(nVal, rVal);
    html += `
      <div class="solution-step">
        <strong>Permutations (nPr):</strong> Arrangement order matters<br>
        ⁿPᵣ = n! / (n-r)! = ${nVal}! / (${nVal} - ${rVal})!<br>
        ⁿPᵣ = ${math.format(perm, {precision: 12})}
      </div>
    `;
  }
  
  if (mode === 'comb' || mode === 'both') {
    const comb = math.combinations(nVal, rVal);
    html += `
      <div class="solution-step">
        <strong>Combinations (nCr):</strong> Selection order does NOT matter<br>
        ⁿCᵣ = n! / (r!(n-r)!) = ${nVal}! / (${rVal}! × (${nVal} - ${rVal})!)<br>
        ⁿCᵣ = ${math.format(comb, {precision: 12})}
      </div>
    `;
  }

  // If clicked directly from sub-buttons, display immediately in results card
  if (mode === 'perm' || mode === 'comb') {
    statsResultContent.innerHTML = html;
    statsResultDisplay.classList.remove('hidden');
    statsResultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return html;
}
