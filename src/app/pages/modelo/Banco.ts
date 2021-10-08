import { BancosPK } from "./BancosPK";

export class Banco{
    columnasSelect: string;
    contacto: string;
    diasMaxCheques: number;
    diasMaxNotas: number;
    direccion: string;
    formatoArchivo: string;
    mimeArchivo: string;
    nomBanco: string;
    observaciones: string;
    telefono1: string;
    telefono2: string;
    totalFinal: string;
    vistaArchivo: string;
    bancosPK:BancosPK;

    constructor(){

    }
}
