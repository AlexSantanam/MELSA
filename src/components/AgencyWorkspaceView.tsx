import React, { useState } from 'react';
import { 
  Building2, 
  DollarSign, 
  FileText, 
  Wrench, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Plus, 
  ArrowRight, 
  Users, 
  Calendar, 
  Download, 
  Phone, 
  MessageCircle, 
  Check, 
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  X
} from 'lucide-react';
import { 
  AuthUser, 
  AgencyRentalContract, 
  AgencyMaintenanceTicket, 
  AgencySalePipeline, 
  AgencyPlanTier, 
  AgencySaaSPlan 
} from '../types';
import { 
  MOCK_AGENCY_CONTRACTS, 
  MOCK_AGENCY_TICKETS, 
  MOCK_AGENCY_SALES, 
  AGENCY_SAAS_PLANS 
} from '../data/mockData';

interface AgencyWorkspaceViewProps {
  currentUser: AuthUser;
}

export const AgencyWorkspaceView: React.FC<AgencyWorkspaceViewProps> = ({ currentUser }) => {
  // Navigation Sub-tab for Agency
  const [activeTab, setActiveTab] = useState<'rentals' | 'settlement' | 'portals' | 'maintenance' | 'sales' | 'plans'>('rentals');

  // Agency Subscription Plan
  const [currentPlan, setCurrentPlan] = useState<AgencyPlanTier>(currentUser.agencyPlan || 'intermedio');
  const [planChangeAlert, setPlanChangeAlert] = useState<string | null>(null);

  // Client Portals Preview State (Propietarios & Arrendatarios)
  const [portalPreviewMode, setPortalPreviewMode] = useState<'owner' | 'tenant'>('owner');
  const [copiedLinkNotice, setCopiedLinkNotice] = useState<string | null>(null);

  // Contracts State
  const [contracts, setContracts] = useState<AgencyRentalContract[]>(MOCK_AGENCY_CONTRACTS);
  const [isAddingContract, setIsAddingContract] = useState(false);

  // New Contract Form State
  const [newAddress, setNewAddress] = useState('');
  const [newCommune, setNewCommune] = useState('Las Condes, RM');
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantRut, setNewTenantRut] = useState('');
  const [newTenantPhone, setNewTenantPhone] = useState('+56 9 ');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newOwnerRut, setNewOwnerRut] = useState('');
  const [newOwnerBank, setNewOwnerBank] = useState('Banco de Chile');
  const [newRentCLP, setNewRentCLP] = useState(750000);
  const [newCommissionPct, setNewCommissionPct] = useState(8.0);
  const [newReadjustment, setNewReadjustment] = useState<'IPC Semestral' | 'IPC Anual' | 'UF Diaria' | 'Fijo'>('IPC Semestral');

  // Tickets State
  const [tickets, setTickets] = useState<AgencyMaintenanceTicket[]>(MOCK_AGENCY_TICKETS);
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [newTicketAddress, setNewTicketAddress] = useState(MOCK_AGENCY_CONTRACTS[0].propertyAddress);
  const [newTicketTenant, setNewTicketTenant] = useState(MOCK_AGENCY_CONTRACTS[0].tenantName);
  const [newTicketCategory, setNewTicketCategory] = useState<'Gasfitería' | 'Electricidad' | 'Remodelación' | 'Climatización' | 'Cerrajería'>('Gasfitería');
  const [newTicketDesc, setNewTicketDesc] = useState('');
  const [newTicketCost, setNewTicketCost] = useState(40000);

  // Settlements Interactive State
  const [selectedContractId, setSelectedContractId] = useState<string>(MOCK_AGENCY_CONTRACTS[0].id);
  const [settlementMaintenanceDeduction, setSettlementMaintenanceDeduction] = useState(35000);
  const [settlementExpensesDeduction, setSettlementExpensesDeduction] = useState(0);
  const [settlementSuccessMsg, setSettlementSuccessMsg] = useState(false);

  // Sales Pipeline State
  const [sales, setSales] = useState<AgencySalePipeline[]>(MOCK_AGENCY_SALES);

  // Selected Contract for Settlement
  const activeSettlementContract = contracts.find(c => c.id === selectedContractId) || contracts[0];

  const formatCLP = (val: number) => {
    return '$' + Math.round(val).toLocaleString('es-CL');
  };

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim() || !newTenantName.trim()) return;

    const created: AgencyRentalContract = {
      id: 'cnt-' + Date.now(),
      propertyAddress: newAddress,
      commune: newCommune,
      tenantName: newTenantName,
      tenantRut: newTenantRut || '18.123.456-7',
      tenantPhone: newTenantPhone || '+56 9 9989 9421',
      ownerName: newOwnerName || 'Propietario Registrado',
      ownerRut: newOwnerRut || '12.345.678-9',
      ownerBank: newOwnerBank,
      ownerAccountNumber: 'Cta Cte Principal',
      rentAmountCLP: Number(newRentCLP),
      rentAmountUF: Number((newRentCLP / 38000).toFixed(1)),
      readjustment: newReadjustment,
      dueDay: 5,
      commissionPercent: Number(newCommissionPct),
      status: 'al_dia',
      contractStart: '01 Nov 2026',
      contractEnd: '31 Oct 2027'
    };

    setContracts([created, ...contracts]);
    setIsAddingContract(false);
    setNewAddress('');
    setNewTenantName('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketDesc.trim()) return;

    const createdTicket: AgencyMaintenanceTicket = {
      id: 'tck-' + Date.now(),
      propertyAddress: newTicketAddress,
      tenantName: newTicketTenant,
      category: newTicketCategory,
      description: newTicketDesc,
      costEstimateCLP: Number(newTicketCost),
      status: 'tecnico_asignado',
      assignedTechnician: `${newTicketCategory === 'Gasfitería' ? 'Eduardo Morales' : 'Héctor Valenzuela'} (Sello Melsa SEC)`,
      createdAt: 'Hoy'
    };

    setTickets([createdTicket, ...tickets]);
    setIsAddingTicket(false);
    setNewTicketDesc('');
  };

  const handleMarkPaid = (contractId: string) => {
    setContracts(contracts.map(c => c.id === contractId ? { ...c, status: 'pagado', lastPaymentDate: 'Hoy' } : c));
  };

  const handleChangePlan = (planId: AgencyPlanTier) => {
    setCurrentPlan(planId);
    setPlanChangeAlert(`¡Plan actualizado con éxito a ${planId.toUpperCase()}! Los nuevos límites ya están vigentes.`);
    setTimeout(() => setPlanChangeAlert(null), 4000);
  };

  // Calculations for Settlement
  const grossRent = activeSettlementContract ? activeSettlementContract.rentAmountCLP : 0;
  const commissionVal = activeSettlementContract ? Math.round(grossRent * (activeSettlementContract.commissionPercent / 100)) : 0;
  const netLiquidTransfer = Math.max(0, grossRent - commissionVal - settlementMaintenanceDeduction - settlementExpensesDeduction);

  const activePlanDetails = AGENCY_SAAS_PLANS.find(p => p.id === currentPlan) || AGENCY_SAAS_PLANS[2];

  // Aggregated KPI Totals
  const totalRentalsCLP = contracts.reduce((acc, c) => acc + c.rentAmountCLP, 0);
  const totalCommissionsEstCLP = contracts.reduce((acc, c) => acc + Math.round(c.rentAmountCLP * (c.commissionPercent / 100)), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* 1. AGENCY HERO BANNER & PLAN STATUS */}
      <div className="bg-gradient-to-r from-[#0F1115] via-[#1A1E27] to-[#0F1115] rounded-3xl p-6 sm:p-8 text-white border border-gray-800 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#D02126]/20 text-[#D02126] border border-[#D02126]/30">
                MELSA Agency OS • Suite Inmobiliaria
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 text-emerald-400 border border-white/10">
                Plan {activePlanDetails.name} ({activePlanDetails.priceFormatted} CLP/mes)
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-title tracking-tight">
              {currentUser.companyName || currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl font-light">
              Panel centralizado de administración de arriendos, liquidaciones a propietarios, cobranza automática y servicio técnico integrado con Sello Melsa.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-xl font-black text-white block mb-0.5">{contracts.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Arriendos Activos</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-xl font-black text-emerald-400 block mb-0.5">{formatCLP(totalRentalsCLP)}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Canon Mensual</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-xl font-black text-[#D02126] block mb-0.5">{formatCLP(totalCommissionsEstCLP)}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Comisión Agencia</span>
            </div>

            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl text-center backdrop-blur-xs">
              <span className="text-xl font-black text-amber-400 block mb-0.5">{tickets.length}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Mantenciones Sello</span>
            </div>
          </div>

        </div>

        {planChangeAlert && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{planChangeAlert}</span>
          </div>
        )}
      </div>

      {/* 2. SUB-NAVIGATION TABS FOR AGENCY */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('rentals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'rentals'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <Building2 className="w-4 h-4 text-[#D02126]" />
          <span>Contratos de Arriendo ({contracts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settlement')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'settlement'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <span>Liquidación a Propietarios</span>
        </button>

        <button
          onClick={() => setActiveTab('portals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'portals'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <Users className="w-4 h-4 text-purple-500" />
          <span>Portales para Clientes (Dueño & Inquilino)</span>
        </button>

        <button
          onClick={() => setActiveTab('maintenance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'maintenance'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-500" />
          <span>Reparaciones Sello Melsa ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sales'
              ? 'bg-[#0F1115] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-blue-500" />
          <span>CRM de Ventas & Comisiones ({sales.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'plans'
              ? 'bg-[#D02126] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100 hover:text-[#D02126]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Mi Plan & Precios</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TAB 1: CONTRATOS DE ARRIENDO & REAJUSTES IPC/UF                   */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif-title">
                Cartera de Arriendos Administrados
              </h2>
              <p className="text-xs text-gray-500">
                Monitorea el canon mensual, el estado de pago, el vencimiento y los reajustes estipulados por contrato.
              </p>
            </div>

            <button
              onClick={() => setIsAddingContract(true)}
              className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Nuevo Contrato de Arriendo</span>
            </button>
          </div>

          {/* Form Modal for New Contract */}
          {isAddingContract && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#D02126]/30 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-200">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#D02126]" />
                  <span>Alta de Nuevo Contrato de Arriendo</span>
                </h3>
                <button 
                  onClick={() => setIsAddingContract(false)}
                  className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateContract} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Dirección de la Propiedad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Av. El Golf 200, Depto 1002"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Comuna / Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={newCommune}
                    onChange={(e) => setNewCommune(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Canon Arriendo Mensual (CLP) *</label>
                  <input
                    type="number"
                    required
                    value={newRentCLP}
                    onChange={(e) => setNewRentCLP(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nombre del Arrendatario *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre completo"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">RUT Arrendatario</label>
                  <input
                    type="text"
                    placeholder="12.345.678-9"
                    value={newTenantRut}
                    onChange={(e) => setNewTenantRut(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">WhatsApp Arrendatario</label>
                  <input
                    type="text"
                    value={newTenantPhone}
                    onChange={(e) => setNewTenantPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Nombre Propietario (Dueño)</label>
                  <input
                    type="text"
                    placeholder="Razón Social o Nombre"
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Banco Propietario</label>
                  <input
                    type="text"
                    value={newOwnerBank}
                    onChange={(e) => setNewOwnerBank(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipo de Reajuste</label>
                  <select
                    value={newReadjustment}
                    onChange={(e) => setNewReadjustment(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
                  >
                    <option value="IPC Semestral">IPC Semestral (INE)</option>
                    <option value="IPC Anual">IPC Anual (INE)</option>
                    <option value="UF Diaria">UF Diaria</option>
                    <option value="Fijo">Fijo sin reajuste</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingContract(false)}
                    className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white font-bold shadow-md cursor-pointer"
                  >
                    Guardar Contrato en Cartera
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table of Contracts */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F8] text-gray-600 uppercase text-[10px] font-bold tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Propiedad</th>
                    <th className="py-3 px-4">Arrendatario & RUT</th>
                    <th className="py-3 px-4">Canon / Reajuste</th>
                    <th className="py-3 px-4">Comisión Agencia</th>
                    <th className="py-3 px-4">Estado Cobro</th>
                    <th className="py-3 px-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contracts.map((contract) => {
                    const commissionCLP = Math.round(contract.rentAmountCLP * (contract.commissionPercent / 100));

                    return (
                      <tr key={contract.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-gray-900 block">{contract.propertyAddress}</span>
                          <span className="text-[11px] text-gray-500 block">{contract.commune}</span>
                          <span className="text-[10px] text-gray-400">Dueño: {contract.ownerName}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-gray-800 block">{contract.tenantName}</span>
                          <span className="text-[11px] text-gray-500 block">{contract.tenantRut}</span>
                          <a 
                            href={`https://wa.me/${contract.tenantPhone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(contract.tenantName)},%20te%20escribimos%20de%20la%20administraci%C3%B3n%20para%20recordar%20el%20arriendo%20de%20este%20mes.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-600 hover:underline font-medium"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-gray-900 block text-sm">{formatCLP(contract.rentAmountCLP)}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-medium inline-block mt-0.5">
                            {contract.readjustment}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-[#D02126] block">{formatCLP(commissionCLP)}</span>
                          <span className="text-[10px] text-gray-400">({contract.commissionPercent}% mensual)</span>
                        </td>

                        <td className="py-3.5 px-4">
                          {contract.status === 'pagado' || contract.status === 'al_dia' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              ✓ Pagado al Día
                            </span>
                          ) : contract.status === 'por_vencer' ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                              ⏱ Vence Día {contract.dueDay}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                              ⚠ Moroso
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedContractId(contract.id);
                              setActiveTab('settlement');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-[#D02126] hover:text-white text-gray-700 text-[11px] font-bold transition-all cursor-pointer"
                            title="Generar liquidación oficial para el dueño"
                          >
                            Liquidar
                          </button>
                          {contract.status !== 'pagado' && (
                            <button
                              onClick={() => handleMarkPaid(contract.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-200 text-[11px] font-bold transition-all cursor-pointer"
                              title="Marcar pago recibido por transferencia"
                            >
                              Marcar Pagado
                            </button>
                          )}
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

      {/* ----------------------------------------------------------------- */}
      {/* TAB 2: LIQUIDACIÓN AL PROPIETARIO EN 1 CLIC                       */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'settlement' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D02126] block mb-1">
                Motor de Liquidación Oficial
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-title text-gray-900">
                Calcular Liquidación al Dueño
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Selecciona la propiedad administrada para descontar comisiones y reparaciones automáticamente.
              </p>
            </div>

            {/* Select Contract */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Propiedad a Liquidar:</label>
              <select
                value={selectedContractId}
                onChange={(e) => setSelectedContractId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#D02126] outline-none"
              >
                {contracts.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.propertyAddress} ({formatCLP(c.rentAmountCLP)} - Dueño: {c.ownerName})
                  </option>
                ))}
              </select>
            </div>

            {/* Inputs for Deductions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Mantención Sello Melsa a descontar:
                </label>
                <input
                  type="number"
                  value={settlementMaintenanceDeduction}
                  onChange={(e) => setSettlementMaintenanceDeduction(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-red-600 font-bold focus:ring-2 focus:ring-[#D02126] outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Respaldo: Boleta o Factura de técnico</span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Gastos Comunes / Contribuciones:
                </label>
                <input
                  type="number"
                  value={settlementExpensesDeduction}
                  onChange={(e) => setSettlementExpensesDeduction(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-red-600 font-bold focus:ring-2 focus:ring-[#D02126] outline-none"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">Si la agencia los paga en nombre del dueño</span>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-800 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Datos de Transferencia Bancaria Registrados:</span>
              </span>
              <p>Dueño: <strong className="text-gray-900">{activeSettlementContract.ownerName}</strong> ({activeSettlementContract.ownerRut})</p>
              <p>Banco: <strong className="text-gray-900">{activeSettlementContract.ownerBank}</strong> • {activeSettlementContract.ownerAccountNumber}</p>
            </div>

          </div>

          {/* Receipt Preview Voucher */}
          <div className="lg:col-span-6 bg-gradient-to-b from-white to-[#FAF9F8] p-6 sm:p-8 rounded-3xl border-2 border-gray-300 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D02126] block">
                    {currentUser.companyName || 'Agencia Inmobiliaria'}
                  </span>
                  <h3 className="text-lg font-bold font-serif-title text-gray-900">
                    Comprobante de Liquidación de Arriendo
                  </h3>
                  <span className="text-xs text-gray-500">Período: Noviembre 2026 • Folio #LIQ-2026-118</span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-lg border border-emerald-300">
                  Listo para Transferir
                </span>
              </div>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between py-1.5 border-b border-gray-100 text-gray-700">
                  <span>Inmueble:</span>
                  <span className="font-semibold text-gray-900">{activeSettlementContract.propertyAddress}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100 text-gray-700">
                  <span>Canon de Arriendo Recaudado (+):</span>
                  <span className="font-bold text-gray-900 text-sm">{formatCLP(grossRent)}</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-gray-100 text-red-600">
                  <span>Honorarios de Administración ({activeSettlementContract.commissionPercent}%):</span>
                  <span className="font-bold">- {formatCLP(commissionVal)}</span>
                </div>

                {settlementMaintenanceDeduction > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-gray-100 text-red-600">
                    <span>Deducción Reparación Técnica (Sello Melsa):</span>
                    <span className="font-bold">- {formatCLP(settlementMaintenanceDeduction)}</span>
                  </div>
                )}

                {settlementExpensesDeduction > 0 && (
                  <div className="flex justify-between py-1.5 border-b border-gray-100 text-red-600">
                    <span>Otros Gastos Imputables:</span>
                    <span className="font-bold">- {formatCLP(settlementExpensesDeduction)}</span>
                  </div>
                )}

                <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 mt-4 flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-900 block">Total Líquido a Transferir:</span>
                    <span className="text-[10px] text-emerald-700">Al Propietario en su Cta Cte</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-700">
                    {formatCLP(netLiquidTransfer)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  setSettlementSuccessMsg(true);
                  setTimeout(() => setSettlementSuccessMsg(false), 4000);
                }}
                className="w-full bg-[#0F1115] hover:bg-black text-white text-xs font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D02126]" />
                <span>Emitir Liquidación PDF & Enviar a Dueño</span>
              </button>

              {settlementSuccessMsg && (
                <p className="text-xs text-center text-emerald-600 font-bold mt-2 animate-in fade-in">
                  ✓ Comprobante generado con éxito y enviado al correo del propietario con respaldo tributario.
                </p>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 3: PORTALES DE CLIENTES (PROPIETARIO & ARRENDATARIO)          */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'portals' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Header Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                  Tecnología para Clientes
                </span>
                <h2 className="text-lg font-bold text-gray-900 font-serif-title">
                  Portales de Auto-Atención para Propietarios e Inquilinos
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Entrega acceso transparente 24/7 sin llamadas ni correos repetitivos. Cada cliente cuenta con su propio enlace seguro y personalizado.
              </p>
            </div>

            {/* Toggle Preview Mode */}
            <div className="flex p-1 bg-gray-100 rounded-2xl shrink-0">
              <button
                type="button"
                onClick={() => setPortalPreviewMode('owner')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portalPreviewMode === 'owner'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#D02126]" />
                <span>Portal Propietario</span>
              </button>

              <button
                type="button"
                onClick={() => setPortalPreviewMode('tenant')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  portalPreviewMode === 'tenant'
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Users className="w-4 h-4 text-purple-600" />
                <span>Portal Arrendatario</span>
              </button>
            </div>
          </div>

          {/* Shareable Link Bar */}
          <div className="bg-[#FAF9F8] p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-semibold text-gray-800">
                Enlace seguro {portalPreviewMode === 'owner' ? 'para el Dueño' : 'para el Arrendatario'}:
              </span>
              <code className="bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-[11px] font-mono text-[#D02126]">
                {portalPreviewMode === 'owner' 
                  ? 'https://melsa.cl/portal/propietario/gonzalo-matte-p-604'
                  : 'https://melsa.cl/portal/arrendatario/camila-larrain-a-604'}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCopiedLinkNotice('¡Enlace copiado al portapapeles!');
                  setTimeout(() => setCopiedLinkNotice(null), 3000);
                }}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs transition-all cursor-pointer"
              >
                Copiar Enlace
              </button>
              <a
                href={`https://wa.me/56999899421?text=Hola,%20te%20comparto%20el%20acceso%20a%20tu%20portal%20inmobiliario%20de%20administraci%C3%B3n`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Enviar por WhatsApp</span>
              </a>
            </div>
          </div>

          {copiedLinkNotice && (
            <p className="text-xs text-center text-emerald-600 font-bold animate-in fade-in">
              ✓ {copiedLinkNotice}
            </p>
          )}

          {/* SIMULATED CLIENT PORTAL SCREEN */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden">
            
            {/* Fake Browser Window Top Header */}
            <div className="bg-[#0F1115] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-gray-300 font-mono hidden sm:inline">
                  {portalPreviewMode === 'owner' 
                    ? 'melsa.cl/portal/propietario • Vista Dueño' 
                    : 'melsa.cl/portal/arrendatario • Vista Inquilino'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#D02126] bg-white/10 px-2.5 py-1 rounded-lg">
                Agencia: {currentUser.companyName || 'Andes Propiedades SpA'}
              </span>
            </div>

            {/* A. OWNER PORTAL VIEW */}
            {portalPreviewMode === 'owner' ? (
              <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#FAF9F8] to-white">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-400 block">Portal Privado del Propietario</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-gray-900 mt-1">
                      Gonzalo Matte Pérez
                    </h3>
                    <span className="text-xs text-gray-500">RUT: 11.450.823-2 • Cuenta activa en Andes Propiedades</span>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Estado Arriendo Noviembre</span>
                    <span className="text-sm font-black text-emerald-700">✓ Arriendo Pagado al Día</span>
                  </div>
                </div>

                {/* Property Card in Owner Portal */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Inmueble Administrado</span>
                    <h4 className="font-bold text-gray-900 text-sm">Av. Vitacura 4820, Depto 604</h4>
                    <span className="text-xs text-gray-500">Vitacura, Región Metropolitana</span>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                      <span className="text-gray-500">Inquilina:</span>
                      <strong className="text-gray-800">Camila Larraín</strong>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Renta Mensual Pactada</span>
                    <h4 className="font-black text-gray-900 text-lg">$1.150.000 CLP</h4>
                    <span className="text-xs text-gray-500">Reajuste por UF Diaria (~30.2 UF)</span>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                      <span className="text-gray-500">Contrato:</span>
                      <strong className="text-emerald-700">Vigente a Dic 2026</strong>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Transferencia Líquida Mes</span>
                    <h4 className="font-black text-emerald-600 text-lg">$1.058.000 CLP</h4>
                    <span className="text-xs text-gray-500">Banco Santander Cta Cte</span>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-xs">
                      <span className="text-gray-500">Comisión 8%:</span>
                      <strong className="text-gray-800">- $92.000 CLP</strong>
                    </div>
                  </div>
                </div>

                {/* History of Monthly Settlements in Owner Portal */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                  <h4 className="font-bold text-gray-900 text-sm mb-3">Historial de Liquidaciones & Comprobantes Oficiales</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#D02126]" />
                        <div>
                          <span className="font-bold text-gray-800 block">Liquidación Noviembre 2026</span>
                          <span className="text-[11px] text-gray-400">Transferido el 06/11/2026 • Monto líquido: $1.058.000</span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center gap-1 text-[11px]">
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PDF</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#D02126]" />
                        <div>
                          <span className="font-bold text-gray-800 block">Liquidación Octubre 2026</span>
                          <span className="text-[11px] text-gray-400">Transferido el 06/10/2026 • Monto líquido: $1.058.000</span>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-100 flex items-center gap-1 text-[11px]">
                        <Download className="w-3.5 h-3.5" />
                        <span>Descargar PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* B. TENANT PORTAL VIEW */
              <div className="p-6 sm:p-8 space-y-6 bg-gradient-to-b from-[#FAF9F8] to-white">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-400 block">Portal Privado del Arrendatario</span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif-title text-gray-900 mt-1">
                      Camila Larraín Echenique
                    </h3>
                    <span className="text-xs text-gray-500">Inmueble: Av. Vitacura 4820, Depto 604 • Administra: Andes Propiedades</span>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-right">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Próximo Vencimiento</span>
                    <span className="text-sm font-black text-amber-900">05 de Diciembre 2026</span>
                  </div>
                </div>

                {/* Tenant Payment Card */}
                <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-purple-700 block mb-1">Monto a Pagar del Mes</span>
                    <h4 className="text-3xl font-black text-gray-900">$1.150.000 CLP</h4>
                    <p className="text-xs text-gray-500 mt-1">Canon mensual equivalente a 30.2 UF calculada al día.</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>Pagar con Webpay Plus</span>
                    </button>
                    <button className="px-5 py-3 rounded-xl bg-[#0F1115] hover:bg-black text-white font-bold text-xs shadow-md flex items-center justify-center gap-2">
                      <span>Pagar con Transferencia (Khipu)</span>
                    </button>
                  </div>
                </div>

                {/* Tenant Service Request (Sello Melsa) */}
                <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-6 border border-red-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D02126] text-white flex items-center justify-center shrink-0">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">¿Problemas o averías en el departamento?</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Reporta filtraciones de agua, fallas eléctricas o cerrajería. Asignamos técnicos auditados con Sello Melsa con garantía.
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab('maintenance')}
                    className="px-4 py-2.5 rounded-xl bg-[#D02126] hover:bg-[#B81B1F] text-white text-xs font-bold shrink-0 shadow-sm transition-all"
                  >
                    + Reportar Avería
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 4: REPARACIONES & TICKET TÉCNICO SELLO MELSA (DIFERENCIADOR)  */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D02126] text-white uppercase">
                  Exclusivo Melsa
                </span>
                <h2 className="text-lg font-bold text-gray-900 font-serif-title">
                  Helpdesk de Reparaciones para Inmuebles en Arriendo
                </h2>
              </div>
              <p className="text-xs text-gray-500">
                Coordina visitas de gasfitería SEC, electricidad o cerrajería con técnicos auditados. El valor se descuenta automáticamente de la liquidación del propietario con boleta legal.
              </p>
            </div>

            <button
              onClick={() => setIsAddingTicket(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0F1115] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#D02126]" />
              <span>+ Solicitar Técnico Sello Melsa</span>
            </button>
          </div>

          {/* New Ticket Form Modal */}
          {isAddingTicket && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-200 text-xs">
              <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-500" />
                  <span>Reportar Avería & Asignar Especialista Melsa</span>
                </h3>
                <button 
                  onClick={() => setIsAddingTicket(false)}
                  className="text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTicket} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Propiedad con Problema *</label>
                  <select
                    value={newTicketAddress}
                    onChange={(e) => {
                      setNewTicketAddress(e.target.value);
                      const match = contracts.find(c => c.propertyAddress === e.target.value);
                      if (match) setNewTicketTenant(match.tenantName);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 outline-none"
                  >
                    {contracts.map(c => (
                      <option key={c.id} value={c.propertyAddress}>{c.propertyAddress}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Rubro de la Reparación *</label>
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value as any)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 outline-none font-bold text-[#D02126]"
                  >
                    <option value="Gasfitería">Gasfitería & Fugas (SEC)</option>
                    <option value="Electricidad">Electricidad & Tableros (SEC)</option>
                    <option value="Remodelación">Remodelación & Pintura</option>
                    <option value="Climatización">Climatización & Calefont</option>
                    <option value="Cerrajería">Cerrajería de Urgencia</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Descripción del Problema Reportado por el Inquilino *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Ej. Filtración bajo lavaplatos o diferencial de cocina salta constantemente."
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Presupuesto Estimado Diagnóstico (CLP)</label>
                  <input
                    type="number"
                    value={newTicketCost}
                    onChange={(e) => setNewTicketCost(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-900 outline-none"
                  />
                </div>

                <div className="flex items-center text-xs text-gray-600">
                  <span className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                    Se coordinará visita técnica auditada en menos de 24 horas hábiles.
                  </span>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddingTicket(false)}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-[#0F1115] hover:bg-black text-white font-bold cursor-pointer"
                  >
                    Asignar Especialista Melsa
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tickets.map((tck) => (
              <div key={tck.id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#D02126] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                      {tck.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{tck.createdAt}</span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm mt-2">{tck.propertyAddress}</h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{tck.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Técnico Sello Melsa:</span>
                    <span className="font-semibold text-gray-800">{tck.assignedTechnician || 'Buscando en red...'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Costo Imputable:</span>
                    <span className="font-bold text-red-600">{formatCLP(tck.costEstimateCLP)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 4: CRM DE VENTAS & COMISIONES                                 */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif-title">
                Pipeline Visual de Compraventas & Comisiones
              </h2>
              <p className="text-xs text-gray-500">
                Sigue las etapas de cierre de tus propiedades en venta y calcula los honorarios brutos y líquidos de tu equipo.
              </p>
            </div>
          </div>

          {/* Kanban Stages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {['visitas', 'oferta', 'promesa', 'escritura'].map((stageKey) => {
              const stageLabels: { [k: string]: string } = {
                visitas: 'Visitas & Calificación',
                oferta: 'Orden de Oferta',
                promesa: 'Promesa Firmada',
                escritura: 'Escritura & Entrega'
              };

              const itemsInStage = sales.filter(s => s.stage === stageKey);

              return (
                <div key={stageKey} className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-gray-800 uppercase text-[11px] tracking-wider">
                      {stageLabels[stageKey]}
                    </span>
                    <span className="w-5 h-5 rounded-full bg-white text-gray-700 font-bold text-[10px] flex items-center justify-center border border-gray-200">
                      {itemsInStage.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {itemsInStage.map((deal) => (
                      <div key={deal.id} className="bg-white rounded-xl p-3.5 border border-gray-200 shadow-2xs space-y-2">
                        <span className="font-bold text-gray-900 block leading-snug">{deal.propertyTitle}</span>
                        <div className="flex justify-between text-[11px] text-gray-600">
                          <span>Valor:</span>
                          <span className="font-bold text-[#D02126]">{deal.priceUF} UF</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                          <span>Comisión 2%:</span>
                          <span className="font-bold">{formatCLP(deal.commissionEstCLP)}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 pt-1 border-t border-gray-100 flex justify-between">
                          <span>Agente: {deal.agentName}</span>
                          <span>{deal.buyerCandidate}</span>
                        </div>
                      </div>
                    ))}

                    {itemsInStage.length === 0 && (
                      <p className="text-[11px] text-gray-400 text-center py-6 italic">Sin operaciones en esta etapa</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 5: PLANES & PRECIOS ("MENOS ES MÁS")                         */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'plans' && (
        <div className="space-y-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-[#D02126] uppercase tracking-wider block mb-1">
              Transparencia Absoluta • Sin Letra Chica
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif-title text-gray-900">
              Planes de Suscripción para Agencias
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Tu plan actual es <strong className="text-gray-900 uppercase">{currentPlan}</strong>. Puedes cambiar o cancelar cuando quieras en 1 clic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {AGENCY_SAAS_PLANS.map((plan) => {
              const isCurrent = currentPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 relative ${
                    isCurrent 
                      ? 'bg-white border-2 border-[#D02126] shadow-xl shadow-red-500/10' 
                      : 'bg-white border border-gray-200 hover:border-gray-300 shadow-xs'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#D02126] text-white uppercase tracking-wider shadow-xs">
                      Tu Plan Activo
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-[11px] text-gray-500 mb-4 min-h-[30px] leading-relaxed">{plan.description}</p>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-black text-gray-900">{plan.priceFormatted}</span>
                      <span className="text-xs font-semibold text-gray-400">CLP</span>
                    </div>
                    <span className="text-[10px] text-gray-400 block mb-4">{plan.billingPeriod}</span>

                    <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-xs font-bold text-gray-800 mb-4">
                      {plan.propertiesLimit}
                    </div>

                    <div className="space-y-2.5 mb-6 text-xs text-gray-600">
                      {plan.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px]">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleChangePlan(plan.id)}
                    disabled={isCurrent}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : plan.id === 'pro'
                        ? 'bg-[#0F1115] hover:bg-black text-white'
                        : 'bg-[#D02126] hover:bg-[#B81B1F] text-white shadow-xs'
                    }`}
                  >
                    {isCurrent ? 'Plan Seleccionado' : `Cambiar a ${plan.name}`}
                  </button>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
