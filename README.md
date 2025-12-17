# 🎓 SEMA Youth App

Sistema de gestão completo para alunos, professores e administradores da instituição SEMA.


## 🚀 Funcionalidades

### 👨‍💼 **Administradores**
- Gestão completa de usuários (alunos e professores)
- Criação e edição de atividades
- Gestão de unidades SEMA
- Relatórios e estatísticas
- Sistema de notificações

### 👨‍🏫 **Professores**
- Visualização de suas atividades
- Controle de presença dos alunos
- Gestão de alunos inscritos
- Relatórios de frequência

### 👨‍🎓 **Alunos**
- Visualização de atividades disponíveis
- Inscrição em atividades
- Acompanhamento de presença
- Notificações sobre eventos

## 🛠️ Tecnologias

- **Frontend:** Next.js 14, React, TypeScript
- **UI:** Tailwind CSS, Radix UI, shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** Neon (PostgreSQL)
- **Deploy:** Vercel
- **PWA:** Service Worker, Manifest

## 📋 Setup para Deploy

### 1. **Configure o Banco de Dados**
Execute o script SQL no Neon Database:
```sql
-- Use o arquivo: scripts/01_neon_only_setup.sql
```

### 2. **Configure as Variáveis de Ambiente no Vercel**
```bash
DATABASE_URL=postgresql://username:password@hostname/database
NEXT_PUBLIC_APP_URL=https://seu-app.vercel.app
```

### 3. **Deploy no Vercel**
```bash
vercel --prod
```

## 👥 Usuários de Teste

- **Admin:** admin@sema.org.br / sema2024admin
- **Professor:** professor@sema.org.br / sema2024prof  
- **Aluno:** joao@email.com / sema2024aluno

## 📱 Acesso

**Produção:** [https://vercel.com/lostmidiaasn/v0-sema-youth-app](https://vercel.com/lostmidiaasn/v0-sema-youth-app)

## 🏗️ Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── admin/             # Páginas administrativas
│   ├── teacher/           # Páginas do professor
│   ├── student/           # Páginas do aluno
│   ├── auth/              # Autenticação
│   └── api/               # API Routes
├── components/            # Componentes React
├── lib/                   # Utilitários e configurações
├── scripts/               # Scripts SQL
└── public/                # Arquivos estáticos
```

## 🔧 Desenvolvimento

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📄 Licença

Este projeto foi desenvolvido para a instituição SEMA.
