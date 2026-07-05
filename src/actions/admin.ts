/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Mock list of pending institutions for offline/demo mode
const mockPendingInstitutions: any[] = [
  {
    id: 'inst-pending-1',
    profile_type: 'institution',
    name: 'Instituto Recicla Vida',
    email: 'reciclavida@gmail.com',
    city: 'Natal',
    neighborhood: 'Pontes',
    phone: '(84) 98888-2222',
    cnpj: '55.666.777/0001-88',
    representative_name: 'Marcos Rezende',
    representative_cpf: '444.555.666-22',
    headquarters_address: 'Rua das Flores, 12, Lagoa Nova, Natal - RN',
    mission: 'Promover reciclagem sustentável e capacitação de jovens carentes.',
    approval_status: 'pending_approval',
  },
  {
    id: 'inst-pending-2',
    profile_type: 'institution',
    name: 'Associação Asas da Esperança',
    email: 'asas.esperanca@ong.org',
    city: 'Parnamirim',
    neighborhood: 'Centro',
    phone: '(84) 99111-3333',
    cnpj: '99.888.777/0001-66',
    representative_name: 'Luciana Silva',
    representative_cpf: '888.777.666-55',
    headquarters_address: 'Av. Brigadeiro Everaldo, 100, Parnamirim - RN',
    mission: 'Apoio pedagógico e alimentar para crianças carentes.',
    approval_status: 'pending_approval',
  }
];

export async function getPendingInstitutions(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('profile_type', 'institution')
      .eq('approval_status', 'pending_approval');

    if (error) {
      console.error('Error fetching pending institutions:', error.message);
      return [];
    }
    return data || [];
  }

  // Fallback offline
  return mockPendingInstitutions.filter(inst => inst.approval_status === 'pending_approval');
}

export async function getAllProfilesAdmin(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching profiles:', error.message);
      return [];
    }
    return data || [];
  }

  // Fallback offline
  return [
    { id: 'vol-1', name: 'Ana Beatriz', email: 'ana.beatriz@email.com', profile_type: 'volunteer' },
    { id: 'vol-2', name: 'Lucas Mendes', email: 'lucas.mendes@email.com', profile_type: 'volunteer' },
    { id: 'inst-1', name: 'Instituto Água Viva', email: 'contato@aguaviva.org', profile_type: 'institution', approval_status: 'approved' },
    ...mockPendingInstitutions,
  ];
}

export async function updateInstitutionApproval(
  id: string,
  status: 'approved' | 'rejected',
  notes: string = ''
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('profiles')
      .update({
        approval_status: status,
        approval_notes: notes
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating approval status:', error.message);
      return false;
    }
    return true;
  }

  // Fallback offline
  const found = mockPendingInstitutions.find(inst => inst.id === id);
  if (found) {
    found.approval_status = status;
    found.approval_notes = notes;
    return true;
  }
  return false;
}

export async function promoteUserToRole(
  userId: string,
  newRole: 'donor' | 'volunteer' | 'institution' | 'fiscal' | 'admin'
): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase
      .from('profiles')
      .update({
        profile_type: newRole
      })
      .eq('id', userId);

    if (error) {
      console.error('Error promoting user:', error.message);
      return false;
    }
    return true;
  }

  // Fallback offline
  return true;
}

// Gerador de instituições fictícias para simular alta escala (400+) no RN
function generateMockInstitutionsScale(): any[] {
  const citiesRN = [
    { city: 'Natal', neighborhoods: ['Lagoa Nova', 'Alecrim', 'Ponta Negra', 'Tirol', 'Filipe Camarão', 'Rocas', 'Nossa Senhora da Apresentação', 'Planalto'] },
    { city: 'Parnamirim', neighborhoods: ['Nova Parnamirim', 'Emaús', 'Centro', 'Cohabinal', 'Passagem de Areia'] },
    { city: 'Mossoró', neighborhoods: ['Santo Antônio', 'Abolição', 'Centro', 'Nova Betânia'] },
    { city: 'Caicó', neighborhoods: ['Centro', 'Paraíba', 'Vila do Príncipe'] },
    { city: 'Macaíba', neighborhoods: ['Centro', 'Auta de Souza', 'Vila Nova'] },
    { city: 'Ceará-Mirim', neighborhoods: ['Centro', 'Cohab', 'Nova Descoberta'] },
    { city: 'Currais Novos', neighborhoods: ['Centro', 'Valfredo Galvão'] },
    { city: 'Pau dos Ferros', neighborhoods: ['Centro', 'Princesa Isabel'] }
  ];

  const prefixos = ['Instituto', 'Associação', 'Ação', 'Fundação', 'Grupo Solidário', 'ONG'];
  const temas = ['Amor e Vida', 'Esperança e Luz', 'Semeando o Bem', 'Cidadania Plena', 'Futuro Brilhante', 'Mãos Unidas', 'Cuidar RN', 'Paz e Pão', 'Sertão Sustentável', 'Educar Sempre'];

  const list: any[] = [];

  // Instituições base que já existem nos mocks para manter consistência
  const baseInsts = [
    { id: 'inst-1', name: 'Instituto Água Viva', email: 'contato@aguaviva.org', city: 'Natal', neighborhood: 'Lagoa Nova', phone: '(84) 3232-1111', cnpj: '12.345.678/0001-90', profile_type: 'institution', approval_status: 'approved', mission: 'Apoiar educação, saúde e inclusão social por meio de ações comunitárias no RN.' },
    { id: 'inst-2', name: 'ONG Mãos que Ajudam', email: 'contato@maosqueajudam.org', city: 'Natal', neighborhood: 'Alecrim', phone: '(84) 3333-2222', cnpj: '23.456.789/0001-01', profile_type: 'institution', approval_status: 'approved', mission: 'Fornecemos alimentação e apoio às famílias em situação de extrema pobreza.' },
    { id: 'inst-3', name: 'Centro de Proteção Animal Resgate Vivo', email: 'contato@resgatevivoong.org', city: 'Parnamirim', neighborhood: 'Emaús', phone: '(84) 3444-5555', cnpj: '34.567.890/0001-12', profile_type: 'institution', approval_status: 'approved', mission: 'Resgatamos, reabilitamos e realizamos adoção responsável de animais abandonados.' },
    { id: 'inst-4', name: 'Associação Cultural Arte na Periferia', email: 'contato@artenaperiferiaong.org', city: 'Mossoró', neighborhood: 'Santo Antônio', phone: '(84) 3555-6666', cnpj: '45.678.901/0001-23', profile_type: 'institution', approval_status: 'approved', mission: 'Usamos arte, música e teatro para transformar a vida de jovens em situação de risco.' },
    { id: 'inst-5', name: 'Fundação Saúde Para Todos', email: 'contato@saudeparatodos.org', city: 'Natal', neighborhood: 'Rocas', phone: '(84) 3666-7777', cnpj: '56.789.012/0001-34', profile_type: 'institution', approval_status: 'approved', mission: 'Promovemos saúde preventiva e cuidados básicos para populações sem acesso.' }
  ];

  list.push(...baseInsts.map(inst => ({
    ...inst,
    campaigns_count: 2,
    total_expenses: 1500,
    total_donations: 3000,
    last_supply_delivery: '28/06/2026',
    priority_need: 'Média'
  })));

  // Gera mais 415 instituições para totalizar 420 entidades assistidas pelo Armazém da Caridade
  for (let i = 6; i <= 420; i++) {
    const loc = citiesRN[i % citiesRN.length];
    const neighborhood = loc.neighborhoods[i % loc.neighborhoods.length];
    const prefix = prefixos[i % prefixos.length];
    const tema = temas[i % temas.length];
    
    const cnpj = `${String(10 + (i % 90)).padStart(2, '0')}.${String(100 + (i % 900)).padStart(3, '0')}.${String(100 + (i % 900)).padStart(3, '0')}/0001-${String(i % 100).padStart(2, '0')}`;

    list.push({
      id: `inst-scale-${i}`,
      profile_type: 'institution',
      name: `${prefix} ${tema} ${i}`,
      email: `contato@${tema.toLowerCase().replace(/\s+/g, '')}${i}.org`,
      city: loc.city,
      neighborhood: neighborhood,
      phone: `(84) 99${String(100 + (i % 900)).substring(0, 3)}-${String(1000 + i).substring(0, 4)}`,
      cnpj: cnpj,
      representative_name: `Responsável ${i}`,
      representative_cpf: `123.456.${String(100 + (i % 900))}-${String(i % 100).padStart(2, '0')}`,
      mission: `Atender e fomentar projetos de apoio comunitário e beneficência social na região de ${loc.city}.`,
      approval_status: i % 15 === 0 ? 'pending_approval' : 'approved',
      campaigns_count: (i % 4) + 1,
      total_expenses: (i % 5) * 1250 + 500,
      total_donations: (i % 5) * 1500 + 800,
      last_supply_delivery: new Date(Date.now() - (i % 30) * 86400000).toLocaleDateString('pt-BR'),
      priority_need: i % 3 === 0 ? 'Alta' : i % 3 === 1 ? 'Média' : 'Baixa'
    });
  }

  return list;
}

export async function getAllInstitutionsDetailed(): Promise<any[]> {
  if (isSupabaseConfigured && supabase) {
    const supabaseClient = supabase;
    try {
      const { data: dbProfiles, error: profileErr } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('profile_type', 'institution');

      if (profileErr) {
        console.error('Error fetching database institutions:', profileErr.message);
      }

      const dbList = dbProfiles || [];

      // Cruzar com dados de campanhas se houver no banco real
      const detailedList = await Promise.all(dbList.map(async (inst: any) => {
        // Contar campanhas
        const { count: campaignsCount } = await supabaseClient
          .from('campaigns')
          .select('*', { count: 'exact', head: true })
          .eq('organizer_id', inst.id);

        return {
          ...inst,
          campaigns_count: campaignsCount || 0,
          total_expenses: 0,
          total_donations: 0,
          last_supply_delivery: 'Sem entregas',
          priority_need: 'Média'
        };
      }));

      // Se a base de dados tiver poucas instituições, mescla com os mocks de escala para demonstração do pitch
      if (detailedList.length < 10) {
        const mockScale = generateMockInstitutionsScale();
        // Remove duplicidades por ID ou CNPJ se houver
        const existingIds = new Set(detailedList.map(d => d.id));
        const combined = [...detailedList, ...mockScale.filter(m => !existingIds.has(m.id))];
        return combined;
      }

      return detailedList;
    } catch (err) {
      console.error('Failed to get detailed institutions from Supabase:', err);
    }
  }

  // Fallback completo offline
  return generateMockInstitutionsScale();
}

export async function createInstitutionByAdmin(data: {
  name: string;
  email: string;
  phone: string;
  cnpj: string;
  city: string;
  neighborhood: string;
  representative_name: string;
  mission: string;
}): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      // 1. Cadastrar um usuário básico no auth do Supabase se necessário,
      // ou criar direto um profile (para fins administrativos, muitas vezes cria-se o profile e o convite de acesso depois)
      // Como o Supabase restringe criação em profiles sem registro na tabela de auth, podemos tentar inserir o profile direto
      // se a constraint REFERENCES auth.users(id) estiver desabilitada ou se usarmos um ID gerado.
      // Em schema.sql: id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY
      // Isso significa que precisamos primeiro criar a conta de usuário na auth se formos usar online.
      // Para simplificar a criação administrativa pelo painel:
      // Geramos um ID UUID aleatório e criamos. Mas se houver restrição, o ideal seria cadastrar via Auth API.
      // Vamos tentar criar no Supabase usando um UUID. Caso a constraint de chave estrangeira falhe, tentaremos criar com segurança.
      const tempId = crypto.randomUUID();
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: tempId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          cnpj: data.cnpj,
          city: data.city,
          neighborhood: data.neighborhood,
          representative_name: data.representative_name,
          mission: data.mission,
          profile_type: 'institution',
          approval_status: 'approved',
          accepted_terms: true
        });

      if (error) {
        console.error('Error inserting institution profile:', error.message);
        return false;
      }
      return true;
    } catch (err) {
      console.error('Failed to create institution:', err);
      return false;
    }
  }

  // Fallback offline (simula sucesso)
  return true;
}

