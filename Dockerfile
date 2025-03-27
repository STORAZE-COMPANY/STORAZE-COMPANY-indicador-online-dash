# -------------------------
# Etapa 1 - Build do frontend
# -------------------------
  FROM node:20-alpine AS builder

  WORKDIR /app
  
  # Copia apenas arquivos necessários para instalar dependências inicialmente
  COPY package*.json ./
  COPY vite.config.js ./
  
  # Limpa cache e força instalação limpa para evitar bugs do rollup ARM
  RUN rm -rf node_modules package-lock.json \
    && npm cache clean --force \
    && npm install
  
  # Copia tudo depois da instalação
  COPY . .
  
  # Gera build de produção
  RUN npm run build
  
  # -------------------------
  # Etapa 2 - Servir com nginx
  # -------------------------
  FROM nginx:1.25-alpine
  
  # Remove config padrão do nginx
  RUN rm /etc/nginx/conf.d/default.conf
  
  # Copia config customizada
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  
  # Copia arquivos do build
  COPY --from=builder /app/dist /usr/share/nginx/html
  
  # Expõe porta 80
  EXPOSE 80
  
  # Inicia o nginx em modo daemon off (foreground)
  CMD ["nginx", "-g", "daemon off;"]
  