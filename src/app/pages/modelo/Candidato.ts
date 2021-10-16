import { CandidatoPK } from "./CandidatoPK";

export class Candidato {

    candidatoPK: CandidatoPK;
    codMunicipioDomic: number;
    codDepartamentoDomic: number;
    codPaisNacimiento: number;
    codPaisNacionalidad: number;
    codMunicipioNacim: number;
    codDepartamentoNacim: number;
    apellido: string;
    fecSolicitud: string;
    nombre: string;
    apCasada: string;
    numDui: string;
    numNit: string;
    direccion: string;
    telefono: string;
    fechaNac: string;
    salarioAspirado;
    codPaisDomic: number;
    estadoEstudios: string;
    numLicencia: string;
    sexo: number;
    observacion: string;
    nombreConyuge: string;
    trabajoConyuge: string;
    telefonoConyuge: string;
    estadoCivil: string;
    recomendadoPor: string;
    numPasaporte: string;
    expedicionDui: string;
    email:string;
    estado:string;
    discapacidad:string;
    codOcupacion:number;
    celular:string;
    etnia:number;
    nombreMadre:string;
    nombrePadre:string;
    muniExpDui:string;
    fechaExpDui:string;
    conocidoEmpresa:string;
    numIsss:string;
    nomIsss:string;
    numNup:string;
    nomNit:string;
    transporteUSA:string;
    habilidadesEspeciales:string;
    tipoVehiculo:string;
    computacion:string;
    peso:number;
    estatura:number;
    archivoFoto:any;



    /*@Size(max = 3)
     (name = "COD_BANCO", length = 3)
       String codBanco;
     (name = "COD_TIPORENUNCIA")
       Short codTiporenuncia;
    @Size(max = 100)
     (name = "OTRAS", length = 100)
       String otras;
    @Size(max = 50)
     (name = "MUNI_EXP_DUI", length = 50)
       String muniExpDui;
     (name = "FECHA_EXP_DUI")
    @Temporal(TemporalType.TIMESTAMP)
       Date fechaExpDui;
    @Size(max = 1)
     (name = "STATUS", length = 1)
       String status;
     (name = "FEC_SALIDA")
    @Temporal(TemporalType.TIMESTAMP)
       Date fecSalida;
     (name = "FEC_INGRESO")
    @Temporal(TemporalType.TIMESTAMP)
       Date fecIngreso;
    @Size(max = 100)
     (name = "NOM_ISSS", length = 100)
       String nomIsss;
    @Size(max = 100)
     (name = "NOM_NIT", length = 100)
       String nomNit;
     (name = "COD_SUCURSAL")
       Short codSucursal;
     (name = "FECHA")
    @Temporal(TemporalType.TIMESTAMP)
       Date fecha;

     (name = "USUARIO", length = 20)
       String usuario;
    @Size(max = 12)
     (name = "NUM_ISSS", length = 12)
       String numIsss;


    @Size(max = 1)
     (name = "ESTADO", length = 1)
       String estado;
    @Size(max = 2)
     (name = "CAMBIO_SEDE", length = 2)
       String cambioSede;
     (name = "COD_TIPO_CONT")
       Short codTipoCont;
     (name = "COD_PUESTO")
       Integer codPuesto;
     (name = "COD_DEPTO")
       Short codDepto;
     (name = "COD_CONTRATACION")
       Short codContratacion;
    @Size(max = 50)
     (name = "CELULAR", length = 50)
       String celular;

     (name = "FOTO", length = 600)
       String foto;
    @Size(max = 200)
     (name = "OTROS_DOCUMENTOS", length = 200)
       String otrosDocumentos;
    @Transient
       String nombreCompleto;
     (name = "NUM_IRTRA", length = 50)
       String numIrtra;
     (name = "ETNIA")
       Integer etnia;
     (name = "NUM_NUP", length = 20)
       String numNup;
     (name = "COD_AFP", length = 20)
       Integer codAfp;

     (name = "CALLE")
       String calle;
     (name = "CASA")
       String casa;
     (name = "NOMBRE_PADRE")
       String nombrePadre;
     (name = "NOMBRE_MADRE")
       String nombreMadre;


    //fields added
     (name = "PADECIMIENTOS")
       String padecimientos;
     (name = "COMPANIA_SEGURO")
       String companiaSeguro;
     (name = "POSEE_SEGURO")
       String poseeSeguroVida;
     (name = "BEBIDAS_ALCHOL")
       String bebidasAlcholicas;
     (name = "CANTIDAD_CIGARROS")
       String cantidadCigarros;
     (name = "FUMAR")
       String fumar;
     (name = "SOSTENER")
       String sostener;
     (name = "CANT_SOSTENER")
       String cantSostener;
     (name = "GASTO_MENSUAL")
       String gastoMensual;
     (name = "SUELDO_ACEPTAR")
       String sueldoAceptar;
     (name = "OTROS_INGRESOS")
       String otrosIngresos;
     (name = "PASA_TIEMPO")
       String pasaTiempo;
     (name = "DEPORTE")
       String deporte;
     (name = "LOGRO_ATLETICO")
       String logroAtletico;
     (name = "RELIGION")
       String religion;
     (name = "IGLESIA_ASISTE")
       String iglesiaAsiste;
     (name = "IMPULSAR_TRABAJO")
       String impulsarTrabajo;
     (name = "ASPIRACION_EMPRESA")
       String aspiracionEmpresa;
     (name = "SEGUIR_ESTUDIANDO")
       String seguirEstudiando;
     (name = "EXPLICAR_ESTUDIO")
       String explicarEstudio;
     (name = "METAS_FUTURO")
       String metasFuturo;
     (name = "TRANSPORTE_USA")
       String transporteUSA;
     (name = "CONOCIDO_EMP")
       String conocidoEmpresa;
     (name = "HABILIDADES_ESPECIALES")
       String habilidadesEspeciales;
     (name = "TIPO_VEHICULO")
       String tipoVehiculo;
     (name = "COMPUTACION")
       String computacion;

     (name = "CONDICION_SALUD")
       String condicionSalud;
     (name = "ACTIVIDAD_LIMITADA")
       String actividadLimitada;
     (name = "TIENE_ACCIDENTE")
       String tieneAccidente;
     (name = "TIPO_ACCIDENTE")
    tipoAccidente:string;
    peso:number;

    estatura:number;
*/







    constructor() { }





}
