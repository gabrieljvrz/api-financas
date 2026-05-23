import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import usuarioRoutes from './routes/usuario.routes.js';
import transacaoRoutes from './routes/transacao.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync(new URL('../swagger.json', import.meta.url), 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/usuarios', usuarioRoutes);
app.use('/transacoes', transacaoRoutes);

app.listen(env.PORT, () => {
    console.log(`Servidor rodando na porta ${env.PORT}`);
    console.log(`Documentação disponível em: http://localhost:${env.PORT}/api-docs`);
});