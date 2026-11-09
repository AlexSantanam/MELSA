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
  Phone
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
}

export interface PackageParcel {
  id: string;
  timestamp: string;
  courier: 'Chilexpress' | 'MercadoLibre' | 'Starken' | 'Correos Chile' | 'Uber Eats' | 'Otro';
  trackingOrDesc: string;
  targetUnit: string;
  residentName: string;
  status: 'en_conserjeria' | 'entregado';
  receivedByResidentAt?: string;
}

export interface BuildingMaintenanceItem {
  id: string;
  equipment: string;
  category: 'Ascensores' | 'Bombas de Agua' | 'Gas SEC' | 'Incendio & Extintores' | 'Portones' | 'Caldera';
  mandatoryLaw: string; // e.g. "Ley 20.296 Minvu", "Res. SEC 2026"
  lastServiceDate: string;
  nextDueDate: string;
  status: 'al_dia' | 'proximo_vencer' | 'vencido';
  technicianCompany: string;
  canHireMelsaPro: boolean;
}

export interface AmenityReservation {
  id: string;
  amenityName: string; // Quincho, Sala Multiuso
  date: string;
  timeSlot: string;
  unitNumber: string;
  residentName: string;
  feeCLP: number;
  depositCLP: number;
  status: 'confirmada' | 'pendiente_pago' | 'finalizada';
}

export interface ManagedCommunity {
  id: string;
  name: string;
  address: string;
  commune: string;
  unitsCount: number;
  floorsCount: number;
  currentMonth: string; // e.g. "Noviembre 2026"
  totalBillingCLP: number;
  collectedCLP: number;
  reserveFundBalanceCLP: number;
  morosityRatePct: number;
  units: UnitExpenseItem[];
  visitors: ConciergeVisitor[];
  packages: PackageParcel[];
  maintenances: BuildingMaintenanceItem[];
  reservations: AmenityReservation[];
}

const INITIAL_COMMUNITIES: ManagedCommunity[] = [
  {
    id: 'comm-1',
    name: 'Edificio Parque Araucano',
    address: 'Av. Las Condes 10450',
    commune: 'Las Condes, RM',
    unitsCount: 48,
    floorsCount: 12,
    currentMonth: 'Noviembre 2026',
    totalBillingCLP: 8640000,
    collectedCLP: 7950000,
    reserveFundBalanceCLP: 18450000,
    morosityRatePct: 4.2,
    units: [
      { id: 'u-101', unitNumber: '101', ownerName: 'Gonzalo Vial Echenique', ownerPhone: '+56 9 9123 4567', aliquotPct: 2.08, baseExpenseCLP: 165000, waterOrGasMeterCLP: 14500, reserveFundCLP: 8900, penaltiesCLP: 0, totalToPayCLP: 188400, status: 'pagado', monthsOverdue: 0, paymentDate: '03 Nov 2026' },
      { id: 'u-102', unitNumber: '102', ownerName: 'Carolina Morales P.', ownerPhone: '+56 9 8234 5678', aliquotPct: 2.08, baseExpenseCLP: 165000, waterOrGasMeterCLP: 18200, reserveFundCLP: 8900, penaltiesCLP: 0, totalToPayCLP: 192100, status: 'pagado', monthsOverdue: 0, paymentDate: '05 Nov 2026' },
      { id: 'u-201', unitNumber: '201', ownerName: 'Rodrigo Matte Larraín', ownerPhone: '+56 9 7345 6789', aliquotPct: 2.15, baseExpenseCLP: 172000, waterOrGasMeterCLP: 21000, reserveFundCLP: 9200, penaltiesCLP: 0, totalToPayCLP: 202200, status: 'pendiente', monthsOverdue: 0 },
      { id: 'u-304', unitNumber: '304', ownerName: 'Inversiones Los Andes SpA', ownerPhone: '+56 9 6456 7890', aliquotPct: 2.40, baseExpenseCLP: 192000, waterOrGasMeterCLP: 0, reserveFundCLP: 10400, penaltiesCLP: 45000, totalToPayCLP: 621400, status: 'moroso', monthsOverdue: 3 },
      { id: 'u-402', unitNumber: '402', ownerName: 'Sebastián Valenzuela R.', ownerPhone: '+56 9 5567 8901', aliquotPct: 2.20, baseExpenseCLP: 176000, waterOrGasMeterCLP: 12000, reserveFundCLP: 9500, penaltiesCLP: 0, totalToPayCLP: 197500, status: 'pagado', monthsOverdue: 0, paymentDate: '02 Nov 2026' }
    ],
    visitors: [
      { id: 'vis-1', timestamp: '14:25', visitorName: 'Claudio Aránguiz M.', rut: '15.421.890-4', vehiclePlate: 'LX-4412', targetUnit: '101', type: 'visita', status: 'en_edificio' },
      { id: 'vis-2', timestamp: '13:10', visitorName: 'Repartidor PedidosYa', rut: '26.890.112-K', targetUnit: '304', type: 'delivery', status: 'salida_registrada', departureTime: '13:22' },
      { id: 'vis-3', timestamp: '11:00', visitorName: 'Juan Pablo Morales (Técnico SEC)', rut: '13.220.890-2', vehiclePlate: 'KJ-8900', targetUnit: 'Sala Caldera', type: 'tecnico', status: 'salida_registrada', departureTime: '12:45' }
    ],
    packages: [
      { id: 'pkg-1', timestamp: '10:15', courier: 'MercadoLibre', trackingOrDesc: 'Caja mediana sellada (#ML-99824)', targetUnit: '102', residentName: 'Carolina Morales', status: 'en_conserjeria' },
      { id: 'pkg-2', timestamp: '09:30', courier: 'Chilexpress', trackingOrDesc: 'Sobre documentos urgentes', targetUnit: '402', residentName: 'Sebastián Valenzuela', status: 'entregado', receivedByResidentAt: '12:15' }
    ],
    maintenances: [
      { id: 'm-1', equipment: 'Batería 2 Ascensores Thyssen', category: 'Ascensores', mandatoryLaw: 'Ley 20.296 (Certificación Minvu)', lastServiceDate: '15 Oct 2026', nextDueDate: '15 Nov 2026', status: 'proximo_vencer', technicianCompany: 'Thyssen Elevadores Chile', canHireMelsaPro: true },
      { id: 'm-2', equipment: 'Bombas de Presión de Agua Potable', category: 'Bombas de Agua', mandatoryLaw: 'Inspección Sanitaria D.S. 50', lastServiceDate: '01 Sep 2026', nextDueDate: '01 Dic 2026', status: 'al_dia', technicianCompany: 'HidroPump Services SpA', canHireMelsaPro: true },
      { id: 'm-3', equipment: 'Central Térmica & Calderas de Gas', category: 'Gas SEC', mandatoryLaw: 'Sello Verde D.S. 66 SEC', lastServiceDate: '20 May 2026', nextDueDate: '20 Nov 2026', status: 'proximo_vencer', technicianCompany: 'Mantenciones Térmicas del Maipo', canHireMelsaPro: true },
      { id: 'm-4', equipment: 'Red Húmeda & 24 Extintores PQS', category: 'Incendio & Extintores', mandatoryLaw: 'D.S. 594 Art. 45', lastServiceDate: '10 Jun 2026', nextDueDate: '10 Jun 2027', status: 'al_dia', technicianCompany: 'Extintores Chile SEC', canHireMelsaPro: true }
    ],
    reservations: [
      { id: 'res-1', amenityName: 'Quincho Panorámico Rooftop (Piso 13)', date: 'Viernes 14 Nov', timeSlot: '19:00 - 23:30', unitNumber: '101', residentName: 'Gonzalo Vial', feeCLP: 35000, depositCLP: 50000, status: 'confirmada' },
      { id: 'res-2', amenityName: 'Sala Multiuso / Eventos', date: 'Sábado 15 Nov', timeSlot: '15:00 - 20:00', unitNumber: '201', residentName: 'Rodrigo Matte', feeCLP: 45000, depositCLP: 50000, status: 'confirmada' }
    ]
  },
  {
    id: 'comm-2',
    name: 'Condominio Mirador Real',
    address: 'Av. Valparaíso con Calle Huanhualí',
    commune: 'Villa Alemana, Valparaíso',
    unitsCount: 32,
    floorsCount: 4,
    currentMonth: 'Noviembre 2026',
    totalBillingCLP: 3840000,
    collectedCLP: 3520000,
    reserveFundBalanceCLP: 7200000,
    morosityRatePct: 2.8,
    units: [
      { id: 'u-va101', unitNumber: '101', ownerName: 'Carlos Morales (Reserva #884)', ownerPhone: '+56 9 9876 5432', aliquotPct: 3.12, baseExpenseCLP: 110000, waterOrGasMeterCLP: 8500, reserveFundCLP: 5500, penaltiesCLP: 0, totalToPayCLP: 124000, status: 'pagado', monthsOverdue: 0, paymentDate: '04 Nov 2026' },
      { id: 'u-va202', unitNumber: '202', ownerName: 'Loreto Silva (Propietaria)', ownerPhone: '+56 9 8765 4321', aliquotPct: 3.12, baseExpenseCLP: 110000, waterOrGasMeterCLP: 11200, reserveFundCLP: 5500, penaltiesCLP: 0, totalToPayCLP: 126700, status: 'pendiente', monthsOverdue: 0 }
    ],
    visitors: [],
    packages: [],
    maintenances: [
      { id: 'm-va1', equipment: 'Portón Automático & Citofonía', category: 'Portones', mandatoryLaw: 'Ley Copropiedad 21.442', lastServiceDate: '01 Oct 2026', nextDueDate: '01 Dic 2026', status: 'al_dia', technicianCompany: 'Automatismos Quilpué', canHireMelsaPro: true }
    ],
    reservations: []
  }
];

export const BuildingManagementHub: React.FC = () => {
  const [communities, setCommunities] = useState<ManagedCommunity[]>(INITIAL_COMMUNITIES);
  const [selectedCommId, setSelectedCommId] = useState<string>(INITIAL_COMMUNITIES[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'concierge' | 'maintenances' | 'community'>('expenses');

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pagado' | 'pendiente' | 'moroso'>('all');

  // New visitor modal state
  const [isNewVisitorModalOpen, setIsNewVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorRut, setVisitorRut] = useState('');
  const [visitorPlate, setVisitorPlate] = useState('');
  const [visitorTargetUnit, setVisitorTargetUnit] = useState('101');
  const [visitorType, setVisitorType] = useState<ConciergeVisitor['type']>('visita');

  // New package modal state
  const [isNewPackageModalOpen, setIsNewPackageModalOpen] = useState(false);
  const [packageCourier, setPackageCourier] = useState<PackageParcel['courier']>('MercadoLibre');
  const [packageDesc, setPackageDesc] = useState('');
  const [packageTargetUnit, setPackageTargetUnit] = useState('101');
  const [packageResidentName, setPackageResidentName] = useState('');

  // Action feedback notice
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Active community
  const activeCommunity = communities.find(c => c.id === selectedCommId) || communities[0];

  const formatCLP = (val: number) => '$' + Math.round(val).toLocaleString('es-CL');

  // Register Payment
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

  // Send WhatsApp payment link
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

Puedes pagar vía transferencia a la cuenta de la comunidad o a través del botón de pago Webpay/Kushki integrado.
Administración ${activeCommunity.name} vía MELSA Copropiedades.`;

    const phone = unit.ownerPhone.replace(/\D/g, '') || '56999899421';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    setActionNotice(`✓ Aviso enviado por WhatsApp a ${unit.ownerName}`);
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

  // Register Visitor Departure
  const handleRegisterDeparture = (visitorId: string) => {
    const departureTime = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return {
        ...comm,
        visitors: comm.visitors.map(v => v.id === visitorId ? { ...v, status: 'salida_registrada', departureTime } : v)
      };
    }));
  };

  // Add Package Parcel
  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageDesc.trim()) return;

    const newPackage: PackageParcel = {
      id: 'pkg-' + Date.now(),
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      courier: packageCourier,
      trackingOrDesc: packageDesc,
      targetUnit: packageTargetUnit,
      residentName: packageResidentName || 'Residente',
      status: 'en_conserjeria'
    };

    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return { ...comm, packages: [newPackage, ...comm.packages] };
    }));

    setIsNewPackageModalOpen(false);
    setPackageDesc('');
    setPackageResidentName('');

    // Instant notification WhatsApp preview
    const noticeText = `📦 *PAQUETE EN CONSERJERÍA — ${activeCommunity.name.toUpperCase()}*\nHola ${newPackage.residentName}, tienes una encomienda de *${newPackage.courier}* (${newPackage.trackingOrDesc}) en recepción lista para retirar.`;
    setActionNotice(`✓ Encomienda registrada y notificada a Unidad #${packageTargetUnit}`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Deliver Package
  const handleDeliverPackage = (packageId: string) => {
    const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    setCommunities(prev => prev.map(comm => {
      if (comm.id !== activeCommunity.id) return comm;
      return {
        ...comm,
        packages: comm.packages.map(p => p.id === packageId ? { ...p, status: 'entregado', receivedByResidentAt: time } : p)
      };
    }));
  };

  // Request Melsa Technical Service
  const handleRequestMelsaTech = (maintenance: BuildingMaintenanceItem) => {
    const text = `🔧 *SOLICITUD MANTENCIÓN EDIFICIO — RED TÉCNICOS MELSA SEC*
Comunidad: ${activeCommunity.name} (${activeCommunity.address}, ${activeCommunity.commune})
Equipo Requerido: *${maintenance.equipment}* (${maintenance.category})
Normativa Chilena: ${maintenance.mandatoryLaw}
Fecha Vencimiento: ${maintenance.nextDueDate}

Solicitamos cotización preferencial corporativa con técnicos certificados de la Red MELSA.`;

    window.open(`https://wa.me/56999899421?text=${encodeURIComponent(text)}`, '_blank');
    setActionNotice(`✓ Solicitud de mantención técnica enviada a la Red MELSA SEC`);
    setTimeout(() => setActionNotice(null), 4000);
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
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1115] tracking-tight">
            Gestión Integral de Edificios & Condominios
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Cobro automatizado de Gastos Comunes, libro de visitas y paquetería digital para conserjes, y mantenciones preventivas conectadas a la Red de Técnicos MELSA SEC.
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
          <button onClick={() => setActionNotice(null)} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Executive Financial Banner (KPIs de la Comunidad) */}
      <div className="bg-gradient-to-r from-[#0F1115] via-[#1A1D23] to-[#0F1115] rounded-3xl text-white p-6 shadow-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-lg">
            <span className="text-[11px] uppercase tracking-widest text-[#ff6b6e] font-bold flex items-center gap-1">
              <span>● Periodo Activo: {activeCommunity.currentMonth}</span>
            </span>
            <h2 className="text-2xl font-black text-white">
              {activeCommunity.name}
            </h2>
            <p className="text-xs text-gray-300">
              {activeCommunity.address}, {activeCommunity.commune} • {activeCommunity.unitsCount} unidades residenciales
            </p>
          </div>

          {/* 4 Cards financieras */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Facturación Mes</span>
              <span className="text-lg font-extrabold text-white">{formatCLP(activeCommunity.totalBillingCLP)}</span>
              <span className="block text-[9px] text-gray-400">Total emitido</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Recaudado</span>
              <span className="text-lg font-extrabold text-emerald-400">{formatCLP(activeCommunity.collectedCLP)}</span>
              <span className="block text-[9px] text-emerald-300 font-bold">{collectionRate}% cobrado</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-gray-400 font-bold uppercase">Fondo de Reserva</span>
              <span className="text-lg font-extrabold text-white">{formatCLP(activeCommunity.reserveFundBalanceCLP)}</span>
              <span className="block text-[9px] text-gray-400">Cuenta exclusiva</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
              <span className="block text-[10px] text-rose-300 font-bold uppercase">Morosidad</span>
              <span className="text-lg font-extrabold text-rose-400">{activeCommunity.morosityRatePct}%</span>
              <span className="block text-[9px] text-rose-300 font-bold">1 caso crítico</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveSubTab('expenses')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
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
          onClick={() => setActiveSubTab('concierge')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'concierge'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4 text-[#D02126]" />
          <span>Conserjería, Visitas & Paquetes</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">{activeCommunity.visitors.length}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maintenances')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeSubTab === 'community'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#D02126]" />
          <span>Reservas de Espacios & Asambleas</span>
        </button>
      </div>

      {/* 4. SUB-TAB 1: GASTOS COMUNES & PRORRATEO (LEY 21.442) */}
      {activeSubTab === 'expenses' && (
        <div className="space-y-4">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por departamento o propietario..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none focus:border-[#D02126] w-64"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-1.5 text-xs outline-none"
              >
                <option value="all">Todos los estados ({activeCommunity.units.length})</option>
                <option value="pagado">Solo Pagados</option>
                <option value="pendiente">Solo Pendientes</option>
                <option value="moroso">Solo Morosos (&gt; 60 días)</option>
              </select>

              <button
                onClick={() => {
                  setActionNotice('✓ Gastos comunes de Noviembre 2026 emitidos y notificados por correo/WhatsApp a todos los copropietarios.');
                  setTimeout(() => setActionNotice(null), 4000);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F1115] hover:bg-[#D02126] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Emitir & Notificar Gastos Comunes</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F8] border-b border-gray-200/80 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Depto</th>
                    <th className="py-3 px-4">Propietario / Residente</th>
                    <th className="py-3 px-4">Alícuota</th>
                    <th className="py-3 px-4">Monto Base</th>
                    <th className="py-3 px-4">Remarcador (Agua/Gas)</th>
                    <th className="py-3 px-4">Fondo Reserva</th>
                    <th className="py-3 px-4">Total a Pagar</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUnits.map(unit => {
                    const isMorosoCritico = unit.monthsOverdue >= 3;

                    return (
                      <tr key={unit.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-black text-sm text-[#0F1115]">
                          #{unit.unitNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-gray-900 block">{unit.ownerName}</span>
                          <span className="text-[10px] text-gray-400 block">{unit.ownerPhone}</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-600">
                          {unit.aliquotPct}%
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-700">
                          {formatCLP(unit.baseExpenseCLP)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-700">
                          {formatCLP(unit.waterOrGasMeterCLP)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-700">
                          {formatCLP(unit.reserveFundCLP)}
                        </td>
                        <td className="py-3.5 px-4 font-black text-sm text-[#0F1115]">
                          {formatCLP(unit.totalToPayCLP)}
                        </td>
                        <td className="py-3.5 px-4">
                          {unit.status === 'pagado' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              ✓ Pagado ({unit.paymentDate})
                            </span>
                          )}
                          {unit.status === 'pendiente' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              ⏳ Pendiente
                            </span>
                          )}
                          {unit.status === 'moroso' && (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                ⚠ Moroso ({unit.monthsOverdue} meses)
                              </span>
                              {isMorosoCritico && (
                                <span className="text-[9px] text-rose-600 font-bold block">
                                  Habilitado corte luz (Art. 20)
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {unit.status !== 'pagado' && (
                              <button
                                onClick={() => handleMarkAsPaid(unit.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 cursor-pointer"
                                title="Registrar transferencia bancaria"
                              >
                                Pagado
                              </button>
                            )}

                            <button
                              onClick={() => handleSendWhatsAppCobro(unit)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                              title="Enviar cobro por WhatsApp"
                            >
                              <Share2 className="w-3 h-3 text-emerald-600" />
                              <span>Cobrar</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. SUB-TAB 2: CONSERJERÍA, VISITAS & PAQUETERÍA DIGITAL */}
      {activeSubTab === 'concierge' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Libro de Visitas Digital (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#D02126]" />
                  <span>Libro de Visitas & Accesos en Tiempo Real</span>
                </h3>
                <p className="text-gray-500 text-[11px]">Control de entradas con RUT y departamento de destino</p>
              </div>

              <button
                onClick={() => setIsNewVisitorModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D02126] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar Entrada</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeCommunity.visitors.length === 0 ? (
                <div className="py-8 text-center text-gray-400">Sin visitas registradas hoy.</div>
              ) : (
                activeCommunity.visitors.map(vis => (
                  <div key={vis.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-[#0F1115]">{vis.visitorName}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white border text-gray-600">
                          Depto #{vis.targetUnit}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {vis.type.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        RUT: <strong>{vis.rut}</strong> {vis.vehiclePlate && `• Patente: ${vis.vehiclePlate}`} • Entrada: <strong>{vis.timestamp}</strong>
                      </div>
                    </div>

                    <div>
                      {vis.status === 'en_edificio' ? (
                        <button
                          onClick={() => handleRegisterDeparture(vis.id)}
                          className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold cursor-pointer"
                        >
                          Marcar Salida
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-semibold">
                          Salida: {vis.departureTime}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Recepción de Encomiendas / Paquetería (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#0F1115] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#D02126]" />
                  <span>Encomiendas en Recepción</span>
                </h3>
                <p className="text-gray-500 text-[11px]">Notificación automática al residente</p>
              </div>

              <button
                onClick={() => setIsNewPackageModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D02126]" />
                <span>Recepción</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeCommunity.packages.map(pkg => (
                <div key={pkg.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs text-[#0F1115]">
                      Depto #{pkg.targetUnit} — {pkg.residentName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D02126]/10 text-[#D02126]">
                      {pkg.courier}
                    </span>
                  </div>

                  <p className="text-gray-600 text-[11px]">
                    {pkg.trackingOrDesc} • Llegada: {pkg.timestamp}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    {pkg.status === 'en_conserjeria' ? (
                      <button
                        onClick={() => handleDeliverPackage(pkg.id)}
                        className="w-full py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] cursor-pointer text-center"
                      >
                        ✓ Entregar a Residente
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ✓ Entregado a las {pkg.receivedByResidentAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 6. SUB-TAB 3: MANTENCIONES PREVENTIVAS & RED TÉCNICOS MELSA SEC */}
      {activeSubTab === 'maintenances' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1 max-w-xl">
              <span className="font-bold text-[#D02126] flex items-center gap-1 uppercase tracking-wider text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ventaja Melsa vs. ComunidadFeliz</span>
              </span>
              <h3 className="text-base font-extrabold text-[#0F1115]">
                Red Integrada de Especialistas del Hogar & Certificaciones SEC
              </h3>
              <p className="text-gray-600 leading-relaxed text-xs">
                A diferencia de otros software que te dejan solo buscando técnicos, Melsa conecta las revisiones obligatorias del edificio directamente con nuestra red certificada de Gasfitería, Electricidad SEC, Climatización y Ascensores.
              </p>
            </div>

            <button
              onClick={() => {
                window.open('https://wa.me/56999899421?text=Hola%20Melsa,%20deseo%20cotizar%20plan%20de%20mantenciones%20anuales%20para%20nuestro%20edificio', '_blank');
              }}
              className="px-4 py-2.5 rounded-2xl bg-[#D02126] text-white font-bold text-xs hover:bg-[#b01b20] transition-colors cursor-pointer shrink-0"
            >
              Cotizar Plan Integral con Melsa
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCommunity.maintenances.map(maint => {
              const isUrgent = maint.status === 'proximo_vencer';

              return (
                <div key={maint.id} className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm space-y-3 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isUrgent ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isUrgent ? '⚠ Próximo a Vencer' : '✓ Al Día'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">{maint.mandatoryLaw}</span>
                    </div>

                    <h4 className="text-base font-extrabold text-[#0F1115]">
                      {maint.equipment}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-gray-50 rounded-xl text-gray-600">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Última Revisión</span>
                        <span className="font-bold text-gray-800">{maint.lastServiceDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Vencimiento Obligatorio</span>
                        <span className="font-bold text-rose-600">{maint.nextDueDate}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-gray-500">
                      Proveedor actual: <strong>{maint.technicianCompany}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-bold">
                      ✓ Cobertura con Garantía Melsa
                    </span>

                    <button
                      onClick={() => handleRequestMelsaTech(maint)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1115] hover:bg-[#D02126] text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Cotizar con Red Melsa</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. SUB-TAB 4: PORTAL RESIDENTES, RESERVAS & ASAMBLEAS VIRTUALES */}
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

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Votos a favor: <strong>84%</strong></span>
                <button
                  onClick={() => {
                    setActionNotice('✓ Voto digital registrado con validación de alícuota.');
                    setTimeout(() => setActionNotice(null), 3000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#0F1115] text-white font-bold text-[11px] hover:bg-[#D02126]"
                >
                  Votar en Línea
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 8. MODAL: REGISTRAR INGRESO VISITA */}
      {isNewVisitorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F1115]">Registrar Entrada en Recepción</h3>
              <button onClick={() => setIsNewVisitorModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVisitor} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Andrés Valenzuela"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#D02126]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">RUT</label>
                  <input
                    type="text"
                    placeholder="12.345.678-9"
                    value={visitorRut}
                    onChange={(e) => setVisitorRut(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Patente Auto</label>
                  <input
                    type="text"
                    placeholder="AB-1234"
                    value={visitorPlate}
                    onChange={(e) => setVisitorPlate(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Depto Destino</label>
                  <input
                    type="text"
                    value={visitorTargetUnit}
                    onChange={(e) => setVisitorTargetUnit(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Tipo</label>
                  <select
                    value={visitorType}
                    onChange={(e) => setVisitorType(e.target.value as any)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none"
                  >
                    <option value="visita">Visita</option>
                    <option value="delivery">Delivery</option>
                    <option value="tecnico">Técnico / Servicio</option>
                    <option value="mudanza">Mudanza</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewVisitorModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-gray-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D02126] text-white font-bold hover:bg-[#b01b20]"
                >
                  Registrar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. MODAL: REGISTRAR ENCOMIENDA / PAQUETE */}
      {isNewPackageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4 animate-in fade-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F1115]">Recepción de Paquetería</h3>
              <button onClick={() => setIsNewPackageModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPackage} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Empresa / Courier</label>
                <select
                  value={packageCourier}
                  onChange={(e) => setPackageCourier(e.target.value as any)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none"
                >
                  <option value="MercadoLibre">MercadoLibre</option>
                  <option value="Chilexpress">Chilexpress</option>
                  <option value="Starken">Starken</option>
                  <option value="Correos Chile">Correos Chile</option>
                  <option value="Uber Eats">Uber Eats / PedidosYa</option>
                  <option value="Otro">Otro Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Descripción / Tracking</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Caja mediana sellada #4412"
                  value={packageDesc}
                  onChange={(e) => setPackageDesc(e.target.value)}
                  className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Depto Destino</label>
                  <input
                    type="text"
                    required
                    value={packageTargetUnit}
                    onChange={(e) => setPackageTargetUnit(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nombre Residente</label>
                  <input
                    type="text"
                    placeholder="Opcional"
                    value={packageResidentName}
                    onChange={(e) => setPackageResidentName(e.target.value)}
                    className="w-full bg-[#FAF9F8] border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewPackageModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-gray-600 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#D02126] text-white font-bold hover:bg-[#b01b20]"
                >
                  Guardar & Notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
