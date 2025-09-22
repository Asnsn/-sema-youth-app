# 🚀 SEMA Youth App - Configuração Completa

## 📋 Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **Conta no Supabase** (https://supabase.com)
3. **Conta no Neon Database** (https://neon.tech)
4. **Git** instalado

## 🔧 Configuração do Banco de Dados

### 1. Configurar Supabase

1. Acesse [Supabase](https://supabase.com) e crie um novo projeto
2. Vá em **Settings > API** e copie:
   - `Project URL`
   - `anon public key`
   - `service_role key`

### 2. Configurar Neon Database

1. Acesse [Neon](https://neon.tech) e crie um novo projeto
2. Copie a **Connection String** do seu banco

### 3. Executar Scripts SQL

Execute os scripts na seguinte ordem no seu banco Neon:

```bash
# 1. Schema principal
psql "sua_connection_string" -f scripts/001_create_database_schema.sql

# 2. Dados de exemplo
psql "sua_connection_string" -f scripts/002_create_sample_data.sql

# 3. Triggers
psql "sua_connection_string" -f scripts/003_create_profile_trigger.sql

# 4. Usuários de teste
psql "sua_connection_string" -f scripts/004_create_test_users.sql

# 5. Sistema de notificações
psql "sua_connection_string" -f scripts/005_create_notifications_table.sql
```

## 🔑 Configuração das Variáveis de Ambiente

1. Copie o arquivo `env.example` para `.env.local`:

```bash
cp env.example .env.local
```

2. Preencha as variáveis no `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_supabase_service_role_key

# Database Configuration
DATABASE_URL=sua_neon_connection_string

# Email Configuration (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Instalação e Execução

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em desenvolvimento:**
```bash
npm run dev
```

3. **Acessar a aplicação:**
```
http://localhost:3000
```

## 👥 Usuários de Teste

Após executar os scripts SQL, você terá os seguintes usuários:

### Admin
- **Email:** admin@sema.org.br
- **Senha:** sema2024admin
- **Acesso:** Dashboard administrativo completo

### Professor
- **Email:** professor@sema.org.br
- **Senha:** sema2024prof
- **Acesso:** Gerenciamento de atividades e alunos

### Aluno
- **Email:** aluno@sema.org.br
- **Senha:** sema2024aluno
- **Acesso:** Visualização de atividades e inscrições

## 📱 Funcionalidades Implementadas

### ✅ Autenticação
- Login/Logout com Supabase Auth
- Proteção de rotas por role
- Middleware de autenticação

### ✅ Gestão de Usuários
- CRUD completo de usuários
- Separação por abas (Alunos/Professores)
- Perfis com informações completas

### ✅ Gestão de Atividades
- CRUD completo de atividades
- Categorização por tipo
- Controle de vagas e horários

### ✅ Sistema de Inscrições
- Inscrição em atividades
- Controle de capacidade
- Lista de espera automática

### ✅ Sistema de Presença
- Registro de presença por atividade
- Histórico de frequência
- Relatórios de presença

### ✅ Sistema de Notificações
- Notificações automáticas
- Email de confirmação
- Alertas de eventos

## 🔧 APIs Disponíveis

### Usuários
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário

### Atividades
- `GET /api/activities` - Listar atividades
- `POST /api/activities` - Criar atividade

### Inscrições
- `GET /api/enrollments` - Listar inscrições
- `POST /api/enrollments` - Criar inscrição

### Presença
- `GET /api/attendance` - Listar presenças
- `POST /api/attendance` - Registrar presença

### Notificações
- `GET /api/notifications` - Listar notificações
- `POST /api/notifications` - Criar notificação
- `PUT /api/notifications` - Marcar como lida

### Autenticação
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

## 🐛 Solução de Problemas

### Erro de Conexão com Banco
- Verifique se a `DATABASE_URL` está correta
- Confirme se o banco Neon está ativo
- Execute os scripts SQL na ordem correta

### Erro de Autenticação
- Verifique as chaves do Supabase
- Confirme se o projeto Supabase está ativo
- Verifique se as políticas RLS estão configuradas

### Erro de CORS
- Verifique se o `NEXT_PUBLIC_APP_URL` está correto
- Confirme as configurações do Supabase

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do console
2. Confirme as configurações das variáveis de ambiente
3. Execute os scripts SQL na ordem correta
4. Verifique se todas as dependências estão instaladas

## 🎉 Próximos Passos

Após a configuração, você pode:
1. Personalizar as atividades e unidades
2. Adicionar mais usuários
3. Configurar notificações por email
4. Implementar funcionalidades adicionais
