/**
 * Plantillas Legales y Generador de Contratos Inmobiliarios (Chile)
 * Formatos estándar conformes a la legislación chilena (Código Civil, Ley 18.101, Ley 21.461 Devuélveme mi Casa).
 */

export type ContractType = 
  | 'arriendo_residencial'
  | 'arriendo_comercial'
  | 'promesa_compraventa'
  | 'orden_corretaje'
  | 'orden_visita';

export interface ContractParty {
  name: string;
  rut: string;
  nationality: string;
  civilStatus: string;
  profession: string;
  address: string;
  commune: string;
  phone: string;
  email: string;
}

export interface ContractData {
  id?: string;
  type: ContractType;
  city: string;
  date: string;
  
  // Partes
  landlord: ContractParty;     // Arrendador o Vendedor
  tenant: ContractParty;       // Arrendatario o Comprador
  guarantor?: ContractParty;   // Aval / Codeudor Solidario (Opcional)
  hasGuarantor: boolean;

  // Inmueble
  propertyAddress: string;
  propertyCommune: string;
  propertyRegion: string;
  propertyRolSII: string;
  propertyIncludesParking: boolean;
  propertyParkingNumber: string;
  propertyIncludesStorage: boolean;
  propertyStorageNumber: string;

  // Condiciones Económicas
  currency: 'CLP' | 'UF';
  amountValue: number;
  readjustmentFrequency: 'Sin reajuste' | 'IPC Semestral' | 'IPC Trimestral' | 'IPC Anual' | 'UF Diaria';
  paymentDay: number;
  paymentBank: string;
  paymentAccountType: string;
  paymentAccountNumber: string;
  paymentAccountRut: string;
  guaranteeDepositMonths: number;
  guaranteeDepositCLP: number;
  
  // Plazos y Vigencia
  durationMonths: number;
  startDate: string;
  isRenewableAutomatically: boolean;

  // Detalles & Cláusulas Especiales
  petsAllowed: boolean;
  subleaseAllowed: boolean;
  commercialActivityAllowed?: string; // Para contratos comerciales
  inventoryDetails: string;
  specialClauses: string;
  
  // ZapSign Metadata
  zapSignStatus?: 'borrador' | 'enviado_zapsign' | 'firmado';
  zapSignDocId?: string;
  zapSignSignUrl?: string;
}

export const INITIAL_CONTRACT_DATA: ContractData = {
  type: 'arriendo_residencial',
  city: 'Viña del Mar',
  date: new Date().toISOString().split('T')[0],
  
  landlord: {
    name: 'Alexis Santana Morales',
    rut: '15.883.974-1',
    nationality: 'Chilena',
    civilStatus: 'Soltero',
    profession: 'Gestor Inmobiliario',
    address: 'Av. Valparaíso 1230, Of. 402',
    commune: 'Viña del Mar',
    phone: '+56 9 9989 9421',
    email: 'contacto@melsa.cl'
  },
  
  tenant: {
    name: 'Camila Zúñiga Valdés',
    rut: '18.456.789-K',
    nationality: 'Chilena',
    civilStatus: 'Soltera',
    profession: 'Ingeniera Comercial',
    address: 'Calle Los Pinos 450',
    commune: 'Quilpué',
    phone: '+56 9 8456 7890',
    email: 'c.zuniga@gmail.com'
  },

  hasGuarantor: true,
  guarantor: {
    name: 'Rodrigo Zúñiga Morales',
    rut: '12.345.678-9',
    nationality: 'Chilena',
    civilStatus: 'Casado',
    profession: 'Contador Auditor',
    address: 'Av. Troncal 1200',
    commune: 'Villa Alemana',
    phone: '+56 9 7654 3210',
    email: 'rodrigo.zm@gmail.com'
  },

  propertyAddress: 'Pasaje Fernanda 596, Casa 2, Condominio Los Aromos II',
  propertyCommune: 'Villa Alemana',
  propertyRegion: 'Región de Valparaíso',
  propertyRolSII: '433-032',
  propertyIncludesParking: true,
  propertyParkingNumber: 'E-02',
  propertyIncludesStorage: false,
  propertyStorageNumber: '',

  currency: 'CLP',
  amountValue: 550000,
  readjustmentFrequency: 'IPC Semestral',
  paymentDay: 5,
  paymentBank: 'Banco Santander',
  paymentAccountType: 'Cuenta Corriente',
  paymentAccountNumber: '0-000-845129-3',
  paymentAccountRut: '15.883.974-1',
  guaranteeDepositMonths: 1,
  guaranteeDepositCLP: 550000,

  durationMonths: 12,
  startDate: new Date().toISOString().split('T')[0],
  isRenewableAutomatically: true,

  petsAllowed: true,
  subleaseAllowed: false,
  inventoryDetails: 'Cocina equipada con encimera y campana eléctrica, calefont ionizado en perfecto estado, cortinas roller en living y dormitorios, lámparas instaladas, 2 llaves de acceso principal.',
  specialClauses: 'El arrendatario se compromete a mantener el jardín podado y pagar oportunamente los consumos de agua potable, electricidad y gastos comunes si correspondieren.',
  zapSignStatus: 'borrador'
};

/**
 * Generador del texto legal formal en formato chileno notarial
 */
export function generateContractLegalText(data: ContractData): string {
  const formatRut = (r: string) => r || '---';
  const formatMoney = (val: number, cur: string) => cur === 'UF' ? `${val} UF` : `$${val.toLocaleString('es-CL')} CLP`;

  if (data.type === 'arriendo_residencial') {
    return `CONTRATO DE ARRENDAMIENTO RESIDENCIAL
(Sometido a la Ley N° 18.101 y Modificaciones de la Ley N° 21.461 "Devuélveme Mi Casa")

En la ciudad de ${data.city}, República de Chile, a ${data.date}, comparecen:

POR UNA PARTE:
Don/Doña ${data.landlord.name.toUpperCase()}, de nacionalidad ${data.landlord.nationality}, estado civil ${data.landlord.civilStatus}, profesión ${data.landlord.profession}, cédula nacional de identidad número ${formatRut(data.landlord.rut)}, domiciliado/a en ${data.landlord.address}, comuna de ${data.landlord.commune}, teléfono ${data.landlord.phone}, correo electrónico ${data.landlord.email}; en adelante indistintamente denominado como el "ARRENDADOR";

Y POR LA OTRA PARTE:
Don/Doña ${data.tenant.name.toUpperCase()}, de nacionalidad ${data.tenant.nationality}, estado civil ${data.tenant.civilStatus}, profesión ${data.tenant.profession}, cédula nacional de identidad número ${formatRut(data.tenant.rut)}, domiciliado/a en ${data.tenant.address}, comuna de ${data.tenant.commune}, teléfono ${data.tenant.phone}, correo electrónico ${data.tenant.email}; en adelante denominado como el "ARRENDATARIO".

${data.hasGuarantor && data.guarantor ? `Y COMO FIADOR Y CODEUDOR SOLIDARIO:
Don/Doña ${data.guarantor.name.toUpperCase()}, de nacionalidad ${data.guarantor.nationality}, estado civil ${data.guarantor.civilStatus}, profesión ${data.guarantor.profession}, cédula nacional de identidad número ${formatRut(data.guarantor.rut)}, domiciliado/a en ${data.guarantor.address}, comuna de ${data.guarantor.commune}; quien se constituye como fiador y codeudor solidario de todas y cada una de las obligaciones que por este acto asume el Arrendatario.
` : ''}
Los comparecientes, mayores de edad, quienes acreditan sus respectivas identidades con las cédulas citadas, exponen que han convenido celebrar el siguiente contrato de arrendamiento:

PRIMERO: PROPIEDAD Y DESTINO.
El Arrendador da en arrendamiento al Arrendatario, quien acepta para sí, el inmueble ubicado en ${data.propertyAddress}, comuna de ${data.propertyCommune}, ${data.propertyRegion}, Rol de Avalúo Fiscal del SII N° ${data.propertyRolSII || 'En trámite'}${data.propertyIncludesParking ? `, incluyendo el estacionamiento N° ${data.propertyParkingNumber}` : ''}${data.propertyIncludesStorage ? `, y la bodega N° ${data.propertyStorageNumber}` : ''}.
El inmueble se destinará única y exclusivamente a la habitación del Arrendatario y su grupo familiar inmediato, estándole terminantemente prohibido darle otro uso, destinarlo a fines comerciales, profesionales, subarrendar, ceder o transferir a cualquier título el presente contrato sin autorización expresa y escrita del Arrendador.

SEGUNDO: PLAZO DE VIGENCIA.
El presente contrato comenzará a regir a contar del día ${data.startDate} y tendrá una duración forzosa de ${data.durationMonths} meses. Llegado el término del plazo, el contrato ${data.isRenewableAutomatically ? 'se entenderá tácita y automáticamente renovado por períodos iguales y sucesivos de doce meses cada uno, a menos que cualquiera de las partes manifieste a la otra su voluntad de ponerle término, mediante comunicación escrita enviada por carta certificada o correo electrónico fehaciente con a lo menos 60 días de anticipación al vencimiento del plazo original o de cualquiera de sus prórrogas.' : 'se extinguirá de pleno derecho sin necesidad de desahucio ni requerimiento judicial alguno.'}

TERCERO: RENTA Y MODALIDAD DE PAGO.
La renta mensual de arrendamiento convenida de común acuerdo será la suma de ${formatMoney(data.amountValue, data.currency)} mensuales.
La renta se reajustará según la variación del ${data.readjustmentFrequency}, considerando la variación que experimente el Índice de Precios al Consumidor (IPC) determinado por el Instituto Nacional de Estadísticas (INE) o su variación equivalente.
La renta se pagará por mensualidades anticipadas a más tardar el día ${data.paymentDay} de cada mes calendario, mediante depósito o transferencia electrónica en la siguiente cuenta bancaria del Arrendador:
• Banco: ${data.paymentBank}
• Tipo de Cuenta: ${data.paymentAccountType}
• Número de Cuenta: ${data.paymentAccountNumber}
• Titular y RUT: ${data.paymentAccountRut}

CUARTO: MULTA POR MORA.
El no pago oportuno de la renta en la fecha convenida devengará un interés penal o multa moratoria equivalente a $5.000 CLP por cada día corrido de atraso, sin perjuicio del derecho del Arrendador de ejercer las acciones judiciales que la ley le confiere. Si la mora excediere de 15 días, el Arrendador quedará facultado para solicitar la terminación inmediata del contrato conforme al procedimiento monitorio de la Ley N° 21.461.

QUINTO: MES DE GARANTÍA.
A fin de garantizar la conservación del inmueble y el fiel, íntegro y oportuno cumplimiento de todas las obligaciones emanadas del presente contrato, el Arrendatario entrega en este acto al Arrendador la suma de ${formatMoney(data.guaranteeDepositCLP, 'CLP')}, correspondiente a ${data.guaranteeDepositMonths} mes(es) de renta de garantía. Esta suma no podrá en caso alguno imputarse al pago de rentas mensuales devengadas y será devuelta debidamente reajustada dentro de los 30 días posteriores a la restitución material de la propiedad, previa deducción justificada de las cuentas de consumos impagas o reparaciones de deterioros imputables al uso no legítimo del inmueble.

SEXTO: ESTADO DEL INMUEBLE E INVENTARIO.
El Arrendatario declara recibir el inmueble a su entera satisfacción, en buen estado de conservación, aseo, funcionamiento de artefactos sanitarios, cerraduras e instalaciones eléctricas.
Forman parte integrante de la entrega los siguientes bienes e inventario:
${data.inventoryDetails || 'Propiedad entregada en condiciones normales y desocupada, con todas sus llaves al día.'}

SÉPTIMO: MASCOTAS Y SUBARRIENDO.
• Tenencia de Mascotas: ${data.petsAllowed ? 'SE PERMITE la tenencia responsable de mascotas domésticas, debiendo el arrendatario responder íntegramente por cualquier daño estético o estructural que estas pudieran ocasionar en pisos, paredes o áreas comunes.' : 'QUEDA ESTRICTAMENTE PROHIBIDA la mantención de animales o mascotas en el inmueble arrendado.'}
• Subarriendo: ${data.subleaseAllowed ? 'Se autoriza excepcionalmente el subarriendo parcial con aviso previo.' : 'Queda estrictamente prohibido subarrendar total o parcialmente el inmueble o destinarlo a plataformas de arriendo temporal (ej. Airbnb). El incumplimiento autorizará el término inmediato del contrato.'}

OCTAVO: SERVICIOS Y GASTOS COMUNES.
Serán de cargo exclusivo del Arrendatario el pago íntegro y puntual de los consumos domiciliarios de agua potable, energía eléctrica, gas, internet, telefonía y gastos comunes ordinarios de administración si correspondieren. El Arrendatario deberá exhibir mensualmente al Arrendador los comprobantes respectivos que acrediten encontrarse al día en dichos pagos.

NOVENO: CLÁUSULAS ESPECIALES PACTADAS ENTRE LAS PARTES.
${data.specialClauses || 'No se registran estipulaciones especiales adicionales.'}

DÉCIMO: LEY "DEVUÉLVEME MI CASA" (LEY N° 21.461 Y PROCEDIMIENTO MONITORIO).
Las partes dejan expresa constancia de que el presente contrato se rige íntegramente por las disposiciones de la Ley N° 18.101 y por las modificaciones introducidas por la Ley N° 21.461 (conocida como "Ley Devuélveme Mi Casa"). En caso de no pago de la renta de arrendamiento o de cuentas de consumos y gastos comunes, el Arrendador podrá requerir el pago y la restitución del inmueble a través del procedimiento monitorio contemplado en el Título III bis de dicha ley, facultando al juez para ordenar el desalojo con auxilio de la fuerza pública en caso de no pago en el plazo legal perentorio de 10 días corridos.

UNDÉCIMO: AUTORIZACIÓN PARA INCLUSIÓN EN REGISTROS DE MOROSIDAD (DICOM / BOLETÍN COMERCIAL).
Para el caso de incumplimiento en el pago de la renta, consumos o gastos comunes, el Arrendatario y el Fiador autorizan expresamente e irrevocablemente al Arrendador o a quien sus derechos represente, para incorporar sus datos personales, cédula de identidad y montos adeudados en los registros públicos de morosidad o bases de datos comerciales (Dicom, Equifax, TransUnion o similar) de conformidad con la Ley N° 19.628 sobre protección de la vida privada.

DUODÉCIMO: JURISDICCIÓN Y DOMICILIO.
Para todos los efectos derivados de este contrato, las partes fijan domicilio especial en la comuna de ${data.propertyCommune} y se someten a la competencia de sus Tribunales Ordinarios de Justicia.

Para constancia, se firma el presente instrumento en dos ejemplares del mismo tenor y fecha, quedando uno en poder de cada parte.


________________________________________
${data.landlord.name.toUpperCase()}
ARRENDADOR
RUT: ${formatRut(data.landlord.rut)}


________________________________________
${data.tenant.name.toUpperCase()}
ARRENDATARIO
RUT: ${formatRut(data.tenant.rut)}

${data.hasGuarantor && data.guarantor ? `
________________________________________
${data.guarantor.name.toUpperCase()}
FIADOR Y CODEUDOR SOLIDARIO
RUT: ${formatRut(data.guarantor.rut)}
` : ''}

________________________________________
MELSA GESTIÓN INMOBILIARIA
INTERMEDIACIÓN Y CORRETAJE PROFESIONAL
www.melsa.cl`;
  }

  if (data.type === 'arriendo_comercial') {
    return `CONTRATO DE ARRENDAMIENTO COMERCIAL / LOCAL U OFICINA

En la ciudad de ${data.city}, República de Chile, a ${data.date}, entre:
ARRENDADOR: Don/Doña ${data.landlord.name.toUpperCase()}, RUT N° ${formatRut(data.landlord.rut)}, domiciliado/a en ${data.landlord.address}, comuna de ${data.landlord.commune};
Y ARRENDATARIO: Don/Doña ${data.tenant.name.toUpperCase()}, RUT N° ${formatRut(data.tenant.rut)}, domiciliado/a en ${data.tenant.address}, comuna de ${data.tenant.commune}.

PRIMERO: PROPIEDAD Y GIRO COMERCIAL AUTORIZADO.
El Arrendador da en arrendamiento el inmueble comercial ubicado en ${data.propertyAddress}, comuna de ${data.propertyCommune}, Rol SII N° ${data.propertyRolSII || '---'}.
El inmueble se destinará exclusivamente a: ${data.commercialActivityAllowed || 'Oficina comercial, servicios profesionales o giro compatible con patente municipal'}. Queda prohibido alterar el giro sin consentimiento expreso.

SEGUNDO: RENTA Y REAJUSTE.
La renta mensual es de ${formatMoney(data.amountValue, data.currency)} netos más IVA si procediere legalmente. Se reajustará según ${data.readjustmentFrequency}.
Día de pago: a más tardar el día ${data.paymentDay} de cada mes.

TERCERO: PLAZO Y RENOVACIÓN.
Plazo forzoso de ${data.durationMonths} meses contados desde el ${data.startDate}.

CUARTO: MEJORAS E INSTALACIONES.
Toda mejora o instalación que introduzca el Arrendatario requerirá autorización escrita del Arrendador y quedará en beneficio del inmueble a su término, sin derecho a indemnización.

QUINTO: CLÁUSULA ARBITRAL COMERCIAL.
Cualquier controversia será resuelta por los tribunales ordinarios de la comuna de ${data.propertyCommune}.

FIRMAN:

________________________                ________________________
${data.landlord.name.toUpperCase()}     ${data.tenant.name.toUpperCase()}
ARRENDADOR                              ARRENDATARIO`;
  }

  if (data.type === 'promesa_compraventa') {
    return `CONTRATO DE PROMESA DE COMPRAVENTA INMOBILIARIA

En la ciudad de ${data.city}, a ${data.date}, comparecen:
PROMITENTE VENDEDOR: Don/Doña ${data.landlord.name.toUpperCase()}, RUT ${formatRut(data.landlord.rut)};
PROMITENTE COMPRADOR: Don/Doña ${data.tenant.name.toUpperCase()}, RUT ${formatRut(data.tenant.rut)}.

PRIMERO: OBJETO.
El Promitente Vendedor promete vender, ceder y transferir al Promitente Comprador, quien promete comprar y adquirir para sí, el inmueble ubicado en ${data.propertyAddress}, comuna de ${data.propertyCommune}, Rol de Avalúo Fiscal SII N° ${data.propertyRolSII || '---'}.

SEGUNDO: PRECIO Y FORMA DE PAGO.
El precio de la compraventa prometida es la suma de ${formatMoney(data.amountValue, data.currency)}.
El precio se pagará al momento de suscribir la escritura pública definitiva de compraventa mediante instrucciones notariales o vale vista bancario, con recursos propios o financiamiento de crédito hipotecario.

TERCERO: CONDICIÓN Y PLAZO DE ESCRITURACIÓN.
La compraventa definitiva se otorgará dentro de un plazo de ${data.durationMonths > 12 ? 60 : data.durationMonths * 5} días corridos contados desde que los títulos de dominio se encuentren debidamente aprobados conforme a derecho por el banco o perito tasador.

CUARTO: ARRAS O MULTA PENAL DE SERIEDAD.
Las partes fijan una multa penal por incumplimiento o retractación injustificada equivalente al 10% del precio total de venta convenido.

QUINTO: ESTADO DE ENTREGA.
La propiedad se venderá como cuerpo cierto, en el estado en que se encuentra y libre de todo gravamen, embargo o litigio.

FIRMAN:

________________________                ________________________
PROMITENTE VENDEDOR                     PROMITENTE COMPRADOR`;
  }

  // Orden de Corretaje por defecto
  return `ORDEN DE VENTA Y MANDATO DE CORRETAJE INMOBILIARIO
MELSA GESTIÓN INMOBILIARIA

En ${data.city}, a ${data.date}, Don/Doña ${data.landlord.name.toUpperCase()}, RUT ${formatRut(data.landlord.rut)}, confiere mandato a MELSA GESTIÓN INMOBILIARIA para la comercialización del inmueble ubicado en ${data.propertyAddress}, comuna de ${data.propertyCommune}, Rol SII ${data.propertyRolSII || '---'}.

1. PRECIO DE OFERTA ACORDADO: ${formatMoney(data.amountValue, data.currency)}.
2. HONORARIOS DE CORRETAJE: Se acuerda una comisión del 2% + IVA sobre el valor final de la transacción al momento de concretar la operación.
3. VIGENCIA Y EXCLUSIVIDAD: El mandato tendrá una vigencia de ${data.durationMonths} meses renovables.

FIRMAN:

________________________                ________________________
PROPIETARIO MANDANTE                    MELSA GESTIÓN INMOBILIARIA`;
}
