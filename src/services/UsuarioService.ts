import { env } from '../config/env.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/UsuarioRepository.js';
import { Prisma } from '@prisma/client';

export interface LoginDTO {
    email: string;
    senha: string;
}

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

    async login(dados: LoginDTO) {
        const usuario = await this.usuarioRepository.buscarPorEmail(dados.email);

        if (usuario === null) {
            throw new Error("Credenciais inválidas!");
        }

        const senhaValida = await bcrypt.compare(dados.senha, usuario.senha)
    
        if (!senhaValida) {
            throw new Error("Credenciais inválidas!");
        }

        const token = jwt.sign(
            { id: usuario.id }, 
            env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return { token };
    }
}