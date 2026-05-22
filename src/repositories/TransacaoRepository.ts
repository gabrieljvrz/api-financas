import prisma from '../config/database.js';
import { Prisma } from '@prisma/client';

export class TransacaoRepository {
    async criar(dados: Prisma.TransacaoUncheckedCreateInput) {
        const transacao = await prisma.transacao.create({
            data: dados
        });

        return transacao;
    }

    async listarPorUsuario(
        usuarioId: number,
        skip: number,
        take: number,
        filtros?: Prisma.TransacaoWhereInput
    ) {
        const transacoes = await prisma.transacao.findMany({
            where: { 
                usuarioId, 
                ...filtros
            },
            skip,
            take,
            orderBy: { data: 'desc' }
        });

        const total = await prisma.transacao.count({
            where: {
                usuarioId,
                ...filtros
            }
        });

        return { transacoes, total };
    }

    async buscarPorId(id: number, usuarioId: number) {
        const transacao = await prisma.transacao.findFirst({
            where: { id, usuarioId }
        });

        return transacao;
    }

    async atualizar(id: number, dados: Prisma.TransacaoUpdateInput) {
        const transacao = await prisma.transacao.update({
            where: { id },
            data: dados
        });

        return transacao;
    }

    async deletar(id: number) {
        await prisma.transacao.delete({
            where: { id }
        });
    }

    async calcularResumo(usuarioId: number) {
        const resumo = await prisma.transacao.groupBy({
            by: ['tipo'],
            where: { usuarioId },
            _sum: {
                valor: true
            }
        });

        return resumo;
    }
}