import prisma from '../src/config/database.js';
import bcrypt from 'bcrypt'; 

async function main() {
    const senhaHash = await bcrypt.hash('123456', 10);

    const usuario = await prisma.usuario.upsert({
        where: { email: 'admin@teste.com' },
        update: {}, 
        create: {
            nome: 'Administrador de Teste',
            email: 'admin@teste.com',
            senha: senhaHash,
            transacoes: {
                create: [
                    { descricao: 'Salário', valor: 8500, tipo: 'ENTRADA', data: new Date('2026-05-01T10:00:00Z'), categoria: 'ENTRADA' },
                    { descricao: 'Aluguel', valor: 2500, tipo: 'SAIDA', data: new Date('2026-05-05T10:00:00Z'), categoria: 'MORADIA' },
                    { descricao: 'Supermercado', valor: 1200, tipo: 'SAIDA', data: new Date('2026-05-10T10:00:00Z'), categoria: 'ALIMENTACAO' },
                    { descricao: 'Freelance', valor: 3000, tipo: 'ENTRADA', data: new Date('2026-05-15T10:00:00Z'), categoria: 'ENTRADA' }
                ]
            }
        }
    });

    console.log(`✅ Seed executado com sucesso! Usuário criado: ${usuario.email} | Senha: 123456`);
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });