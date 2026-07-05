"use client";

import { Campaign } from "@/domain/entities";
import { useState, useMemo } from "react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Search, MapPin, MessageCircle, Map } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRegionSelection } from "../hooks/useRegionSelection";
import { RNMicroregionsMap } from "./maps/RNMicroregionsMap";

interface CampaignsExplorerProps {
  initialCampaigns: Campaign[];
}

const CATEGORIES = [
  "Todas as Categorias",
  "Alimentação",
  "Saúde",
  "Educação",
  "Animais",
  "Desastres",
  "Moradia",
  "Esporte",
  "Cultura",
  "Meio Ambiente",
  "Outro"
];

const CITIES = ["Todo o RN", "Natal", "Parnamirim", "Mossoró", "Caicó", "Currais Novos", "Pau dos Ferros", "Ceará-Mirim"];

// Mapeamento de Microrregiões para Cidades nos mocks do Lumiar
const REGION_MAPPING: Record<string, string[]> = {
  "Alto Apodi": ["Pau dos Ferros"],
  "Mossoroense": ["Mossoró"],
  "Serras Centrais": [],
  "Caicó": ["Caicó"],
  "Currais Novos": ["Currais Novos"],
  "Litoral Norte": ["Ceará-Mirim"],
  "Agreste": [],
  "Litoral Oriental": ["Natal", "Parnamirim", "Macaíba"]
};

export function CampaignsExplorer({ initialCampaigns }: CampaignsExplorerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias");
  const [selectedCity, setSelectedCity] = useState("Todo o RN");
  const { selectedRegion, handleRegionClick, clearSelection } = useRegionSelection();

  // Calcula estatísticas de campanhas por microrregião oficial do RN
  const regionStats = useMemo(() => {
    const stats: Record<string, number> = {
      "Alto Apodi": 0,
      "Mossoroense": 0,
      "Serras Centrais": 0,
      "Caicó": 0,
      "Currais Novos": 0,
      "Litoral Norte": 0,
      "Agreste": 0,
      "Litoral Oriental": 0
    };

    initialCampaigns.forEach(c => {
      if (c.city === "Mossoró") {
        stats["Mossoroense"]++;
      } else if (c.city === "Caicó") {
        stats["Caicó"]++;
      } else if (c.city === "Currais Novos") {
        stats["Currais Novos"]++;
      } else if (c.city === "Pau dos Ferros") {
        stats["Alto Apodi"]++;
      } else if (c.city === "Ceará-Mirim") {
        stats["Litoral Norte"]++;
      } else if (c.city === "Natal" || c.city === "Parnamirim" || c.city === "Macaíba") {
        stats["Litoral Oriental"]++;
      }
    });

    return stats;
  }, [initialCampaigns]);

  const filteredCampaigns = useMemo(() => {
    return initialCampaigns.filter((campaign) => {
      const matchesSearch = search === "" || 
        campaign.title.toLowerCase().includes(search.toLowerCase()) || 
        campaign.description.toLowerCase().includes(search.toLowerCase());
      
      const matchesCategory = selectedCategory === "Todas as Categorias" || campaign.category === selectedCategory;
      
      let matchesLocation = true;
      if (selectedCity !== "Todo o RN") {
        matchesLocation = campaign.city === selectedCity;
      } else if (selectedRegion) {
        const cities = REGION_MAPPING[selectedRegion] || [];
        matchesLocation = cities.length > 0 ? cities.includes(campaign.city) : false;
      }

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [initialCampaigns, search, selectedCategory, selectedCity, selectedRegion]);

  const onRegionClick = (region: string) => {
    handleRegionClick(region);
    setSelectedCity("Todo o RN"); // Sincroniza limpando filtro de cidade isolada
  };

  const formatTime = (dateString: string) => {
    const d = new Date(dateString);
    const now = new Date();
    const isToday = d.getDate() === now.getDate();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');

    if (isToday) return `Hoje, ${hours}:${minutes}`;
    return `${d.toLocaleDateString('pt-BR')}, ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-8">
      
      {/* Container do Mapa Interativo Potiguar com Imagem Cartográfica Fiel de Fundo */}
      <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] rounded-none">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Mapa do RN: SVG Interativo Oficial */}
          <div className="relative w-full max-w-[500px] aspect-[600/330] shrink-0 border-4 border-black p-1 bg-sky-50 shadow-[3px_3px_0_0_#000] overflow-hidden">
            <RNMicroregionsMap
              selectedRegion={selectedRegion}
              onRegionClick={onRegionClick}
            />
          </div>

          {/* Legenda e Métricas do Filtro */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <Badge className="bg-primary text-black border border-black font-black uppercase text-[10px] mb-1">
                Filtro Regional Cartográfico Fiel
              </Badge>
              <h3 className="font-display text-2xl font-black uppercase tracking-tighter text-black flex items-center gap-2">
                <Map className="w-6 h-6 text-black" /> Divisão por Microrregiões
              </h3>
              <p className="text-xs text-gray-500 font-bold mt-1">
                O mapa de fundo é a projeção geográfica oficial do Rio Grande do Norte (RN). Clique nas microrregiões para filtrar.
              </p>
            </div>

            {/* Listagem em grade das 8 regiões da legenda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
              {[
                { name: "Alto Apodi", color: "bg-[#0284c7]", desc: "Polo Pau dos Ferros" },
                { name: "Mossoroense", color: "bg-[#fef08a]", desc: "Polo Mossoró" },
                { name: "Serras Centrais", color: "bg-[#fbcfe8]", desc: "Região Central" },
                { name: "Caicó", color: "bg-[#94a3b8]", desc: "Polo Caicó (Seridó)" },
                { name: "Currais Novos", color: "bg-[#60a5fa]", desc: "Polo Currais Novos" },
                { name: "Litoral Norte", color: "bg-[#a7f3d0]", desc: "Costeira Norte" },
                { name: "Agreste", color: "bg-[#facc15]", desc: "Agreste Potiguar" },
                { name: "Litoral Oriental", color: "bg-[#f87171]", desc: "Natal e Parnamirim" }
              ].map(reg => {
                const isSelected = selectedRegion === reg.name;
                const count = regionStats[reg.name] || 0;

                return (
                  <div 
                    key={reg.name}
                    onClick={() => handleRegionClick(reg.name)}
                    className={`border-2 border-black p-2.5 rounded-none flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? "bg-green-500 text-white shadow-none" 
                        : "bg-gray-50 hover:bg-gray-100 shadow-[2px_2px_0_0_#000] hover:shadow-none"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 border border-black rounded-none inline-block ${reg.color}`}></span>
                        <span className="uppercase font-black text-xs tracking-tight">{reg.name}</span>
                      </div>
                      <span className={`text-[9px] font-medium block mt-0.5 ${isSelected ? "text-green-100" : "text-gray-400"}`}>
                        {reg.desc}
                      </span>
                    </div>
                    
                    <Badge className={`border border-black font-black font-mono py-0 text-[10px] h-5 ${isSelected ? "bg-white text-green-600" : "bg-white text-black"}`}>
                      {count} {count === 1 ? 'campanha' : 'campanhas'}
                    </Badge>
                  </div>
                );
              })}
            </div>

            {selectedRegion && (
              <div className="flex justify-between items-center bg-green-50 border-2 border-green-600 p-2.5 text-xs font-bold text-green-800">
                <span>Microrregião ativa: <strong className="uppercase">{selectedRegion}</strong></span>
                <button 
                  onClick={clearSelection}
                  className="bg-green-600 text-white font-black px-2.5 py-1 uppercase hover:bg-green-700 active:translate-y-0.5 transition-all text-[10px]"
                >
                  Limpar Região
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar (Dropdowns) */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_#000]">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar campanhas, ONGs, causas..." 
            className="pl-10 h-12 text-lg border-2 border-black focus-visible:ring-black rounded-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select 
          className="h-12 px-4 border-2 border-black bg-white text-lg focus:outline-none focus:ring-2 focus:ring-black min-w-[200px]"
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            if (e.target.value !== "Todo o RN") {
              clearSelection(); // Limpa região se o usuário filtrar por cidade específica no dropdown
            }
          }}
        >
          {CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select 
          className="h-12 px-4 border-2 border-black bg-white text-lg focus:outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Results List */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 border-4 border-black">
          <h3 className="font-display text-2xl font-black uppercase text-gray-500">Nenhuma campanha encontrada</h3>
          <p className="text-gray-400 font-bold mt-2">Tente ajustar seus filtros de busca ou clique em outra região do mapa.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="flex flex-col sm:flex-row bg-white hover:bg-gray-50 transition-colors border-4 border-black rounded-none overflow-hidden shadow-[4px_4px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 transition-all">
              
              {/* Left Side: Image */}
              <div className="relative w-full sm:w-[300px] h-[200px] sm:h-auto shrink-0 border-b-4 sm:border-b-0 sm:border-r-4 border-black group cursor-pointer">
                <Link href={`/campaigns/${campaign.id}`}>
                  <Image 
                    src={campaign.coverImage} 
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <Badge className="absolute top-2 left-2 text-xs border border-black font-black uppercase" variant={campaign.category === 'Educação' ? 'secondary' : 'default'}>
                    {campaign.category}
                  </Badge>
                </Link>
              </div>
              
              {/* Right Side: Content */}
              <CardContent className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
                    <h3 className="text-xl sm:text-2xl font-black line-clamp-2 uppercase leading-tight text-black font-display tracking-tight">
                      {campaign.title}
                    </h3>
                  </Link>
                  
                  <div className="mt-2 font-display text-2xl font-black text-black">
                    {campaign.financialGoal ? `R$ ${campaign.financialGoal.toLocaleString('pt-BR')}` : 'Doação de Materiais'}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block shrink-0 shadow-sm border border-green-700"></span>
                      <span className="text-sm font-bold text-green-600">Ativa</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-100 border border-black px-2 py-0.5 uppercase">
                      ID: #{campaign.id.substring(0, 8)}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded flex items-center gap-1 uppercase select-none font-medium">
                      🤖 Classificado por IA (Seguro)
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4 border-t-2 border-dashed border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-gray-500 font-bold">
                    <MapPin className="w-4 h-4 shrink-0 text-black" /> 
                    <span>{campaign.city}, {campaign.neighborhood} | {formatTime(campaign.updatedAt)}</span>
                  </div>
                  
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button className="w-full sm:w-auto rounded-none border-2 border-black bg-black text-white hover:bg-primary hover:text-black uppercase font-black text-sm h-10 px-6 gap-2 shadow-[2px_2px_0_0_#000] hover:shadow-none transition-all active:translate-y-0.5">
                      <MessageCircle className="w-4 h-4" /> Entrar na Causa
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
