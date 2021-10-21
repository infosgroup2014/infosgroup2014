
import { dependienteXEmpPK } from './DependientesPK';

export class Referencias {

  referenciaEmpPK: referenciaEmpPK;
  nomReferencia: string;
  tiempo: string;
  telefono: string;
  sueldo: number;
  motivoRetiro: string;
  tipoReferencia: string;
  lugar: string;
  email: string;
  puesto: string;
    constructor() { }
}

export class referenciaEmpPK
 {
  codCia: number;
  codEmp: number;
  codReferencia: number;
  constructor() { }
}

