import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import * as XLSX from 'xlsx';

interface ParsedMachinery {
  model: string;
  name: string;
  series: string;
  manufacturer: string;
  category: string;
  specifications: {
    regionOfferings: string[];
    canopyVersionWeight?: number;
    cabVersionWeight?: number;
    bucketCapacity?: number;
    emissionStandardEU?: string;
    emissionStandardEPA?: string;
    engineModel: string;
    ratedPowerISO9249: number;
    ratedPowerSAEJ1349?: number;
    ratedPowerEEC80_1269?: number;
    numberOfCylinders?: number;
    boreByStroke?: string;
    pistonDisplacement?: number;
    implementCircuit?: number;
    swingCircuit?: number;
    travelCircuit?: number;
    maxTravelSpeedHigh?: number;
    maxTravelSpeedLow?: number;
    swingSpeed?: number;
    standardTrackShoeWidth?: number;
    undercarriageLength?: number;
    undercarriageWidth?: number;
    undercarriageWidthExtend?: number;
    undercarriageWidthRetract?: number;
    fuelTankCapacity: number;
    hydraulicSystemCapacity?: number;
  };
  availability: string;
  price?: number;
}

/**
 * Parse specifications from uploaded Excel file
 */
export const parseExcelSpecifications = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se ha subido ningún archivo Excel',
      });
    }

    const file = req.file;
    
    // Read Excel file
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El archivo Excel está vacío o no tiene datos válidos.',
      });
    }

    // Parse each row into machinery
    const machineryList: ParsedMachinery[] = [];

    for (const row of jsonData) {
      // Extract model and basic info
      const model = row['Model'] || row['model'] || '';
      const manufacturer = row['Manufacturer'] || row['manufacturer'] || 'Unknown';
      const series = row['Series'] || row['series'] || 'Unknown Series';
      const category = row['Category'] || row['category'] || 'EXCAVATORS';

      if (!model) {
        continue; // Skip rows without model
      }

      const machinery: ParsedMachinery = {
        model: model.toString().trim(),
        name: `${manufacturer} ${model} Excavator`,
        series,
        manufacturer,
        category: category.toUpperCase(),
        specifications: {
          regionOfferings: [],
          engineModel: row['Engine Model'] || row['engineModel'] || 'Unknown',
          ratedPowerISO9249: parseFloat(row['Rated Power ISO9249 (kW)'] || row['ratedPowerISO9249'] || 0),
          ratedPowerSAEJ1349: parseFloat(row['Rated Power SAE J1349 (kW)'] || row['ratedPowerSAEJ1349']) || undefined,
          ratedPowerEEC80_1269: parseFloat(row['Rated Power EEC 80/1269 (kW)'] || row['ratedPowerEEC80_1269']) || undefined,
          canopyVersionWeight: parseFloat(row['Canopy Version Weight (kg)'] || row['canopyVersionWeight']) || undefined,
          cabVersionWeight: parseFloat(row['Cab Version Weight (kg)'] || row['cabVersionWeight']) || undefined,
          bucketCapacity: parseFloat(row['Bucket Capacity (m³)'] || row['bucketCapacity']) || undefined,
          emissionStandardEU: row['Emission Standard EU'] || row['emissionStandardEU'] || undefined,
          emissionStandardEPA: row['Emission Standard EPA'] || row['emissionStandardEPA'] || undefined,
          numberOfCylinders: parseInt(row['Number of Cylinders'] || row['numberOfCylinders']) || undefined,
          boreByStroke: row['Bore x Stroke (mm)'] || row['boreByStroke'] || undefined,
          pistonDisplacement: parseFloat(row['Piston Displacement (L)'] || row['pistonDisplacement']) || undefined,
          implementCircuit: parseFloat(row['Implement Circuit (MPa)'] || row['implementCircuit']) || undefined,
          swingCircuit: parseFloat(row['Swing Circuit (MPa)'] || row['swingCircuit']) || undefined,
          travelCircuit: parseFloat(row['Travel Circuit (MPa)'] || row['travelCircuit']) || undefined,
          maxTravelSpeedHigh: parseFloat(row['Max Travel Speed High (km/h)'] || row['maxTravelSpeedHigh']) || undefined,
          maxTravelSpeedLow: parseFloat(row['Max Travel Speed Low (km/h)'] || row['maxTravelSpeedLow']) || undefined,
          swingSpeed: parseFloat(row['Swing Speed (min-1)'] || row['swingSpeed']) || undefined,
          standardTrackShoeWidth: parseFloat(row['Standard Track Shoe Width (mm)'] || row['standardTrackShoeWidth']) || undefined,
          undercarriageLength: parseFloat(row['Undercarriage Length (mm)'] || row['undercarriageLength']) || undefined,
          undercarriageWidth: parseFloat(row['Undercarriage Width (mm)'] || row['undercarriageWidth']) || undefined,
          fuelTankCapacity: parseFloat(row['Fuel Tank (L)'] || row['fuelTankCapacity'] || 0),
          hydraulicSystemCapacity: parseFloat(row['Hydraulic System (L)'] || row['hydraulicSystemCapacity']) || undefined,
        },
        availability: (row['Availability'] || row['availability'] || 'AVAILABLE').toUpperCase(),
        price: parseFloat(row['Price'] || row['price']) || undefined,
      };

      // Parse region offerings if exists
      const regionOfferingsStr = row['Region Offerings'] || row['regionOfferings'] || '';
      if (regionOfferingsStr) {
        machinery.specifications.regionOfferings = regionOfferingsStr
          .toString()
          .split(',')
          .map((r: string) => r.trim())
          .filter((r: string) => r.length > 0);
      }

      machineryList.push(machinery);
    }

    if (machineryList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se pudieron extraer máquinas válidas del archivo Excel.',
      });
    }

    return res.json({
      success: true,
      data: machineryList,
      message: `Se extrajeron ${machineryList.length} máquina(s) del archivo Excel`,
    });
  } catch (error: any) {
    console.error('Error parsing Excel file:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Error al procesar el archivo Excel',
      error: error.message,
    });
  }
};

/**
 * Serve static Excel template for download
 */
export const generateExcelTemplate = (req: Request, res: Response) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Path to static template file
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'machinery-template.xlsx');
    
    // Check if file exists
    if (!fs.existsSync(templatePath)) {
      res.status(404).json({
        success: false,
        message: 'Template file not found',
      });
      return;
    }
    
    // Read file
    const fileBuffer = fs.readFileSync(templatePath);
    
    // Send file as download
    res.status(200)
      .set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=machinery-template.xlsx',
        'Content-Length': fileBuffer.length
      })
      .send(fileBuffer);
  } catch (error: any) {
    console.error('Error serving Excel template:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error al descargar el template de Excel',
      error: error.message,
    });
  }
};

