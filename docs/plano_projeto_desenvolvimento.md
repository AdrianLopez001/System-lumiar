# Planejamento de Desenvolvimento de Projeto — Armazém da Caridade

Este documento define a dinâmica de trabalho, a viabilidade financeira e o plano de investimento para a implementação do sistema **Lumiar 2.0** customizado para o **Armazém da Caridade**. O foco é garantir alta escala, governança de dados governamentais e eficiência operacional com segurança de dados.

---

## 📅 Controle do Documento
* **Autor:** Adrian / Eduardo / Felix
* **Versão:** 5.0.0 (Comercial / ROI)
* **Data:** 3 de Julho de 2026
* **Destino:** Diretoria do `Armazém da Caridade`
* **Status:** `Pronto para Apresentação`

---

## 1. Sumário Executivo

* **Objetivo**: Consolidar o Armazém da Caridade como o principal ecossistema de fomento social no Rio Grande do Norte (RN).
* **Escala**: Centralizar e gerenciar com precisão a assistência prestada a mais de **400 instituições parceiras**.
* **Governança**: Estruturar banco de dados seguro para emitir prestações de contas formais e auditáveis para órgãos do governo.
* **Inteligência**: Utilizar IA de Gestão para otimizar a distribuição de recursos e auditar comprovantes fiscais das entidades.

---

## 💻 2. Infraestrutura Técnica Simplificada

* **Acesso Facilitado**: Sistema 100% web, otimizado para celulares antigos e computadores sem necessidade de instalação.
* **Segurança e Nuvem**: Banco de dados centralizado em nuvem estável com backups diários automáticos.
* **Privacidade de Dados**: Controle estrito de acessos; cada instituição acessa apenas suas respectivas informações autorizadas.
* **IA Centralizada**: Análises complexas, OCR de imagens e matching lógico são processados em nuvem, mantendo o sistema rápido.

---

## 👥 3. Dinâmica de Trabalho

* **Duração Total**: 4 meses de desenvolvimento.
* **Equipe Alocada**: 3 desenvolvedores especialistas dedicados.
* **Entregas Quinzenais (Sprints)**: Versão funcional atualizada a cada 2 semanas (15 dias) em ambiente de testes para homologação e validação da diretoria, eliminando riscos de desalinhamento de expectativas.

### 3.1. Governança e Diretrizes de Liderança do Projeto

Para garantir o sucesso operacional e mitigar riscos, o líder do projeto adotará as seguintes diretrizes de gestão técnica e financeira:

#### A. Gestão de Fluxo de Caixa (Como receber e gerir o valor)
* **Fluxo de Recebimento do Cliente**: O valor de R$ 55.000,00 será faturado em 5 parcelas de R$ 11.000,00 vinculadas ao cumprimento das metas do cronograma financeiro.
* **Pagamento sob Demanda e Entrega (Não pagar tudo antecipado)**:
  * **Critério de Necessidade**: Distribua os repasses para os desenvolvedores em parcelas atreladas às entregas aprovadas de cada Sprint quinzenal.
  * Evite pagamentos adiantados significativos. Libere apenas uma taxa de início de trabalho (ex: 15% a 20%) e vincule o saldo restante de cada mês à validação e merge do código funcional na branch principal do projeto.
* **Fundo de Retenção de Garantia (Contingência)**:
  * O líder do projeto deve reservar de 10% a 15% do valor total repassado em cada etapa para formar um fundo de contingência operacional.
  * Esse valor retido é uma garantia técnica e será distribuído à equipe de desenvolvimento somente 15 dias após o lançamento bem-sucedido em ambiente de produção (Mês 4) sem bugs impeditivos ativos.

#### B. Como Agir como Líder de Projeto (Planos de Ação)
* **Proteção de Escopo**: O líder do projeto deve agir como barreira contra o *scope creep* (solicitações informais do cliente de adicionar novos recursos sem recalcular o orçamento). Solicitações adicionais devem entrar em uma lista de melhorias pós-lançamento ou serem orçadas separadamente como horas extras.
* **Ritos e Ritmo de Trabalho**:
  * **Daily Scrum Rápida**: Chamadas curtas diárias de 15 minutos para debater impedimentos e manter o progresso do time alinhado.
  * **Revisão de Código e Padrões**: Garantir que as entregas de cada Sprint do time técnico passem por testes de compilação locais para evitar furos no código.
  * **Apresentação Comercial Quinzenal**: O líder é o ponto focal que traduz a parte técnica para linguagem comercial nas demonstrações com a diretoria do Armazém a cada 15 dias, assegurando o alinhamento de expectativas.

#### C. Aspectos Fiscais e Forma de Recebimento
* **Uso de CNPJ e Emissão de Notas Fiscais**:
  * Por ser uma instituição do terceiro setor (ONG/OSC), o Armazém da Caridade exige rastreabilidade contábil estrita para prestar contas a órgãos governamentais e conselhos fiscais.
  * O recebimento de cada marco financeiro de R$ 11.000,00 deve ser respaldado pela emissão de uma **Nota Fiscal de Serviços Eletrônica (NFS-e)**. O líder deve utilizar um CNPJ (MEI ou Microempresa) sob atividade (CNAE) de desenvolvimento de software ou gestão de tecnologia.
* **Forma de Transferência**:
  * Os pagamentos devem ser efetuados via **Pix (Chave CNPJ)** ou **TED/Transferência Bancária** diretamente da conta institucional do Armazém da Caridade (CNPJ) para a conta PJ da empresa do líder.
  * Devem ser evitadas transferências para contas de pessoas físicas (CPF), pois isso gera problemas fiscais para o Armazém e atrai riscos de bitributação ou questionamento pela Receita Federal.
* **Resguardo por Contrato**: Toda a dinâmica de repasses deve estar formalizada em um Contrato de Prestação de Serviços assinado digitalmente, vinculando a liberação de cada Nota Fiscal à ata de homologação da entrega da Sprint correspondente.

---

## 💰 4. Plano de Investimento Estruturado

Investimento total fixado de **R$ 55.000,00**, dividido em parcelas fixas atreladas às entregas e ao progresso mensal:

| Meta / Entrega | Descrição do Marco Técnico | Prazo | Valor (R$) |
| :--- | :--- | :--- | :--- |
| **Aprovação / Início** | Kickoff e Alocação dos 3 Desenvolvedores | D+0 | **R$ 11.000,00** |
| **Mês 1 (Sprint 2)** | Banco de dados de alta escala, telas básicas e Design Inclusivo | D+30 | **R$ 11.000,00** |
| **Mês 2 (Sprint 4)** | Módulo de Gestão Unificada das 400+ Instituições e conexões | D+60 | **R$ 11.000,00** |
| **Mês 3 (Sprint 6)** | Vitrine Pública, Compartilhamento de Links e relatórios do governo | D+90 | **R$ 11.000,00** |
| **Mês 4 (Sprint 8)** | Módulo de IA (Matching/OCR), homologação geral e Go-Live | D+120 | **R$ 11.000,00** |
| **TOTAL** | **Desenvolvimento e Lançamento Completo** | **4 Meses** | **R$ 55.000,00** |

---

## 📈 5. Justificativa de Negócio, Retorno (ROI) e Sustentabilidade

Abaixo está o detalhamento de como o sistema se paga e por que este investimento é estratégico e viável para a sustentabilidade do Armazém da Caridade:

### 5.1. Como a Instituição consegue Bancar o Sistema?
O investimento inicial de R$ 55.000,00 e o custo operacional recorrente de manutenção do software são cobertos pelo próprio ecossistema viabilizado pela plataforma:
* **Captação de Recursos Governamentais e Emendas**: Governos (Estadual/Federal) e Ministérios exigem dados auditáveis rígidos. A transparência em tempo real oferecida pelo sistema qualifica o Armazém para receber emendas parlamentares e convênios públicos recorrentes, uma vez que cada centavo e quilo de insumo é rastreado por IA e exportado em relatórios oficiais de auditoria.
* **Atração de Grandes Doadores Privados (ESG)**: Grandes corporações do RN buscam instituições sérias para investir verbas de responsabilidade socioambiental. O portal público de transparência ("Vitrine") serve como portfólio corporativo de marketing e governança, convertendo novas empresas doadoras.
* **Redução drástica de Custos Operacionais**: A otimização logística e a automatização da triagem por IA eliminam o desperdício de insumos perecíveis e de combustível por roteirização ineficiente, convertendo perdas logísticas em economia direta.

### 5.2. O que a Instituição Ganha com este Recurso?
* **Mais Tempo**: A pré-auditoria automatizada de recibos via OCR e o matching de distribuição inteligente reduzem o trabalho administrativo da equipe do Armazém de dias para poucos minutos.
* **Maior Alcance de Captação**: Ferramenta integrada de geração de links diretos e compartilhamento ágil via WhatsApp aumenta exponencialmente a resposta a campanhas urgentes junto à sociedade civil.
* **Eliminação de Gargalos Operacionais**: O sistema monitora as demandas de mais de 400 instituições simultaneamente, evitando a duplicidade de distribuição e garantindo que todas as instituições sejam atendidas de forma balanceada.

### 5.3. O que é possível Conseguir no Médio e Longo Prazo?
* Estabelecer o Armazém da Caridade como o **hub oficial e autoridade máxima em beneficência no RN**.
* Consolidar o primeiro "Mapa da Fome e vulnerabilidade social do RN" com dados reais e consolidados, auxiliando no planejamento de políticas públicas em conjunto com secretarias governamentais.
* Integração direta e automatizada de doadores parceiros (empresas e supermercados) no mesmo fluxo logístico.

---

## 📊 6. Métricas de Sucesso (KPIs)

* **Adoção**: 100% das 400+ instituições assistidas cadastradas e ativas no sistema.
* **Agilidade Fiscal**: Redução do tempo de geração de relatórios de auditoria governamental para menos de 5 minutos.
* **Performance de IA**: Processamento e validação de notas fiscais via OCR em menos de 10 segundos por comprovante.
* **Cobertura Territorial**: Mapeamento dinâmico visual do alcance das doações em todo o RN.

---

## 🔒 7. Segurança e Conformidade (LGPD)

* **Segurança de Nível Comercial**: Restrição de acesso a dados privados por perfis.
* **Conformidade LGPD**: Módulo nativo de consentimento para tratamento de dados pessoais de voluntários e instituições.
* **Resiliência**: Backups automáticos em servidores Cloud redundantes.

---

## 🏁 8. Próximos Passos recomendados

1. **Aprovação Formal**: Validação do escopo, termos de ROI e marcos financeiros pela diretoria.
2. **Kickoff Técnico**: Alocação da equipe de 3 desenvolvedores e setup do cronograma de reuniões quinzenais.
3. **Oficina de Cocriação de UX**: Alinhamento inicial de design inclusivo antes de iniciar as implementações.
