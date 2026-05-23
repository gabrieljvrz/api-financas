import { validate } from '../validate.middleware.js';
import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

describe('ValidateMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    const schemaFalso = z.object({
        nome: z.string({ message: "Nome é obrigatório" })
    });

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('deve chamar next() se os dados da requisição forem válidos segundo o schema', () => {
        req.body = { nome: 'Teste' };
        
        const middleware = validate(schemaFalso);
        middleware(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(res.status).not.toHaveBeenCalled();
    });

    it('deve interceptar a requisição e retornar erro 400 se os dados forem inválidos', () => {
        req.body = { nome: 123 }; 
        
        const middleware = validate(schemaFalso);
        middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 500 se ocorrer um erro inesperado (não-ZodError)', () => {
        req.body = { nome: 'Teste' };
        
        const schemaComDefeito = {
            parse: jest.fn().mockImplementation(() => {
                throw new Error("Erro catastrófico no sistema");
            })
        } as unknown as z.ZodTypeAny;

        const middleware = validate(schemaComDefeito);
        middleware(req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ erro: "Erro interno de validação" });
        expect(next).not.toHaveBeenCalled();
    });
});