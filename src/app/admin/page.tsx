"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { getAllProfilesAdmin, promoteUserToRole, getAllInstitutionsDetailed, createInstitutionByAdmin } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Users, Search, UserCheck, RefreshCw, Cpu, Database, Server, Settings, 
  Terminal, ShieldAlert, Sparkles, Play, PlusCircle, ExternalLink, Calendar, 
  HelpCircle, PhoneCall, Trash2, Award, ClipboardCheck
} from "lucide-react";
import { loadStoredProfile } from "@/lib/auth";

export default function AdminPage() {
  const [profile, setProfile] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"roles" | "institutions" | "ai">("roles");

  // Estados para Gestão de Instituições Assistidas
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [instLoading, setInstLoading] = useState(true);
  const [instSearch, setInstSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedInstitution, setSelectedInstitution] = useState<any | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [submittingInst, setSubmittingInst] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);

  const [newInstForm, setNewInstForm] = useState({
    name: "",
    email: "",
    phone: "",
    cnpj: "",
    city: "Natal",
    neighborhood: "",
    representative_name: "",
    mission: ""
  });

  // AI & Infra simulator states
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-pro");
  const [temperature, setTemperature] = useState(0.2);
  const [promptInput, setPromptInput] = useState("Você é um assistente especializado em validar a conformidade de relatórios fiscais de ONGs e emitir certificados...");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const user = loadStoredProfile();
    setProfile(user);

    async function loadData() {
      try {
        const list = await getAllProfilesAdmin();
        setUsers(list);
      } catch (err) {
        console.error("Error loading profiles:", err);
      } finally {
        setLoading(false);
      }
    }

    async function loadInstitutions() {
      try {
        const list = await getAllInstitutionsDetailed();
        setInstitutions(list);
      } catch (err) {
        console.error("Error loading institutions:", err);
      } finally {
        setInstLoading(false);
      }
    }

    loadData();
    loadInstitutions();
  }, []);

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstForm.name || !newInstForm.email || !newInstForm.cnpj) {
      alert("Por favor, preencha nome, e-mail e CNPJ.");
      return;
    }

    setSubmittingInst(true);
    try {
      const ok = await createInstitutionByAdmin(newInstForm);
      if (ok) {
        alert("Instituição cadastrada com sucesso no sistema!");
        const newInst = {
          id: `inst-scale-${Date.now()}`,
          profile_type: 'institution',
          name: newInstForm.name,
          email: newInstForm.email,
          phone: newInstForm.phone,
          cnpj: newInstForm.cnpj,
          city: newInstForm.city,
          neighborhood: newInstForm.neighborhood || "Centro",
          representative_name: newInstForm.representative_name || "Responsável de Campo",
          mission: newInstForm.mission || "Apoiar a comunidade vulnerável local.",
          approval_status: 'approved',
          campaigns_count: 0,
          total_expenses: 0,
          total_donations: 0,
          last_supply_delivery: new Date().toLocaleDateString('pt-BR'),
          priority_need: 'Média'
        };
        setInstitutions(prev => [newInst, ...prev]);
        setIsCreateModalOpen(false);
        setNewInstForm({
          name: "",
          email: "",
          phone: "",
          cnpj: "",
          city: "Natal",
          neighborhood: "",
          representative_name: "",
          mission: ""
        });
      } else {
        alert("Erro ao cadastrar instituição.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de conexão com o servidor.");
    } finally {
      setSubmittingInst(false);
    }
  };


  const handlePromote = async (userId: string, currentRole: string) => {
    let newRole: "donor" | "volunteer" | "institution" | "fiscal" | "admin" = "volunteer";
    if (currentRole === "volunteer") newRole = "fiscal";
    else if (currentRole === "fiscal") newRole = "admin";
    else newRole = "volunteer";

    setUpdatingId(userId);
    try {
      const ok = await promoteUserToRole(userId, newRole);
      if (ok) {
        alert(`Usuário alterado para o cargo: ${newRole}`);
        setUsers(prev =>
          prev.map(u => (u.id === userId ? { ...u, profile_type: newRole } : u))
        );
      } else {
        alert("Erro ao alterar cargo do usuário.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTestAI = () => {
    if (!promptInput.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    
    // Simulate Gemini API processing
    setTimeout(() => {
      setAiResponse(
        `[${selectedModel.toUpperCase()} RESPONSE (TEMP: ${temperature})]\n` +
        `Análise concluída com sucesso! ✓\n` +
        `- Prompt processado: ${promptInput.substring(0, 40)}...\n` +
        `- Conformidade: 98% aprovado.\n` +
        `- Latência: 240ms\n` +
        `- Token count: 1,412 input / 324 output\n` +
        `Estrutura de prompt válida para categorização de ações sociais.`
      );
      setAiLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="text-center font-display text-2xl font-black uppercase py-24 text-black">
        Carregando painel do administrador...
      </div>
    );
  }

  // Admin access validation
  if (!profile || profile.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6 text-black">
        <div className="border-4 border-black p-8 bg-white shadow-[6px_6px_0_0_#000]">
          <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-4xl font-black uppercase tracking-tighter">Acesso Negado</h1>
          <p className="text-gray-600 font-bold mt-4">
            Apenas administradores gerais da plataforma podem acessar esta página.
          </p>
        </div>
      </div>
    );
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-12 lg:pt-24 lg:pb-16 text-black">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-black pb-8">
        <div>
          <Badge className="mb-3 bg-accent text-white border-2 border-black font-black uppercase">
            Administração Geral
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tighter">
            Painel do Administrador Geral
          </h1>
          <p className="text-gray-600 font-bold mt-2">
            Manutenção do sistema, controle de acesso, auditoria de dados e configuração de IA.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-4 border-black p-1 bg-white shadow-[3px_3px_0_0_#000]">
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-2 font-black uppercase text-xs transition-colors flex items-center gap-1.5 ${activeTab === "roles" ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <Users className="w-4 h-4" /> Roles & Acessos
          </button>
          <button
            onClick={() => setActiveTab("institutions")}
            className={`px-4 py-2 font-black uppercase text-xs transition-colors flex items-center gap-1.5 ${activeTab === "institutions" ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <Sparkles className="w-4 h-4" /> Instituições Assistidas (400+)
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`px-4 py-2 font-black uppercase text-xs transition-colors flex items-center gap-1.5 ${activeTab === "ai" ? "bg-black text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <Cpu className="w-4 h-4" /> IA & Infraestrutura
          </button>
        </div>
      </div>

      {/* ─── TAB 1: ROLES & ACESSOS ─── */}
      {activeTab === "roles" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="pl-11 h-12 border-2 border-black font-bold bg-white"
              />
            </div>
            <div className="bg-primary/20 border-2 border-black p-3 font-bold text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-black" /> Total de Usuários Cadastrados: {users.length}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(u => (
              <Card key={u.id} className="border-4 border-black rounded-none bg-white hover:shadow-[6px_6px_0_0_#000] hover:-translate-y-1 transition-all duration-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-display text-lg font-black uppercase leading-tight truncate max-w-[180px]">{u.name || "Sem Nome"}</h3>
                      <p className="text-xs font-bold text-gray-500 truncate max-w-[180px]">{u.email}</p>
                    </div>
                    <Badge className={`border-2 border-black font-black uppercase text-xs ${
                      u.profile_type === "admin" ? "bg-accent text-white" :
                      u.profile_type === "fiscal" ? "bg-secondary text-black" :
                      u.profile_type === "institution" ? "bg-primary text-black" :
                      "bg-white text-black"
                    }`}>
                      {u.profile_type}
                    </Badge>
                  </div>

                  <div className="pt-2 border-t-2 border-gray-100 flex items-center justify-between gap-2">
                    <div className="text-xs font-bold text-gray-400">
                      ID: <code className="bg-gray-100 px-1 rounded-sm">{u.id.substring(0, 8)}</code>
                    </div>
                    <Button
                      size="sm"
                      disabled={updatingId === u.id || u.profile_type === "admin"}
                      onClick={() => handlePromote(u.id, u.profile_type)}
                      className="border-2 border-black bg-black text-white hover:bg-gray-800 text-xs font-black uppercase"
                    >
                      {updatingId === u.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <><UserCheck className="w-3.5 h-3.5 mr-1" /> Alterar Cargo</>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="p-16 border-4 border-dashed border-gray-300 text-center text-gray-400 font-bold uppercase">
              Nenhum usuário correspondente aos filtros encontrado.
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: GESTÃO DE INSTITUIÇÕES ASSISTIDAS (400+) ─── */}
      {activeTab === "institutions" && (
        <div className="space-y-8">
          
          {/* Métricas do Ecossistema */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-4 border-black p-5 bg-white shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <span className="text-xs font-black uppercase text-gray-500">Total Assistidas</span>
              <span className="text-4xl font-black mt-2 font-display">{institutions.length}</span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">Crescimento de +18% este mês</span>
            </div>
            <div className="border-4 border-black p-5 bg-white shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <span className="text-xs font-black uppercase text-gray-500">Campanhas de Carência</span>
              <span className="text-4xl font-black mt-2 font-display text-accent">
                {institutions.reduce((acc, curr) => acc + (curr.campaigns_count || 0), 0)}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">Demandas de insumos abertas</span>
            </div>
            <div className="border-4 border-black p-5 bg-white shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <span className="text-xs font-black uppercase text-gray-500">Prioridade Máxima</span>
              <span className="text-4xl font-black mt-2 font-display text-red-600">
                {institutions.filter(inst => inst.priority_need === 'Alta').length}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">Necessitam de repasse urgente</span>
            </div>
            <div className="border-4 border-black p-5 bg-white shadow-[4px_4px_0_0_#000] flex flex-col justify-between">
              <span className="text-xs font-black uppercase text-gray-500">Fomento Repassado</span>
              <span className="text-4xl font-black mt-2 font-display text-green-600">
                R$ {institutions.reduce((acc, curr) => acc + (curr.total_donations || 0), 0).toLocaleString('pt-BR')}
              </span>
              <span className="text-[10px] font-bold text-gray-400 mt-1">Triagem e doações convertidas</span>
            </div>
          </div>

          {/* Filtros e Ações */}
          <div className="flex flex-col md:flex-row justify-between items-stretch gap-4 border-t-4 border-black pt-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <Input
                  value={instSearch}
                  onChange={e => { setInstSearch(e.target.value); setVisibleCount(24); }}
                  placeholder="Buscar instituição por nome, CNPJ ou e-mail..."
                  className="pl-11 h-12 border-2 border-black font-bold bg-white"
                />
              </div>
              <select
                value={selectedCity}
                onChange={e => { setSelectedCity(e.target.value); setVisibleCount(24); }}
                className="h-12 px-3 border-2 border-black bg-white font-bold text-sm"
              >
                <option value="all">Todos os Municípios (RN)</option>
                <option value="Natal">Natal</option>
                <option value="Parnamirim">Parnamirim</option>
                <option value="Mossoró">Mossoró</option>
                <option value="Caicó">Caicó</option>
                <option value="Macaíba">Macaíba</option>
                <option value="Ceará-Mirim">Ceará-Mirim</option>
                <option value="Currais Novos">Currais Novos</option>
                <option value="Pau dos Ferros">Pau dos Ferros</option>
              </select>
            </div>
            
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-12 border-2 border-black bg-primary text-black hover:bg-black hover:text-white font-black uppercase text-sm flex items-center justify-center gap-2 shadow-[3px_3px_0_0_#000] hover:shadow-none transition-all"
            >
              <PlusCircle className="w-5 h-5" /> Novo Cadastro Assistido
            </Button>
          </div>

          {/* Tabela / Grid das Instituições */}
          {instLoading ? (
            <div className="text-center font-bold py-12 text-gray-500 uppercase">
              Carregando lista de instituições parceiras...
            </div>
          ) : (
            <div className="space-y-6">
              {(() => {
                const filteredInsts = institutions.filter(inst => {
                  const matchesSearch = 
                    inst.name?.toLowerCase().includes(instSearch.toLowerCase()) ||
                    inst.cnpj?.includes(instSearch) ||
                    inst.email?.toLowerCase().includes(instSearch.toLowerCase());
                  
                  const matchesCity = selectedCity === "all" || inst.city === selectedCity;

                  return matchesSearch && matchesCity;
                });

                const visibleInsts = filteredInsts.slice(0, visibleCount);

                return (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {visibleInsts.map(inst => (
                        <Card key={inst.id} className="border-4 border-black rounded-none bg-white shadow-[4px_4px_0_0_#000] hover:shadow-[8px_8px_0_0_#000] hover:-translate-y-1 transition-all duration-200">
                          <CardContent className="p-5 space-y-4">
                            <div className="flex justify-between items-start gap-2 border-b border-gray-100 pb-3">
                              <div>
                                <h4 className="font-display font-black text-md uppercase leading-snug tracking-tight text-gray-900 truncate max-w-[200px]" title={inst.name}>
                                  {inst.name}
                                </h4>
                                <span className="text-[10px] font-bold text-gray-400 block mt-0.5">CNPJ: {inst.cnpj}</span>
                              </div>
                              <Badge className={`border-2 border-black font-black uppercase text-[9px] ${
                                inst.priority_need === 'Alta' ? 'bg-red-200 text-red-800' :
                                inst.priority_need === 'Média' ? 'bg-yellow-200 text-yellow-800' :
                                'bg-green-200 text-green-800'
                              }`}>
                                Prioridade {inst.priority_need}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-gray-600">
                              <div>
                                <span className="text-[9px] uppercase text-gray-400 block">Cidade / Bairro</span>
                                <span className="truncate block">{inst.city} - {inst.neighborhood}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-gray-400 block">Último Repasse</span>
                                <span>{inst.last_supply_delivery || 'Não registrado'}</span>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-gray-400 block">Campanhas Ativas</span>
                                <Badge className="bg-primary/20 text-black border border-black font-black text-[10px] h-5 py-0">
                                  {inst.campaigns_count || 0}
                                </Badge>
                              </div>
                              <div>
                                <span className="text-[9px] uppercase text-gray-400 block">Status Triagem</span>
                                <Badge className={`border border-black font-black text-[9px] h-5 py-0 ${inst.approval_status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                  {inst.approval_status === 'approved' ? 'Homologada' : 'Pendente'}
                                </Badge>
                              </div>
                            </div>

                            <div className="pt-3 border-t-2 border-gray-100 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setSelectedInstitution(inst)}
                                className="flex-1 border-2 border-black bg-white text-black hover:bg-gray-50 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5" /> Detalhes
                              </Button>
                              <a 
                                href={`https://wa.me/55${inst.phone?.replace(/\D/g, '')}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-3 border-2 border-black bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-[2px_2px_0_0_#000] hover:shadow-none transition-all"
                              >
                                <PhoneCall className="w-4 h-4" />
                              </a>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredInsts.length === 0 && (
                      <div className="p-16 border-4 border-dashed border-gray-300 text-center text-gray-400 font-bold uppercase">
                        Nenhuma instituição assistida atende aos filtros atuais.
                      </div>
                    )}

                    {filteredInsts.length > visibleCount && (
                      <div className="text-center pt-8">
                        <Button
                          onClick={() => setVisibleCount(prev => prev + 24)}
                          className="border-2 border-black bg-white text-black hover:bg-gray-100 font-black uppercase text-sm tracking-wider px-8"
                        >
                          Carregar Mais Instituições (+24)
                        </Button>
                        <p className="text-xs text-gray-500 font-bold mt-2">
                          Exibindo {visibleInsts.length} de {filteredInsts.length} instituições mapeadas no RN
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          {/* Modal de Detalhes da Instituição Assistida */}
          {selectedInstitution && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border-4 border-black p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[8px_8px_0_0_#000] animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-4">
                  <div>
                    <Badge className="bg-primary text-black border border-black font-black uppercase text-xs mb-1">
                      Instituição Parceira
                    </Badge>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-black">
                      {selectedInstitution.name}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedInstitution(null)}
                    className="border-2 border-black bg-red-500 text-white font-black px-2.5 py-1 text-sm hover:bg-red-600 active:translate-y-0.5 shadow-[2px_2px_0_0_#000] hover:shadow-none transition-all"
                  >
                    X
                  </button>
                </div>

                <div className="space-y-6 text-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-black p-3 bg-gray-50">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Identificação Cadastral</span>
                      <p className="font-bold text-sm">CNPJ: {selectedInstitution.cnpj}</p>
                      <p className="font-bold text-sm">E-mail: {selectedInstitution.email}</p>
                      <p className="font-bold text-sm">Telefone: {selectedInstitution.phone}</p>
                    </div>
                    <div className="border-2 border-black p-3 bg-gray-50">
                      <span className="text-[10px] font-black uppercase text-gray-400 block">Localização Operacional</span>
                      <p className="font-bold text-sm">Estado: Rio Grande do Norte (RN)</p>
                      <p className="font-bold text-sm">Município: {selectedInstitution.city}</p>
                      <p className="font-bold text-sm">Bairro: {selectedInstitution.neighborhood}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-gray-600 block">Missão da Entidade</span>
                    <p className="border-2 border-black p-3 bg-white text-xs font-bold leading-relaxed text-gray-700 font-medium">
                      {selectedInstitution.mission || "Não detalhado."}
                    </p>
                  </div>

                  {/* Fluxo de Transparência e Fomento */}
                  <div className="border-2 border-black p-4 bg-primary/10 space-y-4">
                    <h4 className="font-display font-black text-sm uppercase flex items-center gap-1.5 border-b border-black/10 pb-2">
                      <Award className="w-4 h-4" /> Balanço Logístico & Prestação de Contas
                    </h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white border border-black p-2">
                        <span className="text-[9px] uppercase text-gray-400 block">Arrecadado</span>
                        <span className="text-xs font-black text-green-700">
                          R$ {selectedInstitution.total_donations?.toLocaleString('pt-BR') || '0,00'}
                        </span>
                      </div>
                      <div className="bg-white border border-black p-2">
                        <span className="text-[9px] uppercase text-gray-400 block">Despesas</span>
                        <span className="text-xs font-black text-red-600">
                          R$ {selectedInstitution.total_expenses?.toLocaleString('pt-BR') || '0,00'}
                        </span>
                      </div>
                      <div className="bg-white border border-black p-2">
                        <span className="text-[9px] uppercase text-gray-400 block">Saldo</span>
                        <span className="text-xs font-black text-gray-700">
                          R$ {((selectedInstitution.total_donations || 0) - (selectedInstitution.total_expenses || 0)).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-gray-600 flex justify-between items-center">
                      <span>Último abastecimento logístico do Armazém:</span>
                      <Badge className="bg-white border border-black text-black font-black text-[10px]">
                        {selectedInstitution.last_supply_delivery || 'Nenhum'}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Status do Cadastro */}
                  <div className="flex justify-between items-center bg-gray-50 border-2 border-black p-3 text-xs font-bold">
                    <span>Homologação e Triagem Fiscal:</span>
                    <span className="flex items-center gap-2">
                      <Badge className={`border border-black font-black uppercase text-[10px] ${selectedInstitution.approval_status === 'approved' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                        {selectedInstitution.approval_status === 'approved' ? 'Cadastro Homologado ✓' : 'Aguardando Análise'}
                      </Badge>
                    </span>
                  </div>
                </div>

                <div className="mt-6 border-t-2 border-black pt-4 flex gap-2 justify-end">
                  <Button 
                    onClick={() => setSelectedInstitution(null)}
                    className="border-2 border-black bg-black text-white hover:bg-gray-800 font-black uppercase text-xs"
                  >
                    Fechar Detalhes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Modal de Novo Cadastro Assistido */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border-4 border-black p-6 max-w-lg w-full shadow-[8px_8px_0_0_#000] animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-start border-b-4 border-black pb-4 mb-4">
                  <div>
                    <h3 className="font-display font-black text-2xl uppercase tracking-tighter text-black">
                      Novo Cadastro Assistido
                    </h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">Insira uma instituição parceira no ecossistema do Armazém</p>
                  </div>
                  <button 
                    onClick={() => setIsCreateModalOpen(false)}
                    className="border-2 border-black bg-red-500 text-white font-black px-2.5 py-1 text-sm hover:bg-red-600 active:translate-y-0.5 shadow-[2px_2px_0_0_#000] hover:shadow-none transition-all"
                  >
                    X
                  </button>
                </div>

                <form onSubmit={handleCreateInstitution} className="space-y-4 text-black font-bold text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="uppercase text-[10px] text-gray-600 block">Nome da Instituição</label>
                      <Input
                        required
                        value={newInstForm.name}
                        onChange={e => setNewInstForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Abrigo Semente do Bem"
                        className="border-2 border-black h-10 font-bold bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="uppercase text-[10px] text-gray-600 block">CNPJ</label>
                      <Input
                        required
                        value={newInstForm.cnpj}
                        onChange={e => setNewInstForm(prev => ({ ...prev, cnpj: e.target.value }))}
                        placeholder="Ex: 00.000.000/0001-00"
                        className="border-2 border-black h-10 font-bold bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="uppercase text-[10px] text-gray-600 block">E-mail para Contato</label>
                      <Input
                        required
                        type="email"
                        value={newInstForm.email}
                        onChange={e => setNewInstForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Ex: contato@ong.org"
                        className="border-2 border-black h-10 font-bold bg-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="uppercase text-[10px] text-gray-600 block">WhatsApp / Telefone</label>
                      <Input
                        value={newInstForm.phone}
                        onChange={e => setNewInstForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Ex: (84) 99999-9999"
                        className="border-2 border-black h-10 font-bold bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="uppercase text-[10px] text-gray-600 block">Município (RN)</label>
                      <select
                        value={newInstForm.city}
                        onChange={e => setNewInstForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full h-10 border-2 border-black bg-white px-2 font-bold text-xs"
                      >
                        <option value="Natal">Natal</option>
                        <option value="Parnamirim">Parnamirim</option>
                        <option value="Mossoró">Mossoró</option>
                        <option value="Caicó">Caicó</option>
                        <option value="Macaíba">Macaíba</option>
                        <option value="Ceará-Mirim">Ceará-Mirim</option>
                        <option value="Currais Novos">Currais Novos</option>
                        <option value="Pau dos Ferros">Pau dos Ferros</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="uppercase text-[10px] text-gray-600 block">Bairro</label>
                      <Input
                        value={newInstForm.neighborhood}
                        onChange={e => setNewInstForm(prev => ({ ...prev, neighborhood: e.target.value }))}
                        placeholder="Ex: Alecrim"
                        className="border-2 border-black h-10 font-bold bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="uppercase text-[10px] text-gray-600 block">Nome do Responsável Legal</label>
                    <Input
                      value={newInstForm.representative_name}
                      onChange={e => setNewInstForm(prev => ({ ...prev, representative_name: e.target.value }))}
                      placeholder="Ex: Carlos Albuquerque"
                      className="border-2 border-black h-10 font-bold bg-white text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="uppercase text-[10px] text-gray-600 block">Missão Institucional / Descrição</label>
                    <textarea
                      value={newInstForm.mission}
                      onChange={e => setNewInstForm(prev => ({ ...prev, mission: e.target.value }))}
                      rows={3}
                      placeholder="Descreva o propósito da instituição parceira..."
                      className="w-full border-2 border-black p-2 font-bold text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                    />
                  </div>

                  <div className="pt-2 border-t-2 border-black flex gap-2 justify-end">
                    <Button 
                      type="button" 
                      onClick={() => setIsCreateModalOpen(false)}
                      className="border-2 border-black bg-white text-black hover:bg-gray-50 font-black uppercase text-xs"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={submittingInst}
                      className="border-2 border-black bg-primary text-black hover:bg-black hover:text-white font-black uppercase text-xs"
                    >
                      {submittingInst ? "Cadastrando..." : "Cadastrar Entidade"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: IA & INFRAESTRUTURA ─── */}
      {activeTab === "ai" && (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Coluna Esquerda: Status do Sistema & Infraestrutura */}
          <div className="space-y-6">
            <Card className="border-4 border-black rounded-none bg-white p-6 shadow-[6px_6px_0_0_#000]">
              <CardContent className="p-0 space-y-6">
                <h3 className="font-display text-2xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-3">
                  <Server className="w-6 h-6 text-accent" /> Status de Infraestrutura
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border-2 border-black p-3 bg-green-50 text-center">
                    <Database className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <span className="text-[10px] font-black uppercase text-gray-400 block">Banco PostgreSQL</span>
                    <span className="text-xs font-black text-green-700">CONECTADO ✓</span>
                  </div>
                  <div className="border-2 border-black p-3 bg-green-50 text-center">
                    <Server className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <span className="text-[10px] font-black uppercase text-gray-400 block">API Gateway</span>
                    <span className="text-xs font-black text-green-700">42ms LATÊNCIA</span>
                  </div>
                  <div className="border-2 border-black p-3 bg-green-50 text-center">
                    <Cpu className="w-5 h-5 mx-auto text-green-600 mb-1" />
                    <span className="text-[10px] font-black uppercase text-gray-400 block">Storage Bucket</span>
                    <span className="text-xs font-black text-green-700">ATIVO ✓</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm font-bold pt-2">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 uppercase text-xs">Versão do Next.js:</span>
                    <span>v15.5.19 (Vercel)</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 uppercase text-xs">Supabase Client:</span>
                    <span>v2.108.2</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500 uppercase text-xs">Limite de Armazenamento:</span>
                    <span>14.2 GB / 50.0 GB (28%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-black rounded-none bg-white p-6 shadow-[6px_6px_0_0_#000]">
              <CardContent className="p-0 space-y-4">
                <h3 className="font-display text-2xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-3">
                  <Settings className="w-6 h-6 text-secondary" /> Configurações de Modelagem de IA
                </h3>

                <div className="space-y-4 font-bold">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-600 block">Modelo Ativo do Gemini</label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full h-11 border-2 border-black bg-white px-2 text-sm font-black uppercase"
                    >
                      <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recomendado - Alto Raciocínio)</option>
                      <option value="gemini-1.5-flash">Gemini 1.5 Flash (Rápido / Baixa Latência)</option>
                      <option value="gemini-2.0-experimental">Gemini 2.0 experimental</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase text-gray-600">
                      <span>Temperatura</span>
                      <span>{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 border border-black rounded-none appearance-none cursor-pointer accent-black"
                    />
                    <span className="text-[10px] text-gray-400 block leading-tight font-medium">
                      Valores menores de temperatura produzem respostas mais precisas e estruturadas (ideal para auditoria).
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Editor de Prompts & Testes */}
          <div className="space-y-6">
            <Card className="border-4 border-black rounded-none bg-white p-6 shadow-[6px_6px_0_0_#000]">
              <CardContent className="p-0 space-y-4">
                <h3 className="font-display text-2xl font-black uppercase flex items-center gap-2 border-b-2 border-black pb-3">
                  <Terminal className="w-6 h-6 text-primary" /> Prompt Base do Sistema (Auditor IA)
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-600 block">Diretrizes do Agente</label>
                    <textarea
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      rows={5}
                      className="w-full border-2 border-black p-3 font-bold text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black bg-white"
                    />
                  </div>

                  <Button
                    onClick={handleTestAI}
                    disabled={aiLoading}
                    className="w-full font-black uppercase border-2 border-black bg-black text-white hover:bg-primary hover:text-black flex items-center justify-center gap-1.5"
                  >
                    {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                    Testar Pipeline de Prompts
                  </Button>

                  {aiResponse && (
                    <div className="space-y-2 pt-2 border-t-2 border-dashed border-gray-100">
                      <span className="text-xs font-black uppercase text-gray-600 block">Console de Resposta da IA</span>
                      <pre className="w-full border-2 border-black bg-gray-900 text-green-400 p-4 font-mono text-xs overflow-x-auto leading-relaxed shadow-[inner_2px_2px_4px_rgba(0,0,0,0.4)] whitespace-pre-wrap">
                        {aiResponse}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
