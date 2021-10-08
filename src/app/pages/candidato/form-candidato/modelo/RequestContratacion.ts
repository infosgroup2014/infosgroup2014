import { Candidato } from "./Candidato";
import { Contrato } from "./Contrato";
import { Gerencia } from "./Gerencia";


export class RequestContratacion {

    gerencia:Gerencia;
    candidato:Candidato;
    codPuesto:number;
    representantePatronal:number;
    contrato:Contrato;
    codAgencia:number;
    codDepartamento:number;
    bonificacion:number;
    codJurisdiccion:number;


    constructor(){}


}
