import fastify from "fastify";
import cors from "@fastify/cors";
import { env } from "../env";

const app = fastify();

// Configuração de CORS: Essencial para que o Front-end (/web) consiga acessar a API
app.register(cors, {
  origin: "*", // Em produção, substitua pelo domínio do seu front-end
});

// Rota de Health Check (Teste inicial)
app.get("/health", async () => {
  return { status: "ok", message: "Brev.ly API is running" };
});

// Inicialização do Servidor
app
  .listen({
    host: "0.0.0.0", // Necessário para Docker e acessos externos
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server Running on http://localhost:${env.PORT}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
