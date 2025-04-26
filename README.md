# **API de Enquetes (Polls)**

## **Descrição do Projeto**

Esta API foi desenvolvida para gerenciar enquetes de forma eficiente e escalável. Com ela, é possível criar enquetes, permitir que os usuários votem em opções específicas e acompanhar os resultados em tempo real. A API utiliza tecnologias modernas para garantir alta performance e facilidade de manutenção.

---

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

4. **Resultados em Tempo Real**:
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

- **`src/http/routes`**: Contém as rotas HTTP para criar enquetes, votar e obter detalhes.
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
    "title": "Título da Enquete",
    "options": ["Opção 1", "Opção 2"]
  }
  ```

### **2. Votar em uma Opção**
- **URL**: `POST /polls/:pollId/votes`
- **Body**:
  ```json
  {
    "pollOptionId": "ID da Opção"
  }
  ```

### **3. Obter Detalhes da Enquete**
- **URL**: `GET /polls/:pollId`

### **4. Resultados em Tempo Real**
- **URL**: WebSocket `/polls/:pollId/results`

---

## **Contribuição**

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

---

## **Licença**

Este projeto está licenciado sob a licença [MIT](https://opensource.org/licenses/MIT). Consulte o arquivo `LICENSE` para mais informações.
