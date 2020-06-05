import { Request, Response } from 'express';

interface JsonError {
    error: string;
}

export function errorMiddleware(err: any, req: Request, res: Response) {
    console.error(err.message);

    if (!err.statusCode) {
        err.statusCode = 500;
    }

    res
        .status(err.statusCode)
        .json({ error: err.message } as JsonError);
}

export function notFoundMiddleware(req: Request, res: Response) {
    res.status(404).json({ error: 'Url not found' } as JsonError);
}