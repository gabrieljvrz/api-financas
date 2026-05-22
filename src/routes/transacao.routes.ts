import { Router } from 'express';
import { TransacaoRepository } from '../repositories/TransacaoRepository.js';
import { TransacaoService } from '../services/TransacaoService.js';
import { TransacaoController } from '../controllers/TransacaoController.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { transacaoSchema } from '../schemas/transacao.schema.js';

const router = Router();

const transacaoRepository = new TransacaoRepository();
const transacaoService = new TransacaoService(transacaoRepository);
const transacaoController = new TransacaoController(transacaoService);

router.post('/', authMiddleware, validate(transacaoSchema), transacaoController.criar);
router.get('/', authMiddleware, transacaoController.listar);
router.get('/:id', authMiddleware, transacaoController.buscarPorId);
router.put('/:id', authMiddleware, validate(transacaoSchema), transacaoController.atualizar);
router.delete('/:id', authMiddleware, transacaoController.deletar);

export default router;