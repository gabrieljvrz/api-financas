import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes.js';
import transacaoRoutes from './routes/transacao.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/', usuarioRoutes);
app.use('/transacoes', transacaoRoutes);

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});