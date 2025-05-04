
## 📝 Commits semânticos

Utilize mensagens de commit claras e padronizadas para facilitar a leitura e o histórico do projeto.

| Tipo       | Descrição                                                        |
|------------|------------------------------------------------------------------|
| `feat`     | Nova funcionalidade                                              |
| `fix`      | Correção de bugs                                                 |
| `refactor` | Refatoração de código (sem adicionar feature ou corrigir bug)   |
| `docs`     | Alterações na documentação                                       |

### 📌 Exemplos de uso:

```bash
git commit -m "feat: adicionar fila de e-mails com Bull"
git commit -m "fix: corrigir erro de validação de token"
git commit -m "refactor: extrair lógica de autenticação para middleware"
git commit -m "docs: atualizar instruções de uso da API"
```

## 🧩 Versionamento

Sempre trabalhe em uma branch separada da `main`, nomeando-a com base na tarefa ou funcionalidade. Isso ajuda a manter o repositório organizado e facilita os reviews.

#### 📌 Padrão de nomenclatura de branches:

- `feature/nome-da-feature`
- `bugfix/corrigir-algo`
- `hotfix/correcao-emergencial`
- `refactor/reestruturacao-modulo`
- `docs/atualizar-readme`

#### 🛠️ Exemplo:

```bash
# 1. Garanta que está na branch main
git checkout main

# 2. Atualize a main com a última versão do repositório remoto
git pull origin main

# 3. Crie e acesse a nova branch a partir da main
git checkout -b feature/adicionar-autenticacao

# (...trabalhe na sua feature...)

# 4. Após merge da branch no repositório remoto, você pode deletar a branch
git checkout main
git pull origin main
git branch -d feature/adicionar-autenticacao
```

