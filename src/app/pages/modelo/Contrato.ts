import { Candidato } from "./Candidato";
import { TiposPlanilla } from "./TiposPlanilla";

export class Contrato{
    salario:number;
    estado:string;
    codPuesto:number;
    codEmp:number;
    fechaAcuerdo:string;
    fechaInicio:string;
    fechaFinal:string;
    observacion:string;
    tipo:string;
    codClasificacion:number;
    tiposPlanilla:TiposPlanilla;
    candidato:Candidato;


    constructor(){ }


}
