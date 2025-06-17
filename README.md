# **API de Enquetes (Polls)**

## **Descrição do Projeto**

Esta API foi desenvolvida para gerenciar enquetes de forma eficiente e escalável. Com ela, é possível criar enquetes, permitir que os usuários votem em opções específicas e acompanhar os resultados em tempo real. A API utiliza tecnologias modernas para garantir alta performance e facilidade de manutenção.

---
## **Diagrama do fluxo da aplicação**

```
        [USUÁRIO]
             |
             |  1. O usuário decide criar uma nova enquete.
             v
[A. Rota: POST /polls]
   (Arquivo: src/http/routes/create-poll.ts)
   - Recebe "title" e "options" na requisição.
   - Valida os dados com Zod.
             |
             v
[B. Banco de Dados (PostgreSQL)]
   - O Prisma cria um novo registro na tabela `Poll` e
     seus respectivos `PollOptions`.
             |
             v
[C. Resposta para o USUÁRIO]
   - Retorna o `pollId` da nova enquete.
             |
             |  2. USUÁRIOs (A, B, C) agora podem interagir com a enquete.
             |     - USUÁRIO A vai votar.
             |     - USUÁRIOs B e C vão observar os resultados.
             |
   +--------------------------------+--------------------------------------+
   |                                |                                      |
   v                                v                                      v
[D. USUÁRIO A - Vota]      [E. USUÁRIO B - Observa]               [F. USUÁRIO C - Observa]
   - Envia um POST para        - Conecta-se ao WebSocket:               - Conecta-se ao WebSocket:
     `/polls/:pollId/votes`      `/polls/:pollId/results`               `/polls/:pollId/results`
   (Arquivo: `vote-on-poll.ts`) (Arquivo: `poll-results.ts`) (Arquivo: `poll-results.ts`)
             |
             v
[G. Lógica de Votação]
   - O servidor processa o voto:
     1. Salva no PostgreSQL.
     2. Incrementa a contagem no Redis.
     3. Retorna 201 Created para o USUÁRIO A.
             |
             v
[H. Pub/Sub Interno (VotingPugSub)]
   - A lógica de votação publica uma mensagem
     com o resultado do voto.
             |
             v
[I. Distribuição via WebSocket]
   (Arquivo: `poll-results.ts`)
   - O servidor WebSocket, que ouve o Pub/Sub,
     recebe a mensagem.
             |
             |
   +---------+--------------------+
   |                              |
   v                              v
[J. USUÁRIO B - Recebe]        [K. USUÁRIO C - Recebe]
   - Recebe a atualização         - Recebe a atualização
     em tempo real.                 em tempo real.
```


## **Funcionalidades**

1. **Criação de Enquetes**:
   - Endpoint: `POST /polls`
   - Permite criar uma enquete com um título e múltiplas opções.

2. **Votação em Enquetes**:
   - Endpoint: `POST /polls/:pollId/votes`
   - Permite que os usuários votem em uma opção específica de uma enquete.

3. **Obtenção de Detalhes de uma Enquete**:
   - Endpoint: `GET /polls/:pollId`
   - Retorna os detalhes de uma enquete, incluindo as opções e a contagem de votos.

4. **Listagem de Enquetes**:
   - Endpoint: `GET /polls`
   - Retorna uma lista de enquetes com suporte a paginação e filtro por nome.
   - **Parâmetros de Query**:
     - `page` (opcional): Número da página (padrão: `1`).
     - `limit` (opcional): Quantidade de enquetes por página (padrão: `10`, máximo: `100`).
     - `search` (opcional): Filtro para buscar enquetes pelo título (case-insensitive).
   - **Resposta**:
     <details>
     <summary>Exemplo de Resposta</summary>

     ```json
     {
       "data": [
         {
           "id": "123e4567-e89b-12d3-a456-426614174000",
           "nome": "Qual é a sua linguagem favorita?",
           "createdAt": "2023-10-01T12:00:00.000Z"
         },
         {
           "id": "123e4567-e89b-12d3-a456-426614174001",
           "nome": "Qual é o melhor framework?",
           "createdAt": "2023-10-02T15:30:00.000Z"
         }
       ],
       "meta": {
         "total": 15,
         "page": 1,
         "limit": 10,
         "totalPages": 2
       }
     }
     ```
     </details>

5. **Resultados em Tempo Real**:
   - Endpoint WebSocket: `/polls/:pollId/results`
   - Permite acompanhar os resultados de uma enquete em tempo real via WebSocket.

---

## **Tecnologias Utilizadas**

- [**Fastify**](https://www.fastify.io/): Framework web rápido e eficiente.
- [**Prisma**](https://www.prisma.io/): ORM para interagir com o banco de dados PostgreSQL.
- [**Redis**](https://redis.io/): Utilizado para gerenciar contagens de votos e publicar atualizações em tempo real.
- [**WebSockets**](https://developer.mozilla.org/pt-BR/docs/Web/API/WebSockets_API): Para comunicação em tempo real.
- [**TypeScript**](https://www.typescriptlang.org/): Para tipagem estática e maior segurança no desenvolvimento.

---

## **Configuração do Ambiente**

### **Pré-requisitos**

- Node.js (versão 18 ou superior)
- Docker e Docker Compose

### **Passos para Configuração**

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd API-Polls
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados e o Redis com Docker Compose:
   ```bash
   docker-compose up -d
   ```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com a variável `DATABASE_URL` apontando para o banco PostgreSQL.

5. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

6. Inicie o servidor:
   ```bash
   npm run dev
   ```

---

## **Estrutura do Projeto**

- **`src/http/routes`**: Contém as rotas HTTP para criar enquetes, votar, listar e obter detalhes.
- **`src/http/ws`**: Contém a implementação do WebSocket para resultados em tempo real.
- **`src/lib`**: Configurações do Prisma e Redis.
- **`src/utils`**: Utilitário para gerenciar publicação e assinatura de eventos de votação.

---

## **Endpoints**

### **1. Criar Enquete**
- **URL**: `POST /polls`
- **Body**:
  ```json
  {
    "title": "Qual é a sua linguagem favorita?",
    "options": ["JavaScript", "Python", "Java"]
  }
  ```
<details>
<summary>Exemplo de Resposta</summary>

```json
{
  "pollId": "123e4567-e89b-12d3-a456-426614174000"
}
```
</details>

---

### **2. Votar em uma Opção**
- **URL**: `POST /polls/:pollId/votes`
- **Body**:
  ```json
  {
    "pollOptionId": "1"
  }
  ```
<details>
<summary>Exemplo de Resposta</summary>

```json
{
  "status": 201
}
```
</details>

---

### **3. Obter Detalhes da Enquete**
- **URL**: `GET /polls/:pollId`
<details>
<summary>Exemplo de Resposta</summary>

```json
{
  "poll": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Qual é a sua linguagem favorita?",
    "options": [
      {
        "id": "1",
        "title": "JavaScript",
        "score": 10
      },
      {
        "id": "2",
        "title": "Python",
        "score": 5
      }
    ]
  }
}
```
</details>

---

### **4. Listar Enquetes**
- **URL**: `GET /polls`
- **Parâmetros de Query**:
  - `page` (opcional): Número da página (padrão: `1`).
  - `limit` (opcional): Quantidade de enquetes por página (padrão: `10`, máximo: `100`).
  - `search` (opcional): Filtro para buscar enquetes pelo título (case-insensitive).
<details>
<summary>Exemplo de Resposta</summary>

```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "nome": "Qual é a sua linguagem favorita?",
      "createdAt": "2023-10-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```
</details>

---

### **5. Resultados em Tempo Real**
- **URL**: WebSocket `/polls/:pollId/results`
<details>
<summary>Exemplo de Mensagem</summary>

```json
{
  "pollOptionId": "123e4567-e89b-12d3-a456-426614174001",
  "votes": 42
}
```
</details>

---

## **Contribuição**

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

## **Licença**

Este projeto está licenciado sob a licença [MIT](https://opensource.org/licenses/MIT). Consulte o arquivo `LICENSE` para mais informações.
