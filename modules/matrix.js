// matrix.js - Matrix Calculator Module

let matrixARowsSelect;
let matrixAColsSelect;
let matrixBRowsSelect;
let matrixBColsSelect;
let matrixAGrid;
let matrixBGrid;
let matrixSolutionDisplay;
let matrixResultContent;

export function initMatrix() {
  matrixARowsSelect = document.getElementById('matrixARows');
  matrixAColsSelect = document.getElementById('matrixACols');
  matrixBRowsSelect = document.getElementById('matrixBRows');
  matrixBColsSelect = document.getElementById('matrixBCols');
  matrixAGrid = document.getElementById('matrixAGrid');
  matrixBGrid = document.getElementById('matrixBGrid');
  matrixSolutionDisplay = document.getElementById('matrixSolutionDisplay');
  matrixResultContent = document.getElementById('matrixResultContent');

  // Trigger grid draws on size changes
  matrixARowsSelect?.addEventListener('change', drawMatrixAGrid);
  matrixAColsSelect?.addEventListener('change', drawMatrixAGrid);
  matrixBRowsSelect?.addEventListener('change', drawMatrixBGrid);
  matrixBColsSelect?.addEventListener('change', drawMatrixBGrid);

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
  const rows = parseInt(matrixARowsSelect.value);
  const cols = parseInt(matrixAColsSelect.value);
  generateGrid(matrixAGrid, 'A', rows, cols);
}

function drawMatrixBGrid() {
  const rows = parseInt(matrixBRowsSelect.value);
  const cols = parseInt(matrixBColsSelect.value);
  generateGrid(matrixBGrid, 'B', rows, cols);
}

// Draw dynamic grid of inputs
function generateGrid(container, prefix, rows, cols) {
  if (!container) return;
  
  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  let html = '';
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Set some initial values
      let initVal = 0;
      if (r === c) {
        initVal = prefix === 'A' ? 1 : 2; // Default A/B diagonal
      }
      
      html += `<input type="number" id="mat${prefix}_${r}_${c}" value="${initVal}">`;
    }
  }
  
  container.innerHTML = html;
}

// Read inputs into 2D Array
function getMatrixValues(prefix) {
  const rows = parseInt(prefix === 'A' ? matrixARowsSelect.value : matrixBRowsSelect.value);
  const cols = parseInt(prefix === 'A' ? matrixAColsSelect.value : matrixBColsSelect.value);
  const mat = [];
  
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const val = parseFloat(document.getElementById(`mat${prefix}_${r}_${c}`).value);
      row.push(isNaN(val) ? 0 : val);
    }
    mat.push(row);
  }
  
  return mat;
}

// Quick action: Clear
function fillMatrix(prefix, val) {
  const rows = parseInt(prefix === 'A' ? matrixARowsSelect.value : matrixBRowsSelect.value);
  const cols = parseInt(prefix === 'A' ? matrixAColsSelect.value : matrixBColsSelect.value);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      document.getElementById(`mat${prefix}_${r}_${c}`).value = val;
    }
  }
}

// Quick action: Identity (1 on diagonal, 0 elsewhere)
function makeIdentity(prefix) {
  const rows = parseInt(prefix === 'A' ? matrixARowsSelect.value : matrixBRowsSelect.value);
  const cols = parseInt(prefix === 'A' ? matrixAColsSelect.value : matrixBColsSelect.value);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      document.getElementById(`mat${prefix}_${r}_${c}`).value = r === c ? 1 : 0;
    }
  }
}

// Quick action: Random integers [-9, 9]
function fillMatrixRandom(prefix) {
  const rows = parseInt(prefix === 'A' ? matrixARowsSelect.value : matrixBRowsSelect.value);
  const cols = parseInt(prefix === 'A' ? matrixAColsSelect.value : matrixBColsSelect.value);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.floor(Math.random() * 19) - 9; // -9 to 9
      document.getElementById(`mat${prefix}_${r}_${c}`).value = rand;
    }
  }
}

// Display output matrix HTML
function formatResultMatrix(mat) {
  const rows = mat.length;
  // If mat is a 1D array returned by transposing 1xN, math.js might return it. 
  // Let's standardise to 2D
  let matrix2D = Array.isArray(mat[0]) ? mat : [mat];
  
  // Transpose of 1D array can happen, ensure standard rows/cols count
  const formattedRows = matrix2D.length;
  const formattedCols = matrix2D[0].length;
  
  let html = `<div class="result-matrix" style="grid-template-columns: repeat(${formattedCols}, auto)">`;
  for (let r = 0; r < formattedRows; r++) {
    for (let c = 0; c < formattedCols; c++) {
      const formatted = math.format(matrix2D[r][c], { precision: 6 });
      html += `<div class="result-cell">${formatted}</div>`;
    }
  }
  html += '</div>';
  return html;
}

// Run Operations
function solveMatrixOp(op) {
  const rowsA = parseInt(matrixARowsSelect.value);
  const colsA = parseInt(matrixAColsSelect.value);
  const rowsB = parseInt(matrixBRowsSelect.value);
  const colsB = parseInt(matrixBColsSelect.value);
  
  const A = getMatrixValues('A');
  let resultHTML = '';
  
  try {
    if (op === 'add') {
      if (rowsA !== rowsB || colsA !== colsB) {
        throw new Error(`Dimensions must match for addition. Matrix A is ${rowsA}x${colsA}, Matrix B is ${rowsB}x${colsB}.`);
      }
      const B = getMatrixValues('B');
      const res = math.add(A, B);
      resultHTML = `<h5>Matrix A + B Result:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'sub') {
      if (rowsA !== rowsB || colsA !== colsB) {
        throw new Error(`Dimensions must match for subtraction. Matrix A is ${rowsA}x${colsA}, Matrix B is ${rowsB}x${colsB}.`);
      }
      const B = getMatrixValues('B');
      const res = math.subtract(A, B);
      resultHTML = `<h5>Matrix A - B Result:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'mul') {
      if (colsA !== rowsB) {
        throw new Error(`Inner dimensions must match for multiplication. Matrix A columns (${colsA}) must equal Matrix B rows (${rowsB}).`);
      }
      const B = getMatrixValues('B');
      const res = math.multiply(A, B);
      resultHTML = `<h5>Matrix A × B Result:</h5>` + formatResultMatrix(res);
    } 
    else if (op === 'det') {
      if (rowsA !== colsA) {
        throw new Error(`Matrix must be square to compute determinant. Current size: ${rowsA}x${colsA}.`);
      }
      const res = math.det(A);
      resultHTML = `<h5>Determinant of A:</h5>
        <div class="solution-final">det(A) = ${math.format(res, { precision: 8 })}</div>`;
    } 
    else if (op === 'inv') {
      if (rowsA !== colsA) {
        throw new Error(`Matrix must be square to compute inverse. Current size: ${rowsA}x${colsA}.`);
      }
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
      if (rowsA !== colsA) {
        throw new Error(`Matrix must be square to calculate eigenvalues. Current size: ${rowsA}x${colsA}.`);
      }
      try {
        const res = math.eigs(A);
        let vals = res.values || res;
        
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
