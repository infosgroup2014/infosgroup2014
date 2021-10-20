import { expLaboralEmpleadoPK } from './ExperenciaPK';

export class Experiencias {
  codOcupacion: number;
  codPuesto: number;
  currenJobs: boolean;
  expLaboralEmpleadoPK: expLaboralEmpleadoPK;
  fechaFin: string;
  fechaInicio: string;
  lugarTrabajo: string;
  motivoRetiro: string;
  ocupacion: {
    codOcupacionMintrab: number;
    nomOcupacion: string,
    ocupacionesPK: {
      codCia: number;
      codOcupacion: number;
    }
  };
  paisExtranjero: {
    codPais: number;
    nacionalidad: string;
    nombPais: string
  };
  sueldoFinal: number;
  sueldoInicial: number;
  trabajoExtranjero: number;

    constructor() { }
}

