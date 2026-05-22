import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface CustomRequest extends Request {
    usuarioId?: number;
}

interface TokenPayload {
    id: number;
    iat: number;
    exp: number;
}
export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido!" });
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        return res.status(401).json({ erro: "Token mal formatado!" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as TokenPayload;

        req.usuarioId = payload.id;
        
        return next();
    } catch (erro: any) {
        return res.status(401).json({ erro: "Token inválido ou expirado!" })
    }
};