# Use a imagem oficial do Bun
FROM oven/bun:1

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos de configuração do projeto
COPY package*.json ./

# Instala as dependências
RUN bun install --production

# Copia o restante do código fonte
COPY . .

# Expõe a porta que o servidor usa
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["bun", "src/app.ts"]