# ✅ Checklist de Rotas com Controle de Acesso por Role

---

## 🔐 Autenticação

- [x] `POST /accounts` — Criar empresa e usuário
- [x] `POST /auth/session` — Login (ADMIN / MANAGER / EMPLOYEE)
- [x] `GET /auth/me` — Ver usuário autenticado (ADMIN / MANAGER / EMPLOYEE) \*17/06
- [ ] `POST /auth/refresh` — Refresh token (ADMIN / MANAGER / EMPLOYEE) \*17/06

---

## ⚙️ Perfil

- [ ] `GET /profile` — Ver perfil pessoal (ADMIN / MANAGER / EMPLOYEE) \*17/06
- [ ] `PUT /profile` — Atualizar perfil pessoal (ADMIN / MANAGER / EMPLOYEE) \*17/06
- [ ] `PUT /change-password` — Alterar senha (ADMIN / MANAGER / EMPLOYEE) \*17/06

---

## 📍 Localizações

- [ ] `GET /locations` — Listar jornadas (ADMIN / MANAGER) \*17/06
- [ ] `POST /locations` — Criar jornada (ADMIN / MANAGER) \*17/06
- [ ] `GET /locations/:id` — Ver jornada (ADMIN / MANAGER) \*17/06
- [ ] `PUT /locations/:id` — Atualizar jornada (ADMIN / MANAGER) \*17/06
- [ ] `DELETE /locations/:id` — Deletar jornada (ADMIN / MANAGER) \*17/06

---

## 🏬 Departamentos

- [ ] `GET /departments` — Listar departamentos (ADMIN / MANAGER) \*17/06
- [ ] `POST /departments` — Criar departamento (ADMIN / MANAGER) \*17/06
- [ ] `PUT /departments/:id` — Atualizar departamento (ADMIN / MANAGER) \*17/06
- [ ] `DELETE /departments/:id` — Deletar departamento (ADMIN / MANAGER) \*17/06

---

## 👤 Usuários

- [ ] `GET /users` — Listar todos os usuários (ADMIN / MANAGER)
- [ ] `POST /users` — Criar novo usuário (ADMIN / MANAGER)
- [ ] `GET /users/:id` — Ver dados de um usuário (ADMIN / MANAGER)
- [ ] `PUT /users/:id` — Atualizar dados do usuário (ADMIN / MANAGER)
- [ ] `DELETE /users/:id` — Desativar/Excluir usuário (ADMIN / MANAGER)
- [ ] `GET /users/me/schedule` — Ver jornada de trabalho (EMPLOYEE)

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

## 🏢 Empresas

- [ ] `GET /companies` — Listar empresas (ADMIN)
- [ ] `GET /companies/:id` — Ver dados da empresa (ADMIN)
- [ ] `PUT /companies/:id` — Atualizar empresa (ADMIN)

---

## 📊 Relatórios

- [ ] `GET /reports/users` — Relatório geral de usuários (MANAGER / ADMIN)
- [ ] `GET /reports/summary` — Relatório resumido da empresa (MANAGER / ADMIN)

---
