# Planejamento de Produto - JurisFlow

Ultima revisao: 2026-05-05

## 1. Resumo executivo

O JurisFlow e um SaaS juridico para advogados autonomos e escritorios pequenos, com foco inicial em atendimento trabalhista. A proposta central e transformar mensagens soltas, especialmente vindas do WhatsApp, em casos organizados com triagem, checklist de documentos, resumo por IA e acompanhamento profissional.

O produto completo pode evoluir para uma plataforma juridica com CRM, triagem, documentos, financeiro, portal do cliente, monitoramento processual e marketing juridico etico. Porem, a primeira versao deve ser menor e vendavel: um CRM de pre-atendimento trabalhista com IA e checklist documental.

Frase de posicionamento:

> Transforme mensagens soltas do WhatsApp em casos organizados, com triagem, documentos e resumo automatico por IA.

## 2. Problema

Advogados autonomos e escritorios pequenos recebem muitos contatos por WhatsApp, Instagram, indicacoes e formularios. Esses atendimentos geralmente ficam espalhados, sem padrao e sem uma visao clara de status.

Problemas recorrentes:

- leads esquecidos no WhatsApp;
- documentos pedidos de forma repetitiva;
- dificuldade para saber quem esta aguardando documento, consulta ou proposta;
- perda de contexto entre a primeira conversa e a analise juridica;
- baixa padronizacao na triagem;
- muito tempo gasto com mensagens operacionais;
- dificuldade para converter leads em clientes pagantes;
- pouca visibilidade sobre receita prevista, contratos e pagamentos.

## 3. Publico-alvo inicial

O foco inicial deve ser em advogados trabalhistas, principalmente autonomos ou escritorios com ate 5 pessoas.

Esse nicho e bom para o MVP porque:

- recebe muitos atendimentos parecidos;
- depende fortemente de triagem inicial;
- pede documentos recorrentes;
- usa muito WhatsApp;
- tem alto volume de leads que ainda nao viraram clientes;
- lida com casos em que uma boa organizacao inicial aumenta a chance de conversao.

Tipos de demandas trabalhistas para o inicio:

- reconhecimento de vinculo PJ/CLT;
- rescisao;
- horas extras;
- verbas trabalhistas;
- assedio moral;
- demissao irregular.

Expansoes futuras:

- previdenciario;
- familia;
- consumidor;
- bancario;
- imobiliario;
- empresarial.

## 4. Proposta de valor

O JurisFlow ajuda o advogado a atender melhor, organizar documentos e perder menos clientes.

Beneficios para o advogado:

- organizar todos os leads em um painel unico;
- padronizar a triagem por tipo de caso;
- saber quais documentos faltam;
- gerar resumo inicial com IA;
- criar mensagens prontas para WhatsApp;
- reduzir retrabalho operacional;
- melhorar conversao de lead para cliente;
- preparar o caso antes da consulta;
- profissionalizar o atendimento sem precisar de equipe grande.

Beneficios para o cliente final:

- entender quais documentos precisa enviar;
- receber orientacoes mais claras;
- acompanhar o status do atendimento;
- ter uma experiencia mais organizada e confiavel.

## 5. Produto completo imaginado

O JurisFlow completo pode ter os seguintes modulos:

1. CRM juridico e pipeline de atendimento.
2. Triagem juridica com IA.
3. Integracao com WhatsApp.
4. Checklist de documentos por tipo de acao.
5. Gerador de documentos juridicos com IA.
6. Controle financeiro de honorarios e contratos.
7. Portal do cliente.
8. Monitoramento de processos com DataJud.
9. Marketing juridico etico.
10. Automacoes, webhooks, agenda e marketplace de templates.

Esses modulos nao devem ser criados todos no inicio. Eles formam a visao de longo prazo, mas o produto precisa nascer com um recorte simples, util e comercializavel.

## 6. Recorte recomendado para o MVP

Nome do primeiro produto:

> JurisFlow Pre-Atendimento Trabalhista

Objetivo do MVP:

> Organizar a entrada de leads trabalhistas, coletar informacoes essenciais, controlar documentos pendentes e gerar um resumo inicial com IA para o advogado decidir o proximo passo.

Funcionalidades do MVP:

- login;
- cadastro de escritorio;
- cadastro de usuarios;
- cadastro de clientes;
- cadastro de leads;
- cadastro de casos;
- Kanban de atendimento;
- formulario publico de triagem trabalhista;
- checklist de documentos por tipo de caso;
- upload de documentos;
- status dos documentos;
- resumo automatico com IA;
- pontos relevantes do caso;
- documentos faltantes;
- perguntas sugeridas para consulta;
- mensagem pronta para WhatsApp;
- dashboard basico.

O MVP nao deve incluir inicialmente:

- WhatsApp Cloud API;
- bot automatico de WhatsApp;
- DataJud;
- portal completo do cliente;
- financeiro avancado;
- geracao de peticoes;
- marketing juridico;
- automacoes complexas;
- assinatura recorrente automatizada.

Esses itens aumentam muito a complexidade e devem entrar depois que o pre-atendimento estiver validado.

## 7. Fluxo principal do MVP

1. Lead chega por WhatsApp, indicacao, Instagram ou formulario.
2. Advogado ou atendente cadastra o lead no JurisFlow.
3. Lead e associado a uma area juridica e tipo de caso.
4. Sistema cria um caso com status inicial.
5. Cliente preenche formulario publico de triagem ou o escritorio preenche internamente.
6. Sistema mostra checklist documental do tipo de caso.
7. Cliente ou escritorio envia documentos.
8. IA gera resumo inicial, pontos relevantes, documentos faltantes e perguntas sugeridas.
9. Sistema gera uma mensagem pronta para WhatsApp.
10. Advogado analisa e move o caso no Kanban.
11. Caso avanca para consulta, proposta, contratado, perdido ou encerrado.

## 8. Pipeline inicial do Kanban

Colunas recomendadas:

- Novo contato;
- Triagem pendente;
- Aguardando documentos;
- Analise do advogado;
- Consulta marcada;
- Proposta enviada;
- Cliente contratado;
- Perdido;
- Encerrado.

Cada escritorio deve poder ajustar nomes e ordem das colunas em uma fase posterior. No MVP, pode comecar com pipeline padrao.

## 9. Triagem trabalhista inicial

Campos comuns:

- nome completo;
- telefone;
- e-mail;
- CPF;
- cidade/UF;
- origem do contato;
- tipo de demanda;
- nome da empresa;
- cargo/funcoes;
- periodo trabalhado;
- forma de contratacao;
- salario/remuneracao;
- havia horario fixo;
- havia chefe direto;
- havia obrigacao de cumprir ordens;
- usava ferramentas da empresa;
- tinha exclusividade;
- motivo da saida;
- data da saida;
- resumo livre do ocorrido.

Tipos de caso iniciais:

- reconhecimento de vinculo PJ/CLT;
- rescisao indireta;
- verbas rescisorias;
- horas extras;
- assedio moral;
- demissao irregular.

## 10. Checklist documental inicial

Checklist base para reconhecimento de vinculo PJ/CLT:

- contrato PJ;
- notas fiscais emitidas;
- comprovantes de pagamento;
- conversas com gestor;
- prints de horarios;
- e-mails corporativos;
- provas de subordinação;
- provas de habitualidade;
- documentos pessoais;
- extratos ou comprovantes bancarios relacionados.

Checklist base para rescisao/verbas:

- carteira de trabalho;
- termo de rescisao;
- holerites;
- comprovante de pagamento das verbas;
- extrato do FGTS;
- comunicacao de dispensa;
- contrato de trabalho;
- controle de ponto;
- conversas relevantes;
- documentos pessoais.

## 11. Uso de IA no MVP

A IA deve atuar como assistente operacional, nao como decisora juridica.

Saidas esperadas:

- resumo do atendimento;
- pontos juridicamente relevantes;
- documentos faltantes;
- perguntas para consulta;
- nivel de urgencia sugerido;
- mensagem pronta para WhatsApp;
- alerta de informacoes inconsistentes ou incompletas.

Regras importantes:

- toda saida deve ser tratada como rascunho;
- o advogado deve revisar antes de usar;
- prompts devem ser versionados;
- respostas da IA devem ser registradas em log;
- dados sensiveis devem ser protegidos;
- quando possivel, evitar enviar dados desnecessarios para o modelo.

Exemplo de saida:

Resumo:

> Cliente relata que trabalhou como PJ por 2 anos, com horario fixo, subordinação direta, pagamento mensal e uso de ferramentas da empresa.

Pontos relevantes:

- possivel habitualidade;
- possivel subordinação;
- possivel pessoalidade;
- possivel onerosidade.

Documentos faltantes:

- contrato PJ;
- notas fiscais;
- comprovantes de pagamento;
- conversas com gestor;
- prints de horarios.

Mensagem pronta:

> Ola, João. Para avancarmos na analise inicial, preciso que envie contrato PJ, notas fiscais, comprovantes de pagamento, conversas com gestor e prints que demonstrem horario ou ordens de trabalho.

## 12. Fases de desenvolvimento

### Fase 0 - Validacao comercial

Objetivo:

Validar se advogados trabalhistas pagariam pelo produto antes de construir a plataforma completa.

Entregas:

- roteiro de entrevista;
- lista de 20 advogados para conversar;
- landing page simples;
- formulario de interesse;
- prototipo navegavel ou mockup;
- oferta de piloto pago;
- definicao do nicho inicial.

Metas:

- 10 a 20 conversas com advogados;
- 5 advogados interessados;
- 2 dispostos a pagar pelo piloto;
- 1 nicho inicial validado.

### Fase 1 - MVP vendavel

Objetivo:

Criar o primeiro sistema funcional para organizar pre-atendimento trabalhista.

Entregas:

- autenticacao;
- escritorio/organizacao;
- usuarios;
- clientes;
- leads;
- casos;
- Kanban;
- triagem trabalhista;
- checklist documental;
- upload de documentos;
- resumo com IA;
- mensagens prontas;
- dashboard basico.

Resultado esperado:

O advogado consegue substituir planilhas e mensagens soltas por um painel organizado.

### Fase 2 - Documentos e financeiro

Objetivo:

Aumentar valor percebido e permitir cobranca maior.

Entregas:

- modelos de documentos;
- preenchimento com variaveis;
- geracao de rascunhos com IA;
- contrato de honorarios;
- parcelas;
- vencimentos;
- pagamentos recebidos;
- pagamentos atrasados;
- honorarios de exito;
- recibos;
- dashboard financeiro.

### Fase 3 - Portal do cliente

Objetivo:

Reduzir mensagens repetitivas e melhorar experiencia do cliente.

Entregas:

- login do cliente;
- status do caso;
- documentos pendentes;
- upload pelo cliente;
- documentos enviados;
- proximos passos;
- contratos;
- pagamentos;
- mensagens do escritorio.

### Fase 4 - DataJud e processos

Objetivo:

Adicionar acompanhamento processual como modulo premium.

Entregas:

- cadastro de numero de processo;
- consulta de movimentacoes publicas;
- alertas de nova movimentacao;
- resumo de andamento com IA;
- relatorio para cliente;
- painel de processos ativos.

Observacao:

O DataJud deve ser tratado como modulo posterior porque exige integracao externa, tratamento de dados publicos, limites operacionais e normalizacao de informacoes por tribunal.

### Fase 5 - Marketing juridico etico

Objetivo:

Ajudar o advogado a produzir conteudo educativo e sobrio.

Entregas:

- calendario editorial;
- posts educativos;
- artigos;
- ideias para redes sociais;
- landing pages informativas;
- checklist de conformidade;
- alertas de frases problematicas.

Cuidados:

- evitar promessa de resultado;
- evitar captacao agressiva;
- evitar frases como "causa ganha", "resultado garantido" e "ganhe sua acao";
- manter conteudo informativo, verdadeiro, discreto e sobrio.

### Fase 6 - Escala e automacoes

Objetivo:

Transformar o produto em plataforma mais robusta.

Entregas:

- WhatsApp Cloud API;
- automacoes avancadas;
- webhooks;
- integracao com agenda;
- assinatura recorrente;
- permissoes avancadas;
- logs de auditoria;
- relatorios avancados;
- marketplace de templates.

## 13. Sprints recomendadas para o MVP

### Sprint 1 - Base do sistema

- criar projeto;
- configurar banco de dados;
- configurar autenticacao;
- criar organizacao/escritorio;
- criar usuarios;
- criar layout base;
- proteger rotas por organizacao.

### Sprint 2 - CRM juridico

- cadastrar clientes;
- cadastrar leads;
- criar casos;
- definir status;
- listar casos;
- filtrar por status, area e origem;
- criar Kanban.

### Sprint 3 - Triagem

- cadastrar tipos de caso trabalhista;
- criar perguntas de triagem;
- criar formulario publico;
- salvar respostas;
- vincular respostas ao caso.

### Sprint 4 - Documentos

- criar checklists por tipo de caso;
- listar documentos pendentes;
- permitir upload;
- marcar documento como recebido, pendente ou recusado;
- mostrar progresso documental do caso.

### Sprint 5 - IA

- criar prompts versionados;
- gerar resumo do caso;
- gerar pontos relevantes;
- gerar documentos faltantes;
- gerar perguntas para consulta;
- gerar mensagem para WhatsApp;
- registrar logs de IA.

### Sprint 6 - Dashboard e beta

- criar dashboard basico;
- medir leads por status;
- medir documentos pendentes;
- medir casos contratados;
- polir interface;
- preparar deploy;
- liberar para primeiros advogados beta.

## 14. Modelo de assinatura

### Starter - R$ 149/mes

Para advogado autonomo.

Inclui:

- 1 usuario;
- CRM basico;
- ate 50 leads/mes;
- triagem;
- checklist de documentos;
- mensagens prontas;
- dashboard basico.

### Pro - R$ 299 a R$ 397/mes

Para escritorio pequeno.

Inclui:

- ate 3 usuarios;
- CRM completo;
- IA para resumo;
- documentos com IA;
- financeiro basico;
- portal do cliente basico;
- ate 300 leads/mes.

### Escritorio - R$ 697 a R$ 997/mes

Para escritorios com equipe.

Inclui:

- usuarios adicionais;
- automacoes;
- portal completo;
- DataJud;
- relatorios;
- marketing juridico;
- permissoes;
- suporte prioritario.

## 15. Setup de implantacao

### Setup basico - R$ 497

- configuracao inicial;
- areas juridicas;
- Kanban;
- checklist padrao.

### Setup profissional - R$ 997

- formularios personalizados;
- checklists por area;
- mensagens prontas;
- modelos iniciais.

### Setup premium - R$ 1.997 a R$ 3.997

- landing page;
- automacoes;
- personalizacao visual;
- treinamento;
- configuracao completa do escritorio.

## 16. Stack recomendada

Frontend:

- Next.js;
- TypeScript;
- Tailwind CSS ou Ant Design;
- React Hook Form;
- Zod.

Backend:

- Next.js API Routes para MVP ou NestJS se quiser separar backend desde o inicio;
- Prisma;
- PostgreSQL;
- Redis;
- BullMQ.

IA:

- OpenAI API;
- prompts versionados;
- logs de geracao;
- camada de seguranca para dados sensiveis;
- opcao futura de anonimizar informacoes.

Arquivos:

- Cloudflare R2;
- AWS S3;
- Supabase Storage.

WhatsApp no MVP:

- link wa.me;
- botao copiar mensagem;
- registro manual da origem.

WhatsApp futuro:

- WhatsApp Cloud API;
- Twilio;
- Z-API;
- Evolution API.

Pagamentos futuros:

- Asaas;
- Mercado Pago;
- Stripe;
- Pagar.me.

## 17. Modelagem inicial de dados

Entidades principais:

- organizations;
- users;
- clients;
- leads;
- cases;
- legal_areas;
- case_types;
- pipeline_stages;
- triage_forms;
- triage_questions;
- triage_answers;
- document_checklists;
- document_items;
- case_documents;
- ai_summaries;
- whatsapp_messages;
- document_templates;
- generated_documents;
- contracts;
- payments;
- processes;
- process_movements;
- client_portal_access;
- marketing_posts;
- landing_pages;
- audit_logs;
- ai_logs.

Entidades essenciais para o MVP:

- organizations;
- users;
- clients;
- leads;
- cases;
- legal_areas;
- case_types;
- pipeline_stages;
- triage_questions;
- triage_answers;
- document_checklists;
- document_items;
- case_documents;
- ai_summaries;
- whatsapp_messages;
- audit_logs;
- ai_logs.

Requisito estrutural:

O sistema precisa ser multi-tenant. Cada escritorio deve acessar apenas seus proprios clientes, casos, documentos, usuarios e logs.

## 18. Permissoes iniciais

Perfis recomendados:

- owner: dono do escritorio, controla configuracoes e usuarios;
- admin: gerencia operacao do escritorio;
- lawyer: acessa e edita casos;
- assistant: cadastra leads, documentos e triagens;
- client: acesso futuro ao portal.

No MVP, pode comecar com owner, lawyer e assistant.

## 19. Seguranca, LGPD e auditoria

Pontos essenciais desde o inicio:

- isolamento por organizacao;
- controle de acesso por usuario;
- logs de operacoes sensiveis;
- armazenamento seguro de documentos;
- URLs assinadas para download de arquivos;
- politica de retencao de arquivos;
- termos de uso e politica de privacidade;
- consentimento para uso de dados na triagem;
- mascaramento de dados sensiveis quando possivel;
- registro de prompts e respostas de IA.

Dados juridicos podem conter informacoes sensiveis. Por isso, seguranca e auditoria nao devem ser deixadas para uma fase muito distante.

## 20. Riscos principais

### Produto grande demais

Risco:

Tentar construir CRM, IA, WhatsApp, financeiro, portal, DataJud e marketing ao mesmo tempo.

Mitigacao:

Comecar apenas com pre-atendimento trabalhista, checklist e IA.

### Integracao com WhatsApp cedo demais

Risco:

Gastar muito tempo com API, templates, webhooks, cobranca e regras antes de validar valor.

Mitigacao:

No MVP, usar link wa.me, botao copiar e operacao semi-manual.

### IA prometendo analise juridica

Risco:

Gerar conclusoes juridicas sem revisao do advogado.

Mitigacao:

IA deve gerar rascunhos, resumos e sugestoes. A decisao e sempre do advogado.

### Baixa diferenciacao

Risco:

Virar apenas mais um CRM juridico.

Mitigacao:

Focar no fluxo de entrada do lead trabalhista, documentos e organizacao pre-consulta.

### Marketing juridico sensivel

Risco:

Gerar conteudo que viole regras eticas da advocacia.

Mitigacao:

Modulo de marketing deve ter checklist de conformidade e tom educativo.

## 21. Metricas de sucesso

Metricas de validacao:

- numero de advogados entrevistados;
- taxa de interesse;
- numero de pilotos pagos;
- feedback sobre principal dor;
- disposicao de pagamento.

Metricas do MVP:

- leads cadastrados por escritorio;
- percentual de leads com triagem completa;
- percentual de casos com documentos completos;
- tempo medio ate analise do advogado;
- casos convertidos em consulta;
- casos convertidos em contrato;
- mensagens prontas copiadas;
- resumos de IA gerados;
- usuarios ativos por semana.

Metricas comerciais:

- MRR;
- churn;
- ticket medio;
- CAC;
- LTV;
- conversao de trial para pago;
- receita de setup.

## 22. Decisoes recomendadas

Decisao 1:

Comecar com advogados trabalhistas e nao com todas as areas juridicas.

Decisao 2:

Construir primeiro o pre-atendimento, nao o acompanhamento processual.

Decisao 3:

Usar WhatsApp de forma assistida no MVP, sem API oficial no inicio.

Decisao 4:

IA deve gerar resumo, checklist e mensagem, nao parecer juridico definitivo.

Decisao 5:

DataJud deve entrar como modulo premium depois da validacao.

Decisao 6:

O produto deve ser multi-tenant desde o primeiro dia.

## 23. Ordem de execucao recomendada

1. Criar landing page de validacao.
2. Criar roteiro de entrevista com advogados trabalhistas.
3. Criar prototipo visual do fluxo principal.
4. Conversar com 10 a 20 advogados.
5. Ajustar oferta com base no feedback.
6. Vender 2 pilotos pagos.
7. Construir MVP do pre-atendimento.
8. Implantar nos primeiros escritorios.
9. Medir uso real.
10. Adicionar financeiro/documentos somente depois de uso ativo.

## 24. Primeira versao do backlog

Prioridade alta:

- autenticar usuario;
- criar escritorio;
- cadastrar cliente;
- cadastrar lead;
- criar caso;
- mover caso no Kanban;
- preencher triagem trabalhista;
- exibir checklist por tipo de caso;
- fazer upload de documento;
- gerar resumo com IA;
- copiar mensagem para WhatsApp;
- visualizar dashboard basico.

Prioridade media:

- customizar pipeline;
- editar perguntas de triagem;
- criar novos tipos de caso;
- comentar no caso;
- anexar documentos manualmente;
- exportar resumo em PDF;
- registrar origem do lead;
- filtro por responsavel.

Prioridade baixa para o MVP:

- WhatsApp Cloud API;
- DataJud;
- financeiro completo;
- portal do cliente completo;
- marketing juridico;
- assinatura recorrente;
- relatorios avancados.

## 25. Fontes e referencias externas

- OAB - Provimento 205/2021 sobre publicidade e informacao da advocacia: https://www.oab.org.br/leisnormas/legislacao/provimentos/205-2021
- CNJ - API Publica do DataJud: https://www.cnj.jus.br/sistemas/datajud/api-publica/
- DataJud Wiki - Acesso e autenticacao: https://datajud-wiki.cnj.jus.br/api-publica/acesso/
- DataJud Wiki - Endpoints por tribunal: https://datajud-wiki.cnj.jus.br/api-publica/endpoints/
- WhatsApp Business Platform Pricing: https://whatsappbusiness.com/products/platform-pricing/
- WhatsApp Cloud API - documentacao tecnica via colecao oficial no Postman: https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api

## 26. Proximo passo sugerido

Antes de escrever codigo, o proximo passo deve ser criar dois documentos complementares:

1. `docs/validacao-comercial-jurisflow.md`
   - roteiro de entrevista;
   - perguntas para advogados;
   - hipoteses a validar;
   - oferta do piloto;
   - criterios para seguir ou pivotar.

2. `docs/prd-mvp-jurisflow.md`
   - requisitos detalhados do MVP;
   - telas;
   - regras de negocio;
   - criterios de aceite;
   - modelo de dados inicial;
   - plano de sprints.

Depois desses dois documentos, o projeto pode seguir para prototipo visual ou implementacao do MVP.
