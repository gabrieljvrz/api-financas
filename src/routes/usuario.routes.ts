import { Router } from 'express';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { UsuarioService} from '../services/UsuarioService.js';
import { UsuarioController } from '../controllers/UsuarioController.js';

const router = Router();

const usuarioRepository = new UsuarioRepository();

const usuarioService = new UsuarioService(usuarioRepository);

const usuarioController = new UsuarioController(usuarioService);

router.post('/', usuarioController.criar);

router.post('/login', usuarioController.login);

export default router;