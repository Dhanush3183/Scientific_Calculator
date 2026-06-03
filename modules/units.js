// units.js - Unit Converter Module

const unitsMap = {
  length: [
    { name: 'Millimeters (mm)', code: 'mm' },
    { name: 'Centimeters (cm)', code: 'cm' },
    { name: 'Meters (m)', code: 'm' },
    { name: 'Kilometers (km)', code: 'km' },
    { name: 'Inches (in)', code: 'inch' },
    { name: 'Feet (ft)', code: 'foot' },
    { name: 'Yards (yd)', code: 'yard' },
    { name: 'Miles (mi)', code: 'mile' }
  ],
  mass: [
    { name: 'Milligrams (mg)', code: 'mg' },
    { name: 'Grams (g)', code: 'g' },
    { name: 'Kilograms (kg)', code: 'kg' },
    { name: 'Ounces (oz)', code: 'oz' },
    { name: 'Pounds (lb)', code: 'lb' },
    { name: 'Tons', code: 'ton' }
  ],
  area: [
    { name: 'Square Centimeters', code: 'cm^2' },
    { name: 'Square Meters', code: 'm^2' },
    { name: 'Hectares', code: 'hectare' },
    { name: 'Square Kilometers', code: 'km^2' },
    { name: 'Square Inches', code: 'sqin' },
    { name: 'Square Feet', code: 'sqft' },
    { name: 'Acres', code: 'acre' },
    { name: 'Square Miles', code: 'sqmile' }
  ],
  volume: [
    { name: 'Milliliters (ml)', code: 'ml' },
    { name: 'Liters (L)', code: 'liter' },
    { name: 'Cubic Meters (m³)', code: 'm3' },
    { name: 'Cups', code: 'cup' },
    { name: 'Pints', code: 'pint' },
    { name: 'Quarts', code: 'quart' },
    { name: 'Gallons', code: 'gallon' },
    { name: 'Fluid Ounces (fl oz)', code: 'floz' }
  ],
  speed: [
    { name: 'Meters/second (m/s)', code: 'm/s' },
    { name: 'Kilometers/hour (km/h)', code: 'km/h' },
    { name: 'Miles/hour (mph)', code: 'mph' },
    { name: 'Knots', code: 'knot' }
  ],
  temperature: [
    { name: 'Celsius (°C)', code: 'degC' },
    { name: 'Fahrenheit (°F)', code: 'degF' },
    { name: 'Kelvin (K)', code: 'K' }
  ],
  angle: [
    { name: 'Degrees (°)', code: 'deg' },
    { name: 'Radians (rad)', code: 'rad' },
    { name: 'Gradians (grad)', code: 'grad' },
    { name: 'Cycles', code: 'cycle' }
  ],
  time: [
    { name: 'Milliseconds (ms)', code: 'ms' },
    { name: 'Seconds (s)', code: 'second' },
    { name: 'Minutes (min)', code: 'minute' },
    { name: 'Hours (h)', code: 'hour' },
    { name: 'Days (d)', code: 'day' },
    { name: 'Weeks (w)', code: 'week' },
    { name: 'Months (mo)', code: 'month' },
    { name: 'Years (yr)', code: 'year' }
  ]
};

let categorySelect;
let inputValEl;
let outputValEl;
let unitFromSelect;
let unitToSelect;

export function initUnits() {
  categorySelect = document.getElementById('unitCategory');
  inputValEl = document.getElementById('unitInputVal');
  outputValEl = document.getElementById('unitOutputVal');
  unitFromSelect = document.getElementById('unitFrom');
  unitToSelect = document.getElementById('unitTo');

  // Event listeners for real-time calculations
  categorySelect?.addEventListener('change', handleCategoryChange);
  inputValEl?.addEventListener('input', runConversion);
  unitFromSelect?.addEventListener('change', runConversion);
  unitToSelect?.addEventListener('change', runConversion);

  // Initialize
  handleCategoryChange();
}

function handleCategoryChange() {
  const cat = categorySelect.value;
  const list = unitsMap[cat] || [];

  // Populate From and To selectors
  let fromOptions = '';
  let toOptions = '';

  list.forEach((unit, idx) => {
    // Select first and second item by default
    const selFrom = idx === 0 ? 'selected' : '';
    const selTo = idx === 1 ? 'selected' : (list.length === 1 ? 'selected' : '');
    
    fromOptions += `<option value="${unit.code}" ${selFrom}>${unit.name}</option>`;
    toOptions += `<option value="${unit.code}" ${selTo}>${unit.name}</option>`;
  });

  unitFromSelect.innerHTML = fromOptions;
  unitToSelect.innerHTML = toOptions;

  runConversion();
}

function runConversion() {
  const val = parseFloat(inputValEl.value);
  if (isNaN(val)) {
    outputValEl.value = '';
    return;
  }

  const fromUnit = unitFromSelect.value;
  const toUnit = unitToSelect.value;
  
  if (fromUnit === toUnit) {
    outputValEl.value = val;
    return;
  }

  try {
    // Convert via math.js units
    // math.unit(value, unitStr).toNumber(targetUnitStr)
    let result;
    
    if (categorySelect.value === 'temperature') {
      // Temperature conversions in math.js sometimes require specific handles
      // because they have offset shifts, toNumber is the correct conversion method
      result = math.unit(val, fromUnit).toNumber(toUnit);
    } else {
      result = math.unit(val, fromUnit).toNumber(toUnit);
    }
    
    outputValEl.value = math.format(result, { precision: 8 });
  } catch (err) {
    console.error("Conversion error", err);
    outputValEl.value = 'Error';
  }
}
