# 🚀 SEMA Youth App - Deploy no Vercel

## 📋 **PASSOS PARA DEPLOY:**

### **1. Execute o Script SQL no Neon**

Antes do deploy, execute o script no seu banco Neon:

```sql
-- Use o arquivo: scripts/01_neon_only_setup.sql
-- Execute no console do Neon Database
```

### **2. Configure as Variáveis de Ambiente no Vercel**

No painel do Vercel, vá em **Settings > Environment Variables** e adicione:

```bash
# Neon Database
DATABASE_URL=postgresql://username:password@hostname/database

# App Configuration
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### **3. Deploy no Vercel**

```bash
# Conecte seu repositório GitHub ao Vercel
# Ou use o CLI:
vercel --prod
```

## 🔧 **CONFIGURAÇÕES DE PRODUÇÃO:**

### **Variáveis de Ambiente Necessárias:**
- `DATABASE_URL` - URL do seu banco Neon
- `NEXT_PUBLIC_APP_URL` - URL da sua aplicação

### **Scripts SQL Executados:**
- ✅ Tabelas criadas
- ✅ Dados de exemplo inseridos
- ✅ Triggers de notificação configurados

## 👥 **USUÁRIOS DE TESTE:**

Após o deploy, use estas credenciais:

- **Admin:** admin@sema.org.br / sema2024admin
- **Professor:** professor@sema.org.br / sema2024prof  
- **Aluno:** joao@email.com / sema2024aluno

## 🎯 **FUNCIONALIDADES DISPONÍVEIS:**

- ✅ Login funcional
- ✅ Gestão de usuários
- ✅ Sistema de atividades
- ✅ Sistema de presença
- ✅ Sistema de notificações
- ✅ APIs REST completas

## 📱 **TESTANDO EM PRODUÇÃO:**

1. Acesse sua URL do Vercel
2. Vá para `/auth/login`
3. Use as credenciais de teste
4. Teste todas as funcionalidades

---

**🎉 Pronto para deploy! Execute o script SQL e faça o deploy no Vercel!**
