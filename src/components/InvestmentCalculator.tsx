import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, PieChart, Shield, Info } from 'lucide-react';

export const InvestmentCalculator: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<number>(200000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanYears, setLoanYears] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(4.8);
  const [projectedAppreciationRate, setProjectedAppreciationRate] = useState<number>(14);

  // Financial Calculations
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPaymentAmount;
  
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalMonths = loanYears * 12;
  
  const monthlyPayment =
    monthlyInterestRate > 0
      ? (loanAmount *
          (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalMonths))) /
        (Math.pow(1 + monthlyInterestRate, totalMonths) - 1)
      : loanAmount / totalMonths;

  // 5 Year Appreciation
  const projected5YearValue = propertyPrice * Math.pow(1 + projectedAppreciationRate / 100, 5);
  const estimatedGain = projected5YearValue - propertyPrice;

  return (
    <section className="py-20 bg-[#FAF8F5] relative border-t border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#A27E3A] text-xs font-semibold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Herramienta Financiera</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0F2042] font-normal tracking-tight mb-4">
            Simulador de Crédito & Plusvalía
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-light leading-relaxed">
            Calcula una estimación rápida del dividendo mensual y la rentabilidad por plusvalía proyectada para tu próxima inversión con Melsa.
          </p>
        </div>

        {/* Interactive Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5E0D8] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Property Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Valor estimado de la propiedad
                </label>
                <span className="text-lg font-bold text-[#0F2042]">
                  ${propertyPrice.toLocaleString('en-US')} USD
                </span>
              </div>
              <input
                type="range"
                min={80000}
                max={800000}
                step={5000}
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>$80,000 USD</span>
                <span>$800,000 USD</span>
              </div>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Pie / Enganche ({downPaymentPercent}%)
                </label>
                <span className="text-sm font-semibold text-[#A27E3A]">
                  ${downPaymentAmount.toLocaleString('en-US')} USD
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
              />
            </div>

            {/* Grid for Duration & Interest */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Plazo del Crédito
                </label>
                <select
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0F2042]"
                >
                  <option value={15}>15 Años</option>
                  <option value={20}>20 Años</option>
                  <option value={25}>25 Años</option>
                  <option value={30}>30 Años</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                  Tasa de Interés Estimada (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="2.0"
                  max="10.0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0F2042]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#FAF8F5] p-3 rounded-xl border border-gray-100">
              <Info className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>
                Valores referenciales. En Melsa gestionamos asesoría de financiamiento directo con bancos y mutuo hipotecario.
              </span>
            </div>

          </div>

          {/* Results Display Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#0F2042] text-white p-6 sm:p-8 rounded-2xl border border-[#C5A059]/40 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs text-[#DFC287] font-semibold uppercase tracking-wider block mb-1">
                Dividendo Mensual Estimado
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold melsa-text-gold-gradient mb-2">
                ${Math.round(monthlyPayment).toLocaleString('en-US')} <span className="text-base font-sans font-normal text-white">USD/mes</span>
              </div>
              <p className="text-xs text-gray-300 font-light">
                Monto del crédito a financiar: <strong>${loanAmount.toLocaleString('en-US')} USD</strong>
              </p>
            </div>

            <div className="border-t border-white/15 pt-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C5A059]" />
                  Plusvalía proyectada a 5 años (+14%):
                </span>
                <span className="font-semibold text-[#DFC287]">
                  +${Math.round(estimatedGain).toLocaleString('en-US')} USD
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-300">Valor estimado propiedad en 2031:</span>
                <span className="font-semibold text-white">
                  ${Math.round(projected5YearValue).toLocaleString('en-US')} USD
                </span>
              </div>
            </div>

            <a
              href="#contacto"
              className="w-full py-3.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#DFC287] text-[#0F2042] font-semibold text-sm transition-all text-center block shadow-md"
            >
              Solicitar Evaluación Crediticia Completa
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
