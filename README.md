# 🎓 API de Ofertas de Bolsas - Quero Educação

![NestJS](https://img.shields.io/badge/NestJS-v11.0.1-red?style=for-the-badge&logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.3-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-blue?style=for-the-badge&logo=docker)
![Swagger](https://img.shields.io/badge/Swagger-green?style=for-the-badge&logo=swagger)

API RESTful para consultar ofertas de bolsas de estudo com filtros, ordenação e paginação. Solução completa para o Desafio de Back-End da Quero Educação.

## 🤔 O que esta API faz?

Esta API permite buscar e filtrar ofertas de bolsas de estudo de faculdades, com várias opções:

- 🔍 **Buscar cursos** por nome (ex: "medicina", "direito")
- 🏫 **Filtrar** por modalidade (presencial ou EaD) e nível (bacharelado, tecnólogo, etc)
- 💰 **Filtrar por preço** (mínimo e máximo)
- ⬆️ **Ordenar** por nome, preço ou avaliação
- 📄 **Paginar** resultados para melhor navegação
- 🧩 **Selecionar campos específicos** para obter apenas o que precisa

## 🚀 Como começar (passo a passo)

### Opção 1: Docker (Mais fácil - Recomendado)

Se você tem o Docker instalado, esta é a forma mais simples de começar:

1. Clone o repositório:
   ```bash
   git clone https://github.com/NetoOtavio/quero-challenge-backend.git
   cd quero-challenge-backend
   ```

2. Crie um arquivo de configuração:
   ```bash
   copy .env.example .env
   ```
   > ℹ️ No Windows use `copy` em vez de `cp`

3. Inicie a aplicação com Docker:
   ```bash
   docker-compose up --build
   ```
   > ⏳ Aguarde até ver a mensagem "Application is running on: http://localhost:3000"

4. Pronto! Acesse:
   - API: http://localhost:3000/offers
   - Documentação Swagger: http://localhost:3000/api

### Opção 2: Instalação Manual

Se preferir rodar sem Docker:

1. Clone o repositório:
   ```bash
   git clone https://github.com/NetoOtavio/quero-challenge-backend.git
   cd quero-challenge-backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados PostgreSQL:
   - Crie um banco de dados chamado `quero_challenge`
   - Ou no Windows/Linux: `createdb quero_challenge`
   - Ou crie manualmente pelo pgAdmin ou ferramenta similar

4. Configure as variáveis de ambiente:
   ```bash
   copy .env.example .env
   ```
   > ⚠️ Edite o arquivo `.env` e ajuste `DATABASE_URL` para seu ambiente

5. Inicie a aplicação:
   ```bash
   npm run start:dev
   ```

6. Pronto! Acesse:
   - API: http://localhost:3000/offers
   - Documentação Swagger: http://localhost:3000/api

## 📚 Como usar a API

### Documentação Swagger Interativa

A maneira mais fácil de explorar e testar a API é usando a interface Swagger:

1. Acesse [http://localhost:3000/api](http://localhost:3000/api) no navegador
2. Você verá todas as rotas disponíveis com documentação detalhada
3. Clique em qualquer endpoint para expandir
4. Teste diretamente pela interface:
   - Preencha os parâmetros desejados
   - Clique em "Execute"
   - Veja os resultados na mesma página!

![Swagger UI](https://i.imgur.com/JHHIRnn.png)

### Endpoint Principal: GET /offers

Este é o endpoint principal da API para listar ofertas de bolsas com várias opções de filtro:

## 📡 Parâmetros da API

A API aceita vários parâmetros para filtrar, ordenar e paginar os resultados:

### GET /offers

Lista ofertas com filtros, ordenação e paginação.

#### Parâmetros

| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `courseName` | string | Busca por nome (case-insensitive) | `medicina` |
| `kind` | string | Modalidade: `presencial`, `ead` | `presencial` |
| `level` | string | Nível: `bacharelado`, `tecnologo`, `licenciatura` | `bacharelado` |
| `minPrice` | number | Preço mínimo | `200.00` |
| `maxPrice` | number | Preço máximo | `800.00` |
| `sortBy` | string | Ordenar por: `courseName`, `offeredPrice`, `rating` | `offeredPrice` |
| `orderBy` | string | Direção: `ASC`, `DESC` | `DESC` |
| `page` | number | Página (min: 1) | `2` |
| `limit` | number | Itens por página (min: 1) | `20` |
| `fields` | string | Campos específicos (separados por vírgula) | `courseName,offeredPrice` |

#### Resposta
```json
{
  "data": [
    {
      "id": 1,
      "courseName": "Medicina",
      "kind": "Presencial",
      "level": "Graduação (bacharelado)",
      "fullPrice": "R$ 1.200,00",
      "offeredPrice": "R$ 876,00",
      "discountPercentage": "27%",
      "rating": 4.8
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📊 Exemplos de Uso

```bash
# Buscar cursos de medicina
curl "http://localhost:3000/offers?courseName=medicina&limit=5"

# Filtrar por modalidade e preço
curl "http://localhost:3000/offers?kind=presencial&minPrice=300&maxPrice=800"

# Busca complexa
curl "http://localhost:3000/offers?courseName=engenharia&level=bacharelado&sortBy=rating&orderBy=DESC"
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente (.env)

Você pode personalizar a configuração editando o arquivo `.env`:

```env
# Banco de Dados
DATABASE_URL=postgres://user:password@host:port/database

# Aplicação
PORT=3000
NODE_ENV=development

# Docker (opcional)
POSTGRES_DB=quero_challenge
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
```

### Comandos Docker Úteis

```bash
# Iniciar em segundo plano
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f app

# Parar a aplicação
docker-compose down

# Reconstruir completamente (útil após alterações)
docker-compose down -v && docker-compose up --build
```

## 🧪 Como Executar os Testes

### Guia Passo a Passo para Testes

1. **Preparação**: Certifique-se de ter instalado as dependências
   ```bash
   npm install
   ```

2. **Testes Unitários**: Verificam componentes individuais
   ```bash
   npm run test
   ```
   > 💡 Estes testes são rápidos e não precisam de banco de dados

3. **Testes End-to-End**: Testam a API completa
   ```bash
   npm run test:e2e
   ```
   > ⏱️ Estes testes criam um banco temporário e podem demorar mais

4. **Relatório de Cobertura**: Gera relatório detalhado
   ```bash
   npm run test:cov
   ```
   > 📊 Após executar, você pode ver arquivos HTML com a cobertura

### O Que é Testado?

Nossos testes verificam todos os aspectos importantes da API:

- ✅ Filtros por nome, modalidade, nível e faixa de preço
- ✅ Ordenação por diferentes campos
- ✅ Paginação e cálculo correto de metadados
- ✅ Seleção de campos específicos na resposta
- ✅ Formatação correta de dados (preços, percentuais, etc)
- ✅ Validação de parâmetros e tratamento de erros

## 🛠️ Stack Técnica

Esta API foi construída com tecnologias modernas:

- **NestJS** v11.0.1 - Framework Node.js poderoso e organizado
- **TypeScript** v5.7.3 - JavaScript com tipagem para maior segurança
- **TypeORM** v0.3.26 - Mapeamento objeto-relacional para banco de dados
- **PostgreSQL** v14 - Banco de dados relacional robusto
- **Docker** - Containerização para facilitar a execução
- **Swagger** - Documentação interativa da API
- **Jest** - Framework de testes

## 🎨 Funcionalidades e Formatações

### Formatação Automática de Dados

A API aplica várias formatações para melhorar a experiência:

```
// Modalidades de ensino
presencial → Presencial 🏫
ead → EaD 🏠

// Níveis acadêmicos
bacharelado → Graduação (bacharelado) 🎓
tecnologo → Graduação (tecnólogo) 🎓
licenciatura → Graduação (licenciatura) 🎓

// Valores monetários
1200.50 → R$ 1.200,50

// Cálculo de desconto
discountPercentage = Math.round(((fullPrice - offeredPrice) / fullPrice) * 100)
```

## ✅ Recursos Implementados

### Funcionalidades da API
- [x] Carga automática de dados do `data.json`
- [x] Formatação de modalidades e níveis
- [x] Valores monetários em formato brasileiro
- [x] Cálculo e exibição de percentual de desconto
- [x] Filtros por múltiplos critérios
- [x] Busca por nome (case-insensitive)
- [x] Ordenação personalizada
- [x] Paginação com metadados completos
- [x] Seleção de campos específicos

### Extras para Desenvolvedores
- [x] Documentação Swagger interativa e detalhada
- [x] Containerização Docker completa
- [x] Validação robusta de entradas
- [x] Arquitetura modular bem estruturada
- [x] Suíte completa de testes automatizados

---

<p align="center">
  <b>Desenvolvido para o Desafio Quero Educação</b><br>
  <small>API de Bolsas de Estudo - 2023</small>
</p>