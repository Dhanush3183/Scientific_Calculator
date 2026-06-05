// general.js - Scientific Calculator Module
let expression = '0';
let shouldReset = false; // Reset screen on next number input (after evaluating)
const history = [];

// DOM Elements
let display;
let historyPreview;
let historyList;
let btnClearHistory;
let keypadScientific;
let keypadBasic;
let keypadTabs;

export function initGeneral() {
  // Override mathjs functions to work in degrees
  math.import({
    sin: function(x) { return Math.sin(x * Math.PI / 180); },
    cos: function(x) {
      const val = Math.cos(x * Math.PI / 180);
      return Math.abs(val) < 1e-14 ? 0 : val;
    },
    tan: function(x) {
      const rad = x * Math.PI / 180;
      if (Math.abs(Math.cos(rad)) < 1e-14) return NaN;
      const val = Math.tan(rad);
      return Math.abs(val) < 1e-14 ? 0 : val;
    },
    asin: function(x) { return Math.asin(x) * 180 / Math.PI; },
    acos: function(x) { return Math.acos(x) * 180 / Math.PI; },
    atan: function(x) { return Math.atan(x) * 180 / Math.PI; }
  }, { override: true });

  display = document.getElementById('generalDisplay');
  historyPreview = document.getElementById('generalHistoryPreview');
  historyList = document.getElementById('generalHistoryList');
  btnClearHistory = document.getElementById('clearHistoryBtn');
  keypadScientific = document.getElementById('keypadScientific');
  keypadBasic = document.getElementById('keypadBasic');
  keypadTabs = document.querySelectorAll('.keypad-tab');

  // Load history from localStorage if exists
  const savedHistory = localStorage.getItem('omnimath_history');
  if (savedHistory) {
    try {
      const parsed = JSON.parse(savedHistory);
      parsed.forEach(item => history.push(item));
      updateHistoryUI();
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }

  // Bind keypads toggle tabs
  keypadTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      keypadTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      const padType = tab.getAttribute('data-keypad');
      if (padType === 'sci') {
        keypadScientific.classList.remove('hidden');
        keypadBasic.classList.add('hidden');
      } else {
        keypadScientific.classList.add('hidden');
        keypadBasic.classList.remove('hidden');
      }
    });
  });

  // Event delegation for general buttons
  document.querySelectorAll('.keypad-grid button').forEach(button => {
    button.addEventListener('click', () => {
      const val = button.getAttribute('data-val');
      handleInput(val);
      
      // Visual feedback animation trigger
      button.classList.add('keyboard-pressed');
      setTimeout(() => button.classList.remove('keyboard-pressed'), 100);
    });
  });

  // Clear history button
  btnClearHistory?.addEventListener('click', () => {
    history.length = 0;
    localStorage.removeItem('omnimath_history');
    updateHistoryUI();
  });
}

// Global input handler (both click and keyboard)
export function handleInput(val) {
  if (!val) return;

  if (val === 'clear') {
    expression = '0';
    historyPreview.textContent = '';
    shouldReset = false;
  } else if (val === 'backspace') {
    if (expression === 'Error' || expression === 'Syntax Error' || expression === 'Infinity' || expression === 'NaN') {
      expression = '0';
    } else {
      expression = expression.slice(0, -1);
      if (expression === '') expression = '0';
    }
  } else if (val === 'equals') {
    evaluateExpression();
  } else if (val === 'parentheses') {
    // Context-smart parenthesis insert for Basic pad
    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;
    const lastChar = expression.slice(-1);
    
    if (expression === '0') {
      expression = '(';
    } else if (openCount > closeCount && !isNaN(lastChar) && lastChar !== '(') {
      expression += ')';
    } else if (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/' || lastChar === '(') {
      expression += '(';
    } else {
      expression += '*('; // Implicit multiplication
    }
  } else {
    // If screen is showing 0 or error, or we just evaluated, overwrite it under certain conditions
    if (expression === '0' || expression === 'Error' || expression === 'Syntax Error' || shouldReset) {
      // If we just evaluated and type an operator, append to the result
      if (shouldReset && ['+', '-', '*', '/', '^', '%'].includes(val)) {
        shouldReset = false;
      } else {
        expression = '';
        shouldReset = false;
      }
    }
    
    // Auto insert multiplier for e.g. "5pi" or "5("
    const lastChar = expression.slice(-1);
    const isNum = (c) => !isNaN(c) && c !== ' ';
    
    if (expression.length > 0 && isNum(lastChar)) {
      if (val === 'pi' || val === 'e' || val === 'phi' || val.includes('(')) {
        expression += '*';
      }
    }
    
    expression += val;
  }

  updateDisplay();
}

// Update the display screen
function updateDisplay() {
  // Convert standard math operators to nice screen signs
  let displayHTML = expression
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/pi/g, 'π')
    .replace(/phi/g, 'φ')
    .replace(/sin\^-1\(/g, 'sin⁻¹(')
    .replace(/cos\^-1\(/g, 'cos⁻¹(')
    .replace(/tan\^-1\(/g, 'tan⁻¹(');

  display.textContent = displayHTML;
}

// Compute the evaluation using math.js
function evaluateExpression() {
  if (expression === '0' || expression === '') return;
  
  // Translate visual tokens to math.js functions prior to evaluation
  let evalExpr = expression
    .replace(/sin\^-1\(/g, 'asin(')
    .replace(/cos\^-1\(/g, 'acos(')
    .replace(/tan\^-1\(/g, 'atan(')
    .replace(/sin⁻¹\(/g, 'asin(')
    .replace(/cos⁻¹\(/g, 'acos(')
    .replace(/tan⁻¹\(/g, 'atan(');
  
  // Basic bracket auto-completion
  const openCount = (evalExpr.match(/\(/g) || []).length;
  const closeCount = (evalExpr.match(/\)/g) || []).length;
  if (openCount > closeCount) {
    evalExpr += ')'.repeat(openCount - closeCount);
  }

  try {
    // Evaluate via MathJS library
    let result = math.evaluate(evalExpr);
    
    // Format numeric responses neatly
    let formattedResult;
    if (typeof result === 'number') {
      if (Math.abs(result) < 1e-12 && Math.abs(result) > 0) {
        formattedResult = '0';
      } else {
        // Prevent floating point errors
        formattedResult = math.format(result, { precision: 14 });
      }
    } else if (result && result.isComplex) {
      // Custom format complex outputs
      formattedResult = result.toString();
    } else if (result && typeof result.toString === 'function') {
      formattedResult = result.toString();
    } else {
      formattedResult = String(result);
    }

    // Save to history list
    historyPreview.textContent = expression + ' =';
    saveHistory(expression, formattedResult);
    
    expression = formattedResult;
    shouldReset = true;
  } catch (error) {
    console.error("MathJS Evaluation Error:", error);
    historyPreview.textContent = expression + ' =';
    expression = 'Syntax Error';
    shouldReset = true;
  }
}

// Save history record
function saveHistory(expr, res) {
  const item = { expr, res, id: Date.now() };
  history.unshift(item);
  
  // Limit to 50 items
  if (history.length > 50) history.pop();
  
  localStorage.setItem('omnimath_history', JSON.stringify(history));
  updateHistoryUI();
}

// Draw history items
function updateHistoryUI() {
  if (!historyList) return;
  
  if (history.length === 0) {
    historyList.innerHTML = '<div class="no-history">No calculations yet</div>';
    return;
  }
  
  historyList.innerHTML = history.map(item => `
    <div class="history-item" data-expr="${item.expr}" data-res="${item.res}">
      <div class="hist-expr">${item.expr.replace(/\*/g, '×').replace(/\//g, '÷')}</div>
      <div class="hist-res">${item.res}</div>
    </div>
  `).join('');
  
  // Bind click handlers to reload elements
  historyList.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      expression = el.getAttribute('data-expr');
      historyPreview.textContent = '';
      shouldReset = false;
      updateDisplay();
    });
  });
}

// Keyboard input binding router
export function handleGeneralKeyboard(e) {
  const key = e.key;

  // Numbers 0-9
  if (/[0-9]/.test(key)) {
    handleInput(key);
    animateKeyButton(key);
  }
  // Decimal point
  else if (key === '.') {
    handleInput('.');
    animateKeyButton('.');
  }
  // Math operators
  else if (key === '+') {
    handleInput('+');
    animateKeyButton('+');
  } else if (key === '-') {
    handleInput('-');
    animateKeyButton('-');
  } else if (key === '*') {
    handleInput('*');
    animateKeyButton('*');
  } else if (key === '/') {
    handleInput('/');
    animateKeyButton('/');
  } else if (key === '%') {
    handleInput('%');
    animateKeyButton('%');
  } else if (key === '^') {
    handleInput('^');
    animateKeyButton('^');
  }
  // Parentheses
  else if (key === '(') {
    handleInput('(');
    animateKeyButton('(');
  } else if (key === ')') {
    handleInput(')');
    animateKeyButton(')');
  }
  // Equals / Enter
  else if (key === 'Enter' || key === '=') {
    e.preventDefault();
    handleInput('equals');
    animateKeyButton('equals');
  }
  // Backspace / Delete
  else if (key === 'Backspace') {
    handleInput('backspace');
    animateKeyButton('backspace');
  }
  // Clear (Escape / C)
  else if (key === 'Escape' || key.toLowerCase() === 'c') {
    handleInput('clear');
    animateKeyButton('clear');
  }
}

// Visual button feedback animation
function animateKeyButton(val) {
  // Find button based on data-val
  const selector = `.keypad-grid button[data-val="${val}"]`;
  const button = document.querySelector(selector);
  if (button) {
    button.classList.add('keyboard-pressed');
    setTimeout(() => button.classList.remove('keyboard-pressed'), 100);
  }
}
