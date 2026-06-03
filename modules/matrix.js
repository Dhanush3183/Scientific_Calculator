// matrix.js - Matrix Calculator Module

let matrixASizeSelect;
let matrixBSizeSelect;
let matrixAGrid;
let matrixBGrid;
let matrixSolutionDisplay;
let matrixResultContent;

export function initMatrix() {
  matrixASizeSelect = document.getElementById('matrixASize');
  matrixBSizeSelect = document.getElementById('matrixBSize');
  matrixAGrid = document.getElementById('matrixAGrid');
  matrixBGrid = document.getElementById('matrixBGrid');
  matrixSolutionDisplay = document.getElementById('matrixSolutionDisplay');
  matrixResultContent = document.getElementById('matrixResultContent');

  // Trigger grid draws on size changes
  matrixASizeSelect?.addEventListener('change', drawMatrixAGrid);
  matrixBSizeSelect?.addEventListener('change', drawMatrixBGrid);

  // Matrix A quick actions
  document.getElementById('btnMatrixAClear')?.addEventListener('click', () => fillMatrix('A', 0));
  document.getElementById('btnMatrixAIdentity')?.addEventListener('click', () => makeIdentity('A'));
  document.getElementById('btnMatrixARandom')?.addEventListener('click', () => fillMatrixRandom('A'));

  // Matrix B quick actions
  document.getElementById('btnMatrixBClear')?.addEventListener('click', () => fillMatrix('B', 0));
  document.getElementById('btnMatrixBIdentity')?.addEventListener('click', () => makeIdentity('B'));
  document.getElementById('btnMatrixBRandom')?.addEventListener('click', () => fillMatrixRandom('B'));

  // Bind arithmetic operations
  document.getElementById('btnMatrixAdd')?.addEventListener('click', () => solveMatrixOp('add'));
  document.getElementById('btnMatrixSub')?.addEventListener('click', () => solveMatrixOp('sub'));
  document.getElementById('btnMatrixMul')?.addEventListener('click', () => solveMatrixOp('mul'));

  // Unary operations
  document.getElementById('btnMatrixDet')?.addEventListener('click', () => solveMatrixOp('det'));
  document.getElementById('btnMatrixInv')?.addEventListener('click', () => solveMatrixOp('inv'));
  document.getElementById('btnMatrixTrans')?.addEventListener('click', () => solveMatrixOp('transpose'));
  document.getElementById('btnMatrixRank')?.addEventListener('click', () => solveMatrixOp('rank'));
  document.getElementById('btnMatrixEigen')?.addEventListener('click', () => solveMatrixOp('eigen'));

  // Initial draw
  drawMatrixAGrid();
  drawMatrixBGrid();
}

// Window resize helper
export function handleMatrixResize() {
  // In case sizes need to adjust on display toggle
}

function drawMatrixAGrid() {
  const size = parseInt(matrixASizeSelect.value);
  generateGrid(matrixAGrid, 'A', size);
}

function drawMatrixBGrid() {
  const size = parseInt(matrixBSizeSelect.value);
  generateGrid(matrixBGrid, 'B', size);
}

// Draw dynamic grid of inputs
function generateGrid(container, prefix, size) {
  if (!container) return;
  
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  let html = '';
  
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Set some initial values
      let initVal = 0;
      if (prefix === 'A') {
        if (r === c) initVal = 1; // Default A to Identity
      } else {
        if (r === c) initVal = 2; // Default B to 2 * Identity
      }
      
      html += `<input type="number" id="mat${prefix}_${r}_${c}" value="${initVal}">`;
    }
  }
  
  container.innerHTML = html;
}

// Read inputs into 2D Array
function getMatrixValues(prefix) {
  const size = parseInt(prefix === 'A' ? matrixASizeSelect.value : matrixBSizeSelect.value);
  const mat = [];
  
  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      const val = parseFloat(document.getElementById(`mat${prefix}_${r}_${c}`).value);
      row.push(isNaN(val) ? 0 : val);
    }
    mat.push(row);
  }
  
  return mat;
}

// Quick action: Clear
function fillMatrix(prefix, val) {
  const size = parseInt(prefix === 'A' ? matrixASizeSelect.value : matrixBSizeSelect.value);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      document.getElementById(`mat${prefix}_${r}_${c}`).value = val;
    }
  }
}

// Quick action: Identity
function makeIdentity(prefix) {
  const size = parseInt(prefix === 'A' ? matrixASizeSelect.value : matrixBSizeSelect.value);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      document.getElementById(`mat${prefix}_${r}_${c}`).value = r === c ? 1 : 0;
    }
  }
}

// Quick action: Random integers [-9, 9]
function fillMatrixRandom(prefix) {
  const size = parseInt(prefix === 'A' ? matrixASizeSelect.value : matrixBSizeSelect.value);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const rand = Math.floor(Math.random() * 19) - 9; // -9 to 9
      document.getElementById(`mat${prefix}_${r}_${c}`).value = rand;
    }
  }
}

// Display output matrix HTML
function formatResultMatrix(mat) {
  const rows = mat.length;
  const cols = mat[0].length;
  
  let html = `<div class="result-matrix" style="grid-template-columns: repeat(${cols}, auto)">`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const formatted = math.format(mat[r][c], { precision: 6 });
      html += `<div class="result-cell">${formatted}</div>`;
    }
  }
  html += '</div>';
  return html;
}

// Run Operations
function solveMatrixOp(op) {
  const sizeA = parseInt(matrixASizeSelect.value);
  const sizeB = parseInt(matrixBSizeSelect.value);
  const A = getMatrixValues('A');
  
  let resultHTML = '';
  
  try {
    if (op === 'add') {
      if (sizeA !== sizeB) {
        throw new Error("Matrix dimensions must match for addition (A and B sizes must be equal).");
      }
      const B = getMatrixValues('B');
      const res = math.add(A, B);
      resultHTML = `<h5>Matrix A + B Result:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'sub') {
      if (sizeA !== sizeB) {
        throw new Error("Matrix dimensions must match for subtraction (A and B sizes must be equal).");
      }
      const B = getMatrixValues('B');
      const res = math.subtract(A, B);
      resultHTML = `<h5>Matrix A - B Result:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'mul') {
      if (sizeA !== sizeB) {
        throw new Error("Currently, operations are configured for square matrices, Matrix sizes must match.");
      }
      const B = getMatrixValues('B');
      const res = math.multiply(A, B);
      resultHTML = `<h5>Matrix A × B Result:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'det') {
      const res = math.det(A);
      resultHTML = `<h5>Determinant of A:</h5>
        <div class="solution-final">det(A) = ${math.format(res, { precision: 8 })}</div>`;
    } 
    else if (op === 'inv') {
      const det = math.det(A);
      if (Math.abs(det) < 1e-12) {
        throw new Error("Determinant is 0; Matrix is singular and cannot be inverted.");
      }
      const res = math.inv(A);
      resultHTML = `<h5>Inverse Matrix A⁻¹:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'transpose') {
      const res = math.transpose(A);
      resultHTML = `<h5>Transpose Matrix Aᵀ:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'rank') {
      const rk = computeMatrixRank(A);
      resultHTML = `<h5>Rank of A:</h5>
        <div class="solution-final">Rank(A) = ${rk}</div>
        <p style="margin-top: 8px; font-size: 0.85rem; color: var(--text-muted)">
          Calculated via row reduction to Row Echelon Form (REF).
        </p>`;
    } 
    else if (op === 'eigen') {
      // math.eigs returns eigenvalues/eigenvectors for real symmetric matrices
      // To prevent crashes on non-symmetric matrices, we trap errors
      try {
        const res = math.eigs(A);
        let vals;
        if (res && res.values) {
          vals = res.values;
        } else {
          vals = res;
        }
        
        let eigenValsText = '';
        if (Array.isArray(vals)) {
          eigenValsText = vals.map((v, i) => `λ<sub>${i+1}</sub> = ${math.format(v, { precision: 6 })}`).join('<br>');
        } else if (vals.toArray) {
          eigenValsText = vals.toArray().map((v, i) => `λ<sub>${i+1}</sub> = ${math.format(v, { precision: 6 })}`).join('<br>');
        } else {
          eigenValsText = String(vals);
        }
        
        resultHTML = `<h5>Eigenvalues (Real Symmetric/Approximated):</h5>
          <div class="solution-final">${eigenValsText}</div>`;
      } catch (eigErr) {
        // If not symmetric, math.js eigs might fail. Show message.
        resultHTML = `<h5>Eigenvalues:</h5>
          <div class="solution-step" style="color: var(--accent-danger)">
            <strong>Note:</strong> math.js native eigenvalue solver is limited to real symmetric matrices. For non-symmetric matrices, eigenvalues may be complex or require manual calculation.
          </div>`;
      }
    }
  } catch (err) {
    resultHTML = `<div class="solution-step" style="color: var(--accent-danger)">
      <strong>Operation Error:</strong> ${err.message}
    </div>`;
  }
  
  matrixResultContent.innerHTML = resultHTML;
  matrixSolutionDisplay.classList.remove('hidden');
  matrixSolutionDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Compute rank of matrix using row echelon reduction
function computeMatrixRank(matrix) {
  let A = matrix.map(row => [...row]); // Deep copy
  const rows = A.length;
  const cols = A[0].length;
  let rank = 0;
  let r = 0;
  
  for (let c = 0; c < cols; c++) {
    // Find pivot row
    let pivotRow = r;
    while (pivotRow < rows && Math.abs(A[pivotRow][c]) < 1e-9) {
      pivotRow++;
    }
    
    if (pivotRow === rows) {
      continue; // No pivot in this column
    }
    
    // Swap rows
    if (r !== pivotRow) {
      let temp = A[r];
      A[r] = A[pivotRow];
      A[pivotRow] = temp;
    }
    
    // Eliminate all values below pivot row
    for (let i = r + 1; i < rows; i++) {
      let factor = A[i][c] / A[r][c];
      for (let j = c; j < cols; j++) {
        A[i][j] -= factor * A[r][j];
      }
    }
    
    rank++;
    r++;
    if (r === rows) break;
  }
  
  return rank;
}
