import { Empleado } from "../../modelo/Empleado";
import { TipoAccion } from "./TtipoAccion";

export class AccionPersonaSaveRequest {

  empleado: Empleado;
  tipoAccion: TipoAccion;
  dias: number;
  horas: number;
  minutos: number;
  fechaInicial: string;
  fechaFinal: string;
  noCertificacion: string;
  observacion: string;
  puesto: any;
  archivo: string;
  usuario: string;
  codEmpSesion: number;
  causaRenuncia: number;
  descontar: string;

  constructor() { }

}
