import { authMiddleware } from '../auth.middleware.js';
import type { CustomRequest } from '../auth.middleware.js';
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('AuthMiddleware', () => {
    let req: Partial<CustomRequest>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('deve retornar erro 401 se o token não for fornecido', () => {
        authMiddleware(req as CustomRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ erro: "Token não fornecido!" });
        expect(next).not.toHaveBeenCalled(); 
    });

    it('deve retornar erro 401 se o token for mal formatado', () => {
        req.headers = { authorization: 'Bearer ' }; 

        authMiddleware(req as CustomRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ erro: "Token mal formatado!" });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 401 se o token for inválido ou expirado', () => {
        req.headers = { authorization: 'Bearer token_falso' };
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error("Token inválido");
        });

        authMiddleware(req as CustomRequest, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ erro: "Token inválido ou expirado!" });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve injetar o usuarioId no request e chamar next() se o token for válido', () => {
        req.headers = { authorization: 'Bearer token_verdadeiro' };
        const payloadMock = { id: 99, iat: 123, exp: 456 };
        (jwt.verify as jest.Mock).mockReturnValue(payloadMock);

        authMiddleware(req as CustomRequest, res as Response, next);

        expect(req.usuarioId).toBe(99); 
        expect(next).toHaveBeenCalledTimes(1); 
    });
});