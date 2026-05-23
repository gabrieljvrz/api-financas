import { UsuarioService } from '../UsuarioService.js';
import { UsuarioRepository } from '../../repositories/UsuarioRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UsuarioService', () => {
    let usuarioService: UsuarioService;
    let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;

    beforeEach(() => {
        usuarioRepositoryMock = {
            buscarPorEmail: jest.fn(),
            criar: jest.fn(),
        } as unknown as jest.Mocked<UsuarioRepository>;

        usuarioService = new UsuarioService(usuarioRepositoryMock);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('criar()', () => {
        it('deve criar um novo usuário com sucesso', async () => {
            const dadosEntrada = { nome: 'Teste', email: 'teste@teste.com', senha: '123' };
            const usuarioCriadoNoBanco = { id: 1, ...dadosEntrada, senha: 'hashed_password', criadoEm: new Date(), atualizadoEm: new Date() };
            
            usuarioRepositoryMock.buscarPorEmail.mockResolvedValue(null);
            usuarioRepositoryMock.criar.mockResolvedValue(usuarioCriadoNoBanco);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

            const resultado = await usuarioService.criar(dadosEntrada);

            expect(usuarioRepositoryMock.buscarPorEmail).toHaveBeenCalledWith('teste@teste.com');
            expect(usuarioRepositoryMock.criar).toHaveBeenCalledTimes(1);
            expect(resultado).not.toHaveProperty('senha'); 
            expect(resultado.nome).toBe('Teste');
        });

        it('deve lançar erro se o e-mail já estiver cadastrado', async () => {
            const dadosEntrada = { nome: 'Teste', email: 'duplicado@teste.com', senha: '123' };
            
            usuarioRepositoryMock.buscarPorEmail.mockResolvedValue({
                id: 1, nome: 'Existente', email: 'duplicado@teste.com', senha: 'abc', criadoEm: new Date(), atualizadoEm: new Date()
            });

            await expect(usuarioService.criar(dadosEntrada)).rejects.toThrow("E-mail já cadastrado!");
            expect(usuarioRepositoryMock.criar).not.toHaveBeenCalled();
        });
    });

    describe('login()', () => {
        it('deve retornar um token JWT quando as credenciais forem válidas', async () => {
            const mockUsuario = { id: 1, email: 'teste@teste.com', senha: 'hashed_password', nome: 'Teste', criadoEm: new Date(), atualizadoEm: new Date() };
            usuarioRepositoryMock.buscarPorEmail.mockResolvedValue(mockUsuario);
            
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            
            (jwt.sign as jest.Mock).mockReturnValue('fake_jwt_token');

            const resultado = await usuarioService.login({ email: 'teste@teste.com', senha: '123' });

            expect(resultado).toHaveProperty('token', 'fake_jwt_token');
            expect(bcrypt.compare).toHaveBeenCalledWith('123', 'hashed_password');
            expect(jwt.sign).toHaveBeenCalled();
        });

        it('deve lançar erro de credenciais inválidas se o e-mail não existir', async () => {
            usuarioRepositoryMock.buscarPorEmail.mockResolvedValue(null);

            await expect(usuarioService.login({ email: 'inexistente@teste.com', senha: '123' }))
                .rejects.toThrow("Credenciais inválidas!");
        });

        it('deve lançar erro de credenciais inválidas se a senha estiver incorreta', async () => {
            const mockUsuario = { id: 1, email: 'teste@teste.com', senha: 'hashed_password', nome: 'Teste', criadoEm: new Date(), atualizadoEm: new Date() };
            usuarioRepositoryMock.buscarPorEmail.mockResolvedValue(mockUsuario);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(usuarioService.login({ email: 'teste@teste.com', senha: 'senha_errada' }))
                .rejects.toThrow("Credenciais inválidas!");
        });
    });
});