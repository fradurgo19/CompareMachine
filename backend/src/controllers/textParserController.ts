import { Request, Response } from 'express';
import { ApiResponse } from '../types';

interface ParsedMachinery {
  model: string;
  name: string;
  series: string;
  manufacturer: string;
  category: string;
  specifications: {
    // Region Offerings
    regionOfferings: string[];
    
    // Operating Weight Range
    canopyVersionWeight?: number;  // kg
    cabVersionWeight?: number;     // kg
    
    // Bucket Capacity
    bucketCapacity?: number;  // m³
    
    // Emission Standard
    emissionStandardEU?: string;
    emissionStandardEPA?: string;
    
    // Engine Model
    engineModel: string;
    
    // Rated Power
    ratedPowerISO9249: number;    // kW
    ratedPowerSAEJ1349?: number;  // kW
    ratedPowerEEC80_1269?: number; // kW
    numberOfCylinders?: number;
    boreByStroke?: string;        // mm
    pistonDisplacement?: number;  // L
    
    // Relief Valve Settings
    implementCircuit?: number;    // MPa
    swingCircuit?: number;        // MPa
    travelCircuit?: number;       // MPa
    maxTravelSpeedHigh?: number;  // km/h
    maxTravelSpeedLow?: number;   // km/h
    swingSpeed?: number;          // min-1
    standardTrackShoeWidth?: number;  // mm
    undercarriageLength?: number;     // mm
    undercarriageWidth?: number;      // mm
    undercarriageWidthExtend?: number;   // mm
    undercarriageWidthRetract?: number;  // mm
    
    // Capacity (Refilled)
    fuelTankCapacity: number;        // L
    hydraulicSystemCapacity?: number; // L
  };
  availability: string;
  price?: number;
}

/**
 * Parse specifications from pasted text
 */
export const parseTextSpecifications = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó texto para parsear',
      });
    }

    // Pre-process text: handle different formats
    let processedText = text;
    
    // Convert CSV format to tab-separated
    if (text.includes(',') && !text.includes('\t') && text.split(',').length > text.split(/\s{2,}/).length) {
      processedText = text.replace(/,/g, '\t');
    }
    
    // Normalize line breaks
    processedText = processedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    const lines = processedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'El texto proporcionado es demasiado corto. Asegúrate de copiar toda la tabla.',
      });
    }

    // Extract series name from first line
    const firstLine = lines[0];
    let series = 'Unknown Series';
    let manufacturer = 'Unknown';
    
    // Try to extract series (e.g., "ZX-5A Mini Excavator Series Specifications")
    const seriesMatch = firstLine.match(/([A-Z0-9\-]+)\s+(?:Mini\s+)?(\w+)\s+Series/i);
    if (seriesMatch) {
      series = seriesMatch[1];
      
      // Infer manufacturer from model prefix or series
      if (series.startsWith('ZX')) manufacturer = 'Hitachi';
      else if (series.startsWith('CAT') || series.startsWith('320') || series.startsWith('330')) manufacturer = 'Caterpillar';
      else if (series.startsWith('PC')) manufacturer = 'Komatsu';
      else if (series.startsWith('EC')) manufacturer = 'Volvo';
      else if (series.startsWith('JCB')) manufacturer = 'JCB';
      else if (series.startsWith('850') || series.startsWith('750')) manufacturer = 'John Deere';
    }

    // Find the line with models (more flexible matching)
    let modelLineIndex = -1;
    let models: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (line.startsWith('model') || line.includes('model\t') || line === 'model') {
        modelLineIndex = i;
        // Extract models from the line - try multiple separators
        const modelLine = lines[i];
        let parts: string[];
        
        // Try tab separator first
        if (modelLine.includes('\t')) {
          parts = modelLine.split('\t').filter(p => p.trim().length > 0);
        } else {
          // Fall back to multiple spaces
          parts = modelLine.split(/\s{2,}/).filter(p => p.trim().length > 0);
        }
        
        models = parts.slice(1).map(m => m.trim()); // Skip the "Model" label
        break;
      }
    }

    if (models.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pudieron encontrar modelos en el texto. Asegúrate de incluir la fila "Model".',
      });
    }

    // Initialize machinery objects
    const machineryList: ParsedMachinery[] = models.map(model => ({
      model: model.trim(),
      name: `${manufacturer} ${model.trim()} Excavator`,
      series,
      manufacturer,
      category: 'EXCAVATORS',
      specifications: {
        regionOfferings: [],
        engineModel: 'Unknown',
        ratedPowerISO9249: 0,
        fuelTankCapacity: 0,
      },
      availability: 'AVAILABLE',
    }));

    // Parse specifications from remaining lines
    for (let i = modelLineIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip section headers
      if (line.toLowerCase().includes('region offerings') ||
          line.toLowerCase().includes('operating weight range') ||
          line.toLowerCase().includes('bucket capacity range') ||
          line.toLowerCase().includes('emission standard') ||
          line.toLowerCase().includes('rated power') ||
          line.toLowerCase().includes('relief valve settings') ||
          line.toLowerCase().includes('capacity (refilled)') ||
          line.toLowerCase().includes('extend / retract')) {
        continue;
      }

      // Split line into parts - try tab first, then multiple spaces
      let parts: string[];
      if (line.includes('\t')) {
        parts = line.split('\t').filter(p => p.trim().length > 0);
      } else {
        parts = line.split(/\s{2,}/).filter(p => p.trim().length > 0);
      }
      
      if (parts.length < 2) continue;

      const fieldName = parts[0].toLowerCase();
      const values = parts.slice(1);

      // Parse Region Offerings
      if (fieldName.includes('se asia') || fieldName.includes('europe') || 
          fieldName.includes('africa') || fieldName.includes('russia')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—') {
            if (!machineryList[idx].specifications.regionOfferings) {
              machineryList[idx].specifications.regionOfferings = [];
            }
            machineryList[idx].specifications.regionOfferings.push(value.trim());
          }
        });
        continue;
      }

      // Parse Canopy version weight
      if (fieldName.includes('canopy version')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'kg') {
            const cleaned = value.replace(/\s+/g, '').replace(/[^\d\-\.]/g, '');
            const numbers = cleaned.split('-').map(n => parseFloat(n)).filter(n => !isNaN(n));
            if (numbers.length > 0) {
              const avgWeight = numbers.reduce((a, b) => a + b, 0) / numbers.length;
              machineryList[idx].specifications.canopyVersionWeight = avgWeight;
            }
          }
        });
      }

      // Parse Cab version weight
      else if (fieldName.includes('cab version')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'kg') {
            const cleaned = value.replace(/\s+/g, '').replace(/[^\d\-\.]/g, '');
            const numbers = cleaned.split('-').map(n => parseFloat(n)).filter(n => !isNaN(n));
            if (numbers.length > 0) {
              const avgWeight = numbers.reduce((a, b) => a + b, 0) / numbers.length;
              machineryList[idx].specifications.cabVersionWeight = avgWeight;
            }
          }
        });
      }

      // Parse Bucket Capacity
      else if (fieldName === 'm3' || fieldName.includes('bucket')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'm3') {
            const capacity = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(capacity)) {
              machineryList[idx].specifications.bucketCapacity = capacity;
            }
          }
        });
      }

      // Parse Emission Standards
      else if (fieldName === 'eu') {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—') {
            machineryList[idx].specifications.emissionStandardEU = value.trim();
          }
        });
      }
      else if (fieldName === 'epa') {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—') {
            machineryList[idx].specifications.emissionStandardEPA = value.trim();
          }
        });
      }

      // Parse Engine Model
      else if (fieldName.includes('engine model')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—') {
            machineryList[idx].specifications.engineModel = value.trim();
          }
        });
      }

      // Parse Rated Power variants
      else if (fieldName.includes('iso9249') || fieldName.includes('iso 9249')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'kw') {
            const power = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(power)) {
              machineryList[idx].specifications.ratedPowerISO9249 = power;
            }
          }
        });
      }
      else if (fieldName.includes('sae j1349') || fieldName.includes('sae j 1349')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'kw') {
            const power = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(power)) {
              machineryList[idx].specifications.ratedPowerSAEJ1349 = power;
            }
          }
        });
      }
      else if (fieldName.includes('eec 80/1269') || fieldName.includes('eec80/1269')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'kw') {
            const power = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(power)) {
              machineryList[idx].specifications.ratedPowerEEC80_1269 = power;
            }
          }
        });
      }

      // Parse Number of Cylinders
      else if (fieldName.includes('no. of cylinders') || fieldName.includes('cylinders')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—') {
            const cylinders = parseInt(value.replace(/[^\d]/g, ''));
            if (!isNaN(cylinders)) {
              machineryList[idx].specifications.numberOfCylinders = cylinders;
            }
          }
        });
      }

      // Parse Bore x Stroke
      else if (fieldName.includes('bore') && fieldName.includes('stroke')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'mm') {
            machineryList[idx].specifications.boreByStroke = value.trim();
          }
        });
      }

      // Parse Piston Displacement
      else if (fieldName.includes('piston displacement')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'l') {
            const displacement = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(displacement)) {
              machineryList[idx].specifications.pistonDisplacement = displacement;
            }
          }
        });
      }

      // Parse Relief Valve Settings
      else if (fieldName.includes('implement circuit')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && !value.toLowerCase().includes('mpa')) {
            const circuit = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(circuit)) {
              machineryList[idx].specifications.implementCircuit = circuit;
            }
          }
        });
      }
      else if (fieldName.includes('swing circuit')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && !value.toLowerCase().includes('mpa')) {
            const circuit = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(circuit)) {
              machineryList[idx].specifications.swingCircuit = circuit;
            }
          }
        });
      }
      else if (fieldName.includes('travel circuit')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && !value.toLowerCase().includes('mpa')) {
            const circuit = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(circuit)) {
              machineryList[idx].specifications.travelCircuit = circuit;
            }
          }
        });
      }

      // Parse Max Travel Speed
      else if (fieldName.includes('max. travel speed') || fieldName.includes('max travel speed')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && !value.toLowerCase().includes('km/h')) {
            // Handle "4.3 / 2.8" format
            const speeds = value.split('/').map(s => parseFloat(s.trim())).filter(s => !isNaN(s));
            if (speeds.length >= 2) {
              machineryList[idx].specifications.maxTravelSpeedHigh = speeds[0];
              machineryList[idx].specifications.maxTravelSpeedLow = speeds[1];
            }
          }
        });
      }

      // Parse Swing Speed
      else if (fieldName.includes('swing speed')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && !value.toLowerCase().includes('min')) {
            const speed = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(speed)) {
              machineryList[idx].specifications.swingSpeed = speed;
            }
          }
        });
      }

      // Parse Standard Track Shoe Width
      else if (fieldName.includes('track shoe width') || fieldName.includes('standard track')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'mm') {
            const width = parseFloat(value.replace(/\s+/g, '').replace(/[^\d\.]/g, ''));
            if (!isNaN(width)) {
              machineryList[idx].specifications.standardTrackShoeWidth = width;
            }
          }
        });
      }

      // Parse Undercarriage Length
      else if (fieldName.includes('undercarriage length')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'mm') {
            const length = parseFloat(value.replace(/\s+/g, '').replace(/[^\d\.]/g, ''));
            if (!isNaN(length)) {
              machineryList[idx].specifications.undercarriageLength = length;
            }
          }
        });
      }

      // Parse Undercarriage Width
      else if (fieldName.includes('undercarriage width')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'mm') {
            // Handle "1 740 / —" or "1 550 / —" format (extend / retract)
            if (value.includes('/')) {
              const widths = value.split('/').map(w => {
                const cleaned = w.trim().replace(/\s+/g, '').replace(/[^\d\.]/g, '');
                return parseFloat(cleaned);
              }).filter(w => !isNaN(w));
              
              if (widths.length >= 1) {
                machineryList[idx].specifications.undercarriageWidthExtend = widths[0];
                if (widths.length >= 2) {
                  machineryList[idx].specifications.undercarriageWidthRetract = widths[1];
                }
              }
            } else {
              const width = parseFloat(value.replace(/\s+/g, '').replace(/[^\d\.]/g, ''));
              if (!isNaN(width)) {
                machineryList[idx].specifications.undercarriageWidth = width;
              }
            }
          }
        });
      }

      // Parse Fuel Tank
      else if (fieldName.includes('fuel tank')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'l') {
            const capacity = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(capacity)) {
              machineryList[idx].specifications.fuelTankCapacity = capacity;
            }
          }
        });
      }

      // Parse Hydraulic System
      else if (fieldName.includes('hydraulic system')) {
        values.forEach((value, idx) => {
          if (idx < machineryList.length && value !== '—' && value.toLowerCase() !== 'l') {
            const capacity = parseFloat(value.replace(/[^\d\.]/g, ''));
            if (!isNaN(capacity)) {
              machineryList[idx].specifications.hydraulicSystemCapacity = capacity;
            }
          }
        });
      }
    }

    // Filter out machinery with invalid data (must have minimum required fields)
    const validMachinery = machineryList.filter(m => 
      m.specifications.ratedPowerISO9249 > 0 && 
      m.specifications.fuelTankCapacity > 0 &&
      m.specifications.engineModel !== 'Unknown'
    );

    if (validMachinery.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pudieron extraer especificaciones válidas del texto. Verifica el formato.',
      });
    }

    return res.json({
      success: true,
      data: validMachinery,
      message: `Se extrajeron ${validMachinery.length} máquina(s) del texto`,
    });
  } catch (error: any) {
    console.error('Error parsing text specifications:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error al parsear especificaciones del texto',
      error: error.message,
    });
  }
};
