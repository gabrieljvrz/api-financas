import { z } from 'zod';

export const transacaoSchema = z.object({
    descricao: z.string({
        message: "A descrição é obrigatória e deve ser um texto válido!"
    }).min(3, "A descrição precisa ter pelo menos 3 caracteres!"),

    valor: z.number({
        message: "O valor é obrigatório e deve ser um número!"
    }).positive("O valor deve ser maior que zero!"),

    tipo: z.enum(['ENTRADA', 'SAIDA'], {
        message: "O tipo é obrigatório e deve ser 'ENTRADA' ou 'SAÍDA'!"
    }),

    data: z.string({
        message: "A data é obrigatória!"
    }).regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
        message: "A data deve estar em um formato ISO 8601 válido (ex: 2026-05-22T10:00:00Z)!"
    }),

    categoria: z.string({
        message: "A categoria deve ser um texto!"
    }).optional()
})