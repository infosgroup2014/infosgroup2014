
export class Emergencias {
    codParentesco: number;
    emergenciaXEmpPK: emergenciaXEmpPK;
    nombre: string;
    parentesco: {
      nomParentesco: string;
      parentescoPK: {
        codCia:  number;
        codParentesco: number;
      };
    };
    telefono: string;

  constructor ()
  {}
}


export class emergenciaXEmpPK {
  codCia: number;
  codEmergencia: number;
  codEmp: number;

  constructor ()
  {}
}
