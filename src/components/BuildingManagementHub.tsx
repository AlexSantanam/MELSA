import React, { useState } from 'react';
import { 
  Building2, 
  Receipt, 
  ShieldCheck, 
  Wrench, 
  Calendar, 
  Users, 
  Plus, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Share2, 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Flame, 
  Bell, 
  Package, 
  Car, 
  UserCheck, 
  Vote, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Percent,
  X,
  Lock,
  Phone,
  QrCode,
  FileSpreadsheet,
  UploadCloud,
  CheckCheck,
  CreditCard,
  Briefcase,
  Scale,
  Printer,
  BadgeAlert,
  Zap,
  ArrowRight,
  BadgeCheck
} from 'lucide-react';
import { UF_CURRENT_CLP } from '../services/propertyValuationEngine';

export interface UnitExpenseItem {
  id: string;
  unitNumber: string; // e.g. "101", "202"
  ownerName: string;
  ownerPhone: string;
  aliquotPct: number; // e.g. 2.15%
  baseExpenseCLP: number;
  waterOrGasMeterCLP: number;
  reserveFundCLP: number;
  penaltiesCLP: number;
  totalToPayCLP: number;
  status: 'pagado' | 'pendiente' | 'moroso';
  monthsOverdue: number;
  paymentDate?: string;
}

export interface ConciergeVisitor {
  id: string;
  timestamp: string;
  visitorName: string;
  rut: string;
  vehiclePlate?: string;
  targetUnit: string;
  type: 'visita' | 'delivery' | 'tecnico' | 'mudanza';
  status: 'en_edificio' | 'salida_registrada';
  departureTime?: string;
  qrVerified?: boolean;
}

export interface PackageParcel {
  id: string;
  timestamp: string;
  courier: 'Chilexpress' | 'MercadoLibre' | 'BlueExpress' | 'CorreosChile' | 'Amazon' | 'Otro';
  trackingOrDesc: string;
  targetUnit: string;
  residentName: string;
  status: 'en_conserjeria' | 'entregado';
  receivedByResidentAt?: string;
}

export interface BuildingMaintenanceItem {
  id: string;
  equipment: string;
  category: 'Ascensores' | 'Bombas de Agua' | 'Calderas y Gas' | 'Generador Eléctrico' | 'Extintores y Red Húmeda' | 'Piscina / Áreas Verdes';
  mandatoryLaw: string; // e.g. "Ley 20.296 (Minvu)", "D.S. 66 SEC"
  lastServiceDate: string;
  nextDueDate: string;
  status: 'al_dia' | 'proximo_vencer' | 'vencido';
  technicianCompany: string;
  secInspectorName?: string;
  secRegistryCode?: string;
  canHireMelsaPro: boolean;
}

export interface AmenityReservation {
  id: string;
  amenityName: string;
  unitNumber: string;
  residentName: string;
  date: string;
  timeSlot: string;
  status: 'confirmada' | 'en_revision' | 'finalizada';
  depositCLP: number;
  feeCLP: number;
}

export interface BankMovementItem {
  id: string;
  date: string;
  bankOrigin: string;
  payerName: string;
  payerRut: string;
  comment: string;
  amountCLP: number;
  matchedUnitId?: string;
  matchedUnitNumber?: string;
  status: 'matched' | 'conciliated' | 'unmatched';
}

export interface BuildingEmployee {
  id: string;
  name: string;
  rut: string;
  role: 'Mayordomo' | 'Conserje Titular' | 'Conserje Nocturno' | 'Aseo & Mantención';
  shift: string;
  baseSalaryCLP: number;
  gratificationCLP: number;
  overtimeHours: number;
  overtimeCLP: number;
  bonusesCLP: number;
  afpName: string;
  afpPct: number;
  healthSystem: string;
  netSalaryCLP: number;
}

export interface ManagedCommunity {
  id: string;
  name: string;
  address: string;
  commune: string;
  unitsCount: number;
  floorsCount: number;
  currentMonth: string;
  totalBillingCLP: number;
  collectedCLP: number;
  reserveFundBalanceCLP: number;
  morosityRatePct: number;
  bankAccount: {
    bank: string;
    accountType: string;
    accountNumber: string;
    currentBalanceCLP: number;
  };
  units: UnitExpenseItem[];
  visitors: ConciergeVisitor[];
  packages: PackageParcel[];
  maintenances: BuildingMaintenanceItem[];
  reservations: AmenityReservation[];
  bankMovements: BankMovementItem[];
  employees: BuildingEmployee[];
}

const INITIAL_COMMUNITIES: ManagedCommunity[] = [
  {
    id: 'comm-1',
    name: 'Edificio Parque Almagro 1450',
    address: 'Av. Las Condes 10450',
    commune: 'Las Condes, RM',
    unitsCount: 48,
    floorsCount: 12,
    currentMonth: 'Noviembre 2026',
    totalBillingCLP: 8640000,
    collectedCLP: 7950000,
    reserveFundBalanceCLP: 18450000,
    morosityRatePct: 4.2,
    bankAccount: {
      bank: 'BancoEstado (Cuenta Corriente Condominio)',
      accountType: 'Cuenta Corriente',
      accountNumber: '110-09824-00',
      currentBalanceCLP: 24395000
    },
    units: [
      { id: 'u-101', unitNumber: '101', ownerName: 'Gonzalo Vial Echenique', ownerPhone: '+56 9 9123 4567', aliquotPct: 2.08, baseExpenseCLP: 165000, waterOrGasMeterCLP: 14500, reserveFundCLP: 8900, penaltiesCLP: 0, totalToPayCLP: 188400, status: 'pagado', monthsOverdue: 0, paymentDate: '03 Nov 2026' },
      { id: 'u-102', unitNumber: '102', ownerName: 'Carolina Morales P.', ownerPhone: '+56 9 8234 5678', aliquotPct: 2.08, baseExpenseCLP: 165000, waterOrGasMeterCLP: 18200, reserveFundCLP: 8900, penaltiesCLP: 0, totalToPayCLP: 192100, status: 'pagado', monthsOverdue: 0, paymentDate: '05 Nov 2026' },
      { id: 'u-201', unitNumber: '201', ownerName: 'Rodrigo Matte Larraín', ownerPhone: '+56 9 7345 6789', aliquotPct: 2.15, baseExpenseCLP: 172000, waterOrGasMeterCLP: 21000, reserveFundCLP: 9200, penaltiesCLP: 0, totalToPayCLP: 202200, status: 'pendiente', monthsOverdue: 0 },
      { id: 'u-304', unitNumber: '304', ownerName: 'Inversiones Los Andes SpA', ownerPhone: '+56 9 6456 7890', aliquotPct: 2.40, baseExpenseCLP: 192000, waterOrGasMeterCLP: 0, reserveFundCLP: 10400, penaltiesCLP: 45000, totalToPayCLP: 621400, status: 'moroso', monthsOverdue: 3 },
      { id: 'u-402', unitNumber: '402', ownerName: 'Sebastián Valenzuela R.', ownerPhone: '+56 9 5567 8901', aliquotPct: 2.20, baseExpenseCLP: 176000, waterOrGasMeterCLP: 12000, reserveFundCLP: 9500, penaltiesCLP: 0, totalToPayCLP: 197500, status: 'pagado', monthsOverdue: 0, paymentDate: '02 Nov 2026' }
    ],
    visitors: [
      { id: 'vis-1', timestamp: '14:25', visitorName: 'Claudio Aránguiz M.', rut: '15.421.890-4', vehiclePlate: 'LX-4412', targetUnit: '101', type: 'visita', status: 'en_edificio', qrVerified: true },
      { id: 'vis-2', timestamp: '13:10', visitorName: 'Repartidor PedidosYa', rut: '26.890.112-K', targetUnit: '304', type: 'delivery', status: 'salida_registrada', departureTime: '13:22' },
      { id: 'vis-3', timestamp: '11:00', visitorName: 'Juan Pablo Morales (Técnico SEC)', rut: '13.220.890-2', vehiclePlate: 'KJ-8900', targetUnit: 'Sala Caldera', type: 'tecnico', status: 'salida_registrada', departureTime: '12:45' }
    ],
    packages: [
      { id: 'pkg-1', timestamp: '10:15', courier: 'MercadoLibre', trackingOrDesc: 'Caja mediana sellada (#ML-99824)', targetUnit: '102', residentName: 'Carolina Morales', status: 'en_conserjeria' },
      { id: 'pkg-2', timestamp: '09:30', courier: 'Chilexpress', trackingOrDesc: 'Sobre documentos urgentes', targetUnit: '402', residentName: 'Sebastián Valenzuela', status: 'entregado', receivedByResidentAt: '12:15' }
    ],
    maintenances: [
      { id: 'm-1', equipment: 'Batería 2 Ascensores Thyssen', category: 'Ascensores', mandatoryLaw: 'Ley 20.296 (Certificación Minvu)', lastServiceDate: '15 Oct 2026', nextDueDate: '15 Nov 2026', status: 'proximo_vencer', technicianCompany: 'Thyssen Elevadores Chile', secInspectorName: 'Carlos Vega (Minvu 8841)', secRegistryCode: 'REG-MINVU-8841', canHireMelsaPro: true },
      { id: 'm-2', equipment: 'Bombas de Presión de Agua Potable', category: 'Bombas de Agua', mandatoryLaw: 'Inspección Sanitaria D.S. 50', lastServiceDate: '01 Sep 2026', nextDueDate: '01 Dic 2026', status: 'al_dia', technicianCompany: 'HidroPump Services SpA', secInspectorName: 'Melsa Red Hidráulica', secRegistryCode: 'SEC-HID-2044', canHireMelsaPro: true },
      { id: 'm-3', equipment: 'Caldera Central & Red de Gas Natural', category: 'Calderas y Gas', mandatoryLaw: 'Sello Verde SEC (D.S. 66)', lastServiceDate: '20 May 2026', nextDueDate: '20 May 2027', status: 'al_dia', technicianCompany: 'GasVal Certificaciones', secInspectorName: 'Héctor Lagos (SEC Gas Clase 1)', secRegistryCode: 'SEC-GAS-11429', canHireMelsaPro: true },
      { id: 'm-4', equipment: 'Grupo Electrógeno de Emergencia (150 kVA)', category: 'Generador Eléctrico', mandatoryLaw: 'Norma SEC Tableros y Respaldo', lastServiceDate: '10 Jul 2026', nextDueDate: '10 Nov 2026', status: 'proximo_vencer', technicianCompany: 'Generac Power Chile', secInspectorName: 'Patricio Muñoz (SEC Clase A)', secRegistryCode: 'SEC-ELEC-4401', canHireMelsaPro: true }
    ],
    reservations: [
      { id: 'res-1', amenityName: 'Quincho Panorámico Piso 18', unitNumber: '102', residentName: 'Carolina Morales', date: 'Sábado 14 Nov', timeSlot: '13:00 - 18:00', status: 'confirmada', feeCLP: 25000, depositCLP: 50000 },
      { id: 'res-2', amenityName: 'Sala Multiuso & Eventos', unitNumber: '402', residentName: 'Sebastián Valenzuela', date: 'Viernes 20 Nov', timeSlot: '19:00 - 23:30', status: 'confirmada', feeCLP: 35000, depositCLP: 70000 }
    ],
    bankMovements: [
      { id: 'bm-1', date: '03 Nov 2026 09:14', bankOrigin: 'Banco de Chile', payerName: 'Gonzalo Vial Echenique', payerRut: '12.345.678-9', comment: 'Gasto Comun Depto 101', amountCLP: 188400, matchedUnitId: 'u-101', matchedUnitNumber: '101', status: 'conciliated' },
      { id: 'bm-2', date: '05 Nov 2026 14:22', bankOrigin: 'Santander', payerName: 'Carolina Morales P.', payerRut: '14.567.890-1', comment: 'Noviembre Depto 102', amountCLP: 192100, matchedUnitId: 'u-102', matchedUnitNumber: '102', status: 'conciliated' },
      { id: 'bm-3', date: '08 Nov 2026 18:05', bankOrigin: 'BCI', payerName: 'Rodrigo Matte Larraín', payerRut: '13.987.654-3', comment: 'Transferencia GC Depto 201', amountCLP: 202200, matchedUnitId: 'u-201', matchedUnitNumber: '201', status: 'matched' },
      { id: 'bm-4', date: '09 Nov 2026 11:30', bankOrigin: 'BancoEstado', payerName: 'Sebastián Valenzuela', payerRut: '15.654.321-K', comment: 'Abono Depto 402', amountCLP: 197500, matchedUnitId: 'u-402', matchedUnitNumber: '402', status: 'conciliated' },
      { id: 'bm-5', date: '09 Nov 2026 12:45', bankOrigin: 'Banco Falabella', payerName: 'Transferencia Tercero', payerRut: '18.991.234-5', comment: 'Pago GGCC', amountCLP: 150000, status: 'unmatched' }
    ],
    employees: [
      { id: 'emp-1', name: 'Jorge Morales Castillo', rut: '11.890.432-8', role: 'Mayordomo', shift: 'Turno 4x4 Día (07:00 a 19:00)', baseSalaryCLP: 680000, gratificationCLP: 179800, overtimeHours: 12, overtimeCLP: 61200, bonusesCLP: 50000, afpName: 'Habitat', afpPct: 11.27, healthSystem: 'Fonasa (7%)', netSalaryCLP: 785400 },
      { id: 'emp-2', name: 'Juan Carlos Pérez R.', rut: '14.210.985-2', role: 'Conserje Nocturno', shift: 'Turno 4x4 Noche (19:00 a 07:00)', baseSalaryCLP: 540000, gratificationCLP: 179800, overtimeHours: 16, overtimeCLP: 86400, bonusesCLP: 45000, afpName: 'Modelo', afpPct: 10.58, healthSystem: 'Fonasa (7%)', netSalaryCLP: 684200 },
      { id: 'emp-3', name: 'Gladys Soto Valenzuela', rut: '16.784.321-K', role: 'Aseo & Mantención', shift: 'Lunes a Sábado (08:00 a 16:30)', baseSalaryCLP: 480000, gratificationCLP: 179800, overtimeHours: 6, overtimeCLP: 27000, bonusesCLP: 40000, afpName: 'PlanVital', afpPct: 11.16, healthSystem: 'Fonasa (7%)', netSalaryCLP: 598100 }
    ]
  }
];

export const BuildingManagementHub: React.FC = () => {
  const [communities, setCommunities] = useState<ManagedCommunity[]>(INITIAL_COMMUNITIES);
  const [selectedCommId, setSelectedCommId] = useState<string>(INITIAL_COMMUNITIES[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'conciliation' | 'payroll' | 'concierge' | 'maintenances' | 'community'>('expenses');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pagado' | 'pendiente' | 'moroso'>('all');

  // Modals State
  const [isNewVisitorModalOpen, setIsNewVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorRut, setVisitorRut] = useState('');
  const [visitorPlate, setVisitorPlate] = useState('');
  const [visitorTargetUnit, setVisitorTargetUnit] = useState('101');
  const [visitorType, setVisitorType] = useState<ConciergeVisitor['type']>('visita');

  const [isNewPackageModalOpen, setIsNewPackageModalOpen] = useState(false);
  const [packageCourier, setPackageCourier] = useState<PackageParcel['courier']>('MercadoLibre');
  const [packageDesc, setPackageDesc] = useState('');
  const [packageTargetUnit, setPackageTargetUnit] = useState('101');
  const [packageResidentName, setPackageResidentName] = useState('');

  // Super-Feature Modals (Match & Exceed ComunidadFeliz)
  const [isQrPassModalOpen, setIsQrPassModalOpen] = useState(false);
  const [qrVisitorName, setQrVisitorName] = useState('Nicolás Arancibia');
  const [qrTargetUnit, setQrTargetUnit] = useState('102');
  const [qrGeneratedCode, setQrGeneratedCode] = useState('QR-MELSA-98214');

  const [isLegalNoticeModalOpen, setIsLegalNoticeModalOpen] = useState(false);
  const [selectedMorosoUnit, setSelectedMorosoUnit] = useState<UnitExpenseItem | null>(null);

  const [isPaystubModalOpen, setIsPaystubModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<BuildingEmployee | null>(null);

  const [isMelsaSecModalOpen, setIsMelsaSecModalOpen] = useState(false);
  const [selectedSecEquipment, setSelectedSecEquipment] = useState<BuildingMaintenanceItem | null>(null);

  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeCommunity = communities.find(c => c.id === selectedCommId) || communities[0];

  const formatCLP = (val: number) => {
    return '$' + Math.round(val).toLocaleString('es-CL');
  };

  // Mark Unit as Paid Manually
  const handleMarkAsPaid = (unitId: string) => {
    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return {
        ...comm,
        units: comm.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            status: 'pagado',
            monthsOverdue: 0,
            paymentDate: new Date().toLocaleDateString('es-CL')
          };
        }),
        collectedCLP: comm.collectedCLP + (comm.units.find(u => u.id === unitId)?.totalToPayCLP || 0)
      };
    }));

    setActionNotice('✓ Pago de Gasto Común registrado y conciliado.');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Send WhatsApp payment reminder
  const handleSendWhatsAppCobro = (unit: UnitExpenseItem) => {
    const text = `🏢 *AVISO DE GASTO COMÚN — ${activeCommunity.name.toUpperCase()}*
Estimado/a ${unit.ownerName}, Depto #${unit.unitNumber}:
Adjuntamos el detalle correspondiente a *${activeCommunity.currentMonth}*:

• Monto Base Alícuota (${unit.aliquotPct}%): ${formatCLP(unit.baseExpenseCLP)}
• Consumos Remarcador (Agua/Gas): ${formatCLP(unit.waterOrGasMeterCLP)}
• Fondo de Reserva Obligatorio (Ley 21.442): ${formatCLP(unit.reserveFundCLP)}
${unit.penaltiesCLP > 0 ? `• Intereses y Multas por Mora: ${formatCLP(unit.penaltiesCLP)}` : ''}

👉 *TOTAL A PAGAR:* *${formatCLP(unit.totalToPayCLP)} CLP*
Estado: ${unit.status === 'pagado' ? '✓ PAGADO' : '⏳ PENDIENTE DE PAGO'}

Puedes pagar vía transferencia a la cuenta de la comunidad o a través del botón de pago Webpay/Fintoc integrado.
Administración ${activeCommunity.name} vía MELSA Comunidades OS.`;

    const phone = unit.ownerPhone.replace(/\D/g, '') || '56999899421';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setActionNotice(`✓ Aviso enviado por WhatsApp a ${unit.ownerName}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // 1-Click Bulk Conciliation from Bank Statement
  const handleBulkReconcile = () => {
    const pendingToReconcile = activeCommunity.bankMovements.filter(bm => bm.status === 'matched');
    if (pendingToReconcile.length === 0) {
      setActionNotice('ℹ️ Todas las transferencias ya se encuentran conciliadas.');
      setTimeout(() => setActionNotice(null), 3000);
      return;
    }

    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      
      const matchedUnitIds = pendingToReconcile.map(bm => bm.matchedUnitId).filter(Boolean);
      let addedRevenue = 0;

      const updatedUnits = comm.units.map(u => {
        if (matchedUnitIds.includes(u.id)) {
          addedRevenue += u.totalToPayCLP;
          return {
            ...u,
            status: 'pagado' as const,
            monthsOverdue: 0,
            paymentDate: new Date().toLocaleDateString('es-CL')
          };
        }
        return u;
      });

      const updatedMovements = comm.bankMovements.map(bm => {
        if (bm.status === 'matched') {
          return { ...bm, status: 'conciliated' as const };
        }
        return bm;
      });

      return {
        ...comm,
        units: updatedUnits,
        bankMovements: updatedMovements,
        collectedCLP: comm.collectedCLP + addedRevenue
      };
    }));

    setActionNotice(`✓ ¡Conciliación Exitosa! Se conciliaron ${pendingToReconcile.length} transferencias bancarias y se actualizaron los gastos comunes.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Download Previred TXT File
  const handleDownloadPreviredTxt = () => {
    const content = `# ARCHIVO DE REMUNERACIONES PREVIRED CHILE - LEY 21.442
# COMUNIDAD: ${activeCommunity.name} | PERIODO: 202611
# NUM_TRABAJADORES: ${activeCommunity.employees.length}
${activeCommunity.employees.map(emp => 
  `${emp.rut.padEnd(12)};${emp.name.padEnd(30)};${emp.role.padEnd(15)};${emp.baseSalaryCLP};${emp.gratificationCLP};${emp.overtimeCLP};${emp.afpName};${emp.healthSystem};${emp.netSalaryCLP}`
).join('\n')}
# FIN ARCHIVO VALIDADO PARA CARGA EN PREVIRED.COM`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `PREVIRED_${activeCommunity.name.replace(/\s+/g, '_')}_202611.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionNotice('✓ Archivo oficial de Previred (.txt) generado y descargado para pago de cotizaciones.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  // QR Guest Pass Simulator
  const handleSimulateQrScan = () => {
    const scannedVisitor: ConciergeVisitor = {
      id: 'vis-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      visitorName: qrVisitorName,
      rut: '16.892.410-3',
      vehiclePlate: 'PD-8821',
      targetUnit: qrTargetUnit,
      type: 'visita',
      status: 'en_edificio',
      qrVerified: true
    };

    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return { ...comm, visitors: [scannedVisitor, ...comm.visitors] };
    }));

    setIsQrPassModalOpen(false);
    setActionNotice(`✓ Pase QR Verificado al instante: ${qrVisitorName} ingresó a Unidad #${qrTargetUnit}.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Add Visitor
  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    const newVisitor: ConciergeVisitor = {
      id: 'vis-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      visitorName,
      rut: visitorRut || 'Sin RUT',
      vehiclePlate: visitorPlate.trim() || undefined,
      targetUnit: visitorTargetUnit,
      type: visitorType,
      status: 'en_edificio'
    };

    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return { ...comm, visitors: [newVisitor, ...comm.visitors] };
    }));

    setIsNewVisitorModalOpen(false);
    setVisitorName('');
    setVisitorRut('');
    setVisitorPlate('');
    setActionNotice(`✓ Ingreso registrado: ${newVisitor.visitorName} a Unidad #${visitorTargetUnit}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Add Package
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageDesc.trim()) return;

    const newPkg: PackageParcel = {
      id: 'pkg-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      courier: packageCourier,
      trackingOrDesc: packageDesc,
      targetUnit: packageTargetUnit,
      residentName: packageResidentName.trim() || `Residente Depto ${packageTargetUnit}`,
      status: 'en_conserjeria'
    };

    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return { ...comm, packages: [newPkg, ...comm.packages] };
    }));

    setIsNewPackageModalOpen(false);
    setPackageDesc('');

    const targetUnitObj = activeCommunity.units.find(u => u.unitNumber === packageTargetUnit);
    const phone = targetUnitObj?.ownerPhone?.replace(/\D/g, '') || '56999899421';
    const text = `📦 *MELSA CONSERJERÍA — ENCOMIENDA RECIBIDA*
Hola ${newPkg.residentName}, Depto #${newPkg.targetUnit}:
Te informamos que ha llegado un paquete de *${packageCourier}* a conserjería.
Detalle: ${packageDesc}
Hora de recepción: ${newPkg.timestamp}

Puedes retirarlo en recepción con el conserje de turno.
Edificio ${activeCommunity.name}.`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setActionNotice(`✓ Paquete registrado y notificación de WhatsApp enviada a Depto #${packageTargetUnit}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Mark Package Delivered
  const handleDeliverPackage = (packageId: string) => {
    const receivedByResidentAt = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return {
        ...comm,
        packages: comm.packages.map(p => p.id === packageId ? { ...p, status: 'entregado', receivedByResidentAt } : p)
      };
    }));
    setActionNotice('✓ Paquete marcado como entregado al residente.');
    setTimeout(() => setActionNotice(null), 2500);
  };

  // Filtered units
  const filteredUnits = activeCommunity.units.filter(u => {
    const matchesSearch = u.unitNumber.includes(searchQuery) || u.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const collectionRate = activeCommunity.totalBillingCLP > 0
    ? Math.round((activeCommunity.collectedCLP / activeCommunity.totalBillingCLP) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. Header Bar: Selector de Comunidad & Indicador Ley Copropiedad 21.442 */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#D02126]/10 text-[#D02126] border border-[#D02126]/20 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Administración de Copropiedades</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Ley 21.442 Cumplida
            </span>
            <span className="text-xs text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              ⚡ Previred & Conciliación Incluidas
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115] tracking-tight">
            Gestión Integral de Edificios & Condominios
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gastos comunes, conciliación bancaria automática, sueldos de conserjería con Previred, conserjería QR y mantención con técnicos certificados SEC.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCommId}
            onChange={(e) => setSelectedCommId(e.target.value)}
            className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#0F1115] font-bold outline-none focus:border-[#D02126] shadow-2xs"
          >
            {communities.map(comm => (
              <option key={comm.id} value={comm.id}>
                🏢 {comm.name} ({comm.commune}) — {comm.unitsCount} unidades
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notification Pill */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Executive Financial Banner (KPIs de la Comunidad) */}
      <div className="bg-gradient-to-r from-[#0F1115] via-[#1A1D23] to-[#0F1115] rounded-3xl text-white p-6 shadow-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Período Activo</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/30">
                {activeCommunity.currentMonth}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black mt-1">{activeCommunity.name}</h2>
            <p className="text-xs text-gray-400">{activeCommunity.address}, {activeCommunity.commune}</p>
          </div>

          {/* Quick Bank Summary */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">{activeCommunity.bankAccount.bank}</span>
            <span className="text-base font-black text-emerald-400">{formatCLP(activeCommunity.bankAccount.currentBalanceCLP)}</span>
            <span className="text-[10px] text-gray-400 block">N° Cta: {activeCommunity.bankAccount.accountNumber}</span>
          </div>
        </div>

        {/* 4 Financial KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Facturación Mes</span>
            <span className="text-lg font-extrabold text-white">{formatCLP(activeCommunity.totalBillingCLP)}</span>
            <span className="block text-[9px] text-gray-400">{activeCommunity.unitsCount} departamentos</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Recaudado</span>
            <span className="text-lg font-extrabold text-emerald-400">{formatCLP(activeCommunity.collectedCLP)}</span>
            <span className="block text-[9px] text-emerald-300 font-bold">{collectionRate}% cobrado</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="block text-[10px] text-gray-400 font-bold uppercase">Fondo de Reserva</span>
            <span className="text-lg font-extrabold text-white">{formatCLP(activeCommunity.reserveFundBalanceCLP)}</span>
            <span className="block text-[9px] text-gray-400">Ley 21.442 (Min. 5%)</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
            <span className="block text-[10px] text-rose-300 font-bold uppercase">Morosidad</span>
            <span className="text-lg font-extrabold text-rose-400">{activeCommunity.morosityRatePct}%</span>
            <span className="block text-[9px] text-rose-300 font-bold">1 caso con Art. 20</span>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tabs Navigation (Exact 6 Core Modules of Modern Proptech) */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs scrollbar-none">
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'expenses'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Receipt className="w-4 h-4 text-[#D02126]" />
          <span>Gastos Comunes & Prorrateo</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{activeCommunity.units.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('conciliation')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'conciliation'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Conciliación Bancaria Automática</span>
          <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-full font-extrabold">Auto-Match</span>
        </button>

        <button
          onClick={() => setActiveSubTab('payroll')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'payroll'
              ? 'bg-purple-700 text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-purple-300" />
          <span>Remuneraciones & Previred</span>
          <span className="text-[10px] bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded-full font-extrabold">DT</span>
        </button>

        <button
          onClick={() => setActiveSubTab('concierge')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'concierge'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#D02126]" />
          <span>Conserjería, QR & Paquetes</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{activeCommunity.visitors.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maintenances')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'maintenances'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Wrench className="w-4 h-4 text-[#D02126]" />
          <span>Mantenciones & Red Técnicos SEC</span>
          <span className="text-[10px] bg-rose-500/20 text-[#ff6b6e] font-bold px-1.5 py-0.2 rounded-full">
            {activeCommunity.maintenances.filter(m => m.status === 'proximo_vencer').length} Alertas
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('community')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'community'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Vote className="w-4 h-4 text-[#D02126]" />
          <span>Espacios & Votaciones Ley</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 4. SUB-TAB 1: GASTOS COMUNES & PRORRATEO                       */}
      {/* ============================================================== */}
      {activeSubTab === 'expenses' && (
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                <Receipt className="w-4 h-4 text-[#D02126]" />
                <span>Nómina de Unidades & Prorrateo Mensual</span>
              </h3>
              <p className="text-xs text-gray-500">Cálculo de alícuotas, remarcadores de agua/gas y fondo de reserva obligatorio Ley 21.442.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar depto o propietario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-[#D02126]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none"
              >
                <option value="all">Todos los Estados</option>
                <option value="pagado">Pagados</option>
                <option value="pendiente">Pendientes</option>
                <option value="moroso">Morosos (+3 Meses)</option>
              </select>

              <button
                onClick={() => {
                  setActionNotice('✓ Generando planilla consolidada de prorrateo en Excel...');
                  setTimeout(() => setActionNotice(null), 3000);
                }}
                className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Planilla</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase text-[10px]">
                  <th className="pb-3 pl-2">Depto</th>
                  <th className="pb-3">Copropietario</th>
                  <th className="pb-3 text-right">Alícuota</th>
                  <th className="pb-3 text-right">Base Gasto</th>
                  <th className="pb-3 text-right">Remarcador</th>
                  <th className="pb-3 text-right">Fondo Reserva (5%)</th>
                  <th className="pb-3 text-right">Total a Pagar</th>
                  <th className="pb-3 text-center">Estado</th>
                  <th className="pb-3 text-right pr-2">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUnits.map((unit) => {
                  return (
                    <tr key={unit.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 pl-2 font-black text-sm text-[#0F1115]">
                        #{unit.unitNumber}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-[#0F1115] block">{unit.ownerName}</span>
                        <span className="text-[11px] text-gray-400">{unit.ownerPhone}</span>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-gray-600">
                        {unit.aliquotPct}%
                      </td>
                      <td className="py-3.5 text-right font-mono text-gray-700">
                        {formatCLP(unit.baseExpenseCLP)}
                      </td>
                      <td className="py-3.5 text-right font-mono text-gray-600">
                        {unit.waterOrGasMeterCLP > 0 ? formatCLP(unit.waterOrGasMeterCLP) : '-'}
                      </td>
                      <td className="py-3.5 text-right font-mono text-gray-600">
                        {formatCLP(unit.reserveFundCLP)}
                      </td>
                      <td className="py-3.5 text-right font-mono font-black text-sm text-[#0F1115]">
                        {formatCLP(unit.totalToPayCLP)}
                      </td>
                      <td className="py-3.5 text-center">
                        {unit.status === 'pagado' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Pagado</span>
                          </span>
                        ) : unit.status === 'moroso' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertCircle className="w-3 h-3 text-rose-600" />
                            <span>Moroso ({unit.monthsOverdue} Meses)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pendiente</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {unit.status === 'moroso' && unit.monthsOverdue >= 3 && (
                            <button
                              onClick={() => {
                                setSelectedMorosoUnit(unit);
                                setIsLegalNoticeModalOpen(true);
                              }}
                              title="Generar Oficio Corte Suministro Art. 20 Ley 21.442"
                              className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-xs cursor-pointer"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Oficio Art. 20</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleSendWhatsAppCobro(unit)}
                            title="Enviar Boleta y Recordatorio por WhatsApp"
                            className="p-1.5 rounded-lg border border-gray-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          {unit.status !== 'pagado' && (
                            <button
                              onClick={() => handleMarkAsPaid(unit.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              Conciliar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. SUB-TAB 2: CONCILIACIÓN BANCARIA AUTOMÁTICA (AUTO-MATCH)     */}
      {/* ============================================================== */}
      {activeSubTab === 'conciliation' && (
        <div className="space-y-6">
          {/* Top Banner Conciliación */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-[#0E241A] to-emerald-950/80 rounded-3xl p-6 border border-emerald-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-black border border-emerald-500/30 uppercase">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Módulo de Conciliación Inteligente • Sin Costo Adicional</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Cruce Automático de Transferencias Bancarias
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                El sistema lee las transferencias recibidas en la cuenta corriente de la comunidad, identifica el departamento por monto y comentario, y concilia los gastos comunes con 1 solo clic.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={handleBulkReconcile}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Conciliar Todo Masivamente</span>
              </button>
            </div>
          </div>

          {/* Cartola Movements Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Cartola de Transferencias Recibidas (Últimos Movimientos)</span>
                </h4>
                <p className="text-xs text-gray-500">Cuenta: {activeCommunity.bankAccount.bank} ({activeCommunity.bankAccount.accountNumber})</p>
              </div>

              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                4 de 5 Cruzadas Automáticamente
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-3 pl-2">Fecha y Hora</th>
                    <th className="pb-3">Banco Origen</th>
                    <th className="pb-3">Pagador & RUT</th>
                    <th className="pb-3">Glosa / Comentario</th>
                    <th className="pb-3 text-right">Monto</th>
                    <th className="pb-3 text-center">Match Depto</th>
                    <th className="pb-3 text-right pr-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeCommunity.bankMovements.map(bm => (
                    <tr key={bm.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 pl-2 font-mono text-gray-600 text-[11px]">
                        {bm.date}
                      </td>
                      <td className="py-3.5 font-bold text-gray-800">
                        {bm.bankOrigin}
                      </td>
                      <td className="py-3.5">
                        <span className="font-bold text-[#0F1115] block">{bm.payerName}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{bm.payerRut}</span>
                      </td>
                      <td className="py-3.5 text-gray-600 font-mono text-[11px]">
                        "{bm.comment}"
                      </td>
                      <td className="py-3.5 text-right font-mono font-black text-sm text-[#0F1115]">
                        {formatCLP(bm.amountCLP)}
                      </td>
                      <td className="py-3.5 text-center">
                        {bm.matchedUnitNumber ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                            <BadgeCheck className="w-3 h-3 text-emerald-600" />
                            <span>Depto #{bm.matchedUnitNumber} (100% Match)</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Sin match automático</span>
                        )}
                      </td>
                      <td className="py-3.5 pr-2 text-right">
                        {bm.status === 'conciliated' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Conciliado
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              if (bm.matchedUnitId) handleMarkAsPaid(bm.matchedUnitId);
                              setCommunities(prev => prev.map(comm => ({
                                ...comm,
                                bankMovements: comm.bankMovements.map(m => m.id === bm.id ? { ...m, status: 'conciliated' } : m)
                              })));
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] cursor-pointer"
                          >
                            Conciliar 1-Click
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. SUB-TAB 3: REMUNERACIONES & PREVIRED (RRHH CONSERJES)        */}
      {/* ============================================================== */}
      {activeSubTab === 'payroll' && (
        <div className="space-y-6">
          {/* Header Remuneraciones */}
          <div className="bg-gradient-to-r from-purple-950/80 via-[#1C142A] to-purple-950/80 rounded-3xl p-6 border border-purple-500/40 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-black border border-purple-500/30 uppercase">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Módulo de RRHH & Ley Laboral Chilena</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Sueldos de Conserjería, Turnos 4x4 y Previred
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Cálculo automatizado de sueldo base, gratificación legal Art. 50 (tope 4.75 IMM), horas extras al 50% y exportación del archivo <strong>.txt oficial para Previred</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={handleDownloadPreviredTxt}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-black text-xs shadow-lg shadow-purple-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Archivo Previred (.txt)</span>
              </button>
            </div>
          </div>

          {/* Employees List */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h4 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span>Personal Contratado por la Comunidad ({activeCommunity.employees.length})</span>
                </h4>
                <p className="text-xs text-gray-500">Libro de asistencia y remuneraciones conforme a dictamen DT.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeCommunity.employees.map(emp => (
                <div key={emp.id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        {emp.role}
                      </span>
                      <h5 className="font-black text-sm text-[#0F1115] mt-1.5">{emp.name}</h5>
                      <span className="text-[11px] text-gray-500 font-mono">RUT: {emp.rut}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-gray-600 border-t border-gray-200/60 pt-3">
                    <div className="flex justify-between">
                      <span>Jornada / Turno:</span>
                      <strong className="text-gray-900">{emp.shift}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Sueldo Base:</span>
                      <span className="font-mono font-bold">{formatCLP(emp.baseSalaryCLP)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gratificación Legal Art. 50:</span>
                      <span className="font-mono font-bold text-gray-700">{formatCLP(emp.gratificationCLP)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Horas Extras ({emp.overtimeHours} hrs al 50%):</span>
                      <span className="font-mono font-bold text-emerald-600">{formatCLP(emp.overtimeCLP)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AFP & Salud:</span>
                      <span className="text-[11px] font-bold text-purple-700">{emp.afpName} ({emp.afpPct}%) + {emp.healthSystem}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">Líquido a Pagar</span>
                      <span className="text-base font-black text-purple-900 font-mono">{formatCLP(emp.netSalaryCLP)}</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEmployee(emp);
                        setIsPaystubModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Liquidación DT</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. SUB-TAB 4: CONSERJERÍA, VISITAS, QR & PAQUETES              */}
      {/* ============================================================== */}
      {activeSubTab === 'concierge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Visitas y Control de Accesos (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D02126]" />
                  <span>Libro Digital de Visitas & Accesos</span>
                </h3>
                <p className="text-gray-500 text-xs">Cero cuadernos de papel: registro inviolable con RUT y patente.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsQrPassModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-purple-600" />
                  <span>Pase QR Visita</span>
                </button>

                <button
                  onClick={() => setIsNewVisitorModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#0F1115] hover:bg-[#D02126] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Registrar Visita</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-extrabold uppercase text-[10px]">
                    <th className="pb-2.5">Hora</th>
                    <th className="pb-2.5">Nombre & RUT</th>
                    <th className="pb-2.5">Depto</th>
                    <th className="pb-2.5">Tipo</th>
                    <th className="pb-2.5">Patente</th>
                    <th className="pb-2.5 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeCommunity.visitors.map(vis => (
                    <tr key={vis.id} className="hover:bg-gray-50/60">
                      <td className="py-2.5 font-mono font-bold text-gray-600">{vis.timestamp}</td>
                      <td className="py-2.5">
                        <span className="font-bold text-[#0F1115] block flex items-center gap-1">
                          {vis.visitorName}
                          {vis.qrVerified && (
                            <span title="QR Verificado" className="text-purple-600 font-bold text-[9px] bg-purple-50 px-1 rounded">QR</span>
                          )}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{vis.rut}</span>
                      </td>
                      <td className="py-2.5 font-extrabold text-[#D02126]">#{vis.targetUnit}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 capitalize">
                          {vis.type}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-gray-600">{vis.vehiclePlate || 'A pie'}</td>
                      <td className="py-2.5 text-right">
                        {vis.status === 'en_edificio' ? (
                          <button
                            onClick={() => {
                              const departureTime = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
                              setCommunities(prev => prev.map(comm => ({
                                ...comm,
                                visitors: comm.visitors.map(v => v.id === vis.id ? { ...v, status: 'salida_registrada', departureTime } : v)
                              })));
                            }}
                            className="px-2.5 py-0.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] cursor-pointer"
                          >
                            Marcar Salida
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400">Salió {vis.departureTime}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Paquetería y Encomiendas (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#D02126]" />
                  <span>Paquetería & Encomiendas</span>
                </h3>
                <p className="text-gray-500 text-xs">Notificación automática al residente por WhatsApp al recepcionar.</p>
              </div>

              <button
                onClick={() => setIsNewPackageModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Recepción</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeCommunity.packages.map(pkg => (
                <div key={pkg.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black text-[#0F1115] block">
                        Depto #{pkg.targetUnit} — {pkg.residentName}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Courier: <strong>{pkg.courier}</strong> ({pkg.trackingOrDesc})
                      </span>
                    </div>

                    {pkg.status === 'en_conserjeria' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        En Custodia
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Entregado {pkg.receivedByResidentAt}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200/60 text-[11px]">
                    <span className="text-gray-400">Recibido a las {pkg.timestamp}</span>
                    {pkg.status === 'en_conserjeria' && (
                      <button
                        onClick={() => handleDeliverPackage(pkg.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                      >
                        Marcar Entrega
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. SUB-TAB 5: MANTENCIONES & RED TÉCNICOS SEC MELSA             */}
      {/* ============================================================== */}
      {activeSubTab === 'maintenances' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-gray-900 to-[#1A1D23] rounded-3xl p-6 border border-gray-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#D02126] uppercase">Red Técnica Especializada Melsa</span>
              <h3 className="text-xl font-black">Bitácora Oficial de Equipamiento Crítico & Certificaciones</h3>
              <p className="text-xs text-gray-400">
                Supervisa vencimientos de ascensores (Minvu), calderas (Sello Verde SEC), bombas de agua y grupo electrógeno con conexión directa a técnicos certificados.
              </p>
            </div>

            <a
              href="https://wa.me/56999899421?text=Hola,%20solicito%20inspecci%C3%B3n%20t%C3%A9cnica%20SEC%20para%20nuestro%20edificio."
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md shrink-0"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mesa de Urgencias SEC 24/7</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {activeCommunity.maintenances.map(maint => {
              const isAlert = maint.status === 'proximo_vencer';
              return (
                <div key={maint.id} className={`p-5 rounded-2xl bg-white border ${isAlert ? 'border-amber-300 shadow-md' : 'border-gray-200'} space-y-3`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-gray-400 tracking-wider block">{maint.category}</span>
                      <h4 className="font-extrabold text-sm text-[#0F1115] mt-0.5">{maint.equipment}</h4>
                      <span className="text-[11px] text-gray-500 font-bold block">{maint.mandatoryLaw}</span>
                    </div>

                    {isAlert ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-700" />
                        <span>Próximo a Vencer</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Certificación al Día</span>
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1 text-gray-600">
                    <div className="flex justify-between">
                      <span>Último Servicio:</span>
                      <strong className="text-gray-900">{maint.lastServiceDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Próxima Mantención Obligatoria:</span>
                      <strong className={isAlert ? 'text-amber-800 font-black' : 'text-gray-900'}>{maint.nextDueDate}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Empresa / Inspector Registrado:</span>
                      <span className="text-gray-800 font-bold">{maint.secInspectorName || maint.technicianCompany}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tarifa Preferencial Condominio Melsa</span>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedSecEquipment(maint);
                        setIsMelsaSecModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1115] hover:bg-[#D02126] text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Cotizar Técnico SEC</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 9. SUB-TAB 6: ESPACIOS COMUNES & ASAMBLEAS LEY 21.442          */}
      {/* ============================================================== */}
      {activeSubTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-xs">
          
          {/* Left: Reservas de Espacios Comunes (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D02126]" />
                  <span>Reserva de Quinchos & Sala Multiuso</span>
                </h3>
                <p className="text-gray-500 text-[11px]">Calendario de uso y cobro automático en el gasto común</p>
              </div>

              <button
                onClick={() => {
                  setActionNotice('✓ Nueva reserva ingresada y cargada a la boleta de gastos comunes.');
                  setTimeout(() => setActionNotice(null), 3000);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#D02126] text-white font-bold text-xs cursor-pointer"
              >
                + Nueva Reserva
              </button>
            </div>

            <div className="space-y-3">
              {activeCommunity.reservations.map(res => (
                <div key={res.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-sm text-[#0F1115]">{res.amenityName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {res.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-gray-600 text-xs">
                    Fecha: <strong>{res.date}</strong> ({res.timeSlot}) • Depto #{res.unitNumber} ({res.residentName})
                  </div>

                  <div className="flex justify-between items-center pt-1 border-t border-gray-200/60 text-[11px]">
                    <span className="text-gray-500">Costo Aseo: {formatCLP(res.feeCLP)} • Garantía: {formatCLP(res.depositCLP)}</span>
                    <span className="text-emerald-600 font-bold">Cargado al Gasto Común</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Asambleas Virtuales & Votaciones (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                <Vote className="w-4 h-4 text-[#D02126]" />
                <span>Asambleas & Votaciones Digitales</span>
              </h3>
              <p className="text-gray-500 text-[11px]">Cálculo de quórum legal según alícuota Ley 21.442</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-3">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  ● Votación Abierta (Cierra 20 Nov)
                </span>
                <h4 className="font-extrabold text-sm text-[#0F1115] mt-1">
                  Aprobación de Pintura de Fachada y Balcones 2027
                </h4>
                <p className="text-gray-500 text-[11px] mt-0.5">
                  Presupuesto propuesto con cargo al Fondo de Reserva ($12.000.000 CLP).
                </p>
              </div>

              {/* Progress Bar Quórum */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Quórum Participación: 68.4%</span>
                  <span className="text-emerald-600">Quórum Ley Alcanzado (66%)</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68.4%' }} />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    setActionNotice('✓ Voto digital registrado con ponderación de alícuota fiscal.');
                    setTimeout(() => setActionNotice(null), 3000);
                  }}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs cursor-pointer shadow-xs"
                >
                  Votar A Favor (68%)
                </button>
                <button
                  onClick={() => {
                    setActionNotice('✓ Voto digital registrado con ponderación de alícuota fiscal.');
                    setTimeout(() => setActionNotice(null), 3000);
                  }}
                  className="flex-1 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-extrabold text-xs cursor-pointer"
                >
                  En Contra (12%)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: OFICIO LEGAL DE CORTE DE LUZ (ART. 20 LEY 21.442)    */}
      {/* ============================================================== */}
      {isLegalNoticeModalOpen && selectedMorosoUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F1115]">Oficio de Corte de Suministro Eléctrico</h3>
                  <p className="text-[11px] text-gray-500">Conforme al Artículo 20 de la Ley N° 21.442 de Copropiedad</p>
                </div>
              </div>
              <button onClick={() => setIsLegalNoticeModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Legal Document Preview */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-mono space-y-3 leading-relaxed text-gray-800 max-h-80 overflow-y-auto">
              <div className="text-right text-[11px] text-gray-500 font-sans">
                Santiago, {new Date().toLocaleDateString('es-CL')}
              </div>
              <p>
                <strong>SEÑOR GERENTE COMERCIAL</strong><br />
                COMPAÑÍA DISTRIBUIDORA DE ELECTRICIDAD (ENEL / CGE)<br />
                PRESENTE
              </p>
              <p>
                <strong>REF:</strong> Solicitud de suspensión del servicio eléctrico a unidad con morosidad superior a tres períodos continuos, según lo dispuesto en el Artículo 20 de la Ley N° 21.442.
              </p>
              <p>
                Por medio de la presente, la Administración de <strong>{activeCommunity.name}</strong>, en virtud de las facultades conferidas por el Reglamento de Copropiedad y el Artículo 20 de la Ley 21.442, viene en solicitar la suspensión del suministro eléctrico de la siguiente unidad:
              </p>
              <div className="bg-white p-2.5 rounded-lg border border-gray-200 space-y-1">
                <div>• <strong>Unidad / Depto:</strong> #{selectedMorosoUnit.unitNumber}</div>
                <div>• <strong>Copropietario:</strong> {selectedMorosoUnit.ownerName}</div>
                <div>• <strong>Períodos Impagos:</strong> {selectedMorosoUnit.monthsOverdue} Meses Consecutivos</div>
                <div>• <strong>Deuda Acumulada:</strong> {formatCLP(selectedMorosoUnit.totalToPayCLP)} CLP</div>
              </div>
              <p>
                Se deja constancia de que se han efectuado las notificaciones previas de cobro sin respuesta favorable.
              </p>
              <div className="pt-4 flex justify-between text-center font-sans text-[11px] text-gray-600">
                <div>
                  ___________________________<br />
                  <strong>Administrador Condominio</strong><br />
                  Reg. Minvu N° 44.892
                </div>
                <div>
                  ___________________________<br />
                  <strong>Presidente Comité de Adm.</strong><br />
                  {activeCommunity.name}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsLegalNoticeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setIsLegalNoticeModalOpen(false);
                  setActionNotice(`✓ Oficio Legal Ley 21.442 generado y descargado para notificación a Enel y al copropietario.`);
                  setTimeout(() => setActionNotice(null), 4000);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar Oficio Legal (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: PASE DE INVITADO CON CÓDIGO QR                       */}
      {/* ============================================================== */}
      {isQrPassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 text-center">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                Acceso Inteligente
              </span>
              <button onClick={() => setIsQrPassModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#0F1115]">Pase QR de Invitado / Delivery</h3>
              <p className="text-xs text-gray-500">Válido por 4 horas para ingreso ágil en portería.</p>
            </div>

            {/* QR Card Graphic */}
            <div className="p-4 bg-gray-900 rounded-2xl text-white space-y-3">
              <div className="w-32 h-32 bg-white rounded-xl mx-auto flex items-center justify-center p-2 shadow-inner">
                <QrCode className="w-28 h-28 text-gray-950" />
              </div>
              <div className="text-xs font-mono font-bold text-emerald-400">{qrGeneratedCode}</div>
              <div className="text-[11px] text-gray-300">
                Destino: <strong>Depto #{qrTargetUnit}</strong> • {qrVisitorName}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleSimulateQrScan}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simular Lectura en Portería</span>
              </button>
              <button
                onClick={() => {
                  window.open(`https://wa.me/56999899421?text=${encodeURIComponent(`Hola ${qrVisitorName}, aquí tienes tu Pase QR para ingresar a ${activeCommunity.name} Depto #${qrTargetUnit}: https://melsa.cl/qr/${qrGeneratedCode}`)}`, '_blank');
                  setIsQrPassModalOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Enviar Pase por WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: LIQUIDACIÓN DE SUELDO OFICIAL DT                     */}
      {/* ============================================================== */}
      {isPaystubModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F1115]">Liquidación de Remuneraciones</h3>
                <p className="text-xs text-gray-500">Conforme al Artículo 54 del Código del Trabajo de Chile</p>
              </div>
              <button onClick={() => setIsPaystubModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Paystub Document Layout */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-3 font-sans">
              <div className="flex justify-between border-b border-gray-200 pb-2">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Empleador:</span>
                  <div className="font-extrabold text-gray-900">{activeCommunity.name}</div>
                  <div className="text-gray-500 text-[11px]">{activeCommunity.address}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Período:</span>
                  <div className="font-extrabold text-purple-700">{activeCommunity.currentMonth}</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Trabajador:</span>
                <div className="font-black text-sm text-gray-900">{selectedEmployee.name}</div>
                <div className="text-gray-600 text-[11px]">RUT: {selectedEmployee.rut} • Cargo: {selectedEmployee.role}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                {/* Haberes */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-800">1. Haberes Imponibles:</span>
                  <div className="flex justify-between text-[11px]"><span>Sueldo Base:</span><strong className="font-mono">{formatCLP(selectedEmployee.baseSalaryCLP)}</strong></div>
                  <div className="flex justify-between text-[11px]"><span>Gratificación (25%):</span><strong className="font-mono">{formatCLP(selectedEmployee.gratificationCLP)}</strong></div>
                  <div className="flex justify-between text-[11px]"><span>Horas Extras ({selectedEmployee.overtimeHours} hrs):</span><strong className="font-mono">{formatCLP(selectedEmployee.overtimeCLP)}</strong></div>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-gray-200"><span>Bono Colación/Mov.:</span><strong className="font-mono">{formatCLP(selectedEmployee.bonusesCLP)}</strong></div>
                </div>

                {/* Descuentos */}
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-rose-800">2. Descuentos Previsionales:</span>
                  <div className="flex justify-between text-[11px]"><span>AFP {selectedEmployee.afpName} ({selectedEmployee.afpPct}%):</span><strong className="font-mono text-rose-700">-{formatCLP(Math.round((selectedEmployee.baseSalaryCLP + selectedEmployee.gratificationCLP) * (selectedEmployee.afpPct / 100)))}</strong></div>
                  <div className="flex justify-between text-[11px]"><span>{selectedEmployee.healthSystem}:</span><strong className="font-mono text-rose-700">-{formatCLP(Math.round((selectedEmployee.baseSalaryCLP + selectedEmployee.gratificationCLP) * 0.07))}</strong></div>
                  <div className="flex justify-between text-[11px]"><span>Seguro Cesantía AFC (0.6%):</span><strong className="font-mono text-rose-700">-{formatCLP(Math.round((selectedEmployee.baseSalaryCLP + selectedEmployee.gratificationCLP) * 0.006))}</strong></div>
                </div>
              </div>

              {/* Total Líquido */}
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 flex justify-between items-center pt-2">
                <span className="text-xs font-black text-purple-950 uppercase">Total Líquido a Pagar:</span>
                <span className="text-base font-black text-purple-900 font-mono">{formatCLP(selectedEmployee.netSalaryCLP)} CLP</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsPaystubModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs cursor-pointer">
                Cerrar
              </button>
              <button
                onClick={() => {
                  setIsPaystubModalOpen(false);
                  setActionNotice(`✓ Liquidación de ${selectedEmployee.name} generada para firma.`);
                  setTimeout(() => setActionNotice(null), 3000);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Descargar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: COTIZACIÓN DIRECTA TÉCNICO SEC MELSA                  */}
      {/* ============================================================== */}
      {isMelsaSecModalOpen && selectedSecEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F1115]">Inspección Técnica Certificada SEC</h3>
                  <p className="text-[11px] text-gray-500">Red Oficial de Técnicos & Peritos MELSA</p>
                </div>
              </div>
              <button onClick={() => setIsMelsaSecModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold">Equipo:</span>
                <div className="font-extrabold text-sm text-gray-900">{selectedSecEquipment.equipment}</div>
                <div className="text-gray-500">{selectedSecEquipment.mandatoryLaw}</div>
              </div>

              <div className="pt-2 border-t border-gray-200 space-y-1">
                <div className="flex justify-between">
                  <span>Inspector Asignado:</span>
                  <strong className="text-emerald-700">{selectedSecEquipment.secInspectorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Registro SEC / Minvu:</span>
                  <strong className="font-mono text-gray-800">{selectedSecEquipment.secRegistryCode}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa Convenio Comunidad:</span>
                  <strong className="text-emerald-600">20% Descuento Aplicado</strong>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  setIsMelsaSecModalOpen(false);
                  setActionNotice(`✓ Inspección técnica confirmada. Un perito SEC visitará el edificio.`);
                  setTimeout(() => setActionNotice(null), 4000);
                }}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Visita Técnica con Garantía</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR VISITA */}
      {isNewVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F1115]">Registrar Ingreso en Portería</h3>
              <button onClick={() => setIsNewVisitorModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVisitor} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nombre Completo Visita:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Martín Larraín"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#D02126]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">RUT Chileno:</label>
                  <input
                    type="text"
                    placeholder="18.924.112-4"
                    value={visitorRut}
                    onChange={(e) => setVisitorRut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#D02126]"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Patente Vehículo:</label>
                  <input
                    type="text"
                    placeholder="Ej. AB-1234 (opcional)"
                    value={visitorPlate}
                    onChange={(e) => setVisitorPlate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#D02126]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Depto de Destino:</label>
                  <select
                    value={visitorTargetUnit}
                    onChange={(e) => setVisitorTargetUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  >
                    {activeCommunity.units.map(u => (
                      <option key={u.id} value={u.unitNumber}>Depto #{u.unitNumber} ({u.ownerName})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Motivo / Tipo:</label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="visita">Visita Familiar/Social</option>
                    <option value="delivery">Delivery (PedidosYa/Uber)</option>
                    <option value="tecnico">Técnico / Mantención</option>
                    <option value="mudanza">Mudanza</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewVisitorModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0F1115] hover:bg-[#D02126] text-white font-bold"
                >
                  Registrar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECEPCIONAR PAQUETE */}
      {isNewPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F1115]">Recepción de Paquete / Encomienda</h3>
              <button onClick={() => setIsNewPackageModalOpen(false)} className="text-gray-400 hover:text-gray-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPackage} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Empresa Courier:</label>
                  <select
                    value={packageCourier}
                    onChange={(e) => setPackageCourier(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  >
                    <option value="MercadoLibre">MercadoLibre</option>
                    <option value="Chilexpress">Chilexpress</option>
                    <option value="BlueExpress">BlueExpress</option>
                    <option value="CorreosChile">Correos de Chile</option>
                    <option value="Amazon">Amazon Global</option>
                    <option value="Otro">Otro Courier</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Depto Destino:</label>
                  <select
                    value={packageTargetUnit}
                    onChange={(e) => setPackageTargetUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none"
                  >
                    {activeCommunity.units.map(u => (
                      <option key={u.id} value={u.unitNumber}>Depto #{u.unitNumber}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descripción del Paquete / N° Tracking:</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Caja mediana sellada #ML-88412"
                  value={packageDesc}
                  onChange={(e) => setPackageDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-[#D02126]"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px]">
                ℹ️ Al guardar, se abrirá la plantilla para notificar automáticamente al residente vía WhatsApp.
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPackageModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold"
                >
                  Registrar y Enviar WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
