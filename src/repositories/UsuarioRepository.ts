import prisma from '../config/database.js';
import { Prisma } from '@prisma/client';

export class UsuarioRepository {
    async buscarPorEmail (email: string) {
        const usuario = await prisma.usuario.findUnique({
            where: { email: email } 
        });

        return usuario;
    }

    async criar (dados: Prisma.UsuarioCreateInput) {
        const usuario = await prisma.usuario.create({
            data: dados
        });

        return usuario;
    }
}