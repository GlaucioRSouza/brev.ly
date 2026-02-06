import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Configurações do Servidor
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Banco de Dados (PostgreSQL)
  // Adicionamos um valor default para não quebrar a inicialização sem o .env
  DATABASE_URL: z
    .string()
    .url()
    .default("postgresql://docker:docker@localhost:5432/brevly"),

  // Cloudflare R2 (Valores fictícios para passar na validação)
  CLOUDFLARE_ACCOUNT_ID: z.string().default("fictitious-account-id"),
  CLOUDFLARE_ACCESS_KEY_ID: z.string().default("fictitious-access-key"),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string().default("fictitious-secret-key"),
  CLOUDFLARE_BUCKET: z.string().default("fictitious-bucket-name"),
  CLOUDFLARE_PUBLIC_URL: z.string().url().default("https://fictitious-url.com"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
