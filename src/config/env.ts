import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().url("A URL do banco de dados deve ser válida!"),
  JWT_SECRET: z.string().min(1, "O JWT_SECRET não pode estar vazio!"),
  PORT: z.coerce.number().default(3000),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Configuração de variáveis de ambiente inválida:');
  console.error(_env.error.format());
  
  process.exit(1); 
}

export const env = _env.data;