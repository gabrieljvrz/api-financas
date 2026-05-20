import type { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService.js';

export class UsuarioController {
    constructor(private usuarioService: UsuarioService) {}

    criar = async (req: Request, res: Response) => {
        try {
            const { nome, email, senha } = req.body;

            const novoUsuario = await this.usuarioService.criar({ nome, email, senha });

            res.status(201).json(novoUsuario);
        } catch (erro: any) {
            console.error(erro);
            res.status(400).json({ erro: erro.message });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, senha } = req.body;

            const resultado = await this.usuarioService.login({ email, senha });

            return res.status(200).json(resultado);
            
        } catch (erro: any) {
            return res.status(401).json({ erro: erro.message });
        }
    }
}