// src/services/__tests__/TransacaoService.test.ts
import { TransacaoService } from '../TransacaoService.js';
import { TransacaoRepository } from '../../repositories/TransacaoRepository.js';

describe('TransacaoService', () => {
    let transacaoService: TransacaoService;
    let transacaoRepositoryMock: jest.Mocked<TransacaoRepository>;

    beforeEach(() => {
        transacaoRepositoryMock = {
            criar: jest.fn(),
            listarPorUsuario: jest.fn(),
            buscarPorId: jest.fn(),
            atualizar: jest.fn(),
            deletar: jest.fn(),
            calcularResumo: jest.fn(),
        } as unknown as jest.Mocked<TransacaoRepository>;

        transacaoService = new TransacaoService(transacaoRepositoryMock);
    });

    describe('criar()', () => {
        it('deve lançar erro se o valor da transação for menor ou igual a zero', async () => {
            const dadosTransacao = {
                descricao: 'Compra',
                valor: -50, 
                tipo: 'SAIDA' as const,
                usuarioId: 1
            };

            await expect(transacaoService.criar(dadosTransacao)).rejects.toThrow("O valor deve ser maior que zero!");
            expect(transacaoRepositoryMock.criar).not.toHaveBeenCalled();
        });

        it('deve criar uma transação com sucesso se os dados forem válidos', async () => {
            const dadosTransacao = {
                descricao: 'Salário',
                valor: 5000,
                tipo: 'ENTRADA' as const,
                usuarioId: 1
            };

            transacaoRepositoryMock.criar.mockResolvedValue({
                id: 1,
                ...dadosTransacao,
                categoria: 'OUTROS',
                status: 'PENDENTE',
                data: new Date()
            } as any);

            const resultado = await transacaoService.criar(dadosTransacao);

            expect(resultado).toHaveProperty('id');
            expect(resultado.valor).toBe(5000);
            expect(transacaoRepositoryMock.criar).toHaveBeenCalledTimes(1);
        });
    });

    describe('calcularResumo()', () => {
        it('deve calcular corretamente os totais e o saldo atual com entradas e saídas', async () => {
            const mockAgrupamento = [
                { tipo: 'ENTRADA', _sum: { valor: 15000 } },
                { tipo: 'SAIDA', _sum: { valor: 5000 } }
            ];
            transacaoRepositoryMock.calcularResumo.mockResolvedValue(mockAgrupamento as any);

            const resultado = await transacaoService.calcularResumo(1);

            expect(resultado.totalEntradas).toBe(15000);
            expect(resultado.totalSaidas).toBe(5000);
            expect(resultado.saldoAtual).toBe(10000); // 15000 - 5000
            expect(transacaoRepositoryMock.calcularResumo).toHaveBeenCalledWith(1);
            expect(transacaoRepositoryMock.calcularResumo).toHaveBeenCalledTimes(1);
        });

        it('deve retornar zeros quando o usuário não tiver transações registradas', async () => {
            transacaoRepositoryMock.calcularResumo.mockResolvedValue([]);

            const resultado = await transacaoService.calcularResumo(2);

            expect(resultado.totalEntradas).toBe(0);
            expect(resultado.totalSaidas).toBe(0);
            expect(resultado.saldoAtual).toBe(0);
        });

        it('deve tratar valores nulos retornados pelo banco de dados', async () => {
            transacaoRepositoryMock.calcularResumo.mockResolvedValue([
                { tipo: 'ENTRADA', _sum: { valor: null } }
            ] as any);

            const resultado = await transacaoService.calcularResumo(1);

            expect(resultado.totalEntradas).toBe(0);
        });

        it('deve tratar valores nulos para saídas retornados pelo banco de dados', async () => {
            transacaoRepositoryMock.calcularResumo.mockResolvedValue([
                { tipo: 'SAIDA', _sum: { valor: null } }
            ] as any);

            const resultado = await transacaoService.calcularResumo(1);
            expect(resultado.totalSaidas).toBe(0);
        });
    });

    describe('listarPorUsuario()', () => {
        it('deve listar transações com paginação padrão (página 1, limite 10) sem filtros de data', async () => {
            const mockTransacoes = [{ id: 1, descricao: 'Salário', valor: 5000 }];
            transacaoRepositoryMock.listarPorUsuario.mockResolvedValue({
                transacoes: mockTransacoes as any,
                total: 1
            });

            const resultado = await transacaoService.listarPorUsuario(1);

            expect(transacaoRepositoryMock.listarPorUsuario).toHaveBeenCalledWith(1, 0, 10, {});
            expect(resultado.dados).toEqual(mockTransacoes);
            expect(resultado.meta.total).toBe(1);
            expect(resultado.meta.paginaAtual).toBe(1);
            expect(resultado.meta.totalPaginas).toBe(1);
        });

        it('deve aplicar filtros de mês e ano corretamente convertendo para ISOString', async () => {
            transacaoRepositoryMock.listarPorUsuario.mockResolvedValue({
                transacoes: [],
                total: 0
            });

            await transacaoService.listarPorUsuario(1, 1, 10, 5, 2026);

            const dataInicial = new Date(2026, 4, 1).toISOString();
            const dataFinal = new Date(2026, 5, 1).toISOString();

            expect(transacaoRepositoryMock.listarPorUsuario).toHaveBeenCalledWith(
                1, 0, 10, 
                {
                    data: {
                        gte: dataInicial,
                        lt: dataFinal
                    }
                }
            );
        });
    });

    describe('buscarPorId()', () => {
        it('deve retornar a transação se ela existir e pertencer ao usuário', async () => {
            const mockTransacao = { id: 1, descricao: 'Teste', usuarioId: 1 };
            transacaoRepositoryMock.buscarPorId.mockResolvedValue(mockTransacao as any);

            const resultado = await transacaoService.buscarPorId(1, 1);

            expect(resultado).toEqual(mockTransacao);
            expect(transacaoRepositoryMock.buscarPorId).toHaveBeenCalledWith(1, 1);
        });

        it('deve lançar erro se a transação não for encontrada ou for de outro usuário', async () => {
            transacaoRepositoryMock.buscarPorId.mockResolvedValue(null);

            await expect(transacaoService.buscarPorId(99, 1))
                .rejects.toThrow("Transação não encontrada ou acesso negado!");
        });
    });

    describe('atualizar()', () => {
        it('deve atualizar a transação com sucesso', async () => {
            const mockTransacao = { id: 1, descricao: 'Teste', usuarioId: 1 };
            transacaoRepositoryMock.buscarPorId.mockResolvedValue(mockTransacao as any); 
            transacaoRepositoryMock.atualizar.mockResolvedValue({ ...mockTransacao, valor: 150 } as any);

            const resultado = await transacaoService.atualizar(1, 1, { valor: 150 });

            expect(resultado.valor).toBe(150);
            expect(transacaoRepositoryMock.atualizar).toHaveBeenCalledWith(1, { valor: 150 });
        });
    });

    describe('deletar()', () => {
        it('deve deletar a transação com sucesso', async () => {
            const mockTransacao = { id: 1, descricao: 'Teste', usuarioId: 1 };
            transacaoRepositoryMock.buscarPorId.mockResolvedValue(mockTransacao as any); 
            transacaoRepositoryMock.deletar.mockResolvedValue();

            await transacaoService.deletar(1, 1);

            expect(transacaoRepositoryMock.deletar).toHaveBeenCalledWith(1);
        });
    });
});