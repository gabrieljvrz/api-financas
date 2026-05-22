import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            return next();
        } catch (erro) {
            if (erro instanceof ZodError) {
                const zodErro = erro as ZodError<any>;

                const errosFormatados = zodErro.issues.map((err: any) => ({
                    campo: err.path.join('.'),
                    mensagem: err.message
                }));

                return res.status(400).json({ erros: errosFormatados });
            }

            return res.status(500).json({ erro: "Erro interno de validação" });
        }
    };
};