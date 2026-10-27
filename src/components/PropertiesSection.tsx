import React, { useState } from 'react';
import { Property } from '../types';
import { TEAM_MEMBERS } from '../data/mockData';
import { MapPin, Bed, Bath, Maximize2, Key } from 'lucide-react';

interface PropertiesSectionProps {
  onOpenAdvisory: (agentId?: string) => void;
}

export const PROPERTIES_LIST: Property[] = [
  {
    id: 'prop-1',
    title: 'Penthouse Exclusivo con Terraza Privada',
    code: 'MEL-801',
    type: 'Penthouse',
    operation: 'Venta',
    location: 'El Golf, Las Condes',
    priceUSD: 420000,
    bedrooms: 3,
    bathrooms: 3,
    areaM2: 210,
    parking: 2,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000',
    agentId: 'jeniffer-mella',
    featured: true
  },
  {
    id: 'prop-2',
    title: 'Casa Mediterránea en Condominio Privado',
    code: 'MEL-402',
    type: 'Casa',
    operation: 'Venta',
    location: 'La Dehesa Norte',
    priceUSD: 680000,
    bedrooms: 4,
    bathrooms: 4,
    areaM2: 380,
    parking: 3,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    agentId: 'alexis-santana',
    featured: true
  },
  {
    id: 'prop-3',
    title: 'Departamento Vista Mar Primordial',
    code: 'MEL-109',
    type: 'Departamento',
    operation: 'Venta',
    location: 'Reñaca Costa, Viña del Mar',
    priceUSD: 295000,
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 115,
    parking: 1,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000',
    agentId: 'jeniffer-mella',
    featured: true
  }
];

export const PropertiesSection: React.FC<PropertiesSectionProps> = ({ onOpenAdvisory }) => {
  const [activeType, setActiveType] = useState<string>('Todos');

  const filteredProperties = PROPERTIES_LIST.filter(
    (p) => activeType === 'Todos' || p.type === activeType
  );

  return (
    <section id="propiedades" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D02126]/10 text-[#D02126] text-xs font-semibold uppercase tracking-wider mb-3">
              <Key className="w-3.5 h-3.5 text-[#D02126]" />
              <span>Propiedades Seleccionadas</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#0F1115] font-normal tracking-tight">
              Cartera de Propiedades
            </h2>
          </div>

          {/* Quick Filter */}
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            {['Todos', 'Penthouse', 'Casa', 'Departamento'].map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeType === type
                    ? 'bg-[#0F1115] text-white shadow-sm'
                    : 'bg-[#FAF9F8] text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => {
            const agent = TEAM_MEMBERS.find((a) => a.id === prop.agentId);

            return (
              <div
                key={prop.id}
                className="bg-[#FAF9F8] rounded-2xl overflow-hidden border border-gray-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:border-[#D02126]/30"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-[#0F1115] text-white text-xs font-bold px-3 py-1 rounded-full">
                      {prop.operation} • {prop.code}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <h3 className="text-lg font-serif text-[#0F1115] font-semibold mb-2 group-hover:text-[#D02126] transition-colors">
                      {prop.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-4">
                      <MapPin className="w-3.5 h-3.5 text-[#D02126]" />
                      <span>{prop.location}</span>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-600 text-center mb-4">
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 font-normal">Dorms</span>
                        <span className="font-semibold text-[#0F1115] flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-[#D02126]" /> {prop.bedrooms}
                        </span>
                      </div>
                      <div className="flex flex-col items-center border-x border-gray-100">
                        <span className="text-gray-400 font-normal">Baños</span>
                        <span className="font-semibold text-[#0F1115] flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5 text-[#D02126]" /> {prop.bathrooms}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-gray-400 font-normal">Área</span>
                        <span className="font-semibold text-[#0F1115] flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-[#D02126]" /> {prop.areaM2} m²
                        </span>
                      </div>
                    </div>

                    {/* Agent badge */}
                    {agent && (
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-200/60 text-xs">
                        <img
                          src={agent.photoUrl}
                          alt={agent.name}
                          className="w-7 h-7 rounded-full object-cover border border-[#D02126]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-gray-500 font-medium">Asesor asignado:</span>
                        <span className="font-semibold text-[#0F1115]">{agent.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-gray-200/50">
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block">Valor</span>
                    <span className="text-xl font-bold text-[#0F1115]">
                      ${prop.priceUSD.toLocaleString('en-US')} USD
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenAdvisory(prop.agentId)}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-[#0F1115] hover:bg-[#D02126] transition-colors"
                  >
                    Consultar
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
