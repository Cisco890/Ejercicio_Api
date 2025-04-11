# Etapa 1: Construcción
FROM node:22-alpine 

# Instalar OpenSSL (necesario para Prisma)
RUN apk add --no-cache openssl

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar los archivos de dependencias primero
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código al contenedor
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Exponer el puerto en el que corre Express (puedes ajustarlo si usas otro)
EXPOSE 3000

# Comando para ejecutar la app
CMD ["npm", "start"]
