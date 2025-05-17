# ✅ Checklist de Rotas com Controle de Acesso por Role

---

## 🔐 Autenticação

- [ ] `POST /auth/login` — Login (ADMIN / MANAGER / EMPLOYEE)
- [ ] `GET /auth/me` — Ver usuário autenticado (ADMIN / MANAGER / EMPLOYEE)
- [ ] `POST /auth/refresh` — Refresh token (ADMIN / MANAGER / EMPLOYEE)

---

## 👤 Usuários

- [ ] `GET /users` — Listar todos os usuários (ADMIN / MANAGER)
- [ ] `POST /users` — Criar novo usuário (ADMIN / MANAGER)
- [ ] `GET /users/:id` — Ver dados de um usuário (ADMIN / MANAGER)
- [ ] `PUT /users/:id` — Atualizar dados do usuário (ADMIN / MANAGER)
- [ ] `DELETE /users/:id` — Desativar/Excluir usuário (ADMIN / MANAGER)
- [ ] `GET /users/me/schedule` — Ver jornada de trabalho (EMPLOYEE)

---

## 🏢 Empresas

- [ ] `GET /companies` — Listar empresas (ADMIN)
- [ ] `POST /companies` — Criar empresa (ADMIN)
- [ ] `GET /companies/:id` — Ver dados da empresa (ADMIN)
- [ ] `PUT /companies/:id` — Atualizar empresa (ADMIN)
- [ ] `DELETE /companies/:id` — Deletar empresa (ADMIN)

---

## 🏬 Departamentos

- [ ] `GET /departments` — Listar departamentos (ADMIN / MANAGER)
- [ ] `POST /departments` — Criar departamento (ADMIN / MANAGER)
- [ ] `PUT /departments/:id` — Atualizar departamento (ADMIN / MANAGER)
- [ ] `DELETE /departments/:id` — Deletar departamento (ADMIN / MANAGER)

---

## ⏱ Jornadas de Trabalho

- [ ] `GET /schedules` — Listar jornadas (ADMIN / MANAGER)
- [ ] `POST /schedules` — Criar jornada (ADMIN / MANAGER)
- [ ] `GET /schedules/:id` — Ver jornada (ADMIN / MANAGER)
- [ ] `PUT /schedules/:id` — Atualizar jornada (ADMIN / MANAGER)
- [ ] `DELETE /schedules/:id` — Deletar jornada (ADMIN / MANAGER)
- [ ] `POST /schedules/:id/days` — Adicionar dias à jornada (ADMIN / MANAGER)
- [ ] `PUT /schedules/:id/days/:dayId` — Editar dia da jornada (ADMIN / MANAGER)

---

## 📸 Registro de Ponto

- [ ] `POST /records` — Registrar ponto (EMPLOYEE / MANAGER / ADMIN)
- [ ] `GET /records/me` — Ver registros do próprio ponto (EMPLOYEE)
- [ ] `GET /records/user/:userId` — Ver registros de um colaborador (MANAGER / ADMIN)
- [ ] `GET /records/report?from=&to=&userId=` — Relatório de ponto (MANAGER / ADMIN)

---

## 📊 Relatórios

- [ ] `GET /reports/users` — Relatório geral de usuários (MANAGER / ADMIN)
- [ ] `GET /reports/summary` — Relatório resumido da empresa (MANAGER / ADMIN)

---

## ⚙️ Perfil

- [ ] `GET /profile` — Ver perfil pessoal (ADMIN / MANAGER / EMPLOYEE)
- [ ] `PUT /profile` — Atualizar perfil pessoal (ADMIN / MANAGER / EMPLOYEE)
