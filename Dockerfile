# Estágio 1: Builder - Instala dependências e compila o projeto
FROM node:20-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de definição de pacotes
COPY package*.json ./

# Instala as dependências de produção
RUN npm install

# Copia todo o código-fonte do projeto
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# Estágio 2: Runner - Executa a aplicação compilada
FROM node:20-alpine

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia apenas os pacotes de produção do estágio anterior
COPY --from=builder /usr/src/app/node_modules ./node_modules
# Copia o código compilado do estágio anterior
COPY --from=builder /usr/src/app/dist ./dist

# Expõe a porta que a aplicação vai usar
EXPOSE 3000

# O comando para iniciar a aplicação
CMD ["node", "dist/main"]