import bcrypt from 'bcrypt';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { Prisma } from '@prisma/client';

export class UsuarioService {
    constructor(private usuarioRepository: UsuarioRepository) {}

    async criar(dados: Prisma.UsuarioCreateInput) {
        const email = dados.email;

        const emailExistente = await this.usuarioRepository.buscarPorEmail(email);

        if (emailExistente != null) {
            throw new Error("E-mail já cadastrado!");
        }

        const senhaHash = await bcrypt.hash(dados.senha, 10);

        const novoUsuario = {
            nome: dados.nome,
            email: dados.email,
            senha: senhaHash
        };

        const usuarioCriado = await this.usuarioRepository.criar(novoUsuario);

        const { senha, ...usuarioSemSenha } = usuarioCriado;
        return usuarioSemSenha;
    }
}