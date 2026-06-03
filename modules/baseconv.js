// baseconv.js - Base Converter Module

let inputValEl;
let inputTypeEl;
let bitwiseValBEl;
let bitwiseOpEl;
let solveBtn;
let baseSolutionDisplay;
let baseResultContent;

export function initBaseConv() {
  inputValEl = document.getElementById('baseInputVal');
  inputTypeEl = document.getElementById('baseInputType');
  bitwiseValBEl = document.getElementById('bitwiseValB');
  bitwiseOpEl = document.getElementById('bitwiseOp');
  solveBtn = document.getElementById('btnSolveBase');
  baseSolutionDisplay = document.getElementById('baseSolutionDisplay');
  baseResultContent = document.getElementById('baseResultContent');

  // Solver trigger
  solveBtn?.addEventListener('click', solveBaseCalculations);
}

function solveBaseCalculations() {
  const inputStr = inputValEl.value.trim();
  const inputBase = parseInt(inputTypeEl.value);
  
  let html = '';
  
  try {
    if (!inputStr) throw new Error("Please enter a value to convert.");

    // Parse value in input base
    const decVal = parseInt(inputStr, inputBase);
    
    if (isNaN(decVal)) {
      throw new Error(`Invalid input value for Base ${inputBase}.`);
    }

    // Convert to standard bases
    const binStr = decVal.toString(2);
    const octStr = decVal.toString(8);
    const decStr = decVal.toString(10);
    const hexStr = decVal.toString(16).toUpperCase();

    // Check if bitwise operation is requested
    const valBStr = bitwiseValBEl.value.trim();
    const op = bitwiseOpEl.value;
    
    let bitwiseHTML = '';
    
    if (valBStr || op === 'NOT') {
      const valB = parseInt(valBStr) || 0;
      if (isNaN(valB) && op !== 'NOT') throw new Error("Bitwise Value B must be a valid integer.");

      let bitwiseResult = 0;
      let opSign = '';
      
      switch (op) {
        case 'AND':
          bitwiseResult = decVal & valB;
          opSign = '&';
          break;
        case 'OR':
          bitwiseResult = decVal | valB;
          opSign = '|';
          break;
        case 'XOR':
          bitwiseResult = decVal ^ valB;
          opSign = '^';
          break;
        case 'NOT':
          bitwiseResult = ~decVal;
          opSign = '~';
          break;
        case 'SHL':
          bitwiseResult = decVal << valB;
          opSign = '<<';
          break;
        case 'SHR':
          bitwiseResult = decVal >> valB;
          opSign = '>>';
          break;
      }

      // Convert bitwise result to bases
      // Masking to 32-bit unsigned to display positive representations for negative bitwise results
      const u32Result = bitwiseResult >>> 0;
      
      bitwiseHTML = `
        <h5 style="margin-top: 20px;">Bitwise Operation Result:</h5>
        <div class="solution-step">
          <strong>Calculation:</strong> ${decVal} ${opSign} ${op === 'NOT' ? '' : valB} = ${bitwiseResult}
        </div>
        <table class="base-results-table">
          <thead>
            <tr>
              <th>Base</th>
              <th>Representation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Decimal</td>
              <td class="code-val">${bitwiseResult}</td>
            </tr>
            <tr>
              <td>Binary</td>
              <td class="code-val">${formatBinary(u32Result.toString(2))}</td>
            </tr>
            <tr>
              <td>Octal</td>
              <td class="code-val">${u32Result.toString(8)}</td>
            </tr>
            <tr>
              <td>Hexadecimal</td>
              <td class="code-val">0x${u32Result.toString(16).toUpperCase()}</td>
            </tr>
          </tbody>
        </table>
      `;
    }

    // Base conversions HTML
    html = `
      <h5>Base Representations:</h5>
      <table class="base-results-table">
        <thead>
          <tr>
            <th>Base</th>
            <th>Representation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Decimal (Base 10)</td>
            <td class="code-val">${decStr}</td>
          </tr>
          <tr>
            <td>Binary (Base 2)</td>
            <td class="code-val">${formatBinary(binStr)}</td>
          </tr>
          <tr>
            <td>Octal (Base 8)</td>
            <td class="code-val">${octStr}</td>
          </tr>
          <tr>
            <td>Hexadecimal (Base 16)</td>
            <td class="code-val">0x${hexStr}</td>
          </tr>
        </tbody>
      </table>
      ${bitwiseHTML}
    `;

  } catch (err) {
    html = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Error:</strong> ${err.message}
    </div>`;
  }

  baseResultContent.innerHTML = html;
  baseSolutionDisplay.classList.remove('hidden');
  baseSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Group binary strings in 4-bit nibbles for premium visual layout
function formatBinary(binStr) {
  // Pad with leading zeros to multiple of 4
  const rem = binStr.length % 4;
  let padded = rem === 0 ? binStr : '0'.repeat(4 - rem) + binStr;
  
  // Split in groups of 4
  const chunks = [];
  for (let i = 0; i < padded.length; i += 4) {
    chunks.push(padded.slice(i, i + 4));
  }
  return chunks.join(' ');
}
