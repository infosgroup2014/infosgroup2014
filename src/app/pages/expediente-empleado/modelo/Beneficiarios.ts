
export class Beneficiarios {

  beneficiarioXEmpPK: beneficiarioXEmpPK;
  codParentesco: number;
  nombre: string;
  parentesco: {
    nomParentesco: string,
    parentescoPK: {
      codCia: number;
      codParentesco: number;
    }
  };
  porcentaje: string


  constructor ()
  {}
}


export class beneficiarioXEmpPK
 {
  codBeneficiario: number;
  codCia: number;
  codEmp: number;

  constructor()
    {}

}
