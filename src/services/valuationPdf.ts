// Informe de tasación en PDF (descarga directa en el navegador).
// Toma el resultado ya calculado por el motor AVM y lo ordena en un documento.

import type { ValuationInput, ValuationResult } from './propertyValuationEngine';
import { findCommuneLocation } from '../data/chileTerritory';

const BRAND_RED: [number, number, number] = [208, 33, 38];
const DARK: [number, number, number] = [15, 17, 21];
const GRAY: [number, number, number] = [107, 114, 128];

/** Las fuentes estándar del PDF solo tienen caracteres latinos: limpiar emojis y símbolos */
function clean(text: string | undefined | null): string {
  return String(text ?? '')
    .replace(/\*\*/g, '')
    .replace(/[•▪◦]/g, '-')
    .replace(/[—–]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/≤/g, '<=')
    .replace(/≥/g, '>=')
    .replace(/→/g, '->')
    .replace(/…/g, '...')
    .replace(/[^\x09\x0A\x0D\x20-\x7E -ÿ]/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .trim();
}

const uf = (n: number) => `${Math.round(n).toLocaleString('es-CL')} UF`;
const clp = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`;

export interface ValuationPdfExtras {
  /** Nombre del solicitante / propietario (opcional) */
  ownerName?: string;
}

/** Arma el documento PDF (sin descargarlo) */
export async function buildValuationPdf(
  input: ValuationInput,
  result: ValuationResult,
  extras: ValuationPdfExtras = {}
) {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 16; // margen
  let y = 0;

  const today = new Date();
  const dateStr = today.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
  const loc = findCommuneLocation(input.commune);

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - 20) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionTitle = (title: string) => {
    ensureSpace(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BRAND_RED);
    doc.text(clean(title).toUpperCase(), M, y);
    doc.setDrawColor(...BRAND_RED);
    doc.setLineWidth(0.4);
    doc.line(M, y + 1.5, pageW - M, y + 1.5);
    y += 6;
  };

  const paragraph = (text: string, size = 9, color: [number, number, number] = DARK) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    for (const line of doc.splitTextToSize(clean(text), pageW - 2 * M)) {
      ensureSpace(5);
      doc.text(line, M, y);
      y += size * 0.45;
    }
    y += 2;
  };

  const table = (body: (string | number)[][], head?: string[], columnStyles?: Record<number, object>) => {
    autoTable(doc, {
      startY: y,
      head: head ? [head.map(clean)] : undefined,
      body: body.map((row) => row.map((cell) => clean(String(cell)))),
      margin: { left: M, right: M },
      theme: 'grid',
      styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 2, textColor: DARK, lineColor: [229, 231, 235] },
      headStyles: { fillColor: DARK, textColor: 255, fontStyle: 'bold' },
      columnStyles: columnStyles ?? { 0: { fontStyle: 'bold', cellWidth: 55, fillColor: [250, 249, 248] } }
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  };

  // --- Encabezado ---
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text('MEL', M, 14);
  doc.setTextColor(...BRAND_RED);
  doc.text('SA', M + doc.getTextWidth('MEL'), 14);
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  doc.text('GESTION INMOBILIARIA  |  www.melsa.cl', M, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('Informe de Tasacion Referencial', pageW - M, 13, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(clean(`Emitido el ${dateStr}  |  UF del calculo: ${clp(result.ufValueTodayCLP)}`), pageW - M, 19, { align: 'right' });
  y = 40;

  // --- Valor ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...GRAY);
  doc.text(clean(`${input.propertyType} en ${result.communeFormatted}`), M, y);
  y += 7;
  doc.setFontSize(24);
  doc.setTextColor(...DARK);
  doc.text(uf(result.baseMarketUF), M, y);
  const valueWidth = doc.getTextWidth(uf(result.baseMarketUF));
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAY);
  doc.text(`${clp(result.baseMarketCLP)} CLP  -  valor de mercado recomendado`, M + valueWidth + 4, y);
  y += 8;

  table(
    [
      ['Venta rapida (< 45 dias)', uf(result.liquidityUF), clp(result.liquidityCLP)],
      ['Valor de mercado (recomendado)', uf(result.baseMarketUF), clp(result.baseMarketCLP)],
      ['Precio de paciencia (> 120 dias)', uf(result.premiumUF), clp(result.premiumCLP)]
    ],
    ['Escenario de venta', 'UF', 'CLP'],
    { 0: { fontStyle: 'bold', cellWidth: 70 }, 1: { halign: 'right' }, 2: { halign: 'right' } }
  );

  // --- Propiedad ---
  sectionTitle('Antecedentes de la propiedad');
  const propertyRows: (string | number)[][] = [
    ['Tipo de inmueble', input.propertyType],
    ['Direccion', input.address || 'No informada'],
    ['Comuna', result.communeFormatted],
    ['Provincia / Region', loc ? `${loc.provinceName} / ${loc.regionName}` : result.regionName],
    ['Rol SII', input.rolManzana && input.rolPredio ? `${input.rolManzana}-${input.rolPredio}` : 'No informado'],
    ['Superficie construida', `${input.usefulM2} m2`],
    ['Superficie terreno / total', `${input.totalM2 || input.usefulM2} m2`],
    ['Dormitorios / Banos', `${input.bedrooms} / ${input.bathrooms}`],
    ['Estacionamientos / Bodegas', `${input.parking} / ${input.storage}`],
    ['Material de construccion', input.constructionMaterial || 'No informado'],
    ['Estado de conservacion', input.condition || 'No informado'],
    ['Orientacion', input.orientation || 'No informada']
  ];
  if (input.specialAttributes) propertyRows.push(['Atributos informados', input.specialAttributes]);
  if (extras.ownerName) propertyRows.unshift(['Solicitante', extras.ownerName]);
  table(propertyRows);

  // --- SII ---
  if (result.siiAssessment) {
    sectionTitle('Antecedentes SII');
    const sii = result.siiAssessment;
    table([
      ['Fuente', sii.isLiveVerified ? 'Consulta en linea al SII' : 'Estimacion (sin consulta al SII)'],
      ['Rol', sii.rolFormatted],
      ...(sii.officialAddress ? [['Direccion registrada', sii.officialAddress]] : []),
      ['Destino', sii.destination],
      [sii.isLiveVerified ? 'Avaluo fiscal vigente' : 'Avaluo fiscal estimado', `${clp(sii.estimatedFiscalAssessmentCLP)} CLP`],
      ['Contribuciones', sii.contributionsStatus]
    ]);
  }

  // --- Indicadores ---
  sectionTitle('Indicadores');
  const indicators: (string | number)[][] = [
    ['Valor por m2 construido', `${result.averageUfM2} UF/m2`],
    ['Arriendo mensual estimado', `${clp(result.estimatedRentCLP)} CLP`],
    ['Rentabilidad bruta anual (cap rate)', `${result.capRateGrossPct}%`]
  ];
  if (result.zoneAdjustment) {
    const z = result.zoneAdjustment;
    indicators.push([
      'Ajuste por zona',
      `${z.factor >= 1 ? '+' : ''}${Math.round((z.factor - 1) * 100)}% (${z.compsUsed} propiedades a menos de ${z.maxDistanceKm} km)`
    ]);
  }
  if (result.materialityFactorPct !== undefined) {
    indicators.push(['Ajuste por materialidad', `${result.materialityFactorPct >= 0 ? '+' : ''}${result.materialityFactorPct}%`]);
  }
  if (result.specialFeaturesBonusUF) {
    indicators.push(['Aporte de atributos especiales', `+${uf(result.specialFeaturesBonusUF)}`]);
  }
  table(indicators);

  // --- Comparables ---
  if (result.comparableComps.length > 0) {
    sectionTitle('Propiedades comparables publicadas');
    table(
      result.comparableComps.map((c) => [
        c.address,
        c.usefulM2 > 0 ? `${c.usefulM2} m2` : 'Terreno',
        c.landM2 ? `${c.landM2.toLocaleString('es-CL')} m2` : 'No informado',
        uf(c.priceUF),
        c.distanceMeters !== undefined ? `${(c.distanceMeters / 1000).toFixed(1)} km` : '-'
      ]),
      ['Sector', 'Construido', 'Terreno', 'Precio publicado', 'Distancia'],
      { 3: { halign: 'right' }, 4: { halign: 'right' } }
    );
    paragraph('Precios de publicacion en portales; el valor de cierre suele ser algo menor.', 7.5, GRAY);
  }

  // --- Análisis ---
  sectionTitle('Analisis comparativo de mercado');
  paragraph(result.executiveReportCMA);

  sectionTitle('Metodologia');
  for (const note of result.methodologyNotes) paragraph(`- ${note}`, 8.5);

  // --- Aviso legal ---
  ensureSpace(24);
  y += 2;
  doc.setFillColor(250, 249, 248);
  const disclaimer = clean(
    'Este informe es una estimacion referencial generada por el modelo automatizado de valoracion (AVM) de MELSA ' +
      'a partir de los datos ingresados, informacion publica del SII y precios publicados en portales. No constituye una ' +
      'tasacion pericial ni reemplaza la visita de un tasador, el estudio de titulos ni la verificacion de deslindes. ' +
      'Para una tasacion oficial, contactar a MELSA al +56 9 9989 9421.'
  );
  const lines = doc.splitTextToSize(disclaimer, pageW - 2 * M - 6);
  const boxH = lines.length * 3.6 + 6;
  doc.rect(M, y, pageW - 2 * M, boxH, 'F');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAY);
  doc.text(lines, M + 3, y + 5);
  y += boxH + 4;

  // --- Pie de página con numeración ---
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text('MELSA Gestion Inmobiliaria  |  www.melsa.cl  |  +56 9 9989 9421', M, pageH - 8);
    doc.text(`Pagina ${i} de ${pages}`, pageW - M, pageH - 8, { align: 'right' });
  }

  const slug = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  const fileDate = today.toISOString().slice(0, 10);
  const fileName = `Tasacion-MELSA-${slug(result.communeFormatted)}-${slug(input.address || input.propertyType)}-${fileDate}.pdf`;
  return { doc, fileName };
}

/** Genera el informe y lo descarga en el navegador */
export async function downloadValuationPdf(
  input: ValuationInput,
  result: ValuationResult,
  extras: ValuationPdfExtras = {}
): Promise<void> {
  const { doc, fileName } = await buildValuationPdf(input, result, extras);
  doc.save(fileName);
}
