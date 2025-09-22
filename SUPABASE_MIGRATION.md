# 🚀 Migração para Supabase - SEMA Youth App

## 📋 **PASSO A PASSO PARA MIGRAÇÃO**

### **1. Criar Projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Nome do projeto: `sema-youth-app`
5. Senha do banco: (anote esta senha!)
6. Região: escolha a mais próxima do Brasil
7. Clique em "Create new project"

### **2. Configurar Variáveis de Ambiente**
1. No dashboard do Supabase, vá em **Settings** → **API**
2. Copie as seguintes informações:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. Crie o arquivo `.env.local` na raiz do projeto:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **3. Executar Script de Migração**
1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie e cole o conteúdo do arquivo `scripts/06_supabase_migration.sql`
4. Clique em "Run" para executar o script
5. Aguarde a execução (pode levar alguns minutos)

### **4. Configurar Autenticação**
1. No dashboard do Supabase, vá em **Authentication** → **Settings**
2. Em **Site URL**, adicione:
   - `http://localhost:3000` (para desenvolvimento)
   - `https://your-vercel-app.vercel.app` (para produção)
3. Em **Redirect URLs**, adicione:
   - `http://localhost:3000/auth/callback`
   - `https://your-vercel-app.vercel.app/auth/callback`

### **5. Configurar Email (Opcional)**
1. Em **Authentication** → **Settings** → **SMTP Settings**
2. Configure seu provedor de email (Gmail, SendGrid, etc.)
3. Ou use o email de teste do Supabase para desenvolvimento

### **6. Configurar Confirmação de Email (IMPORTANTE)**

#### **Para Desenvolvimento/Teste:**
```sql
-- Execute no Supabase SQL Editor para desabilitar confirmação de email:
scripts/07_disable_email_confirmation.sql
```

#### **Para Produção:**
```sql
-- Execute no Supabase SQL Editor para habilitar confirmação de email:
scripts/08_enable_email_confirmation.sql
```

### **7. Testar a Migração**
1. Execute `npm run build` para verificar se não há erros
2. Execute `npm run dev` para testar localmente
3. Teste o cadastro de usuários
4. Teste o login

### **8. Solução de Problemas**

#### **Problema: "Credenciais inválidas" após cadastro**
- **Causa:** Usuário precisa confirmar email antes de fazer login
- **Solução:** Execute o script `07_disable_email_confirmation.sql` para desenvolvimento
- **Para produção:** Configure SMTP e mantenha confirmação de email habilitada

### **7. Deploy para Vercel**
1. Configure as variáveis de ambiente no Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL`

2. Faça o deploy:
```bash
git add .
git commit -m "Migrate to Supabase Auth"
git push
```

## ✅ **VANTAGENS DA MIGRAÇÃO**

### **🔐 Autenticação Robusta**
- ✅ Signup/Login automático
- ✅ Confirmação de email
- ✅ Recuperação de senha
- ✅ Sessões seguras
- ✅ JWT tokens

### **🛡️ Segurança**
- ✅ Row Level Security (RLS)
- ✅ Políticas de acesso granulares
- ✅ Proteção contra SQL injection
- ✅ Rate limiting automático

### **📊 Dashboard Administrativo**
- ✅ Gerenciamento de usuários
- ✅ Logs de autenticação
- ✅ Métricas de uso
- ✅ Editor SQL integrado

### **🚀 Performance**
- ✅ APIs automáticas
- ✅ Cache inteligente
- ✅ CDN global
- ✅ Escalabilidade automática

## 🔧 **FUNCIONALIDADES IMPLEMENTADAS**

### **👥 Gestão de Usuários**
- ✅ Cadastro automático de perfis
- ✅ **Sistema de Roles:**
  - 🔹 **Usuários do App:** Sempre `student` (cadastro público)
  - 🔹 **Professores/Admins:** Criados apenas pelo administrador
- ✅ Vinculação com unidades
- ✅ Dados pessoais completos

### **🏢 Gestão de Unidades**
- ✅ Múltiplas unidades
- ✅ Dados de localização
- ✅ Capacidade e contatos

### **📚 Gestão de Atividades**
- ✅ Criação de atividades
- ✅ Vinculação com professores
- ✅ Limites de idade e participantes
- ✅ Horários e dias da semana

### **📝 Sistema de Inscrições**
- ✅ Inscrição em atividades
- ✅ Aprovação de inscrições
- ✅ Status de acompanhamento

### **📊 Sistema de Presença**
- ✅ Marcação de presença
- ✅ Relatórios de frequência
- ✅ Histórico completo

### **📢 Sistema de Notificações**
- ✅ Notificações por usuário
- ✅ Tipos de notificação
- ✅ Status de leitura

## 🎯 **PRÓXIMOS PASSOS**

1. **Executar a migração** seguindo os passos acima
2. **Testar todas as funcionalidades**
3. **Configurar email para produção**
4. **Treinar administradores** no dashboard do Supabase
5. **Implementar funcionalidades adicionais** conforme necessário

## 🆘 **SUPORTE**

Se encontrar problemas durante a migração:
1. Verifique os logs do Supabase
2. Verifique as variáveis de ambiente
3. Teste as APIs no dashboard do Supabase
4. Consulte a documentação do Supabase

**A migração para Supabase tornará o sistema muito mais robusto e fácil de manter!** 🚀
