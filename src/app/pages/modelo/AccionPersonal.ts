import { TipoAccion } from '../accion-personal/modelo/TtipoAccion';
import { Empleado } from './Empleado';
import { Departamentos } from './Departamentos';
import { AccionPersonalPK } from './AccionPersonalPK';
import { Puestos } from './Puestos';


export class AccionPersonal {

  anio: number;
  mes: number;
  numPlanilla: number;
  fecha: string;
  cantidad: number;
  observacion: string;
  periodo: string;
  tipoAccion:TipoAccion;
  empleados:Empleado;
  departamentos:Departamentos;
  dias:number;
  institucion:string;
  codTipoIncapacidad:number;
  fechaInicial:string;
  fechaFinal:string;
  periodoFinal:string;
  noCertificacion:string;
  accionPersonalPK:AccionPersonalPK;
  puestos:Puestos;
  codPlaza:number;
  codPuesto:number;
  nuevoDepartamento:Departamentos;
  codDepto:number;
  codNuevoPuesto:number;
  codDeptoNuevo:number;
  codGerencia:number;
  sueldoAnterior:number;
  tipoplaAnterior:number;
  codTipopla:number;
  //propiedad trasient
  fechaInicioContrato:string;
  formaAumento:string;
  porcentaje:number;
  bonificacionAct:number;
  bonificacionAnt:number;
  codTiporetiro:number;
  archivo:string;
  empleadosAfectados: Array<Empleado>;

  constructor(){}



}
