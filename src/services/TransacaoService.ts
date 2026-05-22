import { TransacaoRepository } from "../repositories/TransacaoRepository.js";
import { Prisma } from '@prisma/client';

export class TransacaoService {
    constructor(private transacaoRepository: TransacaoRepository) {}

    async criar (dados: Prisma.TransacaoUncheckedCreateInput) {
        const valor = Number(dados.valor);

        if (valor <= 0) {
            throw new Error("O valor deve ser maior que zero!");
        }

        const transacaoCriada = await this.transacaoRepository.criar(dados);

        return transacaoCriada;
    }

    async listarPorUsuario(usuarioId: number) {
        const transacoes = await this.transacaoRepository.listarPorUsuario(usuarioId);

        return transacoes;
    }

    async buscarPorId(id: number, usuarioId: number) {
        const transacao = await this.transacaoRepository.buscarPorId(id, usuarioId);

        if (transacao === null) {
            throw new Error("Transação não encontrada ou acesso negado!");
        }

        return transacao;
    }

    async atualizar(id: number, usuarioId: number, dados: Prisma.TransacaoUpdateInput) {
        await this.buscarPorId(id, usuarioId);

        const transacaoAtualizada = await this.transacaoRepository.atualizar(id, dados);

        return transacaoAtualizada;
    }

    async deletar(id: number, usuarioId: number) {
        await this.buscarPorId(id, usuarioId);

        await this.transacaoRepository.deletar(id);
    }

    async calcularResumo(usuarioId: number) {
        const agrupamento = await this.transacaoRepository.calcularResumo(usuarioId);

        let totalEntradas = 0;
        let totalSaidas = 0;

        for (const grupo of agrupamento) {
            const soma = grupo._sum.valor ? Number(grupo._sum.valor) : 0;

            if (grupo.tipo === 'ENTRADA') {
                totalEntradas += soma;
            } else if (grupo.tipo === 'SAIDA') {
                totalSaidas += soma;
            }
        }

        const saldoAtual = totalEntradas - totalSaidas;

        return {
            totalEntradas,
            totalSaidas,
            saldoAtual
        };
    }
}