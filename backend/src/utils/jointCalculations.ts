import { JointEvaluationResult } from '../types';

export const calculateJointEvaluation = (
  standardDiameter: number,
  structureHousingDiameter: number,
  bushingDiameter: number,
  pinDiameter: number
): JointEvaluationResult => {
  // CRITERION formula: IF(Standard Diameter > 60, 1.2, 1)
  const criterion = standardDiameter > 60 ? 1.2 : 1;

  // A-E formula: IF(D4-C4 >= B4-0.2, 1, 0)
  const aeResult = (structureHousingDiameter - standardDiameter) >= (criterion - 0.2) ? 1 : 0;

  // A-P formula: IF(D4-F4 >= B4, 1, 0)
  const apResult = (structureHousingDiameter - pinDiameter) >= criterion ? 1 : 0;

  // E-P formula: IF(C4-F4 >= B4-0.2, 1, 0)
  const epResult = (standardDiameter - pinDiameter) >= (criterion - 0.2) ? 1 : 0;

  // B-E formula: IF(E4-C4 >= B4-0.2, 1, 0)
  const beResult = (bushingDiameter - standardDiameter) >= (criterion - 0.2) ? 1 : 0;

  // B-P formula: IF(E4-F4 >= B4, 1, 0)
  const bpResult = (bushingDiameter - pinDiameter) >= criterion ? 1 : 0;

  // CRITERIA formulas (three conditional formulas combined)
  const criteria: string[] = [];

  // First condition: IF(G4=1,"MACHINE","",IF(H4=1,IF((D4-C4)>(C4-F4),"MACHINE","CHANGE PIN"),""))
  if (aeResult === 1) {
    criteria.push("MACHINE");
  } else if (apResult === 1) {
    if ((structureHousingDiameter - standardDiameter) > (standardDiameter - pinDiameter)) {
      criteria.push("MACHINE");
    } else {
      criteria.push("CHANGE PIN");
    }
  }

  // Second condition: IF(I4=1,"CHANGE PIN","")
  if (epResult === 1) {
    criteria.push("CHANGE PIN");
  }

  // Third condition: IF(J4=1,"CHANGE BUSHINGS",IF(K4=1,IF((E4-C4)>(C4-F4),"CHANGE BUSHINGS","CHANGE PIN"),""))
  if (beResult === 1) {
    criteria.push("CHANGE BUSHINGS");
  } else if (bpResult === 1) {
    if ((bushingDiameter - standardDiameter) > (standardDiameter - pinDiameter)) {
      criteria.push("CHANGE BUSHINGS");
    } else {
      criteria.push("CHANGE PIN");
    }
  }

  // Remove duplicates
  const uniqueCriteria = Array.from(new Set(criteria));

  return {
    criterion,
    aeResult,
    apResult,
    epResult,
    beResult,
    bpResult,
    criteria: uniqueCriteria
  };
};
