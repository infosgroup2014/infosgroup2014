import { nivelesXEmpPK } from "./NivelAcademicoPK";

export class nivelAcademico {

  anioEgreso: number;
  anioIngreso: number;
  codDepto: number;
  codPais: number;
  estadoNivel: string;
  fecEstado: string;
  nivelAcademico: {
    nivelAcademicoPK: {
      codCia: number;
      codNivelAcademico: number;
    },
    nomNivelAcademico: string;
  };
  nivelesXEmpPK: nivelesXEmpPK;
  noColegiado: string;
  nomInstitucion: string;
  profesion: {
    nomProfesion: string;
    profesionPK: {
      codCia: number;
      codProfesion: number;
    };
  };
  subNivel: number;

  constructor ()
  {}
}


