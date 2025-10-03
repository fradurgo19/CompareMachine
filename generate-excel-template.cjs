const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Create workbook
const workbook = XLSX.utils.book_new();

// Define template structure with example data
const templateData = [
  {
    'Model': 'ZX38U-5A',
    'Manufacturer': 'Hitachi',
    'Category': 'EXCAVATORS',
    'Region Offerings': 'SE Asia, Oceania, Europe',
    'Canopy Version Weight (kg)': 3770,
    'Cab Version Weight (kg)': 3940,
    'Operating Weight Range (kg)': 4000,
    'Bucket Capacity (m³)': 0.10,
    'Emission Standard EU': 'Stage III A',
    'Emission Standard EPA': 'Interim Tier4',
    'Engine Model': 'Yanmar EDM-3TNV88',
    'Rated Power ISO9249 (kW)': 21.2,
    'Rated Power SAE J1349 (kW)': 21.2,
    'Rated Power EEC 80/1269 (kW)': 21.2,
    'Number of Cylinders': 3,
    'Bore x Stroke (mm)': '88 x 90',
    'Piston Displacement (L)': 1.642,
    'Rated Power ISO14396 (kW)': 21.2,
    'Implement Circuit (MPa)': 24.5,
    'Swing Circuit (MPa)': 18.6,
    'Travel Circuit (MPa)': 24.5,
    'Max Travel Speed High (km/h)': 4.3,
    'Max Travel Speed Low (km/h)': 2.8,
    'Swing Speed (min-1)': 9.1,
    'Standard Track Shoe Width (mm)': 300,
    'Undercarriage Length (mm)': 2110,
    'Undercarriage Width (mm)': 1740,
    'Fuel Tank (L)': 42.0,
    'Hydraulic System (L)': 88.0,
    'Availability': 'AVAILABLE'
  }
];

// Create worksheet
const worksheet = XLSX.utils.json_to_sheet(templateData);

// Set column widths (30 columns - added operatingWeightRange and ratedPowerISO14396)
worksheet['!cols'] = [
  { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 30 },
  { wch: 20 }, { wch: 20 }, { wch: 25 }, { wch: 18 }, { wch: 20 }, { wch: 20 },
  { wch: 20 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 18 },
  { wch: 18 }, { wch: 20 }, { wch: 25 }, { wch: 20 }, { wch: 18 }, { wch: 18 },
  { wch: 25 }, { wch: 25 }, { wch: 18 }, { wch: 25 }, { wch: 22 },
  { wch: 22 }, { wch: 15 }, { wch: 20 }, { wch: 12 }
];

// Add worksheet to workbook
XLSX.utils.book_append_sheet(workbook, worksheet, 'Machinery Template');

// Ensure directories exist
const publicDir = path.join(__dirname, 'public');
const templatesDir = path.join(publicDir, 'templates');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(templatesDir)) {
  fs.mkdirSync(templatesDir, { recursive: true });
}

// Write to file
const outputPath = path.join(templatesDir, 'machinery-template.xlsx');
XLSX.writeFile(workbook, outputPath);

console.log('✅ Excel template generated successfully at:', outputPath);

