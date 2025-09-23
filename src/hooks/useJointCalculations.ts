interface JointCalculationProps {
  standardDiameter: number;
  structureHousingDiameter: number;
  bushingDiameter: number;
  pinDiameter: number;
}

export const calculateJointResults = ({
  standardDiameter,
  structureHousingDiameter,
  bushingDiameter,
  pinDiameter
}: JointCalculationProps) => {
    // CRITERION formula: IF(C4>60,1.2,1)
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

    // First condition: IF(G4=1,"MAQUINAR","",IF(H4=1,IF((D4-C4)>(C4-F4),"MAQUINAR","CAMBIAR PIN"),""))
    if (aeResult === 1) {
      criteria.push("MAQUINAR");
    } else if (apResult === 1) {
      if ((structureHousingDiameter - standardDiameter) > (standardDiameter - pinDiameter)) {
        criteria.push("MAQUINAR");
      } else {
        criteria.push("CAMBIAR PIN");
      }
    }

    // Second condition: IF(I4=1,"CAMBIAR PIN","")
    if (epResult === 1) {
      criteria.push("CAMBIAR PIN");
    }

    // Third condition: IF(J4=1,"CAMBIAR BOCINAS",IF(K4=1,IF((E4-C4)>(C4-F4),"CAMBIAR BOCINAS","CAMBIAR PIN"),""))
    if (beResult === 1) {
      criteria.push("CAMBIAR BOCINAS");
    } else if (bpResult === 1) {
      if ((bushingDiameter - standardDiameter) > (standardDiameter - pinDiameter)) {
        criteria.push("CAMBIAR BOCINAS");
      } else {
        criteria.push("CAMBIAR PIN");
      }
    }

    // Remove duplicates and join
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

// Keep the hook for backward compatibility
export const useJointCalculations = (props: JointCalculationProps) => {
  return calculateJointResults(props);
};