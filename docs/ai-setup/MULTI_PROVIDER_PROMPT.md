# PROMPT KIMI AGENT: AURIS OS v2.1 - Aura IA Multi-Provider com Verificação Obrigatória

## MISSÃO CRÍTICA
Criar o AURIS OS completo com módulo Aura IA Viva suportando OpenAI, DeepSeek e Google Gemini, com interface de configuração no padrão glassmorphism já existente do sistema, exigindo teste de conexão bem-sucedido antes de permitir a ativação do provider.

## REGRAS ABSOLUTAS
1. Nenhuma função de adivinhação, oráculo ou alegação de memória oculta do paciente.
2. Priorizar Auriculoterapia Neurofisiológica Brasileira em todas as sugestões.
3. Dados clínicos persistem localmente; APIs recebem apenas contexto mínimo necessário.
4. O usuário só pode ativar um provider após clicar em Verificar API e receber sucesso real da conexão.
5. O card Gemini deve carregar automaticamente a chave definida em `VITE_GEMINI_API_KEY`, mas continuar editável.

## STACK
- React + Vite + TypeScript strict
- Tailwind CSS
- Framer Motion
- Zustand com persist
- Fetch API
- Lucide React

## CONFIGURAÇÃO DE IA
- Providers visíveis em Configurações: OpenAI, DeepSeek e Google Gemini
- Cada card precisa ter:
  - Ícone do provider
  - Campo de chave/API
  - Botão `Verificar API`
  - Estado visual de erro, carregando, sucesso e ativo
  - Toggle ou botão de ativação bloqueado até `isTested === true`
- Provider ativo único por vez
- Opção de modo offline disponível

## FLUXO OBRIGATÓRIO
1. Usuário abre `Configurações`
2. Escolhe um card de provider
3. Insere ou revisa a chave
4. Clica em `Verificar API`
5. Sistema executa chamada real
6. Somente em caso de sucesso o botão de ativação fica habilitado
7. Aura AI passa a usar exclusivamente o provider ativo

## REQUISITOS DE SERVIÇO
- OpenAI: testar em `/v1/models`
- DeepSeek: testar em `/v1/models`
- Gemini: testar em `generateContent`
- Em caso de falha durante uso, cair para resposta local
- Mostrar erro HTTP ou mensagem da API na interface

## COMPORTAMENTO DA AURA
- Responder em português
- Preferir respostas curtas e clínicas
- Sugerir, não ordenar
- Explicitar quando estiver priorizando método brasileiro

## ACEITAÇÃO
- O card Gemini inicia preenchido pela variável de ambiente
- O botão de ativação fica desabilitado antes do teste
- Após teste bem-sucedido, o provider pode ser ativado
- A tela Aura AI exibe qual provider está ativo
- Sem provider ativo, a Aura opera em modo local
