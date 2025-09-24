import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface JointEvaluationData {
  joint: number;
  criterion: number;
  standardDiameter: number;
  structureHousingDiameter: number;
  bushingDiameter: number;
  pinDiameter: number;
  aeResult: number;
  apResult: number;
  epResult: number;
  beResult: number;
  bpResult: number;
  criteria: string[];
  model: string;
  series: string;
  ott: string;
  photos?: string;
  photosBase64?: string[];
}

export const exportToPDF = (evaluations: JointEvaluationData[]) => {
  // Create new PDF document
  const doc = new jsPDF('landscape', 'mm', 'a4');
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('CRITERIOS PARA EVALUACIÓN DE ARTICULACIONES', 14, 15);
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Análisis integral con cálculos automatizados para evaluaciones de articulaciones de maquinaria', 14, 22);
  
  // Add generation date
  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  doc.text(`Generado el: ${currentDate}`, 14, 29);
  
  // Prepare table data
  const tableData = evaluations.map(evaluation => [
    evaluation.joint,
    evaluation.criterion.toFixed(1),
    evaluation.standardDiameter.toFixed(2),
    evaluation.structureHousingDiameter.toFixed(2),
    evaluation.bushingDiameter.toFixed(2),
    evaluation.pinDiameter.toFixed(2),
    evaluation.aeResult,
    evaluation.apResult,
    evaluation.epResult,
    evaluation.beResult,
    evaluation.bpResult,
    evaluation.criteria.join(', ') || 'No se cumplen criterios',
    evaluation.model || '-',
    evaluation.series || '-',
    evaluation.ott || '-',
    evaluation.photosBase64 && evaluation.photosBase64.length > 0 
      ? `${evaluation.photosBase64.length} foto(s)` 
      : 'Sin fotos'
  ]);
  
  // Define table columns
  const columns = [
    'ARTICULACIÓN',
    'CRITERIO',
    'DIÁM. ESTÁNDAR',
    'DIÁM. ALOJAMIENTO',
    'DIÁM. BOCINA',
    'DIÁM. PIN',
    'A-E',
    'A-P',
    'E-P',
    'B-E',
    'B-P',
    'CRITERIOS',
    'MODELO',
    'SERIE',
    'OTT',
    'FOTOS'
  ];
  
  // Generate table
  autoTable(doc, {
    head: [columns],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'center',
      valign: 'middle'
    },
    headStyles: {
      fillColor: [41, 128, 185], // Blue color
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // Light gray
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 12 }, // ARTICULACIÓN
      1: { halign: 'center', cellWidth: 15 }, // CRITERIO
      2: { halign: 'center', cellWidth: 18 }, // DIÁM. ESTÁNDAR
      3: { halign: 'center', cellWidth: 18 }, // DIÁM. ALOJAMIENTO
      4: { halign: 'center', cellWidth: 16 }, // DIÁM. BOCINA
      5: { halign: 'center', cellWidth: 14 }, // DIÁM. PIN
      6: { halign: 'center', cellWidth: 10 }, // A-E
      7: { halign: 'center', cellWidth: 10 }, // A-P
      8: { halign: 'center', cellWidth: 10 }, // E-P
      9: { halign: 'center', cellWidth: 10 }, // B-E
      10: { halign: 'center', cellWidth: 10 }, // B-P
      11: { halign: 'left', cellWidth: 30 }, // CRITERIOS
      12: { halign: 'center', cellWidth: 18 }, // MODELO
      13: { halign: 'center', cellWidth: 15 }, // SERIE
      14: { halign: 'center', cellWidth: 15 }, // OTT
      15: { halign: 'left', cellWidth: 25 } // FOTOS
    },
    margin: { top: 35, right: 14, bottom: 14, left: 14 },
    tableWidth: 'auto',
    showHead: 'everyPage'
  });
  
  // Add photos section
  const finalY = (doc as any).lastAutoTable?.finalY || 35;
  let currentY = finalY + 10;
  
  // Add photos section
  const evaluationsWithPhotos = evaluations.filter(e => e.photosBase64 && e.photosBase64.length > 0);
  
  if (evaluationsWithPhotos.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FOTOS DE ARTICULACIONES', 14, currentY);
    currentY += 10;
    
    evaluationsWithPhotos.forEach((evaluation, index) => {
      if (currentY > 180) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Articulación ${evaluation.joint}`, 14, currentY);
      currentY += 8;
      
      // Display photos in a grid
      const photosPerRow = 3;
      const photoWidth = 50;
      const photoHeight = 40;
      const spacing = 10;
      
      evaluation.photosBase64?.forEach((photoBase64, photoIndex) => {
        const row = Math.floor(photoIndex / photosPerRow);
        const col = photoIndex % photosPerRow;
        
        const x = 14 + col * (photoWidth + spacing);
        const y = currentY + row * (photoHeight + spacing);
        
        // Check if we need a new page
        if (y + photoHeight > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          currentY = 20;
          const newRow = Math.floor(photoIndex / photosPerRow);
          const newCol = photoIndex % photosPerRow;
          const newX = 14 + newCol * (photoWidth + spacing);
          const newY = currentY + newRow * (photoHeight + spacing);
          
          try {
            doc.addImage(photoBase64, 'JPEG', newX, newY, photoWidth, photoHeight);
          } catch (error) {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Error al cargar imagen', newX, newY + photoHeight/2);
          }
        } else {
          try {
            doc.addImage(photoBase64, 'JPEG', x, y, photoWidth, photoHeight);
          } catch (error) {
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text('Error al cargar imagen', x, y + photoHeight/2);
          }
        }
      });
      
      // Update currentY for next evaluation
      const totalRows = Math.ceil((evaluation.photosBase64?.length || 0) / photosPerRow);
      currentY += totalRows * (photoHeight + spacing) + 15;
    });
    
    currentY += 10;
  }
  
  // Add formulas section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('REFERENCIA DE FÓRMULAS', 14, currentY);
  
  currentY += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const formulas = [
    'CRITERION: IF(Standard Diameter > 60, 1.2, 1)',
    'A-E: IF((Structure Housing Diameter - Standard Diameter) ≥ (Criterion - 0.2), 1, 0)',
    'A-P: IF((Structure Housing Diameter - Pin Diameter) ≥ Criterion, 1, 0)',
    'E-P: IF((Standard Diameter - Pin Diameter) ≥ (Criterion - 0.2), 1, 0)',
    'B-E: IF((Bushing Diameter - Standard Diameter) ≥ (Criterion - 0.2), 1, 0)',
    'B-P: IF((Bushing Diameter - Pin Diameter) ≥ Criterion, 1, 0)'
  ];
  
  formulas.forEach((formula, index) => {
    if (currentY > 180) {
      doc.addPage();
      currentY = 20;
    }
    doc.text(formula, 14, currentY);
    currentY += 6;
  });
  
  // Add summary
  currentY += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN DE EVALUACIÓN', 14, currentY);
  
  currentY += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const totalArticulaciones = evaluations.length;
  const articulacionesConCriterios = evaluations.filter(e => e.criteria.length > 0).length;
  const articulacionesSinCriterios = totalArticulaciones - articulacionesConCriterios;
  
  doc.text(`• Total de articulaciones evaluadas: ${totalArticulaciones}`, 14, currentY);
  currentY += 6;
  doc.text(`• Articulaciones que cumplen criterios: ${articulacionesConCriterios}`, 14, currentY);
  currentY += 6;
  doc.text(`• Articulaciones que no cumplen criterios: ${articulacionesSinCriterios}`, 14, currentY);
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(
      `Página ${i} de ${pageCount} - CompareMachine - Sistema de Evaluación de Articulaciones`,
      doc.internal.pageSize.getWidth() - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'right' }
    );
  }
  
  // Save the PDF
  doc.save(`criterios-evaluacion-articulaciones-${new Date().toISOString().split('T')[0]}.pdf`);
};
