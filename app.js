// app.js - Main Application Entry & Controller

// Imports of modules
import { initGeneral, handleGeneralKeyboard } from './modules/general.js?v=1.3';
import { initEquations } from './modules/equations.js?v=1.3';
import { initMatrix, handleMatrixResize } from './modules/matrix.js?v=1.3';
import { initCalculus } from './modules/calculus.js?v=1.3';
import { initVectors } from './modules/vectors.js?v=1.3';
import { initStats } from './modules/statistics.js?v=1.3';
import { initBaseConv } from './modules/baseconv.js?v=1.3';
import { initComplex } from './modules/complex.js?v=1.3';
import { initFinance } from './modules/finance.js?v=1.3';
import { initUnits } from './modules/units.js?v=1.3';
import { initInequality } from './modules/inequality.js?v=1.3';
import { initRatio } from './modules/ratio.js?v=1.3';
import { initHigher } from './modules/higher.js?v=1.3';
import { initGrapher, resizeGraphCanvas } from './modules/grapher.js?v=1.3';

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & UI Elements
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  const moduleTitle = document.getElementById('moduleTitle');
  const themeToggle = document.getElementById('themeToggle');
  const navItems = document.querySelectorAll('.nav-item');
  const panels = document.querySelectorAll('.calc-panel');

  let currentPanelId = 'general-calc';

  // Panel navigation router
  function switchPanel(targetId) {
    currentPanelId = targetId;
    
    // Deactivate current nav items and panels
    navItems.forEach(item => item.classList.remove('active'));
    panels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Activate the clicked one
    const activeNavItem = Array.from(navItems).find(item => item.getAttribute('data-target') === targetId);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
      moduleTitle.textContent = activeNavItem.querySelector('span').textContent;
    }

    const targetPanel = document.getElementById(targetId);
    if (targetPanel) {
      targetPanel.classList.add('active');
      
      // Module specific panel-open hooks
      if (targetId === 'grapher') {
        // Redraw canvas since size changes on display
        setTimeout(resizeGraphCanvas, 100);
      } else if (targetId === 'matrix-calc') {
        // Redraw matrices sizes
        setTimeout(handleMatrixResize, 50);
      }
    }

    // Close sidebar on mobile after clicking
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('active');
    }
  }

  // Sidebar item click binding
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      switchPanel(targetId);
    });
  });

  // Mobile menu toggle
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('active');
  });

  // Click outside sidebar on mobile closes it
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && e.target !== menuToggle && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    }
  });

  // Theme Toggle (Magic Theme)
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('magic-theme');
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('magic-theme')) {
      icon.className = 'fa-solid fa-wand-magic-sparkles';
      themeToggle.setAttribute('title', 'Switch to standard clean light theme');
    } else {
      icon.className = 'fa-solid fa-wand-magic-sparkles';
      themeToggle.setAttribute('title', 'Switch to magic violet theme');
    }
  });

  // Global Keyboard Event Handler
  document.addEventListener('keydown', (e) => {
    // If a text input field is focused, let normal input happen
    const activeEl = document.activeElement;
    const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') && activeEl.id !== 'generalDisplay';

    if (isInputFocused) {
      // If it's a number/operator inside a matrix or other field, let it work normally
      // But if Enter is pressed in a solver input, we can trigger the solver!
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerActivePanelSolve();
      }
      return;
    }

    // Otherwise, route key events to specific handlers
    if (currentPanelId === 'general-calc') {
      handleGeneralKeyboard(e);
    } else {
      // If on other panels and hit enter, trigger solve
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerActivePanelSolve();
      }
    }
  });

  // Help solve action triggering on Enter
  function triggerActivePanelSolve() {
    switch (currentPanelId) {
      case 'equation-solver':
        document.getElementById('btnSolveEquation')?.click();
        break;
      case 'matrix-calc':
        // Solve isn't standard, it depends on operations. Do nothing or standard add
        break;
      case 'calculus-solver':
        document.getElementById('btnSolveCalculus')?.click();
        break;
      case 'stats-calc':
        document.getElementById('btnSolveStats')?.click();
        break;
      case 'base-conv':
        document.getElementById('btnSolveBase')?.click();
        break;
      case 'finance-calc':
        document.getElementById('btnSolveFinance')?.click();
        break;
      case 'inequality-solver':
        document.getElementById('btnSolveInequality')?.click();
        break;
      case 'ratio-solver':
        document.getElementById('btnSolveRatio')?.click();
        break;
      case 'higher-calc':
        document.getElementById('btnSolveHigher')?.click();
        break;
    }
  }

  // Initializing individual modules
  initGeneral();
  initEquations();
  initMatrix();
  initCalculus();
  initVectors();
  initStats();
  initBaseConv();
  initComplex();
  initFinance();
  initUnits();
  initInequality();
  initRatio();
  initHigher();
  initGrapher();

  // Handle resizing of grapher canvas on window resize
  window.addEventListener('resize', () => {
    if (currentPanelId === 'grapher') {
      resizeGraphCanvas();
    }
  });
});
