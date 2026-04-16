# Configuração do DeepSeek API - AURIS OS

Este guia passo a passo vai te ajudar a configurar a integração com a API do DeepSeek no AURIS OS.

---

## Passo 1: Criar uma conta no DeepSeek

1. Acesse o site oficial: https://platform.deepseek.com
2. Clique em "Sign Up" ou "Register"
3. Preencha seus dados:
   - Email válido
   - Senha segura
   - Confirme o email através do link enviado

---

## Passo 2: Gerar sua API Key

1. Faça login na plataforma DeepSeek
2. No menu lateral, clique em **"API Keys"**
3. Clique no botão **"Create API Key"**
4. Dê um nome para sua chave (ex: "AURIS OS")
5. Clique em **"Create"**
6. **IMPORTANTE**: Copie a chave gerada imediatamente!
   - A chave só é mostrada uma vez
   - Guarde em um local seguro
   - Formato: `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Passo 3: Adicionar créditos na conta (opcional mas recomendado)

1. No menu lateral, clique em **"Billing"**
2. Clique em **"Add Credit"**
3. Escolha o valor (mínimo geralmente $5)
4. Complete o pagamento com cartão de crédito

**Preços do DeepSeek (atualizados):**
- DeepSeek-V3: $0.14 por milhão de tokens (input) / $0.28 (output)
- DeepSeek-R1: $0.55 por milhão de tokens (input) / $2.19 (output)

---

## Passo 4: Configurar no AURIS OS

### Opção A: Configuração via Interface (Recomendado)

1. Abra o AURIS OS
2. Vá em **Configurações** (ícone de engrenagem)
3. Procure a seção **"Integrações de IA"**
4. Ative a opção **"Usar DeepSeek API"**
5. Cole sua API Key no campo indicado
6. Clique em **"Salvar"**
7. Clique em **"Testar Conexão"** para verificar

### Opção B: Configuração via Arquivo .env

1. Navegue até a pasta do projeto:
   ```bash
   cd /mnt/okcomputer/output/app
   ```

2. Crie ou edite o arquivo `.env`:
   ```bash
   nano .env
   ```

3. Adicione as seguintes linhas:
   ```env
   # DeepSeek API Configuration
   VITE_DEEPSEEK_API_KEY=sua-chave-aqui
   VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions
   VITE_DEEPSEEK_MODEL=deepseek-chat
   ```

4. Substitua `sua-chave-aqui` pela sua API Key real

5. Salve o arquivo (Ctrl+O, Enter, Ctrl+X no nano)

---

## Passo 5: Verificar a configuração

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Abra o AURIS OS no navegador

3. Abra a **Aura AI**

4. Olhe no canto superior direito:
   - Deve aparecer **"DeepSeek"** em verde
   - Se aparecer "Modo Local", a configuração falhou

5. Envie uma mensagem de teste:
   ```
   Olá, pode me explicar como funciona a auriculoterapia?
   ```

6. A resposta deve vir com a tag **"IA"** indicando que usou a API

---

## Solução de Problemas

### Problema: "Modo Local" aparece mesmo com API Key configurada

**Causas possíveis:**
1. API Key incorreta ou expirada
2. Sem créditos na conta DeepSeek
3. Problema de conexão com a internet
4. CORS bloqueado no navegador

**Soluções:**
1. Verifique se a API Key está completa (começa com `sk-`)
2. Verifique seu saldo no dashboard do DeepSeek
3. Teste a conexão:
   ```bash
   curl https://api.deepseek.com/v1/models \
     -H "Authorization: Bearer sua-api-key"
   ```
4. Verifique o console do navegador (F12) por erros

### Problema: "Erro ao processar solicitação"

**Causas possíveis:**
1. Rate limit excedido
2. Modelo indisponível
3. Timeout na requisição

**Soluções:**
1. Aguarde alguns segundos e tente novamente
2. Verifique o status do DeepSeek: https://status.deepseek.com
3. Tente reduzir o tamanho da mensagem

### Problema: Respostas muito lentas

**Soluções:**
1. Verifique sua conexão de internet
2. O DeepSeek pode estar sobrecarregado
3. Tente usar em horários de menor demanda

---

## Uso da API no Código

### Exemplo de chamada direta:

```typescript
import { callDeepSeek } from '@/services/deepseekService';

const messages = [
  { role: 'user', content: 'Explique o ponto Shen Men' }
];

const resposta = await callDeepSeek(messages);
console.log(resposta);
```

### Verificar disponibilidade:

```typescript
import { isDeepSeekAvailable } from '@/services/deepseekService';

if (isDeepSeekAvailable()) {
  console.log('DeepSeek está configurado e pronto!');
}
```

---

## Limites e Quotas

- **Requisições por minuto**: 60 (plano gratuito)
- **Tokens por dia**: 1.000.000 (plano gratuito)
- **Timeout**: 30 segundos por requisição

---

## Alternativa: OpenAI

Se preferir usar OpenAI em vez de DeepSeek:

1. Acesse https://platform.openai.com
2. Gere uma API Key
3. Configure no arquivo `.env`:
   ```env
   VITE_OPENAI_API_KEY=sua-chave-openai
   VITE_OPENAI_MODEL=gpt-4o-mini
   ```

O sistema prioriza OpenAI se ambas estiverem configuradas.

---

## Suporte

Em caso de dúvidas:
- Documentação DeepSeek: https://platform.deepseek.com/docs
- Email de suporte: support@deepseek.com
- Issues no GitHub do projeto AURIS OS

---

**Data da última atualização**: 2026-04-06
