import type { Response } from 'express';
import type { CustomRequest } from '../middlewares/auth.middleware.js';
import { TransacaoService } from '../services/TransacaoService.js';

export class TransacaoController {
    constructor(private transacaoService: TransacaoService) {}

    criar = async (req: CustomRequest, res: Response) => {
        try {
            const usuarioId = req.usuarioId!;

            const { descricao, valor, tipo, data, categoria } = req.body;

            const dados = {
                descricao,
                valor,
                tipo,
                data,
                categoria,
                usuarioId
            }

            const resultado = await this.transacaoService.criar(dados);

            return res.status(201).json(resultado);
        } catch (erro: any) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    listar = async (req: CustomRequest, res: Response) => {
        try {
            const usuarioId = req.usuarioId!;

            const pagina = req.query.page ? Number(req.query.page) : 1;
            const limite = req.query.limit ? Number(req.query.limit) : 10;
            const mes = req.query.mes ? Number(req.query.mes) : undefined;
            const ano = req.query.ano ? Number(req.query.ano) : undefined;

            const resultado = await this.transacaoService.listarPorUsuario(usuarioId, pagina, limite, mes, ano);

            return res.status(200).json(resultado)
        } catch (erro: any) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    buscarPorId = async (req: CustomRequest, res: Response) => {
        try {
            const usuarioId = req.usuarioId!;

            const id = Number(req.params.id);

            const resultado = await this.transacaoService.buscarPorId(id, usuarioId);

            return res.status(200).json(resultado)
        } catch (erro: any) {
            return res.status(404).json({ erro: erro.message });
        }
    }

    atualizar = async (req: CustomRequest, res: Response) => {
        try {
            const usuarioId = req.usuarioId!;
            const id = Number(req.params.id);
            const dados = req.body;

            const resultado = await this.transacaoService.atualizar(id, usuarioId, dados);

            return res.status(200).json(resultado);
        } catch (erro: any) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    deletar = async (req: CustomRequest, res: Response) => {
        try {
            const usuarioId = req.usuarioId!;
            const id = Number(req.params.id);

            await this.transacaoService.deletar(id, usuarioId);

            return res.status(204).send();
        } catch (erro: any) {
            return res.status(400).json({ erro: erro.message });
        }
    }

    obterResumo = async (req: CustomRequest, res: Response) => {
        try {
            const usuarioId = req.usuarioId!;

            const resultado = await this.transacaoService.calcularResumo(usuarioId);

            return res.status(200).json(resultado);
        } catch (erro: any) {
            return res.status(400).json({ erro: erro.message });
        }
    }
}