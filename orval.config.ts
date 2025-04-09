// Importa a função defineConfig do pacote 'orval'
import { defineConfig } from 'orval'
// baseUrl: 'https://tripz-backend-api.azurewebsites.net',

// Exporta a configuração padrão usando a função defineConfig
export default defineConfig({
  client: {
    input: {
      // Define o caminho do arquivo JSON do Swagger que será usado como entrada
      target: 'src/api/swagger/index.json',
    },
    output: {
      // Define o modo de saída como 'split', que gera arquivos separados para cada endpoint
      mode: 'split',
      // Define o caminho do arquivo de saída gerado
      target: 'src/api/generated/api.ts',
      // Define o cliente HTTP a ser usado como 'axios'
      client: 'axios',
      // Habilita a geração de mocks para os endpoints
      mock: true,
      // Define a URL base para as requisições
      baseUrl: 'https://88ad-2804-7f0-b380-8651-20ed-3a47-553b-7af2.ngrok-free.app',
      override: {
        mutator: {
          path: 'src/api/axios.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
