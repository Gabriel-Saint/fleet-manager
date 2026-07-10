# FleetManager

CRUD de veículos de frota com autenticação, construído em Angular 21 com Supabase.

> **Status: em construção.** O núcleo funciona de ponta a ponta — login, cadastro, CRUD de veículos, validações, paginação, notificações — mas ainda vai receber mudanças. Este README acompanha o projeto conforme ele evolui.

---

## O que é

Um gestor de frota simples: você faz login, cadastra veículos (placa, chassi, renavam, marca, modelo, ano), edita, exclui, e cada usuário só vê os próprios veículos.

## Stack

- **Angular 21** — standalone components (é o padrão, nem se escreve mais `standalone: true`), Signals para estado, `@if`/`@for` no lugar de `*ngIf`/`*ngFor`
- **Supabase** — Auth (email/senha) + Postgres + Row Level Security
- **Reactive Forms** — com validadores customizados escritos à mão
- **SCSS puro** — sem Angular Material; um design system próprio construído em cima de CSS custom properties
- **Vitest** — test runner (builder `@angular/build:unit-test`)

## Conceitos explorados

Cada decisão técnica abaixo tem uma razão — não é só "porque funciona".

### Signals em todo lugar
Estado local de componente (`erro`, `carregando`, `salvando`) é sempre um `signal()`. Nada de `BehaviorSubject` pra estado simples de UI.

### `computed()` para estado derivado
A paginação da lista de veículos é o exemplo mais claro: `veiculosPagina` e `totalPaginas` não são guardados em lugar nenhum — são **calculados** a partir de `veiculos()`, `pagina()` e `tamanhoPagina()`. Quando qualquer um desses muda, o `computed` recalcula sozinho e a tabela reage. Zero sincronização manual.

### Validadores customizados como funções puras
`placaValidator`, `chassiValidator`, `renavamValidator` moram em `validators/` e são só `ValidatorFn` — recebem um `AbstractControl`, devolvem `null` ou um objeto de erro. Sem classe, sem Angular, sem `TestBed` pra testar. Placa aceita Mercosul (`ABC1D23`) e o padrão antigo; chassi valida o formato VIN de 17 caracteres (sem I, O, Q); renavam exige 11 dígitos.

Tem também um validador **factory** (`camposIguaisValidator(campoA, campoB)`), que recebe parâmetros e devolve um validador de grupo — usado para conferir se "senha" e "confirmar senha" batem no cadastro. A diferença entre os dois estilos (const direto vs. factory) é proposital: um não precisa de parâmetro, o outro precisa.

### Guard funcional + verificação de sessão
`authGuard` é uma função (`CanActivateFn`), não uma classe. Ele reverifica a sessão do Supabase a cada navegação para uma rota protegida — evita uma race condition onde a sessão ainda não tinha carregado.

### Estado global via serviço + signal
Duas coisas ficam fora dos componentes porque são cross-cutting:
- **`Loading`** — um contador de requisições em voo, liga/desliga um signal booleano. O spinner global no shell só lê esse signal.
- **`Notificacao`** — um toast simples ("Veículo salvo", "Veículo excluído"). Vive no shell (`app.html`), então sobrevive à navegação — se estivesse no componente que dispara a ação, a mensagem sumiria junto quando o componente fosse destruído ao trocar de rota.

Os dois seguem o mesmo padrão: serviço `providedIn: 'root'` expõe um signal, qualquer componente injeta e lê.

### Row Level Security no Postgres
A tabela `veiculos` tem RLS ativo com 4 policies (`auth.uid() = user_id`). Isso significa que a segurança de "cada usuário só vê os próprios dados" está no banco, não só no frontend — mesmo que alguém manipule a chamada, o Postgres barra.

### Design system em CSS custom properties
Nada de Angular Material. `styles.scss` define tokens (`--color-primary`, `--space-4`, `--radius`, etc.) e primitivos reutilizáveis (`.card`, `.btn`, `.field`). O tema escuro é automático via `prefers-color-scheme` — sem JavaScript, sem toggle manual (por enquanto).

---

## Estrutura

```
src/app/
  components/     login, cadastro, navbar, veiculo-list, veiculo-form
  services/       supabase, auth, veiculo, loading, notificacao
  guards/         auth-guard
  interceptors/   auth, loading, error
  validators/     placa, chassi, renavam, campos-iguais
  models/         veiculo, usuario
```

Convenção de nomes: arquivos sem sufixo (`auth.ts` exporta `Auth`, não `auth.service.ts`). É o style guide 2025 do Angular.

## Banco de dados

Tabela `veiculos`: `placa`, `chassi`, `renavam` (todos `unique`), `marca`, `modelo`, `ano`, `user_id` (FK para `auth.users`). RLS cobrindo SELECT/INSERT/UPDATE/DELETE.

## Rodando o projeto

```bash
npm install
ng serve
```

Abre em `http://localhost:4200`. Precisa de um projeto Supabase configurado em `src/environments/` (URL + anon key).

```bash
ng test    # roda os testes (Vitest)
ng build   # build de produção
```

## O que já tem

- Login, cadastro (com confirmação de e-mail) e logout
- CRUD completo de veículos, com paginação client-side (tamanho de página ajustável)
- Validação de placa, chassi, renavam e confirmação de senha
- Confirmação antes de excluir (nada de deletar sem perguntar)
- Notificação de sucesso ao salvar/editar/excluir
- Spinner global de carregamento
- Tema claro/escuro automático
- Testes dos validadores (funções puras, sem `TestBed`)
