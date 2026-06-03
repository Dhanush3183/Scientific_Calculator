// finance.js - Financial Calculator Module

let financeTabs;
let subPanels;
let solveBtn;
let financeSolutionDisplay;
let financeResultContent;

let currentMode = 'emi';

export function initFinance() {
  financeTabs = document.querySelectorAll('.finance-tab');
  subPanels = document.querySelectorAll('.finance-sub-panel');
  solveBtn = document.getElementById('btnSolveFinance');
  financeSolutionDisplay = document.getElementById('financeSolutionDisplay');
  financeResultContent = document.getElementById('financeResultContent');

  // Bind tabs
  financeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      financeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-finance');
      currentMode = target;

      subPanels.forEach(panel => panel.classList.add('hidden'));

      if (target === 'emi') {
        document.getElementById('finEmiPanel').classList.remove('hidden');
      } else if (target === 'interest') {
        document.getElementById('finInterestPanel').classList.remove('hidden');
      } else if (target === 'fv') {
        document.getElementById('finFvPanel').classList.remove('hidden');
      }

      financeSolutionDisplay.classList.add('hidden');
    });
  });

  // Solve click
  solveBtn?.addEventListener('click', solveFinance);
}

function solveFinance() {
  let html = '';
  
  try {
    if (currentMode === 'emi') {
      html = solveEMI();
    } else if (currentMode === 'interest') {
      html = solveInterest();
    } else if (currentMode === 'fv') {
      html = solveFutureValue();
    }
  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  financeResultContent.innerHTML = html;
  financeSolutionDisplay.classList.remove('hidden');
  financeSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// EMI Amortization Solver
function solveEMI() {
  const P = parseFloat(document.getElementById('emiPrincipal').value);
  const R = parseFloat(document.getElementById('emiRate').value);
  const Y = parseFloat(document.getElementById('emiTenure').value);

  if ([P, R, Y].some(isNaN) || P <= 0 || R <= 0 || Y <= 0) {
    throw new Error("Please enter valid positive values for Loan Principal, Interest Rate, and Tenure.");
  }

  const monthlyRate = R / (12 * 100);
  const totalMonths = Y * 12;

  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPaid = emi * totalMonths;
  const totalInterest = totalPaid - P;

  // Generate monthly amortization schedule
  let currentBalance = P;
  let amortRows = '';

  for (let m = 1; m <= totalMonths; m++) {
    const interestPaid = currentBalance * monthlyRate;
    const principalPaid = emi - interestPaid;
    const closingBalance = Math.max(0, currentBalance - principalPaid);

    amortRows += `
      <tr>
        <td style="text-align:center;">${m}</td>
        <td>${currentBalance.toFixed(2)}</td>
        <td>${emi.toFixed(2)}</td>
        <td>${interestPaid.toFixed(2)}</td>
        <td>${principalPaid.toFixed(2)}</td>
        <td>${closingBalance.toFixed(2)}</td>
      </tr>
    `;

    currentBalance = closingBalance;
  }

  const scheduleHTML = `
    <h5 style="margin-top:20px;">Amortization Schedule</h5>
    <div class="amort-table-wrapper">
      <table class="amort-table">
        <thead>
          <tr>
            <th style="text-align:center;">Month</th>
            <th>Opening Bal</th>
            <th>EMI</th>
            <th>Interest Paid</th>
            <th>Principal Paid</th>
            <th>Closing Bal</th>
          </tr>
        </thead>
        <tbody>
          ${amortRows}
        </tbody>
      </table>
    </div>
  `;

  return `
    <div class="solution-step">
      <strong>Loan Summary:</strong><br>
      • Loan Principal = ${math.format(P, {notation: 'fixed', precision: 2})}<br>
      • Annual Rate = ${R}% (Monthly Rate = ${(monthlyRate * 100).toFixed(4)}%)<br>
      • Tenure = ${Y} Years (${totalMonths} Months)
    </div>
    <div class="solution-final">
      Monthly EMI: ${emi.toFixed(2)}<br>
      Total Interest: ${totalInterest.toFixed(2)}<br>
      Total Payable: ${totalPaid.toFixed(2)}
    </div>
    ${scheduleHTML}
  `;
}

// Simple and Compound Interest Solver
function solveInterest() {
  const P = parseFloat(document.getElementById('intPrincipal').value);
  const R = parseFloat(document.getElementById('intRate').value);
  const T = parseFloat(document.getElementById('intTime').value);
  const n = parseInt(document.getElementById('intCompounding').value);

  if ([P, R, T, n].some(isNaN) || P <= 0 || R <= 0 || T <= 0) {
    throw new Error("Please enter valid positive values for Principal, Rate, and Time.");
  }

  // Simple Interest: SI = P*R*T/100
  const siInterest = (P * R * T) / 100;
  const siTotal = P + siInterest;

  // Compound Interest: A = P * (1 + r/(n*100))^(n*T)
  const ciTotal = P * Math.pow(1 + R / (n * 100), n * T);
  const ciInterest = ciTotal - P;

  return `
    <div class="solution-step">
      <strong>Simple Interest Method:</strong><br>
      • Interest (SI) = P · R · T / 100 = ${P} · ${R}% · ${T} years = ${siInterest.toFixed(2)}<br>
      • Total Return (Principal + Interest) = ${siTotal.toFixed(2)}
    </div>
    <div class="solution-step">
      <strong>Compound Interest Method:</strong><br>
      • Compounding frequency = ${n} times per year<br>
      • Total Return (A) = P · [1 + R / (100·n)]<sup>(n·T)</sup><br>
      • Total Return = ${ciTotal.toFixed(2)}<br>
      • Computed Compound Interest = ${ciInterest.toFixed(2)}
    </div>
    <div class="solution-final">
      Simple Interest total: ${siTotal.toFixed(2)} (Interest: ${siInterest.toFixed(2)})<br>
      Compound Interest total: ${ciTotal.toFixed(2)} (Interest: ${ciInterest.toFixed(2)})
    </div>
  `;
}

// Future Value / Annuity Solver
function solveFutureValue() {
  const PMT = parseFloat(document.getElementById('fvPayment').value);
  const R = parseFloat(document.getElementById('fvRate').value);
  const periods = parseInt(document.getElementById('fvPeriods').value);
  const type = parseInt(document.getElementById('fvType').value); // 0 = Ordinary, 1 = Due

  if ([PMT, R, periods].some(isNaN) || PMT <= 0 || R < 0 || periods <= 0) {
    throw new Error("Please enter valid positive values for PMT, Rate, and Periods.");
  }

  const rateFraction = R / 100;
  let fv = 0;
  let calculationNote = '';

  if (rateFraction === 0) {
    fv = PMT * periods;
    calculationNote = `Rate is 0%. Future Value is simply PMT × periods.`;
  } else {
    // FV = PMT * [ (1+r)^n - 1 ] / r
    const ordinaryFV = PMT * (Math.pow(1 + rateFraction, periods) - 1) / rateFraction;
    
    if (type === 0) {
      fv = ordinaryFV;
      calculationNote = `Ordinary Annuity (payments made at the end of each period):<br>
        FV = PMT · [ (1+r)ⁿ - 1 ] / r`;
    } else {
      // Annuity Due: ordinary * (1+r)
      fv = ordinaryFV * (1 + rateFraction);
      calculationNote = `Annuity Due (payments made at the start of each period):<br>
        FV = PMT · [ (1+r)ⁿ - 1 ] / r · (1+r)`;
    }
  }

  const totalInvested = PMT * periods;
  const interestEarned = fv - totalInvested;

  return `
    <div class="solution-step">
      <strong>Annuity Parameters:</strong><br>
      • Periodic payment (PMT) = ${PMT.toFixed(2)}<br>
      • Interest rate per period (r) = ${R}%<br>
      • Total periods (n) = ${periods}<br>
      • ${calculationNote}
    </div>
    <div class="solution-final">
      Future Value (FV): ${fv.toFixed(2)}<br>
      Total Principal Invested: ${totalInvested.toFixed(2)}<br>
      Compound Interest Earned: ${interestEarned.toFixed(2)}
    </div>
  `;
}
