import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes.js';
import transacaoRoutes from './routes/transacao.routes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const swaggerDocument = JSON.parse(fs.readFileSync(new URL('../swagger.json', import.meta.url), 'utf-8'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/usuarios', usuarioRoutes);
app.use('/transacoes', transacaoRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
});