import { Request, Response } from 'express';

interface JsonError {
    error: string;
}

/** Handle application errors and send them as JSON object with message */
export function errorMiddleware(err: any, _: Request, res: Response, __: (data?: any) => void) {
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